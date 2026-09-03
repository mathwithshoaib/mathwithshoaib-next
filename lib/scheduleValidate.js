// lib/scheduleValidate.js — shared input validation + RPC error-code -> plain
// English mapping, reused across the admin and TA API routes.

export const FIXED_CATEGORIES = ['lecture', 'instructor_oh', 'recitation'];

export function validateDayTime(day, start, end) {
  const d = Number(day);
  if (!Number.isInteger(d) || d < 0 || d > 4) return 'Day must be Mon(0)–Fri(4).';
  const s = Number(start), e = Number(end);
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 'End time must be after start time.';
  return null;
}

export function validateFixedEvent(body) {
  if (!FIXED_CATEGORIES.includes(body.category)) return 'Invalid category.';
  const dt = validateDayTime(body.day, body.start, body.end);
  if (dt) return dt;
  if (!body.title || typeof body.title !== 'string') return 'Title is required.';
  return null;
}

export function validateTutorialSlot(body) {
  return validateDayTime(body.day, body.start, body.end);
}

// Every error code the RPC functions in supabase/schedule_schema.sql can
// return, mapped to a message safe to show directly to a TA or to you.
export const RPC_ERROR_MESSAGES = {
  hour_cap_exceeded:
    'That would put more than 2 items in the same hour somewhere in this range. Pick a different time, or remove something else first.',
  hour_full: 'That slot already has 2 things scheduled at the same time — pick a different slot.',
  ta_cap_reached: "You've already booked your 4 office hours this week. Remove one first to book a different slot.",
  outside_window: 'Office hours can only be booked between 9am and 7pm.',
  already_booked: 'You already have that hour booked.',
  already_holds_slot: 'You already hold a tutorial slot — leave it first if you want to switch.',
  slot_full: 'Someone just took that seat — pick a different slot.',
  invalid_ta: 'Your session looks invalid — please log in again.',
  invalid_slot: "That tutorial slot doesn't exist.",
};

export function rpcErrorMessage(code) {
  return RPC_ERROR_MESSAGES[code] || 'That action could not be completed. Please try again.';
}
