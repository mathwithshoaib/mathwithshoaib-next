'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) — FALL 2026 — COURSE HOME
   Route: /courses/calc1-fa26

   This is a fresh offering, separate from the existing /courses/calc1
   page (that one is the Fall 2025 SSE-track offering — lecture notes,
   quizzes, reviews already live there). This page is intentionally a
   light draft: intro copy below is a placeholder — swap it for the real
   course description once you have it. Teaching Team is NOT hardcoded
   here — it's fetched live from the same roster the schedule admin
   panel manages, so it can never drift out of sync with the schedule.
   ═════════════════════════════════════════════════════════════════ */

async function api(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

const SWITCHER = [
  { href: '/courses/precalc', label: 'Pre-Calculus' },
  { href: '/courses/calc1', label: 'Calculus I · Fall 2025' },
  { href: '/courses/calc1-fa26', label: 'Calculus I · Non-SSE · Fall 2026', active: true },
  { href: '/courses/linalg', label: 'Linear Algebra · Summer 2026' },
];

export default function Calc1Fa26() {
  const [roster, setRoster] = useState(null);

  useEffect(() => {
    api('/api/schedule/state').then(setRoster).catch(() => {});
  }, []);

  const instructors = roster?.instructors || [];
  const tfs = roster?.tfs || [];
  const tas = roster?.tas || [];

  return (
    <>
      <style>{`
        .c26-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px 72px; }
        .c26-team-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .c26-team-row { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); }
        .c26-team-row:last-child { border-bottom: none; }
        @media (max-width: 720px) { .c26-team-cols { grid-template-columns: 1fr; } }
        .c26-cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
                   border: 1px solid rgba(232,160,32,.4); border-radius: var(--radius); padding: 24px 28px;
                   background: linear-gradient(135deg, var(--amber-lt) 0%, transparent 100%); }
        @media (max-width: 640px) { .c26-cta { flex-direction: column; align-items: flex-start; } }
      `}</style>

      <Navbar activePage="courses" />

      {/* breadcrumb + course switcher */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Calculus I · Non-SSE · FA26</span>
        </div>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {SWITCHER.map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase',
              color: active ? 'var(--amber)' : 'var(--text3)', padding: '9px 18px',
              borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent', whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: 'calc(var(--nav-h) + 3px + 37px) 24px 40px', borderBottom: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', margin: '6px 0 14px' }}>
            Calculus I <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>— Non-SSE</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.02rem', color: 'var(--text2)' }}>
            Course description coming soon — this section is being drafted. Placeholder for now: limits,
            derivatives, integration, and their applications, for students outside the School of Science &amp; Engineering.
          </p>

          <div style={{ display: 'flex', gap: '28px', marginTop: '22px', flexWrap: 'wrap' }}>
            {[['Credits', 'TBA'], ['Prereq', 'TBA'], ['Text', 'TBA']].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: '.9rem', color: 'var(--text)', marginTop: '3px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="c26-wrap">
        {/* SCHEDULE CTA */}
        <div style={{ margin: '40px 0' }}>
          <div className="c26-cta">
            <div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Live</div>
              <h3 style={{ margin: '0 0 6px' }}>Weekly schedule</h3>
              <p style={{ margin: 0, color: 'var(--text2)', fontSize: '.92rem', maxWidth: '480px' }}>
                Lectures, office hours, recitations, and tutorial venues — updated live. TAs pick their own tutorial seat and office hours here too.
              </p>
            </div>
            <Link href="/courses/calc1-fa26/schedule" className="btn" style={{ flexShrink: 0 }}>Open schedule →</Link>
          </div>
        </div>

        {/* TEACHING TEAM — fetched live from the schedule roster */}
        <div style={{ marginBottom: '44px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Teaching team</h3>
          {!roster ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Loading…</p>
          ) : instructors.length === 0 && tfs.length === 0 && tas.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Team roster not added yet — add instructors/TFs/TAs via the schedule admin panel.</p>
          ) : (
            <div className="c26-team-cols">
              <TeamColumn title="Instructors" accent="var(--amber)" people={instructors} details />
              <TeamColumn title="TFs" accent="var(--rose)" people={tfs} details />
              <TeamColumn title="TAs" accent="var(--teal)" people={tas} />
            </div>
          )}
          <p style={{ fontSize: '.74rem', color: 'var(--text3)', marginTop: '12px' }}>
            This list is managed in one place (schedule admin panel → Teaching team) and shared with the schedule page, so it's always in sync.
          </p>
        </div>

        {/* PLACEHOLDER — more sections to come */}
        <div style={{ border: '1px dashed var(--border2)', borderRadius: 'var(--radius)', padding: '28px', textAlign: 'center', color: 'var(--text3)', marginBottom: '32px' }}>
          Lecture notes, resources, and grading details — coming soon.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/courses/calc1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
            ← Calculus I (Fall 2025)
          </Link>
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>
            All Courses →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

// One compact numbered column of the Teaching Team section. `details` shows
// a small office/email line under each name (instructors/TFs); TAs just
// get the name — a title says which column is which, so per-row labels
// would be redundant.
function TeamColumn({ title, accent, people, details }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--surface)', borderTop: `3px solid ${accent}` }}>
      <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: accent, margin: '0 0 8px' }}>
        {title} {people.length > 0 && <span style={{ color: 'var(--text3)' }}>· {people.length}</span>}
      </h4>
      {people.length === 0 ? (
        <div style={{ fontSize: '.8rem', color: 'var(--text3)', padding: '6px 0' }}>None yet.</div>
      ) : (
        people.map((p, i) => (
          <div key={p.id} className="c26-team-row">
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', flexShrink: 0, width: '16px' }}>{i + 1}.</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.86rem', color: 'var(--text)' }}>{p.name}</div>
              {details && (p.office || p.email) && (
                <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '2px' }}>
                  {[p.office, p.email].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
