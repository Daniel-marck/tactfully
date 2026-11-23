-- Let signed-in users edit only their own saved drafts.
-- Restrict writable columns so a client cannot reassign ownership or rewrite IDs/timestamps.
drop policy if exists "Users can update own drafts" on public.drafts;
create policy "Users can update own drafts"
  on public.drafts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke update on table public.drafts from anon, authenticated;
grant update (original_message, situation, tone, generated_reply)
  on table public.drafts to authenticated;
