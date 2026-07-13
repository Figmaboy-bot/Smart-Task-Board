-- Backs the new onboarding wizard: a profiles table for the identity fields
-- collected on step 1, a workspace size column for step 2, and a storage
-- bucket for the profile photo uploaded on step 1.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  role text,
  avatar_url text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "user can manage own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

alter table public.workspaces add column size text
  check (size in ('Just Me', '2-10 people', '11-50 people', '50+'));

-- Public bucket (avatars are meant to be visible to teammates/anyone with
-- the URL) but writes are locked to a user's own folder, named by their uid.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "users can upload their own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can update their own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can delete their own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
