'use client';

import { useEffect, useRef, useState } from 'react';
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
    id: 'learning-alliance-2026',
    title: 'Teacher Training — Learning Alliance International School',
    period: 'November 14, 2026',
    color: 'var(--violet)',
    location: 'Learning Alliance International School, DHA, Lahore',
    description: `I joined Dr. Waqas Ali Azhar and Dr. Imran Anwar as an assistant for a teacher-training session. We ran a series of hands-on activities so teachers could take them back and run them in their own classrooms, building more interest in mathematics among their students.`,
    highlights: [
      { icon: '👩‍🏫', text: 'Around 70 female instructors from the junior sections trained' },
      { icon: '🎒', text: 'Activities designed to be reused directly in the classroom' },
    ],
  },
  {
    id: 'jaada-2026',
    title: 'Math Circle at LUMS — Jaada School System',
    period: 'November 13, 2026',
    color: 'var(--amber)',
    location: 'LUMS, Lahore',
    description: `Jaada School System brought its Grade 1–3 students to LUMS, where we ran a Math Circle built around several activities, including the Hidden Dice Sum, the Jumping Julia and the Skyscrapers.`,
    highlights: [
      { icon: '👥', text: '66 students, Grades 1–3 (boys and girls)' },
      { icon: '🎲', text: 'Hidden Dice Sum · Jumping Julia · Skyscrapers' },
    ],
  },
  {
    id: 'roshni-2026',
    title: 'Math Circle — Roshni Public Foundation School',
    period: 'October 26, 2026',
    color: 'var(--rose)',
    location: 'Roshni Public Foundation School, Chak 678 GB Khair Shah',
    description: `A return to my home village, this time at Roshni Public Foundation School, with a set of short activities including Magic Sum, Knotting the Rope and teamwork exercises.`,
    highlights: [
      { icon: '👥', text: '30 students — 15 boys and 15 girls' },
      { icon: '🪢', text: 'Magic Sum · Knotting the Rope · teamwork lessons' },
    ],
  },
  {
    id: 'syedanwala-tiling-2026',
    title: 'Math Circle — Tiling at Syedanwala',
    period: 'October 16, 2026',
    color: 'var(--teal)',
    location: 'Syedanwala Higher Secondary School (Girls & Boys), Qasoor',
    description: `Accompanied by Arham Khawaja, I ran a session on tiling: which regular shapes tile the plane, which do not, and why. Through a handful of guided activities the students discovered the general formula themselves.`,
    highlights: [
      { icon: '👥', text: '140+ students — 70+ boys and 70+ girls' },
      { icon: '🔷', text: 'Topic: tiling with regular polygons and the general formula behind it' },
      { icon: '🤝', text: 'With Arham Khawaja' },
    ],
  },
  {
    id: 'gb-fellows-2024',
    title: 'Education Fellows Training — Gilgit-Baltistan',
    period: 'Oct 15 – Nov 12, 2024',
    color: 'var(--amber)',
    location: 'Skardu, Kharmang, Ghanche & Diamer, Gilgit-Baltistan',
    description: `A one-month program, in partnership with the Gilgit-Baltistan government and Agha Khan University, training newly hired education fellows across the region in "Gamifying Math Teaching" — an approach to make mathematics engaging and fun for students. 1,200 fellows were trained across all 10 districts of Gilgit-Baltistan in total; I personally travelled to 4 of those districts and directly trained around 200+ of the fellows myself.`,
    stats: [
      { label: 'Teachers trained (personally)', value: '200+' },
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
    id: 'syedanwala-2024-25',
    title: 'Syedanwala Summer School',
    period: '2024 & 2025',
    color: 'var(--teal)',
    location: 'Syedanwala Higher Secondary School, District Kasur',
    description: `A one-month summer program at Syedanwala Higher Secondary School, serving students in grades 6–8 with hands-on problem-solving instruction alongside teacher training for the school's own staff.`,
    highlights: [
      { icon: '👥', text: '~250 students trained (roughly equal boys and girls)' },
      { icon: '📍', text: 'Qasoor Campus (2025): a further 130 students, all girls' },
    ],
  },
  {
    id: 'gb-bootcamp-2023',
    title: 'GB Summer Fiesta BootCamp',
    period: '2023 · 2 weeks',
    color: 'var(--violet)',
    location: 'Khaplu, Ghanche District, Gilgit-Baltistan',
    description: `The Gilgit-Baltistan government's "Summer Fiesta" — a ten-day camp redefining schools as centers of learning and enjoyment over the summer, combining creative learning, extracurriculars, health awareness, field trips, sports, entrepreneurship training, IT bootcamps, and robotics. It brought together the private sector, NGOs, banks, IT institutions, LUMS, NUST, philanthropists, and civil society. LUMS deployed 45 people in 9 teams of 5 — one team per district — each team pairing a leader with four instructors across math circles, machine learning, design thinking, renewable energy, and computer learning.`,
    highlights: [
      { icon: '📍', text: 'Assigned to Khaplu, Ghanche district as Math Circle instructor, two weeks' },
      { icon: '👥', text: '150+ female students trained' },
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
    description: `I became the first LUMS Teaching Fellow to set up a Math Circle in his own village — running two sessions in one day at the village's two government schools (Government Primary School for Boys and Government Middle School for Girls). Dr. Waqas Ali Azhar of the LUMS Math Department later wrote about the initiative in a blog post titled "A candle that lights another loses nothing," calling it "the beginning of a new journey of LUMS Math Circles to inspire young instructors to promote Mathematics at the grassroot level."`,
    highlights: [
      { icon: '👥', text: '~100 students reached (roughly equal boys and girls)' },
    ],
  },
  {
    id: 'gojra-girls',
    title: 'Math Circle — Gojra Girls High School',
    period: '',
    color: 'var(--teal)',
    location: 'Gojra, District Toba Tek Singh',
    description: `A Math Circle session for students at Gojra Girls High School.`,
    highlights: [
      { icon: '👥', text: '120+ students trained (all girls)' },
    ],
  },
  {
    id: 'lahore-science-mela',
    title: 'Lahore Science Mela',
    period: '2023 & 2025',
    color: 'var(--amber)',
    location: 'Lahore, Punjab',
    description: `A Math Circle presence at the Lahore Science Mela, a public science festival, across two editions.`,
    highlights: [
      { icon: '👥', text: '200+ students reached (roughly equal boys and girls)' },
    ],
  },
  {
    id: 'lums-volunteer',
    title: 'Volunteer, LUMS Math Circles',
    period: 'Ongoing · Bi-weekly',
    color: 'var(--rose)',
    location: 'LUMS, Lahore',
    description: `Beyond leading my own sessions, I volunteer with LUMS Math Circles' own bi-weekly events at the Math Department — the organization whose mission every initiative above builds on.`,
    highlights: [
      { icon: '🏛️', text: 'Epsilon (on-campus circle): 50+ students reached (roughly equal boys and girls)' },
      { icon: '📅', text: 'In-house activities, 2022–2024 (as volunteer): 300+ students reached' },
    ],
    href: 'https://sites.google.com/view/lumsmathcircles/home',
    hrefLabel: 'Visit LUMS Math Circles →',
  },
];

/* Count-up number that animates once when scrolled into view */
function CountUp({ to, suffix = '', comma = false }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(to); return; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{comma ? n.toLocaleString('en-US') : n}{suffix}</span>;
}

/* Decorative hero background: hexagonal tiling, concentric circles,
   floating math symbols and a dotted orbit. Pure SVG + CSS. */
function HeroArt() {
  const hexes = [];
  const R = 34, w = Math.sqrt(3) * R;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 9; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * R * 1.5;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI / 180 * (60 * i - 30);
        return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      const fill = (row * 3 + col) % 5 === 0 ? 'var(--amber)' : (row + col * 2) % 7 === 0 ? 'var(--teal)' : 'none';
      hexes.push(<polygon key={`${row}-${col}`} points={pts} fill={fill} fillOpacity={fill === 'none' ? 0 : 0.14} stroke="var(--amber)" strokeOpacity="0.22" strokeWidth="1" />);
    }
  }
  const symbols = [
    { s: 'π', x: '58%', y: '14%', c: 'var(--amber)', d: 0, size: 54 },
    { s: '∞', x: '82%', y: '58%', c: 'var(--teal)', d: 1.2, size: 64 },
    { s: 'Σ', x: '68%', y: '72%', c: 'var(--violet)', d: 2.4, size: 44 },
    { s: '√', x: '90%', y: '16%', c: 'var(--rose)', d: 3.1, size: 48 },
    { s: 'φ', x: '47%', y: '66%', c: 'var(--amber)', d: 0.6, size: 38 },
    { s: '∆', x: '76%', y: '34%', c: 'var(--teal)', d: 1.9, size: 40 },
  ];
  return (
    <div aria-hidden="true" className="mc-art">
      <svg className="mc-hex" width="340" height="300" viewBox="0 0 330 310">{hexes}</svg>
      <svg className="mc-rings" viewBox="-200 -200 400 400" width="460" height="460">
        {[40, 80, 120, 160, 190].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke={i % 2 ? 'var(--teal)' : 'var(--amber)'} strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray={i % 2 ? '3 7' : undefined} />
        ))}
        <g className="mc-orbit">
          <circle cx="120" cy="0" r="6" fill="var(--amber)" fillOpacity=".7" />
          <circle cx="-160" cy="0" r="5" fill="var(--teal)" fillOpacity=".7" />
          <circle cx="0" cy="190" r="4" fill="var(--rose)" fillOpacity=".7" />
        </g>
      </svg>
      <svg className="mc-tri" viewBox="0 0 120 104" width="120" height="104">
        <polygon points="60,4 116,100 4,100" fill="var(--violet)" fillOpacity=".1" stroke="var(--violet)" strokeOpacity=".35" strokeWidth="1.5" />
        <polygon points="60,36 88,84 32,84" fill="none" stroke="var(--violet)" strokeOpacity=".3" strokeWidth="1.2" />
      </svg>
      {symbols.map((m) => (
        <span key={m.s} className="mc-sym" style={{ left: m.x, top: m.y, color: m.c, fontSize: m.size, animationDelay: `${m.d}s` }}>{m.s}</span>
      ))}
    </div>
  );
}

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
        <HeroArt />
        <div className="container" style={{ padding: '64px 32px 56px', position: 'relative', zIndex: 1 }}>
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
              <div className="mc-stat-value" style={{ color: 'var(--amber)' }}><CountUp to={270} suffix="+" /></div>
              <div className="mc-stat-label">Teachers trained directly</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--teal)' }}><CountUp to={1500} suffix="+" comma /></div>
              <div className="mc-stat-label">Students taught directly</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--violet)' }}><CountUp to={7} /></div>
              <div className="mc-stat-label">Districts reached</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value" style={{ color: 'var(--rose)' }}><CountUp to={2} /></div>
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

        .mc-stat { transition: transform .25s ease; }
        .mc-stat:hover { transform: translateY(-4px); }
        .mc-stats { position: relative; overflow: hidden; }
        .mc-stats::before {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 3px;
          background: linear-gradient(90deg, var(--amber), var(--teal), var(--violet), var(--rose));
        }

        .mc-art { position: absolute; inset: 0; pointer-events: none; overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 45%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 45%); }
        .mc-hex { position: absolute; right: 0; top: 0; opacity: .9; }
        .mc-rings { position: absolute; right: 6%; top: 50%; margin-top: -230px; }
        .mc-orbit { transform-origin: 0 0; animation: mc-spin 40s linear infinite; }
        .mc-tri { position: absolute; right: 30%; bottom: 18px; animation: mc-float 7s ease-in-out infinite; }
        .mc-sym { position: absolute; font-family: var(--fh); font-style: italic; opacity: .3;
          animation: mc-float 6s ease-in-out infinite; }
        @keyframes mc-spin { to { transform: rotate(360deg); } }
        @keyframes mc-float { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
        @media (prefers-reduced-motion: reduce) { .mc-orbit, .mc-tri, .mc-sym { animation: none; } }

        @media (max-width: 640px) {
          .mc-stats { grid-template-columns: repeat(2, 1fr); }
          .mc-art { -webkit-mask-image: none; mask-image: none; opacity: .5; }
        }
      `}</style>
    </>
  );
}
