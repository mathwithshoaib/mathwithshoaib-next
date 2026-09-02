-- ═══════════════════════════════════════════════════════════════════════════
-- Live weekly schedule — MATH 101 Calculus-1 (Non-SSE) FA26
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- against the same project already used for `course_reviews`.
--
-- Everything here is reached ONLY through Next.js API routes using the
-- service-role key (server-side only). RLS is enabled with NO policies on
-- every table below, so the public anon key (used elsewhere in this app for
-- course_reviews) cannot read or write any of this, even by accident.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── TABLES ──────────────────────────────────────────────────────────────

create table if not exists schedule_settings (
  course_code text primary key,
  start_hour  numeric not null,
  end_hour    numeric not null,
  updated_at  timestamptz not null default now()
);

create table if not exists fixed_events (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  category     text not null check (category in ('lecture','instructor_oh','recitation')),
  day_of_week  smallint not null check (day_of_week between 0 and 4), -- 0=Mon .. 4=Fri
  start_hour   numeric not null,
  end_hour     numeric not null check (end_hour > start_hour),
  title        text not null,
  person_name  text,
  location     text,
  created_at   timestamptz not null default now()
);
create index if not exists fixed_events_course_idx on fixed_events(course_code);

create table if not exists tutorial_slots (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  day_of_week  smallint not null check (day_of_week between 0 and 4),
  start_hour   numeric not null,
  end_hour     numeric not null check (end_hour > start_hour),
  location     text,
  created_at   timestamptz not null default now()
);
create index if not exists tutorial_slots_course_idx on tutorial_slots(course_code);

create table if not exists tas (
  id             bigint generated always as identity primary key,
  course_code    text not null,
  name           text not null,
  passcode_hash  text not null,
  passcode_salt  text not null,
  created_at     timestamptz not null default now()
);
create index if not exists tas_course_idx on tas(course_code);

create table if not exists tutorial_bookings (
  id          bigint generated always as identity primary key,
  slot_id     bigint not null references tutorial_slots(id) on delete cascade,
  seat_no     smallint not null check (seat_no in (1,2)),
  ta_id       bigint not null references tas(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (slot_id, seat_no),
  unique (ta_id) -- a TA can hold exactly one tutorial slot, DB-enforced
);

create table if not exists ta_office_hours (
  id           bigint generated always as identity primary key,
  course_code  text not null,
  ta_id        bigint not null references tas(id) on delete cascade,
  day_of_week  smallint not null check (day_of_week between 0 and 4),
  hour         int not null,
  created_at   timestamptz not null default now(),
  unique (course_code, ta_id, day_of_week, hour)
);
create index if not exists ta_office_hours_cell_idx on ta_office_hours(course_code, day_of_week, hour);

-- ─── LOCK DOWN (RLS, no policies -> only the service-role key can touch these) ───

alter table schedule_settings  enable row level security;
alter table fixed_events       enable row level security;
alter table tutorial_slots     enable row level security;
alter table tas                enable row level security;
alter table tutorial_bookings  enable row level security;
alter table ta_office_hours    enable row level security;

revoke all on schedule_settings, fixed_events, tutorial_slots, tas, tutorial_bookings, ta_office_hours
  from anon, authenticated;

-- ─── HELPER: how many items (any category) currently cover this hour cell? ───
-- p_exclude_* let admin edits exclude the row being edited from its own count.

create or replace function count_items_at_hour(
  p_course text, p_day smallint, p_hour int,
  p_exclude_fixed_event_id bigint default null,
  p_exclude_tutorial_slot_id bigint default null
) returns int language sql stable as $$
  select
    (select count(*) from fixed_events
       where course_code = p_course and day_of_week = p_day
         and start_hour < p_hour + 1 and end_hour > p_hour
         and (p_exclude_fixed_event_id is null or id <> p_exclude_fixed_event_id))
  + (select count(*) from tutorial_slots
       where course_code = p_course and day_of_week = p_day
         and start_hour < p_hour + 1 and end_hour > p_hour
         and (p_exclude_tutorial_slot_id is null or id <> p_exclude_tutorial_slot_id))
  + (select count(*) from ta_office_hours
       where course_code = p_course and day_of_week = p_day and hour = p_hour)
$$;

-- ─── HELPER: would placing an item spanning [p_start,p_end) fit under the cap? ───

create or replace function admin_can_place(
  p_course text, p_day smallint, p_start numeric, p_end numeric,
  p_exclude_fixed_event_id bigint default null,
  p_exclude_tutorial_slot_id bigint default null
) returns boolean language plpgsql stable as $$
declare
  h int;
begin
  for h in select generate_series(floor(p_start)::int, ceil(p_end)::int - 1) loop
    if count_items_at_hour(p_course, p_day, h, p_exclude_fixed_event_id, p_exclude_tutorial_slot_id) >= 2 then
      return false;
    end if;
  end loop;
  return true;
end;
$$;

-- ─── RPC: admin create/update a fixed event (lecture / instructor OH / recitation) ───

create or replace function admin_upsert_fixed_event(
  p_id bigint, p_course text, p_category text, p_day smallint,
  p_start numeric, p_end numeric, p_title text, p_person text, p_location text
) returns table(ok boolean, error text, id bigint) language plpgsql as $$
declare
  v_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if not admin_can_place(p_course, p_day, p_start, p_end, p_id, null) then
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

-- ─── RPC: admin create/update a tutorial slot definition ───

create or replace function admin_upsert_tutorial_slot(
  p_id bigint, p_course text, p_day smallint, p_start numeric, p_end numeric, p_location text
) returns table(ok boolean, error text, id bigint) language plpgsql as $$
declare
  v_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if not admin_can_place(p_course, p_day, p_start, p_end, null, p_id) then
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

-- ─── RPC: TA books a 1-hour office-hour block ───

create or replace function book_ta_office_hour(
  p_ta_id bigint, p_course text, p_day smallint, p_hour int
) returns table(ok boolean, error text) language plpgsql as $$
declare
  v_ta_count int;
  v_new_id bigint;
begin
  perform pg_advisory_xact_lock(hashtext('cap_lock:' || p_course));

  if not exists (select 1 from tas where id = p_ta_id and course_code = p_course) then
    return query select false, 'invalid_ta'; return;
  end if;

  if count_items_at_hour(p_course, p_day, p_hour) >= 2 then
    return query select false, 'hour_full'; return;
  end if;

  select count(*) into v_ta_count from ta_office_hours where ta_id = p_ta_id and course_code = p_course;
  if v_ta_count >= 4 then
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

-- ─── RPC: TA books an open seat in a tutorial slot ───

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

-- ─── Seed the default grid hour range for this course (8:00 AM – 7:00 PM) ───
-- No other data is seeded — lectures, OH, recitations, tutorial slots, and
-- the TA roster are all added live through the admin panel.

insert into schedule_settings (course_code, start_hour, end_hour)
values ('calc1-fa26', 8, 19)
on conflict (course_code) do nothing;
