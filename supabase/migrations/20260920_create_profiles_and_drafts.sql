create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  original_message text not null,
  situation text not null,
  tone text not null,
  generated_reply text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_id_created_at_idx
  on public.drafts (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.drafts enable row level security;

-- Profiles are created automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Keep these policies explicit and limited to the authenticated user's rows.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can read own drafts" on public.drafts;
create policy "Users can read own drafts"
  on public.drafts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own drafts" on public.drafts;
create policy "Users can insert own drafts"
  on public.drafts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own drafts" on public.drafts;
create policy "Users can update own drafts"
  on public.drafts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own drafts" on public.drafts;
create policy "Users can delete own drafts"
  on public.drafts for delete
  to authenticated
  using (auth.uid() = user_id);
