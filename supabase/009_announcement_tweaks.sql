-- Run this ONCE in the Supabase SQL editor (after 008_announcements.sql).
--
-- Two small, additive tweaks to the announcements table:
-- 1) message becomes optional — a title-only heads-up (e.g. "Webwork 3 is
--    open") shouldn't require padding out a message just to satisfy a
--    NOT NULL constraint.
-- 2) category — a free-text topic tag (e.g. "Exam", "Webwork", "Problem
--    Sheet"), separate from `type` (which drives the info/warning/urgent
--    color and is auto-escalated near a deadline).

alter table announcements alter column message drop not null;
alter table announcements add column if not exists category text;
