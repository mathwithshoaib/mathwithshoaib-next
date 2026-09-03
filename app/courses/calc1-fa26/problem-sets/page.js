'use client';

import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — WEEKLY PROBLEM SETS
   Route: /courses/calc1-fa26/problem-sets

   Placeholder destination for the "Weekly problem sets" CTA on the course
   home page. Empty on purpose — sets get added by hand, week by week, once
   they exist. Structure mirrors PROBLEM_SETS in the course page's Resources
   section conventions (week number -> link), so wiring real ones in later
   is a one-line change, not a redesign.
   ═════════════════════════════════════════════════════════════════ */

const PROBLEM_SETS = Array.from({ length: 14 }, (_, i) => ({ week: i + 1, href: null }));

export default function ProblemSets() {
  return (
    <>
      <style>{`
        .ps-wrap { max-width: 780px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 48px) 24px 80px; }
        .ps-row { display: flex; align-items: center; justify-content: space-between; gap: 12px;
                  padding: 13px 16px; border: 1px solid var(--border); border-radius: 9px; margin-bottom: 8px; }
      `}</style>
      <Navbar activePage="courses" />
      <div className="ps-wrap">
        <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 10px' }}>Weekly Problem Sets</h1>
        <p style={{ color: 'var(--text2)', fontSize: '.98rem', maxWidth: '600px', marginBottom: '32px' }}>
          A problem set will be posted here for each week of the term, alongside the lecture notes and recitation
          material. Nothing's up yet — check back once the semester is underway, or watch the schedule page for
          announcements.
        </p>

        <div style={{ marginBottom: '32px' }}>
          {PROBLEM_SETS.map((p) => (
            <div key={p.week} className="ps-row">
              <span style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)' }}>Week {p.week}</span>
              {p.href ? (
                <Link href={p.href} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '.72rem' }}>Open →</Link>
              ) : (
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', opacity: .5, letterSpacing: '.06em', textTransform: 'uppercase' }}>Coming soon</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/courses/calc1-fa26" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
            ← Course home
          </Link>
          <Link href="/courses/calc1-fa26/schedule" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>
            Weekly schedule →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
