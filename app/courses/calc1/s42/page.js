'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// ─── Styles (same as s41) ──────────────────────────────────────────────────
const S = {
  stickySubnav: { position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)' },
  bcRow: { padding:'8px 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', borderBottom:'1px solid var(--border)' },
  bcLink: { color:'var(--amber)', textDecoration:'none' },
  bcCur: { color:'var(--text2)', fontWeight:500 },
  courseSwitcher: { display:'flex', alignItems:'center', padding:'0 24px', overflowX:'auto' },
  cswLink: { fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--text3)', padding:'9px 18px', borderBottom:'2px solid transparent', whiteSpace:'nowrap', textDecoration:'none' },
  cswActive: { color:'var(--amber)', borderBottom:'2px solid var(--amber)' },
  courseFrame: { display:'flex', paddingTop:'calc(var(--nav-h) + 3px)', minHeight:'100vh' },
  csb: { width:'252px', flexShrink:0, position:'sticky', top:'calc(var(--nav-h) + 3px + 37px + 40px)', height:'calc(100vh - var(--nav-h) - 80px)', overflowY:'auto', background:'var(--bg2)', borderRight:'1px solid var(--border)' },
  csbHead: { padding:'18px 16px 12px', borderBottom:'1px solid var(--border)' },
  cmain: { flex:1, minWidth:0, background:'#fdf8f0', overflow:'hidden', fontFamily:"'Source Sans 3',sans-serif", fontSize:'1.05rem', lineHeight:1.8, color:'#1a1a2e' },
  lecInner: { maxWidth:'100%', margin:'0 auto', padding:'0 52px 60px' },
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
    { label:'1.1 · Functions', soon:true },{ label:'1.2 · The Graph of a Function', soon:true },
    { label:'1.3 · Lines and Linear Functions', soon:true },{ label:'1.4 · Functional Models', soon:true },
    { label:'1.5 · Limits', soon:true },{ label:'1.6 · One-Sided Limits and Continuity', soon:true },
  ]},
  { ch:'Ch 2 — Differentiation: Basic Concepts', items:[
    { label:'2.1 · The Derivative', soon:true },{ label:'2.2 · Techniques of Differentiation', soon:true },
    { label:'2.3 · Product and Quotient Rules', soon:true },{ label:'2.4 · The Chain Rule', soon:true },
    { label:'2.5 · Marginal Analysis', soon:true },{ label:'2.6 · Implicit Differentiation', soon:true },
  ]},
  { ch:'Ch 3 — Applications of the Derivative', items:[
    { label:'3.1 · Increasing & Decreasing Functions', soon:true },{ label:'3.2 · Concavity & Inflection Points', soon:true },
    { label:'3.3 · Curve Sketching', soon:true },{ label:'3.4 · Optimization; Elasticity', soon:true },
    { label:'3.5 · Additional Optimization', soon:true },
  ]},
  { ch:'Ch 4 — Exponential & Logarithmic Functions', items:[
    { label:'4.1 · Exponential Functions',          href:'/courses/calc1/s41', live:true },
    { label:'4.2 · Logarithmic Functions',          href:'/courses/calc1/s42', active:true, live:true },
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
    { label:'6.1 · Integration by Parts', href:'/courses/calc1/s61', live:true },
    { label:'6.2 · Numerical Integration', soon:true },
    { label:'6.3 · Improper Integrals',    soon:true },
    { label:'6.4 · Continuous Probability',soon:true },
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

// ─── Log + Exp Graph Widget ───────────────────────────────────────────────
function LogGraphWidget() {
  const canvasRef = useRef(null);
  const [base, setBase] = useState(2);
  const [showExp, setShowExp] = useState(true);
  const [showLog, setShowLog] = useState(true);
  const [showReflect, setShowReflect] = useState(true);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 340;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { l:52, r:24, t:20, b:36 };
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
    const xMin = -4, xMax = 6, yMin = -4, yMax = 6;
    const tX = x => pad.l + ((x-xMin)/(xMax-xMin))*gW;
    const tY = y => pad.t + gH - ((y-yMin)/(yMax-yMin))*gH;

    ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle = '#e8e0d4'; ctx.lineWidth = 1;
    for (let x=xMin; x<=xMax; x++) {
      ctx.beginPath(); ctx.moveTo(tX(x),pad.t); ctx.lineTo(tX(x),pad.t+gH); ctx.stroke();
      if (x!==0) { ctx.fillStyle='#9ca3af'; ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='center'; ctx.fillText(x,tX(x),pad.t+gH+14); }
    }
    for (let y=yMin; y<=yMax; y++) {
      ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke();
      if (y!==0) { ctx.fillStyle='#9ca3af'; ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='right'; ctx.fillText(y,pad.l-5,tY(y)+3); }
    }

    // y=x reflection line
    if (showReflect) {
      ctx.setLineDash([5,5]); ctx.strokeStyle='rgba(212,160,23,0.5)'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(tX(xMin),tY(xMin)); ctx.lineTo(tX(yMax),tY(yMax)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#d4a017'; ctx.font='italic 10px serif'; ctx.textAlign='left';
      ctx.fillText('y = x', tX(3)+4, tY(3)-5);
    }

    // b^x exponential
    if (showExp) {
      const col = '#1a6b6b';
      ctx.beginPath(); ctx.strokeStyle=col; ctx.lineWidth=2.4;
      let started=false;
      for (let px=0; px<=gW*2; px++) {
        const x = xMin + (px/(gW*2))*(xMax-xMin);
        const y = Math.pow(base,x);
        if (y<yMin-0.5||y>yMax+0.5) { started=false; continue; }
        const cy = Math.max(yMin,Math.min(yMax,y));
        if (!started) { ctx.moveTo(tX(x),tY(cy)); started=true; } else ctx.lineTo(tX(x),tY(cy));
      }
      ctx.stroke();
      ctx.fillStyle=col; ctx.font='bold 11px serif'; ctx.textAlign='left';
      ctx.fillText(`y = ${base}ˣ`, tX(2.2)+4, tY(Math.min(yMax-0.3,Math.pow(base,2.2)))-6);
    }

    // log_b(x)
    if (showLog) {
      const col = '#c0392b';
      ctx.beginPath(); ctx.strokeStyle=col; ctx.lineWidth=2.4;
      let started=false;
      for (let px=0; px<=gW*2; px++) {
        const x = 0.01 + (px/(gW*2))*(xMax-0.01);
        const y = Math.log(x)/Math.log(base);
        if (y<yMin-0.5||y>yMax+0.5) { started=false; continue; }
        const cy = Math.max(yMin,Math.min(yMax,y));
        if (!started) { ctx.moveTo(tX(x),tY(cy)); started=true; } else ctx.lineTo(tX(x),tY(cy));
      }
      ctx.stroke();
      ctx.fillStyle=col; ctx.font='bold 11px serif'; ctx.textAlign='left';
      const lx=4, ly=Math.log(lx)/Math.log(base);
      if (ly>=yMin&&ly<=yMax) ctx.fillText(`y = log${base} x`, tX(lx)+4, tY(ly)+14);
    }

    // Point (1,0) for log and (0,1) for exp
    [[0,1,'#1a6b6b'],[1,0,'#c0392b']].forEach(([px,py,col])=>{
      ctx.fillStyle=col;
      ctx.beginPath(); ctx.arc(tX(px),tY(py),4,0,Math.PI*2); ctx.fill();
    });

    // Axes
    ctx.strokeStyle='#555'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l-4,pad.t+gH); ctx.lineTo(pad.l+gW+6,pad.t+gH); ctx.stroke();
    ctx.fillStyle='#555'; ctx.font='10px IBM Plex Mono,monospace'; ctx.textAlign='center';
    ctx.fillText('x', pad.l+gW/2, H-1);
    ctx.save(); ctx.translate(12,pad.t+gH/2); ctx.rotate(-Math.PI/2); ctx.fillText('y',0,0); ctx.restore();

    // Origin label
    ctx.fillStyle='#9ca3af'; ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='right';
    ctx.fillText('0', pad.l-4, pad.t+gH+12);
  };

  useEffect(()=>{ draw(); },[base,showExp,showLog,showReflect]);
  useEffect(()=>{
    const h=()=>draw();
    window.addEventListener('resize',h,{passive:true});
    return()=>window.removeEventListener('resize',h);
  },[base,showExp,showLog,showReflect]);

  const btn = (active,col,label,onClick) => (
    <button onClick={onClick} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', background:active?col:'#1f2937', color:active?'#fff':'#6b7280', border:`1.5px solid ${active?col:'#374151'}`, borderRadius:'5px', padding:'4px 10px', cursor:'pointer' }}>{label}</button>
  );

  return (
    <div style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'12px' }}>
        📊 Logarithmic & Exponential Graph Explorer
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'flex-end', marginBottom:'12px' }}>
        <div style={{ flex:1, minWidth:'160px' }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#e8e2d8', marginBottom:'5px' }}>
            Base: <span style={{ color:'#d4a017', fontWeight:700 }}>b = {base}</span>
          </div>
          <input type="range" min="1.1" max="9" step="0.1" value={base}
            onInput={e=>setBase(Number(e.target.value))}
            style={{ width:'100%', WebkitAppearance:'none', height:'3px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {btn(showExp,'#1a6b6b','y = bˣ',()=>setShowExp(v=>!v))}
          {btn(showLog,'#c0392b','y = logb x',()=>setShowLog(v=>!v))}
          {btn(showReflect,'#d4a017','y = x (mirror)',()=>setShowReflect(v=>!v))}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'340px', borderRadius:'8px' }}/>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'10px' }}>
        <div style={{ background:'rgba(26,107,107,.15)', border:'1px solid rgba(26,107,107,.3)', borderRadius:'6px', padding:'8px 12px' }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#38c9b0', textTransform:'uppercase', marginBottom:'2px' }}>Exponential y = bˣ</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#cbd5e1', lineHeight:1.6 }}>Domain: all reals · Range: (0,∞) · y-intercept: (0,1)</div>
        </div>
        <div style={{ background:'rgba(192,57,43,.15)', border:'1px solid rgba(192,57,43,.3)', borderRadius:'6px', padding:'8px 12px' }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#ef4444', textTransform:'uppercase', marginBottom:'2px' }}>Logarithm y = log_b x</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#cbd5e1', lineHeight:1.6 }}>Domain: (0,∞) · Range: all reals · x-intercept: (1,0)</div>
        </div>
      </div>
      <div style={{ marginTop:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', color:'#64748b', textAlign:'center' }}>
        💡 The two curves are <strong style={{ color:'#d4a017' }}>mirror images</strong> across the line y = x — logarithm is the inverse of exponential.
      </div>
    </div>
  );
}

// ─── Change of Base Visual Widget ─────────────────────────────────────────
function ChangeOfBaseWidget() {
  const [fromBase, setFromBase] = useState(3);
  const [toBase, setToBase] = useState(10);
  const [xVal, setXVal] = useState(8);

  const result = Math.log(xVal) / Math.log(fromBase);
  const step1  = Math.log(xVal) / Math.log(toBase);
  const step2  = Math.log(fromBase) / Math.log(toBase);
  const verify = step1 / step2;

  return (
    <div style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>
        🔄 Change of Base — Live Calculator
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'16px' }}>
        {[
          { lbl:'Original base b', val:fromBase, min:1.1, max:20, step:0.1, set:setFromBase },
          { lbl:'New base c', val:toBase, min:1.1, max:20, step:0.1, set:setToBase },
          { lbl:'x value', val:xVal, min:0.1, max:100, step:0.1, set:setXVal },
        ].map(({ lbl, val, min, max, step, set }) => (
          <div key={lbl}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#e8e2d8', marginBottom:'4px' }}>
              {lbl}: <span style={{ color:'#d4a017', fontWeight:700 }}>{Number(val).toFixed(1)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onInput={e=>set(Number(e.target.value))}
              style={{ width:'100%', WebkitAppearance:'none', height:'3px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
          </div>
        ))}
      </div>

      {/* Formula display */}
      <div style={{ background:'#0f172a', borderRadius:'10px', padding:'18px 20px' }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#64748b', textTransform:'uppercase', marginBottom:'10px' }}>Change of Base Formula Applied</div>

        {/* Top stays top, bottom stays bottom */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', flexWrap:'wrap', marginBottom:'16px' }}>

          {/* Original */}
          <div style={{ textAlign:'center', background:'rgba(192,57,43,.15)', border:'1px solid rgba(192,57,43,.3)', borderRadius:'8px', padding:'12px 18px' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#ef4444', textTransform:'uppercase', marginBottom:'4px' }}>We want</div>
            <div style={{ color:'#e2e8f0', fontSize:'1.1rem' }}>
              {`$$\\log_{${Number(fromBase).toFixed(1)}} ${Number(xVal).toFixed(1)}$$`}
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#ef4444', fontWeight:700 }}>= {result.toFixed(5)}</div>
          </div>

          <div style={{ color:'#d4a017', fontSize:'1.4rem', fontWeight:700 }}>=</div>

          {/* Fraction breakdown */}
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#64748b', textTransform:'uppercase', marginBottom:'6px' }}>Convert using base {Number(toBase).toFixed(1)}</div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              {/* Numerator — top stays on top */}
              <div style={{ background:'rgba(26,107,107,.2)', border:'1px solid rgba(26,107,107,.4)', borderRadius:'6px 6px 0 0', padding:'8px 16px', color:'#38c9b0', fontSize:'1rem', borderBottom:'none' }}>
                {`$$\\log_{${Number(toBase).toFixed(1)}} ${Number(xVal).toFixed(1)} = ${step1.toFixed(4)}$$`}
              </div>
              <div style={{ width:'100%', height:'2px', background:'#e2e8f0' }}/>
              {/* Denominator — bottom stays on bottom */}
              <div style={{ background:'rgba(212,160,23,.2)', border:'1px solid rgba(212,160,23,.4)', borderRadius:'0 0 6px 6px', padding:'8px 16px', color:'#d4a017', fontSize:'1rem', borderTop:'none' }}>
                {`$$\\log_{${Number(toBase).toFixed(1)}} ${Number(fromBase).toFixed(1)} = ${step2.toFixed(4)}$$`}
              </div>
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#38c9b0', marginTop:'6px', fontWeight:700 }}>
              = {step1.toFixed(4)} ÷ {step2.toFixed(4)} = {verify.toFixed(5)}
            </div>
          </div>
        </div>

        <div style={{ background:'rgba(212,160,23,.1)', borderRadius:'6px', padding:'8px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#d4a017', textAlign:'center' }}>
          ✓ Both give {result.toFixed(5)} — the formula converts any logarithm to base {Number(toBase).toFixed(1)}
        </div>
      </div>

      <div style={{ marginTop:'8px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', color:'#64748b', lineHeight:1.6 }}>
        💡 <strong style={{ color:'#e2e8f0' }}>Memory trick:</strong> &quot;Top stays on top, bottom stays on bottom&quot; —
        the argument x goes to the numerator, and the original base goes to the denominator. Both use the same new base c.
      </div>
    </div>
  );
}

// ─── Main Page Export ──────────────────────────────────────────────────────
export default function Calc1S42() {
  const [sidebarOpen, setSidebarOpen] = useState({ 4:true });

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
      <Navbar activePage="courses"/>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive"/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec{padding:52px 0 0;} .lec-sec:first-child{padding-top:44px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;background:#d4a017;border-radius:50%;cursor:pointer;}
        mjx-container{color:#1a1a2e!important;} mjx-container svg{color:#1a1a2e!important;}
        .dark-widget mjx-container{color:#e2e8f0!important;} .dark-widget mjx-container svg{color:#e2e8f0!important;}
        @media(max-width:860px){.csb-hide{display:none!important;}.lec-inner-m{padding:0 18px 40px!important;}.lec-hero-m{padding:36px 20px 32px!important;}}
      `}</style>

      {/* SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§4.2 Logarithmic Functions</span>
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
          <div style={{ background:'#1a1a2e', color:'#fdf8f0', padding:'52px 40px 44px', textAlign:'center', position:'relative', overflow:'hidden' }} className="lec-hero-m">
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.025) 40px,rgba(255,255,255,.025) 41px)', pointerEvents:'none' }}/>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px', position:'relative' }}>Calculus I &nbsp;·&nbsp; Chapter 4 &nbsp;·&nbsp; Section 4.2</div>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:700, lineHeight:1.15, marginBottom:'10px', position:'relative' }}>
              Logarithmic Functions
            </h1>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.85rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#38c9b0', marginBottom:'18px', position:'relative' }}>
              The Inverse of Exponential Growth
            </div>
            <p style={{ fontSize:'1rem', color:'#c9c2b8', maxWidth:'580px', margin:'0 auto 24px', position:'relative' }}>
              Logarithms answer the question exponentials cannot: given the result, what was the exponent? From earthquake magnitudes to investment doubling times — logarithms make the invisible visible.
            </p>
            <div style={{ width:'56px', height:'3px', background:'#d4a017', margin:'0 auto' }}/>
          </div>

          {/* SECTION NAV */}
          <nav style={{ background:'rgba(253,248,240,.97)', backdropFilter:'blur(8px)', borderBottom:'1px solid #e0d6c8', padding:'8px 20px', display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'center' }}>
            {[['#motivation','Motivation'],['#definition','Definition'],['#examples','Log Examples'],['#rules','Log Rules'],['#rewriting','Rewriting Logs'],['#graphs','Graphs'],['#properties','Properties'],['#natural','Natural Log'],['#changeofbase','Change of Base'],['#applications','Applications'],['#doubling','Doubling Time'],['#decay','Radioactive Decay']].map(([href,lbl])=>(
              <a key={href} href={href} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#7f8c8d', textDecoration:'none', padding:'4px 11px', borderRadius:'20px', border:'1px solid #e0d6c8' }}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m lec-content">

            {/* ── MOTIVATION ── */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>Why This Section Matters</div>
              <h2 style={S.h2}>The Instrument that<br/>Conquered the Universe</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <h4 style={S.h4gold}>The Slide Rule — Computing Before Computers</h4>
                <p style={S.p}>Before electronic calculators existed, scientists and engineers used a device called a slide rule — two rulers that could be slid against each other to multiply, divide, and compute powers. The slide rule was powered entirely by logarithms. It was used to design the Apollo spacecraft, calculate artillery trajectories in World War II, and build every skyscraper and bridge before 1970.</p>
                <p style={{...S.p,marginBottom:0}}>John Napier invented logarithms in 1614 specifically to reduce multiplication to addition — because {'$\\log(ab) = \\log a + \\log b$'}. Astronomers at the time spent years doing multiplications by hand. Napier's logarithms reduced that work to weeks. The astronomer Laplace called logarithms "an admirable artifice which, by reducing to a few days the labour of many months, doubles the life of the astronomer."</p>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>The Unfinished Business from §4.1</h4>
                <p style={S.p}>In §4.1, we computed the doubling time of an investment at 8% continuous compounding:</p>
                <p style={{ textAlign:'center' }}>{'$$2P = Pe^{0.08T} \\Rightarrow 2 = e^{0.08T} \\Rightarrow T = \\frac{\\ln 2}{0.08} \\approx 8.66 \\text{ years}$$'}</p>
                <p style={S.p}>We used {'$\\ln$'} without formally defining it. Now we fix that. Logarithms are the systematic answer to: <em>"What power do I raise the base to, in order to get this number?"</em></p>
                <p style={{...S.p,marginBottom:0}}>Similarly: if PKR 50,000 grows to PKR 150,000 at 6% continuous compounding, <em>how long does it take?</em> The answer requires logarithms.</p>
              </div>

              <div style={S.calloutGold}>
                <strong>Logarithms appear everywhere you need to "undo" exponential growth:</strong> investment doubling times, earthquake magnitudes (Richter scale), sound intensity (decibels), pH in chemistry, population growth models, radioactive decay, and the complexity of algorithms in computer science.
              </div>
            </section>

            {/* ── DEFINITION ── */}
            <section id="definition" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Definition</div>
              <h2 style={S.h2}>What Is a Logarithm?</h2>

              <p style={S.p}>The logarithm answers one specific question: <strong>what exponent gives me this number?</strong></p>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Definition — Logarithmic Function</div>
                <p style={S.p}>For {'$b > 0$'}, {'$b \\neq 1$'}, and {'$x > 0$'}:</p>
                <p style={{ textAlign:'center', fontSize:'1.3rem' }}>{'$$y = \\log_b x \\quad\\Longleftrightarrow\\quad b^y = x$$'}</p>
                <p style={S.p}>Read: <em>"y equals log base b of x"</em> means <em>"b raised to y equals x."</em></p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>The logarithm {'$\\log_b x$'} is the <strong>exponent</strong> to which {'$b$'} must be raised to get {'$x$'}. The domain is {'$(0,\\infty)$'} and the range is {'$(-\\infty,\\infty)$'}.</p>
              </div>

              <div style={S.calloutTeal}>
                <strong>The fundamental bridge:</strong><br/>
                {'$\\log_b x = y$'} &nbsp;⟺&nbsp; {'$b^y = x$'}<br/>
                These two equations say the exact same thing in two different languages. Every logarithm problem can be rewritten as an exponential and vice versa.
              </div>
            </section>

            {/* ── LOG EXAMPLES ── */}
            <section id="examples" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Evaluating Logarithms by Definition</div>
              <h2 style={S.h2}>Evaluating Logarithms<br/>Step by Step</h2>

              {[
                { n:'Example 1', col:'#c0392b', h4:S.h4red, q:'Evaluate $\\log_2 8$',
                  sol:<><p style={S.p}><strong>Ask:</strong> "2 raised to what power gives 8?" Let {'$y = \\log_2 8$'}. Then {'$2^y = 8 = 2^3$'}. So {'$\\boxed{y=3}$'}.</p></> },
                { n:'Example 2', col:'#d4a017', h4:S.h4gold, q:'Evaluate $\\log_3 \\frac{1}{27}$',
                  sol:<><p style={S.p}>Let {'$y=\\log_3\\frac{1}{27}$'}. Then {'$3^y=\\frac{1}{27}=3^{-3}$'}. So {'$\\boxed{y=-3}$'}.</p></> },
                { n:'Example 3', col:'#1a6b6b', h4:S.h4teal, q:'Evaluate $\\log_{25} 5$',
                  sol:<><p style={S.p}>Let {'$y=\\log_{25}5$'}. Then {'$25^y=5=(25^{1/2})$'}. So {'$\\boxed{y=\\frac{1}{2}}$'}.</p></> },
                { n:'Example 4', col:'#2980b9', h4:S.h4blue, q:'Evaluate $\\log_b 1$ for any valid base $b$',
                  sol:<><p style={S.p}>Let {'$y=\\log_b 1$'}. Then {'$b^y=1=b^0$'}. So {'$\\boxed{y=0}$'} for any {'$b>0, b\\neq 1$'}. <em>The log of 1 is always 0.</em></p></> },
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'14px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}

              <div style={S.calloutBlue}>
                <strong>Two special values — memorise these:</strong><br/>
                {'$\\log_b 1 = 0$'} &nbsp; (because {'$b^0 = 1$'})<br/>
                {'$\\log_b b = 1$'} &nbsp; (because {'$b^1 = b$'})
              </div>
            </section>

            {/* ── LOG RULES ── */}
            <section id="rules" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Logarithm Rules</div>
              <h2 style={S.h2}>The Laws of Logarithms</h2>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px' }}>For {'$b>0, b\\neq 1$'} and {'$M,N>0$'}:</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  {[
                    ['Product rule',  '\\log_b(MN) = \\log_b M + \\log_b N',     '$\\log_2(4\\cdot8)=\\log_2 4+\\log_2 8=2+3=5$'],
                    ['Quotient rule', '\\log_b\\!\\left(\\dfrac{M}{N}\\right) = \\log_b M - \\log_b N', '$\\log_3\\frac{81}{9}=\\log_3 81-\\log_3 9=4-2=2$'],
                    ['Power rule',    '\\log_b(M^p) = p\\log_b M',               '$\\log_2(8^4)=4\\log_2 8=4\\cdot3=12$'],
                    ['Log of base',   '\\log_b b = 1',                            '$\\log_5 5=1,\\;\\log_e e=1$'],
                    ['Log of one',    '\\log_b 1 = 0',                            '$\\log_{10}1=0,\\;\\ln 1=0$'],
                    ['Inverse (I)',   'b^{\\log_b x} = x\\quad (x>0)',            '$2^{\\log_2 7}=7$'],
                    ['Inverse (II)',  '\\log_b(b^x)=x',                           '$\\log_3(3^5)=5$'],
                    ['One-to-one',   '\\log_b M=\\log_b N\\Leftrightarrow M=N',  '$\\log_5 x=\\log_5 9\\Rightarrow x=9$'],
                  ].map(([name,rule,ex])=>(
                    <div key={name} style={{ background:'#fff', borderRadius:'7px', padding:'12px 16px', border:'1px solid #e0d6c8' }}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#d4a017', textTransform:'uppercase', marginBottom:'5px' }}>{name}</div>
                      <div style={{ textAlign:'center', marginBottom:'6px' }}>{`$$${rule}$$`}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.66rem', color:'#7f8c8d' }}>{ex}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison table */}
              <h3 style={S.h3teal}>Exponential vs Logarithmic Rules — Side by Side</h3>
              <div style={{ overflowX:'auto', margin:'16px 0' }}>
                <table style={{ borderCollapse:'collapse', width:'100%', fontSize:'.92rem' }}>
                  <thead>
                    <tr style={{ background:'#1a1a2e' }}>
                      {['Exponential Rule','','Logarithmic Rule'].map((h,i)=><th key={i} style={{ padding:'9px 16px', textAlign:'center', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#d4a017' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['$b^x\\cdot b^y = b^{x+y}$','↔ product becomes sum','$\\log_b(MN)=\\log_b M+\\log_b N$'],
                      ['$\\dfrac{b^x}{b^y}=b^{x-y}$','↔ quotient becomes difference','$\\log_b(M/N)=\\log_b M-\\log_b N$'],
                      ['$(b^x)^y=b^{xy}$','↔ power becomes factor','$\\log_b(M^p)=p\\log_b M$'],
                      ['$b^0=1$','↔','$\\log_b 1=0$'],
                      ['$b^1=b$','↔','$\\log_b b=1$'],
                    ].map(([e,mid,l],i)=>(
                      <tr key={i} style={{ background:i%2===0?'#fdf8f0':'#fff' }}>
                        <td style={{ padding:'9px 16px', textAlign:'center', color:'#1a6b6b' }}>{e}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#7f8c8d' }}>{mid}</td>
                        <td style={{ padding:'9px 16px', textAlign:'center', color:'#c0392b' }}>{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── REWRITING LOGS ── */}
            <section id="rewriting" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Expanding and Condensing Logarithms</div>
              <h2 style={S.h2}>Rewriting Log Expressions<br/>Using the Rules</h2>

              {[
                { n:'Example 5', col:'#c0392b', h4:S.h4red, q:'Expand $\\log_3\\!\\left(\\dfrac{x^2\\sqrt{y}}{z^3}\\right)$',
                  sol:<>
                    <p style={S.p}>Apply quotient rule, then product rule, then power rule:</p>
                    <p style={{ textAlign:'center' }}>{'$$= \\log_3(x^2\\sqrt{y}) - \\log_3(z^3) = \\log_3 x^2 + \\log_3 y^{1/2} - 3\\log_3 z$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$= \\boxed{2\\log_3 x + \\frac{1}{2}\\log_3 y - 3\\log_3 z}$$'}</p>
                  </>},
                { n:'Example 6', col:'#d4a017', h4:S.h4gold, q:'Condense $3\\ln x - \\frac{1}{2}\\ln y + 2\\ln z$ into a single logarithm',
                  sol:<>
                    <p style={S.p}>Apply power rule first, then product/quotient rules:</p>
                    <p style={{ textAlign:'center' }}>{'$$= \\ln x^3 - \\ln y^{1/2} + \\ln z^2 = \\ln\\left(\\frac{x^3 z^2}{\\sqrt{y}}\\right)$$'}</p>
                  </>},
                { n:'Example 7', col:'#1a6b6b', h4:S.h4teal, q:'Simplify $\\log_4 2 + \\log_4 8$',
                  sol:<>
                    <p style={S.p}>Product rule: {'$\\log_4(2\\cdot8)=\\log_4 16$'}. Since {'$4^2=16$'}: {'$\\log_4 16 = \\boxed{2}$'}.</p>
                  </>},
                { n:'Example 8', col:'#2980b9', h4:S.h4blue, q:'Expand $\\log\\sqrt[3]{\\dfrac{a^4}{b^2c}}$',
                  sol:<>
                    <p style={S.p}>Write {'$\\sqrt[3]{\\cdot}$'} as {'$1/3$'} power: {'$\\frac{1}{3}\\log\\frac{a^4}{b^2c}$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$= \\frac{1}{3}(\\log a^4-\\log b^2-\\log c) = \\boxed{\\frac{4}{3}\\log a - \\frac{2}{3}\\log b - \\frac{1}{3}\\log c}$$'}</p>
                  </>},
                { n:'Example 9', col:'#27ae60', h4:S.h4green, q:'Solve $\\log_2 x + \\log_2(x-2) = 3$',
                  sol:<>
                    <p style={S.p}>Condense left side: {'$\\log_2[x(x-2)] = 3$'}. Convert: {'$x(x-2) = 2^3 = 8$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$x^2-2x-8=0 \\Rightarrow (x-4)(x+2)=0 \\Rightarrow x=4 \\text{ or } x=-2$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>Check: {'$x=-2$'} gives {'$\\log_2(-2)$'} — undefined. So {'$\\boxed{x=4}$'}.</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'14px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── GRAPHS ── */}
            <section id="graphs" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Graphs of Logarithmic Functions</div>
              <h2 style={S.h2}>Graphing Logarithms and<br/>Their Relationship to Exponentials</h2>
              <p style={S.p}>Since {'$y=\\log_b x$'} is the inverse of {'$y=b^x$'}, their graphs are reflections of each other across the line {'$y=x$'}. Toggle the curves below to see this relationship clearly.</p>

              <div className="dark-widget"><LogGraphWidget/></div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'20px 0' }}>
                <div style={{...S.card,...S.cardTl, padding:'18px 20px'}}>
                  <h4 style={S.h4teal}>b {'>'} 1 — Increasing Log</h4>
                  <p style={S.p}>As {'$x\\to\\infty$'}: {'$\\log_b x\\to\\infty$'} (slowly). As {'$x\\to 0^+$'}: {'$\\log_b x\\to-\\infty$'}. The y-axis is a vertical asymptote.</p>
                  <p style={{...S.p,marginBottom:0}}>Examples: {'$\\log_2 x$'}, {'$\\log_{10} x$'}, {'$\\ln x$'}</p>
                </div>
                <div style={{...S.card,...S.cardAl, padding:'18px 20px'}}>
                  <h4 style={S.h4red}>Key Point — All Share (1, 0)</h4>
                  <p style={S.p}>Every logarithm {'$\\log_b x$'} passes through {'$(1,0)$'} because {'$b^0=1$'} for any base. This mirrors how every exponential passes through {'$(0,1)$'}.</p>
                  <p style={{...S.p,marginBottom:0}}>The x-intercept of the log is at {'$x=1$'}, always.</p>
                </div>
              </div>
            </section>

            {/* ── PROPERTIES TABLE ── */}
            <section id="properties" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Properties of Logarithmic Functions</div>
              <h2 style={S.h2}>Properties of<br/>{'$f(x) = \\log_b x$'}</h2>

              <div style={S.thmBox}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ borderCollapse:'collapse', width:'100%', fontSize:'.92rem' }}>
                    <thead>
                      <tr style={{ background:'#1a1a2e' }}>
                        {['Property','Value / Description'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#d4a017' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Domain','$(0,\\infty)$ — logarithm is only defined for positive inputs'],
                        ['Range','$(-\\infty,\\infty)$ — all real numbers'],
                        ['x-intercept','$(1,0)$ — because $\\log_b 1=0$ for any $b$'],
                        ['y-intercept','None — the y-axis is a vertical asymptote'],
                        ['Vertical asymptote','$x=0$ — the function approaches $-\\infty$ as $x\\to 0^+$'],
                        ['Behaviour (b > 1)','Increasing — larger inputs give larger outputs'],
                        ['Behaviour (0 < b < 1)','Decreasing'],
                        ['One-to-one?','Yes — different inputs give different outputs'],
                        ['Inverse function','$f^{-1}(x)=b^x$ (the exponential function)'],
                        ['As $x\\to+\\infty$','$\\log_b x\\to+\\infty$ (slowly for $b>1$)'],
                        ['As $x\\to 0^+$','$\\log_b x\\to-\\infty$'],
                      ].map(([prop,val],i)=>(
                        <tr key={prop} style={{ background:i%2===0?'#fdf8f0':'#fff' }}>
                          <td style={{ padding:'8px 14px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.78rem', color:'#1a1a2e', fontWeight:600 }}>{prop}</td>
                          <td style={{ padding:'8px 14px', color:'#1a6b6b' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── NATURAL LOG ── */}
            <section id="natural" className="lec-sec">
              <div style={S.secLabel}>§ 7 — The Natural Logarithm</div>
              <h2 style={S.h2}>{'$\\ln x$'} — The Logarithm<br/>Calculus Was Built For</h2>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>The Natural Logarithm</div>
                <p style={S.p}>The natural logarithm is the logarithm with base {'$e \\approx 2.71828$'}:</p>
                <p style={{ textAlign:'center', fontSize:'1.2rem' }}>{'$$\\ln x = \\log_e x \\quad\\Longleftrightarrow\\quad e^y = x$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{'$\\ln x$'} is the natural choice for calculus because {'$\\frac{d}{dx}[\\ln x] = \\frac{1}{x}$'} — the cleanest possible derivative. No other base gives such a clean formula.</p>
              </div>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'12px' }}>Natural Log Rules — Quick Reference</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  {[
                    ['$\\ln(MN)=\\ln M+\\ln N$','$\\ln(6)=\\ln 2+\\ln 3$'],
                    ['$\\ln(M/N)=\\ln M-\\ln N$','$\\ln(5/2)=\\ln 5-\\ln 2$'],
                    ['$\\ln(M^p)=p\\ln M$','$\\ln(x^3)=3\\ln x$'],
                    ['$\\ln e = 1$','$\\ln e = 1$ always'],
                    ['$\\ln 1 = 0$','$\\ln 1 = 0$ always'],
                    ['$e^{\\ln x}=x$','$e^{\\ln 5}=5$'],
                    ['$\\ln(e^x)=x$','$\\ln(e^{3})=3$'],
                    ['$\\ln x=y\\Leftrightarrow e^y=x$','$\\ln 7=y\\Rightarrow e^y=7$'],
                  ].map(([rule,ex],i)=>(
                    <div key={i} style={{ background:i%2===0?'#fff8ec':'#fffdf7', borderRadius:'6px', padding:'10px 14px', border:'1px solid #e8d9a0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                      <span style={{ color:'#1a1a2e' }}>{rule}</span>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#7f8c8d' }}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { n:'Example 10', col:'#c0392b', h4:S.h4red, q:'Solve $e^{2x-1}=5$',
                  sol:<>
                    <p style={S.p}>Take {'$\\ln$'} of both sides: {'$2x-1=\\ln 5$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$x = \\frac{1+\\ln 5}{2} \\approx \\frac{1+1.6094}{2} \\approx \\boxed{1.305}$$'}</p>
                  </>},
                { n:'Example 11', col:'#d4a017', h4:S.h4gold, q:'Solve $3^x = 10$',
                  sol:<>
                    <p style={S.p}>Take {'$\\ln$'} of both sides: {'$x\\ln 3=\\ln 10$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$x = \\frac{\\ln 10}{\\ln 3} = \\frac{2.3026}{1.0986} \\approx \\boxed{2.096}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>This also equals {'$\\log_3 10$'} — change of base formula (next section).</p>
                  </>},
                { n:'Example 12', col:'#1a6b6b', h4:S.h4teal, q:'Solve $2e^{3x}+1=9$',
                  sol:<>
                    <p style={S.p}>Isolate the exponential: {'$2e^{3x}=8 \\Rightarrow e^{3x}=4$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$3x=\\ln 4 \\Rightarrow x=\\frac{\\ln 4}{3}\\approx \\frac{1.3863}{3}\\approx\\boxed{0.462}$$'}</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'14px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── CHANGE OF BASE ── */}
            <section id="changeofbase" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Change of Base Formula</div>
              <h2 style={S.h2}>Converting Between<br/>Different Bases</h2>

              <p style={S.p}>Most calculators only have {'$\\log_{10}$'} (log) and {'$\\ln$'} (natural log) buttons. The change of base formula lets you compute any logarithm using these.</p>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Change of Base Formula</div>
                <p style={{ textAlign:'center', fontSize:'1.2rem' }}>{'$$\\log_b x = \\frac{\\log_c x}{\\log_c b} = \\frac{\\ln x}{\\ln b}$$'}</p>
                <p style={{...S.p,marginBottom:0}}>where {'$c$'} is any convenient new base (typically 10 or {'$e$'}). <strong>Top stays on top</strong> (the argument {'$x$'}), <strong>bottom stays on bottom</strong> (the original base {'$b$'}).</p>
              </div>

              {[
                { n:'Example 13', col:'#c0392b', h4:S.h4red, q:'Compute $\\log_5 200$ using a calculator',
                  sol:<><p style={S.p}>{'$\\log_5 200 = \\dfrac{\\ln 200}{\\ln 5} = \\dfrac{5.2983}{1.6094} \\approx \\boxed{3.292}$'}</p><p style={{...S.p,marginBottom:0}}>Check: {'$5^{3.292}\\approx 200$ ✓'}</p></> },
                { n:'Example 14', col:'#d4a017', h4:S.h4gold, q:'Compute $\\log_3 50$ using $\\log_{10}$',
                  sol:<><p style={S.p}>{'$\\log_3 50 = \\dfrac{\\log 50}{\\log 3} = \\dfrac{1.6990}{0.4771} \\approx \\boxed{3.561}$'}</p></> },
                { n:'Example 15', col:'#1a6b6b', h4:S.h4teal, q:'Solve $\\log_6 x = 2.5$ for $x$',
                  sol:<><p style={S.p}>Convert: {'$x = 6^{2.5} = 6^2\\cdot 6^{0.5} = 36\\sqrt{6} \\approx 36\\times2.449 \\approx \\boxed{88.18}$'}</p></> },
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'14px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── APPLICATIONS ── */}
            <section id="applications" className="lec-sec">
              <div style={S.secLabel}>§ 9 — Compounding Applications</div>
              <h2 style={S.h2}>Using Logarithms<br/>in Finance</h2>

              <p style={S.p}>Now that we have logarithms, we can solve compounding problems where the unknown is <em>time</em> — not the balance.</p>

              {[
                { n:'Example 16', col:'#c0392b', h4:S.h4red, title:'Finding the Time to Reach a Target',
                  q:'PKR 80,000 is invested at 7% compounded continuously. How long until it reaches PKR 200,000?',
                  sol:<>
                    <p style={S.p}>{'$200{,}000 = 80{,}000\\,e^{0.07T}$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$e^{0.07T} = \\frac{200{,}000}{80{,}000} = 2.5 \\Rightarrow 0.07T = \\ln 2.5 \\Rightarrow T=\\frac{\\ln 2.5}{0.07}\\approx\\frac{0.9163}{0.07}\\approx\\boxed{13.1\\text{ years}}$$'}</p>
                  </>},
                { n:'Example 17', col:'#d4a017', h4:S.h4gold, title:'Finding the Required Interest Rate',
                  q:'You want PKR 500,000 to grow to PKR 1,000,000 in 10 years with continuous compounding. What rate is required?',
                  sol:<>
                    <p style={S.p}>{'$1{,}000{,}000 = 500{,}000\\,e^{10r} \\Rightarrow 2=e^{10r} \\Rightarrow 10r=\\ln 2$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$r=\\frac{\\ln 2}{10}\\approx\\frac{0.6931}{10}\\approx\\boxed{6.93\\%}$$'}</p>
                  </>},
                { n:'Example 18', col:'#1a6b6b', h4:S.h4teal, title:'Tripling Time',
                  q:'At 5% continuous compounding, how long does it take for an investment to triple?',
                  sol:<>
                    <p style={S.p}>{'$3P=Pe^{0.05T} \\Rightarrow 3=e^{0.05T} \\Rightarrow T=\\dfrac{\\ln 3}{0.05}\\approx\\dfrac{1.0986}{0.05}\\approx\\boxed{21.97\\text{ years}}$'}</p>
                  </>},
                { n:'Example 19', col:'#2980b9', h4:S.h4blue, title:'Comparing Compounding Frequencies — Solving for Time',
                  q:'At 8% compounded monthly, how long for PKR 100,000 to become PKR 250,000?',
                  sol:<>
                    <p style={S.p}>{'$250{,}000 = 100{,}000\\left(1+\\frac{0.08}{12}\\right)^{12T}$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$2.5=(1.00\\overline{6})^{12T} \\Rightarrow \\ln 2.5=12T\\ln(1.00\\overline{6}) \\Rightarrow T=\\frac{\\ln 2.5}{12\\ln(1.00667)}\\approx\\frac{0.9163}{0.0799}\\approx\\boxed{11.47\\text{ years}}$$'}</p>
                  </>},
              ].map(({ n, col, h4, title, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:col, marginBottom:'3px' }}>{n}</div>
                  <h4 style={{ ...h4, marginBottom:'6px' }}>{title}</h4>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── DOUBLING TIME ── */}
            <section id="doubling" className="lec-sec">
              <div style={S.secLabel}>§ 10 — Doubling Time</div>
              <h2 style={S.h2}>How Fast Does<br/>a Quantity Double?</h2>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'12px' }}>Doubling Time Formula</div>
                <p style={S.p}>For a quantity growing continuously as {'$Q(t) = Q_0 e^{kt}$'} (with {'$k>0$'}):</p>
                <p style={{ textAlign:'center', fontSize:'1.2rem' }}>{'$$T_{\\text{double}} = \\frac{\\ln 2}{k}$$'}</p>
                <p style={S.p}><strong>Derivation:</strong> Set {'$Q(T)=2Q_0$'}:</p>
                <p style={{ textAlign:'center' }}>{'$$2Q_0 = Q_0 e^{kT} \\Rightarrow 2=e^{kT} \\Rightarrow kT=\\ln 2 \\Rightarrow T=\\frac{\\ln 2}{k}$$'}</p>
                <p style={{...S.p,marginBottom:0,color:'#7f8c8d',fontStyle:'italic'}}>Similarly: tripling time {'$= \\dfrac{\\ln 3}{k}$'}, halving time (decay) {'$= \\dfrac{\\ln 2}{k}$'} with {'$k<0$'}.</p>
              </div>

              <div style={S.calloutGold}>
                <strong>Rule of 70:</strong> For continuous growth at rate {'$r$'} (as a percentage), the doubling time is approximately {'$70/r$'} years. This is because {'$\\ln 2 \\approx 0.693 \\approx 0.70$'}. At 7%: doubling time {'$\\approx 70/7 = 10$'} years. At 5%: {'$\\approx 14$'} years. A quick mental estimate.
              </div>

              {[
                { n:'Example 20', col:'#c0392b', h4:S.h4red, q:'A bacterial population grows at rate $k=0.4$ per hour. Find the doubling time.',
                  sol:<><p style={S.p}>{'$T=\\dfrac{\\ln 2}{0.4}=\\dfrac{0.6931}{0.4}\\approx\\boxed{1.73\\text{ hours}}$'}. So the population doubles every 1.73 hours.</p></> },
                { n:'Example 21', col:'#d4a017', h4:S.h4gold, q:"Pakistan's GDP grows at 4.5% per year continuously. When will it double?",
                  sol:<><p style={S.p}>{'$k=0.045$'}. {'$T=\\dfrac{\\ln 2}{0.045}\\approx\\dfrac{0.6931}{0.045}\\approx\\boxed{15.4\\text{ years}}$'}.</p></> },
                { n:'Example 22', col:'#1a6b6b', h4:S.h4teal, q:'A population grows from 5,000 to 8,000 in 6 years. Find $k$ and the doubling time.',
                  sol:<>
                    <p style={S.p}>{'$8000=5000e^{6k} \\Rightarrow e^{6k}=1.6 \\Rightarrow 6k=\\ln 1.6 \\Rightarrow k=\\dfrac{\\ln 1.6}{6}\\approx\\dfrac{0.4700}{6}\\approx 0.0784$'}</p>
                    <p style={S.p}>{'$T=\\dfrac{\\ln 2}{0.0784}\\approx\\boxed{8.84\\text{ years}}$'}.</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'14px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── RADIOACTIVE DECAY ── */}
            <section id="decay" className="lec-sec">
              <div style={S.secLabel}>§ 11 — Radioactive Decay & Carbon Dating</div>
              <h2 style={S.h2}>Reading the Clock<br/>Buried in Every Living Thing</h2>

              <div style={{...S.card,...S.cardGl, background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <h4 style={S.h4gold}>The Discovery that Changed History</h4>
                <p style={S.p}>In 1949, American chemist Willard Libby developed radiocarbon dating — a technique that uses the known decay rate of {'$^{14}\\text{C}$'} (carbon-14) to determine the age of organic materials up to about 50,000 years old. Libby won the Nobel Prize in Chemistry in 1960.</p>
                <p style={S.p}>Every living organism absorbs carbon from the atmosphere, including a small fixed ratio of radioactive {'$^{14}\\text{C}$'} alongside stable {'$^{12}\\text{C}$'}. When the organism dies, it stops absorbing carbon. The {'$^{14}\\text{C}$'} already present begins decaying at a known, constant rate.</p>
                <p style={{...S.p,marginBottom:0}}>By measuring how much {'$^{14}\\text{C}$'} remains in a sample, we can compute how long ago the organism died. This has been used to date the Dead Sea Scrolls, Egyptian mummies, the Shroud of Turin, and the remains of ancient civilisations across the world.</p>
              </div>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'12px' }}>Radioactive Decay Model</div>
                <p style={S.p}>The amount {'$Q(t)$'} of a radioactive substance remaining at time {'$t$'} satisfies:</p>
                <p style={{ textAlign:'center', fontSize:'1.15rem' }}>{'$$Q(t) = Q_0 e^{-kt} \\quad (k > 0)$$'}</p>
                <p style={S.p}>where {'$Q_0$'} is the initial amount and {'$k>0$'} is the <strong>decay constant</strong>.</p>
                <p style={S.p}>The <strong>half-life</strong> {'$T_{1/2}$'} satisfies {'$Q(T_{1/2}) = Q_0/2$'}:</p>
                <p style={{ textAlign:'center' }}>{'$$T_{1/2} = \\frac{\\ln 2}{k}$$'}</p>
                <p style={{...S.p,marginBottom:0,color:'#7f8c8d',fontStyle:'italic'}}>Carbon-14 has a half-life of approximately <strong>5,730 years</strong>. So {'$k = \\ln 2 / 5730 \\approx 0.0001209$'} per year.</p>
              </div>

              {[
                { n:'Example 23', col:'#c0392b', h4:S.h4red, title:'Age of an Archaeological Sample',
                  q:'A piece of charcoal from an ancient fire site contains 72% of the $^{14}$C expected in living wood. How old is it? (Half-life of $^{14}$C $\\approx 5{,}730$ years)',
                  sol:<>
                    <p style={S.p}><strong>Find k:</strong> {'$k=\\dfrac{\\ln 2}{5730}\\approx 0.0001209$'} per year.</p>
                    <p style={S.p}><strong>Set up:</strong> {'$0.72Q_0 = Q_0 e^{-0.0001209\\,t} \\Rightarrow e^{-0.0001209t}=0.72$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$-0.0001209\\,t=\\ln(0.72)\\approx -0.3285 \\Rightarrow t\\approx\\frac{0.3285}{0.0001209}\\approx\\boxed{2{,}717\\text{ years old}}$$'}</p>
                  </>},
                { n:'Example 24', col:'#d4a017', h4:S.h4gold, title:'Remaining Activity',
                  q:'Polonium-210 has a half-life of 138 days. A sample initially has 50 mg. How much remains after 200 days?',
                  sol:<>
                    <p style={S.p}><strong>Find k:</strong> {'$k=\\dfrac{\\ln 2}{138}\\approx 0.005022$'} per day.</p>
                    <p style={{ textAlign:'center' }}>{'$$Q(200)=50e^{-0.005022\\times200}=50e^{-1.0044}\\approx50\\times0.3663\\approx\\boxed{18.3\\text{ mg}}$$'}</p>
                  </>},
                { n:'Example 25', col:'#1a6b6b', h4:S.h4teal, title:'Finding the Half-Life',
                  q:'A radioactive isotope decays from 80 g to 52 g in 40 years. Find the half-life.',
                  sol:<>
                    <p style={S.p}><strong>Find k:</strong> {'$52=80e^{-40k} \\Rightarrow e^{-40k}=0.65 \\Rightarrow -40k=\\ln(0.65) \\Rightarrow k\\approx\\dfrac{0.4308}{40}\\approx 0.01077$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$T_{1/2}=\\frac{\\ln 2}{k}\\approx\\frac{0.6931}{0.01077}\\approx\\boxed{64.4\\text{ years}}$$'}</p>
                  </>},
                { n:'Example 26', col:'#2980b9', h4:S.h4blue, title:'Carbon Dating — The Dead Sea Scrolls',
                  q:'The Dead Sea Scrolls were tested and found to contain about 78% of the expected $^{14}$C. Estimate their age.',
                  sol:<>
                    <p style={S.p}>{'$0.78 = e^{-0.0001209\\,t}$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$t=\\frac{-\\ln(0.78)}{0.0001209}=\\frac{0.2485}{0.0001209}\\approx\\boxed{2{,}055\\text{ years old}}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>Historical records date them to roughly 100 BC–70 AD (2,000–2,100 years ago) ✓ — a remarkable confirmation of the method.</p>
                  </>},
              ].map(({ n, col, h4, title, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:col, marginBottom:'3px' }}>{n}</div>
                  <h4 style={{ ...h4, marginBottom:'6px' }}>{title}</h4>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}>
                <strong style={{ color:'#1a6b6b' }}>Coming up next —</strong> §4.3 Differentiation of Exponential and Logarithmic Functions — we derive {'$\\frac{d}{dx}[e^x]=e^x$'} and {'$\\frac{d}{dx}[\\ln x]=\\frac{1}{x}$'}, and learn the chain rule versions for general bases.
              </div>
            </section>

          </div>

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s41" style={S.lnfBtnPrev}>← §4.1 Exponential Functions</Link>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#7f8c8d', textAlign:'center' }}>§4.2 · Chapter 4 · Calculus I</div>
            <Link href="/courses/calc1/s51" style={S.lnfBtnNext}>§5.1 Indefinite Integration →</Link>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}