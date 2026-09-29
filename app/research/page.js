'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════
   Past / class projects — carried over from the old Google
   Sites portfolio (sites.google.com/view/shoaib-k/education/
   projects). Add a new entry here whenever another project
   report is ready to link.
   ══════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'schemes',
    title: 'Schemes as Varieties',
    date: 'May 2023',
    context: 'MATH-523: Elements of Algebraic Geometry',
    supervisor: 'Dr. Shaheen Nazir',
    institution: 'LUMS, Pakistan',
    href: 'https://drive.google.com/file/d/10LY9ZuupVN5a3ox-dxObHmIy4CenPAcg/view?usp=sharing',
    color: 'var(--amber)',
  },
  {
    id: 'euler',
    title: 'Euler Characteristics',
    date: 'April 2023',
    context: 'MATH-507: Advanced General Topology',
    supervisor: 'Dr. Haniya Azam',
    institution: 'LUMS, Pakistan',
    href: 'https://drive.google.com/file/d/131y9S0JvxfFjOz7BvsVRHYukOUhkuI1w/view?usp=sharing',
    color: 'var(--teal)',
  },
  {
    id: 'functional-analysis',
    title: 'Big Theorems of Functional Analysis',
    date: 'June 2022',
    context: 'M1 TER Project · Master-1 in Mathematics',
    supervisor: 'Catalin Badea',
    institution: 'University of Lille, France',
    href: 'https://drive.google.com/file/d/1R8ytNrwucQtY5DAIbplGhvuhAF8akR6A/view?usp=sharing',
    color: 'var(--violet)',
  },
  {
    id: 'borel-sets',
    title: 'Construction of Borel Sets',
    date: 'March 2022',
    context: 'Anglais Mathématique',
    supervisor: 'Gautami Bhowmik',
    institution: 'University of Lille, France',
    href: 'https://drive.google.com/file/d/1w9HuwZprDXbRH4EebV8uZkKpdR3l2sEv/view?usp=sharing',
    color: 'var(--rose)',
  },
  {
    id: 'fundamental-group',
    title: 'The Fundamental Group and Classification of Covering Spaces',
    date: 'May 2021',
    context: 'MS Thesis · International Mathematics Master',
    supervisor: 'Pavel Putrov (ICTP Italy) & Hani Shaker (COMSATS Lahore)',
    institution: 'COMSATS University Lahore',
    href: null,
    color: 'var(--amber)',
  },
];

