-- Run this ONCE in the Supabase SQL editor (after schedule_schema.sql).
--
-- Single roster for instructors and TFs, shared by the course page (Teaching
-- Team) and the schedule admin panel (so "who's teaching this lecture /
-- running this recitation" is picked from one list instead of retyped in
-- multiple places and risking a name drifting out of sync). TAs already have
-- their own `tas` table (they need login/booking identity, which
-- instructors/TFs don't).

create table if not exists course_staff (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  role         text not null check (role in ('instructor','tf')),
  name         text not null,
  email        text,
  office       text,
  created_at   timestamptz not null default now()
);
create index if not exists course_staff_course_idx on course_staff(course_code);

alter table course_staff enable row level security;
revoke all on course_staff from anon, authenticated;
