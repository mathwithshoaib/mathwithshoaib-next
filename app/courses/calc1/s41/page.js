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
  cmain: { flex:1, minWidth:0, background:'#fdf8f0', overflow:'hidden', fontFamily:"'Source Sans 3', sans-serif", fontSize:'1.05rem', lineHeight:1.8, color:'#1a1a2e' },
  lecInner: { maxWidth:'100%', margin:'0 auto', padding:'0 52px 60px' },
  lecHero: { background:'#1a1a2e', color:'#fdf8f0', padding:'52px 40px 44px', textAlign:'center', position:'relative', overflow:'hidden' },
  card: { background:'#fff', border:'1px solid #e0d6c8', borderRadius:'12px', padding:'28px 32px', boxShadow:'0 4px 24px rgba(26,26,46,.08)', marginBottom:'24px' },
  cardAl: { borderLeft:'4px solid #c0392b' },
  cardGl: { borderLeft:'4px solid #d4a017' },
  cardTl: { borderLeft:'4px solid #1a6b6b' },
  cardSl: { borderLeft:'4px solid #2980b9' },
  cardPl: { borderLeft:'4px solid #27ae60' },
  defBox: { background:'#eef7f7', border:'1.5px solid #1a6b6b', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  thmBox: { background:'#fff8ec', border:'1.5px solid #d4a017', borderRadius:'8px', padding:'22px 26px', margin:'22px 0' },
  noteBox: { background:'#f0f4ff', border:'1.5px solid #2980b9', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  warnBox: { background:'#fff5f5', border:'1.5px solid #c0392b', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  greenBox: { background:'#f0faf4', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'20px 24px', margin:'20px 0' },
  calloutTeal:  { background:'#eef7f7', borderLeft:'4px solid #1a6b6b', borderRadius:'0 8px 8px 0', padding:'14px 20px', margin:'18px 0' },
  calloutGold:  { background:'#fff8ec', borderLeft:'4px solid #d4a017', borderRadius:'0 8px 8px 0', padding:'14px 20px', margin:'18px 0' },
  calloutRed:   { background:'#fdf0ef', borderLeft:'4px solid #c0392b', borderRadius:'0 8px 8px 0', padding:'14px 20px', margin:'18px 0' },
  calloutGreen: { background:'#f0faf4', borderLeft:'4px solid #27ae60', borderRadius:'0 8px 8px 0', padding:'14px 20px', margin:'18px 0' },
  calloutBlue:  { background:'#f0f4ff', borderLeft:'4px solid #2980b9', borderRadius:'0 8px 8px 0', padding:'14px 20px', margin:'18px 0' },
  toggleBtn: { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.76rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a1a2e', color:'#d4a017', border:'none', borderRadius:'6px', padding:'9px 20px', cursor:'pointer', marginTop:'10px' },
  toggleBtnTeal: { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a6b6b', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer', marginTop:'8px' },
  toggleBtnBlue: { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#2980b9', color:'#fff', border:'none', borderRadius:'6px', padding:'7px 16px', cursor:'pointer', marginTop:'8px' },
  answerBox: { background:'#f0f9f0', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'18px 22px', marginTop:'12px' },
  revealBox: { background:'#eef7f7', border:'1.5px solid #1a6b6b', borderRadius:'8px', padding:'18px 22px', marginTop:'12px' },
  secLabel: { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.26em', textTransform:'uppercase', color:'#c0392b', marginBottom:'8px' },
  divider: { width:'100%', height:'1px', background:'#e0d6c8', margin:'52px 0' },
  h2: { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.7rem,4vw,2.55rem)', fontWeight:700, marginBottom:'20px', lineHeight:1.2, color:'#1a1a2e' },
  h3teal: { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.32rem', fontWeight:700, margin:'30px 0 12px', color:'#1a6b6b' },
  h4red:   { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#c0392b' },
  h4gold:  { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#d4a017' },
  h4teal:  { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#1a6b6b' },
  h4blue:  { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#2980b9' },
  h4green: { fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.1rem', fontWeight:700, margin:'0 0 8px', color:'#27ae60' },
  p: { marginBottom:'16px', color:'#1a1a2e' },
  lecFooterNav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'28px 40px', borderTop:'1px solid #e0d6c8', flexWrap:'wrap', gap:'12px', background:'#fdf8f0' },
  lnfBtnPrev: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#2980b9', border:'1px solid #2980b9', background:'#f0f4ff', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
  lnfBtnNext: { display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#1a6b6b', border:'1px solid #1a6b6b', background:'#eef7f7', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' },
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
    { label:'4.1 · Exponential Functions',          href:'/courses/calc1/s41', active:true, live:true },
    { label:'4.2 · Logarithmic Functions',          href:'/courses/calc1/s42', live:true },
    { label:'4.3 · Differentiation of Exp & Log',   href:'/courses/calc1/s43', live:true },
    { label:'4.4 · Exponential Models',             soon:true },
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
  { ch:'Appendix — Additional Topics', items:[
    { label:"A.3 · L'Hôpital's Rule", href:'/courses/calc1/a3', live:true },
  ]},
];

// ─── ToggleAnswer ──────────────────────────────────────────────────────────
function ToggleAnswer({ label='Show Solution', children, btnStyle, boxStyle }) {
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
      <div ref={ref} style={{ ...(boxStyle || S.answerBox), display:'none' }}>{children}</div>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ open, setOpen }) {
  return (
    <aside style={S.csb} className="csb-hide">
      <div style={S.csbHead}>
        <div style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'4px' }}>MATH-101 · Calculus I</div>
        <div style={{ fontFamily:'var(--fh)', fontSize:'.95rem', color:'var(--text)', lineHeight:1.3 }}>Course Contents</div>
        <Link href="/courses/calc1" style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'var(--fm)', fontSize:'.68rem', color:'var(--text3)', marginTop:'8px', textDecoration:'none' }}>← All Courses</Link>
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

// ─── Interactive Exponential Graph Widget ─────────────────────────────────
function ExpGraphWidget() {
  const canvasRef = useRef(null);
  const [base, setBase] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 300;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { l:52, r:20, t:20, b:36 };
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
    const xMin = -4, xMax = 4, yMin = 0, yMax = 10;

    const tX = x => pad.l + ((x - xMin) / (xMax - xMin)) * gW;
    const tY = y => pad.t + gH - ((y - yMin) / (yMax - yMin)) * gH;

    ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#e8e0d4'; ctx.lineWidth = 1;
    for (let x = xMin; x <= xMax; x++) {
      ctx.beginPath(); ctx.moveTo(tX(x), pad.t); ctx.lineTo(tX(x), pad.t + gH); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(x, tX(x), pad.t + gH + 16);
    }
    for (let y = 0; y <= yMax; y += 2) {
      ctx.beginPath(); ctx.moveTo(pad.l, tY(y)); ctx.lineTo(pad.l + gW, tY(y)); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px IBM Plex Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText(y, pad.l - 5, tY(y) + 3);
    }

    // Axes
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l - 4, pad.t + gH); ctx.lineTo(pad.l + gW + 6, pad.t + gH); ctx.stroke();

    // Arrowheads
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.moveTo(pad.l + gW + 6, pad.t + gH); ctx.lineTo(pad.l + gW, pad.t + gH - 5); ctx.lineTo(pad.l + gW, pad.t + gH + 5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l - 5, pad.t + 7); ctx.lineTo(pad.l + 5, pad.t + 7); ctx.closePath(); ctx.fill();

    // Plot f(x) = base^x
    const col = base < 1 ? '#c0392b' : base === 1 ? '#7f8c8d' : '#1a6b6b';
    ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 2.5;
    let started = false;
    for (let px = 0; px <= gW; px++) {
      const x = xMin + (px / gW) * (xMax - xMin);
      const y = Math.pow(base, x);
      if (y < yMin - 0.5 || y > yMax + 0.5) { started = false; continue; }
      if (!started) { ctx.moveTo(tX(x), tY(Math.max(yMin, Math.min(yMax, y)))); started = true; }
      else ctx.lineTo(tX(x), tY(Math.max(yMin, Math.min(yMax, y))));
    }
    ctx.stroke();

    // y = 1 dotted reference
    ctx.setLineDash([4, 4]); ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(pad.l, tY(1)); ctx.lineTo(pad.l + gW, tY(1)); ctx.stroke();
    ctx.setLineDash([]);

    // Point (0,1) always
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(tX(0), tY(1), 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 11px IBM Plex Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText('(0, 1)', tX(0) + 7, tY(1) - 5);

    // Label
    ctx.fillStyle = col; ctx.font = 'bold 12px serif'; ctx.textAlign = 'left';
    const labelX = base >= 1 ? tX(2.5) : tX(-2.5);
    const labelY = base >= 1 ? tY(Math.min(yMax - 0.5, Math.pow(base, 2.5))) : tY(Math.min(yMax - 0.5, Math.pow(base, -2.5)));
    ctx.fillText(`f(x) = ${base}ˣ`, labelX - (base < 1 ? 60 : 0), labelY - 8);

    // Axis labels
    ctx.fillStyle = '#555'; ctx.font = '11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('x', pad.l + gW / 2, H - 1);
    ctx.save(); ctx.translate(12, pad.t + gH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('y', 0, 0); ctx.restore();

  }, [base]);

  useEffect(() => {
    const h = () => { if (canvasRef.current) { const c = canvasRef.current; c.width = 0; } };
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);

  const isDecreasing = base > 0 && base < 1;
  const isIncreasing = base > 1;

  return (
    <div style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>
        📈 Exponential Graph Explorer — f(x) = bˣ
      </div>

      {/* Slider */}
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#e8e2d8', marginBottom:'6px' }}>
          Base: <span style={{ color:'#d4a017', fontWeight:700, fontSize:'.85rem' }}>b = {base}</span>
          <span style={{ marginLeft:'12px', fontSize:'.62rem', color: isDecreasing ? '#ef4444' : isIncreasing ? '#38c9b0' : '#9ca3af' }}>
            {isDecreasing ? '↘ decreasing (0 < b < 1)' : isIncreasing ? '↗ increasing (b > 1)' : '— constant (b = 1)'}
          </span>
        </div>
        <input type="range" min="0.1" max="9" step="0.1" value={base}
          onInput={e => setBase(Number(e.target.value))}
          style={{ width:'100%', WebkitAppearance:'none', height:'4px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#6b7280', marginTop:'3px' }}>
          <span>b = 0.1</span><span style={{ color:'#ef4444' }}>← decreasing</span>
          <span style={{ color:'#d4a017' }}>b = 1</span>
          <span style={{ color:'#38c9b0' }}>increasing →</span><span>b = 9</span>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'300px', borderRadius:'8px' }}/>

      {/* Key facts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginTop:'12px' }}>
        {[
          ['Domain', 'All real numbers (−∞, ∞)', '#60a5fa'],
          ['Range', '(0, ∞) — always positive', '#38c9b0'],
          ['y-intercept', 'Always (0, 1) — any base', '#d4a017'],
        ].map(([lbl, val, col]) => (
          <div key={lbl} style={{ background:'rgba(255,255,255,.06)', borderRadius:'6px', padding:'8px 12px' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:col, textTransform:'uppercase', marginBottom:'2px' }}>{lbl}</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.66rem', color:'#e2e8f0' }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:'10px', background:'rgba(255,255,255,.05)', borderRadius:'6px', padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#94a3b8', lineHeight:1.6 }}>
        💡 <strong style={{ color:'#e2e8f0' }}>Watch as you slide:</strong> When b crosses 1, the graph flips from decreasing to increasing. At b = 1 the graph is the horizontal line y = 1. The y-intercept is always (0, 1) regardless of b.
      </div>
    </div>
  );
}

// ─── Compounding Widget ────────────────────────────────────────────────────
function CompoundingWidget() {
  const canvasRef = useRef(null);
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [mode, setMode] = useState('compare'); // 'compare' | 'continuous'

  const r = rate / 100;
  const fvContinuous = principal * Math.exp(r * years);
  const fvAnnual = principal * Math.pow(1 + r, years);
  const fvMonthly = principal * Math.pow(1 + r / 12, 12 * years);
  const fvDaily = principal * Math.pow(1 + r / 365, 365 * years);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 220;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { l:68, r:20, t:16, b:36 };
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
    const maxY = fvContinuous * 1.1;

    const tX = t => pad.l + (t / years) * gW;
    const tY = v => pad.t + gH - (v / maxY) * gH;

    ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#ece6dc'; ctx.lineWidth = 1;
    for (let y = 0; y <= maxY; y += maxY / 4) {
      ctx.beginPath(); ctx.moveTo(pad.l, tY(y)); ctx.lineTo(pad.l + gW, tY(y)); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '9px IBM Plex Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText(y >= 1000 ? `${(y/1000).toFixed(0)}k` : y.toFixed(0), pad.l - 4, tY(y) + 3);
    }

    const lines = [
      { label:'Annual', col:'#2980b9', fn: t => principal * Math.pow(1 + r, t) },
      { label:'Monthly', col:'#27ae60', fn: t => principal * Math.pow(1 + r/12, 12*t) },
      { label:'Daily', col:'#d4a017', fn: t => principal * Math.pow(1 + r/365, 365*t) },
      { label:'Continuous', col:'#c0392b', fn: t => principal * Math.exp(r * t) },
    ];

    lines.forEach(({ col, fn }) => {
      ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 2;
      for (let px = 0; px <= gW; px++) {
        const t = (px / gW) * years;
        const v = fn(t);
        if (px === 0) ctx.moveTo(tX(t), tY(v)); else ctx.lineTo(tX(t), tY(v));
      }
      ctx.stroke();
    });

    // X ticks
    ctx.fillStyle = '#9ca3af'; ctx.font = '9px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    for (let t = 0; t <= years; t += Math.max(1, Math.floor(years / 5))) {
      ctx.fillText(`${t}yr`, tX(t), pad.t + gH + 16);
    }

    // Axes
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t + gH); ctx.lineTo(pad.l + gW + 4, pad.t + gH); ctx.stroke();

    ctx.fillStyle = '#555'; ctx.font = '10px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Years', pad.l + gW / 2, H - 1);

  }, [principal, rate, years]);

  const fmt = v => `PKR ${Math.round(v).toLocaleString()}`;
  const inp = { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', color:'#e8e2d8', marginBottom:'3px' };

  return (
    <div style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>
        💰 Compounding Explorer
      </div>

      {/* Controls */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px', marginBottom:'16px' }}>
        {[
          { lbl:'Principal', val:principal, min:100, max:1000000, step:100, set:setPrincipal, fmt:v=>`PKR ${v.toLocaleString()}` },
          { lbl:'Annual Rate', val:rate, min:1, max:25, step:0.5, set:setRate, fmt:v=>`${v}%` },
          { lbl:'Years', val:years, min:1, max:60, step:1, set:setYears, fmt:v=>`${v} yr` },
        ].map(({ lbl, val, min, max, step, set, fmt }) => (
          <div key={lbl}>
            <div style={inp}>{lbl}: <span style={{ color:'#d4a017', fontWeight:700 }}>{fmt(val)}</span></div>
            <input type="range" min={min} max={max} step={step} value={val}
              onInput={e => set(Number(e.target.value))}
              style={{ width:'100%', WebkitAppearance:'none', height:'3px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'220px', borderRadius:'8px', marginBottom:'12px' }}/>

      {/* Results */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px' }}>
        {[
          { lbl:'Annual', val:fvAnnual, col:'#2980b9' },
          { lbl:'Monthly', val:fvMonthly, col:'#27ae60' },
          { lbl:'Daily', val:fvDaily, col:'#d4a017' },
          { lbl:'Continuous', val:fvContinuous, col:'#ef4444' },
        ].map(({ lbl, val, col }) => (
          <div key={lbl} style={{ background:`${col}18`, border:`1px solid ${col}44`, borderRadius:'7px', padding:'8px 10px', textAlign:'center' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.56rem', color:col, textTransform:'uppercase', marginBottom:'3px' }}>{lbl}</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#e2e8f0', fontWeight:700 }}>
              PKR {Math.round(val).toLocaleString()}
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.54rem', color:'#64748b', marginTop:'2px' }}>
              +{Math.round((val/principal - 1) * 100)}%
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#64748b', textAlign:'center' }}>
        Continuous compounding always gives the highest return — the mathematical upper bound for any rate r.
      </div>
    </div>
  );
}

export default function Calc1S41() {
  const [sidebarOpen, setSidebarOpen] = useState({ 4: true });

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
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;background:#d4a017;border-radius:50%;cursor:pointer;}
        mjx-container{color:#1a1a2e!important;}
        mjx-container svg{color:#1a1a2e!important;}
        .lec-inner-m mjx-container{color:#1a1a2e!important;}
        @media(max-width:860px){.csb-hide{display:none!important;}.lec-inner-m{padding:0 18px 40px!important;}.lec-hero-m{padding:36px 20px 32px!important;}}
      `}</style>

      {/* SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§4.1 Exponential Functions</span>
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
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.025) 40px,rgba(255,255,255,.025) 41px)',pointerEvents:'none'}}/>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px', position:'relative' }}>Calculus I &nbsp;·&nbsp; Chapter 4 &nbsp;·&nbsp; Section 4.1</div>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:700, lineHeight:1.15, marginBottom:'10px', position:'relative' }}>
              Exponential Functions &amp;<br/>Continuous Compounding
            </h1>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.85rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#38c9b0', marginBottom:'18px', position:'relative' }}>
              The Mathematics of Growth
            </div>
            <p style={{ fontSize:'1rem', color:'#c9c2b8', maxWidth:'580px', margin:'0 auto 24px', position:'relative' }}>
              From a grain of rice on a chessboard to a bank account earning continuous interest — exponential functions are everywhere growth is unbounded.
            </p>
            <div style={{ width:'56px', height:'3px', background:'#d4a017', margin:'0 auto' }}/>
          </div>

          {/* SECTION NAV */}
          <nav style={{ background:'rgba(253,248,240,.97)', backdropFilter:'blur(8px)', borderBottom:'1px solid #e0d6c8', padding:'8px 20px', display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'center' }}>
            {[['#motivation','Motivation'],['#definition','Definition'],['#powers','Powers & Roots'],['#graphs','Graphs'],['#properties','Properties'],['#rules','Exp. Rules'],['#equations','Equations'],['#euler','The Number e'],['#compounding','Compounding'],['#present','Present Value'],['#effective','Effective Rate']].map(([href,lbl])=>(
              <a key={href} href={href} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#7f8c8d', textDecoration:'none', padding:'4px 11px', borderRadius:'20px', border:'1px solid #e0d6c8' }}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ── MOTIVATION ── */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>Why This Section Matters</div>
              <h2 style={S.h2}>The Most Powerful Pattern<br/>in All of Mathematics</h2>

              <div style={{...S.card,...S.cardGl, background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <h4 style={S.h4gold}>The Chess Legend</h4>
                <p style={S.p}>When the inventor of chess presented his game to the king of India, the king was so impressed he offered any reward. The inventor asked for something seemingly modest: one grain of rice on the first square, two on the second, four on the third, doubling each time across all 64 squares.</p>
                <p style={S.p}>The king laughed — then called his mathematicians. The total? {'$2^{64} - 1 \\approx 1.8 \\times 10^{19}$'} grains — more rice than has ever been produced in human history. The king had no choice but to hand over his kingdom.</p>
                <p style={{...S.p, marginBottom:0}}>This is exponential growth. Each step multiplies by the same factor. The result quickly dwarfs anything we can intuitively grasp.</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Folding Paper to the Moon</h4>
                <p style={S.p}>A standard sheet of paper is about 0.1 mm thick. If you could fold it in half 42 times, the stack would reach from the Earth to the Moon (384,400 km). If you fold it 103 times, it would reach the edge of the observable universe.</p>
                <p style={{...S.p, marginBottom:'12px'}}>This is because each fold doubles the thickness: after {'$n$'} folds, thickness {'$= 0.1 \\times 2^n$'} mm.</p>
                {false /* set to true when explore activity is live */ ? (
                <Link href="/explore#paper-folding" style={{ display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'#1a6b6b', color:'#fff', padding:'8px 18px', borderRadius:'8px', textDecoration:'none' }}>
                    🚀 Try the Paper Folding Activity →
                </Link>
                ) : (
                <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', background:'rgba(26,107,107,.25)', color:'rgba(255,255,255,.45)', padding:'8px 18px', borderRadius:'8px', border:'1px dashed rgba(26,107,107,.4)', cursor:'default' }}>
                    🚀 Try the Paper Folding Activity — Coming Soon
                </div>
                )}
              </div>

              <div style={S.calloutGold}>
                <strong>In this section:</strong> We make exponential growth precise, explore the special base {'$e$'}, and apply these ideas to the most important financial formula you will ever use — the continuous compounding formula {'$B = Pe^{rt}$'}.
              </div>
            </section>

            {/* ── DEFINITION ── */}
            <section id="definition" className="lec-sec">
              <div style={S.secLabel}>§ 1 — The Exponential Function</div>
              <h2 style={S.h2}>Defining Exponential<br/>Functions</h2>

              <p style={S.p}>You already know functions like {'$f(x) = x^2$'} or {'$g(x) = x^3$'}, where the variable is the base and the power is fixed. An <strong>exponential function</strong> reverses this: the base is a fixed positive constant, and the variable {'$x$'} is the exponent.</p>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Definition — Exponential Function</div>
                <p style={S.p}>An <strong>exponential function</strong> is a function of the form</p>
                <p style={{ textAlign:'center', fontSize:'1.25rem' }}>{'$$f(x) = b^x$$'}</p>
                <p style={S.p}>where {'$b$'} is a positive constant called the <strong>base</strong>, with {'$b > 0$'} and {'$b \\neq 1$'}, and {'$x$'} is any real number.</p>
                <p style={{...S.p, marginBottom:0, fontStyle:'italic', color:'#1a6b6b'}}>The domain is all real numbers {'$(-\\infty, \\infty)$'}. The range is {'$(0, \\infty)$'}.</p>
              </div>

              <h3 style={S.h3teal}>Why can't b be negative or equal to 1?</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'16px 0' }}>
                <div style={{...S.card,...S.cardAl, padding:'20px 22px'}}>
                  <h4 style={S.h4red}>If b = 1</h4>
                  <p style={S.p}>{'$f(x) = 1^x = 1$'} for every {'$x$'}. This is just the constant function {'$y=1$'}, a horizontal line. It has no interesting exponential behaviour and is trivially excluded.</p>
                </div>
                <div style={{...S.card,...S.cardAl, padding:'20px 22px'}}>
                  <h4 style={S.h4red}>If b {'<'} 0</h4>
                  <p style={S.p}>{'$(-2)^x$'} is undefined for irrational {'$x$'} like {'$x = \\sqrt{2}$'}. The function would not be defined on all of {'$\\mathbb{R}$'} and would not be continuous, useless for calculus.</p>
                </div>
              </div>

              <div style={S.calloutTeal}>
                <strong>Key distinction:</strong> In {'$f(x) = x^2$'}, the variable is the <em>base</em> and the exponent is fixed — this is a <em>power function</em>. In {'$f(x) = 2^x$'}, the variable is the <em>exponent</em> and the base is fixed — this is an <em>exponential function</em>. They behave completely differently.
              </div>
            </section>

            {/* ── POWERS ── */}
            <section id="powers" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Rational Powers and Negative Exponents</div>
              <h2 style={S.h2}>Making Sense of {'$b^x$'}<br/>for All Values of x</h2>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>Powers of b {'> 0'} — Three Cases</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px' }}>
                  {[
                    { title:'Zero Power', formula:'b^0 = 1', note:'Any positive base to the power zero is 1.', ex:'$5^0 = 1$, $\\;(0.3)^0 = 1$' },
                    { title:'Negative Power', formula:'b^{-n} = \\dfrac{1}{b^n}', note:'Negative exponent means reciprocal.', ex:'$2^{-3} = \\frac{1}{8}$, $\\;4^{-1/2} = \\frac{1}{2}$' },
                    { title:'Rational Power', formula:'b^{n/m} = (\\sqrt[m]{b})^n', note:'The denominator is the root, numerator is the power.', ex:'$8^{2/3} = (\\sqrt[3]{8})^2 = 4$' },
                  ].map(({ title, formula, note, ex }) => (
                    <div key={title} style={{ background:'#fff', borderRadius:'8px', padding:'14px 16px', border:'1px solid #e0d6c8' }}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.66rem', color:'#d4a017', fontWeight:700, marginBottom:'8px' }}>{title}</div>
                      <div style={{ textAlign:'center', fontSize:'1.05rem', marginBottom:'8px' }}>{`$$${formula}$$`}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.66rem', color:'#7f8c8d', marginBottom:'5px' }}>{note}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#1a6b6b' }}>{ex}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.calloutBlue}>
                <strong>Extending to irrational exponents:</strong> What does {'$2^{\\sqrt{2}}$'} mean? We approximate {'$\\sqrt{2} \\approx 1.41421...$'} and define {'$2^{\\sqrt{2}} = \\lim_{r\\to\\sqrt{2}} 2^r$'} where {'$r$'} takes rational values approaching {'$\\sqrt{2}$'}. This limit exists and equals approximately {'$2.665$'}. This is how exponential functions are extended to all real numbers.
              </div>
            </section>

            {/* ── GRAPHS ── */}
            <section id="graphs" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Graphing Exponential Functions</div>
              <h2 style={S.h2}>How the Graph Changes<br/>with the Base</h2>
              <p style={S.p}>The interactive explorer below lets you slide the base {'$b$'} and see the graph change in real time. Pay attention to what happens as {'$b$'} crosses 1.</p>
              <ExpGraphWidget/>

              <h3 style={S.h3teal}>Two Families of Exponential Graphs</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'16px 0' }}>
                <div style={{...S.card,...S.cardTl, padding:'20px 22px'}}>
                  <h4 style={S.h4teal}>b {'>'} 1:  Exponential Growth</h4>
                  <p style={S.p}>The function {'$f(x) = b^x$'} is <strong>increasing</strong>. As {'$x\\to\\infty$'}, {'$f(x)\\to\\infty$'}. As {'$x\\to-\\infty$'}, {'$f(x)\\to 0$'} (but never reaches 0). The x-axis is a horizontal asymptote on the left.</p>
                  <p style={{...S.p, marginBottom:0}}>Examples: {'$2^x,\\; 3^x,\\; 10^x,\\; e^x$'}</p>
                </div>
                <div style={{...S.card,...S.cardAl, padding:'20px 22px'}}>
                  <h4 style={S.h4red}>0 {'<'} b {'<'} 1: Exponential Decay</h4>
                  <p style={S.p}>The function {'$f(x) = b^x$'} is <strong>decreasing</strong>. As {'$x\\to\\infty$'}, {'$f(x)\\to 0$'}. As {'$x\\to-\\infty$'}, {'$f(x)\\to\\infty$'}. The x-axis is a horizontal asymptote on the right.</p>
                  <p style={{...S.p, marginBottom:0}}>Examples: {'$(1/2)^x,\\; (0.8)^x,\\; (1/3)^x$'}</p>
                </div>
              </div>

              <div style={S.calloutGold}>
                <strong>Note:</strong> {'$(1/2)^x = 2^{-x}$'}. Replacing {'$x$'} with {'$-x$'} reflects the graph across the y-axis. A decreasing exponential is simply a growing exponential reflected left-right.
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 1 — Sketch {'$f(x) = 3^x$'} and {'$g(x) = (1/3)^x$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Key values table:</strong></p>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ borderCollapse:'collapse', width:'100%', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.82rem' }}>
                      <thead>
                        <tr style={{ background:'#1a1a2e', color:'#d4a017' }}>
                          {['x','−2','−1','0','1','2','3'].map(h=><th key={h} style={{ padding:'7px 12px', textAlign:'center' }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ background:'#eef7f7' }}><td style={{ padding:'7px 12px', color:'#1a6b6b', fontWeight:700 }}>3ˣ</td>{['1/9','1/3','1','3','9','27'].map((v,i)=><td key={i} style={{ padding:'7px 12px', textAlign:'center' }}>{v}</td>)}</tr>
                        <tr><td style={{ padding:'7px 12px', color:'#c0392b', fontWeight:700 }}>(1/3)ˣ</td>{['9','3','1','1/3','1/9','1/27'].map((v,i)=><td key={i} style={{ padding:'7px 12px', textAlign:'center' }}>{v}</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                  <p style={{...S.p, marginTop:'12px', marginBottom:0}}>Both pass through {'$(0,1)$'}. They are reflections of each other across the y-axis since {'$(1/3)^x = 3^{-x}$'}. {'$3^x$'} grows steeply right; {'$(1/3)^x$'} decays to 0 right.</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── PROPERTIES ── */}
            <section id="properties" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Properties of Exponential Functions</div>
              <h2 style={S.h2}>Key Properties of {'$f(x) = b^x$'}</h2>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>Properties Table</div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ borderCollapse:'collapse', width:'100%', fontSize:'.93rem' }}>
                    <thead>
                      <tr style={{ background:'#1a1a2e' }}>
                        {['Property','b > 1 (Growth)','0 < b < 1 (Decay)'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.08em', color:'#d4a017' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Domain','$(-\\infty,\\infty)$','$(-\\infty,\\infty)$'],
                        ['Range','$(0,\\infty)$','$(0,\\infty)$'],
                        ['y-intercept','$(0,1)$','$(0,1)$'],
                        ['x-intercept','None','None'],
                        ['Behaviour','Increasing ↗','Decreasing ↘'],
                        ['As $x\\to +\\infty$','$f(x)\\to +\\infty$','$f(x)\\to 0$'],
                        ['As $x\\to -\\infty$','$f(x)\\to 0$','$f(x)\\to +\\infty$'],
                        ['Horizontal asymptote','$y=0$ (left side)','$y=0$ (right side)'],
                        ['One-to-one?','Yes','Yes'],
                      ].map(([prop,v1,v2],i)=>(
                        <tr key={prop} style={{ background: i%2===0?'#fdf8f0':'#fff' }}>
                          <td style={{ padding:'8px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.78rem', color:'#1a1a2e', fontWeight:600 }}>{prop}</td>
                          <td style={{ padding:'8px 14px', color:'#1a6b6b' }}>{v1}</td>
                          <td style={{ padding:'8px 14px', color:'#c0392b' }}>{v2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Using properties to solve {'$3^x = 3^{2x-1}$'}</h4>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>Since {'$f(x) = 3^x$'} is one-to-one, equal outputs mean equal inputs:</p>
                  <p style={{ textAlign:'center' }}>{'$$3^x = 3^{2x-1} \\Rightarrow x = 2x-1 \\Rightarrow \\boxed{x = 1}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── RULES ── */}
            <section id="rules" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Exponential Rules</div>
              <h2 style={S.h2}>The Laws of Exponents</h2>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'14px' }}>For {'$a, b > 0$'} and any real {'$x, y$'}:</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  {[
                    ['Product rule', 'b^x \\cdot b^y = b^{x+y}', '$2^3 \\cdot 2^5 = 2^8 = 256$'],
                    ['Quotient rule', '\\dfrac{b^x}{b^y} = b^{x-y}', '$\\frac{3^7}{3^4} = 3^3 = 27$'],
                    ['Power rule', '(b^x)^y = b^{xy}', '$(4^2)^3 = 4^6 = 4096$'],
                    ['Product of bases', '(ab)^x = a^x b^x', '$(2\\cdot 3)^4 = 2^4\\cdot 3^4 = 1296$'],
                    ['Quotient of bases', '\\left(\\dfrac{a}{b}\\right)^x = \\dfrac{a^x}{b^x}', '$\\left(\\frac{3}{2}\\right)^3 = \\frac{27}{8}$'],
                    ['Zero exponent', 'b^0 = 1', '$7^0 = 1,\\quad (\\pi)^0 = 1$'],
                    ['Equality rule', 'b^x = b^y \\Leftrightarrow x = y \\quad (b>0,\\, b\\neq 1)', '$3^{2x} = 3^5 \\Rightarrow 2x=5 \\Rightarrow x=\\frac{5}{2}$'],
                   ].map(([name, rule, ex]) => (
                    <div key={name} style={{ background:'#fff', borderRadius:'7px', padding:'12px 16px', border:'1px solid #e0d6c8' }}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#1a6b6b', textTransform:'uppercase', marginBottom:'5px' }}>{name}</div>
                      <div style={{ textAlign:'center', marginBottom:'6px' }}>{`$$${rule}$$`}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#7f8c8d' }}>{ex}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:'14px', background:'rgba(26,107,107,.08)', borderRadius:'6px', padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#1a6b6b', lineHeight:1.7 }}>
                    <strong>Why b ≠ 1?</strong> If {'$b=1$'}, then {'$1^x = 1^y = 1$'} for every {'$x$'} and {'$y$'} — equal outputs tell you nothing about the inputs. The equality rule works <em>only</em> because {'$f(x)=b^x$'} is <strong>one-to-one</strong> when {'$b\\neq 1$'}: different inputs always produce different outputs, so {'$b^x = b^y$'} can only happen when {'$x=y$'}.
                </div>
              </div>

              <div style={S.calloutRed}>
                <strong>Common Confusion — {'$b^x$'} vs {'$x^b$'}:</strong><br/>
                {'$f(x) = 2^x$'}: exponential — grows <em>explosively</em> as {'$x\\to\\infty$'}.<br/>
                {'$g(x) = x^2$'}: power function — grows <em>polynomially</em> as {'$x\\to\\infty$'}.<br/>
                For large {'$x$'}: {'$2^x \\gg x^2$'}. In fact {'$\\lim_{x\\to\\infty}\\frac{2^x}{x^{100}} = \\infty$'} — exponential always wins over any polynomial, no matter the degree.
              </div>
            </section>

            {/* ── EQUATIONS ── */}
            <section id="equations" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Solving Exponential Equations</div>
              <h2 style={S.h2}>Solving Equations<br/>Involving Exponents</h2>
              <p style={S.p}><strong>Strategy:</strong> If you can write both sides with the same base, set the exponents equal (using the one-to-one property). If you cannot, use logarithms (covered in §4.2).</p>

              {[
                { n:'Example 3', col:'#c0392b', h4:S.h4red, q:'Solve $2^{3x-1} = 16$', sol:<>
                  <p style={S.p}><strong>Write 16 as a power of 2:</strong> {'$16 = 2^4$'}</p>
                  <p style={{ textAlign:'center' }}>{'$$2^{3x-1} = 2^4 \\Rightarrow 3x-1=4 \\Rightarrow 3x=5 \\Rightarrow \\boxed{x=\\frac{5}{3}}$$'}</p>
                </>},
                { n:'Example 4', col:'#d4a017', h4:S.h4gold, q:'Solve $9^x = 27$', sol:<>
                  <p style={S.p}><strong>Write both as powers of 3:</strong> {'$9=3^2$, $27=3^3$'}</p>
                  <p style={{ textAlign:'center' }}>{'$$(3^2)^x = 3^3 \\Rightarrow 3^{2x}=3^3 \\Rightarrow 2x=3 \\Rightarrow \\boxed{x=\\frac{3}{2}}$$'}</p>
                </>},
                { n:'Example 5', col:'#1a6b6b', h4:S.h4teal, q:'Solve $4^x = 8^{x-1}$', sol:<>
                  <p style={S.p}><strong>Write both as powers of 2:</strong> {'$4=2^2$, $8=2^3$'}</p>
                  <p style={{ textAlign:'center' }}>{'$$2^{2x} = 2^{3(x-1)} \\Rightarrow 2x = 3x-3 \\Rightarrow \\boxed{x=3}$$'}</p>
                </>},
                { n:'Example 6', col:'#2980b9', h4:S.h4blue, q:'Solve $5^{2x} - 6\\cdot 5^x + 5 = 0$', sol:<>
                  <p style={S.p}><strong>Let {'$u = 5^x$'}:</strong> {'$u^2 - 6u + 5 = 0 \\Rightarrow (u-1)(u-5)=0$'}</p>
                  <p style={S.p}>{'$u=1 \\Rightarrow 5^x=1 \\Rightarrow x=0$'}</p>
                  <p style={S.p}>{'$u=5 \\Rightarrow 5^x=5 \\Rightarrow x=1$'}</p>
                  <p style={{...S.p, marginBottom:0}}>{'$\\boxed{x=0 \\text{ or } x=1}$'}</p>
                </>},
                { n:'Example 7', col:'#27ae60', h4:S.h4green, q:'Solve $e^{2x} - e^x - 6 = 0$', sol:<>
                  <p style={S.p}><strong>Let {'$u = e^x$'}:</strong> {'$u^2 - u - 6 = 0 \\Rightarrow (u-3)(u+2)=0$'}</p>
                  <p style={S.p}>{'$u=3 \\Rightarrow e^x=3 \\Rightarrow x=\\ln 3 \\approx 1.099$'} ✓</p>
                  <p style={{...S.p, marginBottom:0}}>{'$u=-2 \\Rightarrow e^x=-2$'} — impossible (exponential is always positive). {'$\\boxed{x = \\ln 3}$'}</p>
                </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, background:col}}>
                    {sol}
                  </ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── THE NUMBER e ── */}
            <section id="euler" className="lec-sec">
              <div style={S.secLabel}>§ 7 — The Natural Exponential Base</div>
              <h2 style={S.h2}>The Number e —<br/>Nature's Favourite Base</h2>

              <p style={S.p}>Among all possible bases for an exponential function, one is special: the irrational number {'$e \\approx 2.71828...$'} It arises naturally in calculus, finance, biology, and physics — anywhere continuous growth appears.</p>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'10px' }}>Definition of e via a Limit</div>
                <p style={{ textAlign:'center', fontSize:'1.2rem' }}>{'$$e = \\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n$$'}</p>
                <p style={{...S.p, marginBottom:0}}>As {'$n$'} grows, the expression approaches {'$e$'} from below — never quite reaching it, but getting arbitrarily close.</p>
              </div>

              {/* Approximation table */}
              <h3 style={S.h3teal}>Numerical Approximation</h3>
              <div style={{ overflowX:'auto', margin:'16px 0' }}>
                <table style={{ borderCollapse:'collapse', width:'100%', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.82rem' }}>
                  <thead>
                    <tr style={{ background:'#1a1a2e' }}>
                      <th style={{ padding:'8px 16px', color:'#d4a017', textAlign:'left', fontWeight:700 }}>n</th>
                      {['10','100','1,000','10,000','100,000','1,000,000'].map(v=><th key={v} style={{ padding:'8px 14px', color:'#d4a017', textAlign:'center' }}>{v}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding:'8px 16px', color:'#1a6b6b', fontWeight:700, background:'#f0faf4' }}>{'$(1+1/n)^n$'}</td>
                      {['2.59374','2.70481','2.71692','2.71815','2.71827','2.71828'].map((v,i)=>(
                        <td key={i} style={{ padding:'8px 14px', textAlign:'center', background: i===5?'rgba(26,107,107,.1)':'', color: i===5?'#1a6b6b':'#1a1a2e', fontWeight: i===5?700:400 }}>{v}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={S.calloutBlue}>
                <strong>See §A.3:</strong> We proved this limit equals {'$e$'} using L'Hôpital's rule — the {'$1^\\infty$'} indeterminate form. The key step was {'$\\ln L = \\lim_{x\\to\\infty} x\\ln(1+1/x) = 1$'}, giving {'$L=e$'}. <Link href="/courses/calc1/a3#algebra" style={{ color:'#2980b9' }}>Review that derivation →</Link>
              </div>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>The Natural Exponential Function</div>
                <p style={{ textAlign:'center', fontSize:'1.2rem' }}>{'$$f(x) = e^x$$'}</p>
                <p style={{...S.p, marginBottom:0}}>This is the exponential function. Its base {'$e \\approx 2.71828$'} is chosen precisely because {'$\\frac{d}{dx}[e^x] = e^x$'} — the only function that is its own derivative. We explore this in §4.3.</p>
              </div>
            </section>

            {/* ── COMPOUNDING ── */}
            <section id="compounding" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Continuous Compounding of Interest</div>
              <h2 style={S.h2}>Where Exponentials<br/>Meet Money</h2>

              <p style={S.p}>Suppose you invest a principal {'$P$'} at an annual interest rate {'$r$'} (as a decimal). How the interest is compounded — annually, monthly, daily, or continuously — determines how fast your money grows.</p>

              <ToggleAnswer label="Show Full Derivation of the Continuous Formula" btnStyle={S.toggleBtnBlue} boxStyle={S.revealBox}>
                <p style={S.p}><strong>Step 1 — Compounded {'$k$'} times per year:</strong> Each compounding period, the balance is multiplied by {'$(1 + r/k)$'}. After {'$T$'} years (which is {'$kT$'} periods):</p>
                <p style={{ textAlign:'center' }}>{'$$B = P\\left(1+\\frac{r}{k}\\right)^{kT}$$'}</p>
                <p style={S.p}><strong>Step 2 — What happens as {'$k\\to\\infty$'}?</strong> Let {'$n = k/r$'}, so {'$k = nr$'}:</p>
                <p style={{ textAlign:'center' }}>{'$$B = P\\left(1+\\frac{1}{n}\\right)^{nrT} = P\\left[\\left(1+\\frac{1}{n}\\right)^n\\right]^{rT}$$'}</p>
                <p style={S.p}><strong>Step 3 — Take the limit:</strong> As {'$k\\to\\infty$'}, {'$n\\to\\infty$'}, and we recognise the definition of {'$e$'}:</p>
                <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$B = P\\cdot e^{rT}$$'}</p>
                <p style={{...S.p, marginBottom:0}}>This is the <strong>continuous compounding formula</strong>. The number {'$e$'} enters finance because continuous compounding is the mathematical limit of compounding infinitely often. ∎</p>
              </ToggleAnswer>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'14px' }}>Future Value of an Investment</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div style={{ background:'#fff', borderRadius:'8px', padding:'16px 18px', border:'1px solid #e0d6c8' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#2980b9', textTransform:'uppercase', marginBottom:'6px' }}>Compounded k times/year</div>
                    <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$B = P\\left(1+\\frac{r}{k}\\right)^{kT}$$'}</p>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#7f8c8d', lineHeight:1.6 }}>
                      {'$P$'} = principal &nbsp;·&nbsp; {'$r$'} = annual rate<br/>
                      {'$k$'} = compounds/year &nbsp;·&nbsp; {'$T$'} = years
                    </div>
                  </div>
                  <div style={{ background:'#eef7f7', borderRadius:'8px', padding:'16px 18px', border:'1.5px solid #1a6b6b' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#1a6b6b', textTransform:'uppercase', marginBottom:'6px' }}>Continuous Compounding</div>
                    <p style={{ textAlign:'center', fontSize:'1.25rem' }}>{'$$B = Pe^{rT}$$'}</p>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#7f8c8d', lineHeight:1.6 }}>
                      {'$P$'} = principal &nbsp;·&nbsp; {'$r$'} = annual rate<br/>
                      {'$T$'} = years &nbsp;·&nbsp; {'$e \\approx 2.71828$'}
                    </div>
                  </div>
                </div>
              </div>

              <CompoundingWidget/>

              {/* Worked examples */}
              {[
                { n:'Example 8', col:'#c0392b', h4:S.h4red, title:'Comparing Compounding Frequencies',
                  q:'PKR 50,000 is invested at 6% annual interest. Find the future value after 5 years under: (a) annual, (b) monthly, (c) continuous compounding.',
                  sol:<>
                    <p style={S.p}><strong>(a) Annual (k=1):</strong> {'$B = 50{,}000(1.06)^5 = 50{,}000 \\times 1.33823 \\approx \\text{PKR }66{,}911$'}</p>
                    <p style={S.p}><strong>(b) Monthly (k=12):</strong> {'$B = 50{,}000(1+0.06/12)^{60} = 50{,}000(1.005)^{60} \\approx 50{,}000 \\times 1.34885 \\approx \\text{PKR }67{,}443$'}</p>
                    <p style={S.p}><strong>(c) Continuous:</strong> {'$B = 50{,}000 e^{0.06 \\times 5} = 50{,}000 e^{0.3} \\approx 50{,}000 \\times 1.34986 \\approx \\text{PKR }67{,}493$'}</p>
                    <p style={{...S.p, marginBottom:0}}>Continuous compounding gives the highest return, but the difference from monthly is only PKR 50 — the gain from compounding more frequently diminishes rapidly.</p>
                  </>
                },
                { n:'Example 9', col:'#d4a017', h4:S.h4gold, title:'Doubling Time',
                  q:'How long does it take for an investment to double at 8% continuous compounding?',
                  sol:<>
                    <p style={S.p}>We want {'$B = 2P$'}: {'$2P = Pe^{0.08T} \\Rightarrow 2 = e^{0.08T} \\Rightarrow \\ln 2 = 0.08T$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$T = \\frac{\\ln 2}{0.08} = \\frac{0.6931}{0.08} \\approx \\boxed{8.66 \\text{ years}}$$'}</p>
                    <p style={{...S.p, marginBottom:0}}><strong>Rule of 70:</strong> Dividing 70 by the percentage rate gives a quick approximation of doubling time. Here: {'$70/8 = 8.75$'} years ✓ (close to the exact answer).</p>
                  </>
                },
                { n:'Example 10', col:'#1a6b6b', h4:S.h4teal, title:'Growth of a Bank Account',
                  q:'A Lahore bank offers 9% compounded quarterly. If PKR 100,000 is deposited, what will the balance be after 3 years?',
                  sol:<>
                    <p style={S.p}>{'$k=4$'}, {'$r=0.09$'}, {'$T=3$'}, {'$P=100{,}000$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$B = 100{,}000\\left(1+\\frac{0.09}{4}\\right)^{12} = 100{,}000(1.0225)^{12} \\approx 100{,}000 \\times 1.30865 \\approx \\boxed{\\text{PKR }130{,}865}$$'}</p>
                  </>
                },
              ].map(({ n, col, h4, title, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:col, marginBottom:'4px' }}>{n}</div>
                  <h4 style={{ ...h4, marginBottom:'6px' }}>{title}</h4>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, background:col}}>
                    {sol}
                  </ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── PRESENT VALUE ── */}
            <section id="present" className="lec-sec">
              <div style={S.secLabel}>§ 9 — Present Value</div>
              <h2 style={S.h2}>How Much Is a<br/>Future Amount Worth Today?</h2>

              <p style={S.p}>Suppose you want to have PKR {'$B$'} in your account after {'$T$'} years. How much should you invest <em>today</em>? This is the <strong>present value</strong> — the current worth of a future amount, discounted at the prevailing interest rate.</p>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'14px' }}>Present Value of an Investment</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div style={{ background:'#fff', borderRadius:'8px', padding:'16px 18px', border:'1px solid #e0d6c8' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#2980b9', textTransform:'uppercase', marginBottom:'6px' }}>Compounded k times/year</div>
                    <p style={{ textAlign:'center', fontSize:'1.05rem' }}>{'$$P = B\\left(1+\\frac{r}{k}\\right)^{-kT}$$'}</p>
                  </div>
                  <div style={{ background:'#eef7f7', borderRadius:'8px', padding:'16px 18px', border:'1.5px solid #1a6b6b' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#1a6b6b', textTransform:'uppercase', marginBottom:'6px' }}>Continuous Compounding</div>
                    <p style={{ textAlign:'center', fontSize:'1.15rem' }}>{'$$P = Be^{-rT}$$'}</p>
                  </div>
                </div>
                <p style={{...S.p, marginBottom:0, marginTop:'12px', fontStyle:'italic', color:'#1a6b6b'}}>Present value is obtained by solving the future value formula for {'$P$'}. The factor {'$e^{-rT}$'} (or {'$(1+r/k)^{-kT}$'}) is called the <strong>discount factor</strong>.</p>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 11 — Planning a Future Expense</h4>
                <p style={S.p}>A LUMS student wants to have PKR 500,000 available in 4 years for graduate school. How much should they deposit today at 7% compounded continuously?</p>
                <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, background:'#2980b9'}}>
                  <p style={S.p}>{'$P = Be^{-rT} = 500{,}000 \\cdot e^{-0.07\\times 4} = 500{,}000 \\cdot e^{-0.28}$'}</p>
                  <p style={S.p}>{'$e^{-0.28} \\approx 0.7558$'}</p>
                  <p style={{ textAlign:'center' }}>{'$$P \\approx 500{,}000 \\times 0.7558 \\approx \\boxed{\\text{PKR }377{,}900}$$'}</p>
                  <p style={{...S.p, marginBottom:0}}>Depositing PKR 377,900 today at 7% continuously compounded will grow to PKR 500,000 in 4 years.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>Example 12 — Comparing Two Investment Offers</h4>
                <p style={S.p}>Investment A pays PKR 800,000 in 5 years. Investment B pays PKR 650,000 in 3 years. Which is worth more today if the rate is 6% compounded continuously?</p>
                <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, background:'#27ae60'}}>
                  <p style={S.p}><strong>PV of A:</strong> {'$P_A = 800{,}000\\cdot e^{-0.06\\times 5} = 800{,}000\\cdot e^{-0.3} \\approx 800{,}000 \\times 0.7408 \\approx \\text{PKR }592{,}640$'}</p>
                  <p style={S.p}><strong>PV of B:</strong> {'$P_B = 650{,}000\\cdot e^{-0.06\\times 3} = 650{,}000\\cdot e^{-0.18} \\approx 650{,}000 \\times 0.8353 \\approx \\text{PKR }542{,}945$'}</p>
                  <p style={{...S.p, marginBottom:0}}>{'$P_A > P_B$'}, so <strong>Investment A is worth more today</strong> despite being received later. Present value is the correct tool for comparing payments at different times.</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── EFFECTIVE RATE ── */}
            <section id="effective" className="lec-sec">
              <div style={S.secLabel}>§ 10 — Effective Interest Rate</div>
              <h2 style={S.h2}>Which Investment<br/>Actually Pays More?</h2>

              <p style={S.p}>When two investments quote different rates and different compounding frequencies, you cannot compare them directly. The <strong>effective annual interest rate</strong> {'$r_e$'} converts any investment to an equivalent annually compounded rate for fair comparison.</p>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'14px' }}>Effective Annual Rate</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div style={{ background:'#fff', borderRadius:'8px', padding:'16px 18px', border:'1px solid #e0d6c8' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#2980b9', textTransform:'uppercase', marginBottom:'6px' }}>Compounded k times/year</div>
                    <p style={{ textAlign:'center', fontSize:'1.05rem' }}>{'$$r_e = \\left(1+\\frac{r}{k}\\right)^k - 1$$'}</p>
                  </div>
                  <div style={{ background:'#eef7f7', borderRadius:'8px', padding:'16px 18px', border:'1.5px solid #1a6b6b' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#1a6b6b', textTransform:'uppercase', marginBottom:'6px' }}>Continuous Compounding</div>
                    <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$r_e = e^r - 1$$'}</p>
                  </div>
                </div>
                <p style={{...S.p, marginBottom:0, marginTop:'12px', fontStyle:'italic', color:'#1a6b6b'}}>The investment with the higher {'$r_e$'} is the better choice, regardless of how the nominal rates and frequencies differ.</p>
              </div>

              {[
                { n:'Example 13', col:'#c0392b', h4:S.h4red,
                  q:'Bank A offers 8% compounded quarterly. Bank B offers 7.9% compounded continuously. Which is better?',
                  sol:<>
                    <p style={S.p}><strong>Bank A:</strong> {'$r_e = (1+0.08/4)^4 - 1 = (1.02)^4 - 1 = 1.08243 - 1 = 8.243\\%$'}</p>
                    <p style={S.p}><strong>Bank B:</strong> {'$r_e = e^{0.079} - 1 \\approx 1.08218 - 1 = 8.218\\%$'}</p>
                    <p style={{...S.p, marginBottom:0}}><strong>Bank A is slightly better</strong> despite quoting a higher nominal rate and compounding only quarterly. The difference is small (0.025%) but Bank A wins.</p>
                  </>
                },
                { n:'Example 14', col:'#d4a017', h4:S.h4gold,
                  q:'An investment offers 12% compounded monthly. What is the effective annual rate?',
                  sol:<>
                    <p style={{ textAlign:'center' }}>{'$$r_e = \\left(1+\\frac{0.12}{12}\\right)^{12}-1 = (1.01)^{12}-1 \\approx 1.12683-1 = \\boxed{12.68\\%}$$'}</p>
                    <p style={{...S.p, marginBottom:0}}>The stated rate is 12% but the effective rate is 12.68% — the extra 0.68% comes from compounding interest on interest each month.</p>
                  </>
                },
                { n:'Example 15', col:'#1a6b6b', h4:S.h4teal,
                  q:'Three investment options: (A) 10% compounded annually, (B) 9.8% compounded monthly, (C) 9.7% compounded continuously. Rank them.',
                  sol:<>
                    <p style={S.p}><strong>A:</strong> {'$r_e = 10\\%$'} (annually compounded, so effective = nominal)</p>
                    <p style={S.p}><strong>B:</strong> {'$r_e = (1+0.098/12)^{12}-1 \\approx (1.00817)^{12}-1 \\approx 10.24\\%$'}</p>
                    <p style={S.p}><strong>C:</strong> {'$r_e = e^{0.097}-1 \\approx 1.1019-1 = 10.19\\%$'}</p>
                    <p style={{...S.p, marginBottom:0}}>Ranking: {'$\\text{B} > \\text{C} > \\text{A}$'}. Despite B having the lowest nominal rate, its monthly compounding makes it the best choice.</p>
                  </>
                },
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:col, marginBottom:'4px' }}>{n}</div>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, background:col}}>
                    {sol}
                  </ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}>
                <strong style={{ color:'#1a6b6b' }}>Coming up next —</strong> §4.2 Logarithmic Functions — we introduce {'$\\log_b x$'} as the inverse of {'$b^x$'}, learn the logarithm laws, and solve exponential equations that cannot be solved by matching bases.
              </div>
            </section>

          </div>

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1" style={S.lnfBtnPrev}>← Course Overview</Link>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#7f8c8d', textAlign:'center' }}>§4.1 · Chapter 4 · Calculus I</div>
            <Link href="/courses/calc1/s51" style={S.lnfBtnNext}>§5.1 Indefinite Integration →</Link>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}