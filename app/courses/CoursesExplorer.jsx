'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/* ════════════════════════════════════════════════════════════
   Courses Explorer — interactive grid with search / sort / view
   Drop at: app/courses/CoursesExplorer.jsx
   Rendered by the server page.js (which keeps the metadata export)
   ════════════════════════════════════════════════════════════ */

/* ---- Course data ----
   Single source of truth. Search & sort operate on these fields.
   accent drives the per-course colour. `order` = intended catalogue
   sequence; `level` = difficulty rank for sorting.                   */
const COURSES = [
  {
    slug: 'precalc',
    title: 'Pre-Calculus',
    code: 'Foundations',
    level: 1,
    levelLabel: 'Introductory',
    order: 1,
    accent: 'amber',
    blurb:
      'Functions, trigonometry, analytic geometry, exponentials and logarithms — the complete toolkit needed before calculus, built for understanding over memorisation.',
    topics: ['Functions', 'Trigonometry', 'Algebra', 'Exponentials', 'Logarithms'],
    stats: { lectures: '—', status: 'Planned' },
    live: false,
    keywords: 'precalculus functions trig graphs identities limits prep foundation',
  },
  {
    slug: 'calc1',
    title: 'Calculus I',
    code: 'MATH-101',
    level: 2,
    levelLabel: 'Undergraduate I',
    order: 2,
    accent: 'teal',
    blurb:
      'Taught in two parallel tracks — a rigorous track building from limits upward, and an applied track centred on business and economics. Interactive canvas widgets throughout.',
    topics: ['Limits', 'Derivatives', 'Integration', 'Applications', 'Diff. Equations'],
    stats: { lectures: '6 sections', status: 'Active' },
    live: true,
    keywords:
      'calculus derivative integral limit optimization stewart hoffmann business applied related rates',
  },
  {
    slug: 'linalg',
    title: 'Linear Algebra',
    code: 'MATH-120',
    level: 3,
    levelLabel: 'Undergraduate',
    order: 3,
    accent: 'violet',
    blurb:
      'Systems of equations, matrix algebra, inverses, elementary matrices, LU-factorization and beyond — with applied Pakistani context and Nobel-winning economic models woven in.',
    topics: ['Matrices', 'Inverses', 'LU-Factorization', 'Elementary Matrices', 'Applications'],
    stats: { lectures: '15 lectures', status: 'Active' },
    live: true,
    keywords:
      'linear algebra matrix inverse determinant row reduction gaussian elimination nicholson LU elementary input output leontief',
  },
];

const ACCENTS = {
  amber:  { c: 'var(--amber)',  bg: 'var(--amber-lt)',           bd: 'rgba(232,160,32,.4)' },
  teal:   { c: 'var(--teal)',   bg: 'var(--teal-lt)',            bd: 'rgba(56,201,176,.4)' },
  violet: { c: 'var(--violet)', bg: 'rgba(155,128,232,.12)',     bd: 'rgba(155,128,232,.35)' },
};

const SORTS = [
  { id: 'catalogue', label: 'Catalogue order' },
  { id: 'level-asc', label: 'Level · easy → hard' },
  { id: 'level-desc', label: 'Level · hard → easy' },
  { id: 'az', label: 'Title · A → Z' },
  { id: 'active', label: 'Active courses first' },
];

