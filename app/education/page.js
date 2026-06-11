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
    image: null, // Add path like '/images/lille.jpg' when available
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
    image: null, // Add '/images/comsats.jpg' when available
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
    image: null, // Add '/images/gcu.jpg' when available
    imageAlt: 'GCU Lahore aerial view',
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

      {/* ── TIMELINE ── */}
      <section className="sk-section">
        <div className="container">
          <span className="eyebrow reveal">Chronological</span>
          <h2 className="reveal" style={{ marginBottom: '48px' }}>The Path</h2>

          <div style={{ position: 'relative' }}>

            {/* Vertical timeline line — desktop only */}
            <div style={{
              position: 'absolute', left: '50%', top: '0', bottom: '0',
              width: '2px', background: 'var(--border)',
              transform: 'translateX(-50%)',
            }} className="tl-line" />

            {DEGREES.map((deg, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={deg.id} className="reveal tl-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 1fr',
                  gap: '0',
                  marginBottom: '64px',
                  alignItems: 'start',
                }}>
                  {/* Left content or spacer */}
                  {isLeft ? (
                    <DegreeCard deg={deg} align="right" />
                  ) : (
                    <div /> /* spacer */
                  )}

                  {/* Centre dot */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--bg2)', border: `3px solid ${deg.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0, zIndex: 1, position: 'relative',
                      boxShadow: `0 0 0 6px var(--bg)`,
                    }}>
                      {deg.flag}
                    </div>
                    <div style={{
                      fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)',
                      letterSpacing: '.06em', marginTop: '10px', textAlign: 'center', whiteSpace: 'nowrap',
                    }}>
                      {deg.period}
                    </div>
                  </div>

                  {/* Right content or spacer */}
                  {!isLeft ? (
                    <DegreeCard deg={deg} align="left" />
                  ) : (
                    <div /> /* spacer */
                  )}
                </div>
              );
            })}
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

          {DEGREES.map((deg, idx) => (
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
            Teaching fellow and research assistant at the Lahore University of Management Sciences, pursuing doctoral research in mathematical epidemiology.
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
        @media (max-width: 760px) {
          .tl-line { display: none !important; }
          .tl-row {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .tl-row > div:nth-child(2) { margin: 0 auto 16px !important; }
          .tl-row > div:nth-child(3) { display: none !important; }
        }
      `}</style>
    </>
  );
}

/* ── Timeline dot card (compact, used in timeline section) ── */
function DegreeCard({ deg, align }) {
  return (
    <div style={{
      textAlign: align,
      padding: align === 'right' ? '16px 32px 16px 0' : '16px 0 16px 32px',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: `3px solid ${deg.color}`,
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        maxWidth: '380px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {deg.tags.slice(0, 2).map(t => (
            <span key={t} className="tag tag-amber" style={{ fontSize: '.6rem' }}>{t}</span>
          ))}
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text)' }}>{deg.degree}</h3>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.75rem', color: 'var(--text3)', marginBottom: '6px' }}>
          {deg.institution} · {deg.country}
        </div>
        <p style={{ fontSize: '.86rem', color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>
          {deg.description.slice(0, 120)}…
        </p>
      </div>
    </div>
  );
}

/* ── Full detail card (used in "Each Chapter" section) ── */
function DetailCard({ deg, idx }) {
  const isEven = idx % 2 === 0;
  return (
    <div className="reveal" style={{
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

