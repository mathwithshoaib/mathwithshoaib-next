-- Run this ONCE in the Supabase SQL editor (after 014).
--
-- Three tables for the "Check Your Results" feature:
--
-- exam_results_settings — one row per course. `active` controls whether the
-- results box shows at all; `exam` says which exam's results it's currently
-- serving (flip this + re-import before releasing each new exam's marks,
-- same pattern as exam_seating_settings).
--
-- exam_results — one row per student per exam: name, section, venue, and
-- every score column from the results sheet. A student only ever sees
-- their OWN row.
--
-- student_pins — one row per student per COURSE (not per exam), so the
-- same PIN a student sets for Mid-1 keeps working for Mid-2 and Final.
-- Doubles as the attempt-tracking table for both stages of the "Check Your
-- Results" flow:
--   verify_attempts    — Stage 1 (name+venue), capped at 3, permanent until
--                        an admin resets it (see the admin reset-verification
--                        route) — this is a one-time identity check, not
--                        something a student repeats often, so a hard cap
--                        makes sense.
--   pin_fail_attempts / pin_locked_until — Stage 2 (PIN), a rolling
--                        throttle instead of a permanent lock, since a
--                        legitimate student will enter their PIN many times
--                        across 3 exams over months.

create table if not exists exam_results_settings (
  course_code  text primary key,
  active       boolean not null default false,
  exam         text,
  instructions text,
  updated_at   timestamptz not null default now()
);

create table if not exists exam_results (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  exam         text not null,
  roll_number  text not null,
  student_name text not null,
  section      text not null,
  venue        text not null,
  mcqs_marks   text,
  q2           text,
  q3           text,
  q4           text,
  bonus        text,
  bonus_total  text,
  total        text,
  created_at   timestamptz not null default now(),
  unique (course_code, exam, roll_number)
);
create index if not exists exam_results_lookup_idx on exam_results(course_code, exam, roll_number);

create table if not exists student_pins (
  course_code       text not null,
  roll_number       text not null,
  pin_hash          text,
  pin_salt          text,
  pin_set_at        timestamptz,
  verify_attempts   integer not null default 0,
  pin_fail_attempts integer not null default 0,
  pin_locked_until  timestamptz,
  updated_at        timestamptz not null default now(),
  primary key (course_code, roll_number)
);

alter table exam_results_settings enable row level security;
alter table exam_results enable row level security;
alter table student_pins enable row level security;
revoke all on exam_results_settings, exam_results, student_pins from anon, authenticated;

-- Atomic attempt-counters — plain read-then-write from the app server would
-- let two concurrent requests both read "2 attempts" and both proceed,
-- effectively granting a 4th try. These do the read+increment in one
-- statement so the cap actually holds under concurrent attempts.

create or replace function increment_verify_attempts(p_course_code text, p_roll_number text)
returns integer
language sql
as $$
  insert into student_pins (course_code, roll_number, verify_attempts)
  values (p_course_code, p_roll_number, 1)
  on conflict (course_code, roll_number)
  do update set verify_attempts = student_pins.verify_attempts + 1, updated_at = now()
  returning verify_attempts;
$$;

-- Increments the PIN-fail counter; once it reaches p_max_attempts, locks
-- the account for p_lockout_minutes and resets the counter for the next
-- window. Returns the row so the caller knows whether it just got locked.
create or replace function register_pin_failure(p_course_code text, p_roll_number text, p_max_attempts integer, p_lockout_minutes integer)
returns table (pin_fail_attempts integer, pin_locked_until timestamptz)
language plpgsql
as $$
declare
  v_attempts integer;
begin
  update student_pins
  set pin_fail_attempts = student_pins.pin_fail_attempts + 1, updated_at = now()
  where course_code = p_course_code and roll_number = p_roll_number
  returning student_pins.pin_fail_attempts into v_attempts;

  if v_attempts >= p_max_attempts then
    update student_pins
    set pin_fail_attempts = 0, pin_locked_until = now() + make_interval(mins => p_lockout_minutes)
    where course_code = p_course_code and roll_number = p_roll_number;
  end if;

  return query
    select student_pins.pin_fail_attempts, student_pins.pin_locked_until
    from student_pins
    where course_code = p_course_code and roll_number = p_roll_number;
end;
$$;
