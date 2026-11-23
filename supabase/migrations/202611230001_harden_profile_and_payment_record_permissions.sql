-- Profile entitlements and counters are server-managed only.
-- Users may read their own profile, but must not be able to self-promote or
-- modify billing identifiers, draft counters, or plan status.
drop policy if exists "Users can update own profile" on public.profiles;

revoke all privileges on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

-- Unmatched payment records are processed exclusively by trusted server code.
revoke all privileges on table public.gumroad_unmatched_sales from anon, authenticated;
