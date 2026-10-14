'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════
   Education data — edit here only to update the page
   ══════════════════════════════════════════════════════ */
const DEGREES = [
  {
    id: 'lille',
    period: '2021 – 2022',
    degree: 'M1 Mathématique',
    institution: 'University of Lille',
    country: 'France 🇫🇷',
    flag: '🇫🇷',
    color: 'var(--amber)',
    tags: ['Fully Funded Scholarship', 'International Program'],
    description: `I had the privilege of spending a transformative year in France as a recipient of a fully funded scholarship for the M1 program at the University of Lille. This remarkable opportunity not only broadened my academic horizons but also immersed me in a vibrant cross-cultural setting. Studying alongside students from across Europe sharpened both my mathematical thinking and my ability to work across cultural and linguistic boundaries.`,
    highlights: [
      { icon: '🏅', text: 'Fully funded international scholarship' },
      { icon: '🌍', text: 'Cross-cultural academic environment, Lille, France' },
      { icon: '📐', text: 'Advanced topics in pure and applied mathematics' },
    ],
    image: '/images/lille.jpg',
    imageAlt: 'University of Lille campus',
  },
  {
    id: 'comsats',
    period: '2019 – 2021',
    degree: 'MS Mathematics (IMM)',
    institution: 'COMSATS University Lahore',
    country: 'Pakistan 🇵🇰',
    flag: '🇵🇰',
    color: 'var(--teal)',
    tags: ['International Mathematics Master', 'ICTP Italy Collaboration', 'First Batch'],
    description: `I completed my Master's in Mathematics under the prestigious International Mathematics Master (IMM) programme, launched in 2019 at COMSATS Lahore in collaboration with the Abdus Salam International Centre for Theoretical Physics (ICTP), Trieste, Italy. Only 10 students were selected from across Pakistan, alongside 2 international students from Nigeria, in the inaugural cohort. I was fortunate to be part of this historic first batch. The programme was taught by international faculty drawn from universities across Europe, bringing world-class instruction to Pakistan.`,
    highlights: [
      { icon: '🏆', text: 'Highest CGPA in batch — 3.85 / 4.00' },
      { icon: '🌐', text: 'One of 12 students selected nationally for the inaugural batch' },
      { icon: '🇮🇹', text: 'Collaborated with ICTP Italy — global faculty, European curriculum' },
      { icon: '📗', text: 'Thesis: The Fundamental Group and Classification of Covering Spaces' },
      { icon: '👨‍🏫', text: 'Supervisors: Pavel Putrov (ICTP Italy) & Hani Shaker (COMSATS)' },
    ],
    image: '/images/comsats.jpg',
    imageAlt: 'COMSATS University Lahore campus entrance',
  },
  {
    id: 'gcu',
    period: '2017 – 2019',
    degree: 'MSc Mathematics',
    institution: 'Government College University (GCU)',
    country: 'Pakistan 🇵🇰',
    flag: '🇵🇰',
    color: 'var(--violet)',
    tags: ['Gold Medal', '88% Marks', 'Distinction'],
    description: `My academic foundation was built during my MSc in Mathematics at Government College University (GCU) Lahore — one of Pakistan's most storied institutions, founded in 1864. Over two years I studied 24 different mathematical subjects spanning analysis, algebra, topology, differential equations, and statistics. I graduated at the top of my batch and was awarded the Gold Medal for academic distinction — a recognition that set the direction for everything that followed.`,
    highlights: [
      { icon: '🥇', text: 'Gold Medal — Highest CGPA in batch' },
      { icon: '📊', text: '88% aggregate marks across 24 subjects' },
      { icon: '🏛️', text: 'GCU Lahore — founded 1864, one of Pakistan\'s oldest universities' },
      { icon: '📚', text: '24 subjects across 2 years: analysis, algebra, topology, statistics & more' },
    ],
    image: '/images/gcu.jpg',
    imageAlt: 'GCU Lahore aerial view',
  },
  {
    // Timeline-only stop: no "Each Chapter" detail section
    id: 'bsc',
    timelineOnly: true,
    period: '2015 – 2017',
    degree: 'BSc',
    institution: 'Govt. Farid Bux Gousia Degree Science College',
    note: 'Pir Mahal · affiliated with GCU Faisalabad',
    country: 'Pakistan 🇵🇰',
    flag: '🇵🇰',
    color: 'var(--blue, #5b8def)',
    tags: ['Bachelor of Science'],
    image: '/images/33clg.jpg',
    imageAlt: 'Govt. Farid Bux Gousia Degree Science College, 333GB Pir Mahal',
  },
];


