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
