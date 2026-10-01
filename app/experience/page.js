'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════
   Experience — the hub the "Experience" nav label itself links to
   (the dropdown's arrow still jumps straight to a sub-page). Give
   an overview here and let each card below do the deep-diving.
   Add a new card whenever a new kind of teaching/mentoring role
   starts (the dedicated detail page, if any, is still its own
   /experience/<role> route).
   ══════════════════════════════════════════════════════ */

const ROLES = [
  {
    id: 'instructor',
    icon: '🎓',
    title: 'As an Instructor',
    period: 'Fall 2025 – present',
    description: 'Started as an instructor co-teaching Calculus in Fall 2025, now a Teaching Fellow for the current Non-SSE offering.',
    href: '/experience/instructor',
    color: 'var(--amber)',
  },
  {
    id: 'ta',
    icon: '📋',
    title: 'As a Teaching Assistant',
    period: '2023 – 2026',
    description: 'Six TA roles across Calculus, Pre-Calculus, and Probability — tutorials, office hours, exam writing, and grading.',
    href: '/experience/ta',
    color: 'var(--teal)',
  },
  {
    id: 'math-circles',
    icon: '🧮',
    title: 'Math Circles',
    period: '2022 – present',
    description: 'Outreach across Gilgit-Baltistan, my home village, and LUMS — 1,200+ teachers and 200+ students reached directly.',
    href: '/experience/math-circles',
    color: 'var(--violet)',
  },
];

/* Private tutoring doesn't have its own /experience/<role> page — the
   detail lives right here instead of behind a "View details" click,
   since there's no separate page to send people to. */
const TUTORING_SUBJECTS = [
  'IB Diploma Math — Analysis & Approaches (SL & HL)',
  'IB Diploma Math — Applications & Interpretation (SL & HL)',
  'O-Level Mathematics',
  'A-Level Mathematics & Additional Mathematics',
  'Oxford NSM',
  'Matriculation / FSc / BSc / ADP Preparation',
  'GRE Quantitative Reasoning',
  'Calculus',
  'Linear Algebra',
];

export default function ExperienceHubPage() {
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
      }}>
        <div className="container" style={{ padding: '64px 32px 56px' }}>
          <span className="eyebrow reveal">Teaching &amp; Mentoring</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            Experience
          </h1>
          <p style={{ maxWidth: '640px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            From LUMS lecture halls to grassroots math circles in Gilgit-Baltistan and one-on-one tutoring —
            teaching has taken a few different shapes since 2022. Here&rsquo;s the full picture.
          </p>
        </div>
      </section>

      {/* ── ROLE CARDS ── */}
      <section className="sk-section-sm">
        <div className="container">
          <div className="exp-hub-grid">
            {ROLES.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="reveal card exp-hub-card"
                style={{ borderTop: `3px solid ${r.color}` }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{r.icon}</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: r.color, letterSpacing: '.04em', marginBottom: '4px' }}>
                  {r.period}
                </div>
                <h3 style={{ fontSize: '.96rem', margin: '0 0 6px', color: 'var(--text)' }}>{r.title}</h3>
                <p style={{ fontSize: '.8rem', color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>{r.description}</p>
                <div style={{ marginTop: '10px', color: r.color, fontFamily: 'var(--fm)', fontSize: '.72rem', fontWeight: 600 }}>
                  View details →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVATE & ONLINE TUTORING ── */}
      <section className="sk-section">
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="reveal card" style={{ padding: '26px 28px', borderTop: '3px solid var(--rose)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text)' }}>
                Private &amp; Online Tutor <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '.9rem' }}>— independent and via Preply</span>
              </h3>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--rose)', whiteSpace: 'nowrap' }}>2016 – Present</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
              {TUTORING_SUBJECTS.map((s) => (
                <span key={s} className="tag" style={{ borderColor: 'rgba(224,107,107,.4)', color: 'var(--rose)', fontSize: '.74rem' }}>
                  {s}
                </span>
              ))}
            </div>

            <p style={{ color: 'var(--text2)', lineHeight: 1.8, margin: 0, fontSize: '.9rem' }}>
              Produces bespoke lecture notes, worked examples, and revision material tailored to each syllabus
              and student.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sk-section sk-section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow reveal">Questions?</span>
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Interested in Working Together?</h2>
          <p className="reveal" style={{ maxWidth: '520px', margin: '0 auto 28px', color: 'var(--text2)' }}>
            Whether it&rsquo;s a course, tutoring, or a Math Circles collaboration — get in touch.
          </p>
          <Link href="/contact" className="btn reveal">Contact Me →</Link>
        </div>
      </section>

      <Footer />

      <style>{`
        .exp-hub-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 760px; }
        .exp-hub-card { display: block; text-decoration: none; padding: 18px 20px; }
      `}</style>
    </>
  );
}
