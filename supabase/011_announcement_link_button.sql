-- Run this ONCE in the Supabase SQL editor (after 008-010).
--
-- Lets any single announcement carry an optional link + button — e.g. the
-- "Midterm 1" announcement can point straight at /courses/calc1-fa26/exams
-- with a "View exam details" button, or a future "Syllabus posted"
-- announcement can link directly to the PDF. Purely additive; existing
-- announcements are unaffected (button hidden by default).

alter table announcements add column if not exists link_url text;
alter table announcements add column if not exists link_label text;
alter table announcements add column if not exists show_button boolean not null default false;
