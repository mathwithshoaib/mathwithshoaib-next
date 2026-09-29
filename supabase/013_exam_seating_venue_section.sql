-- Run this ONCE in the Supabase SQL editor (after 012).
--
-- The real roster sheet comes as Number / Name / ID / Section / Venue /
-- Seat No. — this aligns the table with it: `room` is renamed to `venue`
-- to match, and a new `section` column is added (3, 4, or 5) so it can be
-- shown alongside the venue and seat. Also adds exam_date/exam_time to
-- exam_seating_settings so the confirmation screen can show "Sunday, 4
-- October 2026 · 6:30pm-9pm" alongside the venue/seat — the same for
-- every student for a given exam, so it lives on the settings row rather
-- than being repeated per student row.
--
-- No rows exist yet in exam_seating for this term, so the rename is a
-- straight, lossless swap — nothing to migrate.

alter table exam_seating rename column room to venue;
alter table exam_seating add column if not exists section text;

alter table exam_seating_settings add column if not exists exam_date text;
alter table exam_seating_settings add column if not exists exam_time text;
