-- 0014 gave each message a single attachment (attachment_url/name/type/size).
-- Users need to send more than one file per message, so those flat columns
-- become a JSON array instead. Existing single-attachment rows are folded
-- into the new array before the old columns are dropped.
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

alter table public.messages add column attachments jsonb not null default '[]'::jsonb;

update public.messages
set attachments = jsonb_build_array(
  jsonb_build_object(
    'url', attachment_url,
    'name', attachment_name,
    'type', attachment_type,
    'size', attachment_size
  )
)
where attachment_url is not null;

alter table public.messages drop column attachment_url;
alter table public.messages drop column attachment_name;
alter table public.messages drop column attachment_type;
alter table public.messages drop column attachment_size;
