'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  stickySubnav: { position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)' },
  bcRow: { padding:'8px 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', borderBottom:'1px solid var(--border)' },
  bcLink: { color:'var(--amber)', textDecoration:'none' },
  bcCur: { color:'var(--text2)', fontWeight:500 },
  courseSwitcher: { display:'flex', alignItems:'center', padding:'0 24px', overflowX:'auto' },
  cswLink: { fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--text3)', padding:'9px 18px', borderBottom:'2px solid transparent', whiteSpace:'nowrap', transition:'all .2s', textDecoration:'none' },
  cswActive: { color:'var(--amber)', borderBottom:'2px solid var(--amber)' },
  courseFrame: { display:'flex', paddingTop:'calc(var(--nav-h) + 3px)', minHeight:'100vh' },
  csb: { width:'252px', flexShrink:0, position:'sticky', top:'calc(var(--nav-h) + 3px + 37px + 40px)', height:'calc(100vh - var(--nav-h) - 80px)', overflowY:'auto', background:'var(--bg2)', borderRight:'1px solid var(--border)' },
  csbHead: { padding:'18px 16px 12px', borderBottom:'1px solid var(--border)' },
  csbTag: { fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'4px' },
  csbTitle: { fontFamily:'var(--fh)', fontSize:'.95rem', color:'var(--text)', lineHeight:1.3 },
  csbBack: { display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'var(--fm)', fontSize:'.68rem', color:'var(--text3)', marginTop:'8px', textDecoration:'none' },
  cmain: { flex:1, minWidth:0, background:'#fdf8f0', overflow:'hidden', fontFamily:"'Source Sans 3', sans-serif", fontSize:'1.05rem', lineHeight:1.8, color:'#1a1a2e' },
  lecInner: { maxWidth:'100%', margin:'0 auto', padding:'0 52px 60px' },
  lecHero: { background:'#1a1a2e', color:'#fdf8f0', padding:'52px 40px 44px', textAlign:'center', position:'relative', overflow:'hidden' },
  lecHeroTag: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.72rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px', position:'relative' },
  lecHeroH1: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:700, lineHeight:1.15, marginBottom:'10px', position:'relative' },
  lecHeroSub: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.85rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#38c9b0', marginBottom:'18px', position:'relative' },
  lecHeroP: { fontSize:'1rem', color:'#c9c2b8', maxWidth:'580px', margin:'0 auto 24px', position:'relative' },
  lecHeroLine: { width:'56px', height:'3px', background:'#d4a017', margin:'0 auto' },
  lecNav: { background:'rgba(253,248,240,.97)', backdropFilter:'blur(8px)', borderBottom:'1px solid #e0d6c8', padding:'8px 20px', display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'center' },
  lecNavA: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#7f8c8d', textDecoration:'none', padding:'4px 11px', borderRadius:'20px', border:'1px solid #e0d6c8' },
  card: { background:'#fff', border:'1px solid #e0d6c8', borderRadius:'12px', padding:'30px 34px', boxShadow:'0 4px 24px rgba(26,26,46,.10)', marginBottom:'26px' },
  cardAl: { borderLeft:'4px solid #c0392b' },
  cardGl: { borderLeft:'4px solid #d4a017' },
  cardTl: { borderLeft:'4px solid #1a6b6b' },
  cardSl: { borderLeft:'4px solid #2980b9' },
  cardPl: { borderLeft:'4px solid #27ae60' },
  defBox: { background:'#eef7f7', border:'1.5px solid #1a6b6b', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  thmBox: { background:'#fff8ec', border:'1.5px solid #d4a017', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  noteBox: { background:'#f0f4ff', border:'1.5px solid #2980b9', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  warnBox: { background:'#fff5f5', border:'1.5px solid #c0392b', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  pakBox: { background:'#f0faf4', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  callout:      { background:'#fdf0ef', borderLeft:'4px solid #c0392b', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutTeal:  { background:'#eef7f7', borderLeft:'4px solid #1a6b6b', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutGold:  { background:'#fff8ec', borderLeft:'4px solid #d4a017', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutGreen: { background:'#f0faf4', borderLeft:'4px solid #27ae60', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutBlue:  { background:'#f0f4ff', borderLeft:'4px solid #2980b9', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  toggleBtn:      { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.76rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a1a2e', color:'#d4a017', border:'none', borderRadius:'6px', padding:'9px 20px', cursor:'pointer', marginTop:'10px' },
  toggleBtnGreen: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a6b6b', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer', marginTop:'8px', marginRight:'8px' },
  toggleBtnBlue:  { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#2980b9', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer', marginTop:'8px' },
  answerBox: { background:'#f0f9f0', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'18px 22px', marginTop:'12px' },
  secLabel: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.68rem', letterSpacing:'.26em', textTransform:'uppercase', color:'#c0392b', marginBottom:'8px' },
  divider:    { width:'100%', height:'1px', background:'#e0d6c8', margin:'52px 0' },
  subDivider: { width:'100%', height:'1px', background:'#e0d6c8', margin:'36px 0' },
  widget: { background:'#1a1a2e', borderRadius:'16px', padding:'26px 26px 18px', margin:'30px 0', color:'#e8e2d9' },
  wt: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.75rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'16px' },
  lecFooterNav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'28px 40px', borderTop:'1px solid #e0d6c8', flexWrap:'wrap', gap:'12px', background:'#fdf8f0' },
  lnfBtnPrev: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono', monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#2980b9', border:'1px solid #2980b9', background:'#f0f4ff', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
  lnfBtnNext: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono', monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#1a6b6b', border:'1px solid #1a6b6b', background:'#eef7f7', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
  table: { width:'100%', borderCollapse:'collapse', margin:'14px 0', fontSize:'.94rem' },
  th:     { background:'#1a1a2e', color:'#d4a017', fontFamily:"'IBM Plex Mono', monospace", fontSize:'.72rem', letterSpacing:'.1em', padding:'9px 13px', textAlign:'left' },
  td:     { padding:'8px 13px', borderBottom:'1px solid #e0d6c8' },
  tdEven: { padding:'8px 13px', borderBottom:'1px solid #e0d6c8', background:'#f5ede0' },
  h2:     { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'clamp(1.7rem,4vw,2.55rem)', fontWeight:700, marginBottom:'20px', lineHeight:1.2, color:'#1a1a2e' },
  h3teal: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.32rem', fontWeight:700, margin:'30px 0 12px', color:'#1a6b6b' },
  h4red:  { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#c0392b' },
  h4gold: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#d4a017' },
  h4teal: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#1a6b6b' },
  h4blue: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#2980b9' },
  h4green:{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#27ae60' },
  p: { marginBottom:'16px', color:'#1a1a2e' },
};

// ─── TOC ──────────────────────────────────────────────────────────────────
const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: [
    { label: '1.1 · Functions', soon: true },
    { label: '1.2 · The Graph of a Function', soon: true },
    { label: '1.3 · Lines and Linear Functions', soon: true },
    { label: '1.4 · Functional Models', soon: true },
    { label: '1.5 · Limits', soon: true },
    { label: '1.6 · One-Sided Limits and Continuity', soon: true },
  ]},
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: [
    { label: '2.1 · The Derivative', soon: true },
    { label: '2.2 · Techniques of Differentiation', soon: true },
    { label: '2.3 · Product and Quotient Rules', soon: true },
    { label: '2.4 · The Chain Rule', soon: true },
    { label: '2.5 · Marginal Analysis', soon: true },
    { label: '2.6 · Implicit Differentiation', soon: true },
  ]},
  { ch: 'Ch 3 — Applications of the Derivative', items: [
    { label: '3.1 · Increasing & Decreasing Functions', soon: true },
    { label: '3.2 · Concavity & Inflection Points', soon: true },
    { label: '3.3 · Curve Sketching', soon: true },
    { label: '3.4 · Optimization; Elasticity', soon: true },
    { label: '3.5 · Additional Optimization', soon: true },
  ]},
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: [
    { label: '4.1 · Exponential Functions', soon: true },
    { label: '4.2 · Logarithmic Functions', soon: true },
    { label: '4.3 · Differentiation of Exp & Log', soon: true },
    { label: '4.4 · Exponential Models', soon: true },
  ]},
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration',        href: '/courses/calc1/s51', live: true },
    { label: '5.2 · Integration by Substitution',   href: '/courses/calc1/s52', live: true },
    { label: '5.3 · Definite Integral & FTC',       href: '/courses/calc1/s53', live: true },
    { label: '5.4 · Applying Definite Integration', href: '/courses/calc1/s54', live: true },
    { label: '5.5 · Applications to Business',      href: '/courses/calc1/s55', live: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: [
    { label: '6.1 · Integration by Parts',       href: '/courses/calc1/s61', active: true, live: true },
    { label: '6.2 · Numerical Integration',      soon: true },
    { label: '6.3 · Improper Integrals',         soon: true },
    { label: '6.4 · Continuous Probability',     soon: true },
  ]},
];
// ─── ToggleAnswer ──────────────────────────────────────────────────────────
function ToggleAnswer({ label='Show Solution', children, btnStyle }) {
  const ref = useRef(null);
  const toggle = () => {
    const el = ref.current; if (!el) return;
    const vis = el.style.display === 'block';
    el.style.display = vis ? 'none' : 'block';
    if (!vis && window.MathJax?.typesetPromise) window.MathJax.typesetPromise([el]);
  };
  return (
    <>
      <button style={btnStyle || S.toggleBtn} onClick={toggle}>{label}</button>
      <div ref={ref} style={{ ...S.answerBox, display:'none' }}>{children}</div>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ open, setOpen }) {
  return (
    <aside style={S.csb} className="csb-hide">
      <div style={S.csbHead}>
        <div style={S.csbTag}>MATH-101 · Calculus I</div>
        <div style={S.csbTitle}>Course Contents</div>
        <Link href="/courses/calc1" style={S.csbBack}>← All Courses</Link>
      </div>
      <nav style={{ padding:'8px 0 24px' }}>
        {TOC.map((sec, i) => {
          if (sec.ch === 'Course Overview') return (
            <Link key="co" href="/courses/calc1" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', textDecoration:'none' }}>
              <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--border2)', display:'inline-block' }}/> Course Overview
            </Link>
          );
          const isOpen = !!open[i];
          const hasLive = sec.items?.some(it => it.live || it.href);
          return (
            <div key={sec.ch} style={{ borderBottom:'1px solid var(--border)' }}>
              <button onClick={()=>setOpen(p=>({...p,[i]:!p[i]}))} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:hasLive?'var(--teal)':'var(--text3)', textAlign:'left' }}>
                <span>{sec.ch}</span>
                <span style={{ fontSize:'.6rem', display:'inline-block', transform:isOpen?'rotate(180deg)':'rotate(0)' }}>▾</span>
              </button>
              {isOpen && (
                <div style={{ paddingBottom:'6px' }}>
                  {sec.items?.map(item =>
                    item.soon ? (
                      <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--text3)', opacity:.38, lineHeight:1.35 }}>
                        <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--border2)', display:'inline-block' }}/>{item.label}
                      </div>
                    ) : item.active ? (
                      <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--amber)', borderLeft:'2px solid var(--amber)', background:'rgba(232,160,32,.08)', lineHeight:1.35 }}>
                        <span style={{ fontSize:'.55rem' }}>✦</span>{item.label}
                      </div>
                    ) : (
                      <Link key={item.label} href={item.href||'#'} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--teal)', textDecoration:'none', lineHeight:1.35 }}>
                        <span style={{ fontSize:'.55rem' }}>✦</span>{item.label}
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
  );
}

// ─── IBP Explorer Widget ──────────────────────────────────────────────────
function IBPExplorer() {
  const [sel, setSel] = useState(0);

  const EXAMPLES = [
    {
      label: '∫ x·eˣ dx',
      f: 'x \\cdot e^x',
      u: 'x',
      dv: 'e^x\\,dx',
      du: 'dx',
      v:  'e^x',
      result: 'x e^x - e^x + C = e^x(x-1)+C',
      colour: '#ef4444',
      note: 'u = x because its derivative (1) is simpler. dv = eˣdx because eˣ integrates easily.',
    },
    {
      label: '∫ x·ln x dx',
      f: 'x \\ln x',
      u: '\\ln x',
      dv: 'x\\,dx',
      du: '\\dfrac{1}{x}dx',
      v:  '\\dfrac{x^2}{2}',
      result: '\\dfrac{x^2}{2}\\ln x - \\dfrac{x^2}{4} + C',
      colour: '#f97316',
      note: 'u = ln x because we know how to differentiate it. dv = x dx.',
    },
    {
      label: '∫ x²·eˣ dx',
      f: 'x^2 e^x',
      u: 'x^2',
      dv: 'e^x\\,dx',
      du: '2x\\,dx',
      v:  'e^x',
      result: 'x^2 e^x - 2xe^x + 2e^x + C = e^x(x^2-2x+2)+C',
      colour: '#a78bfa',
      note: 'Needs IBP twice — each time reducing the power of x by 1.',
    },
    {
      label: '∫ ln x dx',
      f: '\\ln x',
      u: '\\ln x',
      dv: 'dx',
      du: '\\dfrac{1}{x}dx',
      v:  'x',
      result: 'x\\ln x - x + C',
      colour: '#22c55e',
      note: 'Trick: write ∫ln x dx = ∫ln x · 1 dx. Let u = ln x, dv = dx.',
    },
    {
      label: '∫ x·sin x dx',
      f: 'x \\sin x',
      u: 'x',
      dv: '\\sin x\\,dx',
      du: 'dx',
      v:  '-\\cos x',
      result: '-x\\cos x + \\sin x + C',
      colour: '#3b82f6',
      note: 'u = x (simpler derivative), dv = sin x dx (easy to integrate).',
    },
    {
      label: '∫ x·cos x dx',
      f: 'x \\cos x',
      u: 'x',
      dv: '\\cos x\\,dx',
      du: 'dx',
      v:  '\\sin x',
      result: 'x\\sin x + \\cos x + C',
      colour: '#14b8a6',
      note: 'Same approach as x·sin x but with cos x.',
    },
    {
      label: '∫ eˣ·sin x dx',
      f: 'e^x \\sin x',
      u: 'e^x',
      dv: '\\sin x\\,dx',
      du: 'e^x\\,dx',
      v:  '-\\cos x',
      result: '\\dfrac{e^x(\\sin x - \\cos x)}{2} + C',
      colour: '#ec4899',
      note: 'Apply IBP twice — the original integral reappears, then solve algebraically!',
    },
    {
      label: '∫ √x·ln x dx',
      f: '\\sqrt{x}\\ln x',
      u: '\\ln x',
      dv: '\\sqrt{x}\\,dx',
      du: '\\dfrac{1}{x}dx',
      v:  '\\dfrac{2}{3}x^{3/2}',
      result: '\\dfrac{2}{3}x^{3/2}\\ln x - \\dfrac{4}{9}x^{3/2} + C',
      colour: '#d4a017',
      note: 'u = ln x (hard to integrate), dv = √x dx (easy to integrate).',
    },
  ];

  const ex = EXAMPLES[sel];

  const MathDisplay = ({ tex, inline=false }) => (
    <span dangerouslySetInnerHTML={{ __html: inline ? `\\(${tex}\\)` : `\\[${tex}\\]` }}/>
  );

  return (
    <div style={S.widget}>
      <div style={S.wt}>🔢 Integration by Parts — Formula Explorer</div>

      {/* Selector */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'18px' }}>
        {EXAMPLES.map((e,i) => (
          <button key={i} onClick={()=>setSel(i)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.06em', background:sel===i?e.colour:'#1f2937', color:sel===i?'#fff':'#9ca3af', border:`1.5px solid ${sel===i?e.colour:'#374151'}`, borderRadius:'5px', padding:'4px 10px', cursor:'pointer' }}>
            {e.label}
          </button>
        ))}
      </div>

      {/* The formula breakdown */}
      <div style={{ background:'#0f172a', borderRadius:'12px', padding:'22px 24px' }}>

        {/* Original integral */}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#64748b', marginBottom:'8px' }}>The integral</div>
        <div style={{ fontSize:'1.3rem', textAlign:'center', padding:'10px', background:'#1e293b', borderRadius:'8px', marginBottom:'16px', color:'#e2e8f0' }}>
          <MathDisplay tex={`\\int ${ex.f}\\,dx`}/>
        </div>

        {/* u and dv assignment */}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#64748b', marginBottom:'8px' }}>Step 1 — Assign u and dv</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
          <div style={{ background:'#1e293b', borderRadius:'8px', padding:'14px', textAlign:'center', border:`2px solid ${ex.colour}` }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:ex.colour, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'6px' }}>u =</div>
            <div style={{ color:'#e2e8f0', fontSize:'1.1rem' }}><MathDisplay tex={ex.u} inline/></div>
          </div>
          <div style={{ background:'#1e293b', borderRadius:'8px', padding:'14px', textAlign:'center', border:'2px solid #38c9b0' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#38c9b0', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'6px' }}>dv =</div>
            <div style={{ color:'#e2e8f0', fontSize:'1.1rem' }}><MathDisplay tex={ex.dv} inline/></div>
          </div>
        </div>

        {/* du and v */}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#64748b', marginBottom:'8px' }}>Step 2 — Compute du and v</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
          <div style={{ background:'#1e293b', borderRadius:'8px', padding:'14px', textAlign:'center', border:`2px solid ${ex.colour}44` }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:ex.colour+'aa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'6px' }}>du =</div>
            <div style={{ color:'#94a3b8', fontSize:'1.1rem' }}><MathDisplay tex={ex.du} inline/></div>
          </div>
          <div style={{ background:'#1e293b', borderRadius:'8px', padding:'14px', textAlign:'center', border:'2px solid #38c9b044' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#38c9b0aa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'6px' }}>v = ∫dv =</div>
            <div style={{ color:'#94a3b8', fontSize:'1.1rem' }}><MathDisplay tex={ex.v} inline/></div>
          </div>
        </div>

        {/* The IBP formula */}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#64748b', marginBottom:'8px' }}>Step 3 — Apply ∫u·dv = uv − ∫v·du</div>
        <div style={{ background:'#1e293b', borderRadius:'8px', padding:'16px', marginBottom:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', flexWrap:'wrap', color:'#e2e8f0' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:ex.colour, marginBottom:'2px' }}>u</div>
              <MathDisplay tex={ex.u} inline/>
            </div>
            <span style={{ color:'#64748b', fontSize:'1.2rem' }}>·</span>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#38c9b0', marginBottom:'2px' }}>v</div>
              <MathDisplay tex={ex.v} inline/>
            </div>
            <span style={{ color:'#64748b', fontSize:'1.4rem', fontWeight:700 }}>−</span>
            <span style={{ color:'#64748b', fontSize:'2rem' }}>∫</span>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#38c9b0', marginBottom:'2px' }}>v</div>
              <MathDisplay tex={ex.v} inline/>
            </div>
            <span style={{ color:'#64748b', fontSize:'1.1rem' }}>·</span>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:ex.colour, marginBottom:'2px' }}>du</div>
              <MathDisplay tex={ex.du} inline/>
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#64748b', marginBottom:'8px' }}>Result</div>
        <div style={{ background:`${ex.colour}18`, border:`1.5px solid ${ex.colour}`, borderRadius:'8px', padding:'14px', textAlign:'center', color:'#e2e8f0', fontSize:'1.1rem', marginBottom:'12px' }}>
          <MathDisplay tex={`\\int ${ex.f}\\,dx = ${ex.result}`}/>
        </div>

        {/* Note */}
        <div style={{ background:'#1e293b', borderRadius:'6px', padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#94a3b8', lineHeight:1.6 }}>
          💡 {ex.note}
        </div>
      </div>
    </div>
  );
}

// ─── PDF Download for Integral Table ─────────────────────────────────────
function downloadIntegralTablePDF() {
  if (!window.jspdf) { alert('PDF library not loaded yet, please try again in a moment.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W = 210, pad = 16;

  // Header
  doc.setFillColor(26,26,46); doc.rect(0,0,W,48,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(212,160,23);
  doc.text('MATH-101 · CALCULUS I · LUMS', W/2, 14, {align:'center'});
  doc.setFontSize(18); doc.setTextColor(253,248,240);
  doc.text('Table of Integrals — Chapter 6', W/2, 26, {align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(200,190,180);
  doc.text('Section 6.1 · Integration by Parts & Integral Tables', W/2, 36, {align:'center'});
  doc.text('Muhammad Shoaib Khan · Teaching Fellow · mathwithshoaib.vercel.app', W/2, 43, {align:'center'});

  let y = 56;
  const col1 = pad, col2 = 22, lineH = 7;

  const section = (title) => {
    doc.setFillColor(245,237,224); doc.rect(pad, y-4, W-pad*2, 8, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(26,26,46);
    doc.text(title, W/2, y+1, {align:'center'});
    y += 10;
  };

  const row = (num, formula) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(192,57,43);
    doc.text(String(num)+'.', col1+2, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(26,26,46);
    doc.text(formula, col2, y);
    doc.setDrawColor(224,214,200); doc.setLineWidth(0.2); doc.line(pad,y+2,W-pad,y+2);
    y += lineH;
  };

  section('Forms Involving a + bu');
  row(1, '∫ u/(a+bu) du = (1/b²)[a+bu − a·ln|a+bu|] + C');
  row(2, '∫ u²/(a+bu) du = (1/(2b³))[(a+bu)² − 4a(a+bu) + 2a²·ln|a+bu|] + C');
  row(3, '∫ u/(a+bu)² du = (1/b²)[a/(a+bu) + ln|a+bu|] + C');
  row(4, '∫ u/√(a+bu) du = (2/(3b²))(bu−2a)√(a+bu) + C');
  row(5, '∫ du/(u√(a+bu)) = (1/√a)·ln|(√(a+bu)−√a)/(√(a+bu)+√a)| + C,  a > 0');
  row(6, '∫ du/(u(a+bu)) = (1/a)·ln|u/(a+bu)| + C');
  row(7, '∫ du/(u²(a+bu)) = −(1/(au)) + (b/a²)·ln|(a+bu)/u| + C');
  row(8, '∫ du/(u²(a+bu)²) = −(1/a²)[1/u + b/(a+bu)] + (2b/a³)·ln|u/(a+bu)| + C');

  y += 2;
  section('Forms Involving a² + u²');
  row(9,  '∫√(a²+u²) du = (u/2)√(a²+u²) + (a²/2)·ln|u+√(a²+u²)| + C');
  row(10, '∫ du/√(a²+u²) = ln|u+√(a²+u²)| + C');
  row(11, '∫ du/(u√(a²+u²)) = −(1/a)·ln|(√(a²+u²)+a)/u| + C');
  row(12, '∫ du/(a²+u²)^(3/2) = u/(a²√(a²+u²)) + C');
  row(13, '∫ u²√(a²+u²) du = (u/8)(2u²+a²)√(a²+u²) − (a⁴/8)·ln|u+√(a²+u²)| + C');

  y += 2;
  section('Forms Involving a² − u²  and  u² − a²');
  row(14, '∫ du/(u√(a²−u²)) = −(1/a)·ln|(a+√(a²−u²))/u| + C');
  row(15, '∫ du/(u²√(a²−u²)) = −√(a²−u²)/(a²u) + C');
  row(16, '∫ du/(a²−u²) = (1/(2a))·ln|(a+u)/(a−u)| + C');
  row(17, '∫ √(a²−u²)/u du = √(a²−u²) − a·ln|(a+√(a²−u²))/u| + C');
  row(18, '∫√(u²−a²) du = (u/2)√(u²−a²) − (a²/2)·ln|u+√(u²−a²)| + C');
  row(19, '∫√(u²−a²)/u² du = −√(u²−a²)/u + ln|u+√(u²−a²)| + C');
  row(20, '∫ du/√(u²−a²) = ln|u+√(u²−a²)| + C');
  row(21, '∫ du/(u²√(u²−a²)) = √(u²−a²)/(a²u) + C');

  y += 2;
  section('Forms Involving eᵃᵘ and ln u');
  row(22, '∫ ueᵃᵘ du = (1/a²)(au−1)eᵃᵘ + C');
  row(23, '∫ ln u du = u·ln u − u + C');
  row(24, '∫ du/(u·ln u) = ln|ln u| + C');
  row(25, '∫ uⁿ·ln u du = u^(n+1)/(n+1) · [ln u − 1/(n+1)] + C,  n ≠ −1');

  y += 2;
  section('Reduction Formulas');
  row(26, '∫ uⁿeᵃᵘ du = (1/a)uⁿeᵃᵘ − (n/a)∫uⁿ⁻¹eᵃᵘ du');
  row(27, '∫ (ln u)ⁿ du = u(ln u)ⁿ − n∫(ln u)ⁿ⁻¹ du');
  row(28, '∫ uⁿ√(a+bu) du = [2/(b(2n+3))] · [uⁿ(a+bu)^(3/2) − na·∫uⁿ⁻¹√(a+bu) du],  n ≠ −3/2');

  // Footer
  const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  doc.setFillColor(26,26,46); doc.rect(0,280,W,17,'F');
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(200,190,180);
  doc.text('mathwithshoaib.vercel.app  ·  bssk.khan@gmail.com  ·  LUMS, Lahore, Pakistan', W/2, 287, {align:'center'});
  doc.setTextColor(212,160,23);
  doc.text(`Generated ${today}  ·  Muhammad Shoaib Khan`, W/2, 293, {align:'center'});

  doc.save('Integral_Table_Shoaib_LUMS.pdf');
}

export default function Calc1S61() {
  const [sidebarOpen, setSidebarOpen] = useState({ 6:true });

  useEffect(() => {
    const ti = setInterval(() => {
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); clearInterval(ti); }
    }, 100);
    return () => clearInterval(ti);
  }, []);

  return (
    <>
      <Navbar activePage="courses" />
      <Script id="mjax-cfg" strategy="beforeInteractive">{`
        window.MathJax={tex:{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']]},options:{skipHtmlTags:['script','noscript','style','textarea','pre']}};
      `}</Script>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive"/>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive"/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec{padding:52px 0 0;}
        .lec-sec:first-child{padding-top:44px;}
        .lec-inner-m p,.lec-inner-m li{color:#1a1a2e!important;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#d4a017;border-radius:50%;cursor:pointer;}
        @media(max-width:860px){.csb-hide{display:none!important;}.lec-inner-m{padding:0 18px 40px!important;}.lec-hero-m{padding:36px 20px 32px!important;}.lec-fnav-m{padding:20px 18px!important;}}
      `}</style>

      {/* SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§6.1 Integration by Parts</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1" style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg" style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      <div style={S.courseFrame}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>

        <main style={S.cmain}>
          {/* HERO */}
          <div style={S.lecHero} className="lec-hero-m">
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)',pointerEvents:'none'}}/>
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 6 &nbsp;·&nbsp; Section 6.1</div>
            <h1 style={S.lecHeroH1}>Integration by Parts<br/>&amp; Integral Tables</h1>
            <div style={S.lecHeroSub}>A powerful technique for products of functions</div>
            <p style={S.lecHeroP}>When substitution fails, integration by parts steps in — transforming a hard integral into a manageable one using the product rule in reverse.</p>
            <div style={S.lecHeroLine}/>
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#motivation','Why Learn This'],['#derivation','Derivation'],['#procedure','Procedure'],['#explorer','IBP Explorer'],['#examples','Examples'],['#definite','Definite IBP'],['#twice','IBP Twice'],['#business','Business Applications'],['#tables','Integral Tables'],['#logistic','Logistic Equations']].map(([href,lbl])=>(
              <a key={href} href={href} style={S.lecNavA}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ── MOTIVATION ── */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>Why This Section Matters</div>
              <h2 style={S.h2}>Not Every Integral Yields<br/>to Substitution</h2>
              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.06rem'}}>You have already mastered substitution — the technique that "un-does" the chain rule. But what about integrals like {'$\\int x e^x\\,dx$'} or {'$\\int x \\ln x\\,dx$'}? These are <em>products</em> of two different types of functions, and no substitution will untangle them.</p>
                <p style={{...S.p,fontSize:'1.06rem',marginBottom:0}}>Integration by parts is the answer. It is used everywhere in applications: computing present values of income streams, solving differential equations that model population growth, and evaluating probabilities in statistics. Master this technique and a whole new class of real-world problems opens up.</p>
              </div>
              <div style={S.calloutGold}>
                <strong>Real uses you will see in this course:</strong> Computing the present value {'$\\int_0^T f(t)e^{-rt}\\,dt$'} when {'$f(t)$'} is not constant — this requires integration by parts. Also: solving logistic differential equations, finding areas under curves like {'$y = x^2 e^{-x}$'}, and evaluating integrals that appear in business growth models.
              </div>
            </section>

            {/* ── DERIVATION ── */}
            <section id="derivation" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Where the Formula Comes From</div>
              <h2 style={S.h2}>Integration by Parts:<br/>The Product Rule in Reverse</h2>
              <p style={S.p}>You know the product rule for differentiation. Integration by parts is what you get when you integrate both sides of it.</p>
              <ToggleAnswer label="Show Full Derivation" btnStyle={S.toggleBtnBlue}>
                <p style={S.p}><strong>Start with the product rule.</strong> If {'$u$'} and {'$v$'} are both functions of {'$x$'}:</p>
                <p style={{textAlign:'center'}}>{'$$\\frac{d}{dx}[uv] = u\\frac{dv}{dx} + v\\frac{du}{dx}$$'}</p>
                <p style={S.p}><strong>Integrate both sides</strong> with respect to {'$x$'}:</p>
                <p style={{textAlign:'center'}}>{'$$\\int \\frac{d}{dx}[uv]\\,dx = \\int u\\frac{dv}{dx}\\,dx + \\int v\\frac{du}{dx}\\,dx$$'}</p>
                <p style={S.p}>The left side simplifies (integration undoes differentiation):</p>
                <p style={{textAlign:'center'}}>{'$$uv = \\int u\\,dv + \\int v\\,du$$'}</p>
                <p style={S.p}>Rearrange to solve for {'$\\int u\\,dv$'}:</p>
                <p style={{textAlign:'center',fontSize:'1.15rem'}}>{'$$\\boxed{\\int u\\,dv = uv - \\int v\\,du}$$'}</p>
                <p style={{...S.p,marginBottom:0}}>This is the <strong>integration by parts formula</strong>. The idea: if {'$\\int u\\,dv$'} is hard, transform it into {'$uv - \\int v\\,du$'} and hope that {'$\\int v\\,du$'} is easier. ∎</p>
              </ToggleAnswer>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Integration by Parts Formula</div>
                <p style={S.p}>{'If $u$ and $v$ are differentiable functions of $x$, then:'}</p>
                <p style={{textAlign:'center',fontSize:'1.22rem'}}>{'$$\\int u\\,dv = uv - \\int v\\,du$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{'Equivalently: $\\int f(x)g\'(x)\\,dx = f(x)g(x) - \\int g(x)f\'(x)\\,dx$'}</p>
              </div>
            </section>

            {/* ── PROCEDURE ── */}
            <section id="procedure" className="lec-sec">
              <div style={S.secLabel}>§ 2 — The Step-by-Step Procedure</div>
              <h2 style={S.h2}>How to Use<br/>Integration by Parts</h2>

              <div style={{display:'flex',flexDirection:'column',gap:'14px',margin:'20px 0'}}>
                {[
                  {n:'Step 1',col:'#d4a017',title:'Choose u and dv',body:'Split the integrand into two parts: one you call u, one you call dv. The choice matters — u should become simpler when differentiated, and dv should be easy to integrate.'},
                  {n:'Step 2',col:'#38c9b0',title:'Compute du and v',body:'Differentiate u to get du. Integrate dv to get v (no +C needed yet). Organise these in a small table: u on top-left, dv top-right, du bottom-left, v bottom-right.'},
                  {n:'Step 3',col:'#ef4444',title:'Apply the formula',body:'Substitute into ∫u dv = uv − ∫v du. The new integral ∫v du should be simpler than the original.'},
                  {n:'Step 4',col:'#a78bfa',title:'Evaluate and add +C',body:'Evaluate ∫v du. Add +C only at the very end of the entire calculation, not after each step.'},
                ].map((s,i)=>(
                  <div key={i} style={{display:'flex',gap:'14px',alignItems:'flex-start',background:'#fff',border:'1px solid #e0d6c8',borderLeft:`4px solid ${s.col}`,borderRadius:'10px',padding:'16px 20px'}}>
                    <div style={{width:'70px',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.72rem',fontWeight:700,color:s.col,flexShrink:0,paddingTop:'2px'}}>{s.n}</div>
                    <div>
                      <strong style={{display:'block',marginBottom:'4px',color:'#1a1a2e'}}>{s.title}</strong>
                      <p style={{...S.p,margin:0,fontSize:'.97rem'}}>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={S.calloutGold}>
                <strong>LIATE Rule (choosing u):</strong> When in doubt, choose u from the category that appears earliest in this list:<br/>
                <strong>L</strong>ogarithmic → <strong>I</strong>nverse trig → <strong>A</strong>lgebraic (polynomials) → <strong>T</strong>rigonometric → <strong>E</strong>xponential<br/>
                Choose u from the first category present. The remaining factor becomes dv.
              </div>
            </section>

            {/* ── IBP EXPLORER ── */}
            <section id="explorer" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Interactive Explorer</div>
              <h2 style={S.h2}>See the Formula in Action</h2>
              <p style={S.p}>Select any example below to see exactly how u, dv, du, and v are assigned, and how the formula is applied step by step.</p>
              <IBPExplorer />
            </section>

            {/* ── EXAMPLES ── */}
            <section id="examples" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Worked Examples</div>
              <h2 style={S.h2}>Integration by Parts<br/>— Fully Worked</h2>

              {/* Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — {'$\\int xe^{2x}\\,dx$'}</h4>
                <p style={S.p}>A straightforward product of a polynomial and an exponential.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Choose:</strong> {'$u = x$'} (algebraic), {'$dv = e^{2x}\\,dx$'} (exponential)</p>
                  <p style={S.p}><strong>Compute:</strong> {'$du = dx$'}, {'$v = \\dfrac{e^{2x}}{2}$'}</p>
                  <p style={S.p}><strong>Apply formula:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\int xe^{2x}\\,dx = x\\cdot\\frac{e^{2x}}{2} - \\int\\frac{e^{2x}}{2}\\,dx = \\frac{xe^{2x}}{2} - \\frac{e^{2x}}{4} + C$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>{'$$= \\boxed{\\frac{e^{2x}(2x-1)}{4} + C}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — {'$\\int x^2\\ln x\\,dx$'}</h4>
                <p style={S.p}>A polynomial multiplied by a logarithm — logarithm always goes to u by LIATE.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Choose:</strong> {'$u = \\ln x$'} (logarithmic), {'$dv = x^2\\,dx$'}</p>
                  <p style={S.p}><strong>Compute:</strong> {'$du = \\dfrac{1}{x}dx$'}, {'$v = \\dfrac{x^3}{3}$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^2\\ln x\\,dx = \\frac{x^3}{3}\\ln x - \\int\\frac{x^3}{3}\\cdot\\frac{1}{x}\\,dx = \\frac{x^3}{3}\\ln x - \\frac{1}{3}\\int x^2\\,dx$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\boxed{\\frac{x^3}{3}\\ln x - \\frac{x^3}{9} + C}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 3 — harder */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — {'$\\int x^3 e^{x^2}\\,dx$'} (Substitution First!)</h4>
                <p style={S.p}>A case where you first do a substitution, <em>then</em> integration by parts.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Step 1 — Substitution:</strong> Let {'$t = x^2$'}, {'$dt = 2x\\,dx$'}, so {'$x\\,dx = \\frac{dt}{2}$'} and {'$x^3\\,dx = x^2\\cdot x\\,dx = t\\cdot\\frac{dt}{2}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^3 e^{x^2}\\,dx = \\frac{1}{2}\\int t e^t\\,dt$$'}</p>
                  <p style={S.p}><strong>Step 2 — IBP on {'$\\int te^t\\,dt$'}:</strong> {'$u=t$'}, {'$dv=e^t\\,dt$'}, {'$du=dt$'}, {'$v=e^t$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{1}{2}\\int te^t\\,dt = \\frac{1}{2}(te^t - e^t) + C = \\frac{1}{2}e^{x^2}(x^2-1)+C$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\boxed{\\frac{e^{x^2}(x^2-1)}{2} + C}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 4 — x³ ln²x */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 4 — {'$\\int x^3 \\ln^2 x\\,dx$'} (IBP Twice — Power meets Log²!)</h4>
                <p style={S.p}>A higher-degree polynomial paired with {'$\\ln^2 x$'} forces two full rounds of IBP with careful fraction tracking.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>First IBP:</strong> {'$u = \\ln^2 x$'}, {'$dv = x^3\\,dx$'}, {'$du = \\dfrac{2\\ln x}{x}\\,dx$'}, {'$v = \\frac{x^4}{4}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^3 \\ln^2 x\\,dx = \\frac{x^4}{4}\\ln^2 x - \\frac{1}{2}\\int x^3 \\ln x\\,dx \\quad\\cdots (*)$$'}</p>
                  <p style={S.p}><strong>Second IBP on {'$\\int x^3 \\ln x\\,dx$'}:</strong> {'$u = \\ln x$'}, {'$dv = x^3\\,dx$'}, {'$du = \\frac{1}{x}\\,dx$'}, {'$v = \\frac{x^4}{4}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^3 \\ln x\\,dx = \\frac{x^4}{4}\\ln x - \\frac{1}{4}\\int x^3\\,dx = \\frac{x^4}{4}\\ln x - \\frac{x^4}{16}$$'}</p>
                  <p style={S.p}><strong>Substitute back into (*):</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^3 \\ln^2 x\\,dx = \\frac{x^4}{4}\\ln^2 x - \\frac{1}{2}\\!\\left(\\frac{x^4}{4}\\ln x - \\frac{x^4}{16}\\right) + C$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{\\int x^3\\ln^2 x\\,dx = \\frac{x^4}{4}\\ln^2 x - \\frac{x^4}{8}\\ln x + \\frac{x^4}{32} + C}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 5 — complex */}
              <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>Example 5 — {'$\\int (\\ln x)^2\\,dx$'}</h4>
                <p style={S.p}>Write {'$\\int (\\ln x)^2\\cdot 1\\,dx$'} and use the LIATE trick.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>IBP:</strong> {'$u = (\\ln x)^2$'}, {'$dv = dx$'}, {'$du = \\frac{2\\ln x}{x}\\,dx$'}, {'$v = x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int(\\ln x)^2\\,dx = x(\\ln x)^2 - 2\\int\\ln x\\,dx$$'}</p>
                  <p style={S.p}>We know from Example 4 of the explorer that {'$\\int\\ln x\\,dx = x\\ln x - x + C$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$= x(\\ln x)^2 - 2(x\\ln x - x) + C = \\boxed{x(\\ln x)^2 - 2x\\ln x + 2x + C}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Note: also solvable by substitution */}
              <div style={S.noteBox}>
                <div style={{...S.lbl,color:'#2980b9'}}>📝 Important Note — Some Integrals Have Multiple Approaches</div>
                <p style={S.p}>Consider {'$\\int x^2 e^{x^3}\\,dx$'}. You can solve it two ways:</p>
                <p style={S.p}><strong>Method 1 (Substitution):</strong> Let {'$u=x^3$'}, {'$du=3x^2\\,dx$'}, so {'$x^2\\,dx=\\frac{du}{3}$'}. Then {'$\\int x^2 e^{x^3}\\,dx = \\frac{1}{3}\\int e^u\\,du = \\frac{e^{x^3}}{3}+C$'}. ✓ Easy!</p>
                <p style={S.p}><strong>Method 2 (IBP):</strong> {'$u=e^{x^3}$'}, {'$dv=x^2\\,dx$'}, {'$du=3x^2e^{x^3}\\,dx$'}, {'$v=\\frac{x^3}{3}$'}. Then {'$\\int x^2 e^{x^3}\\,dx = \\frac{x^3}{3}e^{x^3} - \\int x^3 e^{x^3}\\,dx$'}... which is harder than what we started with! ✗ IBP makes it worse.</p>
                <p style={{...S.p, marginBottom:0}}>The lesson: <strong>always try substitution first</strong>. If the integrand has a composite function with its derivative present (here {'$x^2$'} is the derivative of {'$x^3$'}), substitution is the natural choice. IBP is for products where substitution won't simplify things.</p>

                <hr style={{border:'none',borderTop:'1px solid #d0e8f8',margin:'14px 0'}}/>

                <p style={S.p}>Now consider {'$\\int x\\sqrt{x+5}\\,dx$'}. Here <em>both</em> methods work cleanly — a great example to compare them side by side.</p>

                <p style={S.p}><strong>Method 1 (Substitution):</strong> Let {'$u = x+5$'}, so {'$x = u-5$'} and {'$du = dx$'}.</p>
                <p style={{textAlign:'center'}}>{'$$\\int x\\sqrt{x+5}\\,dx = \\int (u-5)\\sqrt{u}\\,du = \\int\\!\\left(u^{3/2} - 5u^{1/2}\\right)du$$'}</p>
                <p style={{textAlign:'center'}}>{'$$= \\frac{2}{5}u^{5/2} - \\frac{10}{3}u^{3/2} + C = \\frac{2}{5}(x+5)^{5/2} - \\frac{10}{3}(x+5)^{3/2} + C$$'}</p>

                <p style={S.p}><strong>Method 2 (IBP):</strong> {'$u=x$'}, {'$dv=\\sqrt{x+5}\\,dx$'}, {'$du=dx$'}, {'$v=\\frac{2}{3}(x+5)^{3/2}$'}.</p>
                <p style={{textAlign:'center'}}>{'$$\\int x\\sqrt{x+5}\\,dx = \\frac{2x}{3}(x+5)^{3/2} - \\frac{2}{3}\\int(x+5)^{3/2}\\,dx$$'}</p>
                <p style={{textAlign:'center'}}>{'$$= \\frac{2x}{3}(x+5)^{3/2} - \\frac{2}{3}\\cdot\\frac{2}{5}(x+5)^{5/2} + C$$'}</p>
                <p style={{textAlign:'center'}}>{'$$= \\frac{2x}{3}(x+5)^{3/2} - \\frac{4}{15}(x+5)^{5/2} + C$$'}</p>

                <p style={{...S.p,marginBottom:0}}>Both answers are equivalent — you can verify by factoring out {'$(x+5)^{3/2}$'}. The lesson: <strong>when both methods work, substitution is usually shorter</strong>. IBP is powerful but requires more steps. Always choose the method that minimises algebra!</p>
              </div>
            </section>

            {/* ── DEFINITE IBP ── */}
            <section id="definite" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Definite Integration by Parts</div>
              <h2 style={S.h2}>Applying IBP to<br/>Definite Integrals</h2>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Definite IBP Formula</div>
                <p style={S.p}>{'For definite integrals, apply IBP and then evaluate at the limits:'}</p>
                <p style={{textAlign:'center',fontSize:'1.15rem'}}>{'$$\\int_a^b u\\,dv = \\Big[uv\\Big]_a^b - \\int_a^b v\\,du$$'}</p>
              </div>

              {/* Definite Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 6 — {'$\\int_0^1 xe^x\\,dx$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>IBP:</strong> {'$u=x$'}, {'$dv=e^x\\,dx$'}, {'$du=dx$'}, {'$v=e^x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^1 xe^x\\,dx = \\Big[xe^x\\Big]_0^1 - \\int_0^1 e^x\\,dx = (e-0) - \\Big[e^x\\Big]_0^1 = e - (e-1) = \\boxed{1}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Definite Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 7 — {'$\\int_1^e x\\ln x\\,dx$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>IBP:</strong> {'$u=\\ln x$'}, {'$dv=x\\,dx$'}, {'$du=\\frac{dx}{x}$'}, {'$v=\\frac{x^2}{2}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_1^e x\\ln x\\,dx = \\left[\\frac{x^2}{2}\\ln x\\right]_1^e - \\int_1^e\\frac{x}{2}\\,dx = \\frac{e^2}{2} - \\left[\\frac{x^2}{4}\\right]_1^e = \\frac{e^2}{2} - \\frac{e^2-1}{4} = \\boxed{\\frac{e^2+1}{4}}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Area example with IBP */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 8 — Area Under {'$y = xe^{-x}$'} on {'$[0, 3]$'}</h4>
                <p style={S.p}>Find the area of the region bounded by {'$y = xe^{-x}$'}, the {'$x$'}-axis, {'$x=0$'}, and {'$x=3$'}.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>Since {'$xe^{-x} \\geq 0$'} on {'$[0,3]$'}, area {'$= \\int_0^3 xe^{-x}\\,dx$'}.</p>
                  <p style={S.p}><strong>IBP:</strong> {'$u=x$'}, {'$dv=e^{-x}\\,dx$'}, {'$du=dx$'}, {'$v=-e^{-x}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$= \\Big[-xe^{-x}\\Big]_0^3 + \\int_0^3 e^{-x}\\,dx = -3e^{-3} + \\Big[-e^{-x}\\Big]_0^3 = -3e^{-3} + (-e^{-3}+1) = 1-4e^{-3}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\approx \\boxed{1 - 0.199 = 0.801 \\text{ square units}}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Area example 2 */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 9 — Area Under {'$y = x\\ln x$'} on {'$[1, e]$'}</h4>
                <p style={S.p}>{'Find $\\int_1^e x\\ln x\\,dx$ and interpret geometrically as the area under $y=x\\ln x$ from $x=1$ to $x=e$.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Note: $x\\ln x \\geq 0$ for $x \\geq 1$. From Example 7: area $= \\dfrac{e^2+1}{4} \\approx \\dfrac{7.389+1}{4} \\approx \\mathbf{2.097}$ square units.'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── IBP TWICE ── */}
            <section id="twice" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Integration by Parts More Than Once</div>
              <h2 style={S.h2}>When One Round of IBP<br/>Is Not Enough</h2>
              <p style={S.p}>Sometimes after the first round of IBP, the new integral {'$\\int v\\,du$'} still requires IBP again. This is common when the polynomial factor has degree 2 or higher.</p>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 10 — {'$\\int x^2 e^x\\,dx$'} (IBP Applied Twice)</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>First IBP:</strong> {'$u=x^2$'}, {'$dv=e^x\\,dx$'}, {'$du=2x\\,dx$'}, {'$v=e^x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^2 e^x\\,dx = x^2e^x - 2\\int xe^x\\,dx \\quad\\cdots(*)$$'}</p>
                  <p style={S.p}><strong>Second IBP on {'$\\int xe^x\\,dx$'}:</strong> {'$u=x$'}, {'$dv=e^x\\,dx$'}, {'$du=dx$'}, {'$v=e^x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int xe^x\\,dx = xe^x - e^x + C$$'}</p>
                  <p style={S.p}><strong>Substitute into (*):</strong></p>
                  <p style={{textAlign:'center'}}>{'$$= x^2e^x - 2(xe^x - e^x) + C = \\boxed{e^x(x^2-2x+2)+C}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 11 — {'$\\int x^2\\sin x\\,dx$'} (IBP Twice)</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>First IBP:</strong> {'$u=x^2$'}, {'$dv=\\sin x\\,dx$'}, {'$du=2x\\,dx$'}, {'$v=-\\cos x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^2\\sin x\\,dx = -x^2\\cos x + 2\\int x\\cos x\\,dx$$'}</p>
                  <p style={S.p}><strong>Second IBP on {'$\\int x\\cos x\\,dx$'}:</strong> {'$u=x$'}, {'$dv=\\cos x\\,dx$'}, {'$du=dx$'}, {'$v=\\sin x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x\\cos x\\,dx = x\\sin x - \\int\\sin x\\,dx = x\\sin x + \\cos x + C$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{\\int x^2\\sin x\\,dx = -x^2\\cos x + 2x\\sin x + 2\\cos x + C}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 12 — {'$\\int x^3\\ln x\\,dx$'} (Single IBP)</h4>
                <p style={S.p}>Despite the higher power, only <em>one</em> IBP is needed because the logarithm differentiates to a simple fraction.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>IBP:</strong> {'$u=\\ln x$'}, {'$dv=x^3\\,dx$'}, {'$du=\\frac{dx}{x}$'}, {'$v=\\frac{x^4}{4}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int x^3\\ln x\\,dx = \\frac{x^4}{4}\\ln x - \\int\\frac{x^4}{4}\\cdot\\frac{1}{x}\\,dx = \\frac{x^4}{4}\\ln x - \\frac{1}{4}\\int x^3\\,dx = \\boxed{\\frac{x^4}{4}\\ln x - \\frac{x^4}{16}+C}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── BUSINESS APPLICATIONS ── */}
            <section id="business" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Business Applications</div>
              <h2 style={S.h2}>Integration by Parts<br/>in Business &amp; Economics</h2>

              <div style={S.calloutTeal}>
                <strong>How to recognise when IBP is needed from a word problem:</strong> Look for expressions involving <em>a polynomial multiplied by an exponential or logarithm</em> — for example, a revenue rate like {'$f(t) = t \\cdot e^{-rt}$'} (linear growth times discounting factor). These always require IBP to evaluate the integral.
              </div>

              {/* Business Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 13 — Present Value with Growing Income Rate</h4>
                <p style={S.p}>A Lahore-based tech startup generates income at the rate {'$f(t) = 200{,}000t$'} PKR/year (revenue grows linearly). The annual interest rate is {'$r = 0.10$'} compounded continuously. Find the present value of this income stream over {'$T = 3$'} years.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$\\text{PV} = \\int_0^3 200{,}000t \\cdot e^{-0.10t}\\,dt = 200{,}000\\int_0^3 te^{-0.10t}\\,dt$'}</p>
                  <p style={S.p}><strong>IBP:</strong> {'$u=t$'}, {'$dv=e^{-0.10t}\\,dt$'}, {'$du=dt$'}, {'$v=-10e^{-0.10t}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^3 te^{-0.10t}\\,dt = \\Big[-10te^{-0.10t}\\Big]_0^3 + 10\\int_0^3 e^{-0.10t}\\,dt = -30e^{-0.3} + 10\\Big[-10e^{-0.10t}\\Big]_0^3$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= -30e^{-0.3} - 100(e^{-0.3}-1) = 100 - 130e^{-0.3} \\approx 100 - 96.22 = 3.78$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PV} = 200{,}000 \\times 3.78 \\approx \\boxed{\\text{PKR }755{,}000}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Business Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 14 — Total Revenue from Marginal Revenue</h4>
                <p style={S.p}>A company's marginal revenue is {'$R\'(x) = x\\ln(x+1)$'} PKR (hundred) per unit. Find the total revenue from selling the first 4 units.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$R(4)-R(0) = \\int_0^4 x\\ln(x+1)\\,dx$'}</p>
                  <p style={S.p}><strong>IBP:</strong> {'$u=\\ln(x+1)$'}, {'$dv=x\\,dx$'}, {'$du=\\frac{dx}{x+1}$'}, {'$v=\\frac{x^2}{2}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$= \\left[\\frac{x^2}{2}\\ln(x+1)\\right]_0^4 - \\int_0^4\\frac{x^2}{2(x+1)}\\,dx = 8\\ln 5 - \\frac{1}{2}\\int_0^4\\frac{x^2}{x+1}\\,dx$$'}</p>
                  <p style={S.p}>{'For $\\frac{x^2}{x+1}$, do polynomial division: $\\frac{x^2}{x+1} = x-1+\\frac{1}{x+1}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{1}{2}\\int_0^4\\left(x-1+\\frac{1}{x+1}\\right)dx = \\frac{1}{2}\\left[\\frac{x^2}{2}-x+\\ln(x+1)\\right]_0^4 = \\frac{1}{2}(8-4+\\ln 5) = 2+\\frac{\\ln 5}{2}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Total revenue} = 8\\ln 5 - 2 - \\frac{\\ln 5}{2} = \\frac{15\\ln 5}{2} - 2 \\approx \\boxed{\\text{PKR }1{,}207}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Business Example 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 15 — Future Value with Linearly Growing Deposits</h4>
                <p style={S.p}>A Karachi factory deposits money continuously into an account at rate {'$f(t) = 50{,}000(1+t)$'} PKR/year (deposits grow with time). The account earns {'$r = 8\\%$'} continuously. Find the future value after 2 years.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$\\text{FV} = e^{0.16}\\int_0^2 50{,}000(1+t)e^{-0.08t}\\,dt$'}</p>
                  <p style={S.p}><strong>Split:</strong> {'$\\int_0^2 e^{-0.08t}\\,dt + \\int_0^2 te^{-0.08t}\\,dt$'}</p>
                  <p style={S.p}><strong>First integral:</strong> {'$\\int_0^2 e^{-0.08t}\\,dt = \\left[\\frac{e^{-0.08t}}{-0.08}\\right]_0^2 = 12.5(1-e^{-0.16}) \\approx 1.856$'}</p>
                  <p style={S.p}><strong>Second (IBP):</strong> {'$u=t$, $dv=e^{-0.08t}\\,dt$, $v=-12.5e^{-0.08t}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^2 te^{-0.08t}\\,dt = \\left[-12.5te^{-0.08t}\\right]_0^2 + 12.5\\int_0^2 e^{-0.08t}\\,dt = -25e^{-0.16}+12.5(1.856) \\approx 1.63$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{FV} \\approx 50{,}000 \\times e^{0.16} \\times (1.856+1.63) \\approx 50{,}000\\times 1.1735\\times 3.486 \\approx \\boxed{\\text{PKR }204{,}600}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Business Example 4 — consumer surplus */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 16 — Consumer's Surplus with Logarithmic Demand</h4>
                <p style={S.p}>The demand for a commodity is {'$D(q) = 10\\ln(q+1) + 20$'} PKR/unit, and the market price is set at {'$p_0 = D(4) = 10\\ln 5 + 20 \\approx 36.09$'} PKR. Find the consumers' surplus.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$\\text{CS} = \\int_0^4[10\\ln(q+1)+20]\\,dq - p_0\\cdot 4$'}</p>
                  <p style={S.p}><strong>IBP for {'$\\int\\ln(q+1)\\,dq$'}:</strong> {'$u=\\ln(q+1)$, $dv=dq$, $du=\\frac{dq}{q+1}$, $v=q$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^4\\ln(q+1)\\,dq = \\Big[q\\ln(q+1)\\Big]_0^4 - \\int_0^4\\frac{q}{q+1}\\,dq = 4\\ln 5 - \\int_0^4\\left(1-\\frac{1}{q+1}\\right)dq$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 4\\ln 5 - [q-\\ln(q+1)]_0^4 = 4\\ln 5 - 4 + \\ln 5 = 5\\ln 5 - 4$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{CS} = 10(5\\ln 5-4)+80 - 4(10\\ln 5+20) = 50\\ln 5-40+80-40\\ln 5-80 = 10\\ln 5-40\\approx\\boxed{\\text{PKR }-23.9}$$'}</p>
                  <div style={S.warnBox}><p style={{...S.p,marginBottom:0}}>Negative CS means consumers are paying <em>more</em> than their aggregate willingness to spend — this demand curve rises with quantity (unusual — normally demand curves slope down). In practice, always check that your demand function is decreasing for a sensible economic interpretation.</p></div>
                </ToggleAnswer>
              </div>

              {/* Business Example 5 — total profit */}
              <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>Example 17 — Net Profit with Advertising Spending</h4>
                <p style={S.p}>A company spends on advertising so that the rate of change of profit is {'$P\'(t) = te^{0.5t}$'} (PKR lakhs per month). Find the total increase in profit over the first 4 months.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$\\Delta P = \\int_0^4 te^{0.5t}\\,dt$'}</p>
                  <p style={S.p}><strong>IBP:</strong> {'$u=t$'}, {'$dv=e^{0.5t}\\,dt$'}, {'$du=dt$'}, {'$v=2e^{0.5t}$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$= \\Big[2te^{0.5t}\\Big]_0^4 - 2\\int_0^4 e^{0.5t}\\,dt = 8e^2 - 2\\Big[2e^{0.5t}\\Big]_0^4 = 8e^2 - 4(e^2-1) = 4e^2+4$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\approx 4(7.389)+4 = \\boxed{\\text{PKR }33.56 \\text{ lakhs}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── INTEGRAL TABLES ── */}
            <section id="tables" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Using Integral Tables</div>
              <h2 style={S.h2}>When IBP and Substitution<br/>Are Not Enough</h2>

              <p style={S.p}>Most integrals in social and managerial sciences can be handled by substitution and integration by parts. But occasionally you encounter forms that require a lookup table. The key skill is recognising <strong>which form</strong> in the table your integral matches, and making the correct identification of the constants {'$a$'}, {'$b$'}, and {'$u$'}.</p>

              <div style={S.calloutGold}>
                <strong>Note:</strong> Some integrals — like {'$\\int \\frac{e^x}{x}\\,dx$'} — <em>cannot be evaluated by any method</em>. No closed-form antiderivative exists. The integral table only lists those that can be evaluated.
              </div>

              {/* PDF Download Button */}
              <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderRadius:'12px', padding:'22px 26px', marginBottom:'26px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'14px' }}>
                <div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#c0392b', marginBottom:'4px' }}>Reference Sheet</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#1a1a2e', marginBottom:'4px' }}>Table of Integrals — 28 Formulas</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', color:'#7f8c8d' }}>Forms: a+bu · a²+u² · a²−u² · u²−a² · eᵃᵘ · ln u · Reduction formulas</div>
                </div>
                <button onClick={downloadIntegralTablePDF} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.76rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a1a2e', color:'#d4a017', border:'none', borderRadius:'8px', padding:'11px 22px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
                  ⬇ Download PDF (Branded)
                </button>
              </div>

              {/* Table display */}
              <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderRadius:'12px', padding:'22px 26px', marginBottom:'26px', overflowX:'auto' }}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>Table 6.1 — A Short Table of Integrals</div>

                {[
                  { head:'Forms Involving a + bu', rows:[
                    ['1', '\\displaystyle\\int\\frac{u}{a+bu}\\,du = \\frac{1}{b^2}\\left[a+bu-a\\ln|a+bu|\\right]+C'],
                    ['3', '\\displaystyle\\int\\frac{u}{(a+bu)^2}\\,du = \\frac{1}{b^2}\\left[\\frac{a}{a+bu}+\\ln|a+bu|\\right]+C'],
                    ['6', '\\displaystyle\\int\\frac{du}{u(a+bu)} = \\frac{1}{a}\\ln\\left|\\frac{u}{a+bu}\\right|+C'],
                  ]},
                  { head:'Forms Involving a² + u²', rows:[
                    ['9',  '\\displaystyle\\int\\sqrt{a^2+u^2}\\,du = \\frac{u}{2}\\sqrt{a^2+u^2}+\\frac{a^2}{2}\\ln|u+\\sqrt{a^2+u^2}|+C'],
                    ['10', '\\displaystyle\\int\\frac{du}{\\sqrt{a^2+u^2}} = \\ln|u+\\sqrt{a^2+u^2}|+C'],
                    ['12', '\\displaystyle\\int\\frac{du}{(a^2+u^2)^{3/2}} = \\frac{u}{a^2\\sqrt{a^2+u^2}}+C'],
                  ]},
                  { head:'Forms Involving a² − u²  and  u² − a²', rows:[
                    ['16', '\\displaystyle\\int\\frac{du}{a^2-u^2} = \\frac{1}{2a}\\ln\\left|\\frac{a+u}{a-u}\\right|+C'],
                    ['18', '\\displaystyle\\int\\sqrt{u^2-a^2}\\,du = \\frac{u}{2}\\sqrt{u^2-a^2}-\\frac{a^2}{2}\\ln|u+\\sqrt{u^2-a^2}|+C'],
                    ['20', '\\displaystyle\\int\\frac{du}{\\sqrt{u^2-a^2}} = \\ln|u+\\sqrt{u^2-a^2}|+C'],
                  ]},
                  { head:'Forms Involving eᵃᵘ and ln u', rows:[
                    ['22', '\\displaystyle\\int ue^{au}\\,du = \\frac{1}{a^2}(au-1)e^{au}+C'],
                    ['23', '\\displaystyle\\int\\ln u\\,du = u\\ln u - u+C'],
                    ['25', '\\displaystyle\\int u^n\\ln u\\,du = \\frac{u^{n+1}}{n+1}\\left(\\ln u-\\frac{1}{n+1}\\right)+C,\\quad n\\neq -1'],
                  ]},
                  { head:'Reduction Formulas', rows:[
                    ['26', '\\displaystyle\\int u^n e^{au}\\,du = \\frac{1}{a}u^n e^{au}-\\frac{n}{a}\\int u^{n-1}e^{au}\\,du'],
                    ['27', '\\displaystyle\\int(\\ln u)^n\\,du = u(\\ln u)^n - n\\int(\\ln u)^{n-1}\\,du'],
                  ]},
                ].map(({head,rows})=>(
                  <div key={head} style={{ marginBottom:'20px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', padding:'6px 10px', background:'#eef7f7', borderRadius:'6px', marginBottom:'8px' }}>{head}</div>
                    {rows.map(([n,tex])=>(
                      <div key={n} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'7px 8px', borderBottom:'1px solid #f0e8dc' }}>
                        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem', fontWeight:700, color:'#c0392b', width:'20px', flexShrink:0 }}>{n}.</span>
                        <span>{`$$${tex}$$`}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Table Examples */}
              <h3 style={S.h3teal}>Using the Table — Worked Examples</h3>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 18 — {'$\\int\\dfrac{1}{3x^2+6}\\,dx$'}</h4>
                <p style={S.p}>Match to a table form: {'$3x^2+6 = 3(x^2+2)$'}, so this looks like {'$\\int\\frac{du}{a^2+u^2}$'}.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Rewrite:</strong> {'$\\int\\frac{dx}{3x^2+6} = \\frac{1}{3}\\int\\frac{dx}{x^2+2}$'}</p>
                  <p style={S.p}><strong>Match Form 12 context:</strong> This is actually {'$\\int\\frac{du}{a^2+u^2}$'} (arctan form, not in our table, but standard): {'$\\int\\frac{dx}{x^2+a^2} = \\frac{1}{a}\\arctan\\frac{x}{a}+C$'}.</p>
                  <p style={S.p}>With {'$a^2=2$'}, {'$a=\\sqrt{2}$'}:</p>
                  <p style={{textAlign:'center'}}>{'$$\\frac{1}{3}\\cdot\\frac{1}{\\sqrt{2}}\\arctan\\frac{x}{\\sqrt{2}}+C = \\boxed{\\frac{1}{3\\sqrt{2}}\\arctan\\frac{x}{\\sqrt{2}}+C}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 19 — {'$\\int\\dfrac{1}{\\sqrt{4x^2-9}}\\,dx$'}</h4>
                <p style={S.p}>Match to Form 20: {'$\\int\\frac{du}{\\sqrt{u^2-a^2}} = \\ln|u+\\sqrt{u^2-a^2}|+C$'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Rewrite:</strong> {'$4x^2-9 = (2x)^2-3^2$'}. Let {'$u=2x$'}, {'$du=2\\,dx$'}, {'$dx=\\frac{du}{2}$'}, {'$a=3$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\int\\frac{dx}{\\sqrt{4x^2-9}} = \\frac{1}{2}\\int\\frac{du}{\\sqrt{u^2-9}} = \\frac{1}{2}\\ln|u+\\sqrt{u^2-9}|+C$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\boxed{\\frac{1}{2}\\ln|2x+\\sqrt{4x^2-9}|+C}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 20 — {'$\\int\\dfrac{x}{(3+2x)^2}\\,dx$'}</h4>
                <p style={S.p}>Match to Form 3 with {'$a=3$'}, {'$b=2$'}, {'$u=x$'}.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Form 3:</strong> {'$\\int\\frac{u}{(a+bu)^2}\\,du = \\frac{1}{b^2}\\left[\\frac{a}{a+bu}+\\ln|a+bu|\\right]+C$'}</p>
                  <p style={S.p}>With {'$a=3$'}, {'$b=2$'}:</p>
                  <p style={{textAlign:'center'}}>{'$$\\int\\frac{x}{(3+2x)^2}\\,dx = \\frac{1}{4}\\left[\\frac{3}{3+2x}+\\ln|3+2x|\\right]+C$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 21 — {'$\\int x^3\\ln x\\,dx$'} via Table</h4>
                <p style={S.p}>Match to Form 25 with {'$n=3$'}: {'$\\int u^n\\ln u\\,du = \\frac{u^{n+1}}{n+1}\\left(\\ln u - \\frac{1}{n+1}\\right)+C$'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={{textAlign:'center'}}>{'$$\\int x^3\\ln x\\,dx = \\frac{x^4}{4}\\left(\\ln x-\\frac{1}{4}\\right)+C = \\boxed{\\frac{x^4}{4}\\ln x - \\frac{x^4}{16}+C}$$'}</p>
                  <p style={S.p}>✓ Matches our IBP result from Example 12.</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── LOGISTIC EQUATIONS ── */}
            <section id="logistic" className="lec-sec">
              <div style={S.secLabel}>§ 9 — Logistic Equations</div>
              <h2 style={S.h2}>Logistic Growth:<br/>When Growth Has a Ceiling</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.05rem'}}>Simple exponential growth {'$\\frac{dQ}{dt}=kQ$'} says a population grows forever at the same rate — clearly unrealistic. The <strong>logistic model</strong> adds a carrying capacity {'$M$'}: growth slows as the population approaches {'$M$'}, and stops entirely once it reaches it.</p>
                <p style={{...S.p,marginBottom:0,fontSize:'1.05rem'}}>Logistic equations model: the spread of COVID-19 in Pakistan, the adoption of new technology, the growth of a new business up to market saturation, and population dynamics of fish in a lake.</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Logistic Differential Equation</div>
                <p style={S.p}>A quantity {'$Q(t)$'} satisfies the <strong>logistic equation</strong> if:</p>
                <p style={{textAlign:'center',fontSize:'1.15rem'}}>{'$$\\frac{dQ}{dt} = kQ(M-Q)$$'}</p>
                <p style={S.p}>where {'$k > 0$'} is the growth rate constant and {'$M > 0$'} is the <strong>carrying capacity</strong> (the maximum possible value of {'$Q$'}).</p>
                <p style={S.p}><strong>Solution:</strong> Separate variables and use <strong>partial fractions + Form 16</strong> from the table {'$\\int\\frac{du}{a^2-u^2}$'}.</p>
                <p style={{textAlign:'center',fontSize:'1.1rem'}}>{'$$Q(t) = \\frac{M}{1+Ae^{-kMt}}, \\quad A = \\frac{M-Q_0}{Q_0}$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>where {'$Q_0 = Q(0)$'} is the initial value.</p>
              </div>

              {/* Logistic Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 22 — Solving a Logistic Equation</h4>
                <p style={S.p}>{'Solve $\\frac{dQ}{dt} = 0.02Q(100-Q)$ with $Q(0)=10$.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Identify:</strong> {'$k=0.02$'}, {'$M=100$'}.</p>
                  <p style={S.p}><strong>Apply the solution formula:</strong> {'$A = \\frac{100-10}{10} = 9$'}, {'$kM = 0.02\\times 100=2$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{Q(t) = \\frac{100}{1+9e^{-2t}}}$$'}</p>
                  <p style={S.p}><strong>Check:</strong> {'$Q(0) = \\frac{100}{1+9} = 10$ ✓'}. As {'$t\\to\\infty$'}, {'$Q(t)\\to 100=M$ ✓'}.</p>
                </ToggleAnswer>
              </div>

              {/* Logistic Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 23 — Spread of Information in a Company</h4>
                <p style={S.p}>{'A company has 500 employees. A rumour spreads at rate $\\frac{dQ}{dt} = 0.001Q(500-Q)$, where $Q$ is the number of people who have heard it. Initially 5 employees know. Find $Q(t)$ and determine when 250 employees will have heard it.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Solution:</strong> {'$k=0.001$'}, {'$M=500$'}, {'$Q_0=5$'}.</p>
                  <p style={S.p}>{'$A=\\frac{500-5}{5}=99$'}, {'$kM=0.001\\times 500=0.5$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$Q(t) = \\frac{500}{1+99e^{-0.5t}}$$'}</p>
                  <p style={S.p}><strong>When does {'$Q=250$'}?</strong></p>
                  <p style={{textAlign:'center'}}>{'$$250 = \\frac{500}{1+99e^{-0.5t}} \\Rightarrow 1+99e^{-0.5t}=2 \\Rightarrow e^{-0.5t}=\\frac{1}{99} \\Rightarrow t = \\frac{\\ln 99}{0.5} \\approx \\boxed{9.2\\text{ time units}}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Logistic Example 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 24 — Market Saturation of a New Product</h4>
                <p style={S.p}>{'A new mobile app in Pakistan has a potential market of $M = 2{,}000{,}000$ users. Market research suggests the spread follows $\\frac{dQ}{dt} = 0.0000008\\,Q(2{,}000{,}000 - Q)$, with $Q(0) = 500$ initial users. Find the number of users after 12 months.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$k=8\\times 10^{-7}$'}, {'$M=2\\times 10^6$'}, {'$Q_0=500$'}.</p>
                  <p style={S.p}>{'$A=\\frac{2{,}000{,}000-500}{500}=3{,}999$'}, {'$kM=8\\times10^{-7}\\times 2\\times10^6 = 1.6$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$Q(t)=\\frac{2{,}000{,}000}{1+3{,}999\\,e^{-1.6t}}$$'}</p>
                  <p style={S.p}><strong>At {'$t=12$'} months:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$Q(12)=\\frac{2{,}000{,}000}{1+3{,}999\\,e^{-19.2}}\\approx\\frac{2{,}000{,}000}{1+3{,}999\\times 4.5\\times10^{-9}}\\approx \\boxed{\\approx 1{,}999{,}982 \\text{ users}}$$'}</p>
                  <p style={S.p}>After 12 months, essentially the entire potential market has adopted the app — rapid saturation due to the large {'$kM$'} value.</p>
                </ToggleAnswer>
              </div>

              <div style={S.divider}/>
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Coming up next —</strong> §6.2 Numerical Integration — when even IBP and integral tables cannot give a closed-form answer, we compute definite integrals numerically using the Trapezoidal Rule and Simpson's Rule.</div>
            </section>

          </div>

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s55" style={S.lnfBtnPrev}>← §5.5 Applications to Business</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§6.1 · Chapter 6 · Calculus I</div>
            <Link href="/courses/calc1" style={S.lnfBtnNext}>§6.2 Numerical Integration →</Link>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}