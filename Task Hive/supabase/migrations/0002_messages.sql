-- Adds a single shared team channel: one message stream every authenticated
-- user in the workspace posts to and reads from, consistent with the
-- single-shared-workspace model used by team_members/projects/tasks.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id),
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Single shared workspace: any authenticated user can read/write everything.
-- The guest user in this app is a local-only fake session (never a real
-- Supabase-authenticated user), so it is blocked by these policies by
-- construction rather than needing an explicit carve-out.
create policy "authenticated read/write" on public.messages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Required for the Messages page's live-update subscription.
alter publication supabase_realtime add table public.messages;
