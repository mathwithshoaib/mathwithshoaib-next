'use client';

import Link from 'next/link';

/* Shared hero block for every /ta/<course> page — course title, term,
   instructor(s), full TA roster (so classmates get credit too), and the
   course description/objectives carried over verbatim from the original
   course site. */
export function CourseHero({ title, term, instructors, tas, description, objective, backHref = '/experience/ta' }) {
  return (
    <section style={{
      paddingTop: 'calc(var(--nav-h) + 3px)',
      background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ padding: '56px 32px 48px', maxWidth: '820px' }}>
        <Link href={backHref} style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--text3)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.74rem' }}>
          ← Back to TA Experience
        </Link>
        <span className="eyebrow">{term}</span>
        <h1 style={{ marginBottom: '18px', maxWidth: '680px' }}>{title}</h1>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '22px' }}>
          <div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Instructor{instructors.length > 1 ? 's' : ''}</div>
            <div style={{ fontSize: '.9rem', color: 'var(--text)' }}>{instructors.join(' & ')}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Teaching Assistants</div>
            <div style={{ fontSize: '.9rem', color: 'var(--text2)', maxWidth: '440px' }}>{tas.join(', ')}</div>
          </div>
        </div>

        {description && (
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '.94rem', marginBottom: objective ? '14px' : 0 }}>
            {description}
          </p>
        )}
        {objective && (
          <p style={{ color: 'var(--text3)', lineHeight: 1.8, fontSize: '.86rem', fontStyle: 'italic', margin: 0 }}>
            {objective}
          </p>
        )}
      </div>
    </section>
  );
}
