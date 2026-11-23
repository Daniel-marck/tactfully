-- Make quota mutation server-only and enforce the free limit atomically.
-- The API route authenticates the user first, then calls this function with
-- the server-side service-role client and the authenticated user's ID.

drop function if exists public.increment_draft_count(uuid);

create function public.increment_draft_count(user_id uuid)
returns table(new_count integer, user_plan text, allowed boolean)
language plpgsql
security definer
set search_path = pg_catalog
as $function$
declare
  result_count integer;
  result_plan text;
  prior_date date;
begin
  if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'not authorized';
  end if;

  if user_id is null then
    raise exception 'user id is required';
  end if;

  select p.plan, p.draft_count, p.last_draft_date
    into result_plan, result_count, prior_date
  from public.profiles as p
  where p.id = user_id
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  if prior_date is distinct from current_date then
    result_count := 0;
  else
    result_count := coalesce(result_count, 0);
  end if;

  if result_plan is distinct from 'pro' and result_count >= 3 then
    return query select result_count, result_plan, false;
    return;
  end if;

  result_count := result_count + 1;

  update public.profiles
  set draft_count = result_count,
      last_draft_date = current_date,
      updated_at = now()
  where id = user_id;

  return query select result_count, result_plan, true;
end;
$function$;

revoke all on function public.increment_draft_count(uuid) from public, anon, authenticated;
grant execute on function public.increment_draft_count(uuid) to service_role;
