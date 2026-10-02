'use client';

import { useMemo, useState } from 'react';
import {
  CATEGORIES,
  liveActivities,
  soonActivities,
  liveCategoryKeys,
  getCategory,
} from '../../explore/activities';
import { useExploreProgress } from '../../explore/useExploreProgress';
import ActivityCard from './ActivityCard';
import ProgressStrip from './ProgressStrip';
import DailyPuzzleCard from './DailyPuzzleCard';

const DIFFICULTY_RANK = { easy: 0, medium: 1, hard: 2 };

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'shortest', label: 'Shortest' },
  { key: 'hardest', label: 'Hardest' },
];

export default function ExploreHub() {
  const { hydrated, played, playedCount, streak, badges, totalBadges, recordPuzzleSolved } = useExploreProgress();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notPlayedOnly, setNotPlayedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const live = liveActivities();
  const soon = soonActivities();
  const visibleCategoryKeys = liveCategoryKeys();
  const visibleCategories = CATEGORIES.filter((c) => visibleCategoryKeys.has(c.key));

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = live.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (notPlayedOnly && played[a.slug]) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.hook.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'shortest') return a.minutes - b.minutes;
      if (sortBy === 'hardest') return DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty];
      // newest
      return (b.addedOn || '').localeCompare(a.addedOn || '');
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategory, notPlayedOnly, sortBy, played]);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'calc(var(--nav-h) + 3px)',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ padding: '56px 32px 48px' }}>
          <span className="eyebrow">Play &amp; Wonder</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }}>Explore</h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: '0 0 24px' }}>
            A growing hub of math games, simulations, puzzles, and art — no coursework attached, just things
            worth playing with.
          </p>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities…"
            aria-label="Search activities"
            style={{
              width: '100%', maxWidth: '420px', minHeight: '44px', padding: '10px 16px',
              borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--surface)',
              color: 'var(--text)', fontFamily: 'var(--fb)', fontSize: '.92rem',
            }}
          />
        </div>
      </section>

      <section className="sk-section">
        <div className="container">
          {/* ── STATS ── */}
          <div className="explore-stats-row">
            <div className="explore-stat-card">
              <span className="explore-stat-n">{hydrated ? streak.count : 0}</span>
              <span className="explore-stat-l">Day streak</span>
            </div>
            <div className="explore-stat-card">
              <span className="explore-stat-n">{hydrated ? badges.length : 0} / {totalBadges}</span>
              <span className="explore-stat-l">Badges earned</span>
            </div>
          </div>

          {/* ── PUZZLE OF THE DAY ── */}
          <DailyPuzzleCard streak={streak} recordPuzzleSolved={recordPuzzleSolved} />

          {/* ── PROGRESS ── */}
          <ProgressStrip playedCount={hydrated ? playedCount : 0} total={live.length} />

          {/* ── FILTERS ── */}
          <div className="explore-filters">
            <button
              type="button"
              className={`explore-chip ${activeCategory === 'all' ? 'active' : ''}`}
              aria-pressed={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`explore-chip ${activeCategory === c.key ? 'active' : ''}`}
                aria-pressed={activeCategory === c.key}
                onClick={() => setActiveCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              className={`explore-toggle ${notPlayedOnly ? 'active' : ''}`}
              aria-pressed={notPlayedOnly}
              onClick={() => setNotPlayedOnly((v) => !v)}
            >
              Not played yet
            </button>
            <select
              className="explore-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort activities"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            {results.length} activit{results.length === 1 ? 'y' : 'ies'} shown
          </div>

          {/* ── GRID ── */}
          {results.length > 0 ? (
            <div className="explore-grid">
              {results.map((activity) => (
                <ActivityCard key={activity.slug} activity={activity} played={hydrated && !!played[activity.slug]} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>No activities match your filters yet.</p>
          )}
        </div>
      </section>

      {/* ── COMING NEXT ── */}
      {soon.length > 0 && (
        <section className="sk-section sk-section-alt" style={{ paddingTop: '0' }}>
          <div className="container">
            <span className="eyebrow">Coming Next</span>
            <div className="explore-soon-strip" style={{ marginTop: '16px' }}>
              {soon.map((a) => {
                const cat = getCategory(a.category);
                return (
                  <span key={a.slug} className="explore-soon-item">
                    <span aria-hidden="true">{cat?.icon}</span> {a.title}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
