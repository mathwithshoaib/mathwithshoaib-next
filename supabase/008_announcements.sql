-- Run this ONCE in the Supabase SQL editor (after 003/004/005/005b/006/007).
--
-- New table only — nothing here touches any existing table, column, or
-- function, so it's safe to run immediately even before the announcements
-- feature is live on the site (the table just sits empty/unused until the
-- frontend code that reads it is deployed).

create table if not exists announcements (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  title        text not null,
  message      text not null,
  type         text not null default 'info' check (type in ('info', 'warning', 'urgent')),
  deadline     timestamptz,          -- optional; when set, the site shows a live countdown
                                      -- and auto-escalates to "urgent" styling as it nears
  pinned       boolean not null default false,  -- pinned announcements sort first
  active       boolean not null default true,   -- admin can hide without deleting
  created_at   timestamptz not null default now()
);
create index if not exists announcements_course_idx on announcements(course_code);

alter table announcements enable row level security;
revoke all on announcements from anon, authenticated;
