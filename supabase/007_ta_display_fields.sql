-- Run this ONCE in the Supabase SQL editor (after 003/004/005/005b/006).
--
-- Two purely COSMETIC fields for the Teaching Team display on the course
-- page: an optional contact email, and an optional free-text "duty tag"
-- (e.g. "Full TA", "Half TA", "Volunteer TA") shown next to a TA's name.
--
-- Neither column is read by any booking/scheduling RPC (book_ta_office_hour,
-- book_tutorial_seat, would_exceed_cap, etc.) — the actual tutorial-
-- eligibility and weekly-hours-cap logic added in 006 (office_hours_only /
-- oh_cap_hours) is completely untouched by this migration. This is just
-- new, nullable columns for the course page to show; nothing existing
-- changes behavior.

alter table tas add column if not exists email text;
alter table tas add column if not exists duty_tag text;
