'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ══════════════════════════════════════════════════════
   As an Instructor — carried over from the old Google Sites
   portfolio (sites.google.com/view/shoaib-k/experience_1/
   as-an-instructor) for Fall 2025, plus the Teaching Fellow
   roles that followed it (not on the old site — added directly
   from what's already live on this site's own course pages).
   Listed most recent first.
   ══════════════════════════════════════════════════════ */
const ROLES = [
  {
    id: 'calc1-fa26',
    course: 'MATH-101 · Calculus I (Non-SSE)',
    term: 'Fall 2026',
    role: 'Teaching Fellow',
    instructors: 'Dr. Imran Anwar, Dr. Adnan Khan, Dr. Omer Khawar Malik',
    color: 'var(--amber)',
    description: `Currently a Teaching Fellow for the Non-SSE section of Calculus I — running the course's live schedule, exam logistics, and announcements alongside 2 fellow TFs and the instructor team.`,
    href: '/courses/calc1-fa26',
    hrefLabel: 'View course page →',
  },
  {
    id: 'calc1-sp26',
    course: 'MATH-101 · Calculus I',
    term: 'Spring 2026',
    role: 'Teaching Fellow',
    instructors: null,
    color: 'var(--teal)',
    description: `Served as Teaching Fellow for Calculus I, continuing on from the instructor role the previous term.`,
    href: null,
  },
  {
    id: 'calc1-fa25',
    course: 'MATH-101 · Calculus',
    term: 'Fall 2025',
    role: 'Instructor',
    instructors: 'Dr. Imran Anwar (lead), Mariam Alvi, Azhar Javed',
    color: 'var(--violet)',
    description: `Started my first course as an instructor, co-teaching alongside lead instructor Dr. Imran Anwar — with a teaching team of 4 instructors and 13 TAs supporting the course.`,
    href: '/instructor/calculus-fa25',
    hrefLabel: 'View course resources →',
  },
];

export default function InstructorExperiencePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activePage="experience" />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'calc(var(--nav-h) + 3px)',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-100px', top: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(232,160,32,.05), transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ padding: '64px 32px 56px' }}>
          <span className="eyebrow reveal">Experience</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            As an <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Instructor</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            From a first instructor role co-teaching Calculus in Fall 2025 to Teaching Fellow for two terms
            since — leading course logistics, exams, and student support at LUMS.
          </p>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="sk-section sk-section-alt">
        <div className="container">
          <span className="eyebrow reveal">Role by Role</span>
          <h2 className="reveal" style={{ marginBottom: '40px' }}>Teaching Roles</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {ROLES.map((r) => (
              <div key={r.id} className="reveal card" style={{ padding: '28px 30px', borderTop: `3px solid ${r.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text)' }}>{r.course}</h3>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: r.color, whiteSpace: 'nowrap' }}>{r.term}</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.76rem', color: 'var(--text3)', marginBottom: '16px' }}>
                  🎓 {r.role}{r.instructors ? ` · with ${r.instructors}` : ''}
                </div>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85, margin: 0 }}>
                  {r.description}
                </p>
                {r.href && (
                  <Link href={r.href} style={{ display: 'inline-block', marginTop: '18px', color: r.color, textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.8rem', fontWeight: 600 }}>
                    {r.hrefLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="sk-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow reveal">Elsewhere in Experience</span>
          <h2 className="reveal">More of My Teaching Work</h2>
          <p className="reveal" style={{ maxWidth: '520px', margin: '0 auto 32px', color: 'var(--text2)' }}>
            Beyond leading courses, see my work as a teaching assistant and with LUMS Math Circles outreach.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/experience/ta" className="btn">As Teaching Assistant</Link>
            <Link href="/experience/math-circles" className="btn btn-outline">Math Circles →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
