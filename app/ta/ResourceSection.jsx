'use client';

import Link from 'next/link';

/* ══════════════════════════════════════════════════════
   Shared rendering for a TA course page's resource sections —
   used by every /ta/<course> page so the layout/look can't drift
   between them. A "row" is one resource entry: a label, an
   optional date, and 0+ tagged links (0 links = "not available",
   1 link = a single button, 2+ = e.g. "V1"/"V2" or two topics
   under one grand-tutorial date).
   ══════════════════════════════════════════════════════ */

export function ResourceSection({ section }) {
  return (
    <div className="ta-res-section">
      <h3 className="ta-res-title">{section.title}</h3>
      {section.note && <p className="ta-res-note">{section.note}</p>}
      {section.groups.map((g, i) => (
        <div key={g.subtitle || i} className="ta-res-group">
          {g.subtitle && <div className="ta-res-subtitle">{g.subtitle}</div>}
          <div className="ta-res-rows">
            {g.rows.map((r) => (
              <div key={r.label} className="ta-res-row">
                <div className="ta-res-row-label">
                  {r.label}
                  {r.date && <span className="ta-res-date"> · {r.date}</span>}
                </div>
                <div className="ta-res-row-links">
                  {!r.links || r.links.length === 0 ? (
                    <span className="ta-res-none">not available</span>
                  ) : (
                    r.links.map((l) => (
                      <Link key={l.tag + l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ta-res-link">
                        {l.tag}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const TA_RESOURCE_CSS = `
  .ta-res-section { margin-bottom: 36px; }
  .ta-res-title { font-size: 1.05rem; margin: 0 0 6px; color: var(--text); }
  .ta-res-note { font-size: .8rem; color: var(--text3); margin: 0 0 16px; line-height: 1.6; }
  .ta-res-group { margin-bottom: 18px; }
  .ta-res-group:last-child { margin-bottom: 0; }
  .ta-res-subtitle {
    font-family: var(--fm); font-size: .68rem; letter-spacing: .06em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 8px;
  }
  .ta-res-rows { display: flex; flex-direction: column; gap: 4px; }
  .ta-res-row {
    display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
    padding: 9px 12px; border-radius: 7px; border: 1px solid var(--border);
  }
  .ta-res-row-label { font-size: .84rem; color: var(--text2); }
  .ta-res-date { color: var(--text3); font-family: var(--fm); font-size: .72rem; }
  .ta-res-row-links { display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }
  .ta-res-link {
    font-family: var(--fm); font-size: .68rem; font-weight: 600; text-decoration: none;
    color: var(--teal); border: 1px solid rgba(56,201,176,.35); border-radius: 5px; padding: 3px 9px;
    white-space: nowrap;
  }
  .ta-res-link:hover { background: rgba(56,201,176,.1); }
  .ta-res-none { font-family: var(--fm); font-size: .68rem; color: var(--text3); opacity: .6; }
`;
