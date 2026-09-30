'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════
   Compact, collapsible resource sections for /ta/<course>
   pages — modeled on the density of the original Google Sites
   layout (numbered lists, bracket-style secondary links, cards
   arranged in a grid rather than one long vertical stack).

   A "row" is one resource entry: a label, an optional date, and
   0+ tagged links (0 = "not available", 1+ = shown as bracketed
   [tag] links after the label — the label itself is never the
   link, so multiple resources per row are all equally reachable).
   ══════════════════════════════════════════════════════ */

export function ResourceGrid({ children }) {
  return <div className="ta-res-grid">{children}</div>;
}

export function ResourceSection({ section, fullWidth = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`ta-res-card${fullWidth ? ' ta-res-full' : ''}`}>
      <button type="button" className="ta-res-head" onClick={() => setOpen((o) => !o)}>
        <span className="ta-res-title">{section.title}</span>
        <span className="ta-res-chevron">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="ta-res-body">
          {section.note && <p className="ta-res-note">{section.note}</p>}
          {section.gridGroups ? (
            <div className="ta-res-subgrid">
              {section.groups.map((g, i) => <ResourceGroup key={g.subtitle || i} group={g} collapsible />)}
            </div>
          ) : (
            section.groups.map((g, i) => <ResourceGroup key={g.subtitle || i} group={g} />)
          )}
        </div>
      )}
    </div>
  );
}

function ResourceGroup({ group, collapsible = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ta-res-group">
      {group.subtitle && (
        collapsible ? (
          <button type="button" className="ta-res-subhead" onClick={() => setOpen((o) => !o)}>
            <span>{group.subtitle}</span>
            <span className="ta-res-chevron-sm">{open ? '▴' : '▾'}</span>
          </button>
        ) : (
          <div className="ta-res-subtitle">{group.subtitle}</div>
        )
      )}
      {(!collapsible || open) && (
        <ol className="ta-res-list">
          {group.rows.map((r) => (
            <li key={r.label}>
              <span className="ta-res-label">{r.label}</span>
              {r.date && <span className="ta-res-date"> · {r.date}</span>}
              {!r.links || r.links.length === 0 ? (
                <span className="ta-res-none">not available</span>
              ) : (
                r.links.map((l) => (
                  <Link key={l.tag + l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ta-res-tag">
                    [{l.tag}]
                  </Link>
                ))
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export const TA_RESOURCE_CSS = `
  .ta-res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; align-items: start; }
  .ta-res-full { grid-column: 1 / -1; }
  .ta-res-card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); overflow: hidden; }
  .ta-res-head {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    background: none; border: none; cursor: pointer; padding: 12px 16px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .ta-res-title { font-family: var(--fh); font-size: 1rem; color: var(--amber); }
  .ta-res-chevron, .ta-res-chevron-sm { color: var(--text3); font-size: .8rem; flex-shrink: 0; }
  .ta-res-body { padding: 12px 16px 16px; }
  .ta-res-note { font-size: .74rem; color: var(--text3); margin: 0 0 10px; line-height: 1.5; }
  .ta-res-subgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
  .ta-res-group { margin-bottom: 14px; }
  .ta-res-group:last-child { margin-bottom: 0; }
  .ta-res-subtitle {
    font-family: var(--fm); font-size: .66rem; letter-spacing: .06em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 6px;
  }
  .ta-res-subhead {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    background: none; border: none; cursor: pointer; padding: 0 0 6px; text-align: left;
    font-family: var(--fm); font-size: .66rem; letter-spacing: .06em; text-transform: uppercase; color: var(--amber);
    border-bottom: 1px solid var(--border); margin-bottom: 8px;
  }
  .ta-res-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
  .ta-res-list li { font-size: .8rem; color: var(--text2); line-height: 1.5; }
  .ta-res-label { color: var(--text2); }
  .ta-res-date { color: var(--text3); font-family: var(--fm); font-size: .68rem; }
  .ta-res-tag {
    color: var(--teal); text-decoration: none; font-family: var(--fm); font-size: .74rem; font-weight: 600;
    margin-left: 6px; white-space: nowrap;
  }
  .ta-res-tag:hover { text-decoration: underline; }
  .ta-res-none { font-family: var(--fm); font-size: .68rem; color: var(--text3); opacity: .6; margin-left: 6px; }
`;
