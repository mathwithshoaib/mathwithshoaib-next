'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

const S = {
  stickySubnav: { position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' },
  bcRow: { padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' },
  bcLink: { color: 'var(--amber)', textDecoration: 'none' },
  bcCur: { color: 'var(--text2)', fontWeight: 500 },
  courseSwitcher: { display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' },
  cswLink: { fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text3)', padding: '9px 18px', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', transition: 'all .2s', textDecoration: 'none' },
  cswActive: { color: 'var(--amber)', borderBottom: '2px solid var(--amber)' },
  courseFrame: { display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' },
  csb: { width: '252px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px + 37px + 40px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' },
  csbHead: { padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' },
  csbTag: { fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' },
  csbTitle: { fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 },
  csbBack: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' },
  cmain: { flex: 1, minWidth: 0, background: '#fdf8f0', overflow: 'hidden', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.05rem', lineHeight: 1.8, color: '#1a1a2e' },
  lecInner: { maxWidth: '100%', margin: '0 auto', padding: '0 52px 60px' },
  lecHero: { background: '#1a1a2e', color: '#fdf8f0', padding: '52px 40px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  lecHeroTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '14px', position: 'relative' },
  lecHeroH1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '10px', position: 'relative' },
  lecHeroSub: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.85rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#38c9b0', marginBottom: '18px', position: 'relative' },
  lecHeroP: { fontSize: '1rem', color: '#c9c2b8', maxWidth: '580px', margin: '0 auto 24px', position: 'relative' },
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
  lbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' },
  callout:      { background: '#fdf0ef', borderLeft: '4px solid #c0392b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutTeal:  { background: '#eef7f7', borderLeft: '4px solid #1a6b6b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGold:  { background: '#fff8ec', borderLeft: '4px solid #d4a017', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGreen: { background: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutBlue:  { background: '#f0f4ff', borderLeft: '4px solid #2980b9', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  toggleBtn:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a1a2e', color: '#d4a017', border: 'none', borderRadius: '6px', padding: '9px 20px', cursor: 'pointer', marginTop: '10px' },
  toggleBtnGreen: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a6b6b', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', marginTop: '8px', marginRight: '8px' },
  toggleBtnBlue:  { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', marginTop: '8px' },
  answerBox: { background: '#f0f9f0', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '18px 22px', marginTop: '12px' },
  secLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.26em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '8px' },
  divider:    { width: '100%', height: '1px', background: '#e0d6c8', margin: '52px 0' },
  subDivider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '36px 0' },
  widget: { background: '#1a1a2e', borderRadius: '16px', padding: '26px 26px 18px', margin: '30px 0', color: '#e8e2d9' },
  wt: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  lecFooterNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px', borderTop: '1px solid #e0d6c8', flexWrap: 'wrap', gap: '12px', background: '#fdf8f0' },
  lnfBtnPrev: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#2980b9', border: '1px solid #2980b9', background: '#f0f4ff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  lnfBtnNext:  { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#1a6b6b', border: '1px solid #1a6b6b', background: '#eef7f7', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  table:   { width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '.94rem' },
  th:      { background: '#1a1a2e', color: '#d4a017', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', padding: '9px 13px', textAlign: 'left' },
  td:      { padding: '8px 13px', borderBottom: '1px solid #e0d6c8' },
  tdEven:  { padding: '8px 13px', borderBottom: '1px solid #e0d6c8', background: '#f5ede0' },
  h2:      { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.7rem,4vw,2.55rem)', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2, color: '#1a1a2e' },
  h3teal:  { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.32rem', fontWeight: 700, margin: '30px 0 12px', color: '#1a6b6b' },
  h4red:   { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#c0392b' },
  h4gold:  { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#d4a017' },
  h4teal:  { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#1a6b6b' },
  h4blue:  { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#2980b9' },
  h4green: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#27ae60' },
  p: { marginBottom: '16px', color: '#1a1a2e' },
};

const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: ['1.1 · Functions','1.2 · The Graph','1.3 · Lines & Linear Functions','1.4 · Functional Models','1.5 · Limits','1.6 · Continuity'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: ['2.1 · The Derivative','2.2 · Differentiation Techniques','2.3 · Product & Quotient Rules','2.4 · The Chain Rule','2.5 · Marginal Analysis','2.6 · Implicit Differentiation'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 3 — Applications of the Derivative', items: ['3.1 · Increasing & Decreasing','3.2 · Concavity','3.3 · Curve Sketching','3.4 · Optimization','3.5 · Additional Optimization'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: ['4.1 · Exponential Functions','4.2 · Logarithmic Functions','4.3 · Differentiation','4.4 · Exponential Models'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration',         href: '/courses/calc1/s51', live: true },
    { label: '5.2 · Integration by Substitution',    href: '/courses/calc1/s52', live: true },
    { label: '5.3 · Definite Integral & FTC',        href: '/courses/calc1/s53', live: true },
    { label: '5.4 · Applying Definite Integration',  href: '/courses/calc1/s54', live: true },
    { label: '5.5 · Applications to Business',       href: '/courses/calc1/s55', active: true, live: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: [
    { label: '6.1 · Integration by Parts',  href: '/courses/calc1/s61', live: true },
    { label: '6.2 · Numerical Integration', soon: true },
    { label: '6.3 · Improper Integrals',    soon: true },
    { label: '6.4 · Continuous Probability',soon: true },
  ]},
];

function ToggleAnswer({ label = 'Show Solution', children, btnStyle }) {
  const ref = useRef(null);
  const toggle = () => {
    const el = ref.current; if (!el) return;
    const visible = el.style.display === 'block';
    el.style.display = visible ? 'none' : 'block';
    if (!visible && window.MathJax?.typesetPromise) window.MathJax.typesetPromise([el]);
  };
  return (
    <>
      <button style={btnStyle || S.toggleBtn} onClick={toggle}>{label}</button>
      <div ref={ref} style={{ ...S.answerBox, display: 'none' }}>{children}</div>
    </>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside style={S.csb} className="csb-hide">
      <div style={S.csbHead}>
        <div style={S.csbTag}>MATH-101 · Calculus I</div>
        <div style={S.csbTitle}>Course Contents</div>
        <Link href="/courses/calc1" style={S.csbBack}>← All Courses</Link>
      </div>
      <nav style={{ padding: '8px 0 24px' }}>
        {TOC.map((sec, i) => {
          if (sec.ch === 'Course Overview') return (
            <Link key="co" href="/courses/calc1" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', textDecoration:'none' }}>
              <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--border2)', display:'inline-block' }}/>Course Overview
            </Link>
          );
          const isOpen = !!sidebarOpen[i];
          const hasLive = sec.items.some(it => it.live || it.href);
          return (
            <div key={sec.ch} style={{ borderBottom:'1px solid var(--border)' }}>
              <button onClick={()=>setSidebarOpen(p=>({...p,[i]:!p[i]}))} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:hasLive?'var(--teal)':'var(--text3)', textAlign:'left' }}>
                <span>{sec.ch}</span>
                <span style={{ fontSize:'.6rem', display:'inline-block', transform:isOpen?'rotate(180deg)':'rotate(0)' }}>▾</span>
              </button>
              {isOpen && (
                <div style={{ paddingBottom:'6px' }}>
                  {sec.items.map(item =>
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

// ─── Income Stream Timeline Widget ───────────────────────────────────────
function IncomeStreamWidget() {
  const canvasRef = useRef(null);
  const [rate,    setRate]   = useState(100);
  const [r,       setR]      = useState(8);
  const [T,       setT]      = useState(4);
  const [n,       setN]      = useState(6);
  const [view,    setView]   = useState('fv');
  const [fType,   setFType]  = useState('const');
  const [growth,  setGrowth] = useState(5);
  const [hovered, setHovered]= useState(null);
  const [tab,     setTab]    = useState('stream');

  const F_TYPES = {
    const:   { label: 'f(t) = C  (constant)',     fn: t => rate },
    grow:    { label: 'f(t) = C·e^(gt)  (growing)',fn: t => rate * Math.exp(growth/100*t) },
    linear:  { label: 'f(t) = C·(1+t/T)  (rise)', fn: t => rate * (1+t/Math.max(T,1)) },
    decline: { label: 'f(t) = C·e^(−gt)  (fall)', fn: t => rate * Math.exp(-growth/100*t) },
  };
  const fFn  = F_TYPES[fType].fn;
  const rDec = r / 100;

  const computeExact = () => {
    const g = growth/100;
    if (fType==='const') {
      const PV = rate*(1-Math.exp(-rDec*T))/rDec;
      return { FV: Math.exp(rDec*T)*PV, PV };
    } else if (fType==='grow') {
      const d = rDec-g, PV = Math.abs(d)<1e-9 ? rate*T : rate*(1-Math.exp(-d*T))/d;
      return { FV: Math.exp(rDec*T)*PV, PV };
    } else if (fType==='decline') {
      const s = rDec+g, PV = rate*(1-Math.exp(-s*T))/s;
      return { FV: Math.exp(rDec*T)*PV, PV };
    } else {
      const steps=2000, dtt=T/steps; let PV=0;
      for(let i=0;i<steps;i++){const t=(i+.5)*dtt; PV+=fFn(t)*Math.exp(-rDec*t)*dtt;}
      return { FV: Math.exp(rDec*T)*PV, PV };
    }
  };

  const getBars = () => {
    const out=[];
    for(let j=0;j<n;j++){
      const tj=(j+.5)*T/n, dt=T/n, ft=fFn(tj), dep=ft*dt;
      out.push({j,tj,dt,ft,dep,fv:dep*Math.exp(rDec*(T-tj)),pv:dep*Math.exp(-rDec*tj)});
    }
    return out;
  };
  const bars  = getBars();
  const exact = computeExact();
  const lumpYears = Array.from({length:Math.floor(T)+1},(_,i)=>i);
  const lumpVals  = lumpYears.map(yr=>rate*T*Math.exp(rDec*yr));

  const draw = (hovIdx) => {
    const canvas=canvasRef.current;
    if(!canvas||!canvas.offsetWidth) return;
    const dpr=window.devicePixelRatio||1;
    const W=canvas.offsetWidth, H=220;           // ← reduced from 340 to 220
    canvas.width=W*dpr; canvas.height=H*dpr;
    const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);

    const pad={l:52,r:20,t:36,b:46};
    const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;

    if(tab==='lump'){
      const maxV=lumpVals[lumpVals.length-1]*1.1;
      const bW=gW/lumpYears.length;
      const bY=v=>pad.t+gH-(v/maxV)*gH*0.9;
      for(let i=0;i<=4;i++){
        const v=maxV*0.9*i/4, y=bY(v);
        ctx.strokeStyle='#1e293b'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+gW,y); ctx.stroke();
        ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace'; ctx.textAlign='right';
        ctx.fillText(v.toFixed(0),pad.l-3,y+3);
      }
      lumpYears.forEach((yr,idx)=>{
        const val=lumpVals[idx], x=pad.l+idx*bW+3, bw=bW-6, y=bY(val), bh=pad.t+gH-y;
        const grad=ctx.createLinearGradient(x,y,x,pad.t+gH);
        grad.addColorStop(0,'#22c55edd'); grad.addColorStop(1,'#22c55e22');
        ctx.fillStyle=grad; ctx.fillRect(x,y,bw,bh);
        ctx.strokeStyle='#22c55e'; ctx.lineWidth=1.5; ctx.strokeRect(x,y,bw,bh);
        ctx.fillStyle='#86efac'; ctx.font='bold 9px IBM Plex Mono,monospace'; ctx.textAlign='center';
        ctx.fillText(val.toFixed(0),x+bw/2,y-4);
        ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace';
        ctx.fillText('yr'+yr,x+bw/2,pad.t+gH+12);
      });
      ctx.fillStyle='#22c55e'; ctx.font='bold 9px IBM Plex Mono,monospace'; ctx.textAlign='left';
      ctx.fillText('▸ Single deposit grows over time → bars INCREASE',pad.l,pad.t-14);
    } else {
      const barVals=bars.map(b=>view==='fv'?b.fv:b.pv);
      const maxVal=Math.max(...barVals,0.001);
      const bW=gW/n;
      const bY=v=>pad.t+gH-(v/maxVal)*gH*0.9;
      const CF=['#ef4444','#f97316','#f59e0b','#22c55e','#3b82f6','#a78bfa','#ec4899','#14b8a6','#fb923c','#84cc16'];
      const CP=['#a78bfa','#818cf8','#60a5fa','#34d399','#4ade80','#86efac','#bef264','#fde68a','#fca5a5','#f9a8d4'];
      const COLS=view==='fv'?CF:CP;
      for(let i=0;i<=4;i++){
        const v=maxVal*0.9*i/4, y=bY(v);
        ctx.strokeStyle='#1e293b'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+gW,y); ctx.stroke();
        ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace'; ctx.textAlign='right';
        ctx.fillText(v.toFixed(1),pad.l-3,y+3);
      }
      bars.forEach((bar,idx)=>{
        const val=barVals[idx], col=COLS[idx%COLS.length], isHov=hovIdx===idx;
        const x=pad.l+idx*bW+2, bw=bW-4, y=bY(val), bh=pad.t+gH-y;
        const grad=ctx.createLinearGradient(x,y,x,pad.t+gH);
        grad.addColorStop(0,col+(isHov?'ff':'dd'));
        grad.addColorStop(0.7,col+'55'); grad.addColorStop(1,col+'18');
        ctx.fillStyle=grad; ctx.fillRect(x,y,bw,bh);
        ctx.strokeStyle=col+(isHov?'ff':'99'); ctx.lineWidth=isHov?2:1.2;
        ctx.strokeRect(x,y,bw,bh);
        ctx.fillStyle=isHov?col:col+'cc';
        ctx.font=isHov?'bold 10px IBM Plex Mono,monospace':'9px IBM Plex Mono,monospace';
        ctx.textAlign='center'; ctx.fillText(val.toFixed(1),x+bw/2,y-4);
        if(isHov){
          ctx.fillStyle='#94a3b8'; ctx.font='8px IBM Plex Mono,monospace';
          ctx.fillText('dep='+bar.dep.toFixed(1)+'k',x+bw/2,y-16);
          ctx.fillText(view==='fv'?'grows '+(T-bar.tj).toFixed(1)+'yr':'disc.'+bar.tj.toFixed(1)+'yr',x+bw/2,y-27);
        }
        ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace'; ctx.textAlign='center';
        ctx.fillText('t≈'+bar.tj.toFixed(1),x+bw/2,pad.t+gH+12);
        const depY=bY(bar.dep);
        if(depY>pad.t&&depY<pad.t+gH){
          ctx.strokeStyle='#ffffff22'; ctx.lineWidth=1; ctx.setLineDash([3,2]);
          ctx.beginPath(); ctx.moveTo(x,depY); ctx.lineTo(x+bw,depY); ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      ctx.fillStyle=view==='fv'?'#fbbf24':'#c4b5fd';
      ctx.font='bold 9px IBM Plex Mono,monospace'; ctx.textAlign='left';
      ctx.fillText(view==='fv'
        ?'▸ FV: earlier deposit → more time to grow → taller bar'
        :'▸ PV: later income → more discounting → shorter bar',pad.l,pad.t-14);
      const ev=view==='fv'?exact.FV:exact.PV;
      ctx.fillStyle=view==='fv'?'#fbbf24':'#c4b5fd';
      ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='right';
      ctx.fillText('Exact '+(view==='fv'?'FV':'PV')+'='+ev.toFixed(1)+'k',pad.l+gW,pad.t-14);
    }

    // Axes
    ctx.strokeStyle='#334155'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t-6); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW+6,pad.t+gH); ctx.stroke();
    ctx.fillStyle='#334155';
    ctx.beginPath(); ctx.moveTo(pad.l+gW+6,pad.t+gH);
    ctx.lineTo(pad.l+gW,pad.t+gH-4); ctx.lineTo(pad.l+gW,pad.t+gH+4); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace'; ctx.textAlign='center';
    ctx.fillText('t=0',pad.l,pad.t+gH+24);
    ctx.strokeStyle='#d4a017'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pad.l+gW,pad.t+gH-5); ctx.lineTo(pad.l+gW,pad.t+gH+5); ctx.stroke();
    ctx.fillStyle='#d4a017'; ctx.font='bold 9px IBM Plex Mono,monospace';
    ctx.fillText('T='+T,pad.l+gW,pad.t+gH+24);
    ctx.save(); ctx.translate(11,pad.t+gH/2); ctx.rotate(-Math.PI/2);
    ctx.fillStyle='#475569'; ctx.font='8px IBM Plex Mono,monospace'; ctx.textAlign='center';
    ctx.fillText(tab==='lump'?'Value (PKR 000)':view==='fv'?'FV slice (PKR 000)':'PV slice (PKR 000)',0,0);
    ctx.restore();
  };

  useEffect(()=>{draw(hovered);},[rate,r,T,n,view,fType,growth,hovered,tab]);
  useEffect(()=>{const h=()=>draw(hovered); window.addEventListener('resize',h,{passive:true}); return()=>window.removeEventListener('resize',h);},[rate,r,T,n,view,fType,growth,hovered,tab]);

  const handleMouseMove = e => {
    if(tab==='lump'){setHovered(null);return;}
    const canvas=canvasRef.current; if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const bW=(rect.width-72)/n;
    const idx=Math.floor((mx-52)/bW);
    setHovered(idx>=0&&idx<n?idx:null);
  };

  const totalDep = bars.reduce((s,b)=>s+b.dep,0);
  const estFV    = bars.reduce((s,b)=>s+b.fv,0);
  const estPV    = bars.reduce((s,b)=>s+b.pv,0);

  // Compact shared styles
  const LS  = {fontFamily:"'IBM Plex Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#94a3b8'};
  const INP = {fontFamily:"'IBM Plex Mono',monospace",fontSize:'.74rem',background:'#1e293b',color:'#e2e8f0',border:'1px solid #334155',borderRadius:'5px',padding:'4px 8px',outline:'none'};
  const BTN = (active,col) => ({fontFamily:"'IBM Plex Mono',monospace",fontSize:'.64rem',letterSpacing:'.05em',background:active?col:'#1e293b',color:active?'#0f172a':'#64748b',border:`1.5px solid ${active?col:'#334155'}`,borderRadius:'5px',padding:'4px 10px',cursor:'pointer',fontWeight:active?700:400});
  const CARD = col => ({background:'#1e293b',border:`1px solid ${col}`,borderRadius:'7px',padding:'8px 10px',flex:1,minWidth:'100px'});

  return (
    <div style={S.widget}>

      {/* ── Row 1: Title + Tab + FV/PV toggle ── */}
      <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'6px',marginBottom:'10px'}}>
        <div style={{...S.wt,marginBottom:0,flex:1}}>💰 FV &amp; PV Visualiser</div>
        <button style={BTN(tab==='lump','#22c55e')} onClick={()=>setTab('lump')}>🏦 Lump Sum</button>
        <button style={BTN(tab==='stream','#d4a017')} onClick={()=>setTab('stream')}>📊 Income Stream</button>
        {tab==='stream' && <>
          <button style={BTN(view==='fv','#fbbf24')} onClick={()=>setView('fv')}>📈 FV</button>
          <button style={BTN(view==='pv','#c4b5fd')} onClick={()=>setView('pv')}>📉 PV</button>
        </>}
      </div>

      {/* ── Row 2: Concept explanation (2 lines max) ── */}
      <div style={{background:tab==='lump'?'#0a1f12':view==='fv'?'#1c1a0e':'#160f2a',border:`1px solid ${tab==='lump'?'#22c55e44':view==='fv'?'#d4a01744':'#a78bfa33'}`,borderRadius:'6px',padding:'8px 12px',marginBottom:'10px',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.67rem',color:'#94a3b8',lineHeight:1.55}}>
        {tab==='lump'
          ? <><strong style={{color:'#22c55e'}}>Lump sum:</strong> One deposit of PKR {(rate*T).toFixed(0)}k at t=0 earns interest continuously. Bars <strong style={{color:'#86efac'}}>INCREASE</strong> — same money compounds longer each year.</>
          : view==='fv'
            ? <><strong style={{color:'#fbbf24'}}>Income Stream FV:</strong> Each slice deposited at t_j grows for only (T−t_j) remaining years. First slice = most growth → tallest. Last slice = barely grows → shortest. <strong style={{color:'#ef4444'}}>Bars DECREASE</strong> left→right (opposite of lump sum!).</>
            : <><strong style={{color:'#c4b5fd'}}>Income Stream PV:</strong> Each slice discounted back to today by e^(−r·t_j). Income arriving late is worth less today. <strong style={{color:'#a78bfa'}}>Bars DECREASE</strong> left→right — later = more discounting.</>}
      </div>

      {/* ── Row 3: Controls (compact single row) ── */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'10px',alignItems:'flex-end'}}>
        {tab==='stream' && (
          <div style={{flex:2,minWidth:'160px'}}>
            <div style={{...LS,marginBottom:'3px',color:'#38c9b0'}}>f(t)</div>
            <select value={fType} onChange={e=>setFType(e.target.value)} style={{...INP,width:'100%',cursor:'pointer'}}>
              {Object.entries(F_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        )}
        {(fType==='grow'||fType==='decline')&&tab==='stream' && (
          <div>
            <div style={{...LS,marginBottom:'3px'}}>g%</div>
            <input type="number" value={growth} min="1" max="20" onChange={e=>setGrowth(+e.target.value||5)} style={{...INP,width:'52px'}}/>
          </div>
        )}
        <div>
          <div style={{...LS,marginBottom:'3px'}}>{tab==='lump'?'Deposit':'Rate C'} (PKR 000)</div>
          <input type="number" value={rate} min="10" max="500" step="10" onChange={e=>setRate(+e.target.value||100)} style={{...INP,width:'72px'}}/>
        </div>
        {[
          {lbl:'r',val:r,suf:'%',min:1,max:20,step:.5,set:setR},
          {lbl:'T',val:T,suf:'yr',min:1,max:10,step:.5,set:setT},
          ...(tab==='stream'?[{lbl:'n',val:n,suf:' slices',min:2,max:10,step:1,set:setN}]:[]),
        ].map((c,i)=>(
          <div key={i} style={{flex:1,minWidth:'90px'}}>
            <div style={{...LS,marginBottom:'3px'}}>{c.lbl} = <span style={{color:'#d4a017',fontWeight:700}}>{c.val}{c.suf}</span></div>
            <input type="range" min={c.min} max={c.max} step={c.step} value={c.val} onInput={e=>c.set(+e.target.value)} style={{WebkitAppearance:'none',width:'100%',height:'4px',background:'#1e293b',borderRadius:'2px',outline:'none'}}/>
          </div>
        ))}
      </div>

      {/* ── Canvas (compact height) ── */}
      <canvas
        ref={canvasRef}
        style={{display:'block',width:'100%',height:'220px',borderRadius:'8px',background:'#0f172a',cursor:tab==='stream'?'crosshair':'default'}}
        onMouseMove={handleMouseMove}
        onMouseLeave={()=>setHovered(null)}
      />
      {tab==='stream' && <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.6rem',color:'#334155',marginTop:'3px',textAlign:'center'}}>Hover a bar → see deposit size &amp; time to grow/discount</div>}

      {/* ── Stats (compact 3-col grid) ── */}
      {tab==='stream' ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(108px,1fr))',gap:'6px',marginTop:'10px'}}>
          {[
            {lbl:'Exact FV',    val:'PKR '+exact.FV.toFixed(1)+'k', sub:'e^(rT)·∫f·e^(−rt)dt', col:'#d4a017',vc:'#fbbf24'},
            {lbl:'Exact PV',    val:'PKR '+exact.PV.toFixed(1)+'k', sub:'∫f(t)·e^(−rt)dt',      col:'#a78bfa',vc:'#c4b5fd'},
            {lbl:'Deposited',   val:'PKR '+totalDep.toFixed(1)+'k', sub:'raw cash (no interest)',col:'#22c55e',vc:'#86efac'},
            {lbl:'Interest',    val:'PKR '+Math.max(0,exact.FV-totalDep).toFixed(1)+'k',sub:'FV − deposits',col:'#38c9b0',vc:'#6ee7b7'},
            {lbl:'Riemann err', val:(view==='fv'?Math.abs(estFV-exact.FV):Math.abs(estPV-exact.PV)).toFixed(2)+'k',sub:'n='+n+' vs exact',col:'#f97316',vc:'#fdba74'},
            {lbl:'FV=e^(rT)·PV',val:exact.FV.toFixed(0)+'=e^'+(rDec*T).toFixed(1)+'·'+exact.PV.toFixed(0),sub:'always true',col:'#475569',vc:'#94a3b8'},
          ].map((c,i)=>(
            <div key={i} style={CARD(c.col)}>
              <div style={{...LS,color:c.col,marginBottom:'3px'}}>{c.lbl}</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:i===5?'.66rem':'.9rem',color:c.vc,fontWeight:700,wordBreak:'break-all'}}>{c.val}</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.57rem',color:'#475569',marginTop:'1px'}}>{c.sub}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:'6px',marginTop:'10px'}}>
          {[
            {lbl:'Deposited', val:'PKR '+(rate*T).toFixed(0)+'k', sub:'at t=0',col:'#22c55e',vc:'#86efac'},
            {lbl:'FV at T='+T,val:'PKR '+(rate*T*Math.exp(rDec*T)).toFixed(1)+'k',sub:'P·e^(rT)',col:'#d4a017',vc:'#fbbf24'},
            {lbl:'Growth ×',  val:'×'+Math.exp(rDec*T).toFixed(3),sub:`e^(${r}%×${T}yr)`,col:'#3b82f6',vc:'#93c5fd'},
            {lbl:'Interest',  val:'PKR '+(rate*T*(Math.exp(rDec*T)-1)).toFixed(1)+'k',sub:'FV − deposit',col:'#38c9b0',vc:'#6ee7b7'},
          ].map((c,i)=>(
            <div key={i} style={CARD(c.col)}>
              <div style={{...LS,color:c.col,marginBottom:'3px'}}>{c.lbl}</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.9rem',color:c.vc,fontWeight:700}}>{c.val}</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.57rem',color:'#475569',marginTop:'1px'}}>{c.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Key insight (single compact line) ── */}
      <div style={{marginTop:'8px',background:'#1e293b',borderRadius:'6px',padding:'8px 12px',borderLeft:`3px solid ${tab==='lump'?'#22c55e':view==='fv'?'#d4a017':'#a78bfa'}`,fontFamily:"'IBM Plex Mono',monospace",fontSize:'.67rem',color:'#94a3b8',lineHeight:1.55}}>
        <span style={{color:tab==='lump'?'#22c55e':view==='fv'?'#d4a017':'#a78bfa',fontWeight:700}}>💡 </span>
        {tab==='lump'
          ? `Lump sum bars INCREASE — the single deposit earns interest every year and keeps growing. FV = ${(rate*T).toFixed(0)}k × e^${(rDec*T).toFixed(2)} = ${(rate*T*Math.exp(rDec*T)).toFixed(1)}k.`
          : view==='fv'
            ? `Income stream FV bars DECREASE — early deposits earn MORE interest because they have longer to grow. This is the opposite of a lump sum. Switch to Lump Sum tab to compare!`
            : `PV bars DECREASE — income arriving later is discounted more. Raise r to see the rightmost bars almost vanish — far-future money is nearly worthless at high interest rates.`}
      </div>
    </div>
  );
}

// ─── Surplus Visualiser ───────────────────────────────────────────────────
function SurplusWidget() {
  const canvasRef = useRef(null);
  const [mode,  setMode]  = useState('cs');
  const [q0,    setQ0]    = useState(3);
  const [dType, setDType] = useState('linear');
  const [sType, setSType] = useState('linear');

  const DEMAND = {
    linear:    { fn: q => Math.max(0, 50 - 8*q),       label: 'D(q) = 50 − 8q' },
    quad:      { fn: q => Math.max(0, 60 - 4*q*q),     label: 'D(q) = 60 − 4q²' },
    hyperbola: { fn: q => Math.max(0, 80/(q+1)),        label: 'D(q) = 80/(q+1)' },
    grain:     { fn: q => Math.max(0, 10*(25 - q*q)),   label: 'D(q) = 10(25−q²)' },
  };
  const SUPPLY = {
    linear: { fn: q => 5 + 4*q,               label: 'S(q) = 5 + 4q' },
    quad:   { fn: q => 2 + 2*q*q,             label: 'S(q) = 2 + 2q²' },
    root:   { fn: q => 4*Math.sqrt(q) + 6,    label: 'S(q) = 4√q + 6' },
  };

  const D  = DEMAND[dType].fn;
  const Sv = SUPPLY[sType].fn;

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 230;          // compact height
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, W, H);

    const p0   = mode === 'cs' ? D(q0) : Sv(q0);
    const pad  = { l: 52, r: 16, t: 16, b: 36 };
    const gW   = W - pad.l - pad.r;
    const gH   = H - pad.t - pad.b;
    const xMax = Math.max(q0 + 1.5, 5);

    // yMax: only use the relevant curve
    let yMax;
    if (mode === 'cs') {
      yMax = Math.max(D(0), p0) * 1.18;
    } else {
      yMax = Math.max(Sv(q0) * 1.6, Sv(0) * 1.2, 20);
    }

    const tX = x => pad.l + x / xMax * gW;
    const tY = y => pad.t + gH - y / yMax * gH;

    // ── Grid ──
    for (let x = 1; x <= 5; x++) {
      if (x > xMax) continue;
      ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(tX(x), pad.t); ctx.lineTo(tX(x), pad.t + gH); ctx.stroke();
      ctx.fillStyle = '#6b7280'; ctx.font = '9px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(x, tX(x), pad.t + gH + 13);
    }
    const yStep = yMax > 150 ? 50 : yMax > 60 ? 20 : 10;
    for (let y = yStep; y < yMax; y += yStep) {
      ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(pad.l, tY(y)); ctx.lineTo(pad.l + gW, tY(y)); ctx.stroke();
      ctx.fillStyle = '#6b7280'; ctx.font = '9px IBM Plex Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText(y, pad.l - 3, tY(y) + 3);
    }

    if (mode === 'cs') {
      // ── Shade: total WS (light blue) under demand ──
      ctx.beginPath(); ctx.moveTo(tX(0), tY(D(0)));
      for (let i = 0; i <= 200; i++) { const q = i * q0 / 200; ctx.lineTo(tX(q), tY(D(q))); }
      ctx.lineTo(tX(q0), tY(0)); ctx.lineTo(tX(0), tY(0)); ctx.closePath();
      ctx.fillStyle = 'rgba(41,128,185,0.15)'; ctx.fill();

      // ── Shade: CS (teal triangle above p0) ──
      ctx.beginPath(); ctx.moveTo(tX(0), tY(D(0)));
      for (let i = 0; i <= 200; i++) { const q = i * q0 / 200; ctx.lineTo(tX(q), tY(D(q))); }
      ctx.lineTo(tX(q0), tY(p0)); ctx.lineTo(tX(0), tY(p0)); ctx.closePath();
      ctx.fillStyle = 'rgba(56,201,176,0.38)'; ctx.fill();

      // ── Shade: actual spend rectangle (dark blue) ──
      ctx.fillStyle = 'rgba(41,128,185,0.22)';
      ctx.fillRect(tX(0), tY(p0), tX(q0) - tX(0), tY(0) - tY(p0));

      // ── Demand curve ──
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) { const q = i * xMax / 300; if (i===0) ctx.moveTo(tX(q), tY(D(q))); else ctx.lineTo(tX(q), tY(D(q))); }
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px serif'; ctx.textAlign = 'left';
      ctx.fillText('D(q)', tX(xMax * 0.55), tY(D(xMax * 0.55)) - 7);

      // CS label
      ctx.fillStyle = '#38c9b0'; ctx.font = 'bold 11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('CS', tX(q0 / 2), tY((D(q0 / 3) + p0) / 2 + 2));

    } else {
      // ── PS mode: supply curve only, NO demand curve ──

      // ── Shade: area under supply ──
      ctx.beginPath(); ctx.moveTo(tX(0), tY(Sv(0)));
      for (let i = 0; i <= 200; i++) { const q = i * q0 / 200; ctx.lineTo(tX(q), tY(Sv(q))); }
      ctx.lineTo(tX(q0), tY(0)); ctx.lineTo(tX(0), tY(0)); ctx.closePath();
      ctx.fillStyle = 'rgba(41,128,185,0.12)'; ctx.fill();

      // ── Shade: PS gold region (above supply, below p0) ──
      ctx.beginPath(); ctx.moveTo(tX(0), tY(p0));
      ctx.lineTo(tX(q0), tY(p0));
      for (let i = 200; i >= 0; i--) { const q = i * q0 / 200; ctx.lineTo(tX(q), tY(Sv(q))); }
      ctx.closePath();
      ctx.fillStyle = 'rgba(212,160,23,0.42)'; ctx.fill();

      // ── Supply curve ──
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) { const q = i * xMax / 300; const y = Sv(q); if (i===0) ctx.moveTo(tX(q), tY(y)); else ctx.lineTo(tX(q), tY(y)); }
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.fillStyle = '#22c55e'; ctx.font = 'bold 10px serif'; ctx.textAlign = 'left';
      const sLabelQ = q0 * 0.55;
      ctx.fillText('S(q)', tX(sLabelQ), tY(Sv(sLabelQ)) - 7);

      // PS label
      ctx.fillStyle = '#d4a017'; ctx.font = 'bold 11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('PS', tX(q0 / 2), tY((p0 + Sv(q0 / 3)) / 2 + 2));
    }

    // ── p0 dashed horizontal ──
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(tX(0), tY(p0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    // ── q0 dashed vertical ──
    ctx.beginPath(); ctx.moveTo(tX(q0), tY(0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    ctx.setLineDash([]);

    // ── p0 / q0 labels ──
    ctx.fillStyle = '#d4a017'; ctx.font = 'bold 9px IBM Plex Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText('p₀=' + p0.toFixed(1), pad.l - 2, tY(p0) + 3);
    ctx.textAlign = 'center';
    ctx.fillText('q₀=' + q0.toFixed(1), tX(q0), pad.t + gH + 26);

    // ── Axes ──
    ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l - 4, pad.t + gH); ctx.lineTo(pad.l + gW + 4, pad.t + gH); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#6b7280'; ctx.font = '9px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('q (units)', pad.l + gW / 2, H - 2);
    ctx.save(); ctx.translate(10, pad.t + gH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('p (price)', 0, 0); ctx.restore();
  };

  useEffect(() => { draw(); }, [mode, q0, dType, sType]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, [mode, q0, dType, sType]);

  // ── Numerical integration ──
  const p0cs = D(q0), p0ps = Sv(q0);
  const N = 2000, dq = q0 / N;
  let wsD = 0, wsS = 0;
  for (let i = 0; i < N; i++) {
    const q = (i + 0.5) * dq;
    wsD += D(q) * dq;
    wsS += Sv(q) * dq;
  }
  const CS = wsD - p0cs * q0;
  const PS = p0ps * q0 - wsS;

  // ── Styles ──
  const LS  = { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af' };
  const SEL = { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.73rem', background:'#1f2937', color:'#e8e2d9', border:'1px solid #374151', borderRadius:'5px', padding:'4px 8px', cursor:'pointer' };
  const BTN = (active, col) => ({ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', background: active ? col : '#1f2937', color: active ? '#111827' : '#9ca3af', border:`1.5px solid ${active ? col : '#374151'}`, borderRadius:'5px', padding:'5px 12px', cursor:'pointer', fontWeight: active ? 700 : 400 });
  const CARD = col => ({ background:'#1f2937', border:`1px solid ${col}`, borderRadius:'7px', padding:'8px 11px', flex:1, minWidth:'100px' });

  return (
    <div style={S.widget}>

      {/* ── Header + mode toggle ── */}
      <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
        <div style={{ ...S.wt, marginBottom:0, flex:1 }}>📊 Consumer &amp; Producer Surplus</div>
        <button style={BTN(mode==='cs', '#38c9b0')} onClick={() => setMode('cs')}>Consumer's Surplus</button>
        <button style={BTN(mode==='ps', '#d4a017')} onClick={() => setMode('ps')}>Producer's Surplus</button>
      </div>

      {/* ── Concept line ── */}
      <div style={{ background: mode==='cs'?'#0a1f1e':'#1a150a', border:`1px solid ${mode==='cs'?'#38c9b044':'#d4a01744'}`, borderRadius:'6px', padding:'7px 12px', marginBottom:'10px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.67rem', color:'#94a3b8', lineHeight:1.5 }}>
        {mode === 'cs'
          ? <><strong style={{color:'#38c9b0'}}>CS</strong> = area under D(q) above the market price p₀ — the "savings" buyers get vs what they were willing to pay.</>
          : <><strong style={{color:'#d4a017'}}>PS</strong> = area above S(q) below the market price p₀ — the "windfall" sellers get vs their minimum asking price.</>}
      </div>

      {/* ── Controls row ── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'10px', alignItems:'flex-end' }}>
        <div>
          <div style={{...LS, marginBottom:'3px'}}>{mode==='cs'?'Demand curve':'Supply curve'}</div>
          {mode === 'cs'
            ? <select value={dType} onChange={e => setDType(e.target.value)} style={SEL}>
                <option value="linear">D(q) = 50 − 8q</option>
                <option value="quad">D(q) = 60 − 4q²</option>
                <option value="hyperbola">D(q) = 80/(q+1)</option>
                <option value="grain">D(q) = 10(25−q²)</option>
              </select>
            : <select value={sType} onChange={e => setSType(e.target.value)} style={SEL}>
                <option value="linear">S(q) = 5 + 4q</option>
                <option value="quad">S(q) = 2 + 2q²</option>
                <option value="root">S(q) = 4√q + 6</option>
              </select>}
        </div>
        <div style={{ flex:1, minWidth:'140px' }}>
          <div style={{...LS, marginBottom:'3px'}}>q₀ = <span style={{color:'#d4a017', fontWeight:700}}>{q0.toFixed(1)}</span> units</div>
          <input type="range" min="0.5" max="4.5" step="0.1" value={q0} onInput={e => setQ0(+e.target.value)}
            style={{ WebkitAppearance:'none', width:'100%', height:'4px', background:'#374151', borderRadius:'2px', outline:'none' }}/>
        </div>
      </div>

      {/* ── Canvas ── */}
      <canvas ref={canvasRef}
        style={{ display:'block', width:'100%', height:'230px', borderRadius:'8px', background:'#111827' }}/>

      {/* ── Stat cards ── */}
      <div style={{ display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
        <div style={CARD('#38c9b0')}>
          <div style={{...LS, color:'#38c9b0', marginBottom:'3px'}}>Consumer's Surplus (CS)</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#6ee7b7', fontWeight:700 }}>{CS.toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#6b7280', marginTop:'1px' }}>∫D(q)dq − p₀q₀</div>
        </div>
        <div style={CARD('#d4a017')}>
          <div style={{...LS, color:'#d4a017', marginBottom:'3px'}}>Producer's Surplus (PS)</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#fbbf24', fontWeight:700 }}>{PS.toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#6b7280', marginTop:'1px' }}>p₀q₀ − ∫S(q)dq</div>
        </div>
        <div style={CARD('#6366f1')}>
          <div style={{...LS, color:'#818cf8', marginBottom:'3px'}}>Market Price p₀</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#a5b4fc', fontWeight:700 }}>{(mode==='cs'?p0cs:p0ps).toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#6b7280', marginTop:'1px' }}>at q₀ = {q0.toFixed(1)} units</div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div style={{ display:'flex', gap:'14px', marginTop:'8px', flexWrap:'wrap' }}>
        {mode === 'cs' ? <>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(56,201,176,0.45)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>CS — consumers' surplus</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(41,128,185,0.28)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>p₀·q₀ — actual spend</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'3px', background:'#ef4444', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>D(q) demand</span>
          </div>
        </> : <>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(212,160,23,0.45)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>PS — producers' surplus</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(41,128,185,0.18)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>∫S(q)dq — cost to produce</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'3px', background:'#22c55e', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#9ca3af' }}>S(q) supply</span>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── Willingness to Spend Diagram — canvas-plotted ───────────────────────
// Drop this component definition BEFORE your main page export,
// alongside your other widget functions (IncomeStreamWidget, SurplusWidget, etc.)
// Then use <WSDiagram /> in your JSX where the old SVG block was.

function WSExplorer() {
  const canvasRef = useRef(null);
  const [dKey, setDKey]   = useState('linear');
  const [q0,   setQ0]     = useState(3);
  const [showCS, setShowCS] = useState(false); // toggle to shade CS vs full WS

  // ── Demand functions ──────────────────────────────────────────────────
  const DEMANDS = {
    linear:    { fn: q => Math.max(0, 50 - 8*q),       label: 'D(q) = 50 − 8q',     color:'#ef4444', qMax:6 },
    quad:      { fn: q => Math.max(0, 60 - 5*q*q),     label: 'D(q) = 60 − 5q²',    color:'#f97316', qMax:3.5 },
    hyperbola: { fn: q => Math.max(0, 80/(q+1)),        label: 'D(q) = 80/(q+1)',     color:'#a78bfa', qMax:6 },
    grain:     { fn: q => Math.max(0, 10*(25 - q*q)),   label: 'D(q) = 10(25−q²)',   color:'#22c55e', qMax:4.5 },
  };

  const D    = DEMANDS[dKey].fn;
  const qMax = DEMANDS[dKey].qMax;
  const col  = DEMANDS[dKey].color;
  const p0   = D(q0);

  // ── Numerical WS and CS ───────────────────────────────────────────────
  const N  = 2000, dq = q0 / N;
  let ws   = 0;
  for (let i = 0; i < N; i++) ws += D((i + 0.5) * dq) * dq;
  const CS = ws - p0 * q0;

  // ── Draw ──────────────────────────────────────────────────────────────
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth, H = 220;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fdf8f0';
    ctx.fillRect(0, 0, W, H);

    const pad  = { l:52, r:20, t:18, b:38 };
    const gW   = W - pad.l - pad.r;
    const gH   = H - pad.t - pad.b;
    const yMax = D(0) * 1.18;

    const tX = x => pad.l + (x / qMax) * gW;
    const tY = y => pad.t + gH - (y / yMax) * gH;

    // ── Grid ──
    const xTicks = Math.floor(qMax);
    for (let i = 0; i <= xTicks; i++) {
      ctx.strokeStyle = '#e8e0d4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tX(i), pad.t); ctx.lineTo(tX(i), pad.t + gH); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(i, tX(i), pad.t + gH + 14);
    }
    const yStep = yMax > 150 ? 50 : yMax > 60 ? 20 : 10;
    for (let y = 0; y <= yMax; y += yStep) {
      ctx.strokeStyle = '#e8e0d4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, tY(y)); ctx.lineTo(pad.l + gW, tY(y)); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px IBM Plex Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText(y, pad.l - 5, tY(y) + 3);
    }

    // ── Shade: full WS area (light blue under demand from 0 to q0) ──
    ctx.beginPath();
    ctx.moveTo(tX(0), tY(D(0)));
    for (let i = 0; i <= 400; i++) {
      const q = q0 * i / 400;
      ctx.lineTo(tX(q), tY(D(q)));
    }
    ctx.lineTo(tX(q0), tY(0));
    ctx.lineTo(tX(0), tY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(41,128,185,0.18)';
    ctx.fill();

    // ── Shade: CS region (above p0, below D) — only if showCS ──
    if (showCS) {
      ctx.beginPath();
      ctx.moveTo(tX(0), tY(D(0)));
      for (let i = 0; i <= 400; i++) {
        const q = q0 * i / 400;
        ctx.lineTo(tX(q), tY(D(q)));
      }
      ctx.lineTo(tX(q0), tY(p0));
      ctx.lineTo(tX(0), tY(p0));
      ctx.closePath();
      ctx.fillStyle = 'rgba(56,201,176,0.35)';
      ctx.fill();

      // Expenditure rectangle p0*q0
      ctx.fillStyle = 'rgba(41,128,185,0.25)';
      ctx.fillRect(tX(0), tY(p0), tX(q0) - tX(0), tY(0) - tY(p0));
    }

    // ── Demand curve ──
    ctx.beginPath();
    for (let i = 0; i <= 600; i++) {
      const q = qMax * i / 600;
      const y = D(q);
      if (i === 0) ctx.moveTo(tX(q), tY(y));
      else ctx.lineTo(tX(q), tY(y));
    }
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();

    // ── D(q) label at curve end ──
    const labelQ = qMax * 0.82;
    const labelY = D(labelQ);
    if (labelY > 2) {
      ctx.fillStyle = col; ctx.font = 'bold 11px serif'; ctx.textAlign = 'left';
      ctx.fillText('D(q)', tX(labelQ) + 4, tY(labelY) - 5);
    }

    // ── p0 dashed horizontal + q0 dashed vertical ──
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(tX(0), tY(p0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tX(q0), tY(0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    ctx.setLineDash([]);

    // ── WS label in shaded area ──
    const midQ = q0 * 0.45;
    const midY = (D(midQ) + (showCS ? p0 : 0)) / 2;
    if (showCS) {
      // CS label in teal region
      ctx.fillStyle = '#1a6b6b'; ctx.font = 'bold 11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('CS', tX(q0 * 0.35), tY((D(q0 * 0.2) + p0) / 2));
      // Expenditure label
      ctx.fillStyle = '#2980b9'; ctx.font = 'bold 10px IBM Plex Mono,monospace';
      ctx.fillText('p₀·q₀', tX(q0 * 0.5), tY(p0 / 2));
    } else {
      ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('WS = ∫D(q)dq', tX(q0 * 0.42), tY(D(q0 * 0.42) * 0.45));
    }

    // ── p0 and q0 axis labels ──
    ctx.fillStyle = '#d4a017'; ctx.font = 'bold 10px IBM Plex Mono,monospace';
    ctx.textAlign = 'right';
    ctx.fillText('p₀=' + p0.toFixed(1), pad.l - 2, tY(p0) + 4);
    ctx.textAlign = 'center';
    ctx.fillText('q₀=' + q0.toFixed(1), tX(q0), pad.t + gH + 28);

    // ── Axes ──
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l - 4, pad.t + gH); ctx.lineTo(pad.l + gW + 6, pad.t + gH); ctx.stroke();
    // Arrowheads
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.moveTo(pad.l + gW + 6, pad.t + gH);
    ctx.lineTo(pad.l + gW - 1, pad.t + gH - 5);
    ctx.lineTo(pad.l + gW - 1, pad.t + gH + 5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l - 5, pad.t + 7);
    ctx.lineTo(pad.l + 5, pad.t + 7); ctx.closePath(); ctx.fill();

    // ── Axis labels ──
    ctx.fillStyle = '#555'; ctx.font = '11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('q (units)', pad.l + gW / 2, H - 2);
    ctx.save(); ctx.translate(11, pad.t + gH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('p (price)', 0, 0); ctx.restore();
  };

  useEffect(() => { draw(); }, [dKey, q0, showCS]);
  useEffect(() => {
    const h = () => draw();
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, [dKey, q0, showCS]);

  // ── Styles ──────────────────────────────────────────────────────────
  const LS  = { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.64rem', letterSpacing:'.08em', textTransform:'uppercase', color:'#7f8c8d' };
  const SEL = { fontFamily:"'IBM Plex Mono',monospace", fontSize:'.74rem', background:'#fff', color:'#1a1a2e', border:'1px solid #e0d6c8', borderRadius:'5px', padding:'4px 8px', cursor:'pointer' };
  const BTN = (active, col) => ({ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.05em', background: active ? col : '#f5f5f0', color: active ? '#fff' : '#7f8c8d', border:`1.5px solid ${active ? col : '#e0d6c8'}`, borderRadius:'5px', padding:'4px 10px', cursor:'pointer', fontWeight: active ? 700 : 400 });

  return (
    <div>
      {/* Controls row */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'flex-end', marginBottom:'12px' }}>
        <div>
          <div style={{...LS, marginBottom:'3px'}}>Demand function</div>
          <select value={dKey} onChange={e => setDKey(e.target.value)} style={SEL}>
            {Object.entries(DEMANDS).map(([k,v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex:1, minWidth:'140px' }}>
          <div style={{...LS, marginBottom:'3px'}}>
            q₀ = <span style={{ color:'#d4a017', fontWeight:700 }}>{q0.toFixed(1)}</span> units
          </div>
          <input type="range" min="0.5" max={DEMANDS[dKey].qMax - 0.5} step="0.1" value={q0}
            onInput={e => setQ0(+e.target.value)}
            style={{ WebkitAppearance:'none', width:'100%', height:'4px', background:'#e0d6c8', borderRadius:'2px', outline:'none' }}/>
        </div>
        <div style={{ display:'flex', gap:'6px', paddingBottom:'2px' }}>
          <button style={BTN(!showCS, '#2980b9')} onClick={() => setShowCS(false)}>WS only</button>
          <button style={BTN(showCS,  '#1a6b6b')} onClick={() => setShowCS(true)}>Show CS</button>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef}
        style={{ display:'block', width:'100%', height:'220px', borderRadius:'8px', border:'1px solid #e0d6c8' }}/>

      {/* Stat row */}
      <div style={{ display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
        <div style={{ background:'rgba(41,128,185,0.10)', border:'1px solid #2980b9', borderRadius:'7px', padding:'8px 12px', flex:1, minWidth:'110px' }}>
          <div style={{...LS, color:'#2980b9', marginBottom:'2px'}}>Total WS</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#1d4ed8', fontWeight:700 }}>{ws.toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#9ca3af', marginTop:'1px' }}>∫₀^q₀ D(q) dq</div>
        </div>
        <div style={{ background:'rgba(212,160,23,0.10)', border:'1px solid #d4a017', borderRadius:'7px', padding:'8px 12px', flex:1, minWidth:'110px' }}>
          <div style={{...LS, color:'#d4a017', marginBottom:'2px'}}>Actual Spend</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#b45309', fontWeight:700 }}>{(p0*q0).toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#9ca3af', marginTop:'1px' }}>p₀ × q₀ = {p0.toFixed(1)} × {q0.toFixed(1)}</div>
        </div>
        <div style={{ background:'rgba(56,201,176,0.10)', border:'1px solid #38c9b0', borderRadius:'7px', padding:'8px 12px', flex:1, minWidth:'110px' }}>
          <div style={{...LS, color:'#1a6b6b', marginBottom:'2px'}}>Consumer's Surplus</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#1a6b6b', fontWeight:700 }}>{CS.toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#9ca3af', marginTop:'1px' }}>WS − p₀·q₀</div>
        </div>
        <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid #ef4444', borderRadius:'7px', padding:'8px 12px', flex:1, minWidth:'110px' }}>
          <div style={{...LS, color:'#ef4444', marginBottom:'2px'}}>Market Price p₀</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.95rem', color:'#dc2626', fontWeight:700 }}>{p0.toFixed(2)}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.58rem', color:'#9ca3af', marginTop:'1px' }}>D({q0.toFixed(1)}) = {p0.toFixed(2)}</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:'14px', marginTop:'8px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <div style={{ width:'14px', height:'3px', background:DEMANDS[dKey].color, borderRadius:'2px' }}/>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.61rem', color:'#9ca3af' }}>demand curve D(q)</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <div style={{ width:'14px', height:'10px', background:'rgba(41,128,185,0.25)', borderRadius:'2px' }}/>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.61rem', color:'#9ca3af' }}>total WS = ∫D(q)dq</span>
        </div>
        {showCS && <>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(56,201,176,0.40)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.61rem', color:'#9ca3af' }}>CS (above p₀)</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'14px', height:'10px', background:'rgba(41,128,185,0.30)', borderRadius:'2px' }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.61rem', color:'#9ca3af' }}>actual spend p₀·q₀</span>
          </div>
        </>}
      </div>
    </div>
  );
}

function WSDiagram() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = 200;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ── Layout ──
    const pad = { l:52, r:24, t:18, b:36 };
    const gW = W - pad.l - pad.r;
    const gH = H - pad.t - pad.b;

    // ── Demand function: D(q) = 50 − 2q^2, plot on q∈[0,6] ──
    const qMax = 5.5, pMax = 60;
    const q0   = 4;
    const D    = q => Math.max(0, 50 - 2 * q ** 2);
    const p0   = D(q0);

    const tX = q => pad.l + (q / qMax) * gW;
    const tY = p => pad.t + gH - (p / pMax) * gH;

    ctx.fillStyle = '#fdf8f0';
    ctx.fillRect(0, 0, W, H);

    // ── Light grid ──
    ctx.strokeStyle = '#ece6dc'; ctx.lineWidth = 1;
    [15, 30, 45].forEach(p => {
      ctx.beginPath(); ctx.moveTo(pad.l, tY(p)); ctx.lineTo(pad.l + gW, tY(p)); ctx.stroke();
    });
    [1,2,3,4,5,6].forEach(q => {
      ctx.beginPath(); ctx.moveTo(tX(q), pad.t); ctx.lineTo(tX(q), pad.t + gH); ctx.stroke();
    });

    // ── Shade: WS = full area under D(q) from 0 to q0 ──
    ctx.beginPath();
    ctx.moveTo(tX(0), tY(D(0)));
    for (let i = 0; i <= 400; i++) {
      const q = q0 * i / 400;
      ctx.lineTo(tX(q), tY(D(q)));
    }
    ctx.lineTo(tX(q0), tY(0));
    ctx.lineTo(tX(0),  tY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(41,128,185,0.18)';
    ctx.fill();

    // ── Shade: CS = area above p0, below D(q) ──
    // ctx.beginPath();
    // ctx.moveTo(tX(0), tY(D(0)));
    // for (let i = 0; i <= 400; i++) {
    //   const q = q0 * i / 400;
    //   ctx.lineTo(tX(q), tY(D(q)));
    // }
    // ctx.lineTo(tX(q0), tY(p0));
    // ctx.lineTo(tX(0),  tY(p0));
    // ctx.closePath();
    // ctx.fillStyle = 'rgba(56,201,176,0.30)';
    // ctx.fill();

    // ── Shade: actual spend rectangle p0 × q0 ──
    // tx.fillStyle = 'rgba(41,128,185,0.22)';
    // ctx.fillRect(tX(0), tY(p0), tX(q0) - tX(0), tY(0) - tY(p0));

    // ── Demand curve ──
    ctx.beginPath();
    for (let i = 0; i <= 600; i++) {
      const q = qMax * i / 600;
      const p = D(q);
      if (i === 0) ctx.moveTo(tX(q), tY(p));
      else ctx.lineTo(tX(q), tY(p));
    }
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2.4; ctx.stroke();

    // ── p0 dashed horizontal ──
    // ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.4; ctx.setLineDash([5,4]);
    // ctx.beginPath(); ctx.moveTo(tX(0), tY(p0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    // ── q0 dashed vertical ──
    // ctx.beginPath(); ctx.moveTo(tX(q0), tY(0)); ctx.lineTo(tX(q0), tY(p0)); ctx.stroke();
    // ctx.setLineDash([]);

    // ── Labels on areas ──
    ctx.font = 'bold 15px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    // CS label — midpoint of teal region
    ctx.fillStyle = '#1a6b6b';
    ctx.fillText('Consumer Willingness to Spend', tX(q0 * 0.35), tY((D(q0 * 0.95) + p0) / 2));
    // Expenditure label — centre of rectangle
    ctx.fillStyle = '#2980b9';
    // ctx.fillText('p₀·q₀', tX(q0 * 0.5), tY(p0 / 2));

    // ── Axis tick labels ──
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px IBM Plex Mono,monospace';
    [1,2,3,4,5].forEach(q => {
      ctx.textAlign = 'center';
      ctx.fillText(q, tX(q), pad.t + gH + 14);
    });
    [15,30,45].forEach(p => {
      ctx.textAlign = 'right';
      ctx.fillText(p, pad.l - 5, tY(p) + 3);
    });

    // ── p0 and q0 markers ──
    ctx.fillStyle = '#d4a017'; ctx.font = 'bold 10px IBM Plex Mono,monospace';
    ctx.textAlign = 'right';
    // ctx.fillText('p₀=' + p0, pad.l - 2, tY(p0) - 4);
    ctx.textAlign = 'center';
    ctx.fillText('q₀=' + q0, tX(q0), pad.t + gH + 26);

    // ── D(q) label near curve ──
    ctx.fillStyle = '#c0392b'; ctx.font = 'bold 19px serif';
    ctx.textAlign = 'left';
    ctx.fillText('p=D(q)', tX(3) + 4, tY(D(3)) - 5);

    // ── Axes ──
    ctx.strokeStyle = '#666'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t - 4); ctx.lineTo(pad.l, pad.t + gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t + gH); ctx.lineTo(pad.l + gW + 6, pad.t + gH); ctx.stroke();
    // Arrowheads
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(pad.l + gW + 6, pad.t + gH);
    ctx.lineTo(pad.l + gW, pad.t + gH - 5);
    ctx.lineTo(pad.l + gW, pad.t + gH + 5); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t - 4);
    ctx.lineTo(pad.l - 5, pad.t + 4);
    ctx.lineTo(pad.l + 5, pad.t + 4); ctx.closePath(); ctx.fill();

    // ── Axis labels ──
    ctx.fillStyle = '#555'; ctx.font = '11px IBM Plex Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('q  (units)', pad.l + gW / 2, H - 1);
    ctx.save(); ctx.translate(11, pad.t + gH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('p  (price)', 0, 0); ctx.restore();

  }, []);

  return (
    <div style={{ display:'flex', justifyContent:'center' }}>
      <canvas ref={ref}
        style={{ display:'block', width:'100%', maxWidth:'820px', height:'220px', borderRadius:'8px' }}/>
    </div>
  );
}

export default function Calc1S55() {
  const [sidebarOpen, setSidebarOpen] = useState({ 5: true });

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
          <span style={S.bcCur}>§5.5 Applications to Business</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1" style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg" style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      <div style={S.courseFrame}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <main style={S.cmain}>
          {/* HERO */}
          <div style={S.lecHero} className="lec-hero-m">
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)',pointerEvents:'none'}}/>
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 5 &nbsp;·&nbsp; Section 5.5</div>
            <h1 style={S.lecHeroH1}>Additional Applications of<br/>Integration to Business &amp; Economics</h1>
            <div style={S.lecHeroSub}>Income Streams · Consumer &amp; Producer Surplus</div>
            <p style={S.lecHeroP}>Calculus doesn't just compute areas — it answers real financial questions: How much will a continuous income stream be worth in 5 years? Which investment is actually better? Who benefits most from a market price?</p>
            <div style={S.lecHeroLine}/>
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#objectives','Objectives'],['#hook','Income Streams'],['#fv','Future Value'],['#pv','Present Value'],['#compare','Comparing Investments'],['#ws','Willingness to Spend'],['#cs','Consumer Surplus'],['#ps','Producer Surplus'],['#exercises','Exercises']].map(([href,lbl])=>(
              <a key={href} href={href} style={S.lecNavA}>{lbl}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ── OBJECTIVES ── */}
            <section id="objectives" className="lec-sec">
              <div style={S.secLabel}>Learning Objectives</div>
              <h2 style={S.h2}>What You Will Learn</h2>
              <div style={{...S.card,...S.cardGl}}>
                {[
                  'Use integration to compute the future value and present value of a continuous income stream.',
                  'Define consumer willingness to spend as a definite integral, then use it to compute consumer\'s surplus and producer\'s surplus.',
                ].map((txt,i)=>(
                  <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start',marginBottom:i===0?'14px':0}}>
                    <div style={{width:'32px',height:'32px',background:'#d4a017',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#1a1a2e',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:'.85rem',flexShrink:0}}>{i+1}</div>
                    <p style={{...S.p,margin:0,paddingTop:'5px'}}>{txt}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── INCOME STREAMS INTRO ── */}
            <section id="hook" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Income Streams</div>
              <h2 style={S.h2}>Money Flowing Continuously<br/>Into an Account</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.06rem'}}>Think about a shop that earns sales revenue every hour of every day. The money doesn't come in one big lump — it trickles in <em>continuously</em>. If this revenue is deposited into a bank account that earns interest, it grows over time.</p>
                <p style={{...S.p,fontSize:'1.06rem',marginBottom:0}}>We call this a <strong>continuous income stream</strong>. The big question: <em>at the end of N years, how much money has accumulated — including all the interest that kept compounding?</em></p>
              </div>

              <div style={S.calloutGold}><strong>Key idea to remember:</strong> Money deposited <em>early</em> earns more interest than money deposited <em>late</em>. A rupee deposited today is worth more than a rupee deposited next year. The integral will automatically account for this.</div>

              {/* ── Understanding with a Simple Story ── */}
            <h3 style={S.h3teal}>Understanding with a Simple Story</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px', margin:'20px 0' }}>

            {/* ── Step 1 ── */}
            <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderLeft:'4px solid #d4a017', borderRadius:'10px', padding:'16px 18px' }}>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', fontWeight:700, color:'#d4a017', marginBottom:'6px' }}>Step 1 — Slice Time into Tiny Pieces</div>
                    <p style={{ ...S.p, marginBottom:0, fontSize:'.97rem' }}>
                    Divide the full term <strong>[0, T]</strong> into <em>n</em> equal slices, each of width <strong>Δt = T/n</strong> years. During the <em>j</em>-th slice (around time t<sub>j</sub>), your business earns income at rate <strong>f(t<sub>j</sub>)</strong>, so that slice deposits <strong>f(t<sub>j</sub>)·Δt</strong> rupees into the account.
                    </p>
                </div>
                {/* SVG: timeline with slices */}
                <svg viewBox="0 0 220 72" xmlns="http://www.w3.org/2000/svg"
                    style={{ flex:'0 0 220px', width:'220px', height:'72px', borderRadius:'8px', background:'#fdf8f0', border:'1px solid #e0d6c8' }}>
                    {/* Timeline axis */}
                    <line x1="14" y1="44" x2="206" y2="44" stroke="#555" strokeWidth="1.4"/>
                    <polygon points="206,44 199,41 199,47" fill="#555"/>
                    {/* Slice rectangles */}
                    {[0,1,2,3,4,5].map(j => {
                    const x = 14 + j * 32, w = 30;
                    const cols = ['#d4a017','#d4a017','#d4a017','#d4a017','#d4a017','#d4a017'];
                    return (
                        <g key={j}>
                        <rect x={x} y={24} width={w} height={20} fill={`rgba(212,160,23,${0.12+j*0.04})`} stroke="#d4a017" strokeWidth="1"/>
                        {j===2 && <text x={x+w/2} y={20} fontSize="7" fontFamily="monospace" fill="#d4a017" textAnchor="middle">f(tⱼ)·Δt</text>}
                        {j===2 && <line x1={x+w/2} y1={21} x2={x+w/2} y2={24} stroke="#d4a017" strokeWidth="0.8"/>}
                        </g>
                    );
                    })}
                    {/* t labels */}
                    <text x="14"  y="56" fontSize="7" fontFamily="monospace" fill="#888" textAnchor="middle">0</text>
                    <text x="46"  y="56" fontSize="7" fontFamily="monospace" fill="#888" textAnchor="middle">Δt</text>
                    <text x="78"  y="56" fontSize="6.5" fontFamily="monospace" fill="#d4a017" textAnchor="middle">tⱼ</text>
                    <text x="204" y="56" fontSize="7" fontFamily="monospace" fill="#888" textAnchor="middle">T</text>
                    {/* Brace under one slice */}
                    <line x1="62" y1="48" x2="94" y2="48" stroke="#d4a017" strokeWidth="0.8"/>
                    <line x1="62" y1="46" x2="62" y2="50" stroke="#d4a017" strokeWidth="0.8"/>
                    <line x1="94" y1="46" x2="94" y2="50" stroke="#d4a017" strokeWidth="0.8"/>
                    <text x="78" y="62" fontSize="6.5" fontFamily="monospace" fill="#d4a017" textAnchor="middle">Δt</text>
                    <text x="110" y="44" fontSize="7" fontFamily="monospace" fill="#999">···</text>
                    <text x="14" y="13" fontSize="7" fontFamily="monospace" fill="#555">n equal slices of width Δt = T/n</text>
                </svg>
                </div>
            </div>

            {/* ── Step 2 ── */}
            <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderLeft:'4px solid #38c9b0', borderRadius:'10px', padding:'16px 18px' }}>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', fontWeight:700, color:'#38c9b0', marginBottom:'6px' }}>Step 2 — Each Deposit Earns Interest Until Year T</div>
                    <p style={{ ...S.p, marginBottom:0, fontSize:'.97rem' }}>
                    The deposit from slice <em>j</em> goes into the bank <strong>at time t<sub>j</sub></strong>. It then earns continuously compounded interest for the remaining <strong>(T − t<sub>j</sub>)</strong> years — all the way until the end of the term.
                    </p>
                </div>
                {/* SVG: one deposit at tj, arrow growing to T */}
                <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg"
                    style={{ flex:'0 0 220px', width:'220px', height:'80px', borderRadius:'8px', background:'#fdf8f0', border:'1px solid #e0d6c8' }}>
                    {/* Timeline */}
                    <line x1="14" y1="50" x2="206" y2="50" stroke="#555" strokeWidth="1.4"/>
                    <polygon points="206,50 199,47 199,53" fill="#555"/>
                    {/* Deposit bar at tj */}
                    <rect x="78" y="30" width="22" height="20" fill="rgba(56,201,176,0.25)" stroke="#38c9b0" strokeWidth="1.3"/>
                    <text x="89" y="26" fontSize="7" fontFamily="monospace" fill="#38c9b0" textAnchor="middle">deposit</text>
                    {/* Curved arrow from tj to T showing growth */}
                    <path d="M 100,38 Q 152,18 192,36" fill="none" stroke="#38c9b0" strokeWidth="1.4" strokeDasharray="3,2"/>
                    <polygon points="192,36 184,32 186,40" fill="#38c9b0"/>
                    {/* Grown value at T */}
                    <rect x="190" y="28" width="14" height="22" fill="rgba(56,201,176,0.45)" stroke="#38c9b0" strokeWidth="1.3"/>
                    {/* Duration brace */}
                    <line x1="89" y1="58" x2="197" y2="58" stroke="#38c9b0" strokeWidth="0.9"/>
                    <line x1="89" y1="56" x2="89"  y2="60" stroke="#38c9b0" strokeWidth="0.9"/>
                    <line x1="197" y1="56" x2="197" y2="60" stroke="#38c9b0" strokeWidth="0.9"/>
                    <text x="143" y="69" fontSize="7" fontFamily="monospace" fill="#38c9b0" textAnchor="middle">(T − tⱼ) years of interest</text>
                    {/* Labels */}
                    <text x="14"  y="62" fontSize="7" fontFamily="monospace" fill="#888" textAnchor="middle">0</text>
                    <text x="89"  y="62" fontSize="7" fontFamily="monospace" fill="#38c9b0" textAnchor="middle">tⱼ</text>
                    <text x="197" y="62" fontSize="7" fontFamily="monospace" fill="#d4a017" textAnchor="middle">T</text>
                    <text x="197" y="22" fontSize="6.5" fontFamily="monospace" fill="#38c9b0" textAnchor="middle">grown</text>
                    <text x="14"  y="12" fontSize="7" fontFamily="monospace" fill="#555">Deposit sits in bank, growing with e^(r·(T−tⱼ))</text>
                </svg>
                </div>
            </div>

            {/* ── Step 3 ── */}
            <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderLeft:'4px solid #ef4444', borderRadius:'10px', padding:'16px 18px' }}>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', fontWeight:700, color:'#ef4444', marginBottom:'6px' }}>Step 3 — Earlier Deposits Grow More</div>
                    <p style={{ ...S.p, marginBottom:0, fontSize:'.97rem' }}>
                    By the continuous compounding formula, the slice deposited at t<sub>j</sub> becomes <strong>f(t<sub>j</sub>)·e<sup>r(T−t<sub>j</sub>)</sup>·Δt</strong> by year T. Earlier deposits (small t<sub>j</sub>) have more time → they grow <strong>taller</strong>. Later deposits barely earn any interest.
                    </p>
                </div>
                {/* SVG: 6 bars growing from small to tall left-to-right */}
                <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg"
                    style={{ flex:'0 0 220px', width:'220px', height:'80px', borderRadius:'8px', background:'#fdf8f0', border:'1px solid #e0d6c8' }}>
                    {/* Bars: earlier = taller (left), later = shorter (right) */}
                    {[55,47,39,31,22,12].map((h, j) => {
                    const x = 14 + j * 32;
                    const cols = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a78bfa'];
                    return (
                        <g key={j}>
                        <rect x={x+2} y={65-h} width={26} height={h} fill={`${cols[j]}33`} stroke={cols[j]} strokeWidth="1.2"/>
                        </g>
                    );
                    })}
                    {/* Axis */}
                    <line x1="14" y1="65" x2="208" y2="65" stroke="#aaa" strokeWidth="1"/>
                    {/* Labels */}
                    <text x="27"  y="74" fontSize="7" fontFamily="monospace" fill="#ef4444" textAnchor="middle">t₁</text>
                    <text x="59"  y="74" fontSize="7" fontFamily="monospace" fill="#f97316" textAnchor="middle">t₂</text>
                    <text x="91"  y="74" fontSize="7" fontFamily="monospace" fill="#eab308" textAnchor="middle">t₃</text>
                    <text x="123" y="74" fontSize="7" fontFamily="monospace" fill="#22c55e" textAnchor="middle">t₄</text>
                    <text x="155" y="74" fontSize="7" fontFamily="monospace" fill="#3b82f6" textAnchor="middle">t₅</text>
                    <text x="187" y="74" fontSize="7" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">t₆→T</text>
                    {/* Annotations */}
                    <text x="27"  y="5"  fontSize="6.5" fontFamily="monospace" fill="#ef4444" textAnchor="middle">most</text>
                    <text x="27"  y="13" fontSize="6.5" fontFamily="monospace" fill="#ef4444" textAnchor="middle">growth</text>
                    <text x="187" y="5"  fontSize="6.5" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">least</text>
                    <text x="187" y="13" fontSize="6.5" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">growth</text>
                    <line x1="27" y1="16" x2="27" y2="20" stroke="#ef4444" strokeWidth="0.8"/>
                    <line x1="187" y1="16" x2="187" y2="53" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="2,2"/>
                </svg>
                </div>
            </div>

            {/* ── Step 4 ── */}
            <div style={{ background:'#fff', border:'1px solid #e0d6c8', borderLeft:'4px solid #a78bfa', borderRadius:'10px', padding:'16px 18px' }}>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.72rem', fontWeight:700, color:'#a78bfa', marginBottom:'6px' }}>Step 4 — Add All Slices → Take the Limit → Integral</div>
                    <p style={{ ...S.p, marginBottom:'8px', fontSize:'.97rem' }}>
                    Sum the future values of <em>all n</em> slices:
                    <strong> Σ f(t<sub>j</sub>)·e<sup>r(T−t<sub>j</sub>)</sup>·Δt</strong>. As n → ∞ (slices get infinitely thin), this Riemann sum converges to the definite integral:
                    </p>
                    <div style={{ background:'#f5ede0', borderRadius:'8px', padding:'8px 14px', textAlign:'center', fontSize:'1rem' }}>
                    {'$$\\text{FV} = \\int_0^T f(t)\\,e^{r(T-t)}\\,dt$$'}
                    </div>
                </div>
                {/* SVG: sum of bars converging to smooth integral curve */}
                <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg"
                    style={{ flex:'0 0 220px', width:'220px', height:'80px', borderRadius:'8px', background:'#fdf8f0', border:'1px solid #e0d6c8' }}>
                    {/* Shaded integral area */}
                    <path d="M14,65 Q40,10 70,18 Q100,26 130,38 Q160,50 194,62 L194,65 Z"
                    fill="rgba(167,139,250,0.18)" stroke="none"/>
                    {/* Thin bars (many, narrow) */}
                    {Array.from({length:12},(_,j) => {
                    const x  = 14 + j * 15;
                    const t  = j / 11;
                    const h  = 50 * Math.exp(-1.2 * t);
                    return <rect key={j} x={x+1} y={65-h} width={13} height={h}
                        fill="rgba(167,139,250,0.28)" stroke="#a78bfa" strokeWidth="0.7"/>;
                    })}
                    {/* Smooth curve on top */}
                    <path d="M14,15 Q50,22 90,35 Q130,48 194,63"
                    fill="none" stroke="#a78bfa" strokeWidth="2"/>
                    {/* Sigma → integral arrow */}
                    <text x="50"  y="40" fontSize="9" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">Σ</text>
                    <line x1="62" y1="38" x2="72" y2="38" stroke="#a78bfa" strokeWidth="1" markerEnd="url(#arr)"/>
                    <text x="85"  y="40" fontSize="9" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">∫</text>
                    {/* Axis */}
                    <line x1="14" y1="65" x2="202" y2="65" stroke="#aaa" strokeWidth="1"/>
                    <text x="14"  y="75" fontSize="7" fontFamily="monospace" fill="#888" textAnchor="middle">0</text>
                    <text x="194" y="75" fontSize="7" fontFamily="monospace" fill="#d4a017" textAnchor="middle">T</text>
                    <text x="14"  y="10" fontSize="7" fontFamily="monospace" fill="#555">n→∞ thin bars → smooth integral</text>
                    <text x="160" y="30" fontSize="7" fontFamily="monospace" fill="#a78bfa" textAnchor="middle">f(t)·e^r(T-t)</text>
                </svg>
                </div>
            </div>

            </div>
            </section>

            {/* ── FUTURE VALUE ── */}
            <section id="fv" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Future Value</div>
              <h2 style={S.h2}>Future Value of<br/>an Income Stream</h2>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Future Value Formula</div>
                <p style={S.p}>If money flows continuously into an account at rate {'$f(t)$'} (PKR/year) and the account earns interest at annual rate {'$r$'} compounded continuously, the <strong>future value</strong> at the end of year {'$T$'} is:</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$\\text{FV} = \\int_0^T f(t)\\,e^{r(T-t)}\\,dt = e^{rT}\\int_0^T f(t)\\,e^{-rt}\\,dt$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>The factor {'$e^{r(T-t)}$'} represents how much each rupee deposited at time t grows by the end of year T.</p>
              </div>

              {/* Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Imran's Superstore Annuity</h4>
                <p style={S.p}>Imran owns a superstore in Lahore that generates revenue at a steady rate of <strong>PKR 120,000 per year</strong>. He deposits this continuously into a savings account earning <strong>8% per year compounded continuously</strong>. How much will the account be worth at the end of <strong>2 years</strong>?</p>

                {/* Timeline SVG */}
                <div style={{background:'#fdf8f0',border:'1px solid #e0d6c8',borderRadius:'10px',padding:'18px',margin:'14px 0'}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.62rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#c0392b',marginBottom:'10px'}}>How each small deposit grows to year T=2</div>
                  <svg viewBox="0 0 540 110" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'600px',display:'block',margin:'0 auto'}}>
                    <rect width="540" height="110" fill="#fdf8f0" rx="6"/>
                    {/* Timeline */}
                    <line x1="40" y1="70" x2="500" y2="70" stroke="#555" strokeWidth="1.8"/>
                    <polygon points="500,70 492,66 492,74" fill="#555"/>
                    {[0,1,2].map(x=>(
                      <g key={x}>
                        <line x1={40+x*230} y1="64" x2={40+x*230} y2="76" stroke="#555" strokeWidth="1.5"/>
                        <text x={40+x*230} y="90" fontSize="12" fontFamily="monospace" fill="#555" textAnchor="middle">{x}</text>
                      </g>
                    ))}
                    <text x="505" y="74" fontSize="12" fontFamily="monospace" fill="#555">t</text>
                    {/* Arrows showing growth */}
                    {[0.4, 0.8, 1.2, 1.6].map((t,i) => {
                      const x1 = 40 + t*230;
                      const x2 = 40 + 2*230;
                      return (
                        <g key={i}>
                          <line x1={x1} y1="60" x2={x2} y2="28" stroke={['#ef4444','#f59e0b','#22c55e','#3b82f6'][i]} strokeWidth="1.5" markerEnd={`url(#arr${i})`}/>
                          <text x={x1} y="58" fontSize="9" fontFamily="monospace" fill={['#ef4444','#f59e0b','#22c55e','#3b82f6'][i]} textAnchor="middle">tⱼ={t}</text>
                        </g>
                      );
                    })}
                    <text x="465" y="22" fontSize="10" fontFamily="monospace" fill="#d4a017" textAnchor="middle">grows e^(0.08(2−tⱼ))</text>
                    <text x="370" y="22" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">× (deposit)</text>
                    <text x="525" y="89" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">years</text>
                  </svg>
                </div>

                <ToggleAnswer label="Show Step-by-Step Solution">
                  <p style={S.p}><strong>What we know:</strong> {'$f(t) = 120{,}000$'} (constant), {'$r = 0.08$'}, {'$T = 2$'}.</p>
                  <p style={S.p}><strong>Set up the integral:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{FV} = \\int_0^2 120{,}000\\cdot e^{0.08(2-t)}\\,dt$$'}</p>
                  <p style={S.p}><strong>Factor out the constant {'$e^{0.08\\times 2} = e^{0.16}$'}:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$= 120{,}000\\cdot e^{0.16}\\int_0^2 e^{-0.08t}\\,dt$$'}</p>
                  <p style={S.p}><strong>Evaluate the integral</strong> {'(antiderivative of $e^{-0.08t}$ is $\\frac{e^{-0.08t}}{-0.08}$)'}:</p>
                  <p style={{textAlign:'center'}}>{'$$= 120{,}000\\cdot e^{0.16}\\cdot\\left[\\frac{e^{-0.08t}}{-0.08}\\right]_0^2 = 120{,}000\\cdot e^{0.16}\\cdot\\frac{e^{-0.16}-1}{-0.08}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\frac{120{,}000}{0.08}\\cdot e^{0.16}\\cdot(1-e^{-0.16}) = 1{,}500{,}000\\cdot(e^{0.16}-1)$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 1{,}500{,}000\\cdot(1.17351-1) \\approx \\boxed{\\text{PKR }260{,}266}$$'}</p>
                  <div style={{...S.calloutTeal,marginTop:'12px'}}><strong>Interpretation:</strong> Imran deposited a total of PKR 120,000 × 2 = PKR 240,000. The account is worth PKR 260,266 — the extra PKR 20,266 is the interest earned on the continuously compounding deposits.</div>
                </ToggleAnswer>
              </div>

              {/* Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Growing Revenue Stream</h4>
                <p style={S.p}>A Karachi tech startup generates revenue at the rate {'$f(t) = 50{,}000e^{0.1t}$'} PKR/year (revenue grows at 10%/year). Interest rate is 6% compounded continuously. Find the future value over 3 years.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Here $f(t)=50{,}000e^{0.1t}$, $r=0.06$, $T=3$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{FV} = e^{0.18}\\int_0^3 50{,}000e^{0.1t}\\cdot e^{-0.06t}\\,dt = 50{,}000e^{0.18}\\int_0^3 e^{0.04t}\\,dt$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 50{,}000e^{0.18}\\left[\\frac{e^{0.04t}}{0.04}\\right]_0^3 = \\frac{50{,}000e^{0.18}}{0.04}(e^{0.12}-1)$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 1{,}250{,}000\\cdot e^{0.18}\\cdot(e^{0.12}-1) \\approx 1{,}250{,}000\\times 1.1972\\times 0.1275 \\approx \\boxed{\\text{PKR }190{,}726}$$'}</p>
                </ToggleAnswer>
              </div>

              <IncomeStreamWidget />
            </section>

            {/* ── PRESENT VALUE ── */}
            <section id="pv" className="lec-sec">
              <div style={S.secLabel}>§ 3 — Present Value</div>
              <h2 style={S.h2}>Present Value: What Is That<br/>Future Income Worth <em>Today</em>?</h2>

              <p style={S.p}>Suppose someone offers you a business that will generate income for the next 5 years. What is a fair price to pay for it <em>today</em>? This is the <strong>present value</strong> question.</p>

              <div style={S.calloutBlue}><strong>Intuition:</strong> PKR 100 today is worth more than PKR 100 a year from now — because you could invest today's PKR 100 and have more than PKR 100 next year. Present value works backwards: it asks "how much money do I need today so it grows to match the future income stream?"</div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Present Value Formula</div>
                <p style={S.p}>{'The present value of an income stream with rate $f(t)$ over $[0,T]$ at interest rate $r$ compounded continuously is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$\\text{PV} = \\int_0^T f(t)\\,e^{-rt}\\,dt$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{'The discount factor $e^{-rt}$ shrinks future money back to today\'s value. Note: $\\text{FV} = e^{rT}\\times\\text{PV}$.'}</p>
              </div>

              {/* Visual: FV vs PV relationship */}
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'22px 24px',marginBottom:'24px'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#d4a017',marginBottom:'12px'}}>FV and PV — the relationship</div>
                <svg viewBox="0 0 520 120" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'560px',display:'block',margin:'0 auto'}}>
                  <rect width="520" height="120" fill="#fdf8f0" rx="8"/>
                  {/* PV box */}
                  <rect x="20" y="40" width="110" height="44" rx="6" fill="#f0f4ff" stroke="#2980b9" strokeWidth="1.5"/>
                  <text x="75" y="58" fontSize="12" fontFamily="monospace" fill="#2980b9" textAnchor="middle" fontWeight="700">PV</text>
                  <text x="75" y="74" fontSize="10" fontFamily="monospace" fill="#555" textAnchor="middle">Today (t=0)</text>
                  {/* FV box */}
                  <rect x="390" y="40" width="110" height="44" rx="6" fill="#fff8ec" stroke="#d4a017" strokeWidth="1.5"/>
                  <text x="445" y="58" fontSize="12" fontFamily="monospace" fill="#d4a017" textAnchor="middle" fontWeight="700">FV</text>
                  <text x="445" y="74" fontSize="10" fontFamily="monospace" fill="#555" textAnchor="middle">End of Year T</text>
                  {/* Arrow forward: FV = e^rT × PV */}
                  <line x1="135" y1="55" x2="385" y2="55" stroke="#d4a017" strokeWidth="1.8"/>
                  <polygon points="385,55 376,51 376,59" fill="#d4a017"/>
                  <text x="260" y="48" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="middle">× e^(rT) — invest and grow</text>
                  {/* Arrow backward: PV = e^-rT × FV */}
                  <line x1="385" y1="70" x2="135" y2="70" stroke="#2980b9" strokeWidth="1.8"/>
                  <polygon points="135,70 144,66 144,74" fill="#2980b9"/>
                  <text x="260" y="88" fontSize="11" fontFamily="monospace" fill="#2980b9" textAnchor="middle">× e^(−rT) — discount back</text>
                </svg>
              </div>

              {/* Example 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Fair Price for a Business</h4>
                <p style={S.p}>A small factory in Faisalabad is expected to generate income at a constant rate of <strong>PKR 80,000/year for 5 years</strong>. If the prevailing interest rate is <strong>6% compounded continuously</strong>, what is the fair present value of this income stream?</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'$f(t)=80{,}000$, $r=0.06$, $T=5$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PV} = \\int_0^5 80{,}000\\cdot e^{-0.06t}\\,dt = 80{,}000\\left[\\frac{e^{-0.06t}}{-0.06}\\right]_0^5$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\frac{80{,}000}{0.06}(1-e^{-0.30}) = 1{,}333{,}333\\cdot(1-0.7408) \\approx \\boxed{\\text{PKR }345{,}600}$$'}</p>
                  <div style={S.calloutGreen}><strong>Interpretation:</strong> If you invest PKR 345,600 today at 6%, it would grow to exactly match the income stream. So PKR 345,600 is a fair price to pay for this business today.</div>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── COMPARING INVESTMENTS ── */}
            <section id="compare" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Comparing Two Investments</div>
              <h2 style={S.h2}>Which Investment Is<br/>Actually Better?</h2>

              <p style={S.p}>When comparing two investment options, the fair way is to compute the <strong>net value = PV of income − initial cost</strong>. The higher the net value, the better the investment.</p>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 4 — Sana Compares Two Investment Schemes</h4>
                <p style={S.p}>Sana is deciding between two investment options:</p>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Option</th><th style={S.th}>Cost</th><th style={S.th}>Income Rate</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}><strong>Option A</strong> — Tech Startup Stake</td><td style={S.td}>PKR 900,000</td><td style={S.tdEven}>{'$f_1(t)=300{,}000e^{0.03t}$ / year'}</td></tr>
                    <tr><td style={S.tdEven}><strong>Option B</strong> — Fixed Annuity</td><td style={S.tdEven}>PKR 1,200,000</td><td style={S.td}>{'$f_2(t)=400{,}000$ / year (constant)'}</td></tr>
                  </tbody>
                </table>
                <p style={{...S.p,marginTop:'10px'}}>The prevailing annual interest rate is <strong>5% compounded continuously</strong>. Which option is better over a <strong>5-year term</strong>?</p>

                <ToggleAnswer label="Show Full Solution">
                  <p style={S.p}><strong>Strategy:</strong> Compute PV − cost for each. Larger net value = better investment.</p>
                  <p style={S.p}><strong>Option A:</strong> {'$r=0.05$, $T=5$, $f_1(t)=300{,}000e^{0.03t}$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PV}_A = \\int_0^5 300{,}000e^{0.03t}\\cdot e^{-0.05t}\\,dt = 300{,}000\\int_0^5 e^{-0.02t}\\,dt$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 300{,}000\\left[\\frac{e^{-0.02t}}{-0.02}\\right]_0^5 = \\frac{300{,}000}{0.02}(1-e^{-0.10}) = 15{,}000{,}000\\cdot(1-0.9048) \\approx 1{,}427{,}500$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Net A} = 1{,}427{,}500 - 900{,}000 = \\text{PKR }527{,}500$$'}</p>
                  <p style={S.p}><strong>Option B:</strong> {'$f_2(t)=400{,}000$ (constant).'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PV}_B = 400{,}000\\int_0^5 e^{-0.05t}\\,dt = \\frac{400{,}000}{0.05}(1-e^{-0.25}) = 8{,}000{,}000\\cdot(1-0.7788) \\approx 1{,}769{,}600$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Net B} = 1{,}769{,}600 - 1{,}200{,}000 = \\text{PKR }569{,}600$$'}</p>
                  <div style={{...S.pakBox,marginTop:'12px'}}>
                    <strong>Conclusion:</strong> Option B (net PKR 569,600) is better than Option A (net PKR 527,500), even though it costs more — the higher constant income more than compensates for the larger upfront cost.
                  </div>
                </ToggleAnswer>
              </div>

              {/* Example 5 */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 5 — Three-Way Comparison</h4>
                <p style={S.p}>Three investment options are available at 7% interest compounded continuously over a 4-year term:</p>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Option</th><th style={S.th}>Cost</th><th style={S.th}>Rate f(t)</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}>Alpha</td><td style={S.td}>PKR 500,000</td><td style={S.td}>{'$200{,}000$ / yr'}</td></tr>
                    <tr><td style={S.tdEven}>Beta</td><td style={S.tdEven}>PKR 600,000</td><td style={S.tdEven}>{'$150{,}000e^{0.05t}$ / yr'}</td></tr>
                    <tr><td style={S.td}>Gamma</td><td style={S.td}>PKR 400,000</td><td style={S.td}>{'$180{,}000e^{-0.02t}$ / yr (declining)'}</td></tr>
                  </tbody>
                </table>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Let $r=0.07$, $T=4$. General PV formula: $\\text{PV}=\\int_0^4 f(t)e^{-0.07t}\\,dt$.'}</p>
                  <p style={S.p}><strong>Alpha:</strong> {'$\\text{PV}_{\\alpha}=200{,}000\\cdot\\frac{1-e^{-0.28}}{0.07}=200{,}000\\cdot\\frac{0.2442}{0.07}\\approx 697{,}714$. Net $= 697{,}714-500{,}000 = \\text{PKR }197{,}714$.'}</p>
                  <p style={S.p}><strong>Beta:</strong> {'$\\text{PV}_{\\beta}=150{,}000\\int_0^4 e^{-0.02t}\\,dt=150{,}000\\cdot\\frac{1-e^{-0.08}}{0.02}\\approx 150{,}000\\cdot 3.847=577{,}050$. Net $=577{,}050-600{,}000 = -\\text{PKR }22{,}950$. ❌'}</p>
                  <p style={S.p}><strong>Gamma:</strong> {'$\\text{PV}_{\\gamma}=180{,}000\\int_0^4 e^{-0.09t}\\,dt=180{,}000\\cdot\\frac{1-e^{-0.36}}{0.09}\\approx 180{,}000\\cdot 3.027=544{,}860$. Net $=544{,}860-400{,}000 = \\text{PKR }144{,}860$.'}</p>
                  <div style={S.pakBox}><strong>Ranking:</strong> Alpha (PKR 197,714) &gt; Gamma (PKR 144,860) &gt; Beta (−PKR 22,950, avoid!)</div>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── WILLINGNESS TO SPEND ── */}
            <section id="ws" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Consumer Willingness to Spend</div>
              <h2 style={S.h2}>How Much Are Consumers<br/>Actually Willing to Pay?</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <h4 style={S.h4gold}>The TV Set Story</h4>
                <p style={S.p}>Imagine a family is willing to pay PKR 50,000 for their first TV. For a second TV (maybe for a different room), they'd only pay PKR 30,000 — it's less urgent. For a third TV, maybe just PKR 5,000. Their <strong>demand function</strong> captures this declining willingness.</p>
                <p style={{...S.p,marginBottom:0}}>Total willingness to spend for 3 TVs = PKR 50,000 + 30,000 + 5,000 = <strong>PKR 85,000</strong>. But for a continuous commodity (like grain, fuel, or electricity), we can't just add up a few values — we need to integrate.</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Consumer Willingness to Spend (WS)</div>
                <p style={S.p}>{'If $p = D(q)$ is the demand function (price consumers are willing to pay for the $q$-th unit), then the total willingness to spend for up to $q_0$ units is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$\\text{WS} = \\int_0^{q_0} D(q)\\,dq$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>Geometrically, this is the entire area under the demand curve from 0 to q₀.</p>
              </div>

              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'20px 22px',marginBottom:'24px'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#d4a017',marginBottom:'14px'}}>
                    Willingness to Spend = Area Under Demand Curve
                </div>
                <WSDiagram />
                </div>
              {/* Example: Rashid grain */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 6 — Rashid's Grain Market</h4>
                <p style={S.p}>Rashid, a farm manager in Punjab, finds that buyers are willing to pay {'$p = D(q) = 10(25-q^2)$'} rupees per kg when {'$q$'} kg of grain is available. Find the total amount buyers are willing to spend for up to <strong>3 kg</strong>.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Check the price at $q=3$: $D(3)=10(25-9)=10(16)=160$ rupees/kg. This is the market price when 3 kg are sold.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{WS} = \\int_0^3 10(25-q^2)\\,dq = 10\\int_0^3(25-q^2)\\,dq = 10\\left[25q-\\frac{q^3}{3}\\right]_0^3$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 10\\left[(75-9)-(0)\\right] = 10\\times 66 = \\boxed{\\text{PKR }660\\text{ per kg}}$$'}</p>
                  <p style={S.p}>Buyers are collectively willing to spend PKR 660 for 3 kg of grain at this demand schedule.</p>
                </ToggleAnswer>
              </div>

              {/* Example 7 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 7 — Electricity Demand</h4>
                <p style={S.p}>The demand for electricity (in units) in a neighbourhood follows {'$D(q) = 200 - 0.5q^2$'} PKR per unit. Find total willingness to spend for up to 15 units.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={{textAlign:'center'}}>{'$$\\text{WS}=\\int_0^{15}(200-0.5q^2)\\,dq=\\left[200q-\\frac{0.5q^3}{3}\\right]_0^{15}=(3000-562.5)-0=\\boxed{\\text{PKR }2{,}437.5}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── CONSUMER SURPLUS ── */}
            <section id="cs" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Consumer's Surplus</div>
              <h2 style={S.h2}>Consumers' Surplus:<br/>The "Happy Bargain" Measure</h2>

              <p style={S.p}>When you go to the market and buy something for <strong>less</strong> than you were willing to pay, you feel like you got a bargain. That savings — summed across all buyers — is the <strong>consumers' surplus</strong>.</p>

              <div style={S.calloutGold}><strong>Example:</strong> You were willing to pay PKR 5,000 for a textbook. It only costs PKR 3,500 in the market. Your consumers' surplus is PKR 1,500 — the amount you "saved" compared to your maximum willingness to pay.</div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Consumers' Surplus (CS)</div>
                <p style={S.p}>{'If $p_0 = D(q_0)$ is the market price at which $q_0$ units are sold, the consumers\' surplus is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$\\text{CS} = \\int_0^{q_0} D(q)\\,dq - p_0 q_0$$'}</p>
                <p style={S.p}>This equals: <em>what consumers were willing to pay</em> minus <em>what they actually paid</em>.</p>
                <p style={{...S.p,marginBottom:0}}>Geometrically: <strong>CS = area under the demand curve above the price line</strong> (the teal triangular region in the diagram).</p>
              </div>

              {/* CS three-panel diagram */}
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'22px 24px',marginBottom:'24px',overflowX:'auto'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#38c9b0',marginBottom:'14px'}}>Consumers' Surplus = Willingness to Spend − Actual Expenditure</div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
                  {[
                    {title:'Total WS',fill:'rgba(41,128,185,0.22)',label:'∫D(q)dq'},
                    {title:'− Actual Cost',fill:'rgba(41,128,185,0.22)',rect:true,label:'p₀·q₀'},
                    {title:'= CS',fill:'rgba(56,201,176,0.40)',label:'CS'},
                  ].map((d,i)=>(
                    <div key={i} style={{textAlign:'center'}}>
                      <svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" style={{width:'130px',height:'130px'}}>
                        <rect width="130" height="130" fill="#fdf8f0" rx="6"/>
                        <line x1="18" y1="110" x2="118" y2="110" stroke="#888" strokeWidth="1.2"/>
                        <line x1="18" y1="110" x2="18" y2="18" stroke="#888" strokeWidth="1.2"/>
                        {d.rect ? (
                          <rect x="18" y="70" width="72" height="40" fill={d.fill} stroke="none"/>
                        ) : i===2 ? (
                          <path d="M18,28 Q60,55 90,70 L90,70 L18,70 Z" fill={d.fill}/>
                        ) : (
                          <path d="M18,28 Q60,55 90,70 L90,110 L18,110 Z" fill={d.fill}/>
                        )}
                        <path d="M18,28 Q60,55 90,70 Q110,85 118,110" fill="none" stroke="#ef4444" strokeWidth="2"/>
                        <line x1="18" y1="70" x2="90" y2="70" stroke="#d4a017" strokeWidth="1.2" strokeDasharray="4,3"/>
                        <line x1="90" y1="70" x2="90" y2="110" stroke="#d4a017" strokeWidth="1.2" strokeDasharray="4,3"/>
                        <text x="65" y="65" fontSize="9" fontFamily="monospace" fill={i===2?'#1a6b6b':'#2980b9'} fontWeight="700" textAnchor="middle">{d.label}</text>
                        <text x="18" y="68" fontSize="8" fontFamily="monospace" fill="#d4a017" textAnchor="end">p₀</text>
                        <text x="90" y="122" fontSize="8" fontFamily="monospace" fill="#d4a017" textAnchor="middle">q₀</text>
                      </svg>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',color:'#7f8c8d',marginTop:'4px'}}>{d.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 8 — Grain Market CS</h4>
                <p style={S.p}>Using Rashid's demand function {'$D(q)=10(25-q^2)$'}, find the consumers' surplus when 3 kg of grain are sold at the market price.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Step 1 — Market price:</strong> {'$p_0=D(3)=10(25-9)=160$ PKR/kg.'}</p>
                  <p style={S.p}><strong>Step 2 — CS formula:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{CS} = \\int_0^3 10(25-q^2)\\,dq - 160\\times 3 = 660 - 480 = \\boxed{\\text{PKR }180}$$'}</p>
                  <p style={S.p}><strong>Interpretation:</strong> Buyers collectively paid PKR 480 for 3 kg, but were willing to pay PKR 660. Their total savings (surplus) is PKR 180.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 9 — Electronics Bazaar</h4>
                <p style={S.p}>The demand for smartphones at a Saddar market follows {'$D(q)=500-q^2$'} (PKR hundreds/unit). The market price is set at PKR 400 hundred. Find (a) the equilibrium quantity {'$q_0$'}, and (b) the consumers' surplus.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>(a) Find q₀:</strong> {'$D(q_0)=400 \\Rightarrow 500-q_0^2=400 \\Rightarrow q_0^2=100 \\Rightarrow q_0=10$.'}</p>
                  <p style={S.p}><strong>(b) Consumers' surplus:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{CS}=\\int_0^{10}(500-q^2)\\,dq - 400\\times 10 = \\left[500q-\\frac{q^3}{3}\\right]_0^{10} - 4{,}000$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= (5{,}000-333.33)-4{,}000 = \\boxed{\\text{PKR }666.67\\text{ hundred} \\approx 66{,}667}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 10 — Hyperbolic Demand</h4>
                <p style={S.p}>{'A commodity has demand function $D(q) = \\dfrac{100}{q+1}$ PKR/unit. Find consumers\' surplus when the market price is PKR 20.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Find q₀:</strong> {'$\\frac{100}{q_0+1}=20 \\Rightarrow q_0+1=5 \\Rightarrow q_0=4$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{CS}=\\int_0^4\\frac{100}{q+1}\\,dq - 20\\times 4 = 100\\Big[\\ln(q+1)\\Big]_0^4 - 80 = 100\\ln 5 - 80$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 100\\times 1.6094 - 80 = 160.94 - 80 = \\boxed{\\text{PKR }80.94}$$'}</p>
                </ToggleAnswer>
              </div>
                <SurplusWidget />
            </section>

            {/* ── PRODUCER SURPLUS ── */}
            <section id="ps" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Producer's Surplus</div>
              <h2 style={S.h2}>Producer's Surplus:<br/>The Seller's Windfall</h2>

              <p style={S.p}>The story works in reverse for sellers. A producer might be willing to sell the first unit for as low as PKR 100, the second for PKR 150, and so on — but if the market price is PKR 300, they sell <em>all</em> units at PKR 300. The extra they receive compared to their minimum asking price is the <strong>producer's surplus</strong>.</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Producer's Surplus (PS)</div>
                <p style={S.p}>{'If $p_0 = S(q_0)$ is the market price and $p = S(q)$ is the supply function (minimum price producers will accept for the $q$-th unit), the producers\' surplus is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$\\text{PS} = p_0 q_0 - \\int_0^{q_0} S(q)\\,dq$$'}</p>
                <p style={{...S.p,marginBottom:0}}>Geometrically: <strong>PS = area above the supply curve, below the price line</strong> (the gold region).</p>
              </div>

              {/* PS visual */}
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'22px 24px',marginBottom:'24px'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#d4a017',marginBottom:'12px'}}>Producer's Surplus — Gold region above supply curve</div>
                <svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'380px',display:'block',margin:'0 auto'}}>
                  <rect width="300" height="170" fill="#fdf8f0" rx="8"/>
                  <line x1="30" y1="145" x2="270" y2="145" stroke="#555" strokeWidth="1.5"/>
                  <line x1="30" y1="20" x2="30" y2="150" stroke="#555" strokeWidth="1.5"/>
                  <polygon points="270,145 263,142 263,148" fill="#555"/>
                  {/* Shaded PS area: between p0 line and supply curve */}
                  <path d="M30,145 Q80,130 130,110 Q170,96 200,88 L200,88 L200,62 L30,62 Z" fill="rgba(212,160,23,0.40)"/>
                  {/* Supply curve S(q) — increasing */}
                  <path d="M30,145 Q80,130 130,110 Q170,96 200,88 Q240,78 270,65" fill="none" stroke="#22c55e" strokeWidth="2.5"/>
                  {/* p0 horizontal line */}
                  <line x1="30" y1="62" x2="200" y2="62" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="5,3"/>
                  <line x1="200" y1="62" x2="200" y2="145" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="5,3"/>
                  {/* Labels */}
                  <text x="22" y="65" fontSize="9" fontFamily="monospace" fill="#d4a017" textAnchor="end">p₀</text>
                  <text x="200" y="158" fontSize="9" fontFamily="monospace" fill="#d4a017" textAnchor="middle">q₀</text>
                  <text x="100" y="88" fontSize="11" fontFamily="monospace" fill="#b8860b" fontWeight="700" textAnchor="middle">PS</text>
                  <text x="255" y="62" fontSize="10" fontFamily="serif" fill="#22c55e" fontStyle="italic">S(q)</text>
                  <text x="264" y="140" fontSize="9" fontFamily="monospace" fill="#555">q</text>
                  <text x="22" y="18" fontSize="9" fontFamily="monospace" fill="#555">p</text>
                </svg>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 11 — Wheat Farmers' Surplus</h4>
                <p style={S.p}>Wheat farmers in Sindh have the supply function {'$S(q)=q^2+10$'} PKR/unit. The market price is set at PKR 35. Find the producers' surplus.</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Find q₀:</strong> {'$S(q_0)=35 \\Rightarrow q_0^2+10=35 \\Rightarrow q_0=5$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PS}=35\\times 5-\\int_0^5(q^2+10)\\,dq = 175 - \\left[\\frac{q^3}{3}+10q\\right]_0^5 = 175-(41.67+50) = \\boxed{\\text{PKR }83.33}$$'}</p>
                  <p style={S.p}>Farmers receive PKR 175 total but would have accepted as little as PKR 91.67. Their surplus is PKR 83.33.</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 12 — Both Surpluses Together</h4>
                <p style={S.p}>A commodity has demand {'$D(q)=40-2q$'} and supply {'$S(q)=4+q$'} (both in PKR/unit). Find the equilibrium price and quantity, then compute both CS and PS.</p>
                <ToggleAnswer label="Show Full Solution">
                  <p style={S.p}><strong>Equilibrium:</strong> {'$D(q)=S(q) \\Rightarrow 40-2q=4+q \\Rightarrow 3q=36 \\Rightarrow q_0=12$, $p_0=4+12=16$.'}</p>
                  <p style={S.p}><strong>Consumers' Surplus:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{CS}=\\int_0^{12}(40-2q)\\,dq - 16\\times 12 = \\left[40q-q^2\\right]_0^{12} - 192 = (480-144)-192 = \\boxed{144}$$'}</p>
                  <p style={S.p}><strong>Producers' Surplus:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PS}=16\\times 12-\\int_0^{12}(4+q)\\,dq = 192-\\left[4q+\\frac{q^2}{2}\\right]_0^{12} = 192-(48+72) = \\boxed{72}$$'}</p>
                  <div style={S.pakBox}><strong>Total Social Welfare = CS + PS = 144 + 72 = PKR 216.</strong> This is the total economic benefit generated by this market at equilibrium — split roughly 2:1 between consumers and producers.</div>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 13 — Square Root Supply</h4>
                <p style={S.p}>{'Supply function: $S(q)=2\\sqrt{q}+8$ PKR/unit. Market price is PKR 16. Find producers\' surplus.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Find q₀:</strong> {'$2\\sqrt{q_0}+8=16 \\Rightarrow \\sqrt{q_0}=4 \\Rightarrow q_0=16$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\text{PS}=16\\times 16-\\int_0^{16}(2\\sqrt{q}+8)\\,dq = 256-\\left[\\frac{4q^{3/2}}{3}+8q\\right]_0^{16}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= 256-\\left(\\frac{4\\times 64}{3}+128\\right) = 256-(85.33+128) = 256-213.33 = \\boxed{\\text{PKR }42.67}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── EXERCISES ── */}
            <section id="exercises" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Practice Problems</div>
              <h2 style={S.h2}>Test Yourself</h2>

              {[
                {acc:'cardAl',h4:'h4red',n:1,title:'Future Value',
                 q:'A LUMS alumni\'s business generates PKR 200,000/year continuously. Interest rate is 5% compounded continuously. Find the future value after 4 years.',
                 sol:<><p style={S.p}>{'$f(t)=200{,}000$, $r=0.05$, $T=4$.'}</p><p style={{textAlign:'center'}}>{'$$\\text{FV}=e^{0.20}\\int_0^4 200{,}000\\,e^{-0.05t}\\,dt=200{,}000\\cdot e^{0.20}\\cdot\\frac{1-e^{-0.20}}{0.05}\\approx \\boxed{\\text{PKR }884{,}424}$$'}</p></>},
                {acc:'cardGl',h4:'h4gold',n:2,title:'Present Value',
                 q:'A Quetta factory generates PKR 150,000/year for 6 years. At 4% interest compounded continuously, what is the present value?',
                 sol:<><p style={{textAlign:'center'}}>{'$$\\text{PV}=150{,}000\\int_0^6 e^{-0.04t}\\,dt=\\frac{150{,}000}{0.04}(1-e^{-0.24})\\approx 3{,}750{,}000\\times 0.2127\\approx \\boxed{\\text{PKR }797{,}625}$$'}</p></>},
                {acc:'cardTl',h4:'h4teal',n:3,title:'Compare Two Options',
                 q:'Option X costs PKR 500,000 and earns $f(t)=120{,}000e^{0.02t}$ / year. Option Y costs PKR 400,000 and earns $f(t)=100{,}000$ / year. At 6% interest over 5 years, which is better?',
                 sol:<><p style={S.p}>{'$\\text{PV}_X=120{,}000\\int_0^5 e^{-0.04t}\\,dt=120{,}000\\cdot\\frac{1-e^{-0.2}}{0.04}=120{,}000\\cdot 4.524=542{,}880$. Net X $=42{,}880$.'}</p><p style={S.p}>{'$\\text{PV}_Y=100{,}000\\cdot\\frac{1-e^{-0.3}}{0.06}=100{,}000\\cdot 4.346=434{,}600$. Net Y $=34{,}600$.'}</p><div style={S.pakBox}>Option X is better (higher net PV).</div></>},
                {acc:'cardSl',h4:'h4blue',n:4,title:"Consumer's Surplus — Quadratic Demand",
                 q:'Demand function: $D(q)=100-2q-q^2$. Market sells 5 units. Find consumers\' surplus.',
                 sol:<><p style={S.p}>{'$p_0=D(5)=100-10-25=65$.'}</p><p style={{textAlign:'center'}}>{'$$\\text{CS}=\\int_0^5(100-2q-q^2)\\,dq-65\\times 5=\\left[100q-q^2-\\frac{q^3}{3}\\right]_0^5-325=(500-25-41.67)-325=\\boxed{108.33}$$'}</p></>},
                {acc:'cardPl',h4:'h4green',n:5,title:"Producer's Surplus — Exponential Supply",
                 q:'Supply function: $S(q)=e^{0.5q}$ PKR/unit. Market price is $e^2$ PKR. Find producers\' surplus.',
                 sol:<><p style={S.p}>{'$S(q_0)=e^2 \\Rightarrow e^{0.5q_0}=e^2 \\Rightarrow q_0=4$.'}</p><p style={{textAlign:'center'}}>{'$$\\text{PS}=e^2\\times 4-\\int_0^4 e^{0.5q}\\,dq=4e^2-\\left[\\frac{e^{0.5q}}{0.5}\\right]_0^4=4e^2-2(e^2-1)=2e^2+2\\approx\\boxed{16.78}$$'}</p></>},
                {acc:'cardAl',h4:'h4red',n:6,title:'Growing Income Stream FV',
                 q:'Income rate $f(t)=10{,}000(1+0.1t)$ PKR/year, $r=5\\%$, $T=3$ years. Find FV.',
                 sol:<><p style={{textAlign:'center'}}>{'$$\\text{FV}=e^{0.15}\\int_0^3 10{,}000(1+0.1t)e^{-0.05t}\\,dt$$'}</p><p style={S.p}>{'Use integration by parts: $\\int(1+0.1t)e^{-0.05t}\\,dt$. Let $u=1+0.1t$, $dv=e^{-0.05t}dt$. After IBP: $\\approx 3.083$.'}</p><p style={{textAlign:'center'}}>{'$$\\text{FV}\\approx 10{,}000\\cdot e^{0.15}\\cdot 3.083\\times 3\\approx 10{,}000\\times 1.1618\\times 9.249\\approx\\boxed{\\text{PKR }107{,}484}$$'}</p></>},
                {acc:'cardGl',h4:'h4gold',n:7,title:'Market Equilibrium + Both Surpluses',
                 q:'Demand $D(q)=60-3q$, Supply $S(q)=2q+10$. Find equilibrium, CS, and PS.',
                 sol:<><p style={S.p}>{'Equilibrium: $60-3q=2q+10 \\Rightarrow q_0=10$, $p_0=30$.'}</p><p style={{textAlign:'center'}}>{'$$\\text{CS}=\\int_0^{10}(60-3q)\\,dq-30\\times 10=\\left[60q-\\frac{3q^2}{2}\\right]_0^{10}-300=(600-150)-300=\\boxed{150}$$'}</p><p style={{textAlign:'center'}}>{'$$\\text{PS}=30\\times 10-\\int_0^{10}(2q+10)\\,dq=300-[q^2+10q]_0^{10}=300-200=\\boxed{100}$$'}</p></>},
              ].map(({acc,h4,n,title,q,sol})=>(
                <div key={n} style={{...S.card,...S[acc]}}>
                  <h3 style={{...S.h3teal,marginTop:0}}>Problem {n} — {title}</h3>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Reveal Solution">{sol}</ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Chapter 5 Complete! 🎉</strong> You have now mastered indefinite integration, substitution, the definite integral, the FTC, area between curves, Lorenz curves, average value, income streams, and consumer/producer surplus. Chapter 6 awaits: Integration by Parts, improper integrals, and continuous probability.</div>
            </section>

          </div>{/* end lec-inner */}

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s54" style={S.lnfBtnPrev}>← §5.4 Applying Definite Integration</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§5.5 · Chapter 5 Complete · Calculus I</div>
            <Link href="/courses/calc1" style={S.lnfBtnNext}>Back to Course Overview →</Link>
          </div>

        </main>
      </div>
      <Footer/>
    </>
  );
}