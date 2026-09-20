// lib/scheduleConfig.js
// Shared constants for the live schedule feature. `COURSE_CODE` is the only
// offering wired to a page today, but every table carries a course_code
// column so a second offering can reuse this schema without a redesign.

export const COURSE_CODE = 'calc1-fa26';

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const CATEGORY_LABELS = {
  lecture: 'Lecture',
  instructor_oh: 'Instructor OH',
  recitation: 'TF Recitation',
  tutorial: 'Tutorial',
  ta_oh: 'TA Office Hours',
};

// TAs can only book office hours in this window, in 30-minute blocks,
// regardless of the grid's own (wider) display range — enforced both here
// (for the UI) and again in the book_ta_office_hour() RPC (source of truth).
export const TA_OH_WINDOW = { start: 9, end: 19 };
export const TA_OH_SLOT_MINUTES = 30;
export const TA_OH_WEEKLY_CAP_HOURS = 4;

// An announcement with a deadline auto-escalates to "urgent" (red, with a
// live countdown) once it's within this many hours of its deadline,
// regardless of the type the admin originally picked — and stays "urgent"
// for this many hours *after* the deadline too (e.g. "due 3h ago"), before
// sliding into the collapsed "Past announcements" archive.
export const ANNOUNCEMENT_URGENT_WINDOW_HOURS = 48;
export const ANNOUNCEMENT_ARCHIVE_GRACE_HOURS = 48;

// Hard cutoff for the whole announcements feature (popup + floating bell),
// independent of any individual announcement — this course offering runs
// through Fall 2026 only, so there's no reason to keep surfacing course
// announcements to visitors after the term is over. Bump this if the
// course continues into a later term; the admin panel itself is unaffected
// either way (it's session-gated, not date-gated).
export const ANNOUNCEMENTS_FEATURE_END = '2027-01-01T00:00:00';
