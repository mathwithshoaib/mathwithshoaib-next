'use client';

import { useCallback, useEffect, useState } from 'react';
import { ACTIVITIES } from './activities';

/* ══════════════════════════════════════════════════════
   useExploreProgress — the one hook that reads/writes the
   localStorage key `mws-explore-v1` for the whole Explore hub
   (hub page + every activity shell). No login, no backend.
   Storage shape: { played: {slug: ISODate}, streak: {count, lastDay}, badges: [] }
   Every read/write is wrapped in try/catch and the hook renders
   correctly (zeros) when storage is empty or blocked.
   ══════════════════════════════════════════════════════ */

const STORAGE_KEY = 'mws-explore-v1';

export const BADGES = [
  { id: 'first-play', label: 'First Play', description: 'Tried your first Explore activity.' },
  { id: 'three-categories', label: 'Triple Threat', description: 'Tried activities from 3 different categories.' },
  { id: 'five-day-streak', label: '5-Day Streak', description: 'Solved the daily puzzle 5 days in a row.' },
  { id: 'nim-master', label: 'Nim Master', description: 'Beat the computer on the hardest Nim setup.' },
  { id: 'reached-moon', label: 'Reached the Moon', description: 'Folded paper past the distance to the Moon.' },
];

const DEFAULT_STATE = { played: {}, streak: { count: 0, lastDay: null }, badges: [] };

function todayISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayISO(d);
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      played: parsed.played && typeof parsed.played === 'object' ? parsed.played : {},
      streak: parsed.streak && typeof parsed.streak === 'object' ? parsed.streak : { count: 0, lastDay: null },
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable or blocked (private mode, quota, etc.) — ignore
  }
}

function categoriesPlayedCount(played) {
  const cats = new Set();
  for (const slug of Object.keys(played)) {
    const activity = ACTIVITIES.find((a) => a.slug === slug);
    if (activity) cats.add(activity.category);
  }
  return cats.size;
}

export function useExploreProgress() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev);
      if (next !== prev) saveState(next);
      return next;
    });
  }, []);

  const markPlayed = useCallback((slug) => {
    update((prev) => {
      if (prev.played[slug]) return prev;
      const played = { ...prev.played, [slug]: todayISO() };
      let badges = prev.badges;
      if (!badges.includes('first-play')) badges = [...badges, 'first-play'];
      if (categoriesPlayedCount(played) >= 3 && !badges.includes('three-categories')) {
        badges = [...badges, 'three-categories'];
      }
      return { ...prev, played, badges };
    });
  }, [update]);

  const markBadge = useCallback((badgeId) => {
    update((prev) => (prev.badges.includes(badgeId) ? prev : { ...prev, badges: [...prev.badges, badgeId] }));
  }, [update]);

  const recordPuzzleSolved = useCallback(() => {
    update((prev) => {
      const today = todayISO();
      if (prev.streak.lastDay === today) return prev;
      const count = prev.streak.lastDay === yesterdayISO() ? prev.streak.count + 1 : 1;
      let badges = prev.badges;
      if (count >= 5 && !badges.includes('five-day-streak')) badges = [...badges, 'five-day-streak'];
      return { ...prev, streak: { count, lastDay: today }, badges };
    });
  }, [update]);

  return {
    hydrated,
    played: state.played,
    playedCount: Object.keys(state.played).length,
    streak: state.streak,
    badges: state.badges,
    totalBadges: BADGES.length,
    markPlayed,
    markBadge,
    recordPuzzleSolved,
  };
}
