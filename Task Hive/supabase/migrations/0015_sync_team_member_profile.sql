-- Settings (and the onboarding profile step) only ever write to `profiles`;
-- nothing kept a user's `team_members` rows (the ones the Teams table
-- actually renders) in sync, so an uploaded avatar or edited name never
-- showed up there. This adds a trigger so every future profiles update
-- propagates, plus a one-off backfill for rows created before this existed.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create or replace function public.sync_team_member_from_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_email text;
  full_name text;
begin
  select email into member_email from auth.users where id = new.id;
  if member_email is null then
    return new;
  end if;

  full_name := nullif(trim(coalesce(new.first_name, '') || ' ' || coalesce(new.last_name, '')), '');

  update public.team_members
  set avatar_url = coalesce(new.avatar_url, avatar_url),
      name = coalesce(full_name, name)
  where email = member_email;

  return new;
end;
$$;

drop trigger if exists sync_team_member_from_profile on public.profiles;
create trigger sync_team_member_from_profile
after update on public.profiles
for each row
execute function public.sync_team_member_from_profile();

-- Backfill: only touch rows the trigger hasn't had a chance to fix yet
-- (missing avatar and/or still on the email-handle placeholder name).
update public.team_members tm
set avatar_url = coalesce(tm.avatar_url, p.avatar_url),
    name = coalesce(
      nullif(trim(coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')), ''),
      tm.name
    )
from public.profiles p
join auth.users u on u.id = p.id
where tm.email = u.email
  and (tm.avatar_url is null or tm.avatar_url = '');
