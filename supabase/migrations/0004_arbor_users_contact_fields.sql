-- Add the profile fields collected by the Arbor signup and profile flows.
-- Idempotent so it can be applied safely to databases that already have them.

alter table public.arbor_users
  add column if not exists gender text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists region text,
  add column if not exists postal_code text,
  add column if not exists country text;
