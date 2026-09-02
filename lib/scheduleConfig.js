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
