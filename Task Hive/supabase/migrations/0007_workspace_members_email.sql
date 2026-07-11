-- Adds email to workspace_members so the manage-members view can display who
-- each member actually is. The client can't join against auth.users directly
-- (no public view, and RLS wouldn't let you read a stranger's row anyway), so
-- each member's own email is captured on their own insert instead.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

alter table public.workspace_members add column email text;

update public.workspace_members wm
set email = u.email
from auth.users u
where wm.user_id = u.id and wm.email is null;