/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
export default function Education() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activePage="education" />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'calc(var(--nav-h) + 3px)',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative glow */}
        <div style={{
          position: 'absolute', right: '-100px', top: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(232,160,32,.05), transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ padding: '64px 32px 56px' }}>
          <span className="eyebrow reveal">Academic Journey</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '600px' }} className="reveal">
            Education &amp; <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Qualifications</em>
          </h1>
          <p style={{ maxWidth: '560px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            From a Gold Medal at GCU to an international Masters programme built in collaboration with ICTP Italy, and a fully funded year in France — a journey across continents and disciplines.
          </p>
        </div>
      </section>

      {/* ── TIMELINE: horizontal wave ── */}
      <section className="sk-section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <span className="eyebrow reveal">Chronological</span>
          <h2 className="reveal" style={{ marginBottom: '8px' }}>The Path</h2>
          <p className="reveal" style={{ color: 'var(--text2)', marginBottom: '40px' }}>
            From college in Pir Mahal to a year in France — tap a stop to jump to its chapter.
          </p>

          <div className="wave reveal">
            {/* Wavy path (desktop) */}
            <svg className="wave-svg" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--blue, #5b8def)" />
                  <stop offset="35%" stopColor="var(--violet)" />
                  <stop offset="68%" stopColor="var(--teal)" />
                  <stop offset="100%" stopColor="var(--amber)" />
                </linearGradient>
              </defs>
              <path className="wave-bg"
                d="M0,100 C60,100 60,50 125,50 C250,50 250,150 375,150 C500,150 500,50 625,50 C750,50 750,150 875,150 C940,150 940,100 1000,100"
                fill="none" vectorEffect="non-scaling-stroke" />
              <path className="wave-line" pathLength="1"
                d="M0,100 C60,100 60,50 125,50 C250,50 250,150 375,150 C500,150 500,50 625,50 C750,50 750,150 875,150 C940,150 940,100 1000,100"
                fill="none" stroke="url(#waveGrad)" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="wave-stops">
              {[...DEGREES].reverse().map((deg, i) => (
                <a key={deg.id} href={deg.timelineOnly ? undefined : `#${deg.id}`}
                  className={`wave-stop wave-stop-${i}`} style={{ '--c': deg.color, cursor: deg.timelineOnly ? 'default' : 'pointer' }}>
                  <div className="wave-node">
                    <span>{deg.flag}</span>
                    {deg.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={deg.image} alt={deg.imageAlt} className="wave-img"
                        onError={e => { e.currentTarget.style.display = 'none'; }} />
                    )}
                    <i className="wave-flag">{deg.flag}</i>
                  </div>
                  <div className="wave-stem" />
                  <div className="wave-card">
                    <div className="wave-period">{deg.period}</div>
                    <h3>{deg.degree}</h3>
                    <div className="wave-inst">{deg.institution}</div>
                    {deg.note && <div className="wave-inst" style={{ marginTop: '-6px' }}>{deg.note}</div>}
                    <span className="tag tag-amber" style={{ fontSize: '.6rem' }}>{deg.tags[0]}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DETAILED CARDS (mobile-friendly flat list) ── */}
      <section className="sk-section sk-section-alt" id="details">
        <div className="container">
          <span className="eyebrow reveal">In Detail</span>
          <h2 className="reveal">Each Chapter</h2>
          <p className="reveal" style={{ maxWidth: '560px', marginBottom: '48px' }}>
            Every degree shaped a different facet — foundation, depth, and international breadth.
          </p>

          {DEGREES.filter(d => !d.timelineOnly).map((deg, idx) => (
            <DetailCard key={deg.id} deg={deg} idx={idx} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="sk-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow reveal">What's Next</span>
          <h2 className="reveal">Currently at LUMS</h2>
          <p className="reveal" style={{ maxWidth: '520px', margin: '0 auto 32px', color: 'var(--text2)' }}>
            Teaching Fellow and research assistant at the Lahore University of Management Sciences, researching mathematical epidemiology.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" className="btn">View My Courses</Link>
            <Link href="/research" className="btn btn-outline">Research Work →</Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Responsive styles scoped to this page */}
      <style>{`
        .wave { position: relative; }
        .wave-svg { position: absolute; left: 0; top: 0; width: 100%; height: 200px; overflow: visible; }
        .wave-bg { stroke: var(--border); stroke-width: 2; stroke-dasharray: 3 7; }
        .wave-line { stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 2.2s ease; }
        .wave.visible .wave-line { stroke-dashoffset: 0; }
        .wave-stops { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); }
        .wave-stop { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; }
        .wave-stop-0, .wave-stop-2 { padding-top: 18px; }
        .wave-stop-1, .wave-stop-3 { padding-top: 118px; }
        .wave-node { position: relative; width: 84px; height: 84px; border-radius: 50%; border: 4px solid var(--c);
          background: var(--bg2); box-shadow: 0 0 0 7px var(--bg), 0 8px 24px rgba(0,0,0,.18);
          display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
          transition: transform .3s ease; }
        .wave-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .wave-flag { position: absolute; right: -8px; bottom: -6px; font-style: normal; font-size: 1rem;
          background: var(--bg2); border: 2px solid var(--c); border-radius: 50%; width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center; }
        .wave-stop:hover .wave-node { transform: scale(1.1) rotate(-3deg); }
        .wave-stem { width: 0; height: 28px; border-left: 2px dotted var(--c); }
        .wave-stop-1 .wave-stem { height: 28px; }
        .wave-card { text-align: center; max-width: 250px; padding: 14px 16px; background: var(--surface);
          border: 1px solid var(--border); border-bottom: 3px solid var(--c); border-radius: var(--radius);
          box-shadow: var(--shadow-sm); transition: transform .3s ease, box-shadow .3s ease; }
        .wave-stop:hover .wave-card { transform: translateY(-4px); box-shadow: var(--shadow); }
        .wave-period { font-family: var(--fm); font-size: .68rem; letter-spacing: .1em; color: var(--c); margin-bottom: 4px; }
        .wave-card h3 { font-size: 1rem; margin: 0 0 4px; color: var(--text); }
        .wave-inst { font-family: var(--fm); font-size: .7rem; color: var(--text3); margin-bottom: 10px; }
        @media (max-width: 760px) {
          .wave-svg { display: none; }
          .wave-stops { grid-template-columns: 1fr; gap: 28px; padding-left: 0; }
          .wave-stop-0, .wave-stop-1, .wave-stop-2, .wave-stop-3 { padding-top: 0; }
          .wave-card { max-width: 100%; width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) { .wave-line { transition: none; } }
      `}</style>
    </>
  );
}

/* ── Full detail card (used in "Each Chapter" section) ── */
function DetailCard({ deg, idx }) {
  const isEven = idx % 2 === 0;
  return (
    <div id={deg.id} className="reveal" style={{
      scrollMarginTop: '90px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '48px',
      alignItems: 'center',
      marginBottom: '80px',
      direction: isEven ? 'ltr' : 'rtl',
    }}>
      {/* Text side */}
      <div style={{ direction: 'ltr' }}>
        <span className="eyebrow" style={{ color: deg.color, letterSpacing: '.18em' }}>
          {deg.period} · {deg.country}
        </span>
        <h2 style={{ marginBottom: '4px', fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>{deg.degree}</h2>
        <div style={{
          fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--text3)',
          marginBottom: '20px', letterSpacing: '.04em',
        }}>
          {deg.institution}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {deg.tags.map(t => (
            <span key={t} className="tag" style={{ borderColor: `${deg.color}50`, color: deg.color }}>{t}</span>
          ))}
        </div>

        <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '24px' }}>
          {deg.description}
        </p>

        <div style={{
          background: 'var(--surface)',
          border: `1px solid var(--border)`,
          borderLeft: `3px solid ${deg.color}`,
          borderRadius: '0 10px 10px 0',
          padding: '18px 20px',
          display: 'grid', gap: '10px',
        }}>
          {deg.highlights.map(h => (
            <div key={h.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '.9rem' }}>
              <span style={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }}>{h.icon}</span>
              <span style={{ color: 'var(--text2)', lineHeight: 1.5 }}>{h.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual side */}
      <div style={{ direction: 'ltr' }}>
        <div style={{
          background: 'var(--surface)',
          border: `1px solid var(--border)`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
          aspectRatio: '4/3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {deg.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={deg.image} alt={deg.imageAlt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            /* Placeholder — replace with real image */
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, var(--bg) 0%, var(--bg3) 100%)`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '16px',
              padding: '32px',
            }}>
              <div style={{ fontSize: '3.5rem' }}>{deg.flag}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--fh)', fontSize: '1.4rem',
                  color: deg.color, fontWeight: 600, marginBottom: '8px',
                }}>
                  {deg.institution}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '.7rem',
                  color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase',
                }}>
                  {deg.period}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '.66rem',
                color: 'var(--text3)', marginTop: '8px', textAlign: 'center',
                fontStyle: 'italic',
              }}>
                add image to /public/images/{deg.id}.jpg
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile responsive: stack vertically */}
      <style>{`
        @media(max-width:720px){
          .detail-grid-${deg.id} {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
      `}</style>
    </div>
  );
}

