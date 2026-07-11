-- Turns the single shared workspace into real multi-tenant workspaces.
-- Every existing table (team_members, projects, tasks, messages) is scoped
-- to a workspace, and RLS is rewritten so a row is only visible to members
-- of its workspace instead of any authenticated user.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'Member' check (role in ('Owner', 'Member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

alter table public.team_members add column workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.projects add column workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.tasks add column workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.messages add column workspace_id uuid references public.workspaces(id) on delete cascade;

-- Backfill: create a default workspace, enroll every existing auth user as a
-- member so nobody loses access, and attach all pre-existing rows to it so
-- nothing already in the database becomes orphaned by the new
-- workspace-scoped policies below.
do $$
declare
  default_workspace_id uuid;
begin
  insert into public.workspaces (name) values ('Design Team') returning id into default_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  select default_workspace_id, id, 'Member' from auth.users
  on conflict do nothing;

  update public.team_members set workspace_id = default_workspace_id where workspace_id is null;
  update public.projects set workspace_id = default_workspace_id where workspace_id is null;
  update public.tasks set workspace_id = default_workspace_id where workspace_id is null;
  update public.messages set workspace_id = default_workspace_id where workspace_id is null;
end $$;

alter table public.team_members alter column workspace_id set not null;
alter table public.projects alter column workspace_id set not null;
alter table public.tasks alter column workspace_id set not null;
alter table public.messages alter column workspace_id set not null;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy "members can view their workspaces" on public.workspaces
  for select using (
    id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );
create policy "authenticated can create workspaces" on public.workspaces
  for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());
create policy "owner can update their workspace" on public.workspaces
  for update using (created_by = auth.uid());
create policy "owner can delete their workspace" on public.workspaces
  for delete using (created_by = auth.uid());

create policy "members can view workspace membership" on public.workspace_members
  for select using (
    workspace_id in (select workspace_id from public.workspace_members wm where wm.user_id = auth.uid())
  );
create policy "self-join or owner invites" on public.workspace_members
  for insert with check (
    user_id = auth.uid()
    or workspace_id in (select workspace_id from public.workspace_members wm where wm.user_id = auth.uid() and wm.role = 'Owner')
  );
create policy "self-leave or owner removes" on public.workspace_members
  for delete using (
    user_id = auth.uid()
    or workspace_id in (select workspace_id from public.workspace_members wm where wm.user_id = auth.uid() and wm.role = 'Owner')
  );

-- Replace the old "any authenticated user" policies with workspace-scoped ones.
drop policy "authenticated read/write" on public.team_members;
drop policy "authenticated read/write" on public.projects;
drop policy "authenticated read/write" on public.tasks;
drop policy "authenticated read/write" on public.messages;

create policy "workspace members read/write" on public.team_members
  for all
  using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()))
  with check (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));
create policy "workspace members read/write" on public.projects
  for all
  using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()))
  with check (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));
create policy "workspace members read/write" on public.tasks
  for all
  using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()))
  with check (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));
create policy "workspace members read/write" on public.messages
  for all
  using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()))
  with check (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));
