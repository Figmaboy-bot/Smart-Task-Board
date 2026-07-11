-- Real team invites: inviting someone from the Teams page now creates a
-- pending invite tied to their email. When that person signs up or logs in
-- with a matching email, the app auto-joins them to the workspace as a real
-- workspace_members row, granting actual access instead of just adding a
-- decorative name to the roster.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'Member' check (role in ('Owner', 'Member')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (workspace_id, email)
);

alter table public.workspace_invites enable row level security;

-- The invited person needs to see their own pending invite before they're a
-- member (so the client can find and accept it), on top of the normal
-- "existing members can see invites for their workspace" case.
create policy "members can view workspace invites" on public.workspace_invites
  for select using (
    public.is_workspace_member(workspace_id) or email = (auth.jwt() ->> 'email')
  );
create policy "owner can create workspace invites" on public.workspace_invites
  for insert with check (public.is_workspace_owner(workspace_id));
create policy "owner can delete workspace invites" on public.workspace_invites
  for delete using (public.is_workspace_owner(workspace_id));
create policy "invited user can accept" on public.workspace_invites
  for update
  using (email = (auth.jwt() ->> 'email'))
  with check (email = (auth.jwt() ->> 'email'));
