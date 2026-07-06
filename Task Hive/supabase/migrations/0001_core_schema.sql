-- Core schema for Task Hive: team_members, projects, tasks.
-- Single shared workspace: any authenticated user can read/write everything.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null default 'Member',
  status text not null default 'Invited' check (status in ('Active','Suspended','Invited')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  due_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'To-Do' check (status in ('To-Do','In Progress','Done')),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  tag text,
  assignee_name text,
  due_date date,
  links jsonb not null default '[]',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Single shared workspace: any authenticated user can read/write everything.
-- The guest user in this app is a local-only fake session (never a real
-- Supabase-authenticated user), so it is blocked by these policies by
-- construction rather than needing an explicit carve-out.
create policy "authenticated read/write" on public.team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on public.projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on public.tasks
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
