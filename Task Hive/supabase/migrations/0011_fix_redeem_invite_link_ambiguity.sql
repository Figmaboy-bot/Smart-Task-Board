-- Fixes a bug in redeem_invite_link (0010): its OUT parameters were named
-- workspace_id/workspace_name, which collide with the bare "workspace_id"
-- column list in "on conflict (workspace_id, user_id)" - PL/pgSQL can't
-- tell whether that's the OUT variable or the table column, and raises
-- "column reference \"workspace_id\" is ambiguous" (42702) at call time.
-- Renaming the OUT parameters removes the collision.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

-- CREATE OR REPLACE can't change a function's OUT-parameter row type, so the
-- old signature has to be dropped first.
drop function if exists public.redeem_invite_link(text);

create or replace function public.redeem_invite_link(_token text)
returns table (out_workspace_id uuid, out_workspace_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  link record;
begin
  select * into link from public.workspace_invite_links l
    where l.token = _token and not l.revoked
      and (l.expires_at is null or l.expires_at > now())
      and (l.max_uses is null or l.use_count < l.max_uses)
    limit 1;

  if link is null then
    raise exception 'This invite link is invalid or has expired.';
  end if;

  insert into public.workspace_members (workspace_id, user_id, email, role)
  values (link.workspace_id, auth.uid(), (select u.email from auth.users u where u.id = auth.uid()), link.role)
  on conflict (workspace_id, user_id) do nothing;

  update public.workspace_invite_links set use_count = use_count + 1 where id = link.id;

  insert into public.team_members (workspace_id, name, email, role, status)
  select link.workspace_id, split_part(u.email, '@', 1), u.email, 'Member', 'Active'
  from auth.users u
  where u.id = auth.uid()
    and not exists (
      select 1 from public.team_members tm
      where tm.workspace_id = link.workspace_id and tm.email = u.email
    );

  return query select w.id, w.name from public.workspaces w where w.id = link.workspace_id;
end;
$$;

grant execute on function public.redeem_invite_link(text) to authenticated;
