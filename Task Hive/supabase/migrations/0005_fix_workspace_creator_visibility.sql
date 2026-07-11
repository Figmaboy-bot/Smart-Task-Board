-- Fixes "Failed to create workspace" (403): creating a workspace inserts the
-- workspaces row and asks Postgres to return it immediately, but the
-- corresponding workspace_members row (which the workspaces SELECT policy
-- checks) isn't inserted until a separate follow-up request. At the moment
-- of the insert-and-return, the creator isn't a "member" yet by the old
-- policy's definition, so RLS blocked the read-back. Letting the creator see
-- rows they created themselves closes that gap without weakening anything else.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

drop policy "members can view their workspaces" on public.workspaces;
create policy "members can view their workspaces" on public.workspaces
  for select using (public.is_workspace_member(id) or created_by = auth.uid());
