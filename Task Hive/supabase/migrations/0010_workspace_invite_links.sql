-- Shareable workspace invite links: anyone who opens the link and signs in
-- can join, as an alternative to the email-targeted workspace_invites.
-- Redemption goes through a SECURITY DEFINER function so the raw table
-- doesn't need to be exposed to non-members - the token itself is the
-- credential, validated (not revoked / not expired / under max uses) and
-- consumed server-side.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.workspace_invite_links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  role text not null default 'Member' check (role in ('Owner', 'Member')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  max_uses integer,
  use_count integer not null default 0,
  revoked boolean not null default false
);

alter table public.workspace_invite_links enable row level security;

create policy "owner can manage invite links" on public.workspace_invite_links
  for all
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

create or replace function public.redeem_invite_link(_token text)
returns table (workspace_id uuid, workspace_name text)
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
