-- Run this ONCE in the Supabase SQL editor (after 003-009).
--
-- Two new tables for the "Find Your Seat" search that appears in the
-- announcements pop-up when switched on:
--
-- exam_seating_settings — one row per course. `active` controls whether the
-- search button shows at all; `exam` says which exam's roster it's
-- currently searching (so you flip this to the next exam's name and
-- re-import fresh rows before each of the 3 exams); `instructions` is the
-- common text (arrival time, ID required, etc.) shown under every result.
--
-- exam_seating — one row per student per exam: roll number (normalized
-- upper/trimmed for exact-match lookup), name, room, seat number. A
-- student only ever sees their OWN row — the public lookup endpoint takes
-- a roll number and returns just that one match, never the full roster.

create table if not exists exam_seating_settings (
  course_code  text primary key,
  active       boolean not null default false,
  exam         text,
  instructions text,
  updated_at   timestamptz not null default now()
);

create table if not exists exam_seating (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  exam         text not null,
  roll_number  text not null,
  student_name text not null,
  room         text not null,
  seat_number  text not null,
  created_at   timestamptz not null default now(),
  unique (course_code, exam, roll_number)
);
create index if not exists exam_seating_lookup_idx on exam_seating(course_code, exam, roll_number);

alter table exam_seating_settings enable row level security;
alter table exam_seating enable row level security;
revoke all on exam_seating_settings, exam_seating from anon, authenticated;
