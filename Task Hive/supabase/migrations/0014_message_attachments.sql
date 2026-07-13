-- Lets messages carry a file (image, doc, or audio) alongside or instead of
-- body text. Mirrors the avatars bucket pattern from 0013: public read (the
-- URL itself is the access control, same as avatars), writes scoped to a
-- path prefixed by the workspace_id so only members of that workspace can
-- upload into it.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

alter table public.messages add column attachment_url text;
alter table public.messages add column attachment_name text;
alter table public.messages add column attachment_type text;
alter table public.messages add column attachment_size bigint;

insert into storage.buckets (id, name, public)
values ('message-attachments', 'message-attachments', true)
on conflict (id) do nothing;

create policy "message attachments are publicly accessible" on storage.objects
  for select using (bucket_id = 'message-attachments');

create policy "workspace members can upload message attachments" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'message-attachments'
    and public.is_workspace_member((storage.foldername(name))[1]::uuid)
  );

create policy "workspace members can delete message attachments" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'message-attachments'
    and public.is_workspace_member((storage.foldername(name))[1]::uuid)
  );