export default function CoursesExplorer() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('catalogue');
  const [view, setView] = useState('tiles'); // 'tiles' | 'list'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = COURSES.filter((c) => {
      if (!q) return true;
      const hay = `${c.title} ${c.code} ${c.levelLabel} ${c.blurb} ${c.topics.join(' ')} ${c.keywords}`.toLowerCase();
      return hay.includes(q);
    });
    const by = {
      catalogue: (a, b) => a.order - b.order,
      'level-asc': (a, b) => a.level - b.level,
      'level-desc': (a, b) => b.level - a.level,
      az: (a, b) => a.title.localeCompare(b.title),
      active: (a, b) => Number(b.live) - Number(a.live) || a.order - b.order,
    }[sort];
    return [...list].sort(by);
  }, [query, sort]);

  return (
    <>
      <style>{`
        .cx-controls {
          display:flex; gap:14px; align-items:center; flex-wrap:wrap;
          margin-bottom:32px;
        }
        .cx-search {
          position:relative; flex:1; min-width:240px;
        }
        .cx-search input {
          width:100%; box-sizing:border-box;
          background:var(--bg2); border:1px solid var(--border);
          color:var(--text); font-family:var(--fb); font-size:.95rem;
          padding:13px 16px 13px 44px; border-radius:12px; outline:none;
          transition:border-color .18s, box-shadow .18s;
        }
        .cx-search input::placeholder { color:var(--text3); }
        .cx-search input:focus {
          border-color:var(--amber);
          box-shadow:0 0 0 3px var(--amber-lt);
        }
        .cx-search svg {
          position:absolute; left:15px; top:50%; transform:translateY(-50%);
          width:17px; height:17px; stroke:var(--text3); pointer-events:none;
        }
        .cx-search .cx-clear {
          position:absolute; right:10px; top:50%; transform:translateY(-50%);
          background:var(--bg3); border:none; color:var(--text2);
          width:22px; height:22px; border-radius:50%; cursor:pointer;
          font-size:.85rem; line-height:1; display:flex; align-items:center; justify-content:center;
        }
        .cx-search .cx-clear:hover { color:var(--text); background:var(--border2); }

        .cx-select {
          position:relative;
        }
        .cx-select select {
          appearance:none; -webkit-appearance:none;
          background:var(--bg2); border:1px solid var(--border);
          color:var(--text2); font-family:var(--fm); font-size:.8rem;
          letter-spacing:.02em; padding:13px 38px 13px 16px; border-radius:12px;
          cursor:pointer; outline:none; transition:border-color .18s, color .18s;
        }
        .cx-select select:hover { color:var(--text); border-color:var(--border2); }
        .cx-select select:focus { border-color:var(--amber); }
        .cx-select::after {
          content:'▾'; position:absolute; right:14px; top:50%;
          transform:translateY(-50%); color:var(--text3); pointer-events:none; font-size:.85rem;
        }

        .cx-toggle { display:flex; background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:3px; gap:2px; }
        .cx-toggle button {
          display:flex; align-items:center; gap:6px;
          background:transparent; border:none; cursor:pointer;
          color:var(--text3); font-family:var(--fm); font-size:.74rem;
          padding:9px 13px; border-radius:9px; transition:.16s;
        }
        .cx-toggle button svg { width:15px; height:15px; }
        .cx-toggle button.active { background:var(--bg3); color:var(--amber); }
        .cx-toggle button:not(.active):hover { color:var(--text2); }

        .cx-meta {
          font-family:var(--fm); font-size:.74rem; color:var(--text3);
          margin-bottom:20px; letter-spacing:.03em;
        }
        .cx-meta b { color:var(--text2); font-weight:500; }

        /* ---- TILES ---- */
        .cx-tiles {
          display:grid; gap:22px;
          grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));
        }
        .cx-tile {
          position:relative; display:flex; flex-direction:column;
          background:var(--surface); border:1px solid var(--border);
          border-radius:var(--radius); overflow:hidden;
          transition:transform .2s, box-shadow .2s, border-color .2s;
          min-height:300px;
        }
        .cx-tile:hover { transform:translateY(-4px); box-shadow:var(--shadow); border-color:var(--border2); }
        .cx-tile .cx-stripe { height:4px; width:100%; }
        .cx-tile .cx-tile-body { padding:24px; display:flex; flex-direction:column; flex:1; }
        .cx-tile .cx-code {
          font-family:var(--fm); font-size:.66rem; letter-spacing:.16em; text-transform:uppercase;
          margin-bottom:10px;
        }
        .cx-tile h3 { font-size:1.5rem; margin:0 0 10px; line-height:1.1; }
        .cx-tile .cx-blurb { color:var(--text2); font-size:.9rem; line-height:1.6; margin:0 0 16px; flex:1; }
        .cx-tile .cx-topics { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:18px; }
        .cx-chip {
          font-family:var(--fm); font-size:.66rem; padding:4px 9px; border-radius:7px;
          background:var(--bg3); color:var(--text2); border:1px solid var(--border);
        }
        .cx-tile-foot {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:16px; border-top:1px solid var(--border);
        }
        .cx-stat { font-family:var(--fm); font-size:.7rem; color:var(--text3); }
        .cx-stat b { color:var(--text2); font-weight:500; }

        .cx-go {
          font-family:var(--fm); font-size:.74rem; font-weight:500;
          padding:8px 16px; border-radius:9px; text-decoration:none;
          display:inline-flex; align-items:center; gap:5px;
          transition:transform .16s, box-shadow .16s, opacity .16s;
        }
        .cx-go:hover { transform:translateX(2px); }

        .cx-badge {
          position:absolute; top:16px; right:16px;
          font-family:var(--fm); font-size:.6rem; letter-spacing:.1em; text-transform:uppercase;
          padding:4px 10px; border-radius:20px; font-weight:500;
        }
        .cx-badge.live { background:var(--teal-lt); color:var(--teal); border:1px solid rgba(56,201,176,.4); }
        .cx-badge.soon { background:rgba(255,255,255,.04); color:var(--text3); border:1px solid var(--border); }

        /* ---- LIST ---- */
        .cx-list { display:flex; flex-direction:column; gap:12px; }
        .cx-row {
          display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:20px;
          background:var(--surface); border:1px solid var(--border);
          border-left:3px solid transparent;
          border-radius:12px; padding:18px 22px;
          transition:border-color .18s, background .18s, transform .15s;
        }
        .cx-row:hover { background:var(--bg2); transform:translateX(3px); }
        .cx-row-mark {
          width:46px; height:46px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-family:var(--fh); font-size:1.5rem; font-weight:600;
        }
        .cx-row-main h3 { font-size:1.18rem; margin:0 0 3px; line-height:1.15; }
        .cx-row-code { font-family:var(--fm); font-size:.64rem; letter-spacing:.14em; text-transform:uppercase; }
        .cx-row-blurb { color:var(--text3); font-size:.82rem; margin:5px 0 0; line-height:1.5;
          display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .cx-row-right { display:flex; align-items:center; gap:18px; flex-shrink:0; }
        .cx-row-topics { display:flex; gap:6px; }

        .cx-empty {
          text-align:center; padding:64px 24px; color:var(--text3);
          border:1px dashed var(--border); border-radius:var(--radius); background:var(--bg2);
        }
        .cx-empty .cx-empty-icon { font-size:2.4rem; margin-bottom:12px; opacity:.5; }
        .cx-empty button {
          margin-top:16px; background:var(--amber); color:var(--bg); border:none;
          font-family:var(--fm); font-size:.78rem; padding:9px 18px; border-radius:9px; cursor:pointer;
        }

        @media (max-width:680px){
          .cx-controls { gap:10px; }
          .cx-toggle { order:3; }
          .cx-row { grid-template-columns:auto 1fr; }
          .cx-row-right { display:none; }
          .cx-row-blurb { -webkit-line-clamp:2; }
        }
      `}</style>

      {/* CONTROLS */}
      <div className="cx-controls">
        <div className="cx-search">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search courses, codes, or topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search courses"
          />
          {query && (
            <button className="cx-clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
          )}
        </div>

        <div className="cx-select">
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort courses">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="cx-toggle" role="group" aria-label="View mode">
          <button
            className={view === 'tiles' ? 'active' : ''}
            onClick={() => setView('tiles')}
            aria-pressed={view === 'tiles'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Tiles
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
              <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
              <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            List
          </button>
        </div>
      </div>

      {/* RESULT META */}
      <div className="cx-meta">
        Showing <b>{filtered.length}</b> {filtered.length === 1 ? 'course' : 'courses'}
        {query && <> matching <b>“{query}”</b></>}
        {' · '}sorted by <b>{SORTS.find((s) => s.id === sort)?.label.toLowerCase()}</b>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="cx-empty">
          <div className="cx-empty-icon">🔍</div>
          <div style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--text2)' }}>
            No courses match “{query}”.
          </div>
          <div style={{ fontSize: '.85rem', marginTop: '6px' }}>Try a broader term like “matrix” or “limits”.</div>
          <button onClick={() => setQuery('')}>Clear search</button>
        </div>
      )}

      {/* TILES VIEW */}
      {filtered.length > 0 && view === 'tiles' && (
        <div className="cx-tiles">
          {filtered.map((c) => {
            const a = ACCENTS[c.accent];
            return (
              <article className="cx-tile" key={c.slug}>
                <div className="cx-stripe" style={{ background: a.c }} />
                <span className={`cx-badge ${c.live ? 'live' : 'soon'}`}>{c.live ? '● Active' : 'Soon'}</span>
                <div className="cx-tile-body">
                  <div className="cx-code" style={{ color: a.c }}>{c.code} · {c.levelLabel}</div>
                  <h3>{c.title}</h3>
                  <p className="cx-blurb">{c.blurb}</p>
                  <div className="cx-topics">
                    {c.topics.slice(0, 4).map((t) => <span className="cx-chip" key={t}>{t}</span>)}
                    {c.topics.length > 4 && <span className="cx-chip">+{c.topics.length - 4}</span>}
                  </div>
                  <div className="cx-tile-foot">
                    <span className="cx-stat"><b>{c.stats.lectures}</b></span>
                    {c.live ? (
                      <Link href={`/courses/${c.slug}`} className="cx-go" style={{ background: a.c, color: c.accent === 'violet' ? '#fff' : 'var(--bg)' }}>
                        View course →
                      </Link>
                    ) : (
                      <span className="cx-go" style={{ background: 'var(--bg3)', color: 'var(--text3)', cursor: 'default' }}>
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {filtered.length > 0 && view === 'list' && (
        <div className="cx-list">
          {filtered.map((c) => {
            const a = ACCENTS[c.accent];
            const inner = (
              <div className="cx-row" style={{ borderLeftColor: a.c }}>
                <div className="cx-row-mark" style={{ background: a.bg, color: a.c, border: `1px solid ${a.bd}` }}>
                  {c.title.charAt(0)}
                </div>
                <div className="cx-row-main">
                  <div className="cx-row-code" style={{ color: a.c }}>{c.code} · {c.levelLabel}</div>
                  <h3>{c.title}</h3>
                  <p className="cx-row-blurb">{c.blurb}</p>
                </div>
                <div className="cx-row-right">
                  <div className="cx-row-topics">
                    {c.topics.slice(0, 3).map((t) => <span className="cx-chip" key={t}>{t}</span>)}
                  </div>
                  <span className="cx-stat"><b>{c.stats.lectures}</b></span>
                  <span className={`cx-badge ${c.live ? 'live' : 'soon'}`} style={{ position: 'static' }}>
                    {c.live ? '● Active' : 'Soon'}
                  </span>
                  <span style={{ color: a.c, fontSize: '1.1rem' }}>→</span>
                </div>
              </div>
            );
            return c.live ? (
              <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none' }}>{inner}</Link>
            ) : (
              <div key={c.slug} style={{ opacity: 0.7 }}>{inner}</div>
            );
          })}
        </div>
      )}
    </>
  );
}