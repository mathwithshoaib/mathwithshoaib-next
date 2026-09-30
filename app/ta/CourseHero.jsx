'use client';

import Link from 'next/link';

/* Shared hero block for every /ta/<course> page — course title, term,
   instructor(s), full TA roster (so classmates get credit too), and the
   course description/objectives carried over verbatim from the original
   course site. Kept compact — details go into a native <details> so the
   page doesn't open with a wall of text. */
function joinNatural(list) {
  if (list.length <= 1) return list.join('');
  if (list.length === 2) return list.join(' & ');
  return `${list.slice(0, -1).join(', ')} & ${list[list.length - 1]}`;
}

export function CourseHero({ title, term, instructors, tas, description, objective, backHref = '/experience/ta', backLabel = '← Back to TA Experience' }) {
  return (
    <section style={{
      paddingTop: 'calc(var(--nav-h) + 3px)',
      background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ padding: '40px 32px 32px', maxWidth: '900px' }}>
        <Link href={backHref} style={{ display: 'inline-block', marginBottom: '14px', color: 'var(--text3)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.74rem' }}>
          {backLabel}
        </Link>
        <span className="eyebrow">{term}</span>
        <h1 style={{ margin: '4px 0 14px', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>{title}</h1>

        <div className="ta-hero-meta">
          <div>
            <div className="ta-hero-meta-label">Instructor{instructors.length > 1 ? 's' : ''}</div>
            <div className="ta-hero-meta-value">{joinNatural(instructors)}</div>
          </div>
          <div>
            <div className="ta-hero-meta-label">Teaching Assistants ({tas.length})</div>
            <ol className="ta-hero-talist">
              {tas.map((t) => <li key={t}>{t}</li>)}
            </ol>
          </div>
        </div>

        {(description || objective) && (
          <details className="ta-hero-details">
            <summary>Course description &amp; objectives</summary>
            {description && <p>{description}</p>}
            {objective && <p className="ta-hero-objective">{objective}</p>}
          </details>
        )}
      </div>

      <style>{`
        .ta-hero-meta { display: flex; gap: 40px; flex-wrap: wrap; margin-bottom: 16px; }
        .ta-hero-meta-label {
          font-family: var(--fm); font-size: .62rem; color: var(--text3); letter-spacing: .06em;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .ta-hero-meta-value { font-size: .88rem; color: var(--text); }
        .ta-hero-talist {
          columns: 2; column-gap: 24px; margin: 0; padding-left: 18px;
          font-size: .82rem; color: var(--text2); max-width: 480px;
        }
        .ta-hero-talist li { break-inside: avoid; margin-bottom: 2px; }
        .ta-hero-details { font-size: .84rem; color: var(--text2); }
        .ta-hero-details summary {
          cursor: pointer; font-family: var(--fm); font-size: .74rem; color: var(--amber);
          letter-spacing: .02em; margin-bottom: 8px;
        }
        .ta-hero-details p { line-height: 1.75; margin: 8px 0 0; }
        .ta-hero-objective { font-style: italic; color: var(--text3); }
        @media (max-width: 480px) { .ta-hero-talist { columns: 1; } }
      `}</style>
    </section>
  );
}
