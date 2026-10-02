// app/explore/activities.js
//
// Single source of truth for the Explore hub. The hub grid, filter chips,
// "coming next" strip, "play next" suggestions, and generateStaticParams
// for /explore/[slug] all read from this file. Add a new entry here and a
// matching component in app/explore/activities/ + app/explore/registry.js
// to bring an activity live.

export const CATEGORIES = [
  { key: 'games',   label: 'Games',        color: 'var(--amber)',  tint: 'var(--amber-lt)',  icon: '🎲' },
  { key: 'sims',     label: 'Simulations',  color: 'var(--violet)', tint: 'var(--violet-lt)', icon: '🔬' },
  { key: 'puzzles',  label: 'Puzzles',      color: 'var(--teal)',   tint: 'var(--teal-lt)',   icon: '🧩' },
  { key: 'art',      label: 'Art',          color: 'var(--rose)',   tint: 'var(--rose-lt)',   icon: '🎨' },
  { key: 'paradox',  label: 'Paradoxes',    color: 'var(--navy)',   tint: 'var(--navy-lt)',   icon: '♾️' },
];

export const ACTIVITIES = [
  {
    slug: 'nim',
    title: 'Nim',
    hook: 'Remove objects from piles — but the winning move hides in binary.',
    category: 'games',
    minutes: 5,
    difficulty: 'medium',
    status: 'live',
    addedOn: '2026-10-02',
    badge: null,
    course: null,
  },
  {
    slug: 'paper-folding',
    title: 'Paper Folding to the Moon',
    hook: 'Fold a sheet enough times and the stack blows past the Moon.',
    category: 'paradox',
    minutes: 3,
    difficulty: 'easy',
    status: 'live',
    addedOn: '2026-10-02',
    badge: null,
    course: null,
  },
  {
    slug: 'birthday-paradox',
    title: 'Birthday Paradox',
    hook: 'How few people need to be in a room before two share a birthday?',
    category: 'paradox',
    minutes: 4,
    difficulty: 'medium',
    status: 'soon',
    addedOn: null,
    badge: null,
    course: null,
  },
  {
    slug: 'game-of-life',
    title: "Conway's Game of Life",
    hook: 'A grid of cells, four rules, and endless emergent patterns.',
    category: 'sims',
    minutes: 10,
    difficulty: 'medium',
    status: 'soon',
    addedOn: null,
    badge: null,
    course: null,
  },
  {
    slug: 'islamic-pattern-maker',
    title: 'Islamic Pattern Maker',
    hook: 'Build geometric star patterns from simple rotational symmetry.',
    category: 'art',
    minutes: 8,
    difficulty: 'easy',
    status: 'soon',
    addedOn: null,
    badge: null,
    course: null,
  },
];

export function getActivity(slug) {
  return ACTIVITIES.find((a) => a.slug === slug) || null;
}

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}

export function liveActivities() {
  return ACTIVITIES.filter((a) => a.status === 'live');
}

export function soonActivities() {
  return ACTIVITIES.filter((a) => a.status === 'soon');
}

// Categories that currently have at least one live activity — used to
// decide which filter chips are worth showing.
export function liveCategoryKeys() {
  return new Set(liveActivities().map((a) => a.category));
}
