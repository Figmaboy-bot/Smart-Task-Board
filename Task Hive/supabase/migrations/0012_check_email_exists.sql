-- Lets the unauthenticated auth-entry screen branch between "new user" (OTP
-- signup) and "returning user" (password login) without exposing auth.users
-- directly - the raw table isn't queryable pre-login, so this goes through a
-- SECURITY DEFINER function that only ever returns a boolean.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create or replace function public.check_email_exists(p_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users where lower(email) = lower(p_email)
  );
$$;

grant execute on function public.check_email_exists(text) to anon, authenticated;
