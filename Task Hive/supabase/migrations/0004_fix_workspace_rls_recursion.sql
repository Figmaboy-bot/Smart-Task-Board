-- Fixes "infinite recursion detected in policy for relation
-- workspace_members": its own select/insert/delete policies queried
-- workspace_members from within their own USING/WITH CHECK clauses, which
-- makes Postgres re-evaluate the same policy forever. The fix is to do the
-- membership/ownership check inside a SECURITY DEFINER function, which
-- bypasses RLS internally and breaks the recursive loop.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

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

drop policy "members can view workspace membership" on public.workspace_members;
drop policy "self-join or owner invites" on public.workspace_members;
drop policy "self-leave or owner removes" on public.workspace_members;

create policy "members can view workspace membership" on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));
create policy "self-join or owner invites" on public.workspace_members
  for insert with check (user_id = auth.uid() or public.is_workspace_owner(workspace_id));
create policy "self-leave or owner removes" on public.workspace_members
  for delete using (user_id = auth.uid() or public.is_workspace_owner(workspace_id));

-- Route every other workspace-scoped table through the same helper for
-- consistency (functionally equivalent to the inline subqueries they used
-- before, since those only ever recursed through workspace_members).
drop policy "members can view their workspaces" on public.workspaces;
create policy "members can view their workspaces" on public.workspaces
  for select using (public.is_workspace_member(id));

drop policy "workspace members read/write" on public.team_members;
create policy "workspace members read/write" on public.team_members
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

drop policy "workspace members read/write" on public.projects;
create policy "workspace members read/write" on public.projects
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

drop policy "workspace members read/write" on public.tasks;
create policy "workspace members read/write" on public.tasks
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

drop policy "workspace members read/write" on public.messages;
create policy "workspace members read/write" on public.messages
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
