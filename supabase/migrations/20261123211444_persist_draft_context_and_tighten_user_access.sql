-- Persist the context used to generate a reply so editing and reopening a draft
-- does not silently discard the user's outcome or constraints.
alter table public.drafts
  add column if not exists desired_outcome text not null default '',
  add column if not exists avoid text not null default '';

-- Restrict exposed-table access to signed-in users and enforce row ownership.
drop policy if exists "Users can insert own drafts" on public.drafts;
drop policy if exists "Users can view own drafts" on public.drafts;
drop policy if exists "Users can read own drafts" on public.drafts;
drop policy if exists "Users can update own drafts" on public.drafts;
drop policy if exists "Users can delete own drafts" on public.drafts;

create policy "Authenticated users can read own drafts"
  on public.drafts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Authenticated users can insert own drafts"
  on public.drafts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Authenticated users can update own drafts"
  on public.drafts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all privileges on table public.drafts from anon, authenticated;
grant select, insert on table public.drafts to authenticated;
grant update (original_message, situation, tone, generated_reply, desired_outcome, avoid)
  on table public.drafts to authenticated;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Authenticated users can read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

revoke all privileges on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

revoke all privileges on table public.gumroad_unmatched_sales from anon, authenticated;
