'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ══════════════════════════════════════════════════════
   As a Teaching Assistant — carried over from the old Google
   Sites portfolio (sites.google.com/view/shoaib-k/experience_1/
   as-a-ta) and its linked sub-pages, plus the current Linear
   Algebra Summer 2026 role (pulled from this site's own
   /courses/linalg page rather than the old site, since that
   course started after the old portfolio was last updated).
   Listed most recent first. Add a new entry here each time a
   new TA assignment starts.
   ══════════════════════════════════════════════════════ */
const TA_COURSES = [
  {
    id: 'la-su26',
    course: 'MATH-120 · Linear Algebra with Differential Equations',
    term: 'Summer 2026',
    instructor: 'Dr. Imran Anwar',
    color: 'var(--amber)',
    description: `Currently TA-ing Linear Algebra with Differential Equations — holding office hours, leading tutorials, and helping keep the course's live weekly schedule and lecture notes up to date.`,
    highlights: [
      { icon: '🕑', text: 'Office hours Mon–Thu 1:00–2:00, Room 9-155 SSE' },
      { icon: '👥', text: 'One of 4 TAs on the course, alongside the instructor' },
    ],
    href: '/courses/linalg',
    hrefLabel: 'View course page →',
  },
  {
    id: 'calc1-sp25',
    course: 'MATH-101 · Calculus',
    term: 'Spring 2025',
    instructor: 'Dr. Adnan Khan & Dr. Imran Anwar',
    color: 'var(--teal)',
    description: `Started TA-ing MATH-101 Calculus, running tutorials spanning limits (informal limits, one-sided limits, limits at infinity, the Squeeze Theorem) through implicit differentiation, linearization, continuity, and integration techniques — one of 10 TAs supporting the course that term.`,
    highlights: [
      { icon: '📝', text: 'Wrote PDF notes and practice problems for major course units' },
      { icon: '🎥', text: 'Produced instructional videos on limits, continuity, derivatives, and inverse trig functions' },
      { icon: '📋', text: 'Developed practice materials and mock exams for midterm/final prep' },
    ],
    href: '/ta/calculus-sp25',
    hrefLabel: 'View course resources →',
  },
  {
    id: 'precal-fa24',
    course: 'MATH-100 · Pre-Calculus',
    term: 'Fall 2024',
    instructor: 'Ayesha Ahmed',
    color: 'var(--violet)',
    description: `One of six TAs for Pre-Calculus — a course for students without an A-levels/F.Sc math background, covering real and complex numbers, equations, functions and their graphs, trigonometry, exponential and logarithmic functions, sequences and series, and conic sections.`,
    highlights: [
      { icon: '🏫', text: 'Led weekly tutorials and held office hours' },
      { icon: '💻', text: 'Designed homework sets on the WEBWORK platform' },
      { icon: '📄', text: 'Wrote quizzes and exams, and reviewed grade contestations' },
    ],
    href: '/ta/precalc-fa24',
    hrefLabel: 'View course resources →',
  },
  {
    id: 'prob-su24',
    course: 'MATH-230 · Probability',
    term: 'Summer 2024',
    instructor: 'Sultan Sial',
    color: 'var(--rose)',
    description: `Conducted weekly tutorials and provided office-hour support for Probability, alongside creating assessments and handling grade contestations.`,
    highlights: [],
    href: null,
  },
  {
    id: 'precal-sp24',
    course: 'MATH-100 · Pre-Calculus',
    term: 'Spring 2024',
    instructor: 'Mariam Siddiq Alvi',
    color: 'var(--amber)',
    description: `TA'd Pre-Calculus alongside co-TA Kousar Pervaiz, covering the algebra and trigonometry students need before calculus.`,
    highlights: [
      { icon: '📚', text: '9 tutorials, 5 quiz solutions, and exam solutions produced for students' },
      { icon: '🎥', text: 'Several tutorials included linked video explanations' },
    ],
    href: '/ta/precalc-sp24',
    hrefLabel: 'View course resources →',
  },
  {
    id: 'precal-fa23',
    course: 'MATH-100 · Pre-Calculus',
    term: 'Fall 2023',
    instructor: 'Ayesha Ahmad',
    color: 'var(--teal)',
    description: `My first TA role at LUMS — developed five homework sets using WEBWORK by MAA, ran tutorials, wrote exams, and handled grade contestations.`,
    highlights: [],
    href: null,
  },
];

export default function TAExperiencePage() {
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
            As a Teaching <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Assistant</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            Six courses, four subjects, and three years of tutorials, office hours, homework design, and exam
            writing at LUMS — from a first Pre-Calculus assignment in Fall 2023 to Linear Algebra today.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="sk-section-sm">
        <div className="container">
          <div className="ta-stats reveal">
            <div className="ta-stat">
              <div className="ta-stat-value" style={{ color: 'var(--amber)' }}>6</div>
              <div className="ta-stat-label">Courses TA&rsquo;d</div>
            </div>
            <div className="ta-stat">
              <div className="ta-stat-value" style={{ color: 'var(--teal)' }}>4</div>
              <div className="ta-stat-label">Distinct subjects</div>
            </div>
            <div className="ta-stat">
              <div className="ta-stat-value" style={{ color: 'var(--violet)' }}>2023–2026</div>
              <div className="ta-stat-label">Terms spanned</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="sk-section sk-section-alt">
        <div className="container">
          <span className="eyebrow reveal">Course by Course</span>
          <h2 className="reveal" style={{ marginBottom: '40px' }}>TA Roles</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {TA_COURSES.map((c) => (
              <div key={c.id} className="reveal card" style={{ padding: '28px 30px', borderTop: `3px solid ${c.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text)' }}>{c.course}</h3>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: c.color, whiteSpace: 'nowrap' }}>{c.term}</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.76rem', color: 'var(--text3)', marginBottom: '16px' }}>
                  👨‍🏫 Instructor: {c.instructor}
                </div>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: c.highlights?.length ? '20px' : 0 }}>
                  {c.description}
                </p>

                {c.highlights?.length > 0 && (
                  <div style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: `3px solid ${c.color}`,
                    borderRadius: '0 10px 10px 0', padding: '16px 18px', display: 'grid', gap: '10px',
                  }}>
                    {c.highlights.map((h) => (
                      <div key={h.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.88rem' }}>
                        <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>{h.icon}</span>
                        <span style={{ color: 'var(--text2)', lineHeight: 1.55 }}>{h.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {c.href && (
                  <Link
                    href={c.href}
                    target={c.href.startsWith('/') ? undefined : '_blank'}
                    rel={c.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                    style={{ display: 'inline-block', marginTop: '18px', color: c.color, textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.8rem', fontWeight: 600 }}
                  >
                    {c.hrefLabel}
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
            Beyond TA-ing, see my work as a course instructor and with LUMS Math Circles outreach.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/experience/instructor" className="btn">As Instructor</Link>
            <Link href="/experience/math-circles" className="btn btn-outline">Math Circles →</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .ta-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
          padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
        }
        .ta-stat { text-align: center; }
        .ta-stat-value { font-family: var(--fh); font-size: 2.1rem; font-weight: 700; line-height: 1.1; }
        .ta-stat-label { font-family: var(--fm); font-size: .72rem; color: var(--text3); margin-top: 6px; }

        @media (max-width: 640px) {
          .ta-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
