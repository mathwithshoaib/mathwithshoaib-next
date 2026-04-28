'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

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
  tocNav: { padding: '8px 0 24px' },
  tocCh: { fontFamily: 'var(--fm)', fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--text3)', padding: '10px 16px 3px', display: 'block' },
  tocA: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'none', borderLeft: '2px solid transparent', transition: 'all .18s', lineHeight: 1.35 },
  tocActive: { color: 'var(--amber)', borderLeft: '2px solid var(--amber)', background: 'rgba(232,160,32,.08)' },
  tocSoon: { opacity: .38, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'none' },
  dot: { width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0 },
  dotActive: { width: '4px', height: '4px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 },
  cmain: { flex: 1, minWidth: 0, background: '#fdf8f0', overflow: 'hidden', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.05rem', lineHeight: 1.8, color: '#1a1a2e' },
  lecInner: { maxWidth: '100%', margin: '0 auto', padding: '0 52px 60px' },
  lecHero: { background: '#1a1a2e', color: '#fdf8f0', padding: '52px 40px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  lecHeroTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '14px', position: 'relative' },
  lecHeroH1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '14px', position: 'relative' },
  lecHeroP: { fontSize: '1rem', color: '#c9c2b8', maxWidth: '520px', margin: '0 auto 24px', position: 'relative' },
  lecHeroLine: { width: '56px', height: '3px', background: '#d4a017', margin: '0 auto' },
  lecNav: { background: 'rgba(253,248,240,.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e0d6c8', padding: '8px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  lecNavA: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.64rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7f8c8d', textDecoration: 'none', padding: '4px 11px', borderRadius: '20px', border: '1px solid #e0d6c8', transition: 'all .2s' },
  card: { background: '#fff', border: '1px solid #e0d6c8', borderRadius: '12px', padding: '30px 34px', boxShadow: '0 4px 24px rgba(26,26,46,.10)', marginBottom: '26px' },
  cardAl: { borderLeft: '4px solid #c0392b' },
  cardGl: { borderLeft: '4px solid #d4a017' },
  cardTl: { borderLeft: '4px solid #1a6b6b' },
  cardSl: { borderLeft: '4px solid #2980b9' },
  defBox: { background: '#eef7f7', border: '1.5px solid #1a6b6b', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  thmBox: { background: '#fff8ec', border: '1.5px solid #d4a017', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  noteBox: { background: '#f0f4ff', border: '1.5px solid #2980b9', borderRadius: '8px', padding: '20px 24px', margin: '20px 0' },
  lbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' },
  callout: { background: '#fdf0ef', borderLeft: '4px solid #c0392b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutTeal: { background: '#eef7f7', borderLeft: '4px solid #1a6b6b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGold: { background: '#fff8ec', borderLeft: '4px solid #d4a017', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  widget: { background: '#1a1a2e', borderRadius: '16px', padding: '26px 26px 18px', margin: '30px 0', color: '#e8e2d9' },
  wt: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  toggleBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a1a2e', color: '#d4a017', border: 'none', borderRadius: '6px', padding: '9px 20px', cursor: 'pointer', marginTop: '10px', transition: 'opacity .2s' },
  answerBox: { background: '#f0f9f0', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '18px 22px', marginTop: '12px' },
  secLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.26em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '8px' },
  subsec: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#2980b9', margin: '44px 0 6px', paddingBottom: '6px', borderBottom: '1px solid #e0d6c8' },
  ruleHL: { background: '#f5ede0', borderRadius: '8px', padding: '18px 20px', textAlign: 'center', margin: '14px 0', fontSize: '1.05rem' },
  divider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '52px 0' },
  subDivider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '36px 0' },
  lecFooterNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px', borderTop: '1px solid #e0d6c8', flexWrap: 'wrap', gap: '12px', background: '#fdf8f0' },
  lnfBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7f8c8d', padding: '8px 18px', border: '1px solid #e0d6c8', borderRadius: '8px', textDecoration: 'none' },
  lnfBtnNext: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#1a6b6b', borderColor: '#1a6b6b', background: '#eef7f7', padding: '8px 18px', border: '1px solid #1a6b6b', borderRadius: '8px', textDecoration: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '.94rem' },
  th: { background: '#1a1a2e', color: '#d4a017', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', padding: '9px 13px', textAlign: 'left' },
  td: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8' },
  tdEven: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8', background: '#f5ede0' },
  h2: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.7rem,4vw,2.55rem)', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2, color: '#1a1a2e' },
  h3: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.32rem', fontWeight: 700, margin: '30px 0 12px', color: '#1a6b6b' },
  h4red: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#c0392b' },
  h4gold: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#d4a017' },
  h4teal: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#1a6b6b' },
  h4blue: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#2980b9' },
  sep: { borderTop: '1px solid #e0d6c8', paddingTop: '14px', marginTop: '14px' },
  p: { marginBottom: '16px', color: '#1a1a2e' },
};

// ─── Latex-safe paragraph helper ──────────────────────────────────────────
// Wraps raw string (with LaTeX) as a JS string expression to avoid JSX parse errors
function M({ children, style }) {
  return <p style={{ ...S.p, ...style }} dangerouslySetInnerHTML={{ __html: children }} />;
}

// ─── ToggleAnswer ──────────────────────────────────────────────────────────
function ToggleAnswer({ label = 'Show Solution', children }) {
  const ref = useRef(null);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const visible = el.style.display === 'block';
    el.style.display = visible ? 'none' : 'block';
    // Same fix here:
    if (!visible && window.MathJax?.typesetPromise) window.MathJax.typesetPromise([el]);
  };
  return (
    <>
      <button style={S.toggleBtn} onClick={toggle}>{label}</button>
      <div ref={ref} style={{ ...S.answerBox, display: 'none' }}>{children}</div>
    </>
  );
}

