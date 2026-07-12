-- Required for the real-time "task assigned to you" toast popup: only
-- `messages` was added to the realtime publication before now (0002).
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

alter publication supabase_realtime add table public.tasks;
