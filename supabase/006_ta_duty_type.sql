-- Run this ONCE in the Supabase SQL editor (after 003/004/005/005b).
-- Not run yet — this file was amended before you ran the first draft, so
-- there is nothing to undo; just run this version.
--
-- Gives you two independent, admin-set controls per TA (defaults preserve
-- today's behavior for every existing TA — full duty, 4h/week cap):
--
-- 1) office_hours_only  — if true, that TA cannot pick a tutorial seat at
--    all (checked server-side, not just hidden in the UI).
-- 2) oh_cap_hours        — that TA's own weekly office-hours cap, in hours
--    (was hardcoded to 4 for everyone). E.g. for a half TA you can pick
--    EITHER "4h office hours only" (office_hours_only = true, cap = 4)
--    OR "1 tutorial + 1h office hours" (office_hours_only = false, cap = 1)
--    — entirely your call per TA, from the admin panel.

alter table tas add column if not exists office_hours_only boolean not null default false;
alter table tas add column if not exists oh_cap_hours numeric not null default 4;

-- Same exact parameter signature as the original book_tutorial_seat (see
-- supabase/schedule_schema.sql), so this safely REPLACES it in place rather
-- than creating a stray overload (unlike the p_hour type change in 005,
-- which is why 005b had to DROP first — no type change here, so no risk).
create or replace function book_tutorial_seat(
  p_ta_id bigint, p_course text, p_slot_id bigint
) returns table(ok boolean, error text) language plpgsql as $$
declare
  v_new_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('tut_lock:' || p_course));

  if not exists (select 1 from tas where id = p_ta_id and course_code = p_course) then
    return query select false, 'invalid_ta'; return;
  end if;
  if exists (select 1 from tas where id = p_ta_id and office_hours_only) then
    return query select false, 'office_hours_only'; return;
  end if;
  if not exists (select 1 from tutorial_slots where id = p_slot_id and course_code = p_course) then
    return query select false, 'invalid_slot'; return;
  end if;
  if exists (select 1 from tutorial_bookings where ta_id = p_ta_id) then
    return query select false, 'already_holds_slot'; return;
  end if;

  insert into tutorial_bookings(slot_id, seat_no, ta_id)
  select p_slot_id, s, p_ta_id
  from generate_series(1, 2) s
  where not exists (select 1 from tutorial_bookings where slot_id = p_slot_id and seat_no = s)
  order by s
  limit 1
  returning tutorial_bookings.id into v_new_id;

  if v_new_id is null then
    return query select false, 'slot_full'; return;
  end if;

  return query select true, null::text;
end;
$$;

-- Same exact parameter signature as the numeric-p_hour version from 005, so
-- this REPLACES it in place — the only change is reading the TA's own
-- oh_cap_hours instead of the hardcoded "8 half-hour blocks = 4 hours".
create or replace function book_ta_office_hour(
  p_ta_id bigint, p_course text, p_day smallint, p_hour numeric
) returns table(ok boolean, error text) language plpgsql as $$
declare
  v_ta_count int;
  v_cap_hours numeric;
  v_new_id bigint;
begin
  if p_hour < 9 or p_hour >= 19 or (p_hour * 2) <> floor(p_hour * 2) then
    return query select false, 'outside_window'; return;
  end if;

  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  select oh_cap_hours into v_cap_hours from tas where id = p_ta_id and course_code = p_course;
  if v_cap_hours is null then
    return query select false, 'invalid_ta'; return;
  end if;

  if would_exceed_cap(p_course, p_day, p_hour, p_hour + 0.5, null, null, null) then
    return query select false, 'hour_full'; return;
  end if;

  -- each row is a 30-min block, so the cap in blocks is cap_hours * 2
  select count(*) into v_ta_count from ta_office_hours where ta_id = p_ta_id and course_code = p_course;
  if v_ta_count >= v_cap_hours * 2 then
    return query select false, 'ta_cap_reached'; return;
  end if;

  insert into ta_office_hours(course_code, ta_id, day_of_week, hour)
  values (p_course, p_ta_id, p_day, p_hour)
  on conflict do nothing
  returning ta_office_hours.id into v_new_id;

  if v_new_id is null then
    return query select false, 'already_booked'; return;
  end if;

  return query select true, null::text;
end;
$$;
