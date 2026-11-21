-- Tactfully MVP: usage metering and profile privilege hardening.
-- Safe to apply after 20260920_create_profiles_and_drafts.sql.

alter table public.profiles
  add column if not exists draft_count integer not null default 0,
  add column if not exists last_draft_date date,
  add column if not exists paypal_order_id text;

alter table public.profiles
  drop constraint if exists profiles_draft_count_nonnegative;

alter table public.profiles
  add constraint profiles_draft_count_nonnegative check (draft_count >= 0);

-- A user may read their own profile, but must never be able to promote
-- their own account by updating profiles.plan from a browser client.
drop policy if exists "Users can update own profile" on public.profiles;

create or replace function public.increment_draft_count(p_user_id uuid)
returns table (
  allowed boolean,
  new_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Not authorized to update another user profile'
      using errcode = '42501';
  end if;

  update public.profiles as p
  set
    draft_count = case
      when p.last_draft_date = current_date then p.draft_count + 1
      else 1
    end,
    last_draft_date = current_date,
    updated_at = now()
  where p.id = p_user_id
    and (
      p.plan = 'pro'
      or p.last_draft_date is distinct from current_date
      or p.draft_count < 3
    )
  returning p.draft_count into v_count;

  if found then
    return query select true, v_count;
    return;
  end if;

  select p.draft_count
    into v_count
  from public.profiles as p
  where p.id = p_user_id;

  if not found then
    raise exception 'Profile not found'
      using errcode = 'P0002';
  end if;

  return query select false, coalesce(v_count, 0);
end;
$$;

revoke all on function public.increment_draft_count(uuid) from public;
grant execute on function public.increment_draft_count(uuid) to authenticated;

comment on column public.profiles.draft_count is
  'Number of AI generations used on the current UTC database date.';
comment on column public.profiles.last_draft_date is
  'UTC database date on which draft_count was last incremented.';