// ─── Sidebar TOC data ──────────────────────────────────────────────────────
const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: ['1.1 · Functions','1.2 · The Graph of a Function','1.3 · Lines and Linear Functions','1.4 · Functional Models','1.5 · Limits','1.6 · One-Sided Limits and Continuity'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: ['2.1 · The Derivative','2.2 · Techniques of Differentiation','2.3 · Product and Quotient Rules','2.4 · The Chain Rule','2.5 · Marginal Analysis','2.6 · Implicit Differentiation'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 3 — Applications of the Derivative', items: ['3.1 · Increasing & Decreasing Functions','3.2 · Concavity & Inflection Points','3.3 · Curve Sketching','3.4 · Optimization; Elasticity','3.5 · Additional Optimization'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: ['4.1 · Exponential Functions','4.2 · Logarithmic Functions','4.3 · Differentiation of Exp & Log','4.4 · Exponential Models'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration', href: '/courses/calc1/s51', active: true, live: true },
    { label: '5.2 · Integration by Substitution', href: '/courses/calc1/s52', live: true },
    { label: '5.3 · The Definite Integral & FTC', href: '/courses/calc1/s53', live: true },
    { label: '5.4 · Applying Definite Integration', soon: true },
    { label: '5.5 · Applications to Business', soon: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: ['6.1 · Integration by Parts','6.2 · Numerical Integration','6.3 · Improper Integrals','6.4 · Continuous Probability'].map(l=>({label:l,soon:true})) },
];

