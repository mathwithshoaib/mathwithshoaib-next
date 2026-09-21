-- Run this ONCE in the Supabase SQL editor (after 011).
--
-- Lets an announcement's deadline be shown as prominent formatted date/time
-- text on the card itself (e.g. "Oct 4, 2026 · 6:30 PM" for an exam
-- announcement), instead of only the small countdown line. Purely
-- additive; existing announcements are unaffected (hidden by default).

alter table announcements add column if not exists show_deadline boolean not null default false;
