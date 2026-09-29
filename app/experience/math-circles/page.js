'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ══════════════════════════════════════════════════════
   Math Circles — carried over in full from the old Google
   Sites portfolio (sites.google.com/view/shoaib-k/experience_1/
   math-circles) and its four linked sub-pages. Add a new entry
   here whenever another Math Circle initiative happens.
   ══════════════════════════════════════════════════════ */
const INITIATIVES = [
  {
    id: 'gb-fellows-2024',
    title: 'Education Fellows Training — Gilgit-Baltistan',
    period: 'Oct 15 – Nov 12, 2024',
    color: 'var(--amber)',
    location: 'Skardu, Kharmang, Ghanche & Diamer, Gilgit-Baltistan',
    description: `A one-month program, in partnership with the Gilgit-Baltistan government and Agha Khan University, training newly hired education fellows across the region in "Gamifying Math Teaching" — an approach to make mathematics engaging and fun for students. 1,200 fellows were trained across all 10 districts of Gilgit-Baltistan; I personally travelled to and taught in 4 of them.`,
    stats: [
      { label: 'Teachers trained', value: '1,200' },
      { label: 'Districts (GB-wide)', value: '10' },
      { label: 'Districts visited personally', value: '4' },
    ],
    highlights: [
      { icon: '🎲', text: 'Gamified exercises — turning math problems into participatory games' },
      { icon: '🖥️', text: 'Interactive tools — visual aids and digital resources for complex topics' },
      { icon: '🌍', text: 'Practical applications — real-world, scenario-based instruction' },
      { icon: '☀️', text: 'When training venues lost electricity, local communities stepped in with solar power so sessions could continue' },
    ],
    districts: [
      { district: 'Skardu', withWhom: 'Dr. Waqas Ali Azhar' },
      { district: 'Kharmang', withWhom: 'Dr. Waqas Ali Azhar' },
      { district: 'Ghanche', withWhom: 'Dr. Imran Anwar' },
      { district: 'Diamer', withWhom: 'Dr. Adnan Khan' },
    ],
  },
  {
    id: 'syedanwala-2024',
    title: 'Syedanwala Summer Camp',
    period: 'Summer 2024',
    color: 'var(--teal)',
    location: 'Syedanwala Higher Secondary School, District Kasur',
    description: `A one-month summer program at Syedanwala Higher Secondary School, serving students in grades 6–8 with hands-on problem-solving instruction alongside teacher training for the school's own staff.`,
    highlights: [],
  },
  {
    id: 'gb-bootcamp-2023',
    title: 'GB Summer Fiesta BootCamp',
    period: '2023 · 10 days',
    color: 'var(--violet)',
    location: 'Ghanche District, Gilgit-Baltistan',
    description: `The Gilgit-Baltistan government's "Summer Fiesta" — a ten-day camp redefining schools as centers of learning and enjoyment over the summer, combining creative learning, extracurriculars, health awareness, field trips, sports, entrepreneurship training, IT bootcamps, and robotics. It brought together the private sector, NGOs, banks, IT institutions, LUMS, NUST, philanthropists, and civil society. LUMS deployed 45 people in 9 teams of 5 — one team per district — each team pairing a leader with four instructors across math circles, machine learning, design thinking, renewable energy, and computer learning.`,
    highlights: [
      { icon: '📍', text: 'Assigned to Ghanche district as Math Circle instructor, two weeks' },
      { icon: '👥', text: '~200 students reached (about 100 per week)' },
      { icon: '⭕', text: 'Taught concepts through games — including enlarging circles to introduce the idea of infinity' },
      { icon: '🪐', text: 'Ran the "Jumping Julia" activity as a hands-on favorite' },
    ],
  },
  {
    id: 'home-village-2022',
    title: 'Math Circle in My Home Village',
    period: 'November 7, 2022',
    color: 'var(--rose)',
    location: 'Chak 678 GB Khair Shah, Tehsil Pirmahal, District Toba Tek Singh',
    description: `I became the first PhD student at LUMS to set up a Math Circle in his own village — running two sessions in one day at the village's two government schools (Government Primary School for Boys and Government Middle School for Girls). Dr. Waqas Ali Azhar of the LUMS Math Department later wrote about the initiative in a blog post titled "A candle that lights another loses nothing," calling it "the beginning of a new journey of LUMS Math Circles to inspire young instructors to promote Mathematics at the grassroot level."`,
    highlights: [],
  },
  {
    id: 'lums-volunteer',
    title: 'Volunteer, LUMS Math Circles',
    period: 'Ongoing · Bi-weekly',
    color: 'var(--amber)',
    location: 'LUMS, Lahore',
    description: `Beyond leading my own sessions, I volunteer with LUMS Math Circles' own bi-weekly events at the Math Department — the organization whose mission every initiative above builds on.`,
    href: 'https://sites.google.com/view/lumsmathcircles/home',
    hrefLabel: 'Visit LUMS Math Circles →',
    highlights: [],
  },
];

