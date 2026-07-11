-- Real per-user settings, replacing the Settings page's local-only cosmetic
-- state. One row per user (preferences follow the person, not a workspace).
-- Run this once via the Supabase dashboard SQL editor (or `supabase db push`).

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notify_assigned boolean not null default true,
  notify_due_date boolean not null default true,
  notify_task_completed boolean not null default false,
  notify_mentions boolean not null default true,
  notify_project_updates boolean not null default false,
  notify_new_team_members boolean not null default true,
  delivery_push boolean not null default true,
  delivery_email boolean not null default false,
  delivery_in_app boolean not null default true,
  default_priority text not null default 'Medium' check (default_priority in ('Low', 'Medium', 'High')),
  hide_completed_tasks boolean not null default false,
  silence_non_urgent boolean not null default false,
  block_reassignment_focus boolean not null default false,
  timezone text not null default 'UTC',
  date_format text not null default 'MM/DD/YYYY' check (date_format in ('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD')),
  time_format text not null default '24-hour' check (time_format in ('24-hour', '12-hour')),
  language text not null default 'English',
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "user can manage own preferences" on public.user_preferences
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
