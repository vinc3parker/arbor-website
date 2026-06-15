-- Arbor shared user schema — canonical personal info lives on public.arbor_users.
-- Additive and idempotent: safe to run on your existing database.
-- Supersedes 0001_profiles.sql and 0002_profile_fields.sql (the `profiles`
-- table was a placeholder and is removed here). Run in the Supabase SQL editor.

-- 1. Remove the obsolete `profiles` placeholder (if it was ever created) -----
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.set_profiles_updated_at();
drop table if exists public.profiles cascade;

-- 2. Extend arbor_users with the shared profile fields ----------------------
alter table public.arbor_users
  add column if not exists last_name text,
  add column if not exists date_of_birth date,
  add column if not exists subscription_tier text not null default 'free';

-- Constrain subscription_tier to known values (guarded so re-runs are safe).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'arbor_users_subscription_tier_check'
  ) then
    alter table public.arbor_users
      add constraint arbor_users_subscription_tier_check
      check (subscription_tier in ('free', 'beta_tester'));
  end if;
end $$;

-- 3. Row Level Security: a user can only see / edit their own row -----------
alter table public.arbor_users enable row level security;

drop policy if exists "arbor_users select own" on public.arbor_users;
create policy "arbor_users select own"
  on public.arbor_users for select
  using (auth.uid() = id);

drop policy if exists "arbor_users insert own" on public.arbor_users;
create policy "arbor_users insert own"
  on public.arbor_users for insert
  with check (auth.uid() = id);

drop policy if exists "arbor_users update own" on public.arbor_users;
create policy "arbor_users update own"
  on public.arbor_users for update
  using (auth.uid() = id);

-- 4. Auto-create an arbor_users row when a new auth user signs up -----------
create or replace function public.handle_new_arbor_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.arbor_users (id, email, first_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'first_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_arbor on auth.users;
create trigger on_auth_user_created_arbor
  after insert on auth.users
  for each row execute function public.handle_new_arbor_user();

-- 5. Keep updated_at fresh on every change ----------------------------------
create or replace function public.set_arbor_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists arbor_users_set_updated_at on public.arbor_users;
create trigger arbor_users_set_updated_at
  before update on public.arbor_users
  for each row execute function public.set_arbor_users_updated_at();