export default function MathCirclesPage() {
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
          <span className="eyebrow reveal">Experience · Outreach</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            Math <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Circles</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            Taking mathematics outside the LUMS classroom — to government schools, remote districts of
            Gilgit-Baltistan, and my own home village — through LUMS Math Circles, a program that trains
            teachers and runs hands-on sessions for school students across Pakistan.
          </p>
        </div>
      </section>

      {/* ── IMPACT STRIP ── */}
      <section className="sk-section-sm">
        <div className="container">
          <div className="mc-stats reveal">
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--amber)' }}>1,200+</div>
              <div className="mc-stat-label">Teachers trained</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--teal)' }}>200+</div>
              <div className="mc-stat-label">Students taught directly</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--violet)' }}>5</div>
              <div className="mc-stat-label">Districts &amp; villages reached</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--rose)' }}>2</div>
              <div className="mc-stat-label">Provinces — Punjab &amp; GB</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INITIATIVES ── */}
      <section className="sk-section sk-section-alt">
        <div className="container">
          <span className="eyebrow reveal">The Work</span>
          <h2 className="reveal" style={{ marginBottom: '40px' }}>Initiatives</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {INITIATIVES.map((init) => (
              <div key={init.id} className="reveal card" style={{ padding: '28px 30px', borderTop: `3px solid ${init.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text)' }}>{init.title}</h3>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: init.color, whiteSpace: 'nowrap' }}>{init.period}</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.76rem', color: 'var(--text3)', marginBottom: '16px' }}>
                  📍 {init.location}
                </div>
                <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: init.highlights?.length || init.stats?.length ? '20px' : 0 }}>
                  {init.description}
                </p>

                {init.stats?.length > 0 && (
                  <div className="mc-mini-stats" style={{ marginBottom: '20px' }}>
                    {init.stats.map((s) => (
                      <div key={s.label} className="mc-mini-stat">
                        <div className="mc-mini-stat-value" style={{ color: init.color }}>{s.value}</div>
                        <div className="mc-mini-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {init.highlights?.length > 0 && (
                  <div style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: `3px solid ${init.color}`,
                    borderRadius: '0 10px 10px 0', padding: '16px 18px', display: 'grid', gap: '10px', marginBottom: init.districts ? '20px' : 0,
                  }}>
                    {init.highlights.map((h) => (
                      <div key={h.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.88rem' }}>
                        <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>{h.icon}</span>
                        <span style={{ color: 'var(--text2)', lineHeight: 1.55 }}>{h.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {init.districts && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {init.districts.map((d) => (
                      <span key={d.district} className="tag" style={{ borderColor: `${init.color}50`, color: init.color, fontSize: '.7rem' }}>
                        {d.district} — with {d.withWhom}
                      </span>
                    ))}
                  </div>
                )}

                {init.href && (
                  <Link href={init.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '18px', color: init.color, textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.8rem', fontWeight: 600 }}>
                    {init.hrefLabel}
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
            Math Circles is one part of a broader teaching practice — see my work as a course instructor and
            teaching fellow at LUMS as well.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/experience/instructor" className="btn">As Instructor</Link>
            <Link href="/experience/ta" className="btn btn-outline">As Teaching Assistant</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .mc-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
        }
        .mc-stat { text-align: center; }
        .mc-stat-value { font-family: var(--fh); font-size: 2.1rem; font-weight: 700; line-height: 1.1; }
        .mc-stat-label { font-family: var(--fm); font-size: .72rem; color: var(--text3); margin-top: 6px; }

        .mc-mini-stats { display: flex; gap: 24px; flex-wrap: wrap; }
        .mc-mini-stat-value { font-family: var(--fm); font-size: 1.3rem; font-weight: 700; }
        .mc-mini-stat-label { font-family: var(--fm); font-size: .68rem; color: var(--text3); margin-top: 2px; }

        @media (max-width: 640px) {
          .mc-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
