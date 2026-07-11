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

-- workspace_members' own policies must not query workspace_members directly
-- inside their USING/WITH CHECK clauses (Postgres re-evaluates the same
-- policy on the inner query forever: "infinite recursion detected in policy
-- for relation workspace_members"). Routing the check through a SECURITY
-- DEFINER function bypasses RLS inside the function body and breaks the loop.
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = auth.uid() and role = 'Owner'
  );
$$;

create policy "members can view their workspaces" on public.workspaces
  for select using (public.is_workspace_member(id));
create policy "authenticated can create workspaces" on public.workspaces
  for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());
create policy "owner can update their workspace" on public.workspaces
  for update using (created_by = auth.uid());
create policy "owner can delete their workspace" on public.workspaces
  for delete using (created_by = auth.uid());

create policy "members can view workspace membership" on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));
create policy "self-join or owner invites" on public.workspace_members
  for insert with check (user_id = auth.uid() or public.is_workspace_owner(workspace_id));
create policy "self-leave or owner removes" on public.workspace_members
  for delete using (user_id = auth.uid() or public.is_workspace_owner(workspace_id));

-- Replace the old "any authenticated user" policies with workspace-scoped ones.
drop policy "authenticated read/write" on public.team_members;
drop policy "authenticated read/write" on public.projects;
drop policy "authenticated read/write" on public.tasks;
drop policy "authenticated read/write" on public.messages;

create policy "workspace members read/write" on public.team_members
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "workspace members read/write" on public.projects
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "workspace members read/write" on public.tasks
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "workspace members read/write" on public.messages
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
