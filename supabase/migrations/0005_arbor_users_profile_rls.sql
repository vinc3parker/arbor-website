-- Shared Arbor profiles are stored in public.arbor_users.  The row is created
-- by the auth-user trigger, then completed by the signed-in user after email
-- confirmation.  Keep access strictly scoped to the matching auth.uid().

alter table public.arbor_users enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on table public.arbor_users to authenticated;

drop policy if exists "arbor_users select own" on public.arbor_users;
create policy "arbor_users select own"
  on public.arbor_users for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "arbor_users insert own" on public.arbor_users;
create policy "arbor_users insert own"
  on public.arbor_users for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "arbor_users update own" on public.arbor_users;
create policy "arbor_users update own"
  on public.arbor_users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
