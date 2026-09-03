-- Run this ONCE in the Supabase SQL editor (after schedule_schema.sql).
--
-- Per-calendar-date venue data for the recurring tutorial slots. The 8
-- tutorial_slots rows are the recurring weekly pattern (e.g. "Monday
-- 2:30-4pm"); THIS table is what actually varies week to week — the real
-- room booked for each specific date, whether a session even happens that
-- date (holidays/breaks), and a free-text note for anything flagged.

create table if not exists tutorial_slot_venues (
  id           bigint generated always as identity primary key,
  slot_id      bigint not null references tutorial_slots(id) on delete cascade,
  class_date   date not null,
  has_session  boolean not null default true,
  venue        text,
  notes        text,
  created_at   timestamptz not null default now(),
  unique (slot_id, class_date)
);
create index if not exists tutorial_slot_venues_date_idx on tutorial_slot_venues(class_date);

alter table tutorial_slot_venues enable row level security;
revoke all on tutorial_slot_venues from anon, authenticated;
