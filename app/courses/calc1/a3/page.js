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
  thmBox: { background:'#fff8ec', border:'1.5px solid #d4a017', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  noteBox: { background:'#f0f4ff', border:'1.5px solid #2980b9', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  warnBox: { background:'#fff5f5', border:'1.5px solid #c0392b', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  calloutTeal:  { background:'#eef7f7', borderLeft:'4px solid #1a6b6b', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutGold:  { background:'#fff8ec', borderLeft:'4px solid #d4a017', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutRed:   { background:'#fdf0ef', borderLeft:'4px solid #c0392b', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  calloutGreen: { background:'#f0faf4', borderLeft:'4px solid #27ae60', borderRadius:'0 8px 8px 0', padding:'15px 20px', margin:'18px 0', fontSize:'.97rem' },
  toggleBtn: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.76rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a1a2e', color:'#d4a017', border:'none', borderRadius:'6px', padding:'9px 20px', cursor:'pointer', marginTop:'10px' },
  toggleBtnBlue: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#2980b9', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer', marginTop:'8px' },
  answerBox: { background:'#f0f9f0', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'18px 22px', marginTop:'12px' },
  secLabel: { fontFamily:"'IBM Plex Mono', monospace", fontSize:'.68rem', letterSpacing:'.26em', textTransform:'uppercase', color:'#c0392b', marginBottom:'8px' },
  divider: { width:'100%', height:'1px', background:'#e0d6c8', margin:'52px 0' },
  h2: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'clamp(1.7rem,4vw,2.55rem)', fontWeight:700, marginBottom:'20px', lineHeight:1.2, color:'#1a1a2e' },
  h3teal: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.32rem', fontWeight:700, margin:'30px 0 12px', color:'#1a6b6b' },
  h4red:   { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#c0392b' },
  h4gold:  { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#d4a017' },
  h4teal:  { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#1a6b6b' },
  h4blue:  { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#2980b9' },
  h4green: { fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#27ae60' },
  p: { marginBottom:'16px', color:'#1a1a2e' },
  lecFooterNav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'28px 40px', borderTop:'1px solid #e0d6c8', flexWrap:'wrap', gap:'12px', background:'#fdf8f0' },
  lnfBtnPrev: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono', monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#2980b9', border:'1px solid #2980b9', background:'#f0f4ff', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
  lnfBtnNext: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono', monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#1a6b6b', border:'1px solid #1a6b6b', background:'#eef7f7', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
};

// ─── TOC ──────────────────────────────────────────────────────────────────
const TOC = [
  { ch:'Course Overview', items:[{ label:'Course Overview', href:'/courses/calc1' }] },
  { ch:'Ch 1 — Functions, Graphs & Limits', items:[
    { label:'1.1 · Functions', soon:true },
    { label:'1.2 · The Graph of a Function', soon:true },
    { label:'1.3 · Lines and Linear Functions', soon:true },
    { label:'1.4 · Functional Models', soon:true },
    { label:'1.5 · Limits', soon:true },
    { label:'1.6 · One-Sided Limits and Continuity', soon:true },
  ]},
  { ch:'Ch 2 — Differentiation: Basic Concepts', items:[
    { label:'2.1 · The Derivative', soon:true },
    { label:'2.2 · Techniques of Differentiation', soon:true },
    { label:'2.3 · Product and Quotient Rules', soon:true },
    { label:'2.4 · The Chain Rule', soon:true },
    { label:'2.5 · Marginal Analysis', soon:true },
    { label:'2.6 · Implicit Differentiation', soon:true },
  ]},
  { ch:'Ch 3 — Applications of the Derivative', items:[
    { label:'3.1 · Increasing & Decreasing Functions', soon:true },
    { label:'3.2 · Concavity & Inflection Points', soon:true },
    { label:'3.3 · Curve Sketching', soon:true },
    { label:'3.4 · Optimization; Elasticity', soon:true },
    { label:'3.5 · Additional Optimization', soon:true },
  ]},
  { ch:'Ch 4 — Exponential & Logarithmic Functions', items:[
    { label:'4.1 · Exponential Functions', soon:true },
    { label:'4.2 · Logarithmic Functions', soon:true },
    { label:'4.3 · Differentiation of Exp & Log', soon:true },
    { label:'4.4 · Exponential Models', soon:true },
  ]},
  { ch:'Ch 5 — Integration', items:[
    { label:'5.1 · Indefinite Integration',        href:'/courses/calc1/s51', live:true },
    { label:'5.2 · Integration by Substitution',   href:'/courses/calc1/s52', live:true },
    { label:'5.3 · Definite Integral & FTC',       href:'/courses/calc1/s53', live:true },
    { label:'5.4 · Applying Definite Integration', href:'/courses/calc1/s54', live:true },
    { label:'5.5 · Applications to Business',      href:'/courses/calc1/s55', live:true },
  ]},
  { ch:'Ch 6 — Additional Integration Topics', items:[
    { label:'6.1 · Integration by Parts',       href:'/courses/calc1/s61', live:true },
    { label:'6.2 · Numerical Integration',      soon:true },
    { label:'6.3 · Improper Integrals',         soon:true },
    { label:'6.4 · Continuous Probability',     soon:true },
  ]},
  { ch: 'Appendix — Additional Topics', items: [
    { label: 'A.1 · A Brief Review of Algebra',               soon: true },
    { label: 'A.2 · Factoring Polynomials & Solving Systems', soon: true },
    { label: 'A.3 · Evaluating Limits with L\'Hôpital\'s Rule', href: '/courses/calc1/a3', live: true },
    { label: 'A.4 · The Summation Notation',                  soon: true },
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

// ─── Interactive L'Hôpital Explorer ───────────────────────────────────────
function LHopitalExplorer() {
  const [expr, setExpr] = useState('');
  const [point, setPoint] = useState('0');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const PRESETS = [
    { label:'(x²−1)/(x−1), x→1',    num:'x^2-1',    den:'x-1',   pt:'1',   numD:'2x',   denD:'1',   answer:'2',        form:'0/0', rounds:1 },
    { label:'ln(x)/(x−1), x→1',      num:'ln(x)',    den:'x-1',   pt:'1',   numD:'1/x',  denD:'1',   answer:'1',        form:'0/0', rounds:1 },
    { label:'eˣ/x², x→∞',            num:'e^x',      den:'x^2',   pt:'∞',   numD:'eˣ',   denD:'2x',  answer:'∞',        form:'∞/∞', rounds:2 },
    { label:'x³/eˣ, x→∞',            num:'x^3',      den:'e^x',   pt:'∞',   numD:'3x²',  denD:'eˣ',  answer:'0',        form:'∞/∞', rounds:3 },
    { label:'(eˣ−1)/x, x→0',         num:'e^x−1',    den:'x',     pt:'0',   numD:'eˣ',   denD:'1',   answer:'1',        form:'0/0', rounds:1 },
    { label:'ln(x)/x, x→∞',          num:'ln(x)',    den:'x',     pt:'∞',   numD:'1/x',  denD:'1',   answer:'0',        form:'∞/∞', rounds:1 },
    { label:'(x−sin x)/x³, x→0',     num:'x−sin(x)', den:'x^3',   pt:'0',   numD:'1−cos x', denD:'3x²', answer:'1/6', form:'0/0', rounds:3 },
  ];

  const [sel, setSel] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const preset = PRESETS[sel];

  useEffect(() => {
    setRevealed(0);
  }, [sel]);

  useEffect(() => {
    if (containerRef.current && window.MathJax?.typesetPromise) {
      setTimeout(() => window.MathJax.typesetPromise([containerRef.current]).catch(()=>{}), 80);
    }
  }, [sel, revealed]);

  const stepLabels = ['Check the form', 'Differentiate numerator & denominator', 'Apply — evaluate the new limit', preset.rounds >= 2 ? 'Apply again if needed' : null, preset.rounds >= 3 ? 'Apply a third time' : null].filter(Boolean);

  return (
    <div ref={containerRef} style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>
        ⚡ L'Hôpital's Rule — Step-by-Step Explorer
      </div>

      {/* Preset selector */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'16px' }}>
        {PRESETS.map((p,i) => (
          <button key={i} onClick={()=>setSel(i)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', background:sel===i?'#d4a017':'#1f2937', color:sel===i?'#1a1a2e':'#9ca3af', border:`1px solid ${sel===i?'#d4a017':'#374151'}`, borderRadius:'4px', padding:'3px 9px', cursor:'pointer' }}>
            {p.label}
        </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
        {/* Left: the limit */}
        <div>
          <div style={{ background:'#0f172a', borderRadius:'8px', padding:'14px 16px', marginBottom:'10px' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'6px' }}>Evaluate this limit</div>
            <div style={{ textAlign:'center', color:'#e2e8f0', fontSize:'1.1rem' }}>
              {`$$\\lim_{x\\to ${preset.pt}} \\frac{${preset.num}}{${preset.den}}$$`}
            </div>
          </div>

          {/* Form badge */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
            <div style={{ background: preset.form==='0/0'?'rgba(192,57,43,0.2)':'rgba(41,128,185,0.2)', border:`1px solid ${preset.form==='0/0'?'#c0392b':'#2980b9'}`, borderRadius:'6px', padding:'6px 12px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color: preset.form==='0/0'?'#ef4444':'#60a5fa' }}>
              Form: <strong>{preset.form}</strong> — L'Hôpital applies ✓
            </div>
            <div style={{ background:'rgba(26,107,107,0.2)', border:'1px solid #1a6b6b', borderRadius:'6px', padding:'6px 12px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#38c9b0' }}>
              Rounds needed: <strong>{preset.rounds}</strong>
            </div>
          </div>

          {/* Final answer */}
          <div style={{ background:'rgba(212,160,23,0.15)', border:'1px solid #d4a017', borderRadius:'8px', padding:'12px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#d4a017', textTransform:'uppercase', marginBottom:'4px' }}>Final Answer</div>
            <div style={{ color:'#fdf8f0', fontSize:'1.1rem' }}>{`$${preset.answer}$`}</div>
          </div>
        </div>

        {/* Right: step-by-step reveal */}
        <div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'8px' }}>
            Step-by-step ({revealed}/{stepLabels.length} revealed)
          </div>

          {stepLabels.slice(0, revealed).map((lbl, i) => (
            <div key={i} style={{ background:'#0f172a', borderRadius:'7px', padding:'10px 13px', marginBottom:'7px', borderLeft:`3px solid ${i===0?'#ef4444':i===1?'#d4a017':'#38c9b0'}` }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:i===0?'#ef4444':i===1?'#d4a017':'#38c9b0', textTransform:'uppercase', marginBottom:'3px' }}>Step {i+1}: {lbl}</div>
              <div style={{ color:'#cbd5e1', fontSize:'.88rem' }}>
                {i===0 && <span>Plug in {'$x=' + preset.pt + '$'}. Numerator → {'$0$' }, denominator → {'$0$'}. Form is {preset.form}. ✓ Apply L'Hôpital.</span>}
                {i===1 && <span>{'$f\'(x) = ' + preset.numD + '$'}, {'$\\quad g\'(x) = ' + preset.denD + '$'}</span>}
                {i===2 && <span>New limit: {`$\\lim_{x\\to${preset.pt}}\\frac{${preset.numD}}{${preset.denD}}$`}{preset.rounds===1?` $= ${preset.answer}$`:' → still indeterminate, apply again.'}</span>}
                {i===3 && <span>After round 2{preset.rounds===2?`: answer = $${preset.answer}$`:': still indeterminate, apply once more.'}</span>}
                {i===4 && <span>After round 3: answer = {`$${preset.answer}$`}</span>}
              </div>
            </div>
          ))}

          <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
            {revealed < stepLabels.length && (
              <button onClick={()=>setRevealed(r=>r+1)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', background:'#1a6b6b', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer' }}>
                Next Step →
              </button>
            )}
            {revealed > 0 && (
              <button onClick={()=>setRevealed(0)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', background:'#374151', color:'#9ca3af', border:'none', borderRadius:'6px', padding:'7px 14px', cursor:'pointer' }}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Calc1A3() {
  const [sidebarOpen, setSidebarOpen] = useState({ 7: true });

  useEffect(() => {
    window.MathJax = {
      tex: { inlineMath:[['$','$'],['\\(','\\)']], displayMath:[['$$','$$'],['\\[','\\]']] },
      options: { skipHtmlTags:['script','noscript','style','textarea','pre'] }
    };
    const ti = setInterval(() => {
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); clearInterval(ti); }
    }, 100);
    return () => clearInterval(ti);
  }, []);

  return (
    <>
      <Navbar activePage="courses" />
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive"/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec{padding:52px 0 0;}
        .lec-sec:first-child{padding-top:44px;}
        @media(max-width:860px){.csb-hide{display:none!important;}.lec-inner-m{padding:0 18px 40px!important;}.lec-hero-m{padding:36px 20px 32px!important;}}
      
        mjx-container { color: #1a1a2e !important; }
        mjx-container svg { color: #1a1a2e !important; }
        .MathJax { color: #1a1a2e !important; }
      `}</style>

      {/* SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§A.3 L'Hôpital's Rule</span>
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
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Appendix &nbsp;·&nbsp; Section A.3</div>
            <h1 style={S.lecHeroH1}>L'Hôpital's Rule</h1>
            <div style={S.lecHeroSub}>Evaluating Limits of Indeterminate Forms</div>
            <p style={S.lecHeroP}>When direct substitution gives {'$\\frac{0}{0}$'} or {'$\\frac{\\infty}{\\infty}$'}, a single elegant theorem — proved by a student, published by his teacher — unlocks the limit.</p>
            <div style={S.lecHeroLine}/>
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#motivation','Motivation'],['#indeterminate','Indeterminate Forms'],['#rule','The Rule'],['#explorer','Explorer'],['#examples','Examples'],['#multiple','Multiple Applications'],['#mistakes','Common Mistakes'],['#algebra','Algebra + L\'Hôpital'],['#practice','Practice']].map(([href,lbl])=>(
              <a key={href} href={href} style={S.lecNavA}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ── MOTIVATION ── */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>The Story Behind the Rule</div>
              <h2 style={S.h2}>A Theorem Named After<br/>the Wrong Person</h2>
              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.06rem'}}>In 1696, Guillaume de l'Hôpital published the first calculus textbook in history — <em>Analyse des Infiniment Petits</em>. In it appeared a beautiful rule for evaluating limits of the form {'$\\frac{0}{0}$'}. It became one of the most famous results in all of calculus.</p>
                <p style={{...S.p,fontSize:'1.06rem'}}>The catch? L'Hôpital didn't prove it. His student, <strong>Johann Bernoulli</strong>, did — and sold the result to l'Hôpital for a monthly salary. The rule bears the teacher's name, but the credit belongs to the student.</p>
                <p style={{...S.p,fontSize:'1.06rem',marginBottom:0}}>The mathematical lesson is more enduring than the historical gossip: when you're stuck at {'$\\frac{0}{0}$'}, don't give up. There is a systematic way out.</p>
              </div>
              <div style={S.calloutGold}>
                <strong>Why you need this:</strong> You've computed dozens of limits already. Most were resolved by factoring, simplifying, or direct substitution. But what about {'$\\lim_{x\\to 0}\\frac{e^x - 1}{x}$'} or {'$\\lim_{x\\to\\infty}\\frac{\\ln x}{x}$'}? These resist all elementary techniques. L'Hôpital's rule handles them in one step.
              </div>
            </section>

            {/* ── INDETERMINATE FORMS ── */}
            <section id="indeterminate" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Understanding the Problem</div>
              <h2 style={S.h2}>Indeterminate Forms:<br/>When Limits Refuse to Behave</h2>

              <p style={S.p}>When you evaluate {'$\\lim_{x\\to a}\\frac{f(x)}{g(x)}$'} by direct substitution and get {'$\\frac{0}{0}$'} or {'$\\frac{\\infty}{\\infty}$'}, the limit is called <strong>indeterminate</strong>. This does NOT mean the limit doesn't exist — it means the form carries no information about what the limit actually is.</p>

              <div style={S.thmBox}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#d4a017',marginBottom:'10px'}}>Why {'$\\frac{0}{0}$'} is indeterminate</div>
                <p style={S.p}>Consider these three limits — all give {'$\\frac{0}{0}$'} at {'$x=0$'} — yet each has a different answer:</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',margin:'12px 0'}}>
                  {/* Three hardcoded cards — avoids template literal $ conflict */}
                    {[
                    { expr:'$\\lim_{x\\to 0}\\dfrac{x}{x}$',   ans:'$= 1$' },
                    { expr:'$\\lim_{x\\to 0}\\dfrac{x^2}{x}$',  ans:'$= 0$' },
                    { expr:'$\\lim_{x\\to 0}\\dfrac{x}{x^3}$',  ans:'$= \\infty$' },
                    ].map(({expr,ans})=>(
                    <div key={expr} style={{background:'#fff',borderRadius:'8px',padding:'14px',textAlign:'center',border:'1px solid #e0d6c8'}}>
                        <div style={{fontSize:'1.1rem',marginBottom:'6px'}}>{expr}</div>
                        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.85rem',color:'#c0392b',fontWeight:700}}>{ans}</div>
                    </div>
                    ))}
                </div>
                <p style={{...S.p,marginBottom:0}}>The form {'$\\frac{0}{0}$'} tells you nothing on its own. The actual limit depends on <em>how fast</em> numerator and denominator approach zero relative to each other.</p>
              </div>

              {/* Flow diagram */}
              <h3 style={S.h3teal}>Decision Flow: When to Apply L'Hôpital</h3>
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'22px',marginBottom:'24px',overflowX:'auto'}}>
                <svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'680px',display:'block',margin:'0 auto'}}>
                  {/* Start */}
                  <rect x="240" y="10" width="200" height="44" rx="22" fill="#1a1a2e"/>
                  <text x="340" y="37" textAnchor="middle" fill="#d4a017" fontFamily="IBM Plex Mono,monospace" fontSize="12" fontWeight="700">Evaluate lim f(x)/g(x)</text>
                  <line x1="340" y1="54" x2="340" y2="76" stroke="#555" strokeWidth="1.5" markerEnd="url(#arr)"/>

                  {/* Step 1 box */}
                  <rect x="210" y="76" width="260" height="44" rx="8" fill="#f5ede0" stroke="#d4a017" strokeWidth="1.5"/>
                  <text x="340" y="97" textAnchor="middle" fill="#1a1a2e" fontFamily="IBM Plex Mono,monospace" fontSize="11">Step 1: Substitute x = a</text>
                  <text x="340" y="112" textAnchor="middle" fill="#1a1a2e" fontFamily="IBM Plex Mono,monospace" fontSize="11">into f(x) and g(x) separately</text>
                  <line x1="340" y1="120" x2="340" y2="148" stroke="#555" strokeWidth="1.5" markerEnd="url(#arr)"/>

                  {/* Diamond */}
                  <polygon points="340,148 460,200 340,252 220,200" fill="#fff8ec" stroke="#d4a017" strokeWidth="1.5"/>
                  <text x="340" y="195" textAnchor="middle" fill="#1a1a2e" fontFamily="IBM Plex Mono,monospace" fontSize="11">Result is</text>
                  <text x="340" y="212" textAnchor="middle" fill="#1a1a2e" fontFamily="IBM Plex Mono,monospace" fontSize="11">0/0 or ∞/∞?</text>

                  {/* YES path */}
                  <line x1="340" y1="252" x2="340" y2="276" stroke="#1a6b6b" strokeWidth="1.5" markerEnd="url(#arrG)"/>
                  <text x="348" y="268" fill="#1a6b6b" fontFamily="IBM Plex Mono,monospace" fontSize="10">YES</text>
                  <rect x="210" y="276" width="260" height="36" rx="8" fill="#eef7f7" stroke="#1a6b6b" strokeWidth="1.5"/>
                  <text x="340" y="298" textAnchor="middle" fill="#1a6b6b" fontFamily="IBM Plex Mono,monospace" fontSize="11" fontWeight="700">Apply L'Hôpital: lim f'(x)/g'(x)</text>

                  {/* NO path — direct answer */}
                  <line x1="460" y1="200" x2="570" y2="200" stroke="#c0392b" strokeWidth="1.5" markerEnd="url(#arrR)"/>
                  <text x="498" y="193" fill="#c0392b" fontFamily="IBM Plex Mono,monospace" fontSize="10">NO</text>
                  <rect x="570" y="178" width="100" height="44" rx="8" fill="#fff5f5" stroke="#c0392b" strokeWidth="1.5"/>
                  <text x="620" y="198" textAnchor="middle" fill="#c0392b" fontFamily="IBM Plex Mono,monospace" fontSize="10">Direct answer</text>
                  <text x="620" y="213" textAnchor="middle" fill="#c0392b" fontFamily="IBM Plex Mono,monospace" fontSize="10">or factor/simplify</text>

                  {/* Arrowhead markers */}
                  <defs>
                    <marker id="arr"  markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#555"/></marker>
                    <marker id="arrG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#1a6b6b"/></marker>
                    <marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#c0392b"/></marker>
                  </defs>
                </svg>
              </div>
            </section>

            {/* ── THE RULE ── */}
            <section id="rule" className="lec-sec">
              <div style={S.secLabel}>§ 2 — The Theorem</div>
              <h2 style={S.h2}>L'Hôpital's Rule</h2>

              <div style={S.thmBox}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#d4a017',marginBottom:'12px'}}>L'Hôpital's Rule</div>
                <p style={S.p}>Suppose {'$f$'} and {'$g$'} are differentiable and {'$g\'(x) \\neq 0$'} near {'$x=a$'} (except possibly at {'$a$'} itself). If</p>
                <p style={{textAlign:'center',color:'#1a1a2e'}}>{'$$\\lim_{x\\to a}\\frac{f(x)}{g(x)} \\text{ is of the form } \\frac{0}{0} \\text{ or } \\frac{\\infty}{\\infty}$$'}</p>
                <p style={{...S.p,color:'#1a1a2e'}}>then</p>
                <p style={{textAlign:'center',fontSize:'1.2rem',color:'#1a1a2e'}}>{'$$\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f\'(x)}{g\'(x)}$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a1a2e'}}>provided the limit on the right exists (or is {'$\\pm\\infty$'}). The rule also applies as {'$x\\to\\infty$'} or {'$x\\to -\\infty$'}.</p>
              </div>

              <div style={S.calloutRed}>
                <strong>Critical point:</strong> You differentiate the numerator and denominator <em>separately</em> — NOT using the quotient rule. {'$\\frac{d}{dx}\\left[\\frac{f}{g}\\right] \\neq \\frac{f\'}{g\'}$'}. You are replacing the original limit with the limit of the ratio of derivatives.
              </div>
            </section>

            {/* ── EXPLORER ── */}
            <section id="explorer" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Interactive Explorer</div>
              <h2 style={S.h2}>See It Work Step by Step</h2>
              <p style={S.p}>Select any limit below and reveal the solution one step at a time.</p>
              <LHopitalExplorer />
            </section>

            {/* ── EXAMPLES ── */}
            <section id="examples" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Worked Examples</div>
              <h2 style={S.h2}>Single Application<br/>of L'Hôpital's Rule</h2>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — {'$\\displaystyle\\lim_{x\\to 0}\\dfrac{e^x - 1}{x}$'}</h4>
                <p style={S.p}>This is the fundamental limit connecting exponentials and derivatives.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Step 1 — Check form:</strong> {'$f(0) = e^0-1 = 0$'}, {'$g(0)=0$'}. Form is {'$\\frac{0}{0}$'} ✓</p>
                  <p style={S.p}><strong>Step 2 — Differentiate separately:</strong> {'$f\'(x)=e^x$'}, {'$g\'(x)=1$'}</p>
                  <p style={S.p}><strong>Step 3 — Apply rule:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 0}\\frac{e^x-1}{x} = \\lim_{x\\to 0}\\frac{e^x}{1} = e^0 = \\boxed{1}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — {'$\\displaystyle\\lim_{x\\to 1}\\dfrac{x^3 - 1}{x^2 - 1}$'}</h4>
                <p style={S.p}>Could be factored, but L'Hôpital works cleanly here too.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Check:</strong> {'$f(1)=0$'}, {'$g(1)=0$'} → form {'$\\frac{0}{0}$'} ✓</p>
                  <p style={S.p}><strong>Differentiate:</strong> {'$f\'(x)=3x^2$'}, {'$g\'(x)=2x$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 1}\\frac{x^3-1}{x^2-1} = \\lim_{x\\to 1}\\frac{3x^2}{2x} = \\frac{3}{2} = \\boxed{\\frac{3}{2}}$$'}</p>
                  <p style={{...S.p,marginBottom:0,color:'#7f8c8d',fontSize:'.93rem'}}><em>Verify by factoring: {'$\\frac{(x-1)(x^2+x+1)}{(x-1)(x+1)} = \\frac{x^2+x+1}{x+1}\\to\\frac{3}{2}$'} ✓</em></p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — {'$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{\\ln x}{x}$'}</h4>
                <p style={S.p}>Does logarithm grow faster than a linear function? L'Hôpital gives the definitive answer.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Check:</strong> {'$\\ln x \\to \\infty$'} and {'$x\\to\\infty$'} → form {'$\\frac{\\infty}{\\infty}$'} ✓</p>
                  <p style={S.p}><strong>Differentiate:</strong> {'$f\'(x)=\\frac{1}{x}$'}, {'$g\'(x)=1$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to\\infty}\\frac{\\ln x}{x} = \\lim_{x\\to\\infty}\\frac{1/x}{1} = \\lim_{x\\to\\infty}\\frac{1}{x} = \\boxed{0}$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>Conclusion: <strong>{'$x$'} grows faster than {'$\\ln x$'}</strong> — the linear function dominates.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 4 — {'$\\displaystyle\\lim_{x\\to 0}\\dfrac{x - \\ln(1+x)}{x^2}$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Check:</strong> {'$f(0) = 0 - \\ln 1 = 0$'}, {'$g(0)=0$'} → {'$\\frac{0}{0}$'} ✓</p>
                  <p style={S.p}><strong>Differentiate:</strong> {'$f\'(x) = 1 - \\frac{1}{1+x}$'}, {'$g\'(x)=2x$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 0}\\frac{1-\\frac{1}{1+x}}{2x} = \\lim_{x\\to 0}\\frac{\\frac{x}{1+x}}{2x} = \\lim_{x\\to 0}\\frac{1}{2(1+x)} = \\boxed{\\frac{1}{2}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── MULTIPLE APPLICATIONS ── */}
            <section id="multiple" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Applying the Rule Multiple Times</div>
              <h2 style={S.h2}>When One Round<br/>Is Not Enough</h2>
              <p style={S.p}>After applying L'Hôpital once, if the new limit {'$\\lim\\frac{f\'}{g\'}$'} is still {'$\\frac{0}{0}$'} or {'$\\frac{\\infty}{\\infty}$'}, apply the rule again. Repeat until the form is no longer indeterminate.</p>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 5 — {'$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x^2}{e^x}$'} (Apply Twice)</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Round 1:</strong> Form {'$\\frac{\\infty}{\\infty}$'}. {'$f\'=2x$'}, {'$g\'=e^x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to\\infty}\\frac{2x}{e^x} \\quad\\text{still }\\frac{\\infty}{\\infty}$$'}</p>
                  <p style={S.p}><strong>Round 2:</strong> {'$f\'\'=2$'}, {'$g\'\'=e^x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to\\infty}\\frac{2}{e^x} = 0 \\Rightarrow \\boxed{\\lim_{x\\to\\infty}\\frac{x^2}{e^x} = 0}$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>Exponential growth always dominates polynomial growth — no matter how high the power.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 6 — {'$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x^3}{e^x}$'} (Apply Three Times)</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Round 1:</strong> {'$\\frac{x^3}{e^x} \\xrightarrow{L\'H} \\frac{3x^2}{e^x}$'} — still {'$\\frac{\\infty}{\\infty}$'}</p>
                  <p style={S.p}><strong>Round 2:</strong> {'$\\frac{3x^2}{e^x} \\xrightarrow{L\'H} \\frac{6x}{e^x}$'} — still {'$\\frac{\\infty}{\\infty}$'}</p>
                  <p style={S.p}><strong>Round 3:</strong> {'$\\frac{6x}{e^x} \\xrightarrow{L\'H} \\frac{6}{e^x} \\to 0$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\boxed{\\lim_{x\\to\\infty}\\frac{x^3}{e^x} = 0}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 7 — {'$\\displaystyle\\lim_{x\\to 0}\\dfrac{e^x - 1 - x}{x^2}$'} (Apply Twice)</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Round 1:</strong> {'$f(0)=0$'}, {'$g(0)=0$'}. {'$f\'=e^x-1$'}, {'$g\'=2x$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 0}\\frac{e^x-1}{2x} \\quad\\text{still }\\frac{0}{0}$$'}</p>
                  <p style={S.p}><strong>Round 2:</strong> {'$f\'\'=e^x$'}, {'$g\'\'=2$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 0}\\frac{e^x}{2} = \\frac{1}{2} \\Rightarrow \\boxed{\\frac{1}{2}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── COMMON MISTAKES ── */}
            <section id="mistakes" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Common Mistakes</div>
              <h2 style={S.h2}>How Students Misuse<br/>L'Hôpital's Rule</h2>

              {[
                {
                  n:'Mistake 1', col:'#c0392b',
                  title: 'Using the quotient rule instead of differentiating separately',
                  wrong: '\\frac{d}{dx}\\left[\\frac{f}{g}\\right] = \\frac{f\'g - fg\'}{g^2}',
                  right: '\\text{Apply L\'Hôpital: replace }\\frac{f}{g}\\text{ with }\\frac{f\'}{g\'}',
                  note: "L'Hôpital does NOT say take the derivative of the whole fraction using the quotient rule. You differentiate numerator and denominator independently.",
                },
                {
                  n:'Mistake 2', col:'#2980b9',
                  title: "Applying to non-indeterminate forms like 0/∞ or ∞/0",
                  wrong: '\\lim_{x\\to 0^+}\\frac{x}{\\ln x}\\text{ is } \\frac{0}{-\\infty}\\text{ — applying L\'Hôpital here is WRONG}',
                  right: '\\frac{0}{-\\infty}\\text{ is NOT indeterminate — the limit is simply }0',
                  note: "0/∞ = 0 directly. The rule only applies to 0/0 and ∞/∞. A finite number divided by something infinite is 0 by inspection.",
                },
                {
                    n:'Mistake 3', col:'#d4a017',
                    title: "Applying L'Hôpital when the form is NOT indeterminate",
                    wrong: '\\lim_{x\\to 0}\\frac{x^2+1}{x}\\xrightarrow{\\text{student applies L\'H}}\\lim_{x\\to 0}\\frac{2x}{1}=0 \\quad\\text{(wrong answer!)}',
                    right: '\\text{Numerator} \\to 1,\\text{ denominator} \\to 0 \\Rightarrow \\text{form is }\\frac{1}{0},\\text{ NOT }\\frac{0}{0}.\\text{ Limit is }\\infty.',
                    note: "The denominator x → 0 looks alarming, so the student jumps straight to L'Hôpital. But the numerator x²+1 → 1, not 0. The form is 1/0 — not indeterminate at all. The limit is simply ∞. L'Hôpital gave the wrong answer 0 here, which is a serious error. Always check BOTH numerator and denominator separately before applying the rule.",
                },
                {
                  n:'Mistake 4', col:'#27ae60',
                  title: "Stopping too early — not re-checking after each application",
                  wrong: '\\lim_{x\\to\\infty}\\frac{x^2}{e^x}\\xrightarrow{L\'H}\\lim\\frac{2x}{e^x}\\xrightarrow{\\text{stop?}}\\text{ still }\\frac{\\infty}{\\infty}!',
                  right: '\\text{After each application, check the form again. Apply again if still indeterminate.}',
                  note: "After one application, re-evaluate. If the result is still 0/0 or ∞/∞, apply again. Only stop when the form is determinate.",
                },
              ].map(m=>(
                <div key={m.n} style={{...S.card,borderLeft:`4px solid ${m.col}`,marginBottom:'20px'}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:m.col,marginBottom:'6px'}}>{m.n}</div>
                  <h4 style={{...S.h4red,color:m.col,marginBottom:'12px'}}>{m.title}</h4>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                    <div style={{background:'#fff5f5',border:'1px solid #c0392b',borderRadius:'7px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.58rem',color:'#c0392b',textTransform:'uppercase',marginBottom:'4px'}}>✗ Wrong</div>
                      <span style={{fontSize:'.9rem'}}>{`$${m.wrong}$`}</span>
                    </div>
                    <div style={{background:'#f0faf4',border:'1px solid #27ae60',borderRadius:'7px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.58rem',color:'#27ae60',textTransform:'uppercase',marginBottom:'4px'}}>✓ Correct</div>
                      <span style={{fontSize:'.9rem'}}>{`$${m.right}$`}</span>
                    </div>
                  </div>
                  <div style={S.calloutTeal}><p style={{...S.p,marginBottom:0}}>{m.note}</p></div>
                </div>
              ))}

              {/* Don't apply blindly example */}
              <div style={S.warnBox}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#c0392b',marginBottom:'8px'}}>⚠ Don't Apply L'Hôpital Blindly</div>
                <p style={S.p}>Consider {'$\\lim_{x\\to 0}\\frac{x^2\\sin(1/x)}{x}$'}. Direct simplification gives {'$\\lim_{x\\to 0} x\\sin(1/x) = 0$'} by the squeeze theorem (since {'$|\\sin(1/x)|\\leq 1$'}). If you blindly applied L'Hôpital to {'$\\frac{x^2\\sin(1/x)}{x}$'}, the derivative of the numerator involves {'$\\cos(1/x)\\cdot(-1/x^2)$'} which oscillates and has no limit. L'Hôpital would fail here — but the limit exists and equals 0. Always look for simpler approaches first.</p>
              </div>
            </section>

            {/* ── ALGEBRA + L'HOPITAL ── */}
            <section id="algebra" className="lec-sec">
              <div style={S.secLabel}>§ 7 Beyond 0/0 and ∞/∞</div>
              <h2 style={S.h2}>Other Indeterminate Forms:<br/>Algebra First, Then L'Hôpital</h2>

              <p style={S.p}>L'Hôpital's rule directly handles only {'$\\frac{0}{0}$'} and {'$\\frac{\\infty}{\\infty}$'}. But other indeterminate forms, {'$0\\cdot\\infty$'}, {'$\\infty - \\infty$'}, {'$0^0$'}, {'$1^\\infty$'}, {'$\\infty^0$'},  can often be transformed algebraically into one of these two cases first.</p>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 8: {'$0\\cdot\\infty$'} form: {'$\\displaystyle\\lim_{x\\to\\infty} e^{-x}\\ln x$'}</h4>
                <p style={S.p}>As {'$x\\to\\infty$'}: {'$e^{-x}\\to 0$'} and {'$\\ln x\\to\\infty$'} — this is a {'$0\\cdot\\infty$'} form. L'Hôpital doesn't apply directly.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Algebraic trick:</strong> Rewrite as a fraction.</p>
                  <p style={{textAlign:'center'}}>{'$$e^{-x}\\ln x = \\frac{\\ln x}{e^x}$$'}</p>
                  <p style={S.p}>Now it's {'$\\frac{\\infty}{\\infty}$'} ✓. Apply L'Hôpital:</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to\\infty}\\frac{\\ln x}{e^x} = \\lim_{x\\to\\infty}\\frac{1/x}{e^x} = \\lim_{x\\to\\infty}\\frac{1}{xe^x} = \\boxed{0}$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>Exponential decay beats logarithmic growth — the limit is 0.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 9: {'$1^\\infty$'} form: {'$\\displaystyle\\lim_{x\\to\\infty}\\left(1+\\dfrac{1}{x}\\right)^x = e$'}</h4>
                <p style={S.p}>One of the most famous limits in mathematics. The form is {'$1^\\infty$'} — indeterminate.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Strategy:</strong> Take the natural log to bring the exponent down.</p>
                  <p style={S.p}>Let {'$L = \\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x$'}. Then {'$\\ln L = \\lim_{x\\to\\infty} x\\ln\\left(1+\\frac{1}{x}\\right)$'}. This is {'$\\infty\\cdot 0$'} — rewrite:</p>
                  <p style={{textAlign:'center'}}>{'$$\\ln L = \\lim_{x\\to\\infty}\\frac{\\ln(1+1/x)}{1/x}$$'}</p>
                  <p style={S.p}>Now {'$\\frac{0}{0}$'} form. Let {'$u=1/x\\to 0$'}:</p>
                  <p style={{textAlign:'center'}}>{'$$= \\lim_{u\\to 0}\\frac{\\ln(1+u)}{u} \\xrightarrow{L\'H} \\lim_{u\\to 0}\\frac{1/(1+u)}{1} = 1$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\ln L = 1 \\Rightarrow \\boxed{L = e}$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>This is the definition of the number {'$e$'} — and L'Hôpital proves it rigorously.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 10: {'$0^0$'} form: {'$\\displaystyle\\lim_{x\\to 0^+} x^x$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$0^0$'} is indeterminate. Take log: {'$\\ln(x^x) = x\\ln x$'}. This is {'$0\\cdot(-\\infty)$'} — rewrite:</p>
                  <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 0^+} x\\ln x = \\lim_{x\\to 0^+}\\frac{\\ln x}{1/x} \\xrightarrow{L\'H} \\lim_{x\\to 0^+}\\frac{1/x}{-1/x^2} = \\lim_{x\\to 0^+}(-x) = 0$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\ln L = 0 \\Rightarrow \\boxed{L = e^0 = 1}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* ∞ - ∞ form */}
                <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>Example 11: {'$\\infty - \\infty$'} form: {'$\\displaystyle\\lim_{x\\to 1^+}\\left(\\dfrac{1}{\\ln x} - \\dfrac{1}{x-1}\\right)$'}</h4>
                <p style={S.p}>As {'$x\\to 1^+$'}: both {'$\\frac{1}{\\ln x}\\to\\infty$'} and {'$\\frac{1}{x-1}\\to\\infty$'} — this is {'$\\infty - \\infty$'}, indeterminate. L'Hôpital does not apply directly.</p>
                <ToggleAnswer label="Show Solution">
                    <p style={S.p}><strong>Algebraic trick:</strong> Combine into a single fraction over a common denominator.</p>
                    <p style={{textAlign:'center'}}>{'$$\\frac{1}{\\ln x} - \\frac{1}{x-1} = \\frac{(x-1) - \\ln x}{(x-1)\\ln x}$$'}</p>
                    <p style={S.p}>Now check the form as {'$x\\to 1^+$'}: numerator {'$(x-1)-\\ln x \\to 0-0=0$'}, denominator {'$(x-1)\\ln x \\to 0\\cdot 0=0$'}. Form is {'$\\frac{0}{0}$'} ✓. Apply L'Hôpital:</p>
                    <p style={S.p}><strong>Differentiate numerator:</strong> {'$\\dfrac{d}{dx}[(x-1)-\\ln x] = 1 - \\dfrac{1}{x}$'}</p>
                    <p style={S.p}><strong>Differentiate denominator</strong> (product rule): {'$\\dfrac{d}{dx}[(x-1)\\ln x] = \\ln x + \\dfrac{x-1}{x}$'}</p>
                    <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 1^+}\\frac{1-\\frac{1}{x}}{\\ln x + \\frac{x-1}{x}} \\quad\\text{still }\\frac{0}{0}\\text{ — apply again}$$'}</p>
                    <p style={S.p}><strong>Round 2 — differentiate again:</strong></p>
                    <p style={S.p}>Numerator: {'$\\dfrac{d}{dx}\\left[1-\\dfrac{1}{x}\\right] = \\dfrac{1}{x^2}$'}</p>
                    <p style={S.p}>Denominator: {'$\\dfrac{d}{dx}\\left[\\ln x + \\dfrac{x-1}{x}\\right] = \\dfrac{1}{x} + \\dfrac{1}{x^2}$'}</p>
                    <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to 1^+}\\frac{1/x^2}{1/x + 1/x^2} = \\frac{1}{1+1} = \\boxed{\\frac{1}{2}}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>The strategy for {'$\\infty-\\infty$'}: <strong>always combine into a single fraction first</strong>, then re-check the form.</p>
                </ToggleAnswer>
                </div>

                {/* ∞^0 form */}
                <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 12: {'$\\infty^0$'} form: {'$\\displaystyle\\lim_{x\\to\\infty} x^{1/x}$'}</h4>
                <p style={S.p}>As {'$x\\to\\infty$'}: {'$x\\to\\infty$'} and {'$\\frac{1}{x}\\to 0$'} — this is {'$\\infty^0$'}, indeterminate. The same logarithm strategy used for {'$1^\\infty$'} and {'$0^0$'} works here.</p>
                <ToggleAnswer label="Show Solution">
                    <p style={S.p}><strong>Strategy:</strong> Let {'$L = \\lim_{x\\to\\infty} x^{1/x}$'}. Take the natural log:</p>
                    <p style={{textAlign:'center'}}>{'$$\\ln L = \\lim_{x\\to\\infty}\\frac{1}{x}\\ln x = \\lim_{x\\to\\infty}\\frac{\\ln x}{x}$$'}</p>
                    <p style={S.p}>This is {'$\\frac{\\infty}{\\infty}$'} ✓. Apply L'Hôpital:</p>
                    <p style={{textAlign:'center'}}>{'$$\\lim_{x\\to\\infty}\\frac{\\ln x}{x} \\xrightarrow{L\'H} \\lim_{x\\to\\infty}\\frac{1/x}{1} = \\lim_{x\\to\\infty}\\frac{1}{x} = 0$$'}</p>
                    <p style={{textAlign:'center'}}>{'$$\\ln L = 0 \\Rightarrow \\boxed{L = e^0 = 1}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>Despite {'$x$'} growing without bound, the exponent {'$\\frac{1}{x}$'} shrinks fast enough to pull the whole expression to 1.</p>
                </ToggleAnswer>
                </div>
            </section>

            {/* ── PRACTICE ── */}
            <section id="practice" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Practice Problems</div>
              <h2 style={S.h2}>Consolidation:<br/>Mixed Practice</h2>

              {[
                { n:'P1', col:'#c0392b', h4:S.h4red, q:'$\\displaystyle\\lim_{x\\to 0}\\dfrac{\\ln(1+x)}{x}$', hint:'Form 0/0. One application.', sol:'$f\'=\\frac{1}{1+x}$, $g\'=1$. Limit $= \\frac{1}{1} = \\boxed{1}$' },
                { n:'P2', col:'#d4a017', h4:S.h4gold, q:'$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x^2+3x}{e^{2x}}$', hint:'Form ∞/∞. Apply twice.', sol:'Round 1: $\\frac{2x+3}{2e^{2x}}$ still $\\frac{\\infty}{\\infty}$. Round 2: $\\frac{2}{4e^{2x}}\\to \\boxed{0}$' },
                { n:'P3', col:'#1a6b6b', h4:S.h4teal, q:'$\\displaystyle\\lim_{x\\to 1}\\dfrac{x^4-1}{x^3-1}$', hint:'Form 0/0. One application.', sol:'$f\'=4x^3$, $g\'=3x^2$. Limit $=\\frac{4}{3} = \\boxed{\\frac{4}{3}}$' },
                { n:'P4', col:'#2980b9', h4:S.h4blue, q:'$\\displaystyle\\lim_{x\\to 0^+}x^2\\ln x$', hint:'Form 0·(−∞). Rewrite as fraction first.', sol:'Rewrite: $\\frac{\\ln x}{1/x^2}$. Form $\\frac{-\\infty}{\\infty}$. L\'H: $\\frac{1/x}{-2/x^3}=\\frac{-x^2}{2}\\to \\boxed{0}$' },
                { n:'P5', col:'#27ae60', h4:S.h4green, q:'$\\displaystyle\\lim_{x\\to\\infty}\\dfrac{(\\ln x)^2}{x}$', hint:'Form ∞/∞. May need two applications.', sol:'Round 1: $\\frac{2\\ln x / x}{1}=\\frac{2\\ln x}{x}$ still $\\frac{\\infty}{\\infty}$. Round 2: $\\frac{2/x}{1}\\to \\boxed{0}$' },
              ].map(p=>(
                <div key={p.n} style={{...S.card,borderLeft:`4px solid ${p.col}`,marginBottom:'16px'}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',color:p.col,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'6px'}}>{p.n}</div>
                  <h4 style={{...p.h4,marginBottom:'8px'}}>Evaluate {p.q}</h4>
                  <p style={{...S.p,marginBottom:'10px',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.78rem',color:'#7f8c8d'}}>Hint: {p.hint}</p>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:p.col,color:'#fff'}}>
                    <p style={{...S.p,marginBottom:0}}>{p.sol}</p>
                  </ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}>
                <strong style={{color:'#1a6b6b'}}>Key takeaways from this section:</strong> L'Hôpital's rule applies only to {'$\\frac{0}{0}$'} and {'$\\frac{\\infty}{\\infty}$'} forms. Always check the form first. Differentiate numerator and denominator separately — never use the quotient rule. Other indeterminate forms require algebraic manipulation to reduce them to one of these two cases before L'Hôpital applies.
              </div>
            </section>

          </div>

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s61" style={S.lnfBtnPrev}>← §6.1 Integration by Parts</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§A.3 · Appendix · Calculus I</div>
            <Link href="/courses/calc1" style={S.lnfBtnNext}>Course Overview →</Link>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}