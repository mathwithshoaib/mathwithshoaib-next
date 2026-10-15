// app/explore/rootRushEngine.js
//
// Pure game logic for Root Rush — no DOM, no React, nothing that can't run
// in plain Node. Kept separate from the component so the attempt reducer
// and the leaderboard aggregation can both be exercised directly by a
// verification script (see the PR this shipped in) the same way the other
// Explore activities' math was checked before publishing.

// Each level's `minSteps` was found by BFS over the reachable integer state
// space (0..60) and independently re-verified by script — see
// verify_rootrush equivalent. Taking sqrt of a non-perfect-square can never
// return to an exact integer, so it's a dead end, never part of an optimal
// path; BFS (and this reducer) both treat it as legal but simply useless.
export const DIFFICULTIES = ['easy', 'medium', 'hard'];

export const LEVELS = {
  easy: [
    { start: 0, target: 2, minSteps: 11 },
    { start: 2, target: 10, minSteps: 3 },
    { start: 10, target: 14, minSteps: 9 },
  ],
  medium: [
    { start: 0, target: 8, minSteps: 13 },
    { start: 8, target: 14, minSteps: 9 },
    { start: 14, target: 3, minSteps: 10 },
  ],
  hard: [
    { start: 0, target: 2, minSteps: 8 },
    { start: 2, target: 8, minSteps: 6 },
    { start: 8, target: 3, minSteps: 9 },
  ],
};

// Button color is tied to the operation itself, constant across every
// difficulty theme (per spec) — kept here so both the engine and the UI
// agree on which operations exist per difficulty.
export const OPERATIONS = {
  plus5: { id: 'plus5', label: '+5', apply: (x) => x + 5, color: 'teal' },
  plus7: { id: 'plus7', label: '+7', apply: (x) => x + 7, color: 'orange' },
  plus9: { id: 'plus9', label: '+9', apply: (x) => x + 9, color: 'gold' },
  times3: { id: 'times3', label: '×3', apply: (x) => x * 3, color: 'pink' },
  sqrt: { id: 'sqrt', label: '√', apply: (x) => Math.sqrt(x), color: 'purple' },
};

export const OPS_BY_DIFFICULTY = {
  easy: ['plus5', 'plus7', 'sqrt'],
  medium: ['plus5', 'plus7', 'sqrt'],
  hard: ['plus5', 'plus9', 'times3', 'sqrt'],
};

export const LIMIT = 60;
const EPS = 1e-9;

export function isSolved(value, target) {
  return Math.abs(value - target) < EPS;
}
export function isOverLimit(value) {
  return value > LIMIT + EPS;
}
export function isIntegerValue(value) {
  return Math.abs(value - Math.round(value)) < EPS;
}

// ─── attempt reducer ────────────────────────────────────────────────────
// `trail` is both the displayed path (e.g. "2 → 7 → 16 → 4") and the undo
// history in one: Undo just pops the last entry. `steps` only increments on
// an operation press — Undo deliberately never changes it (per spec), so
// spamming Undo can't be used to search for free.

export function initAttempt(start, attemptNum) {
  return { trail: [start], steps: 0, phase: 'active', attemptNum };
}

export function applyOperation(state, opId, target) {
  if (state.phase !== 'active') return state;
  const op = OPERATIONS[opId];
  if (!op) return state;
  const current = state.trail[state.trail.length - 1];
  const next = op.apply(current);
  const steps = state.steps + 1;
  const trail = [...state.trail, next];
  if (isOverLimit(next)) return { ...state, trail, steps, phase: 'failed' };
  if (isSolved(next, target)) return { ...state, trail, steps, phase: 'solved' };
  return { ...state, trail, steps, phase: 'active' };
}

export function undoLast(state) {
  if (state.phase !== 'active' || state.trail.length <= 1) return state;
  return { ...state, trail: state.trail.slice(0, -1) };
}

export function restartAttempt(state, start) {
  return initAttempt(start, state.attemptNum + 1);
}

// ─── leaderboard aggregation ────────────────────────────────────────────
// Input: every row for one (difficulty, level), in any order. A "row" is
// { deviceId, playerName, steps, timeMs, createdAt (ISO string or Date) }.
// Output: groups sorted by steps ascending (rank order); within a group,
// the first achiever (earliest createdAt) is `first`, the rest are in
// `others` — matching "FIRST player who achieved it is shown, +N others,
// see all who solved it in X steps, in the order they achieved it".

export function bestPerPlayer(rows) {
  const byDevice = new Map();
  for (const r of rows) {
    const existing = byDevice.get(r.deviceId);
    const rTime = new Date(r.createdAt).getTime();
    if (!existing) { byDevice.set(r.deviceId, r); continue; }
    const eTime = new Date(existing.createdAt).getTime();
    if (r.steps < existing.steps) byDevice.set(r.deviceId, r);
    else if (r.steps === existing.steps && rTime < eTime) byDevice.set(r.deviceId, r);
  }
  return [...byDevice.values()];
}

export function aggregateLeaderboard(rows) {
  const bests = bestPerPlayer(rows);
  bests.sort((a, b) => a.steps - b.steps || new Date(a.createdAt) - new Date(b.createdAt));
  const groups = [];
  for (const b of bests) {
    const last = groups[groups.length - 1];
    if (last && last.steps === b.steps) last.entries.push(b);
    else groups.push({ steps: b.steps, entries: [b] });
  }
  return groups.map((g) => ({
    steps: g.steps,
    first: g.entries[0],
    othersCount: g.entries.length - 1,
    all: g.entries,
  }));
}

// ─── misc small helpers ─────────────────────────────────────────────────

export function formatValue(value) {
  return isIntegerValue(value) ? String(Math.round(value)) : value.toFixed(4);
}

export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// A short, best-effort blocklist — not exhaustive, just enough to catch the
// obvious cases on a casual educational site (substring match, case-insensitive).
const BLOCKED_SUBSTRINGS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'piss',
  'nigger', 'nigga', 'fag', 'retard', 'whore', 'slut', 'rape',
];
export function hasBlockedWord(name) {
  const lower = name.toLowerCase();
  return BLOCKED_SUBSTRINGS.some((w) => lower.includes(w));
}

export function makeDeviceId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // fall through to the manual fallback
  }
  return 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
