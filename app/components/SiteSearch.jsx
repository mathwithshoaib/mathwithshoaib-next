'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_INDEX } from './searchIndex';

/* ══════════════════════════════════════════════════════
   Site-wide search — a lightweight client-side overlay over the
   hand-maintained SEARCH_INDEX (see searchIndex.js). No backend,
   no dependency: just a substring match scored by whether the hit
   is in the title (weighted higher) or description, capped to a
   handful of results. Opens via the magnifier button in the
   Navbar, or the "/" keyboard shortcut from anywhere that isn't
   already a text input.
   ══════════════════════════════════════════════════════ */

function scoreMatch(entry, query) {
  const q = query.toLowerCase();
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 80;
  if (desc.includes(q)) return 40;
  return 0;
}

export default function SiteSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return SEARCH_INDEX
      .map((entry) => ({ entry, score: scoreMatch(entry, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.entry);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const go = (url) => {
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && results[activeIndex]) { go(results[activeIndex].url); }
  };

  if (!open) return null;

  return (
    <div className="site-search-overlay" onMouseDown={onClose}>
      <div className="site-search-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="site-search-input-row">
          <span className="site-search-icon">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, courses, resources…"
            className="site-search-input"
          />
          <button type="button" className="site-search-close" onClick={onClose} aria-label="Close search">✕</button>
        </div>

        {query.trim() && (
          <div className="site-search-results">
            {results.length === 0 ? (
              <div className="site-search-empty">No matches for &ldquo;{query}&rdquo;.</div>
            ) : (
              results.map((r, i) => (
                <button
                  key={r.url}
                  type="button"
                  className={`site-search-result${i === activeIndex ? ' active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(r.url)}
                >
                  <span className="site-search-result-type">{r.type}</span>
                  <span className="site-search-result-text">
                    <span className="site-search-result-title">{r.title}</span>
                    <span className="site-search-result-desc">{r.description}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="site-search-hint">Type to search across every page, course, and resource on the site.</div>
        )}
      </div>

      <style>{`
        .site-search-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 2000;
          display: flex; align-items: flex-start; justify-content: center; padding: 12vh 20px 20px;
        }
        .site-search-modal {
          background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius);
          box-shadow: var(--shadow-lg); width: 100%; max-width: 560px; overflow: hidden;
        }
        .site-search-input-row { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); }
        .site-search-icon { font-size: 1rem; flex-shrink: 0; }
        .site-search-input {
          flex: 1; background: none; border: none; outline: none; color: var(--text);
          font-family: var(--fb); font-size: 1rem;
        }
        .site-search-input::placeholder { color: var(--text3); }
        .site-search-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 1rem; padding: 4px; flex-shrink: 0; }
        .site-search-close:hover { color: var(--amber); }
        .site-search-results { max-height: 60vh; overflow-y: auto; padding: 6px; }
        .site-search-empty, .site-search-hint { padding: 20px 16px; color: var(--text3); font-size: .85rem; text-align: center; }
        .site-search-result {
          display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
          background: none; border: none; cursor: pointer; padding: 10px 12px; border-radius: 8px;
        }
        .site-search-result.active, .site-search-result:hover { background: rgba(232,160,32,.10); }
        .site-search-result-type {
          font-family: var(--fm); font-size: .6rem; letter-spacing: .05em; text-transform: uppercase;
          color: var(--text3); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; flex-shrink: 0;
        }
        .site-search-result-text { display: flex; flex-direction: column; min-width: 0; }
        .site-search-result-title { font-size: .92rem; color: var(--text); }
        .site-search-result-desc { font-size: .76rem; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        @media (max-width: 480px) {
          .site-search-overlay { padding: 8vh 12px 12px; }
        }
      `}</style>
    </div>
  );
}
