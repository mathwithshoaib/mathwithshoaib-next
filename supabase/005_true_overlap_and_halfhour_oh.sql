-- Run this ONCE in the Supabase SQL editor (after 003/004).
--
-- Fixes two things:
--
-- 1) The 2-per-hour cap was checked per hour-BUCKET ("does this item touch
--    9am-10am at all?"), not per true time overlap. That meant a lecture
--    ending 9:15 and a different one starting 9:30 — never simultaneous —
--    both counted as "occupying 9am", wrongly blocking a 3rd (the TA) from
--    booking that hour even though nothing is ever actually 3-deep at any
--    instant. Replaced with a real interval-overlap check.
--
-- 2) TA office hours move from 1-hour blocks to 30-minute blocks (more
--    options to fit into gaps), and `hour` now holds a half-hour-aligned
--    start time (e.g. 9, 9.5, 10 ...) instead of a whole hour.

alter table ta_office_hours alter column hour type numeric using hour::numeric;

-- ─── Replaces count_items_at_hour/admin_can_place: true time-overlap check ───
-- "Would adding an item spanning [p_start,p_end) push simultaneous
-- concurrency above 2?" — true if some OTHER two existing items are both
-- overlapping each other AND overlapping the candidate window.

create or replace function would_exceed_cap(
  p_course text, p_day smallint, p_start numeric, p_end numeric,
  p_exclude_fixed_event_id bigint default null,
  p_exclude_tutorial_slot_id bigint default null,
  p_exclude_ta_oh_id bigint default null
) returns boolean language sql stable as $$
  with items as (
    select 'fixed'::text as kind, id, start_hour as s, end_hour as e
      from fixed_events
      where course_code = p_course and day_of_week = p_day
        and start_hour < p_end and end_hour > p_start
        and (p_exclude_fixed_event_id is null or id <> p_exclude_fixed_event_id)
    union all
    select 'tutorial', id, start_hour, end_hour
      from tutorial_slots
      where course_code = p_course and day_of_week = p_day
        and start_hour < p_end and end_hour > p_start
        and (p_exclude_tutorial_slot_id is null or id <> p_exclude_tutorial_slot_id)
    union all
    select 'ta_oh', id, hour, hour + 0.5
      from ta_office_hours
      where course_code = p_course and day_of_week = p_day
        and hour < p_end and (hour + 0.5) > p_start
        and (p_exclude_ta_oh_id is null or id <> p_exclude_ta_oh_id)
  )
  select exists (
    select 1 from items a join items b
      on (a.kind <> b.kind or a.id <> b.id)
    where a.s < b.e and b.s < a.e                                   -- a truly overlaps b
      and greatest(a.s, b.s, p_start) < least(a.e, b.e, p_end)      -- ...and that overlap falls within the candidate window
  );
$$;

create or replace function admin_upsert_fixed_event(
  p_id bigint, p_course text, p_category text, p_day smallint,
  p_start numeric, p_end numeric, p_title text, p_person text, p_location text
) returns table(ok boolean, error text, id bigint) language plpgsql as $$
declare
  v_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if would_exceed_cap(p_course, p_day, p_start, p_end, p_id, null, null) then
    return query select false, 'hour_cap_exceeded', null::bigint;
    return;
  end if;

  if p_id is null then
    insert into fixed_events(course_code, category, day_of_week, start_hour, end_hour, title, person_name, location)
    values (p_course, p_category, p_day, p_start, p_end, p_title, p_person, p_location)
    returning fixed_events.id into v_id;
  else
    update fixed_events set
      category = p_category, day_of_week = p_day, start_hour = p_start, end_hour = p_end,
      title = p_title, person_name = p_person, location = p_location
    where fixed_events.id = p_id
    returning fixed_events.id into v_id;
  end if;

  return query select true, null::text, v_id;
end;
$$;

create or replace function admin_upsert_tutorial_slot(
  p_id bigint, p_course text, p_day smallint, p_start numeric, p_end numeric, p_location text
) returns table(ok boolean, error text, id bigint) language plpgsql as $$
declare
  v_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if would_exceed_cap(p_course, p_day, p_start, p_end, null, p_id, null) then
    return query select false, 'hour_cap_exceeded', null::bigint;
    return;
  end if;

  if p_id is null then
    insert into tutorial_slots(course_code, day_of_week, start_hour, end_hour, location)
    values (p_course, p_day, p_start, p_end, p_location)
    returning tutorial_slots.id into v_id;
  else
    update tutorial_slots set
      day_of_week = p_day, start_hour = p_start, end_hour = p_end, location = p_location
    where tutorial_slots.id = p_id
    returning tutorial_slots.id into v_id;
  end if;

  return query select true, null::text, v_id;
end;
$$;

-- p_hour must be a half-hour-aligned start time (9, 9.5, 10, ...) within
-- [9, 19) — TAs can't book office hours before 9am or at/after 7pm,
-- regardless of the grid's own display range.
create or replace function book_ta_office_hour(
  p_ta_id bigint, p_course text, p_day smallint, p_hour numeric
) returns table(ok boolean, error text) language plpgsql as $$
declare
  v_ta_count int;
  v_new_id bigint;
begin
  if p_hour < 9 or p_hour >= 19 or (p_hour * 2) <> floor(p_hour * 2) then
    return query select false, 'outside_window'; return;
  end if;

  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if not exists (select 1 from tas where id = p_ta_id and course_code = p_course) then
    return query select false, 'invalid_ta'; return;
  end if;

  if would_exceed_cap(p_course, p_day, p_hour, p_hour + 0.5, null, null, null) then
    return query select false, 'hour_full'; return;
  end if;

  -- 8 half-hour blocks = 4 hours/week
  select count(*) into v_ta_count from ta_office_hours where ta_id = p_ta_id and course_code = p_course;
  if v_ta_count >= 8 then
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
