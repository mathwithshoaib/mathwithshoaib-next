'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  stickySubnav: { position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' },
  bcRow: { padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' },
  bcLink: { color: 'var(--amber)', transition: 'color .15s', textDecoration: 'none' },
  bcCur: { color: 'var(--text2)', fontWeight: 500 },
  courseSwitcher: { display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' },
  cswLink: { fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text3)', padding: '9px 18px', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', transition: 'all .2s', textDecoration: 'none' },
  cswActive: { color: 'var(--amber)', borderBottom: '2px solid var(--amber)' },
  courseFrame: { display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' },
  csb: { width: '252px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px + 37px + 40px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' },
  csbHead: { padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' },
  csbTag: { fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' },
  csbTitle: { fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 },
  csbBack: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', transition: 'color .2s', textDecoration: 'none' },
  cmain: { flex: 1, minWidth: 0, background: '#fdf8f0', overflow: 'hidden', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.05rem', lineHeight: 1.8, color: '#1a1a2e' },
  lecInner: { maxWidth: '100%', margin: '0 auto', padding: '0 52px 60px' },
  lecHero: { background: '#1a1a2e', color: '#fdf8f0', padding: '52px 40px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  lecHeroTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '14px', position: 'relative' },
  lecHeroH1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '14px', position: 'relative' },
  lecHeroP: { fontSize: '1rem', color: '#c9c2b8', maxWidth: '560px', margin: '0 auto 24px', position: 'relative' },
  lecHeroLine: { width: '56px', height: '3px', background: '#d4a017', margin: '0 auto' },
  lecNav: { background: 'rgba(253,248,240,.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e0d6c8', padding: '8px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  lecNavA: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.64rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7f8c8d', textDecoration: 'none', padding: '4px 11px', borderRadius: '20px', border: '1px solid #e0d6c8', transition: 'all .2s' },
  card: { background: '#fff', border: '1px solid #e0d6c8', borderRadius: '12px', padding: '30px 34px', boxShadow: '0 4px 24px rgba(26,26,46,.10)', marginBottom: '26px' },
  cardAl: { borderLeft: '4px solid #c0392b' },
  cardGl: { borderLeft: '4px solid #d4a017' },
  cardTl: { borderLeft: '4px solid #1a6b6b' },
  cardSl: { borderLeft: '4px solid #2980b9' },
  cardPl: { borderLeft: '4px solid #27ae60' },
  defBox: { background: '#eef7f7', border: '1.5px solid #1a6b6b', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  thmBox: { background: '#fff8ec', border: '1.5px solid #d4a017', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  noteBox: { background: '#f0f4ff', border: '1.5px solid #2980b9', borderRadius: '8px', padding: '20px 24px', margin: '20px 0' },
  warnBox: { background: '#fff5f5', border: '1.5px solid #c0392b', borderRadius: '8px', padding: '20px 24px', margin: '20px 0' },
  pakBox: { background: '#f0faf4', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  lbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' },
  callout: { background: '#fdf0ef', borderLeft: '4px solid #c0392b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutTeal: { background: '#eef7f7', borderLeft: '4px solid #1a6b6b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGold: { background: '#fff8ec', borderLeft: '4px solid #d4a017', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGreen: { background: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  toggleBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a1a2e', color: '#d4a017', border: 'none', borderRadius: '6px', padding: '9px 20px', cursor: 'pointer', marginTop: '10px', transition: 'opacity .2s' },
  answerBox: { background: '#f0f9f0', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '18px 22px', marginTop: '12px' },
  secLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.26em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '8px' },
  subsec: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#2980b9', margin: '44px 0 6px', paddingBottom: '6px', borderBottom: '1px solid #e0d6c8' },
  bf: { textAlign: 'center', fontSize: '1.12rem', padding: '26px 18px', background: '#f5ede0', borderRadius: '10px', margin: '22px 0' },
  ruleHL: { background: '#f5ede0', borderRadius: '8px', padding: '18px 20px', textAlign: 'center', margin: '14px 0', fontSize: '1.05rem' },
  divider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '52px 0' },
  subDivider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '36px 0' },
  lecFooterNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px', borderTop: '1px solid #e0d6c8', flexWrap: 'wrap', gap: '12px', background: '#fdf8f0' },
  lnfBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7f8c8d', padding: '8px 18px', border: '1px solid #e0d6c8', borderRadius: '8px', textDecoration: 'none' },
  lnfBtnPrev: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#2980b9', border: '1px solid #2980b9', background: '#f0f4ff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  lnfBtnNext: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#1a6b6b', border: '1px solid #1a6b6b', background: '#eef7f7', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '.94rem' },
  th: { background: '#1a1a2e', color: '#d4a017', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', padding: '9px 13px', textAlign: 'left' },
  td: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8' },
  tdEven: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8', background: '#f5ede0' },
  h2: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.7rem,4vw,2.55rem)', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2, color: '#1a1a2e' },
  h3teal: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.32rem', fontWeight: 700, margin: '30px 0 12px', color: '#1a6b6b' },
  h4red: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#c0392b' },
  h4gold: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#d4a017' },
  h4teal: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#1a6b6b' },
  h4blue: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#2980b9' },
  h4green: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#27ae60' },
  sep: { borderTop: '1px solid #e0d6c8', paddingTop: '14px', marginTop: '14px' },
  p: { marginBottom: '16px', color: '#1a1a2e' },
  stepBox: { display: 'flex', gap: '18px', margin: '14px 0', alignItems: 'flex-start' },
  stepNum: { width: '36px', height: '36px', borderRadius: '50%', background: '#1a1a2e', color: '#d4a017', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '3px' },
  stepContent: { flex: 1 },
  locTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#27ae60', background: 'rgba(39,174,96,.1)', border: '1px solid rgba(39,174,96,.3)', borderRadius: '20px', padding: '2px 10px', marginLeft: '8px' },
};

// ─── TOC data ─────────────────────────────────────────────────────────────
const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: ['1.1 · Functions','1.2 · The Graph of a Function','1.3 · Lines and Linear Functions','1.4 · Functional Models','1.5 · Limits','1.6 · One-Sided Limits and Continuity'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: ['2.1 · The Derivative','2.2 · Techniques of Differentiation','2.3 · Product and Quotient Rules','2.4 · The Chain Rule','2.5 · Marginal Analysis','2.6 · Implicit Differentiation'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 3 — Applications of the Derivative', items: ['3.1 · Increasing & Decreasing Functions','3.2 · Concavity & Inflection Points','3.3 · Curve Sketching','3.4 · Optimization; Elasticity','3.5 · Additional Optimization'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: ['4.1 · Exponential Functions','4.2 · Logarithmic Functions','4.3 · Differentiation of Exp & Log','4.4 · Exponential Models'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration', href: '/courses/calc1/s51', live: true },
    { label: '5.2 · Integration by Substitution', href: '/courses/calc1/s52', active: true, live: true },
    { label: '5.3 · The Definite Integral & FTC', href: '/courses/calc1/s53', live: true },
    { label: '5.4 · Applying Definite Integration', href: '/courses/calc1/s54', live: true },
    { label: '5.5 · Applications to Business', soon: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: ['6.1 · Integration by Parts','6.2 · Numerical Integration','6.3 · Improper Integrals','6.4 · Continuous Probability'].map(l=>({label:l,soon:true})) },
];

// ─── MCQ Data ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  { fn: '\\int (x^2+3)^5 \\cdot 2x\\,dx', opts: ['$u = x^2+3$','$u = 2x$','$u = (x^2+3)^5$','$u = x^2$'], correct: 0, explain: 'u = x²+3 works because its derivative 2x is exactly the factor present. This is a classic quadratic substitution.' },
  { fn: '\\int \\sin(x^3)\\cdot x^2\\,dx', opts: ['$u = \\sin(x^3)$','$u = x^3$','$u = x^2$','$u = \\cos(x^3)$'], correct: 1, explain: 'u = x³ because its derivative 3x² differs from x² only by the constant 3, which we can factor out.' },
  { fn: '\\int e^{4x^2}\\cdot x\\,dx', opts: ['$u = e^{4x^2}$','$u = 4x$','$u = 4x^2$','$u = x$'], correct: 2, explain: 'u = 4x² because its derivative 8x contains x, which matches the x factor in the integrand (up to the constant 8).' },
  { fn: '\\int \\frac{(\\ln x)^2}{x}\\,dx', opts: ['$u = x$','$u = 1/x$','$u = x^2$','$u = \\ln x$'], correct: 3, explain: 'u = ln x because its derivative is 1/x, which is exactly the factor in the denominator. Classic logarithmic substitution.' },
  { fn: '\\int \\sqrt{5x-1}\\,dx', opts: ['$u = \\sqrt{x}$','$u = 5x-1$','$u = 5x$','$u = x-1$'], correct: 1, explain: 'u = 5x−1 is the expression under the radical. Its derivative is 5 (just a constant), making the substitution clean.' },
  { fn: '\\int \\frac{x}{(x^2+7)^3}\\,dx', opts: ['$u = x^2+7$','$u = x$','$u = (x^2+7)^3$','$u = x^2$'], correct: 0, explain: 'u = x²+7 because its derivative 2x contains x, matching the numerator (up to the constant 2).' },
  { fn: '\\int e^x(e^x+1)^4\\,dx', opts: ['$u = e^x+1$','$u = e^x$','$u = x$','$u = (e^x+1)^4$'], correct: 0, explain: 'u = eˣ+1 because its derivative is eˣ, which is exactly the factor multiplying the parenthetical expression.' },
  { fn: '\\int \\cos(x)\\cdot e^{\\sin(x)}\\,dx', opts: ['$u = \\cos x$','$u = e^{\\sin x}$','$u = \\sin x$','$u = x$'], correct: 2, explain: 'u = sin(x) because its derivative is cos(x), which is exactly the other factor. Perfect substitution!' },
  { fn: '\\int x^3(x^4-2)^6\\,dx', opts: ['$u = x^3$','$u = x^4-2$','$u = (x^4-2)^6$','$u = x^4$'], correct: 1, explain: 'u = x⁴−2 because its derivative is 4x³, and x³ is the factor present (just divide by 4).' },
  { fn: '\\int \\frac{(\\ln x)^5}{x}\\,dx', opts: ['$u = 1/x$','$u = x^5$','$u = \\ln(x^5)$','$u = \\ln x$'], correct: 3, explain: 'u = ln x — its derivative 1/x matches the denominator exactly. This gives ∫u⁵ du = u⁶/6 + C.' },
  { fn: '\\int \\frac{x}{\\sqrt{x^2+9}}\\,dx', opts: ['$u = \\sqrt{x^2+9}$','$u = x^2$','$u = x^2+9$','$u = x$'], correct: 2, explain: 'u = x²+9 because du = 2x dx, so x dx = du/2. The integral becomes ∫(1/2)u^{-1/2} du = √u + C.' },
  { fn: '\\int \\sec^2(x)\\cdot\\tan^3(x)\\,dx', opts: ['$u = \\sec^2 x$','$u = \\tan x$','$u = \\tan^3 x$','$u = \\cos x$'], correct: 1, explain: 'u = tan x because its derivative is sec²x, which is exactly the other factor. Gives ∫u³ du = u⁴/4 + C.' },
];

// ─── ToggleAnswer ─────────────────────────────────────────────────────────
function ToggleAnswer({ label = 'Show Solution', children }) {
  const ref = useRef(null);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const visible = el.style.display === 'block';
    el.style.display = visible ? 'none' : 'block';
    if (!visible && window.MathJax?.typesetPromise) window.MathJax.typesetPromise([el]);
  };
  return (
    <>
      <button style={S.toggleBtn} onClick={toggle}>{label}</button>
      <div ref={ref} style={{ ...S.answerBox, display: 'none' }}>{children}</div>
    </>
  );
}

// ─── MCQ Widget Component ─────────────────────────────────────────────────
function MCQWidget() {
  const [currentQ, setCurrentQ] = useState(-1);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(-1);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const displayRef = useRef(null);
  const optionsRef = useRef(null);
  const feedbackRef = useRef(null);

  const loadQuestion = (idx) => {
    setCurrentQ(idx);
    setAnswered(false);
    setChosen(-1);
  };

  const checkAnswer = (i) => {
    if (answered) return;
    setAnswered(true);
    setChosen(i);
    setTotal(t => t + 1);
    if (i === QUESTIONS[currentQ].correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  useEffect(() => {
    if (currentQ >= 0 && displayRef.current && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([displayRef.current]);
    }
  }, [currentQ]);

  useEffect(() => {
    if (currentQ >= 0 && optionsRef.current && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([optionsRef.current]);
    }
  }, [currentQ]);

  useEffect(() => {
    if (answered && feedbackRef.current && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([feedbackRef.current]);
    }
  }, [answered]);

  const q = currentQ >= 0 ? QUESTIONS[currentQ] : null;
  const isCorrect = answered && chosen === q?.correct;

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px 28px 22px', margin: '30px 0', color: '#e8e2d9' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        ⚡ Substitution U-Choice Quiz
        <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.12)', display: 'block' }}></span>
      </div>

      <select
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.82rem', background: '#1f2937', color: '#e8e2d9', border: '1px solid #374151', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', width: '100%', marginBottom: '18px' }}
        onChange={e => { const v = e.target.value; if (v !== '') loadQuestion(parseInt(v)); }}
        value={currentQ >= 0 ? currentQ : ''}
      >
        <option value="">— Select a function to practise —</option>
        <option value="0">{'f(x) = (x² + 3)⁵ · 2x'}</option>
        <option value="1">{'f(x) = sin(x³) · x²'}</option>
        <option value="2">{'f(x) = e^(4x²) · x'}</option>
        <option value="3">{'f(x) = (ln x)² / x'}</option>
        <option value="4">{'f(x) = √(5x − 1)'}</option>
        <option value="5">{'f(x) = x / (x² + 7)³'}</option>
        <option value="6">{'f(x) = eˣ · (eˣ + 1)⁴'}</option>
        <option value="7">{'f(x) = cos(x) · e^sin(x)'}</option>
        <option value="8">{'f(x) = x³ · (x⁴ − 2)⁶'}</option>
        <option value="9">{'f(x) = (ln x)⁵ / x'}</option>
        <option value="10">{'f(x) = x / √(x² + 9)'}</option>
        <option value="11">{'f(x) = sec²(x) · tan³(x)'}</option>
      </select>

      <div ref={displayRef} style={{ background: '#0d1117', borderRadius: '10px', padding: '18px 22px', marginBottom: '18px', textAlign: 'center', fontSize: '1.1rem', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentQ < 0 ? '#6b7280' : '#e8e2d9', fontFamily: currentQ < 0 ? "'IBM Plex Mono', monospace" : undefined, fontSize: currentQ < 0 ? '.85rem' : '1.1rem' }}>
        {currentQ < 0 ? 'Select a function from the dropdown above' : `$\\displaystyle ${q.fn}$`}
      </div>

      {q && (
        <>
          <div ref={optionsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {q.opts.map((opt, i) => {
              let borderColor = '#374151', bg = '#1f2937', color = '#e8e2d9';
              if (answered) {
                if (i === q.correct) { borderColor = '#27ae60'; bg = 'rgba(39,174,96,.15)'; color = '#27ae60'; }
                else if (i === chosen && chosen !== q.correct) { borderColor = '#c0392b'; bg = 'rgba(192,57,43,.15)'; color = '#c0392b'; }
              }
              return (
                <div key={i} onClick={() => checkAnswer(i)} style={{ background: bg, border: `1.5px solid ${borderColor}`, borderRadius: '8px', padding: '12px 16px', cursor: answered ? 'default' : 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.82rem', transition: 'all .2s', textAlign: 'center', color }}>
                  {opt}
                </div>
              );
            })}
          </div>

          {answered && (
            <div ref={feedbackRef} style={{ padding: '12px 16px', borderRadius: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.78rem', marginTop: '8px', background: isCorrect ? 'rgba(39,174,96,.12)' : 'rgba(192,57,43,.12)', border: `1px solid ${isCorrect ? '#27ae60' : '#c0392b'}`, color: isCorrect ? '#27ae60' : '#e06b6b' }}>
              {isCorrect ? '✓ Correct! ' : '✗ Not quite. The correct answer is highlighted. '}{q.explain}
            </div>
          )}

          {answered && (
            <button onClick={() => { setCurrentQ(-1); setAnswered(false); setChosen(-1); }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(212,160,23,.15)', color: '#d4a017', border: '1px solid rgba(212,160,23,.4)', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', marginTop: '12px', transition: 'all .2s' }}>
              Next Question →
            </button>
          )}
        </>
      )}

      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.82rem', color: '#9ca3af', marginTop: '14px', display: 'flex', gap: '20px' }}>
        {'Score: '}<span style={{ color: '#d4a017', fontWeight: 700 }}>{score}</span>{' / '}<span style={{ color: '#d4a017', fontWeight: 700 }}>{total}</span>
        {'  Streak: '}<span style={{ color: '#d4a017', fontWeight: 700 }}>{streak}</span>{' 🔥'}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function Calc1S52() {
  const [sidebarOpen, setSidebarOpen] = useState({ 5: true });

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const bar = document.getElementById('sk-progress-bar');
      if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const typesetInterval = setInterval(() => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise();
        clearInterval(typesetInterval);
      }
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(typesetInterval);
    };
  }, []);

  return (
    <>
      <Navbar activePage="courses" />
      <Script id="mjax-cfg" strategy="beforeInteractive">{`
        window.MathJax = {
          tex: { inlineMath:[['$','$'],['\\\\(','\\\\)']], displayMath:[['$$','$$'],['\\\\[','\\\\]']] },
          options:{ skipHtmlTags:['script','noscript','style','textarea','pre'] }
        };
      `}</Script>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec { padding:52px 0 0; }
        .lec-sec:first-child { padding-top:44px; }
        .toc-live::after { content:'✶'; font-size:.58rem; color:var(--teal); margin-left:auto; }
        .lec-inner-m p, .lec-inner-m li { color: #1a1a2e !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:#d4a017; border-radius:50%; cursor:pointer; }
        @media(max-width:860px){
            .csb-hide{display:none!important;}
            .lec-inner-m{padding:0 18px 40px!important;}
            .lec-hero-m{padding:36px 20px 32px!important;}
            .lec-fnav-m{padding:20px 18px!important;}
            .mcq-grid{grid-template-columns:1fr!important;}
        }
        `}</style>

      {/* STICKY SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§5.2 Integration by Substitution</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1" style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg" style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      {/* COURSE FRAME */}
      <div style={S.courseFrame}>

        {/* SIDEBAR */}
        <aside style={S.csb} className="csb-hide">
          <div style={S.csbHead}>
            <div style={S.csbTag}>MATH-101 · Calculus I</div>
            <div style={S.csbTitle}>Course Contents</div>
            <Link href="/courses/calc1" style={S.csbBack}>← All Courses</Link>
          </div>
          <div style={{ padding: '8px 0 4px' }}>
            <Link href="/courses/calc1" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'none', lineHeight: 1.35 }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
              Course Overview
            </Link>
          </div>
          <nav style={{ padding: '4px 0 24px' }}>
            {TOC.map((sec, i) => {
              if (sec.ch === 'Course Overview') return null;
              const isOpen = !!sidebarOpen[i];
              const hasLive = sec.items.some(item => item.live || item.href);
              return (
                <div key={sec.ch} style={{ borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => setSidebarOpen(prev => ({ ...prev, [i]: !prev[i] }))} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: hasLive ? 'var(--teal)' : 'var(--text3)', textAlign: 'left' }}>
                    <span>{sec.ch}</span>
                    <span style={{ fontSize: '.6rem', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom: '6px' }}>
                      {sec.items.map(item =>
                        item.soon ? (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--text3)', opacity: .38, lineHeight: 1.35 }}>
                            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
                            {item.label}
                          </div>
                        ) : item.active ? (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--amber)', borderLeft: '2px solid var(--amber)', background: 'rgba(232,160,32,.08)', lineHeight: 1.35 }}>
                            <span style={{ fontSize: '.55rem' }}>✦</span>{item.label}
                          </div>
                        ) : (
                          <Link key={item.label} href={item.href || '#'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--teal)', textDecoration: 'none', lineHeight: 1.35 }}>
                            <span style={{ fontSize: '.55rem' }}>✦</span>{item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN */}
        <main style={S.cmain}>

          {/* HERO */}
          <div style={S.lecHero} className="lec-hero-m">
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)', pointerEvents: 'none' }} />
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 5 &nbsp;·&nbsp; Section 5.2</div>
            <h1 style={S.lecHeroH1}>Integration by<br /><em style={{ color: '#d4a017', fontStyle: 'italic' }}>Substitution</em></h1>
            <p style={S.lecHeroP}>The chain rule in reverse — a powerful technique that transforms complicated integrals into simple ones by a clever change of variable.</p>
            <div style={S.lecHeroLine} />
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#motivation','Motivation'],['#method','The Method'],['#detailed','Detailed Example'],['#types','Types'],['#algebra','Algebra First'],['#pakistan','Pakistan Problems'],['#mcq','U-Choice Quiz'],['#fails','When It Fails'],['#diffeq','Diff. Equations'],['#ivp','Initial Value']].map(([href,label])=>(
              <a key={href} href={href} style={S.lecNavA}>{label}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ══ MOTIVATION ══ */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>Learning Objectives</div>
              <h2 style={S.h2}>What You Will Master<br />in This Section</h2>

              <div style={{...S.card,...S.cardGl,marginBottom:'20px'}}>
                {[
                  'Use the method of substitution to find indefinite integrals of composite functions.',
                  'Solve initial value problems using substitution to find particular solutions.',
                  'Explore a price-adjustment model in economics using substitution techniques.',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: i < 2 ? '12px' : 0 }}>
                    <div style={{ width: '32px', height: '32px', background: '#d4a017', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '.85rem', flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ ...S.p, margin: 0, paddingTop: '4px' }}>{text}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ ...S.h3teal, marginTop: '32px' }}>The Big Picture: Why Substitution?</h3>
              <p style={S.p}>In §5.1, you learned the basic integration rules. But what about integrals like:</p>
              <div style={S.bf}>{'$$\\int 2x(x^2+1)^5\\,dx \\qquad \\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}}\\,dx \\qquad \\int x^2\\sqrt{x^3+7}\\,dx$$'}</div>
              <p style={S.p}>None of the rules from §5.1 directly apply. These integrals involve <strong>composite functions</strong> — a function inside another function. Substitution is the systematic method for handling exactly these cases.</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl, color:'#d4a017'}}>The Core Idea — Chain Rule in Reverse</div>
                <p style={S.p}>{'Recall the Chain Rule for derivatives: if $F(u)$ is an antiderivative of $f(u)$, then'}</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{d}{dx}[F(g(x))] = f(g(x)) \\cdot g\'(x)$$'}</p>
                <p style={{...S.p,marginBottom:0}}>{'Running this backwards: if we see $f(g(x)) \\cdot g\'(x)$ inside an integral, we can undo the chain rule:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int f(g(x))\\cdot g\'(x)\\,dx = F(g(x)) + C$$'}</p>
              </div>

              <div style={S.callout}><strong>Key Observation:</strong> {'The integrand must contain a function $g(x)$ AND its derivative $g\'(x)$ (possibly up to a constant multiple). When you spot this pattern, substitution will work.'}</div>
            </section>

            {/* ══ THE METHOD ══ */}
            <section id="method" className="lec-sec">
              <div style={S.secLabel}>§ 1 — The Systematic Method</div>
              <h2 style={S.h2}>The Four Steps of<br />Integration by Substitution</h2>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>Substitution Rule</div>
                <p style={S.p}>{'If $u = g(x)$ is a differentiable function, then:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int f(g(x))\\cdot g\'(x)\\,dx = \\int f(u)\\,du = F(u) + C = F(g(x)) + C$$'}</p>
              </div>

              <div style={{ margin: '28px 0' }}>
                {[
                  { title: 'Choose $u = g(x)$ — the inner function', body: 'Look for a composite function. The best $u$ is usually the expression inside brackets, under a root, or in an exponent. Ask: "What part, if differentiated, gives something present in the integrand?"' },
                  { title: 'Differentiate to find $du$', body: 'Compute $\\dfrac{du}{dx} = g\'(x)$, then write $du = g\'(x)\\,dx$. Solve for $dx$ if needed: $dx = \\dfrac{du}{g\'(x)}$.' },
                  { title: 'Substitute completely — no $x$ should remain', body: 'Replace $g(x)$ with $u$ and $g\'(x)\\,dx$ with $du$. The entire integral must be in terms of $u$ only. If $x$ terms remain, the substitution may need adjustment or is the wrong choice.' },
                  { title: 'Integrate in $u$, then back-substitute', body: 'Evaluate $\\int f(u)\\,du$ using basic rules. Then replace every $u$ with $g(x)$ to express the answer in terms of the original variable $x$.' },
                ].map((step, i) => (
                  <div key={i} style={S.stepBox}>
                    <div style={S.stepNum}>{i + 1}</div>
                    <div style={S.stepContent}>
                      <strong style={{ color: '#1a1a2e', display: 'block', marginBottom: '4px' }}>{step.title}</strong>
                      {step.body}
                    </div>
                  </div>
                ))}
              </div>

              <div style={S.calloutGold}><strong>Always verify:</strong> Differentiate your answer. You should recover the original integrand. This is the only way to be certain your substitution was correct.</div>
            </section>

            {/* ══ DETAILED EXAMPLE ══ */}
            <section id="detailed" className="lec-sec">
              <div style={S.secLabel}>§ 2 — A Complex Worked Example</div>
              <h2 style={S.h2}>Step-by-Step Through a<br />Challenging Integral</h2>

              <p style={S.p}>Let us work through the following integral completely, showing every thought and every step:</p>
              <div style={S.bf}>{'$$\\int \\frac{3x^2}{\\sqrt{x^3 + 5}}\\,dx$$'}</div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Step 1 — Identify the Structure</h4>
                <p style={S.p}>{'The integrand is $\\dfrac{3x^2}{\\sqrt{x^3+5}} = 3x^2 \\cdot (x^3+5)^{-1/2}$.'}</p>
                <p style={S.p}>{'We have a composite function: $(x^3+5)^{-1/2}$ — the inner function is $x^3 + 5$.'}</p>
                <p style={{...S.p,marginBottom:0}}>{'Notice that $3x^2$ is exactly the derivative of $x^3 + 5$. This is the signal that substitution will work perfectly.'}</p>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>{'Step 2 — Choose $u$ and Find $du$'}</h4>
                <p style={S.p}>{'Let $u = x^3 + 5$'}</p>
                <p style={S.p}>{'Then $\\dfrac{du}{dx} = 3x^2$'}</p>
                <p style={{...S.p,marginBottom:0}}>{'Therefore $du = 3x^2\\,dx$'}</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Step 3 — Substitute</h4>
                <p style={S.p}>{'Replace $x^3 + 5$ with $u$ and $3x^2\\,dx$ with $du$:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int \\frac{3x^2}{\\sqrt{x^3+5}}\\,dx = \\int \\frac{1}{\\sqrt{u}}\\,du = \\int u^{-1/2}\\,du$$'}</p>
                <p style={{...S.p,marginBottom:0}}>The integral is now entirely in $u$ — clean and simple.</p>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>{'Step 4 — Integrate in $u$'}</h4>
                <p style={S.p}>Apply the power rule (raise exponent by 1, divide):</p>
                <p style={{textAlign:'center'}}>{'$$\\int u^{-1/2}\\,du = \\frac{u^{1/2}}{1/2} + C = 2\\sqrt{u} + C$$'}</p>
              </div>

              <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>Step 5 — Back-Substitute</h4>
                <p style={S.p}>{'Replace $u$ with $x^3 + 5$:'}</p>
                <p style={{textAlign:'center'}}>{'$$2\\sqrt{u} + C = 2\\sqrt{x^3+5} + C$$'}</p>
                <div style={S.sep}>
                  <strong>✓ Verification:</strong> {'$\\dfrac{d}{dx}\\left[2\\sqrt{x^3+5}\\right] = 2 \\cdot \\dfrac{1}{2\\sqrt{x^3+5}} \\cdot 3x^2 = \\dfrac{3x^2}{\\sqrt{x^3+5}}$ ✓'}
                </div>
              </div>

              <div style={S.calloutGreen}><strong>Final Answer:</strong> {'$\\displaystyle\\int \\frac{3x^2}{\\sqrt{x^3+5}}\\,dx = 2\\sqrt{x^3+5} + C$'}</div>
            </section>

            {/* ══ TYPES ══ */}
            <section id="types" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Types of Substitution</div>
              <h2 style={S.h2}>Six Categories of<br />Substitution Problems</h2>

              {/* 3a Linear */}
              <div style={S.subsec}>3a — Linear Substitution</div>
              <p style={S.p}>{'When the inner function is linear: $u = ax + b$. These are the simplest substitutions.'}</p>
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example — Linear</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int (3x-2)^7\\,dx$'}</p>
                <p style={S.p}>{'Let $u = 3x-2$, so $du = 3\\,dx$, thus $dx = \\dfrac{du}{3}$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int u^7 \\cdot \\frac{du}{3} = \\frac{1}{3}\\int u^7\\,du = \\frac{1}{3}\\cdot\\frac{u^8}{8} + C = \\frac{(3x-2)^8}{24} + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int e^{5x+1}\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = 5x+1$, $du = 5\\,dx$, so $dx = \\dfrac{du}{5}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int e^u \\cdot \\frac{du}{5} = \\frac{1}{5}e^u + C = \\frac{1}{5}e^{5x+1} + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* 3b Quadratic */}
              <div style={S.subsec}>3b — Quadratic Substitution</div>
              <p style={S.p}>When the inner function is quadratic. Look for $x$ (or a multiple of it) multiplying the whole expression — that extra $x$ is often $\frac{"{"}du{"}"}{"{"}2{"}"}$.</p>
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example — Quadratic</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int x(x^2+1)^4\\,dx$'}</p>
                <p style={S.p}>{'Let $u = x^2+1$, so $du = 2x\\,dx$, thus $x\\,dx = \\dfrac{du}{2}$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int u^4 \\cdot \\frac{du}{2} = \\frac{1}{2}\\cdot\\frac{u^5}{5} + C = \\frac{(x^2+1)^5}{10} + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int \\frac{x}{x^2+3}\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = x^2+3$, $du = 2x\\,dx$, so $x\\,dx = \\dfrac{du}{2}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int \\frac{1}{u}\\cdot\\frac{du}{2} = \\frac{1}{2}\\ln|u| + C = \\frac{1}{2}\\ln(x^2+3) + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* 3c Exponential */}
              <div style={S.subsec}>3c — Exponential Substitution</div>
              <p style={S.p}>When the exponent is a function of $x$, set $u$ equal to that exponent.</p>
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example — Exponential</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int x^2 e^{x^3}\\,dx$'}</p>
                <p style={S.p}>{'Let $u = x^3$, so $du = 3x^2\\,dx$, thus $x^2\\,dx = \\dfrac{du}{3}$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int e^u \\cdot \\frac{du}{3} = \\frac{1}{3}e^u + C = \\frac{1}{3}e^{x^3} + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}}\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = \\sqrt{x} = x^{1/2}$, so $du = \\dfrac{1}{2\\sqrt{x}}dx$, thus $\\dfrac{dx}{\\sqrt{x}} = 2\\,du$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int e^u \\cdot 2\\,du = 2e^u + C = 2e^{\\sqrt{x}} + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* 3d Rational */}
              <div style={S.subsec}>3d — Rational Substitution</div>
              <p style={S.p}>When you have a rational function where the numerator is (a multiple of) the derivative of the denominator — this gives a logarithm.</p>
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example — Rational</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int \\frac{4x^3}{x^4-7}\\,dx$'}</p>
                <p style={S.p}>{'Let $u = x^4 - 7$, so $du = 4x^3\\,dx$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int \\frac{du}{u} = \\ln|u| + C = \\ln|x^4 - 7| + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int \\frac{2x+3}{x^2+3x-1}\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = x^2+3x-1$, $du = (2x+3)\\,dx$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int \\frac{du}{u} = \\ln|u| + C = \\ln|x^2+3x-1| + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* 3e Radical */}
              <div style={S.subsec}>3e — Radical Substitution</div>
              <p style={S.p}>When the integrand contains a radical (square root, cube root, etc.), set $u$ equal to the expression under the radical.</p>
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example — Radical</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int x^2\\sqrt{x^3+7}\\,dx$'}</p>
                <p style={S.p}>{'Let $u = x^3 + 7$, so $du = 3x^2\\,dx$, thus $x^2\\,dx = \\dfrac{du}{3}$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int \\sqrt{u}\\cdot\\frac{du}{3} = \\frac{1}{3}\\cdot\\frac{2}{3}u^{3/2} + C = \\frac{2}{9}(x^3+7)^{3/2} + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int \\frac{1}{\\sqrt{2x+3}}\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = 2x+3$, $du = 2\\,dx$, so $dx = \\dfrac{du}{2}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int u^{-1/2}\\cdot\\frac{du}{2} = \\frac{1}{2}\\cdot 2u^{1/2} + C = \\sqrt{2x+3} + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* 3f Logarithmic */}
              <div style={S.subsec}>3f — Logarithmic Substitution</div>
              <p style={S.p}>{'When $\\ln(x)$ appears in the integrand, try $u = \\ln(x)$. Then $du = \\dfrac{1}{x}dx$.'}</p>
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example — Logarithmic</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int \\frac{(\\ln x)^3}{x}\\,dx$'}</p>
                <p style={S.p}>{'Let $u = \\ln x$, so $du = \\dfrac{1}{x}\\,dx$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int u^3\\,du = \\frac{u^4}{4} + C = \\frac{(\\ln x)^4}{4} + C$$'}</p>
                <ToggleAnswer label="Another Example">
                  <p style={S.p}>{'Find $\\displaystyle\\int \\frac{\\ln(x^2)}{x}\\,dx$'}</p>
                  <p style={S.p}>{'Note $\\ln(x^2) = 2\\ln x$. Let $u = \\ln x$, $du = \\dfrac{dx}{x}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int 2u\\,du = u^2 + C = (\\ln x)^2 + C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Quick Reference Table */}
              <div style={S.subDivider} />
              <h3 style={S.h3teal}>Quick Reference: Substitution Patterns</h3>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Integrand Pattern</th><th style={S.th}>Best Choice for $u$</th><th style={S.th}>Result Form</th></tr></thead>
                <tbody>
                  <tr><td style={S.td}>{'$(ax+b)^n$'}</td><td style={S.td}>{'$u = ax+b$'}</td><td style={S.td}>Power of $u$</td></tr>
                  <tr><td style={S.tdEven}>{'$x\\cdot f(x^2)$'}</td><td style={S.tdEven}>{'$u = x^2$'}</td><td style={S.tdEven}>{'Simpler $f(u)$'}</td></tr>
                  <tr><td style={S.td}>{"$f'(x)\\cdot e^{f(x)}$"}</td><td style={S.td}>{'$u = f(x)$'}</td><td style={S.td}>{'$e^u$'}</td></tr>
                  <tr><td style={S.tdEven}>{"$\\dfrac{f'(x)}{f(x)}$"}</td><td style={S.tdEven}>{'$u = f(x)$'}</td><td style={S.tdEven}>{'$\\ln|u|$'}</td></tr>
                  <tr><td style={S.td}>{"$f'(x)\\cdot\\sqrt{f(x)}$"}</td><td style={S.td}>{'$u = f(x)$'}</td><td style={S.td}>{'$\\dfrac{2}{3}u^{3/2}$'}</td></tr>
                  <tr><td style={S.tdEven}>{'$\\dfrac{(\\ln x)^n}{x}$'}</td><td style={S.tdEven}>{'$u = \\ln x$'}</td><td style={S.tdEven}>{'$\\dfrac{u^{n+1}}{n+1}$'}</td></tr>
                </tbody>
              </table>
            </section>

            {/* ══ ALGEBRA FIRST ══ */}
            <section id="algebra" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Algebra Before Integration</div>
              <h2 style={S.h2}>Simplify First,<br />Then Integrate</h2>
              <p style={S.p}>Sometimes the integrand looks complicated but simplifies with algebra — long division, expanding, or factoring — before substitution can be applied.</p>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Polynomial Division</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int \\frac{x^2}{x-1}\\,dx$'}</p>
                <p style={S.p}>The degree of the numerator equals the degree of the denominator, so we divide first:</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{x^2}{x-1} = x + 1 + \\frac{1}{x-1}$$'}</p>
                <p style={S.p}>{'Now integrate term by term (with $u = x-1$ for the last term):'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int\\!\\left(x + 1 + \\frac{1}{x-1}\\right)dx = \\frac{x^2}{2} + x + \\ln|x-1| + C$$'}</p>
                <ToggleAnswer label="Show Division Work">
                  <p style={S.p}><strong>Long Division:</strong> {'Divide $x^2$ by $(x-1)$:'}</p>
                  <p style={S.p}>{'$x^2 \\div (x-1)$: first term $x \\cdot (x-1) = x^2 - x$. Remainder: $x$.'}</p>
                  <p style={S.p}>{'$x \\div (x-1)$: second term $1 \\cdot (x-1) = x-1$. Remainder: $1$.'}</p>
                  <p style={S.p}>{'So $\\dfrac{x^2}{x-1} = x + 1 + \\dfrac{1}{x-1}$ ✓'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Expand Before Integrating</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int (1+e^x)^2\\,dx$'}</p>
                <p style={S.p}>{'Expand: $(1+e^x)^2 = 1 + 2e^x + e^{2x}$'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int\\!(1 + 2e^x + e^{2x})\\,dx = x + 2e^x + \\frac{e^{2x}}{2} + C$$'}</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Separate a Fraction</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int \\frac{x^3 + 2x - 5}{x^2}\\,dx$'}</p>
                <p style={S.p}>Split into separate fractions:</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{x^3+2x-5}{x^2} = x + \\frac{2}{x} - \\frac{5}{x^2} = x + \\frac{2}{x} - 5x^{-2}$$'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int\\!\\left(x + \\frac{2}{x} - 5x^{-2}\\right)dx = \\frac{x^2}{2} + 2\\ln|x| + \\frac{5}{x} + C$$'}</p>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 4 — Completing the Square (Preview)</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int \\frac{1}{x^2+4x+5}\\,dx$'}</p>
                <p style={S.p}>{'Complete the square: $x^2+4x+5 = (x+2)^2 + 1$. Let $u = x+2$, $du = dx$:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int \\frac{du}{u^2+1} = \\arctan(u) + C = \\arctan(x+2) + C$$'}</p>
              </div>
            </section>

            {/* ══ PAKISTAN PROBLEMS ══ */}
            <section id="pakistan" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Applied Problems</div>
              <h2 style={S.h2}>Word Problems</h2>

              {/* Problem 1 */}
              <div style={S.pakBox}>
                <div style={{...S.lbl,color:'#27ae60'}}>Problem 1 — LUMS Cafeteria Revenue <span style={S.locTag}>LUMS, Lahore</span></div>
                <p style={S.p}>The LUMS cafeteria finds that its marginal revenue (in PKR thousands) from selling $q$ meal plans per week follows the model:</p>
                <p style={{textAlign:'center'}}>{'$$R\'(q) = \\frac{4q}{(q^2+9)^2}$$'}</p>
                <p style={S.p}>{'If $R(0) = 0$, find the total revenue function $R(q)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = q^2+9$, so $du = 2q\\,dq$, thus $q\\,dq = \\dfrac{du}{2}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$R(q) = \\int \\frac{4q}{(q^2+9)^2}\\,dq = \\int \\frac{4}{u^2}\\cdot\\frac{du}{2} = 2\\int u^{-2}\\,du = 2\\cdot\\frac{u^{-1}}{-1} + C = \\frac{-2}{u} + C$$'}</p>
                  <p style={S.p}>{'Back-substitute: $R(q) = \\dfrac{-2}{q^2+9} + C$'}</p>
                  <p style={S.p}>{'Apply $R(0) = 0$: $0 = \\dfrac{-2}{9} + C \\Rightarrow C = \\dfrac{2}{9}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{R(q) = \\frac{2}{9} - \\frac{2}{q^2+9} = \\frac{2q^2}{9(q^2+9)}}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Problem 2 */}
              <div style={S.pakBox}>
                <div style={{...S.lbl,color:'#27ae60'}}>Problem 2 — Lahore Population Growth <span style={S.locTag}>Lahore</span></div>
                <p style={S.p}>{"Lahore's population (in millions) is growing at the rate:"}</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{dP}{dt} = 0.3\\sqrt{1 + 0.5t}$$'}</p>
                <p style={S.p}>{'where $t$ is years since 2020. If $P(0) = 14$ million, find $P(t)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = 1+0.5t$, so $du = 0.5\\,dt$, thus $dt = 2\\,du$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$P = \\int 0.3\\sqrt{u}\\cdot 2\\,du = 0.6\\int u^{1/2}\\,du = 0.6\\cdot\\frac{2}{3}u^{3/2} + C = 0.4(1+0.5t)^{3/2} + C$$'}</p>
                  <p style={S.p}>{'Apply $P(0) = 14$: $14 = 0.4(1)^{3/2} + C \\Rightarrow C = 13.6$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{P(t) = 0.4(1+0.5t)^{3/2} + 13.6 \\text{ million}}$$'}</p>
                  <p style={S.p}>{'In 2030 ($t=10$): $P(10) = 0.4(6)^{3/2} + 13.6 \\approx 0.4(14.70) + 13.6 \\approx 19.5$ million.'}</p>
                </ToggleAnswer>
              </div>

              {/* Problem 3 */}
              <div style={S.pakBox}>
                <div style={{...S.lbl,color:'#27ae60'}}>{"Problem 3 — Price-Adjustment Model in Pakistan's Textile Market"} <span style={S.locTag}>Faisalabad</span></div>
                <p style={S.p}>{"The price-adjustment model in Faisalabad's textile sector states that the rate of price change follows:"}</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{dP}{dt} = k(D - S) = \\frac{5}{(P+2)^2}$$'}</p>
                <p style={S.p}>{'where $P$ is price (in PKR hundreds) and $t$ is time (months). Find $P(t)$ given $P(0) = 3$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Separate variables: $(P+2)^2\\,dP = 5\\,dt$'}</p>
                  <p style={S.p}>{'Integrate both sides. Left side: let $u = P+2$, $du = dP$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int u^2\\,du = \\int 5\\,dt \\implies \\frac{(P+2)^3}{3} = 5t + C$$'}</p>
                  <p style={S.p}>{'Apply $P(0)=3$: $\\dfrac{(5)^3}{3} = C \\Rightarrow C = \\dfrac{125}{3}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{(P+2)^3}{3} = 5t + \\frac{125}{3} \\implies (P+2)^3 = 15t + 125$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{P(t) = (15t + 125)^{1/3} - 2}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Problem 4 */}
              <div style={S.pakBox}>
                <div style={{...S.lbl,color:'#27ae60'}}>Problem 4 — LUMS Library Book Circulation <span style={S.locTag}>LUMS, Lahore</span></div>
                <p style={S.p}>The LUMS library finds that book circulation (books borrowed per day) changes at the rate:</p>
                <p style={{textAlign:'center'}}>{'$$C\'(t) = \\frac{200t}{(t^2+1)^{3/2}}$$'}</p>
                <p style={S.p}>{'At the start of semester ($t=0$), $C = 50$ books/day. Find $C(t)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = t^2+1$, $du = 2t\\,dt$, so $t\\,dt = \\dfrac{du}{2}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$C = \\int \\frac{200t}{(t^2+1)^{3/2}}\\,dt = \\int \\frac{200}{u^{3/2}}\\cdot\\frac{du}{2} = 100\\int u^{-3/2}\\,du = 100\\cdot\\frac{u^{-1/2}}{-1/2} + K$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$C = \\frac{-200}{\\sqrt{t^2+1}} + K$$'}</p>
                  <p style={S.p}>{'Apply $C(0) = 50$: $50 = \\dfrac{-200}{1} + K \\Rightarrow K = 250$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{C(t) = 250 - \\frac{200}{\\sqrt{t^2+1}}}$$'}</p>
                  <p style={S.p}>{'As $t \\to \\infty$, $C \\to 250$ books/day — a natural upper limit.'}</p>
                </ToggleAnswer>
              </div>

              {/* Problem 5 */}
              <div style={S.pakBox}>
                <div style={{...S.lbl,color:'#27ae60'}}>Problem 5 — Karachi Port Import Growth <span style={S.locTag}>Karachi</span></div>
                <p style={S.p}>{'The volume of imports through Karachi Port (in billions PKR) grows at:'}</p>
                <p style={{textAlign:'center'}}>{'$$V\'(t) = \\frac{3(\\ln t)^2}{t}$$'}</p>
                <p style={S.p}>{'for $t \\geq 1$ years after 2015, with $V(1) = 0$. Find $V(t)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = \\ln t$, $du = \\dfrac{dt}{t}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$V = \\int \\frac{3(\\ln t)^2}{t}\\,dt = 3\\int u^2\\,du = u^3 + C = (\\ln t)^3 + C$$'}</p>
                  <p style={S.p}>{'Apply $V(1) = 0$: $0 = (\\ln 1)^3 + C = 0 + C \\Rightarrow C = 0$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{V(t) = (\\ln t)^3}$$'}</p>
                  <p style={S.p}>{'In 2025 ($t=10$): $V(10) = (\\ln 10)^3 \\approx (2.303)^3 \\approx 12.2$ billion PKR.'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ MCQ ══ */}
            <section id="mcq" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Interactive Practice</div>
              <h2 style={S.h2}>U-Choice Quiz:<br />Pick the Right Substitution</h2>
              <p style={S.p}>{'For each function below, select the best choice for $u$ to perform the substitution. Choose carefully — you only get one attempt per question!'}</p>
              <MCQWidget />
            </section>

            {/* ══ WHEN IT FAILS ══ */}
            <section id="fails" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Important Limitation</div>
              <h2 style={S.h2}>An Integral Where<br />Substitution Fails</h2>

              <p style={S.p}>Substitution is powerful, but it is not universal. Consider:</p>
              <div style={S.bf}>{'$$\\int e^{x^2}\\,dx$$'}</div>

              <div style={S.warnBox}>
                <div style={{...S.lbl,color:'#c0392b'}}>⚠ Why Substitution Fails Here</div>
                <p style={S.p}>{'Attempt: Let $u = x^2$, so $du = 2x\\,dx$, thus $dx = \\dfrac{du}{2x}$.'}</p>
                <p style={S.p}>{'Substituting: $\\displaystyle\\int e^u \\cdot \\frac{du}{2x}$'}</p>
                <p style={S.p}>{'Problem: we cannot eliminate $x$ — substituting $x = \\sqrt{u}$ gives $\\displaystyle\\int \\frac{e^u}{2\\sqrt{u}}\\,du$, which is no simpler.'}</p>
                <p style={{...S.p,marginBottom:0}}><strong>Conclusion:</strong> {'$\\displaystyle\\int e^{x^2}\\,dx$ has no closed-form antiderivative expressible in terms of elementary functions. This is a famous result — the integral is related to the '}<em>error function</em>{' $\\text{erf}(x)$ used in statistics and physics. Substitution cannot conjure what does not exist.'}</p>
              </div>

              <h3 style={S.h3teal}>Other Integrals With No Elementary Antiderivative</h3>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Integral</th><th style={S.th}>Why It Fails</th><th style={S.th}>Related to</th></tr></thead>
                <tbody>
                  <tr><td style={S.td}>{'$\\int e^{x^2}\\,dx$'}</td><td style={S.td}>No cancellation possible after sub.</td><td style={S.td}>Error function erf$(x)$</td></tr>
                  <tr><td style={S.tdEven}>{'$\\int \\dfrac{\\sin x}{x}\\,dx$'}</td><td style={S.tdEven}>{'$\\sin(u)/\\sqrt{u}$ still intractable'}</td><td style={S.tdEven}>Sine integral Si$(x)$</td></tr>
                  <tr><td style={S.td}>{'$\\int \\dfrac{1}{\\ln x}\\,dx$'}</td><td style={S.td}>No obvious inner function</td><td style={S.td}>Logarithmic integral Li$(x)$</td></tr>
                  <tr><td style={S.tdEven}>{'$\\int \\sqrt{1-k^2\\sin^2 x}\\,dx$'}</td><td style={S.tdEven}>Elliptic integral</td><td style={S.tdEven}>Arc length of ellipses</td></tr>
                </tbody>
              </table>

              <div style={S.calloutTeal}><strong>Lesson:</strong> Always try to verify that substitution is working by checking whether you can eliminate all $x$ terms. If you cannot, try a different $u$, or consider other techniques (parts, partial fractions) or accept that the integral is non-elementary.</div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example Where a Different Technique Is Needed</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int xe^x\\,dx$'}</p>
                <p style={S.p}>{'Try substitution: Let $u = x$, $du = dx$ — useless (no simplification). Let $u = e^x$, $du = e^x dx$, so $x = \\ln u$ — gives $\\displaystyle\\int \\ln(u)\\,du$ — actually harder.'}</p>
                <p style={{...S.p,marginBottom:0}}><strong>Correct technique:</strong> Integration by Parts (§6.1), which gives $xe^x - e^x + C$. Substitution is the wrong tool here.</p>
              </div>
            </section>

            {/* ══ DIFFERENTIAL EQUATIONS ══ */}
            <section id="diffeq" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Differential Equations</div>
              <h2 style={S.h2}>Differential Equations<br />Involving Substitution</h2>

              <p style={S.p}>Many separable differential equations, once separated, yield integrals that require substitution to solve.</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>General Strategy</div>
                <p style={S.p}>{'Given $\\dfrac{dy}{dx} = f(x)\\cdot g(y)$:'}</p>
                <p style={S.p}>{'1. Separate: $\\dfrac{dy}{g(y)} = f(x)\\,dx$'}</p>
                <p style={S.p}>2. Integrate both sides — the left side often requires substitution in $y$, the right in $x$.</p>
                <p style={{...S.p,marginBottom:0}}>3. Solve for $y$, apply initial condition.</p>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Substitution on the Right Side</h4>
                <p style={S.p}>{'Solve $\\dfrac{dy}{dx} = x(x^2+1)^3$, $y(0) = 2$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Integrate: $y = \\displaystyle\\int x(x^2+1)^3\\,dx$'}</p>
                  <p style={S.p}>{'Let $u = x^2+1$, $du = 2x\\,dx$, so $x\\,dx = \\dfrac{du}{2}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$y = \\int u^3 \\cdot \\frac{du}{2} = \\frac{u^4}{8} + C = \\frac{(x^2+1)^4}{8} + C$$'}</p>
                  <p style={S.p}>{'Apply $y(0) = 2$: $2 = \\dfrac{1}{8} + C \\Rightarrow C = \\dfrac{15}{8}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{y = \\frac{(x^2+1)^4}{8} + \\frac{15}{8}}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Substitution on Both Sides</h4>
                <p style={S.p}>{'Solve $\\dfrac{dy}{dx} = \\dfrac{x}{(y+1)^2}$, $y(0) = 0$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Separate: $(y+1)^2\\,dy = x\\,dx$'}</p>
                  <p style={S.p}>{'Left side: let $v = y+1$, $dv = dy$: $\\displaystyle\\int v^2\\,dv = \\dfrac{v^3}{3} = \\dfrac{(y+1)^3}{3}$'}</p>
                  <p style={S.p}>{'Right side: $\\displaystyle\\int x\\,dx = \\dfrac{x^2}{2}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{(y+1)^3}{3} = \\frac{x^2}{2} + C$$'}</p>
                  <p style={S.p}>{'Apply $y(0)=0$: $\\dfrac{1}{3} = C$'}</p>
                  <p style={{textAlign:'center'}}>{'$$(y+1)^3 = \\frac{3x^2}{2} + 1 \\implies \\boxed{y = \\left(\\frac{3x^2}{2}+1\\right)^{1/3} - 1}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Logistic-Type Equation</h4>
                <p style={S.p}>{'Solve $\\dfrac{dP}{dt} = P(1-P)$, $P(0) = 0.1$ (the logistic equation).'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Separate: $\\dfrac{dP}{P(1-P)} = dt$'}</p>
                  <p style={S.p}>{'Left side requires partial fractions: $\\dfrac{1}{P(1-P)} = \\dfrac{1}{P} + \\dfrac{1}{1-P}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int\\!\\left(\\frac{1}{P}+\\frac{1}{1-P}\\right)dP = \\int dt$$'}</p>
                  <p style={S.p}>{'For $\\int\\dfrac{dP}{1-P}$: let $u = 1-P$, $du = -dP$: gives $-\\ln|1-P|$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\ln P - \\ln(1-P) = t + C \\implies \\ln\\frac{P}{1-P} = t + C$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{P}{1-P} = Ae^t \\implies P = \\frac{Ae^t}{1+Ae^t}$$'}</p>
                  <p style={S.p}>{'Apply $P(0)=0.1$: $A = \\dfrac{0.1}{0.9} = \\dfrac{1}{9}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{P(t) = \\frac{e^t}{9+e^t}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ IVP ══ */}
            <section id="ivp" className="lec-sec">
              <div style={S.secLabel}>§ 9 — Initial Value Problems</div>
              <h2 style={S.h2}>Solving IVPs<br />with Substitution</h2>

              <p style={S.p}>An <strong>initial value problem (IVP)</strong> adds a specific condition {'$y(x_0) = y_0$'} to pin down the constant of integration $C$.</p>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>IVP Example 1</h4>
                <p style={S.p}>{'Find $f(x)$ given $f\'(x) = \\dfrac{6x^2}{(x^3+1)^4}$ and $f(0) = 5$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = x^3+1$, $du = 3x^2\\,dx$, so $6x^2\\,dx = 2\\,du$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$f = \\int \\frac{2\\,du}{u^4} = 2\\int u^{-4}\\,du = 2\\cdot\\frac{u^{-3}}{-3} + C = \\frac{-2}{3(x^3+1)^3} + C$$'}</p>
                  <p style={S.p}>{'Apply $f(0) = 5$: $5 = \\dfrac{-2}{3} + C \\Rightarrow C = \\dfrac{17}{3}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{f(x) = \\frac{-2}{3(x^3+1)^3} + \\frac{17}{3}}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>IVP Example 2</h4>
                <p style={S.p}>{"A LUMS student's study intensity (hours per day) follows $I'(t) = \\sqrt{2t+1}$ with $I(0) = 0$. Find $I(t)$ and $I(4)$."}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = 2t+1$, $du = 2\\,dt$, so $dt = \\dfrac{du}{2}$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$I = \\int \\sqrt{u}\\cdot\\frac{du}{2} = \\frac{1}{2}\\cdot\\frac{2}{3}u^{3/2} + C = \\frac{(2t+1)^{3/2}}{3} + C$$'}</p>
                  <p style={S.p}>{'Apply $I(0)=0$: $0 = \\dfrac{1}{3} + C \\Rightarrow C = -\\dfrac{1}{3}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{I(t) = \\frac{(2t+1)^{3/2} - 1}{3}}$$'}</p>
                  <p style={S.p}>{'At $t=4$: $I(4) = \\dfrac{(9)^{3/2}-1}{3} = \\dfrac{27-1}{3} = \\dfrac{26}{3} \\approx 8.67$ hours/day.'}</p>
                </ToggleAnswer>
              </div>

              <div style={S.divider} />
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Coming up next —</strong> §5.3 The Fundamental Theorem of Calculus (Full Treatment) — connecting differentiation and integration into one of mathematics' most beautiful theorems.</div>
            </section>

          </div>{/* end lec-inner */}

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s51" style={S.lnfBtnPrev}>← §5.1 Indefinite Integration</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§5.2 · Chapter 5 · Calculus I</div>
            <Link href="/courses/calc1/s53" style={S.lnfBtnNext}>§5.3 FTC →</Link>
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}