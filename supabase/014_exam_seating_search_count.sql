-- Run this ONCE in the Supabase SQL editor (after 013).
--
-- Tracks how many times the public "Find Your Seat" search has been
-- submitted (every attempt, found or not) — just a running count for the
-- admin panel, reset by hand before the next exam if you want a fresh
-- count per exam. Incremented atomically via the function below so
-- concurrent searches during a busy few minutes before an exam can't
-- race and undercount each other (a plain read-then-write from the app
-- server would be subject to exactly that race).

alter table exam_seating_settings add column if not exists search_count bigint not null default 0;

create or replace function increment_exam_seating_search_count(p_course_code text)
returns bigint
language sql
as $$
  update exam_seating_settings
  set search_count = search_count + 1
  where course_code = p_course_code
  returning search_count;
$$;
