'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const chapters = [
  {
    ch: 'Ch 1 — Functions, Graphs & Limits',
    items: ['1.1 · Functions', '1.2 · The Graph of a Function', '1.3 · Lines and Linear Functions', '1.4 · Functional Models', '1.5 · Limits', '1.6 · One-Sided Limits and Continuity'],
    live: [],
  },
  {
    ch: 'Ch 2 — Differentiation: Basic Concepts',
    items: ['2.1 · The Derivative', '2.2 · Techniques of Differentiation', '2.3 · Product and Quotient Rules', '2.4 · The Chain Rule', '2.5 · Marginal Analysis', '2.6 · Implicit Differentiation'],
    live: [],
  },
  {
    ch: 'Ch 3 — Applications of the Derivative',
    items: ['3.1 · Increasing & Decreasing Functions', '3.2 · Concavity & Inflection Points', '3.3 · Curve Sketching', '3.4 · Optimization; Elasticity', '3.5 · Additional Optimization'],
    live: [],
  },
  {
    ch: 'Ch 4 — Exponential & Logarithmic Functions',
    items: ['4.1 · Exponential Functions', '4.2 · Logarithmic Functions', '4.3 · Differentiation of Exp & Log', '4.4 · Exponential Models'],
    live: [],
  },
  {
    ch: 'Ch 5 — Integration',
    items: ['5.1 · Indefinite Integration', '5.2 · Integration by Substitution', '5.3 · The Definite Integral & FTC', '5.4 · Applying Definite Integration', '5.5 · Applications to Business'],
    live: [
      { label: '5.1 · Indefinite Integration', href: '/courses/calc1/s51' },
      { label: '5.2 · Integration by Substitution', href: '/courses/calc1/s52' },
      { label: '5.3 · The Definite Integral & FTC', href: '/courses/calc1/s53' },
      { label: '5.4 · Applying Definite Integration', href: '/courses/calc1/s54' },
      { label: '5.5 · Applications to Business', href: '/courses/calc1/s55' },
    ],
    defaultOpen: true,
    quiz: true,
  },
  {
    ch: 'Ch 6 — Additional Integration Topics',
    items: ['6.1 · Integration by Parts', '6.2 · Numerical Integration', '6.3 · Improper Integrals', '6.4 · Continuous Probability'],
    live: [
      { label: '6.1 · Integration by Parts',  href: '/courses/calc1/s61', live: true },
      { label: '6.2 · Numerical Integration', soon: true },
      { label: '6.3 · Improper Integrals',    soon: true },
      { label: '6.4 · Continuous Probability',soon: true },
    ],
  },
];