// ─── Canvas draw ───────────────────────────────────────────────────────────
function drawComp(canvas, P, r, tCur) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = 260 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = 260;
  const pad = { l:62, r:16, t:14, b:30 };
  const gW = W-pad.l-pad.r, gH = H-pad.t-pad.b;
  const tMax = 40, Bmax = P*Math.exp(r*tMax)*1.06;
  const tX = t => pad.l + t/tMax*gW;
  const tY = v => pad.t + gH - v/Bmax*gH;
  ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
  for (let i=0;i<=4;i++) {
    const y = Bmax*i/4;
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke();
    ctx.fillStyle='#6b7280'; ctx.font='10px IBM Plex Mono,monospace';
    ctx.fillText(y>=1000?(y/1000).toFixed(0)+'k':y.toFixed(0),2,tY(y)+4);
  }
  ctx.setLineDash([5,4]); ctx.strokeStyle='#6b7280'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(tX(0),tY(P)); ctx.lineTo(tX(tMax),tY(P)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(tX(0),tY(P));
  for (let i=1;i<=300;i++){const t=tMax*i/300; ctx.lineTo(tX(t),tY(P*Math.exp(r*t)));}
  ctx.strokeStyle='#34d399'; ctx.lineWidth=2.5; ctx.stroke();
  const Bval = P*Math.exp(r*tCur);
  ctx.setLineDash([4,3]); ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1.1;
  ctx.beginPath(); ctx.moveTo(tX(tCur),tY(Bval)); ctx.lineTo(tX(tCur),tY(0)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#fbbf24'; ctx.beginPath(); ctx.arc(tX(tCur),tY(Bval),7,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#92400e'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#fbbf24'; ctx.font='bold 11px IBM Plex Mono,monospace';
  ctx.fillText('PKR '+Bval.toFixed(0),tX(tCur)+10,tY(Bval)-7);
  ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
  ctx.fillStyle='#9ca3af'; ctx.font='11px IBM Plex Mono,monospace';
  [0,10,20,30,40].forEach(t=>ctx.fillText(t+'yr',tX(t)-12,H-6));
}

// ─── Integral Builder rules ────────────────────────────────────────────────
const RULES = {
  x3:    ['Identify $n=3$.',                                       'Apply power rule: raise exponent by 1, divide.',                          '$$\\int x^3\\,dx = \\frac{x^4}{4}+C$$'],
  x5:    ['Factor out 5: $5\\int x^4\\,dx$.',                      'Apply power rule with $n=4$.',                                            '$$5\\cdot\\frac{x^5}{5}+C = x^5+C$$'],
  sqrt2: ['Write $\\sqrt{x}=x^{1/2}$, so $n=\\tfrac{1}{2}$.',     'New exponent: $\\tfrac{3}{2}$. Divide: $\\tfrac{1}{3/2}=\\tfrac{2}{3}$.', '$$\\int\\sqrt{x}\\,dx = \\tfrac{2}{3}x^{3/2}+C$$'],
  ex:    ['$e^x$ is its own antiderivative.',                       '',                                                                         '$$\\int e^x\\,dx = e^x+C$$'],
  e3x:   ['Exponential rule with $k=3$.',                          'Divide by $k$: $\\frac{e^{3x}}{3}$.',                                     '$$\\int e^{3x}\\,dx = \\frac{e^{3x}}{3}+C$$'],
  recip: ['Power rule fails for $n=-1$.',                          'Use logarithmic rule instead.',                                            '$$\\int\\frac{1}{x}\\,dx = \\ln|x|+C$$'],
  poly:  ['Split using sum/difference rule.',                       'Integrate each term separately.',                                          '$$\\int(3x^2-2x+5)\\,dx = x^3-x^2+5x+C$$'],
  neg:   ['Write $x^{-3}$, so $n=-3$.',                            'New exponent: $-2$. Divide by $-2$.',                                     '$$\\int x^{-3}\\,dx = \\frac{x^{-2}}{-2}+C = -\\frac{1}{2x^2}+C$$'],
};

// ─── Main component ────────────────────────────────────────────────────────
export default function Calc1S51() {
  const compCanvasRef = useRef(null);
  const ruleOutputRef = useRef(null);
  const pSliderRef    = useRef(null);
  const rSliderRef    = useRef(null);
  const tSliderRef    = useRef(null);
  const pValRef       = useRef(null);
  const rValRef       = useRef(null);
  const tValRef       = useRef(null);
  const compResRef    = useRef(null);
  const compIntRef    = useRef(null);
  const compDblRef    = useRef(null);
  const ruleSelRef    = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState({ 5: true }); // Ch5 open by default (index 5)

  const updateComp = () => {
    const P = +(pSliderRef.current?.value||5000);
    const r = +(rSliderRef.current?.value||6)/100;
    const t = +(tSliderRef.current?.value||10);
    if(pValRef.current)  pValRef.current.textContent  = P;
    if(rValRef.current)  rValRef.current.textContent  = (r*100).toString();
    if(tValRef.current)  tValRef.current.textContent  = t;
    const Bt = P*Math.exp(r*t);
    if(compResRef.current) compResRef.current.textContent = Bt.toFixed(2);
    if(compIntRef.current) compIntRef.current.textContent = (Bt-P).toFixed(2);
    if(compDblRef.current) compDblRef.current.textContent = (Math.log(2)/r).toFixed(1);
    drawComp(compCanvasRef.current, P, r, t);
  };

  const showRule = () => {
  const key = ruleSelRef.current?.value || 'x3';
  const steps = RULES[key];
  if (!steps || !ruleOutputRef.current) return;
  let html = '';
  steps.forEach((s, i) => {
    if (!s) return;
    const last = i === steps.length - 1;
    html += `<div style="margin-bottom:10px;color:${last ? '#fbbf24' : '#e8e2d9'}">`;
    if (!last) html += `<span style="color:#9ca3af;font-size:.72rem;margin-right:8px">Step ${i + 1}.</span>`;
    html += s + '</div>';
  });
  ruleOutputRef.current.innerHTML = html;
  // Check typesetPromise specifically, not just MathJax
  if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([ruleOutputRef.current]);
};

  useEffect(() => {
    const handleScroll = () => {
      const el  = document.documentElement;
      const bar = document.getElementById('sk-progress-bar');
      if (bar) bar.style.width = (el.scrollTop/(el.scrollHeight-el.clientHeight)*100)+'%';
    };
    window.addEventListener('scroll', handleScroll, {passive:true});

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),
      {threshold:0.1}
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const handleResize = () => updateComp();
    window.addEventListener('resize', handleResize, {passive:true});

    const init = () => { updateComp(); showRule(); };
        if (document.fonts) document.fonts.ready.then(init); else init();

        // Typeset math after MathJax loads
        const typesetInterval = setInterval(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
            clearInterval(typesetInterval);
        }
        }, 100);

    return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    clearInterval(typesetInterval); // add this
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
        <Navbar activePage="courses" />
      {/* MathJax config */}
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
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:#d4a017; border-radius:50%; cursor:pointer; }
        @media(max-width:860px){
          .csb-hide{display:none!important;}
          .lec-inner-m{padding:0 18px 40px!important;}
          .lec-hero-m{padding:36px 20px 32px!important;}
          .lec-fnav-m{padding:20px 18px!important;}
        }
      `}</style>

      {/* ── STICKY SUBNAV ── */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§5.1 Indefinite Integration</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1"   style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg"  style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      {/* ── COURSE FRAME ── */}
      <div style={S.courseFrame}>

        {/* SIDEBAR */}
    <aside style={S.csb} className="csb-hide">
    <div style={S.csbHead}>
        <div style={S.csbTag}>MATH-101 · Calculus I</div>
        <div style={S.csbTitle}>Course Contents</div>
        <Link href="/courses/calc1" style={S.csbBack}>← All Courses</Link>
    </div>

    {/* Course Overview link */}
    <div style={{ padding: '8px 0 4px' }}>
        <Link href="/courses/calc1" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'none', lineHeight: 1.35 }}>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
        Course Overview
        </Link>
    </div>

    {/* Accordion chapters */}
    <nav style={{ padding: '4px 0 24px' }}>
        {TOC.map((sec, i) => {
        if (sec.ch === 'Course Overview') return null;
        const isOpen = !!sidebarOpen[i];
        const hasLive = sec.items.some(item => item.live || item.href);
        return (
            <div key={sec.ch} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
                onClick={() => setSidebarOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em',
                textTransform: 'uppercase', color: hasLive ? 'var(--teal)' : 'var(--text3)',
                textAlign: 'left',
                }}
            >
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
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)',pointerEvents:'none'}}/>
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 5 &nbsp;·&nbsp; Section 5.1</div>
            <h1 style={S.lecHeroH1}>The Art of<br/><em style={{color:'#d4a017',fontStyle:'italic'}}>Undoing</em></h1>
            <p style={S.lecHeroP}>You have spent two months mastering derivatives — the art of finding rates of change. Now we ask the reverse: given the rate, can we recover the original? Welcome to integration.</p>
            <div style={S.lecHeroLine}/>
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#story','The Big Shift'],['#antidiff','Antiderivatives'],['#notation','Notation'],
              ['#rules51','Integration Rules'],['#apps','Applications'],['#diffeq','Diff. Equations'],
              ['#compounding','Compounding'],['#practice','Practice']].map(([href,label])=>(
              <a key={href} href={href} style={S.lecNavA}>{label}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ══ §1  THE BIG SHIFT ══ */}
            <section id="story" className="lec-sec">
              <div style={S.secLabel}>The Big Shift</div>
              <h2 style={S.h2}>Two Months of Derivatives.<br/>Now, Everything Runs Backwards.</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={S.p}>Think back to the beginning of this course. A car moves along a road and you asked: <em>"Given the position, what is the speed at this instant?"</em> You differentiated. The derivative gave you the rate of change.</p>
                <p style={S.p}>Now flip the entire question around. The speedometer is broken, but the odometer works perfectly — you know <em>exactly how fast</em> the car is moving at every moment. The question is now: <em>"Given the speed, what was the total distance traveled?"</em></p>
                <p style={{...S.p,marginBottom:0}}>This reverse question, recovering a quantity from its rate of change, is the soul of <strong>integration</strong>. If differentiation is the art of finding the derivative, integration is the art of <em>undoing</em> it. And just as the derivative turned out to be one of the most powerful ideas in mathematics, so too will its inverse. </p>
              </div>

              <div style={{...S.calloutGold,marginTop:'24px'}}>
                <strong>Where we are in the course:</strong> Chapters 1–4 built the machinery of differentiation. Chapter 5 opens a second world entirely — the world of accumulation, area, and antiderivatives. By the end of this chapter, you will see that these two worlds are secretly the same, connected by the most beautiful theorem in calculus.
              </div>

              <div style={{...S.card,...S.cardAl,marginTop:'24px'}}>
                <h4 style={S.h4red}>🚗 A Concrete Example of the Reverse Problem</h4>
                <p style={S.p}>A delivery rider in Lahore tracks her speed (km/h) every 30 minutes during a 3-hour shift:</p>
                <table style={S.table}>
                  <thead><tr>
                    <th style={S.th}>Time (hr)</th>
                    {['0.0','0.5','1.0','1.5','2.0','2.5'].map(v=><th key={v} style={S.th}>{v}</th>)}
                  </tr></thead>
                  <tbody><tr>
                    <td style={S.td}><strong>Speed (km/h)</strong></td>
                    {[30,45,60,40,55,50].map(v=><td key={v} style={S.td}>{v}</td>)}
                  </tr></tbody>
                </table>
                <p style={S.p}>Best estimate of distance: {'$(30+45+60+40+55+50)(0.5) = \\mathbf{140 \\text{ km}}$'}</p>
                <p style={{...S.p,marginBottom:0}}>But speed changes <em>continuously</em>. If speed were given by a formula {'$v(t)$'}, could we find the exact distance? Yes — that is precisely what integration will give us.</p>
              </div>

              <div style={S.callout}><strong>The Core Question of §5.1:</strong> {'Given a function $f(x)$, can we find a function $F(x)$ whose derivative is $f(x)$? That is, can we find $F$ such that $F\'(x) = f(x)$?'}</div>
            </section>

            {/* ══ §2  ANTIDIFFERENTIATION ══ */}
            <section id="antidiff" className="lec-sec">
              <div style={S.subsec}>5.1a — Antidifferentiation</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>Antidifferentiation</h3>
              <p style={S.p}>If differentiation is the art of finding rates of change, <strong>antidifferentiation</strong> is the art of running backwards — recovering a function from its derivative.</p>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>Definition — Antiderivative</div>
                <p style={{...S.p,marginBottom:0}}>{'A function $F(x)$ is an '}<strong>antiderivative</strong>{' of $f(x)$ if $F\'(x) = f(x)$ for all $x$ in the domain.'}</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>First Examples</h4>
                <p style={S.p}><strong>Example 1.</strong> {'Find an antiderivative of $f(x) = 3x^2$. Ask: what function differentiates to $3x^2$? We know $\\frac{d}{dx}(x^3) = 3x^2$. So $F(x) = x^3$ is an antiderivative.'}</p>
                <p style={{...S.p,marginBottom:0}}><strong>Example 2.</strong> {'Find an antiderivative of $f(x) = \\cos x$. Since $\\frac{d}{dx}(\\sin x) = \\cos x$, we have $F(x) = \\sin x$.'}</p>
              </div>

              <h4 style={S.h4blue}>Fundamental Property of Antiderivatives</h4>
              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Theorem</div>
                <p style={{...S.p,marginBottom:0}}>{'If $F(x)$ is an antiderivative of continuous $f(x)$, then every other antiderivative has the form $G(x) = F(x) + C$ for some constant $C \\in \\mathbb{R}$.'}</p>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>💡 Why the +C? Quick Proof</h4>
                <p style={S.p}>{'Let $G$ be any antiderivative of $f$, and $F$ another. Define $H = G - F$. Then $H\'(x) = G\'(x) - F\'(x) = f(x) - f(x) = 0$ everywhere. A function with zero derivative everywhere must be a constant. So $G - F = C$, giving $G = F + C$. ∎'}</p>
                <p style={{...S.p,marginBottom:0}}><em>Geometric meaning:</em> {'All antiderivatives are vertical shifts of each other. The family $x^3$, $x^3+7$, $x^3 - \\pi$ all have derivative $3x^2$.'}</p>
              </div>
            </section>

            {/* ══ §3  NOTATION ══ */}
            <section id="notation" className="lec-sec">
              <div style={S.subsec}>5.1b — The Indefinite Integral & Its Notation</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>The Indefinite Integral</h3>
              <p style={S.p}>The collection of all antiderivatives of f(x) is called the <strong>indefinite integral</strong> of f, written with the integral sign:</p>

              {/* Annotated SVG */}
              <svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'620px',display:'block',margin:'28px auto'}}>
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </marker>
                </defs>
                <rect x="10" y="10" width="660" height="260" rx="14" fill="#fdf8f0" stroke="#e0d6c8" strokeWidth="1"/>
                <text x="340" y="148" textAnchor="middle" fontSize="52" fontFamily="Georgia,serif" fill="#1a1a2e">
                    <tspan fontStyle="italic">∫</tspan><tspan dx="4"> 3</tspan><tspan fontStyle="italic">x</tspan><tspan>²</tspan><tspan dx="6" fontStyle="italic">dx</tspan><tspan dx="10">=</tspan><tspan dx="10" fontStyle="italic">x</tspan><tspan>³</tspan><tspan dx="6">+</tspan><tspan dx="6" fill="#c0392b" fontWeight="bold" fontStyle="italic">C</tspan>
                </text>
                <line x1="162" y1="158" x2="90" y2="220" stroke="#b03a6e" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#arrow)"/>
                <text x="90" y="238" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#b03a6e" fontWeight="600">INTEGRAL SYMBOL</text>
                <text x="90" y="251" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#b03a6e">"stretched S" for Summa</text>
                <line x1="228" y1="122" x2="228" y2="62" stroke="#1a6b6b" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#arrow)"/>
                <text x="228" y="52" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a6b6b" fontWeight="600">INTEGRAND</text>
                <text x="228" y="40" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1a6b6b">function to integrate</text>
                <line x1="293" y1="158" x2="293" y2="218" stroke="#2980b9" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#arrow)"/>
                <text x="293" y="232" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#2980b9" fontWeight="600">VARIABLE OF</text>
                <text x="293" y="245" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#2980b9" fontWeight="600">INTEGRATION</text>
                <text x="293" y="258" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#2980b9">respect to x</text>
                <line x1="410" y1="118" x2="450" y2="62" stroke="#d4a017" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#arrow)"/>
                <text x="490" y="52" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#d4a017" fontWeight="600">ANTIDERIVATIVE</text>
                <text x="490" y="40" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#d4a017">result of integration</text>
                <line x1="512" y1="158" x2="560" y2="218" stroke="#c0392b" strokeWidth="1.2" strokeDasharray="5,3" markerEnd="url(#arrow)"/>
                <text x="575" y="232" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#c0392b" fontWeight="600">CONSTANT OF</text>
                <text x="575" y="245" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#c0392b" fontWeight="600">INTEGRATION</text>
                <text x="575" y="258" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#c0392b">any real number C</text>
                </svg>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>The Indefinite Integral</div>
                <p style={S.p}>{'If $F\'(x)=f(x)$, then:'}</p>
                <p style={{textAlign:'center',fontSize:'1.2rem',margin:'8px 0'}}>{'$$\\int f(x)\\,dx = F(x) + C$$'}</p>
                <table style={{...S.table,marginTop:'12px'}}>
                  <thead><tr><th style={S.th}>Symbol</th><th style={S.th}>Name</th><th style={S.th}>Meaning</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}>{'$\\int$'}</td><td style={S.td}>Integral sign</td><td style={S.td}>Stretched "S" — Leibniz invented it in 1675 for <em>Summa</em> (sum)</td></tr>
                    <tr><td style={S.tdEven}>{'$f(x)$'}</td><td style={S.tdEven}>Integrand</td><td style={S.tdEven}>The function being antidifferentiated</td></tr>
                    <tr><td style={S.td}>{'$dx$'}</td><td style={S.td}>Differential</td><td style={S.td}>{'Identifies the variable; connects to the limit $\\Delta x \\to 0$ later'}</td></tr>
                    <tr><td style={S.tdEven}>{'$C$'}</td><td style={S.tdEven}>Constant of integration</td><td style={S.tdEven}>Represents the entire family of antiderivatives</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={S.calloutTeal}>
                <strong>Key difference:</strong> The <em>indefinite</em> integral {'$\\int f(x)\\,dx$'} is a <em>family of functions</em> (with {'$+C$'}). The <em>definite</em> integral {'$\\int_a^b f(x)\\,dx$'} is a <em>number</em>. We study the definite integral in §5.3.
              </div>
            </section>

            {/* ══ §4  INTEGRATION RULES ══ */}
            <section id="rules51" className="lec-sec">
              <div style={S.subsec}>5.1c — Rules for Integrating Common Functions</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>Integration Rules</h3>
              <p style={S.p}>Each rule below is simply a differentiation rule read in reverse. Always verify by differentiating your answer.</p>

              {/* Rule 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Rule 1 — The Constant Rule</h4>
                <div style={S.ruleHL}>{'$$\\int k\\,dx = kx + C$$'}</div>
                <p style={S.p}>{'Since $\\frac{d}{dx}(kx)=k$, the antiderivative of any constant $k$ is $kx$.'}</p>
                <div style={S.sep}><strong>Example 1.</strong> {'$\\displaystyle\\int 7\\,dx = 7x + C$ — Check: $\\frac{d}{dx}(7x+C)=7$ ✓'}</div>
                <div style={S.sep}><strong>Example 2.</strong> {'$\\displaystyle\\int (-4)\\,dx = -4x + C$'}</div>
                <ToggleAnswer label="Try: ∫ 0 dx">
                  <p style={S.p}>{'$\\displaystyle\\int 0\\,dx = C$ (a constant function has zero derivative, so any constant is an antiderivative of zero)'}</p>
                </ToggleAnswer>
              </div>

              {/* Rule 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Rule 2 — The Power Rule</h4>
                <div style={{...S.ruleHL,background:'#fff8ec'}}>{'$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)$$'}</div>
                <p style={S.p}><em>Raise the exponent by 1, divide by the new exponent.</em> This works for any n ≠ −1, including fractions and negatives.</p>
                <div style={S.sep}><strong>Example 1.</strong> {'$\\displaystyle\\int x^5\\,dx = \\frac{x^6}{6} + C$'}</div>
                <div style={S.sep}><strong>Example 2 (fractional exponent).</strong> {'$\\displaystyle\\int \\sqrt{x}\\,dx = \\int x^{1/2}\\,dx = \\frac{x^{3/2}}{3/2} + C = \\frac{2}{3}x^{3/2}+C$'}</div>
                <div style={S.sep}><strong>Example 3 (negative exponent).</strong> {'$\\displaystyle\\int x^{-3}\\,dx = \\frac{x^{-2}}{-2}+C = -\\frac{1}{2x^2}+C$'}</div>
                <ToggleAnswer label="Try: ∫ x^(3/4) dx">
                  <p style={S.p}>{'$\\dfrac{x^{7/4}}{7/4}+C = \\dfrac{4}{7}x^{7/4}+C$'}</p>
                </ToggleAnswer>
              </div>

              {/* Rule 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Rule 3 — The Logarithmic Rule</h4>
                <div style={{...S.ruleHL,background:'#eef7f7'}}>{'$$\\int \\frac{1}{x}\\,dx = \\ln|x| + C \\qquad (x \\neq 0)$$'}</div>
                <p style={S.p}>{'The power rule fails when $n=-1$ (division by zero). Since $\\frac{d}{dx}\\ln|x|=\\frac{1}{x}$, this fills the gap.'}</p>
                <div style={S.sep}><strong>Example.</strong> {'$\\displaystyle\\int \\frac{8}{x}\\,dx = 8\\int\\frac{1}{x}\\,dx = 8\\ln|x|+C$'}</div>
              </div>

              {/* Rule 4 */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Rule 4 — The Exponential Rule</h4>
                <div style={{...S.ruleHL,background:'#f0f4ff'}}>{'$$\\int e^x\\,dx = e^x + C \\qquad \\text{and} \\qquad \\int e^{kx}\\,dx = \\frac{e^{kx}}{k}+C$$'}</div>
                <p style={S.p}>{'$e^x$ is its own derivative, so it is also its own antiderivative. The $k$ in the denominator corrects for the chain rule factor.'}</p>
                <div style={S.sep}><strong>Example 1.</strong> {'$\\displaystyle\\int e^{3x}\\,dx = \\frac{e^{3x}}{3}+C$ — Check: $\\frac{d}{dx}\\!\\left(\\frac{e^{3x}}{3}\\right) = e^{3x}$ ✓'}</div>
                <div style={S.sep}><strong>Example 2.</strong> {'$\\displaystyle\\int 5e^{-2x}\\,dx = 5\\cdot\\frac{e^{-2x}}{-2}+C = -\\frac{5}{2}e^{-2x}+C$'}</div>
              </div>

              <div style={S.subDivider}/>
              <div style={{...S.subsec,marginTop:0}}>Algebraic Rules for Indefinite Integration</div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Constant Multiple Rule</div>
                <p style={{...S.p,margin:0}}>{'$$\\int k\\cdot f(x)\\,dx = k\\int f(x)\\,dx$$'}</p>
              </div>
              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Sum and Difference Rule</div>
                <p style={{...S.p,margin:0}}>{'$$\\int \\bigl[f(x) \\pm g(x)\\bigr]\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx$$'}</p>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>✏️ Example — Combining Rules</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int\\!\\left(6x^2 - \\frac{4}{x} + 3e^x\\right)dx$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$$\\int 6x^2\\,dx - \\int\\frac{4}{x}\\,dx + \\int 3e^x\\,dx = 2x^3 - 4\\ln|x| + 3e^x + C$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>✏️ Example — Simplify Before Integrating</h4>
                <p style={S.p}>{'Find $\\displaystyle\\int\\frac{x^3 - 4x}{x}\\,dx$.'}</p>
                <p style={S.p}>{'First simplify: $\\dfrac{x^3-4x}{x} = x^2 - 4$'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$$\\int(x^2-4)\\,dx = \\frac{x^3}{3}-4x+C$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Live Integral Builder Widget */}
              <div style={S.widget}>
                <div style={S.wt}>⚡ Live Integral Builder</div>
                <p style={{fontSize:'.85rem',color:'#9ca3af',marginBottom:'14px'}}>Select a function to see the antiderivative step by step.</p>
                <select ref={ruleSelRef} onChange={showRule} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.8rem',background:'#1f2937',color:'#e8e2d9',border:'1px solid #374151',borderRadius:'6px',padding:'5px 11px',cursor:'pointer',marginBottom:'16px',width:'300px'}}>
                  <option value="x3">f(x) = x³</option>
                  <option value="x5">f(x) = 5x⁴</option>
                  <option value="sqrt2">f(x) = √x</option>
                  <option value="ex">f(x) = eˣ</option>
                  <option value="e3x">f(x) = e^(3x)</option>
                  <option value="recip">f(x) = 1/x</option>
                  <option value="poly">f(x) = 3x² − 2x + 5</option>
                  <option value="neg">f(x) = x⁻³</option>
                </select>
                <div ref={ruleOutputRef} style={{background:'#1f2937',borderRadius:'10px',padding:'20px 24px',fontSize:'.98rem',lineHeight:2.4}}/>
              </div>
            </section>

            {/* ══ §5  APPLICATIONS ══ */}
            <section id="apps" className="lec-sec">
              <div style={S.subsec}>5.1d — Applications</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>Integration in Action</h3>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>📈 Finding a Function from Its Slope</h4>
                <p style={S.p}>{'A curve passes through $(1,4)$ with slope function $f\'(x)=3x^2-2x+1$. Find $f(x)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Integrate: $f(x)=\\displaystyle\\int(3x^2-2x+1)\\,dx = x^3-x^2+x+C$'}</p>
                  <p style={S.p}>{'Apply $f(1)=4$: $1-1+1+C=4 \\Rightarrow C=3$'}</p>
                  <p style={S.p}>{'$$f(x)=x^3-x^2+x+3$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>💰 Total Cost from Marginal Cost</h4>
                <p style={S.p}>{"A firm's marginal cost is $C'(x)=3x^2-12x+14$ (PKR thousands/unit) with fixed costs of PKR 35 thousand. Find $C(x)$."}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$C(x)=\\displaystyle\\int(3x^2-12x+14)\\,dx = x^3-6x^2+14x+K$'}</p>
                  <p style={S.p}>{'Fixed costs: $C(0)=35 \\Rightarrow K=35$'}</p>
                  <p style={S.p}>{'$$C(x)=x^3-6x^2+14x+35$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>🚗 Distance from Velocity</h4>
                <p style={S.p}>{'A LUMS student cycles to campus with velocity $v(t) = 6t^2 - 4t + 3$ km/h, where $t$ is hours. If the student starts at position $s=0$, find the position function $s(t)$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$s(t) = \\displaystyle\\int(6t^2-4t+3)\\,dt = 2t^3 - 2t^2 + 3t + C$'}</p>
                  <p style={S.p}>{'$s(0) = 0 \\Rightarrow C = 0$'}</p>
                  <p style={S.p}>{'$$s(t) = 2t^3-2t^2+3t \\text{ km}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ §6  DIFFERENTIAL EQUATIONS ══ */}
            <section id="diffeq" className="lec-sec">
              <div style={S.subsec}>5.1e — Introduction to Differential Equations</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>Differential Equations</h3>
              <p style={S.p}>A <strong>differential equation</strong> is an equation involving an unknown function and its derivatives — the language in which physics, biology, and economics write their deepest laws.</p>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>Definition</div>
                <p style={{...S.p,marginBottom:0}}>The <strong>order</strong> of a DE is the order of the highest derivative appearing. In Calc I we study <strong>separable first-order equations</strong> where variables can be separated onto opposite sides.</p>
              </div>

              <table style={S.table}>
                <thead><tr><th style={S.th}>Type</th><th style={S.th}>Form</th><th style={S.th}>Note</th></tr></thead>
                <tbody>
                  <tr><td style={S.td}><strong>Separable</strong></td><td style={S.td}>{'$\\dfrac{dy}{dx}=f(x)g(y)$'}</td><td style={S.td}>Our focus in Calc I</td></tr>
                  <tr><td style={S.tdEven}>Linear (1st order)</td><td style={S.tdEven}>{"$y'+P(x)y=Q(x)$"}</td><td style={S.tdEven}>Integrating factor method</td></tr>
                  <tr><td style={S.td}>Autonomous</td><td style={S.td}>{'$dy/dt=f(y)$'}</td><td style={S.td}>Right side depends only on y</td></tr>
                  <tr><td style={S.tdEven}>Higher order</td><td style={S.tdEven}>{'$y\'\'+4y=\\sin x$'}</td><td style={S.tdEven}>Studied in Diff. Equations course</td></tr>
                </tbody>
              </table>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Method — Separation of Variables</div>
                <p style={S.p}>{'Given $\\dfrac{dy}{dx}=f(x)\\cdot g(y)$:'}</p>
                <ol style={{paddingLeft:'20px',marginTop:'14px'}}>
                  {['Separate variables: $\\dfrac{dy}{g(y)}=f(x)\\,dx$','Integrate both sides independently','Solve algebraically for $y$','Apply initial condition to find the specific constant $C$'].map((s,i)=>(
                    <li key={i} style={{marginBottom:'10px'}}>{s}</li>
                  ))}
                </ol>
              </div>

              <div style={S.noteBox}>
                <div style={{...S.lbl,color:'#2980b9'}}>Why It Works</div>
                <p style={{...S.p,marginBottom:0}}>{'Treating $\\dfrac{dy}{dx}$ as a fraction and cross-multiplying is justified by the Chain Rule. When we integrate $\\int\\dfrac{dy}{g(y)}$, we integrate the left side with respect to $y$, and the right side with respect to $x$ — legitimate because $dy = \\dfrac{dy}{dx}dx$.'}</p>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>💼 Revenue IVP</h4>
                <p style={S.p}>{'The marginal revenue for a LUMS canteen is $\\dfrac{dR}{dq}=50-2q$, with $R(0)=0$. Find $R(q)$ and the revenue-maximising quantity.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$R(q)=\\displaystyle\\int(50-2q)\\,dq = 50q-q^2+C$'}</p>
                  <p style={S.p}>{'Apply $R(0)=0$: $C=0$'}</p>
                  <p style={S.p}>{'$$R(q)=50q-q^2 \\qquad \\text{(max at } q=25\\text{, giving }R=625\\text{)}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>🌿 Exponential Growth/Decay</h4>
                <p style={S.p}>{'Solve $\\dfrac{dy}{dx}=ky$, $y(0)=y_0$. This models population growth, radioactive decay, and compound interest simultaneously.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Separate: $\\dfrac{dy}{y}=k\\,dx$'}</p>
                  <p style={S.p}>{'Integrate: $\\ln|y|=kx+C_1$'}</p>
                  <p style={S.p}>{'Exponentiate: $y=Ce^{kx}$ where $C=e^{C_1}$'}</p>
                  <p style={S.p}>{'Apply $y(0)=y_0$: $C=y_0$'}</p>
                  <p style={S.p}>{'$$\\boxed{y=y_0 e^{kx}}$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>{'If $k>0$: exponential growth. If $k<0$: exponential decay.'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ §7  CONTINUOUS COMPOUNDING ══ */}
            <section id="compounding" className="lec-sec">
              <div style={S.subsec}>5.1f — Continuous Compounding</div>
              <h3 style={{...S.h3,fontSize:'1.7rem',color:'#1a1a2e',marginTop:0}}>Continuous Compounding via Differential Equations</h3>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>🏠 The Model</h4>
                <p style={{...S.p,marginBottom:0}}>{'$\\dfrac{dB}{dt}=rB$ — the balance grows at a rate proportional to itself. This is the DE of continuous compounding: the more you have, the faster it grows.'}</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Theorem — Continuous Compounding Formula</div>
                <p style={S.p}>{'If $P$ rupees are invested at annual rate $r$ compounded continuously for $t$ years:'}</p>
                <p style={{textAlign:'center',fontSize:'1.2rem',margin:'8px 0'}}>{'$$B(t)=Pe^{rt}$$'}</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>✏️ Full Derivation from the DE</h4>
                <ToggleAnswer label="Show Derivation">
                  <p style={S.p}>{'IVP: $\\dfrac{dB}{dt}=rB$, $B(0)=P$.'}</p>
                  <p style={S.p}>{'Separate: $\\dfrac{dB}{B}=r\\,dt$'}</p>
                  <p style={S.p}>{'Integrate: $\\ln|B|=rt+C_1$'}</p>
                  <p style={S.p}>{'Exponentiate: $B=Ce^{rt}$'}</p>
                  <p style={{...S.p,marginBottom:0}}>{'$B(0)=C=P$, therefore $B(t)=Pe^{rt}$ ✓'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>💵 Example</h4>
                <p style={S.p}>{'PKR 5,000 invested at $6\\%$ annual rate compounded continuously. Find the balance after 10 years.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'$$B(10)=5000e^{0.06\\times 10}=5000e^{0.6}\\approx\\text{PKR }9{,}110.60$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Compounding Explorer Widget */}
              <div style={S.widget}>
                <div style={S.wt}>📈 Continuous Compounding Explorer — {'$B(t)=Pe^{rt}$'}</div>
                <canvas ref={compCanvasRef} style={{display:'block',width:'100%',borderRadius:'8px',background:'#111827',height:'260px'}}/>
                <div style={{display:'flex',flexWrap:'wrap',gap:'18px',marginTop:'18px',alignItems:'flex-end'}}>
                  {[
                    {label:'Principal P = PKR', ref:pValRef, sliderRef:pSliderRef, min:1000, max:20000, step:500, def:5000},
                    {label:'Rate r = ', ref:rValRef, sliderRef:rSliderRef, min:1, max:20, step:0.5, def:6, suffix:'%'},
                    {label:'Years t = ', ref:tValRef, sliderRef:tSliderRef, min:1, max:40, step:1, def:10},
                  ].map(({label,ref,sliderRef,min,max,step,def,suffix},i)=>(
                    <div key={i} style={{display:'flex',flexDirection:'column',gap:'5px',minWidth:'170px',flex:1}}>
                      <label style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>
                        {label}<span ref={ref} style={{color:'#d4a017',fontSize:'.88rem',fontWeight:600}}>{def}</span>{suffix||''}
                      </label>
                      <input ref={sliderRef} type="range" min={min} max={max} step={step} defaultValue={def} onInput={updateComp}
                        style={{WebkitAppearance:'none',width:'100%',height:'5px',background:'#374151',borderRadius:'3px',outline:'none'}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginTop:'14px'}}>
                  {[['$B(t)$ = PKR ',compResRef],['Interest = PKR ',compIntRef],['Doubles in ~ ',compDblRef,' yrs']].map(([label,ref,suf],i)=>(
                    <div key={i} style={{background:'#1f2937',borderRadius:'8px',padding:'9px 16px',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.8rem'}}>
                      {label}<span ref={ref} style={{color:'#d4a017',fontWeight:700}}>—</span>{suf||''}
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.calloutGold}><strong>Rule of 70:</strong> {'At rate $r\\%$, money doubles in approximately $70/r$ years. Derived from $Pe^{rt}=2P \\Rightarrow t=\\dfrac{\\ln 2}{r} \\approx \\dfrac{0.693}{r}$.'}</div>
            </section>

            {/* ══ §8  PRACTICE ══ */}
            <section id="practice" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Test Yourself</div>
              <h2 style={S.h2}>Practice Problems</h2>

              <div style={{...S.card,...S.cardAl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 1 — Power Rule</h3>
                <p style={S.p}>{'$\\displaystyle\\int(4x^3-6x+5)\\,dx$'}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$$x^4-3x^2+5x+C$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 2 — Mixed Rules</h3>
                <p style={S.p}>{'$\\displaystyle\\int\\!\\left(3\\sqrt{x}-\\frac{5}{x}+2e^x\\right)dx$'}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$$2x^{3/2}-5\\ln|x|+2e^x+C$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 3 — Initial Value Problem</h3>
                <p style={S.p}>{"$f'(x)=6x-4$, $f(2)=3$. Find $f(x)$."}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$f(x)=3x^2-4x+C$. Apply $f(2)=3$: $12-8+C=3 \\Rightarrow C=-1$.'}</p>
                  <p style={S.p}>{'$$f(x)=3x^2-4x-1$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 4 — Marginal Revenue</h3>
                <p style={S.p}>{"$R'(q)=120-4q$, $R(0)=0$. Find $R(q)$ and the revenue-maximising quantity."}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$R(q)=120q-2q^2$. Max where $R\'(q)=0$: $q=30$, $R(30)=\\text{PKR }1{,}800$.'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 5 — Continuous Compounding</h3>
                <p style={S.p}>{'How many years for PKR 2,000 to triple at $8\\%$ continuous compounding?'}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$$2000e^{0.08t}=6000 \\Rightarrow e^{0.08t}=3 \\Rightarrow t=\\frac{\\ln 3}{0.08}\\approx 13.73\\text{ years}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h3 style={{...S.h3,marginTop:0}}>Problem 6 — Challenge DE</h3>
                <p style={S.p}>{'$\\dfrac{dP}{dt}=0.05P$, $P(0)=1000$. Find $P(t)$ and $P(20)$.'}</p>
                <ToggleAnswer label="Reveal Solution">
                  <p style={S.p}>{'$P(t)=1000e^{0.05t}$.'}</p>
                  <p style={S.p}>{'$$P(20)=1000e^{1}=1000e\\approx 2{,}718$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={S.divider}/>
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Coming up next —</strong> §5.2 Integration by Substitution — the chain rule in reverse, unlocking a whole new class of integrals.</div>
            </section>

          </div>{/* end lec-inner */}

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1" style={S.lnfBtn}>← Course Overview</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§5.1 · Chapter 5 · Calculus I</div>
            <Link href="/courses/calc1/s52" style={S.lnfBtnNext}>§5.2 Substitution →</Link>
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}