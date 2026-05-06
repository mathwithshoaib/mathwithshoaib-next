'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

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
    { label:'4.1 · Exponential Functions',       href:'/courses/calc1/s41', live:true },
    { label:'4.2 · Logarithmic Functions',        href:'/courses/calc1/s42', live:true },
    { label:'4.3 · Differentiation of Exp & Log', href:'/courses/calc1/s43', active:true, live:true },
    { label:'4.4 · Exponential Models',           soon:true },
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

// ─── Derivative Graph Widget ───────────────────────────────────────────────
function DerivativeGraphWidget() {
  const canvasRef = useRef(null);
  const [fn, setFn] = useState('ex');
  const [showF, setShowF] = useState(true);
  const [showFp, setShowFp] = useState(true);
  const [xPos, setXPos] = useState(1);

  const FNS = {
    ex:   { label:'eˣ',        f: x => Math.exp(x),           fp: x => Math.exp(x),           color:'#1a6b6b', fpColor:'#ef4444', note:"f'(x) = f(x) — the function IS its own derivative!" },
    lnx:  { label:'ln x',     f: x => Math.log(x),            fp: x => 1/x,                   color:'#2980b9', fpColor:'#d4a017', note:"f'(x) = 1/x — much simpler than the original function." },
    e2x:  { label:'e²ˣ',      f: x => Math.exp(2*x),          fp: x => 2*Math.exp(2*x),       color:'#27ae60', fpColor:'#ef4444', note:"Chain rule: f'(x) = 2e²ˣ" },
    lnx2: { label:'ln(x²)',   f: x => Math.log(x*x),          fp: x => 2/x,                   color:'#a78bfa', fpColor:'#d4a017', note:"Chain rule: f'(x) = 2/x" },
    xex:  { label:'xeˣ',      f: x => x*Math.exp(x),          fp: x => (x+1)*Math.exp(x),     color:'#f97316', fpColor:'#ef4444', note:"Product rule: f'(x) = (x+1)eˣ" },
    ln1x: { label:'ln(1+x²)', f: x => Math.log(1+x*x),        fp: x => 2*x/(1+x*x),           color:'#ec4899', fpColor:'#d4a017', note:"Chain rule: f'(x) = 2x/(1+x²)" },
  };

  const cur = FNS[fn];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 260;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isLogFn = fn === 'lnx' || fn === 'lnx2' || fn === 'ln1x';
    const xMin = isLogFn ? 0.01 : -3, xMax = 4;
    const yMin = -3, yMax = 8;
    const pad = { l:48, r:16, t:16, b:32 };
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
    const tX = x => pad.l + ((x-xMin)/(xMax-xMin))*gW;
    const tY = y => pad.t + gH - ((y-yMin)/(yMax-yMin))*gH;

    ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle = '#e8e0d4'; ctx.lineWidth = 1;
    for (let x=-3; x<=xMax; x++) { ctx.beginPath(); ctx.moveTo(tX(x),pad.t); ctx.lineTo(tX(x),pad.t+gH); ctx.stroke(); }
    for (let y=yMin; y<=yMax; y+=2) { ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke(); ctx.fillStyle='#9ca3af'; ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='right'; ctx.fillText(y,pad.l-4,tY(y)+3); }
    ctx.fillStyle='#9ca3af'; ctx.font='9px IBM Plex Mono,monospace';
    for (let x=-2; x<=xMax; x++) { ctx.textAlign='center'; ctx.fillText(x,tX(x),pad.t+gH+14); }

    const plotFn = (fn, col, lw) => {
      ctx.beginPath(); ctx.strokeStyle=col; ctx.lineWidth=lw;
      let started=false;
      for (let px=0; px<=gW*3; px++) {
        const x = xMin + (px/(gW*3))*(xMax-xMin);
        let y;
        try { y = fn(x); } catch(e) { started=false; continue; }
        if (!isFinite(y)||isNaN(y)) { started=false; continue; }
        if (y<yMin-0.5||y>yMax+0.5) { started=false; continue; }
        const cy=Math.max(yMin,Math.min(yMax,y));
        if (!started) { ctx.moveTo(tX(x),tY(cy)); started=true; } else ctx.lineTo(tX(x),tY(cy));
      }
      ctx.stroke();
    };

    if (showF)  plotFn(cur.f,  cur.color,  2.5);
    if (showFp) plotFn(cur.fp, cur.fpColor, 2);

    // Tangent point
    if (showF && showFp) {
      const fx = cur.f(xPos), fpx = cur.fp(xPos);
      if (isFinite(fx) && isFinite(fpx) && fx>=yMin && fx<=yMax) {
        // Point on f
        ctx.fillStyle=cur.color; ctx.beginPath(); ctx.arc(tX(xPos),tY(fx),5,0,Math.PI*2); ctx.fill();
        // Tangent line segment
        ctx.strokeStyle=cur.fpColor; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
        const dx=0.8;
        ctx.beginPath(); ctx.moveTo(tX(xPos-dx),tY(fx-fpx*dx)); ctx.lineTo(tX(xPos+dx),tY(fx+fpx*dx)); ctx.stroke();
        ctx.setLineDash([]);
        // Labels
        ctx.fillStyle='#1a1a2e'; ctx.font='bold 10px IBM Plex Mono,monospace'; ctx.textAlign='left';
        ctx.fillText(`f(${xPos})=${fx.toFixed(2)}`, tX(xPos)+7, tY(fx)-5);
        ctx.fillStyle=cur.fpColor;
        ctx.fillText(`slope=${fpx.toFixed(2)}`, tX(xPos)+7, tY(fx)+12);
      }
    }

    // Axes
    ctx.strokeStyle='#555'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l-4,pad.t+gH); ctx.lineTo(pad.l+gW+6,pad.t+gH); ctx.stroke();
  }, [fn, showF, showFp, xPos]);

  const btn=(active,col,label,onClick)=>(
    <button onClick={onClick} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', background:active?col:'#1f2937', color:active?'#fff':'#6b7280', border:`1.5px solid ${active?col:'#374151'}`, borderRadius:'4px', padding:'3px 9px', cursor:'pointer' }}>{label}</button>
  );

  return (
    <div style={{ background:'#1a1a2e', borderRadius:'12px', padding:'20px 22px', margin:'24px 0' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#d4a017', marginBottom:'12px' }}>
        📐 Derivative Explorer — f(x) and f'(x)
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'flex-end', marginBottom:'12px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', flex:1 }}>
          {Object.entries(FNS).map(([k,v])=>(
            <button key={k} onClick={()=>setFn(k)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', background:fn===k?v.color:'#1f2937', color:fn===k?'#fff':'#9ca3af', border:`1.5px solid ${fn===k?v.color:'#374151'}`, borderRadius:'4px', padding:'3px 9px', cursor:'pointer' }}>{v.label}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:'5px' }}>
          {btn(showF, cur.color, 'f(x)', ()=>setShowF(v=>!v))}
          {btn(showFp, cur.fpColor, "f'(x)", ()=>setShowFp(v=>!v))}
        </div>
      </div>

      <div style={{ marginBottom:'10px' }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#e8e2d8', marginBottom:'4px' }}>
          x = <span style={{ color:'#d4a017', fontWeight:700 }}>{xPos}</span> — drag to see tangent slope
        </div>
        <input type="range" min="-2" max="3" step="0.1" value={xPos}
          onInput={e=>setXPos(Number(e.target.value))}
          style={{ width:'100%', WebkitAppearance:'none', height:'3px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
      </div>

      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'260px', borderRadius:'8px' }}/>

      <div style={{ marginTop:'8px', background:'rgba(255,255,255,.06)', borderRadius:'6px', padding:'9px 13px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.66rem', color:'#94a3b8' }}>
        💡 {cur.note}
      </div>
    </div>
  );
}
export default function Calc1S43() {
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

      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§4.3 Differentiation of Exp & Log</span>
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
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#d4a017', marginBottom:'14px', position:'relative' }}>Calculus I &nbsp;·&nbsp; Chapter 4 &nbsp;·&nbsp; Section 4.3</div>
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:700, lineHeight:1.15, marginBottom:'10px', position:'relative' }}>
              Differentiation of Exponential<br/>&amp; Logarithmic Functions
            </h1>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.85rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#38c9b0', marginBottom:'18px', position:'relative' }}>The Calculus of Growth and Decay</div>
            <p style={{ fontSize:'1rem', color:'#c9c2b8', maxWidth:'580px', margin:'0 auto 24px', position:'relative' }}>
              The derivatives of {'$e^x$'} and {'$\\ln x$'} are the two most elegant results in elementary calculus — and the engine behind every model of growth, decay, and optimisation in the sciences.
            </p>
            <div style={{ width:'56px', height:'3px', background:'#d4a017', margin:'0 auto' }}/>
          </div>

          {/* NAV */}
          <nav style={{ background:'rgba(253,248,240,.97)', borderBottom:'1px solid #e0d6c8', padding:'8px 20px', display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'center' }}>
            {[['#motivation','Motivation'],['#formulas','Core Formulas'],['#chainrule','Chain Rule'],['#ex-examples','eˣ Examples'],['#lnx-examples','ln x Examples'],['#general','General Bases'],['#applications','Applications'],['#elasticity','Elasticity'],['#logdiff','Log Differentiation']].map(([href,lbl])=>(
              <a key={href} href={href} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#7f8c8d', textDecoration:'none', padding:'4px 11px', borderRadius:'20px', border:'1px solid #e0d6c8' }}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m lec-content">

            {/* ── MOTIVATION ── */}
            <section id="motivation" className="lec-sec">
              <div style={S.secLabel}>Why This Section Matters</div>
              <h2 style={S.h2}>The Function That Is<br/>Its Own Derivative</h2>
              <div style={{...S.card,...S.cardGl, background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <h4 style={S.h4gold}>The Most Remarkable Fact in Calculus</h4>
                <p style={S.p}>Every function you have differentiated so far changes when you differentiate it. {'$x^3$'} becomes {'$3x^2$'}. {'$\\sin x$'} becomes {'$\\cos x$'}. Something always changes.</p>
                <p style={S.p}>Except one. The function {'$f(x) = e^x$'} satisfies {'$f\'(x) = e^x = f(x)$'}. It is its own derivative. This is not a coincidence — it is the defining property of {'$e$'}, and it is the reason {'$e$'} appears in every natural growth model in physics, biology, economics, and engineering.</p>
                <p style={{...S.p,marginBottom:0}}>The corresponding result for logarithms, {'$\\frac{d}{dx}[\\ln x] = \\frac{1}{x}$'}, gives us the antiderivative of {'$1/x$'} — the one missing case from the power rule (which fails at {'$n=-1$'}). Together, these two derivatives unlock an entirely new class of problems.</p>
              </div>
              <div style={S.calloutGold}>
                <strong>Coming back full circle:</strong> In §4.1 we computed doubling times. In §4.2 we solved exponential equations. Now we add the missing piece — the <em>rate of change</em> of exponential and logarithmic functions — which lets us optimise, find marginal quantities, and analyse elasticity.
              </div>
            </section>

            {/* ── CORE FORMULAS ── */}
            <section id="formulas" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Core Derivative Formulas</div>
              <h2 style={S.h2}>The Two Fundamental<br/>Derivative Rules</h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'20px 0' }}>
                <div style={S.defBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Derivative of eˣ</div>
                  <p style={{ textAlign:'center', fontSize:'1.3rem' }}>{'$$\\frac{d}{dx}[e^x] = e^x$$'}</p>
                  <p style={{...S.p,marginBottom:'10px',color:'#7f8c8d',fontStyle:'italic'}}>The exponential function is its own derivative.</p>
                  <ToggleAnswer label="Show Derivation" btnStyle={S.toggleBtnTeal} boxStyle={S.revealBox}>
                    <p style={S.p}><strong>From the limit definition:</strong></p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{d}{dx}[e^x] = \\lim_{h\\to 0}\\frac{e^{x+h}-e^x}{h} = \\lim_{h\\to 0}\\frac{e^x(e^h-1)}{h} = e^x\\lim_{h\\to 0}\\frac{e^h-1}{h}$$'}</p>
                    <p style={S.p}>The key limit: {'$\\lim_{h\\to 0}\\frac{e^h-1}{h} = 1$'} (this can be shown using L\'Hôpital\'s rule or the series expansion of {'$e^h$'}).</p>
                    <p style={{ textAlign:'center' }}>{'$$\\Rightarrow \\frac{d}{dx}[e^x] = e^x \\cdot 1 = e^x \\quad \\blacksquare$$'}</p>
                  </ToggleAnswer>
                </div>
                <div style={S.defBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Derivative of ln x</div>
                  <p style={{ textAlign:'center', fontSize:'1.3rem' }}>{'$$\\frac{d}{dx}[\\ln x] = \\frac{1}{x}, \\quad x > 0$$'}</p>
                  <p style={{...S.p,marginBottom:'10px',color:'#7f8c8d',fontStyle:'italic'}}>Valid for {'$x>0$'}. For all {'$x\\neq 0$'}: {'$\\frac{d}{dx}[\\ln|x|]=\\frac{1}{x}$'}.</p>
                  <ToggleAnswer label="Show Derivation" btnStyle={S.toggleBtnTeal} boxStyle={S.revealBox}>
                    <p style={S.p}><strong>Using implicit differentiation:</strong> If {'$y=\\ln x$'}, then {'$e^y=x$'}. Differentiate both sides:</p>
                    <p style={{ textAlign:'center' }}>{'$$e^y\\frac{dy}{dx} = 1 \\Rightarrow \\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x} \\quad \\blacksquare$$'}</p>
                    <p style={S.p}><strong>Direct limit approach:</strong></p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{d}{dx}[\\ln x] = \\lim_{h\\to 0}\\frac{\\ln(x+h)-\\ln x}{h} = \\lim_{h\\to 0}\\frac{1}{h}\\ln\\!\\left(1+\\frac{h}{x}\\right) = \\frac{1}{x}\\lim_{t\\to 0}\\frac{\\ln(1+t)}{t} = \\frac{1}{x}$$'}</p>
                  </ToggleAnswer>
                </div>
              </div>

              <div className="dark-widget"><DerivativeGraphWidget/></div>
            </section>

            {/* ── CHAIN RULE ── */}
            <section id="chainrule" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Chain Rule Versions</div>
              <h2 style={S.h2}>When the Exponent or<br/>Argument is a Function</h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'20px 0' }}>
                <div style={S.thmBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'10px' }}>Chain Rule — eᵘ</div>
                  <p style={{ textAlign:'center', fontSize:'1.15rem' }}>{'$$\\frac{d}{dx}[e^{u(x)}] = e^{u(x)}\\cdot u\'(x)$$'}</p>
                  <p style={{...S.p,marginBottom:0,color:'#7f8c8d'}}>Differentiate the exponent, multiply by {'$e^u$'}.</p>
                </div>
                <div style={S.thmBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'10px' }}>Chain Rule — ln u</div>
                  <p style={{ textAlign:'center', fontSize:'1.15rem' }}>{'$$\\frac{d}{dx}[\\ln u(x)] = \\frac{u\'(x)}{u(x)}$$'}</p>
                  <p style={{...S.p,marginBottom:0,color:'#7f8c8d'}}>Derivative of inside over inside.</p>
                </div>
              </div>

              <div style={S.calloutTeal}>
                <strong>How to remember:</strong> For {'$e^u$'} — multiply by {'$u\'$'}. For {'$\\ln u$'} — divide by {'$u$'} (and multiply by {'$u\'$'}). In both cases the chain rule says: <em>derivative of outside × derivative of inside</em>.
              </div>
            </section>

            {/* ── eˣ EXAMPLES ── */}
            <section id="ex-examples" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Differentiating eˣ and its Variants</div>
              <h2 style={S.h2}>Example Set 1:<br/>Exponential Derivatives</h2>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 1 — Differentiating Exponential Functions</h4>
                <p style={S.p}>Find the derivative of each function:</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  {[
                    { lbl:'(a)', q:'$f(x)=e^{3x}$', sol:<><p style={S.p}><strong>Chain rule:</strong> {'$u=3x$'}, {'$u\'=3$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=3e^{3x}$$'}</p></> },
                    { lbl:'(b)', q:'$f(x)=e^{x^2+1}$', sol:<><p style={S.p}><strong>Chain rule:</strong> {'$u=x^2+1$'}, {'$u\'=2x$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=2xe^{x^2+1}$$'}</p></> },
                    { lbl:'(c)', q:'$f(x)=x^3 e^{2x}$', sol:<><p style={S.p}><strong>Product rule:</strong> {'$(x^3)\'e^{2x}+x^3(e^{2x})\'$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=3x^2e^{2x}+x^3\\cdot 2e^{2x}=e^{2x}(3x^2+2x^3)=\\boxed{x^2e^{2x}(3+2x)}$$'}</p></> },
                    { lbl:'(d)', q:'$f(x)=\\dfrac{e^x}{1+e^x}$', sol:<><p style={S.p}><strong>Quotient rule:</strong></p><p style={{ textAlign:'center' }}>{'$$f\'(x)=\\frac{e^x(1+e^x)-e^x\\cdot e^x}{(1+e^x)^2}=\\frac{e^x+e^{2x}-e^{2x}}{(1+e^x)^2}=\\boxed{\\frac{e^x}{(1+e^x)^2}}$$'}</p></> },
                    { lbl:'(e)', q:'$f(x)=e^{\\sqrt{x}}$', sol:<><p style={S.p}><strong>Chain rule:</strong> {'$u=x^{1/2}$'}, {'$u\'=\\frac{1}{2\\sqrt{x}}$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=e^{\\sqrt{x}}\\cdot\\frac{1}{2\\sqrt{x}}=\\boxed{\\frac{e^{\\sqrt{x}}}{2\\sqrt{x}}}$$'}</p></> },
                  ].map(({ lbl, q, sol }) => (
                    <div key={lbl} style={{ background:'#fdf8f0', borderRadius:'8px', padding:'14px 18px', border:'1px solid #e0d6c8' }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'10px', marginBottom:'6px' }}>
                        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', color:'#1a6b6b', fontWeight:700 }}>{lbl}</span>
                        <span>{q}</span>
                      </div>
                      <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, fontSize:'.62rem', padding:'5px 12px', marginTop:'4px'}}>{sol}</ToggleAnswer>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── ln x EXAMPLES ── */}
            <section id="lnx-examples" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Differentiating ln x and its Variants</div>
              <h2 style={S.h2}>Example Set 2:<br/>Logarithmic Derivatives</h2>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 2 — Differentiating Logarithmic Functions</h4>
                <p style={S.p}>Find {'$f\'(x)$'} for each:</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  {[
                    { lbl:'(a)', q:'$f(x)=\\ln(3x+1)$', sol:<><p style={S.p}>{'$u=3x+1$'}, {'$u\'=3$'}. Chain rule: {'$\\boxed{f\'(x)=\\frac{3}{3x+1}}$'}.</p></> },
                    { lbl:'(b)', q:'$f(x)=\\ln(x^2+5x)$', sol:<><p style={S.p}>{'$u=x^2+5x$'}, {'$u\'=2x+5$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=\\frac{2x+5}{x^2+5x}=\\boxed{\\frac{2x+5}{x(x+5)}}$$'}</p></> },
                    { lbl:'(c)', q:'$f(x)=x^2\\ln x$', sol:<><p style={S.p}><strong>Product rule:</strong> {'$(x^2)\'\\ln x + x^2(\\ln x)\'=2x\\ln x+x^2\\cdot\\frac{1}{x}=\\boxed{2x\\ln x+x}$'}.</p></> },
                    { lbl:'(d)', q:'$f(x)=\\ln\\!\\left(\\dfrac{x^2}{x+1}\\right)$', sol:<><p style={S.p}><strong>Expand first using log rules:</strong> {'$\\ln x^2 - \\ln(x+1) = 2\\ln x - \\ln(x+1)$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=\\frac{2}{x}-\\frac{1}{x+1}=\\boxed{\\frac{x+2}{x(x+1)}}$$'}</p></> },
                    { lbl:'(e)', q:'$f(x)=\\ln\\sqrt{(x+1)(x^2+3)}$', sol:<><p style={S.p}><strong>Simplify first:</strong> {'$\\frac{1}{2}[\\ln(x+1)+\\ln(x^2+3)]$'}.</p><p style={{ textAlign:'center' }}>{'$$f\'(x)=\\frac{1}{2}\\left(\\frac{1}{x+1}+\\frac{2x}{x^2+3}\\right)=\\boxed{\\frac{1}{2(x+1)}+\\frac{x}{x^2+3}}$$'}</p></> },
                  ].map(({ lbl, q, sol }) => (
                    <div key={lbl} style={{ background:'#fdf8f0', borderRadius:'8px', padding:'14px 18px', border:'1px solid #e0d6c8' }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'10px', marginBottom:'6px' }}>
                        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', color:'#2980b9', fontWeight:700 }}>{lbl}</span>
                        <span>{q}</span>
                      </div>
                      <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn, fontSize:'.62rem', padding:'5px 12px', marginTop:'4px', background:'#2980b9'}}>{sol}</ToggleAnswer>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── GENERAL BASES ── */}
            <section id="general" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Derivatives for General Bases</div>
              <h2 style={S.h2}>Differentiating {'$b^x$'} and<br/>{'$\\log_b x$'} for Any Base</h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', margin:'16px 0' }}>
                <div style={S.thmBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#d4a017', textTransform:'uppercase', marginBottom:'8px' }}>Derivative of bˣ</div>
                  <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$\\frac{d}{dx}[b^x] = b^x \\ln b$$'}</p>
                  <ToggleAnswer label="Derive it" btnStyle={{...S.toggleBtn, fontSize:'.62rem', padding:'5px 12px', marginTop:'6px'}} boxStyle={S.revealBox}>
                    <p style={S.p}>Write {'$b^x = e^{x\\ln b}$'}. Then:</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{d}{dx}[e^{x\\ln b}] = e^{x\\ln b}\\cdot\\ln b = b^x\\ln b \\quad\\blacksquare$$'}</p>
                  </ToggleAnswer>
                </div>
                <div style={S.thmBox}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:'#d4a017', textTransform:'uppercase', marginBottom:'8px' }}>Derivative of log_b x</div>
                  <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$\\frac{d}{dx}[\\log_b x] = \\frac{1}{x\\ln b}$$'}</p>
                  <ToggleAnswer label="Derive it" btnStyle={{...S.toggleBtn, fontSize:'.62rem', padding:'5px 12px', marginTop:'6px'}} boxStyle={S.revealBox}>
                    <p style={S.p}>Write {'$\\log_b x = \\frac{\\ln x}{\\ln b}$'}. Since {'$\\ln b$'} is constant:</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{d}{dx}\\left[\\frac{\\ln x}{\\ln b}\\right] = \\frac{1}{\\ln b}\\cdot\\frac{1}{x} = \\frac{1}{x\\ln b} \\quad\\blacksquare$$'}</p>
                  </ToggleAnswer>
                </div>
              </div>

              <div style={S.calloutBlue}>
                <strong>Note:</strong> When {'$b=e$'}: {'$\\frac{d}{dx}[e^x]=e^x\\ln e=e^x$'} ✓ and {'$\\frac{d}{dx}[\\log_e x]=\\frac{1}{x\\ln e}=\\frac{1}{x}$'} ✓. The natural base gives the cleanest formulas — no extra {'$\\ln b$'} factor.
              </div>

              {[
                { n:'Example 3', col:'#c0392b', h4:S.h4red, q:'Differentiate $f(x)=3^x$, $g(x)=10^{2x}$, $h(x)=\\log_5(x^2+1)$',
                  sol:<>
                    <p style={S.p}>{'$f\'(x)=3^x\\ln 3$'}</p>
                    <p style={S.p}>{'$g\'(x)=10^{2x}\\cdot\\ln 10\\cdot 2=2\\ln 10\\cdot 10^{2x}$'} (chain rule)</p>
                    <p style={S.p}>{'$h\'(x)=\\dfrac{1}{(x^2+1)\\ln 5}\\cdot 2x=\\dfrac{2x}{(x^2+1)\\ln 5}$'} (chain rule)</p>
                  </>},
                { n:'Example 4', col:'#d4a017', h4:S.h4gold, q:'Find all critical points of $f(x)=x\\cdot 2^x$',
                  sol:<>
                    <p style={S.p}><strong>Product rule:</strong> {'$f\'(x)=2^x+x\\cdot 2^x\\ln 2=2^x(1+x\\ln 2)$'}.</p>
                    <p style={S.p}>Set {'$f\'(x)=0$'}: Since {'$2^x>0$'} always, we need {'$1+x\\ln 2=0$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$x=-\\frac{1}{\\ln 2}\\approx -1.443$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>{'$f\'\'(x)=2^x\\ln 2(1+x\\ln 2)+2^x\\ln 2=2^x\\ln 2(2+x\\ln 2)$'}. At critical point: positive → local minimum.</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── APPLICATIONS ── */}
            <section id="applications" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Applications</div>
              <h2 style={S.h2}>Calculus with Exponential<br/>&amp; Logarithmic Functions</h2>

              <h3 style={S.h3teal}>Marginal Revenue with Logarithmic Demand</h3>
              <p style={S.p}>A commodity's demand function is often logarithmic at high quantities. The derivative gives us marginal revenue — the revenue from selling one additional unit.</p>

              {[
                { n:'Example 5', col:'#c0392b', h4:S.h4red,
                  title:'Marginal Revenue — Log Demand',
                  q:'The demand for a product is $p = 120 - 30\\ln q$ (PKR). Find the revenue function $R(q)$ and marginal revenue $R\'(q)$. At what quantity is marginal revenue zero?',
                  sol:<>
                    <p style={S.p}><strong>Revenue:</strong> {'$R(q)=q\\cdot p=q(120-30\\ln q)=120q-30q\\ln q$'}</p>
                    <p style={S.p}><strong>Marginal revenue</strong> (product rule for {'$q\\ln q$'}):</p>
                    <p style={{ textAlign:'center' }}>{'$$R\'(q)=120-30(\\ln q+q\\cdot\\tfrac{1}{q})=120-30\\ln q-30=\\boxed{90-30\\ln q}$$'}</p>
                    <p style={S.p}><strong>Set {'$R\'=0$'}:</strong> {'$90=30\\ln q \\Rightarrow \\ln q=3 \\Rightarrow q=e^3\\approx 20.1$'} units.</p>
                    <p style={{...S.p,marginBottom:0}}>For {'$q<e^3$'}: MR{'$>0$'} (revenue increasing). For {'$q>e^3$'}: MR{'$<0$'} (revenue decreasing). Maximum revenue at {'$q=e^3$'}.</p>
                  </>},
                { n:'Example 6', col:'#d4a017', h4:S.h4gold,
                  title:'Marginal Cost — Exponential Cost Function',
                  q:'A company\'s total cost is $C(q)=500+200e^{0.02q}$ (PKR). Find marginal cost at $q=50$ and $q=100$ units.',
                  sol:<>
                    <p style={S.p}>{'$C\'(q)=200\\cdot 0.02\\cdot e^{0.02q}=4e^{0.02q}$'}</p>
                    <p style={S.p}>{'$C\'(50)=4e^1=4e\\approx\\text{PKR }10.87$'} per unit.</p>
                    <p style={{...S.p,marginBottom:0}}>{'$C\'(100)=4e^2\\approx\\text{PKR }29.56$'} per unit. The marginal cost grows exponentially — each additional unit costs more than the previous.</p>
                  </>},
                { n:'Example 7', col:'#1a6b6b', h4:S.h4teal,
                  title:'Marginal Revenue — Another Log Demand',
                  q:'Demand: $p=\\dfrac{400}{\\ln(q+1)}$ PKR. Find $R\'(q)$ and evaluate at $q=9$.',
                  sol:<>
                    <p style={S.p}>{'$R(q)=\\dfrac{400q}{\\ln(q+1)}$'}. Quotient rule:</p>
                    <p style={{ textAlign:'center' }}>{'$$R\'(q)=\\frac{400\\ln(q+1)-400q\\cdot\\frac{1}{q+1}}{[\\ln(q+1)]^2}=\\frac{400\\left[\\ln(q+1)-\\frac{q}{q+1}\\right]}{[\\ln(q+1)]^2}$$'}</p>
                    <p style={S.p}>At {'$q=9$'}: {'$\\ln 10\\approx2.303$'}, {'$\\frac{9}{10}=0.9$'}.</p>
                    <p style={{...S.p,marginBottom:0}}>{'$R\'(9)=\\dfrac{400(2.303-0.9)}{(2.303)^2}\\approx\\dfrac{400\\times1.403}{5.303}\\approx\\boxed{\\text{PKR }105.8}$'}</p>
                  </>},
                { n:'Example 8', col:'#2980b9', h4:S.h4blue,
                  title:'Optimisation — Maximising Profit',
                  q:'Profit: $P(q)=400q e^{-0.05q}-1000$ (PKR). Find the production level that maximises profit.',
                  sol:<>
                    <p style={S.p}><strong>Product rule:</strong></p>
                    <p style={{ textAlign:'center' }}>{'$$P\'(q)=400e^{-0.05q}+400q\\cdot(-0.05)e^{-0.05q}=400e^{-0.05q}(1-0.05q)$$'}</p>
                    <p style={S.p}>Since {'$400e^{-0.05q}>0$'}: set {'$1-0.05q=0 \\Rightarrow \\boxed{q=20}$'} units.</p>
                    <p style={S.p}>{'$P(20)=400(20)e^{-1}-1000=8000e^{-1}-1000\\approx 8000(0.368)-1000\\approx\\text{PKR }1{,}943$'}.</p>
                    <p style={{...S.p,marginBottom:0}}>{'$P\'\'(q)<0$'} at {'$q=20$'} → confirmed maximum.</p>
                  </>},
              ].map(({ n, col, h4, title, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', color:col, marginBottom:'3px' }}>{n}</div>
                  <h4 style={{ ...h4, marginBottom:'6px' }}>{title}</h4>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}

              {/* Optimisation */}
              <h3 style={S.h3teal}>Optimisation Problems</h3>
              {[
                { n:'Example 9', col:'#27ae60', h4:S.h4green,
                  title:'Minimising Average Cost',
                  q:'Average cost: $\\overline{C}(q)=\\dfrac{e^{0.1q}}{q}+50$. Find the quantity minimising average cost.',
                  sol:<>
                    <p style={S.p}><strong>Quotient rule on {'$e^{0.1q}/q$'}:</strong></p>
                    <p style={{ textAlign:'center' }}>{'$$\\overline{C}\'(q)=\\frac{0.1e^{0.1q}\\cdot q-e^{0.1q}}{q^2}=\\frac{e^{0.1q}(0.1q-1)}{q^2}$$'}</p>
                    <p style={S.p}>Set {'$\\overline{C}\'=0$'}: {'$0.1q-1=0 \\Rightarrow \\boxed{q=10}$'} units.</p>
                  </>},
                { n:'Example 10', col:'#c0392b', h4:S.h4red,
                  title:'Optimal Pricing with Exponential Demand',
                  q:'Demand: $q=1000e^{-0.5p}$. Revenue: $R=pq=1000pe^{-0.5p}$. Find the price $p$ that maximises revenue.',
                  sol:<>
                    <p style={S.p}><strong>Product rule:</strong> {'$R\'(p)=1000e^{-0.5p}+1000p(-0.5)e^{-0.5p}=1000e^{-0.5p}(1-0.5p)$'}</p>
                    <p style={S.p}>Set {'$R\'=0$'}: {'$1-0.5p=0 \\Rightarrow \\boxed{p=\\text{PKR }2}$'}.</p>
                    <p style={{...S.p,marginBottom:0}}>{'$q=1000e^{-1}\\approx368$'} units at revenue {'$2\\times368\\approx\\text{PKR }736$'}.</p>
                  </>},
                { n:'Example 11', col:'#d4a017', h4:S.h4gold,
                  title:'Maximum of f(x) = ln x / x',
                  q:'Find the maximum value of $f(x)=\\dfrac{\\ln x}{x}$ for $x>0$.',
                  sol:<>
                    <p style={S.p}><strong>Quotient rule:</strong> {'$f\'(x)=\\dfrac{\\frac{1}{x}\\cdot x-\\ln x}{x^2}=\\dfrac{1-\\ln x}{x^2}$'}</p>
                    <p style={S.p}>Set {'$f\'=0$'}: {'$1-\\ln x=0 \\Rightarrow \\ln x=1 \\Rightarrow x=e$'}.</p>
                    <p style={{...S.p,marginBottom:0}}>Maximum value: {'$f(e)=\\dfrac{\\ln e}{e}=\\boxed{\\dfrac{1}{e}}$'}.</p>
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

            {/* ── ELASTICITY ── */}
            <section id="elasticity" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Elasticity of Demand</div>
              <h2 style={S.h2}>Elasticity:<br/>How Sensitive Is Demand?</h2>

              <div style={S.defBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#1a6b6b', marginBottom:'10px' }}>Elasticity of Demand</div>
                <p style={S.p}>The <strong>elasticity of demand</strong> {'$\\eta$'} measures the percentage change in quantity demanded per 1% change in price:</p>
                <p style={{ textAlign:'center', fontSize:'1.1rem' }}>{'$$\\eta = \\frac{p}{q}\\cdot\\frac{dq}{dp}$$'}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', margin:'12px 0' }}>
                  {[['|η| < 1','Inelastic','Price ↑ → Revenue ↑'],['|η| = 1','Unit elastic','Max revenue'],['|η| > 1','Elastic','Price ↑ → Revenue ↓']].map(([cond,name,effect])=>(
                    <div key={name} style={{ background:'#fff', borderRadius:'6px', padding:'10px 12px', border:'1px solid #e0d6c8', textAlign:'center' }}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#1a6b6b', fontWeight:700 }}>{cond}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', color:'#d4a017' }}>{name}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.6rem', color:'#7f8c8d', marginTop:'3px' }}>{effect}</div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { n:'Example 12', col:'#c0392b', h4:S.h4red,
                  q:'Demand: $q=500e^{-0.4p}$. Find elasticity. Is demand elastic or inelastic at $p=5$?',
                  sol:<>
                    <p style={S.p}><strong>Find {'$dq/dp$'}:</strong> {'$\\frac{dq}{dp}=-200e^{-0.4p}$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\eta=\\frac{p}{q}\\cdot(-200e^{-0.4p})=\\frac{p}{500e^{-0.4p}}\\cdot(-200e^{-0.4p})=-\\frac{200p}{500}=-0.4p$$'}</p>
                    <p style={S.p}>At {'$p=5$'}: {'$\\eta=-0.4\\times5=-2$'}. Since {'$|\\eta|=2>1$'}: demand is <strong>elastic</strong> — a price increase reduces revenue.</p>
                  </>},
                { n:'Example 13', col:'#d4a017', h4:S.h4gold,
                  q:'Demand: $q=\\dfrac{1000}{\\ln(2p+1)}$. Find the elasticity at $p=10$.',
                  sol:<>
                    <p style={S.p}><strong>Find {'$dq/dp$'}:</strong> {'$\\frac{dq}{dp}=-\\dfrac{1000}{[\\ln(2p+1)]^2}\\cdot\\dfrac{2}{2p+1}=-\\dfrac{2000}{(2p+1)[\\ln(2p+1)]^2}$'}</p>
                    <p style={S.p}>At {'$p=10$'}: {'$q=\\frac{1000}{\\ln 21}\\approx\\frac{1000}{3.045}\\approx328$'}, {'$\\frac{dq}{dp}\\approx\\frac{-2000}{21\\times9.272}\\approx-10.27$'}.</p>
                    <p style={{...S.p,marginBottom:0}}>{'$\\eta=\\frac{10}{328}\\times(-10.27)\\approx-0.313$'}. Since {'$|\\eta|<1$'}: <strong>inelastic</strong>.</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}
            </section>

            {/* ── LOGARITHMIC DIFFERENTIATION ── */}
            <section id="logdiff" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Logarithmic Differentiation</div>
              <h2 style={S.h2}>Using Logarithms to<br/>Simplify Differentiation</h2>

              <p style={S.p}>When a function involves complicated products, quotients, or variable exponents, taking the natural log first — then differentiating implicitly — often produces a far simpler calculation.</p>

              <div style={S.thmBox}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d4a017', marginBottom:'10px' }}>Logarithmic Differentiation — Procedure</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {['Step 1: Take the natural log of both sides: $y = f(x) \\Rightarrow \\ln y = \\ln f(x)$',
                    'Step 2: Simplify $\\ln f(x)$ using log rules (products → sums, powers → factors)',
                    'Step 3: Differentiate both sides implicitly with respect to $x$: $\\frac{1}{y}\\frac{dy}{dx} = \\ldots$',
                    'Step 4: Solve for $\\frac{dy}{dx}$ by multiplying both sides by $y = f(x)$',
                  ].map((s,i)=>(
                    <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start', background:'#fff', borderRadius:'6px', padding:'10px 14px', border:'1px solid #e8d9a0' }}>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#d4a017', fontWeight:700, flexShrink:0 }}>Step {i+1}</span>
                      <span style={{ fontSize:'.95rem' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison examples */}
              <h3 style={S.h3teal}>Direct vs Logarithmic Differentiation — Side by Side</h3>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 14 (Comparison) — {'$y = x^3(x+1)^4(x+2)^2$'}</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', margin:'12px 0' }}>
                  <div style={{ background:'#fff5f5', border:'1px solid #c0392b', borderRadius:'8px', padding:'14px 16px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#c0392b', textTransform:'uppercase', marginBottom:'8px' }}>✗ Direct (Product Rule Twice)</div>
                    <p style={{ fontSize:'.88rem', color:'#7f8c8d' }}>Apply product rule to {'$x^3\\cdot[(x+1)^4(x+2)^2]$'}, then again inside. Results in three terms, each requiring simplification. Messy and error-prone.</p>
                  </div>
                  <div style={{ background:'#f0faf4', border:'1px solid #27ae60', borderRadius:'8px', padding:'14px 16px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#27ae60', textTransform:'uppercase', marginBottom:'8px' }}>✓ Logarithmic Differentiation</div>
                    <p style={{ fontSize:'.88rem', color:'#1a1a2e' }}>{'$\\ln y = 3\\ln x+4\\ln(x+1)+2\\ln(x+2)$'}</p>
                    <p style={{ fontSize:'.88rem', color:'#1a1a2e' }}>{'$\\dfrac{y\'}{y}=\\dfrac{3}{x}+\\dfrac{4}{x+1}+\\dfrac{2}{x+2}$'}</p>
                  </div>
                </div>
                <ToggleAnswer label="Show Full Solution via Log Differentiation" btnStyle={{...S.toggleBtn,background:'#d4a017'}}>
                  <p style={S.p}><strong>Step 1-2:</strong> {'$\\ln y=3\\ln x+4\\ln(x+1)+2\\ln(x+2)$'}</p>
                  <p style={S.p}><strong>Step 3:</strong> {'$\\dfrac{y\'}{y}=\\dfrac{3}{x}+\\dfrac{4}{x+1}+\\dfrac{2}{x+2}$'}</p>
                  <p style={S.p}><strong>Step 4:</strong></p>
                  <p style={{ textAlign:'center' }}>{'$$y\'=x^3(x+1)^4(x+2)^2\\left[\\frac{3}{x}+\\frac{4}{x+1}+\\frac{2}{x+2}\\right]$$'}</p>
                  <p style={{...S.p,marginBottom:0}}>The answer is already factored — far cleaner than triple product-rule expansion.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 15 (Comparison) — {'$y = \\dfrac{(x+1)^3\\sqrt{x^2+2}}{(3x+1)^4}$'}</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', margin:'12px 0' }}>
                  <div style={{ background:'#fff5f5', border:'1px solid #c0392b', borderRadius:'8px', padding:'14px 16px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#c0392b', textTransform:'uppercase', marginBottom:'8px' }}>✗ Direct (Quotient + Product)</div>
                    <p style={{ fontSize:'.88rem', color:'#7f8c8d' }}>Quotient rule gives a numerator requiring product rule, which itself requires chain rule for {'$\\sqrt{x^2+2}$'}. Result is a single unsimplified fraction with multiple terms. Extremely messy.</p>
                  </div>
                  <div style={{ background:'#eef7f7', border:'1px solid #1a6b6b', borderRadius:'8px', padding:'14px 16px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#1a6b6b', textTransform:'uppercase', marginBottom:'8px' }}>✓ Logarithmic Differentiation</div>
                    <p style={{ fontSize:'.88rem', color:'#1a1a2e' }}>{'$\\ln y=3\\ln(x+1)+\\frac{1}{2}\\ln(x^2+2)-4\\ln(3x+1)$'}</p>
                    <p style={{ fontSize:'.88rem', color:'#1a1a2e' }}>Three clean fractions, each one easy.</p>
                  </div>
                </div>
                <ToggleAnswer label="Show Full Solution" btnStyle={{...S.toggleBtn,background:'#1a6b6b'}}>
                  <p style={S.p}><strong>Step 3:</strong></p>
                  <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\frac{3}{x+1}+\\frac{x}{x^2+2}-\\frac{12}{3x+1}$$'}</p>
                  <p style={S.p}><strong>Step 4:</strong></p>
                  <p style={{ textAlign:'center' }}>{'$$y\'=\\frac{(x+1)^3\\sqrt{x^2+2}}{(3x+1)^4}\\left[\\frac{3}{x+1}+\\frac{x}{x^2+2}-\\frac{12}{3x+1}\\right]$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Hard examples */}
              {[
                { n:'Example 16', col:'#c0392b', h4:S.h4red, q:'Differentiate $y=x^x$ (variable base AND exponent)',
                  sol:<>
                    <p style={S.p}>Cannot use either power rule or exponential rule directly — the exponent is also a variable!</p>
                    <p style={S.p}><strong>Log differentiation:</strong> {'$\\ln y=x\\ln x$'}.</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\ln x+x\\cdot\\frac{1}{x}=\\ln x+1$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\boxed{y\'=x^x(1+\\ln x)}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>Critical point at {'$y\'=0$'}: {'$\\ln x=-1 \\Rightarrow x=1/e$'}. Minimum at {'$y=(1/e)^{1/e}\\approx 0.6922$'}.</p>
                  </>},
                { n:'Example 17', col:'#d4a017', h4:S.h4gold, q:'Differentiate $y=(\\ln x)^x$',
                  sol:<>
                    <p style={S.p}><strong>Log differentiation:</strong> {'$\\ln y=x\\ln(\\ln x)$'}. Chain rule on right side:</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\ln(\\ln x)+x\\cdot\\frac{1}{\\ln x}\\cdot\\frac{1}{x}=\\ln(\\ln x)+\\frac{1}{\\ln x}$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\boxed{y\'=(\\ln x)^x\\left[\\ln(\\ln x)+\\frac{1}{\\ln x}\\right]}$$'}</p>
                  </>},
                { n:'Example 18', col:'#1a6b6b', h4:S.h4teal, q:'Differentiate $y=\\dfrac{x^4(x-1)^{3/2}}{(2x+1)^5 e^{2x}}$',
                  sol:<>
                    <p style={S.p}><strong>Take log:</strong> {'$\\ln y=4\\ln x+\\frac{3}{2}\\ln(x-1)-5\\ln(2x+1)-2x$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\frac{4}{x}+\\frac{3}{2(x-1)}-\\frac{10}{2x+1}-2$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$y\'=\\frac{x^4(x-1)^{3/2}}{(2x+1)^5e^{2x}}\\left[\\frac{4}{x}+\\frac{3}{2(x-1)}-\\frac{10}{2x+1}-2\\right]$$'}</p>
                  </>},
                { n:'Example 19', col:'#2980b9', h4:S.h4blue, q:'Differentiate $y=x^{\\sin x}$',
                  sol:<>
                    <p style={S.p}><strong>Log differentiation:</strong> {'$\\ln y=\\sin x\\cdot\\ln x$'}. Product rule on right:</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\cos x\\cdot\\ln x+\\sin x\\cdot\\frac{1}{x}$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\boxed{y\'=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)}$$'}</p>
                  </>},
                { n:'Example 20', col:'#27ae60', h4:S.h4green, q:'Differentiate $y=\\left(\\dfrac{x^2+1}{x^2-1}\\right)^{3/2}$ — compare direct vs log',
                  sol:<>
                    <p style={S.p}><strong>Direct (chain + quotient):</strong> {'$y\'=\\frac{3}{2}\\left(\\frac{x^2+1}{x^2-1}\\right)^{1/2}\\cdot\\frac{2x(x^2-1)-2x(x^2+1)}{(x^2-1)^2}$'}. The numerator simplifies to {'$-4x$'}, giving a messy expression.</p>
                    <p style={S.p}><strong>Log differentiation (cleaner):</strong></p>
                    <p style={S.p}>{'$\\ln y=\\frac{3}{2}[\\ln(x^2+1)-\\ln(x^2-1)]$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$\\frac{y\'}{y}=\\frac{3}{2}\\left[\\frac{2x}{x^2+1}-\\frac{2x}{x^2-1}\\right]=\\frac{3}{2}\\cdot\\frac{2x[(x^2-1)-(x^2+1)]}{(x^2+1)(x^2-1)}=\\frac{3}{2}\\cdot\\frac{-4x}{x^4-1}$$'}</p>
                    <p style={{ textAlign:'center' }}>{'$$y\'=\\left(\\frac{x^2+1}{x^2-1}\\right)^{3/2}\\cdot\\frac{-6x}{x^4-1}$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>Both approaches give the same answer but log differentiation avoids the messy quotient-inside-chain computation.</p>
                  </>},
              ].map(({ n, col, h4, q, sol }) => (
                <div key={n} style={{...S.card, borderLeft:`4px solid ${col}`, marginBottom:'16px'}}>
                  <h4 style={{ ...h4, marginBottom:'8px' }}>{n} — {q}</h4>
                  <ToggleAnswer label="Show Solution" btnStyle={{...S.toggleBtn,background:col}}>{sol}</ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}>
                <strong style={{ color:'#1a6b6b' }}>Coming up next —</strong> §4.4 Exponential Models — we apply everything from Ch 4 to build and analyse complete models: population growth, spread of disease, cooling laws, and compound growth with withdrawals.
              </div>
            </section>

          </div>

          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s42" style={S.lnfBtnPrev}>← §4.2 Logarithmic Functions</Link>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#7f8c8d', textAlign:'center' }}>§4.3 · Chapter 4 · Calculus I</div>
            <Link href="/courses/calc1/s51" style={S.lnfBtnNext}>§5.1 Indefinite Integration →</Link>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}