export default function Calc1() {
  const [open, setOpen] = useState({}); 

  const toggle = (i) => setOpen(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <>
      <Navbar activePage="courses" />

      {/* STICKY SUB-HEADER */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Calculus I</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {[
            { href: '/courses/precalc', label: 'Pre-Calculus', active: false },
            { href: '/courses/calc1', label: 'Calculus I', active: true },
            { href: '/courses/linalg', label: 'Linear Algebra I', active: false },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em',
              textTransform: 'uppercase', color: active ? 'var(--amber)' : 'var(--text3)',
              padding: '9px 18px', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
              whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' }}>MATH-101 · Calculus I</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 }}>Course Contents</div>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' }}>← All Courses</Link>
          </div>

          {/* Course Overview link */}
          <div style={{ padding: '8px 0 4px' }}>
            <Link href="/courses/calc1" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--amber)', borderLeft: '2px solid var(--amber)', background: 'rgba(232,160,32,.08)', textDecoration: 'none' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0, display: 'inline-block' }}></span>
              Course Overview
            </Link>
          </div>

          {/* Accordion chapters */}
          <nav style={{ padding: '4px 0 24px' }}>
            {chapters.map(({ ch, items, live = []}, i) => {
              const isOpen = !!open[i];
              const liveMap = Object.fromEntries(live.map(l => [l.label, l.href]));
              const hasLive = live.length > 0;

              return (
                <div key={ch} style={{ borderBottom: '1px solid var(--border)' }}>
                  {/* Chapter header — clickable */}
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em',
                      textTransform: 'uppercase', color: hasLive ? 'var(--teal)' : 'var(--text3)',
                      textAlign: 'left',
                    }}
                  >
                    <span>{ch}</span>
                    <span style={{ fontSize: '.6rem', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </button>

                  {/* Subsections — shown when open */}
                  {isOpen && (
                    <div style={{ paddingBottom: '6px' }}>
                      {items.map(item => {
                        const href = liveMap[item];
                        return href ? (
                          <Link key={item} href={href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--teal)', textDecoration: 'none', lineHeight: 1.35 }}>
                            <span style={{ fontSize: '.55rem' }}>✦</span>{item}
                          </Link>
                        ) : (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--text3)', opacity: .38, lineHeight: 1.35 }}>
                            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0, background: 'var(--bg)' }}>

          {/* HERO */}
          <div style={{ padding: '44px 52px 36px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)', borderBottom: '1px solid var(--border)' }}>
            <span className="eyebrow">MATH-101 · Undergraduate I · LUMS</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '12px' }}>Calculus I</h1>
            <p style={{ maxWidth: '560px', color: 'var(--text2)', fontSize: '1.02rem' }}>
              The language in which physics, economics, and engineering are written. Taught in two parallel tracks — rigorously from first principles, and through the lens of business and economic application.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
              <span className="tag tag-teal">Limits</span>
              <span className="tag tag-teal">Derivatives</span>
              <span className="tag tag-teal">Integration</span>
              <span className="tag">Differential Equations</span>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginTop: '28px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Textbooks</div>
                <div style={{ fontSize: '.95rem', color: 'var(--text)', marginTop: '4px' }}>James Stewart · Hoffmann &amp; Bradley</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '.95rem', color: 'var(--teal)', marginTop: '4px' }}>Ch 5 Live ✦</div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '44px 52px' }}>

            {/* Track cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '28px' }}>
              {[
                { color: 'var(--amber)', label: 'Track A', title: 'Rigorous Track', desc: "Epsilon-delta definitions, formal proofs, classical analysis. Based on Stewart's Calculus." },
                { color: 'var(--teal)', label: 'Track B', title: 'Applied Track', desc: "Business, economics & social science applications. Based on Hoffmann's Calculus." },
              ].map(({ color, label, title, desc }) => (
                <div key={title} className="card" style={{ padding: '20px 24px', borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
                  <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>{title}</h4>
                  <p style={{ fontSize: '.9rem', marginBottom: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Topics */}
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '16px' }}>Topics Covered</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '32px' }}>
              {[
                { title: 'Limits & Continuity', desc: 'What it means for a function to approach a value. Formal definitions, limit laws, continuity.' },
                { title: 'Differentiation', desc: 'Rates of change, tangent lines, all differentiation rules, and applications to optimisation.' },
                { title: 'Integration', desc: 'Antiderivatives, Riemann sums, the Fundamental Theorem, and techniques of integration.' },
                { title: 'Differential Equations', desc: 'Separable DEs, initial value problems, and continuous compounding.' },
              ].map(({ title, desc }) => (
                <div key={title} className="card" style={{ padding: '20px 24px' }}>
                  <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>{title}</h4>
                  <p style={{ fontSize: '.9rem', marginBottom: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border2), transparent)', margin: '32px 0' }} />

            

            {/* Lecture notes TOC */}
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '6px' }}>Course Lecture Notes</h3>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', marginBottom: '20px' }}>✦ = Live &nbsp;&nbsp;|&nbsp;&nbsp; Greyed out = Coming soon</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
              {chapters.map(({ ch, items, live = [], quiz }) => {
                const liveMap = Object.fromEntries(live.map(l => [l.label, l.href]));
                return (
                  <div key={ch} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 18px' }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '3px' }}>{ch.split('—')[0].trim()}</div>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: '.88rem', color: 'var(--text)', marginBottom: '12px', lineHeight: 1.3 }}>{ch.split('—')[1]?.trim()}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      {items.map(item => {
                        const href = liveMap[item];
                        return href ? (
                          <Link key={item} href={href} style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '.55rem' }}>✦</span>{item}
                          </Link>
                        ) : (
                          <span key={item} style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', opacity: .4 }}>{item}</span>
                        );
                      })}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      {quiz ? (
                        <Link href={`/courses/calc1/ch5-quiz`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.64rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(56,201,176,.12)', color: 'var(--teal)', border: '1px solid rgba(56,201,176,.3)', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none' }}>⚡ Take Quiz</Link>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.64rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'var(--bg)', color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', opacity: .4 }}>📝 Quiz Coming</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 52px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/courses/precalc" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>← Pre-Calculus</Link>
            <Link href="/courses/linalg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>Next: Linear Algebra I →</Link>
          </div>

        </main>
      </div>

      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        window.addEventListener('scroll', () => {
          const bar = document.getElementById('sk-progress-bar');
          const el = document.documentElement;
          if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
        }, { passive: true });
      `}} />
    </>
  );
}