-- Run this ONCE in the Supabase SQL editor (after 015).
--
-- Same counter as 014 added for the seating search, but for results:
-- tracks every attempted "check my results" lookup (whether it leads to
-- the PIN stage, the verify stage, or not-found), reset by hand before
-- the next exam if you want a fresh count per exam. Incremented
-- atomically via the function below so concurrent lookups can't race
-- and undercount each other.

alter table exam_results_settings add column if not exists search_count bigint not null default 0;

create or replace function increment_exam_results_search_count(p_course_code text)
returns bigint
language sql
as $$
  update exam_results_settings
  set search_count = search_count + 1
  where course_code = p_course_code
  returning search_count;
$$;