export default function ResearchPage() {
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
      <Navbar activePage="research" />

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
          <span className="eyebrow reveal">Doctoral Research</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            Mathematical Epidemiology &amp; <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Optimal Control</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            Why does the flu sometimes turn deadly? I use mathematics to model how diseases spread together,
            and to work out the smartest way to vaccinate a population when resources are limited.
          </p>
        </div>
      </section>

      {/* ── THE STORY ── */}
      <section className="sk-section">
        <div className="container" style={{ maxWidth: '780px' }}>
          <span className="eyebrow reveal">The Question</span>
          <h2 className="reveal" style={{ marginBottom: '24px' }}>Why does the flu sometimes turn deadly?</h2>

          <div className="reveal" style={{ color: 'var(--text2)', lineHeight: 1.9, fontSize: '1.02rem' }}>
            <p>
              Imagine a child with a simple flu. A few days later, she is in the hospital with pneumonia.
              The flu didn&rsquo;t cause it directly — it weakened her body just enough to let a second germ,
              <em> pneumococcus</em>, walk in through the open door.
            </p>
            <p>This double attack is called <strong style={{ color: 'var(--text)' }}>co-infection</strong>, and it is my research topic.</p>
            <p>
              So I ask: what if we could predict how these two diseases spread together? And then: with limited
              vaccines and a limited budget, who should get vaccinated, and when, to save the most lives?
            </p>
            <p>
              I answer these questions with mathematics. I build a computer model of a whole population —
              sick and healthy, young and old, vaccinated and not — and test different vaccination plans on it,
              without risking a single real person.
            </p>
            <p>
              Right now, I&rsquo;m finishing the analysis and writing it up as a research paper. The goal is a
              smarter way to protect people every flu season.
            </p>
          </div>

          {/* Co-infection cascade diagram */}
          <div className="reveal cascade-diagram">
            <div className="cascade-box" style={{ borderColor: 'var(--teal)' }}>
              <span className="cascade-icon">🤒</span>
              <div className="cascade-label">Flu infection</div>
            </div>
            <span className="cascade-arrow">→</span>
            <div className="cascade-box" style={{ borderColor: 'var(--amber)' }}>
              <span className="cascade-icon">🛡️</span>
              <div className="cascade-label">Weakened immune defenses</div>
            </div>
            <span className="cascade-arrow">→</span>
            <div className="cascade-box" style={{ borderColor: 'var(--rose)' }}>
              <span className="cascade-icon">🦠</span>
              <div className="cascade-label">Pneumococcus moves in</div>
            </div>
            <span className="cascade-arrow">→</span>
            <div className="cascade-box cascade-box-final" style={{ borderColor: 'var(--rose)' }}>
              <span className="cascade-icon">🏥</span>
              <div className="cascade-label">Severe illness / hospitalization</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OPTIMAL CONTROL EXPLAINER ── */}
      <section className="sk-section sk-section-alt">
        <div className="container" style={{ maxWidth: '780px' }}>
          <span className="eyebrow reveal">The Method</span>
          <h2 className="reveal" style={{ marginBottom: '16px' }}>What is an &ldquo;optimal control problem&rdquo;?</h2>
          <p className="reveal" style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '32px' }}>
            In plain terms: it&rsquo;s a mathematical way of finding the <em>best possible strategy</em> for
            steering a system over time, when you can&rsquo;t just fix everything at once — you have a limited
            budget, a limited supply, and every decision today affects what happens tomorrow. Here, the
            &ldquo;system&rdquo; is an entire population living through flu season, and the &ldquo;strategy&rdquo; is
            a vaccination plan.
          </p>

          <div className="reveal control-loop">
            <div className="control-node">
              <div className="control-node-title">1. Model the population</div>
              <div className="control-node-body">
                Split everyone into groups — healthy, infected with flu only, infected with both, vaccinated,
                recovered — and write down equations for how people move between these groups over time.
              </div>
            </div>
            <span className="control-arrow">→</span>
            <div className="control-node">
              <div className="control-node-title">2. Choose a vaccination strategy</div>
              <div className="control-node-body">
                This is the &ldquo;control&rdquo; — how many doses go out, to which age groups, and on which
                day — subject to how many doses actually exist and what they cost.
              </div>
            </div>
            <span className="control-arrow">→</span>
            <div className="control-node">
              <div className="control-node-title">3. Optimize the outcome</div>
              <div className="control-node-body">
                Use mathematics to find the exact strategy from step 2 that minimizes deaths and
                hospitalizations, given the constraints from step 1 and step 2.
              </div>
            </div>
          </div>

          <p className="reveal" style={{ color: 'var(--text2)', lineHeight: 1.85, marginTop: '32px' }}>
            The whole point is that this can be tested and re-tested entirely inside a computer — thousands of
            different vaccination plans can be tried instantly, and the mathematics guarantees you land on the
            genuinely <em>best</em> one, not just a plan that seems reasonable.
          </p>
        </div>
      </section>

      {/* ── PAST / CLASS PROJECTS ── */}
      <section className="sk-section">
        <div className="container">
          <span className="eyebrow reveal">Along the Way</span>
          <h2 className="reveal" style={{ marginBottom: '8px' }}>Class &amp; Short Projects</h2>
          <p className="reveal" style={{ maxWidth: '620px', color: 'var(--text2)', marginBottom: '40px' }}>
            Smaller projects and reports from coursework across three institutions and two countries —
            pure mathematics, before the shift toward epidemiology and applied control theory.
          </p>

          <div className="projects-grid reveal">
            {PROJECTS.map((p) => (
              <div key={p.id} className="card" style={{ padding: '22px 24px', borderTop: `3px solid ${p.color}` }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.06em', marginBottom: '8px' }}>
                  {p.date}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text)' }}>{p.title}</h3>
                <div style={{ fontSize: '.82rem', color: 'var(--text2)', marginBottom: '4px' }}>{p.context}</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', marginBottom: '2px' }}>
                  {p.institution}
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', marginBottom: '16px' }}>
                  Supervisor: {p.supervisor}
                </div>
                {p.href ? (
                  <Link href={p.href} target="_blank" rel="noopener noreferrer" style={{ color: p.color, textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.78rem', fontWeight: 600 }}>
                    View report →
                  </Link>
                ) : (
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', opacity: .6 }}>No public link</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="sk-section sk-section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow reveal">Get in Touch</span>
          <h2 className="reveal">Interested in this work?</h2>
          <p className="reveal" style={{ maxWidth: '520px', margin: '0 auto 32px', color: 'var(--text2)' }}>
            I&rsquo;m always happy to discuss mathematical epidemiology, optimal control, or the courses I teach at LUMS.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/education" className="btn">My Education</Link>
            <Link href="/courses" className="btn btn-outline">My Courses →</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .cascade-diagram {
          display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
          gap: 6px; margin-top: 40px; padding: 28px 12px;
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
        }
        .cascade-box {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 14px 10px; border: 2px solid; border-radius: 12px; background: var(--bg2);
          width: 122px; text-align: center;
        }
        .cascade-box-final { background: rgba(224,107,107,.1); }
        .cascade-icon { font-size: 1.8rem; }
        .cascade-label { font-size: .78rem; color: var(--text2); line-height: 1.35; }
        .cascade-arrow { font-size: 1.4rem; color: var(--text3); flex-shrink: 0; }

        .control-loop { display: flex; align-items: stretch; gap: 14px; flex-wrap: wrap; }
        .control-node {
          flex: 1; min-width: 220px; background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 20px 22px; box-shadow: var(--shadow-sm);
        }
        .control-node-title { font-weight: 600; color: var(--amber); margin-bottom: 10px; font-size: .96rem; }
        .control-node-body { font-size: .86rem; color: var(--text2); line-height: 1.6; }
        .control-arrow { display: flex; align-items: center; font-size: 1.4rem; color: var(--text3); flex-shrink: 0; }

        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }

        @media (max-width: 720px) {
          .cascade-diagram { flex-direction: column; }
          .cascade-arrow { transform: rotate(90deg); }
          .control-loop { flex-direction: column; }
          .control-arrow { transform: rotate(90deg); justify-content: center; }
        }
      `}</style>
    </>
  );
}
