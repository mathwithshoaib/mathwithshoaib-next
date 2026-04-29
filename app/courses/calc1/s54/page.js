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
  lecHeroH1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '10px', position: 'relative' },
  lecHeroSub: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.85rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#38c9b0', marginBottom: '18px', position: 'relative' },
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
  lbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' },
  callout: { background: '#fdf0ef', borderLeft: '4px solid #c0392b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutTeal: { background: '#eef7f7', borderLeft: '4px solid #1a6b6b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGold: { background: '#fff8ec', borderLeft: '4px solid #d4a017', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGreen: { background: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  toggleBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a1a2e', color: '#d4a017', border: 'none', borderRadius: '6px', padding: '9px 20px', cursor: 'pointer', marginTop: '10px', transition: 'opacity .2s' },
  toggleBtnGreen: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a6b6b', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', marginTop: '8px', transition: 'opacity .2s', marginRight:'8px' },
  toggleBtnBlue: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', marginTop: '8px', transition: 'opacity .2s' },
  answerBox: { background: '#f0f9f0', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '18px 22px', marginTop: '12px' },
  secLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.26em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '8px' },
  subsec: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#2980b9', margin: '44px 0 6px', paddingBottom: '6px', borderBottom: '1px solid #e0d6c8' },
  bf: { textAlign: 'center', fontSize: '1.12rem', padding: '26px 18px', background: '#f5ede0', borderRadius: '10px', margin: '22px 0' },
  divider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '52px 0' },
  subDivider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '36px 0' },
  widget: { background: '#1a1a2e', borderRadius: '16px', padding: '26px 26px 18px', margin: '30px 0', color: '#e8e2d9' },
  wt: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  lecFooterNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px', borderTop: '1px solid #e0d6c8', flexWrap: 'wrap', gap: '12px', background: '#fdf8f0' },
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
};

const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: ['1.1 · Functions','1.2 · The Graph of a Function','1.3 · Lines and Linear Functions','1.4 · Functional Models','1.5 · Limits','1.6 · One-Sided Limits and Continuity'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: ['2.1 · The Derivative','2.2 · Techniques of Differentiation','2.3 · Product and Quotient Rules','2.4 · The Chain Rule','2.5 · Marginal Analysis','2.6 · Implicit Differentiation'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 3 — Applications of the Derivative', items: ['3.1 · Increasing & Decreasing Functions','3.2 · Concavity & Inflection Points','3.3 · Curve Sketching','3.4 · Optimization; Elasticity','3.5 · Additional Optimization'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: ['4.1 · Exponential Functions','4.2 · Logarithmic Functions','4.3 · Differentiation of Exp & Log','4.4 · Exponential Models'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration', href: '/courses/calc1/s51', live: true },
    { label: '5.2 · Integration by Substitution', href: '/courses/calc1/s52', live: true },
    { label: '5.3 · The Definite Integral & FTC', href: '/courses/calc1/s53', live: true },
    { label: '5.4 · Applying Definite Integration', href: '/courses/calc1/s54', active: true, live: true },
    { label: '5.5 · Applications to Business', soon: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: ['6.1 · Integration by Parts','6.2 · Numerical Integration','6.3 · Improper Integrals','6.4 · Continuous Probability'].map(l=>({label:l,soon:true})) },
];

function ToggleAnswer({ label = 'Show Solution', children, btnStyle }) {
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
      <div style={{ padding:'8px 0 4px' }}>
        <Link href="/courses/calc1" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 16px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', textDecoration:'none', lineHeight:1.35 }}>
          <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--border2)', flexShrink:0, display:'inline-block' }}></span>
          Course Overview
        </Link>
      </div>
      <nav style={{ padding:'4px 0 24px' }}>
        {TOC.map((sec,i) => {
          if (sec.ch === 'Course Overview') return null;
          const isOpen = !!sidebarOpen[i];
          const hasLive = sec.items.some(item => item.live || item.href);
          return (
            <div key={sec.ch} style={{ borderBottom:'1px solid var(--border)' }}>
              <button onClick={()=>setSidebarOpen(prev=>({...prev,[i]:!prev[i]}))} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:hasLive?'var(--teal)':'var(--text3)', textAlign:'left' }}>
                <span>{sec.ch}</span>
                <span style={{ fontSize:'.6rem', transition:'transform .2s', display:'inline-block', transform:isOpen?'rotate(180deg)':'rotate(0deg)' }}>▾</span>
              </button>
              {isOpen && (
                <div style={{ paddingBottom:'6px' }}>
                  {sec.items.map(item =>
                    item.soon ? (
                      <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--text3)', opacity:.38, lineHeight:1.35 }}>
                        <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--border2)', flexShrink:0, display:'inline-block' }}></span>{item.label}
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


function AreaBetweenWidget() {
  const canvasRef = useRef(null);
  const [fnPair, setFnPair] = useState('parabolas');
  const [showRects, setShowRects] = useState(true);
  const [nRects, setNRects] = useState(8);

  const PAIRS = {
    parabolas: { f: x => -0.3*x*x+3, g: x => 0.3*x*x+0.5, a: -2.4, b: 2.4 },
    linecurve: { f: x => x+2, g: x => x*x, a: -0.9, b: 2.2 },
    sincos:    { f: x => 1.8*Math.sin(x)+2.5, g: x => 0.8*Math.cos(x)+0.5, a: 0, b: Math.PI },
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio||1;
    const W = canvas.offsetWidth, H = 280;
    canvas.width = W*dpr; canvas.height = H*dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const d = PAIRS[fnPair];
    const {f,g,a,b} = d;
    const pad = {l:50,r:20,t:20,b:36};
    const gW = W-pad.l-pad.r, gH = H-pad.t-pad.b;
    let yMin=Infinity, yMax=-Infinity;
    for(let i=0;i<=300;i++){const x=a+(b-a)*i/300; yMin=Math.min(yMin,f(x),g(x)); yMax=Math.max(yMax,f(x),g(x));}
    yMin-=0.4; yMax+=0.4;
    const tX=x=>pad.l+(x-a)/(b-a)*gW;
    const tY=y=>pad.t+gH-(y-yMin)/(yMax-yMin)*gH;
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const y=yMin+(yMax-yMin)*i/4; ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke(); ctx.fillStyle='#6b7280'; ctx.font='10px IBM Plex Mono,monospace'; ctx.textAlign='right'; ctx.fillText(y.toFixed(1),pad.l-4,tY(y)+4);}
    ctx.beginPath(); ctx.moveTo(tX(a),tY(f(a)));
    for(let i=1;i<=300;i++){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(f(x)));}
    for(let i=300;i>=0;i--){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(g(x)));}
    ctx.closePath(); ctx.fillStyle='rgba(212,160,23,0.28)'; ctx.fill();
    if(showRects){
      const dx=(b-a)/nRects;
      for(let i=0;i<nRects;i++){
        const xm=a+(i+0.5)*dx; const fh=f(xm),gh=g(xm);
        const rx=tX(a+i*dx), rw=Math.max(1,tX(a+(i+1)*dx)-rx);
        ctx.fillStyle='rgba(56,201,176,0.22)'; ctx.fillRect(rx,tY(fh),rw,tY(gh)-tY(fh));
        ctx.strokeStyle='#38c9b0'; ctx.lineWidth=1; ctx.strokeRect(rx,tY(fh),rw,tY(gh)-tY(fh));
      }
    }
    ctx.beginPath(); ctx.moveTo(tX(a),tY(f(a)));
    for(let i=1;i<=300;i++){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(f(x)));}
    ctx.strokeStyle='#c0392b'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tX(a),tY(g(a)));
    for(let i=1;i<=300;i++){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(g(x)));}
    ctx.strokeStyle='#2980b9'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
    ctx.fillStyle='#c0392b'; ctx.font='bold 12px serif'; ctx.textAlign='left'; ctx.fillText('f(x)',tX(b)-36,tY(f(b))-8);
    ctx.fillStyle='#2980b9'; ctx.fillText('g(x)',tX(b)-36,tY(g(b))+16);
    ctx.fillStyle='#d4a017'; ctx.font='bold 11px IBM Plex Mono,monospace'; ctx.textAlign='center';
    const midX=(a+b)/2; ctx.fillText('A = ∫[f−g]dx',tX(midX),tY((f(midX)+g(midX))/2));
    ctx.fillStyle='#9ca3af'; ctx.font='11px IBM Plex Mono,monospace';
    ctx.fillText('a',tX(a),H-6); ctx.fillText('b',tX(b),H-6);
  };

  useEffect(()=>{draw();},[fnPair,showRects,nRects]);
  useEffect(()=>{ const h=()=>draw(); window.addEventListener('resize',h,{passive:true}); return ()=>window.removeEventListener('resize',h); },[fnPair,showRects,nRects]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>📐 Area Between Two Curves — Interactive Explorer</div>
      <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'280px',borderRadius:'8px',background:'#111827'}}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:'14px',marginTop:'16px',alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'4px',flex:1,minWidth:'200px'}}>
          <label style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>Function Pair</label>
          <select value={fnPair} onChange={e=>setFnPair(e.target.value)} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.78rem',background:'#1f2937',color:'#e8e2d9',border:'1px solid #374151',borderRadius:'6px',padding:'5px 10px',cursor:'pointer'}}>
            <option value="parabolas">Two parabolas</option>
            <option value="linecurve">Line vs parabola</option>
            <option value="sincos">sin vs cos</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'4px',flex:1,minWidth:'160px'}}>
          <label style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>
            Rectangles: <span style={{color:'#d4a017',fontWeight:600}}>{nRects}</span>
          </label>
          <input type="range" min="2" max="40" value={nRects} onInput={e=>setNRects(parseInt(e.target.value))} style={{WebkitAppearance:'none',width:'100%',height:'5px',background:'#374151',borderRadius:'3px',outline:'none'}}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',paddingTop:'18px'}}>
          <input type="checkbox" id="showR" checked={showRects} onChange={e=>setShowRects(e.target.checked)} style={{cursor:'pointer'}}/>
          <label htmlFor="showR" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.72rem',color:'#38c9b0',cursor:'pointer'}}>Show rectangles</label>
        </div>
      </div>
      <div style={{display:'flex',gap:'20px',marginTop:'12px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'3px',background:'#c0392b',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>f(x) — top</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'3px',background:'#2980b9',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>g(x) — bottom</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'10px',background:'rgba(212,160,23,0.4)',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>Area between</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'10px',background:'rgba(56,201,176,0.3)',border:'1px solid #38c9b0',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>Riemann rectangles [f−g]</span></div>
      </div>
    </div>
  );
}

function LorenzWidget() {
  const canvasRef = useRef(null);
  const [alpha, setAlpha] = useState(2.5);

  const draw = (a) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio||1;
    const W = canvas.offsetWidth, H = 280;
    canvas.width = W*dpr; canvas.height = H*dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const pad={l:55,r:20,t:20,b:42};
    const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
    const tX=x=>pad.l+x*gW, tY=y=>pad.t+gH-y*gH;
    const L=x=>Math.pow(x,a);
    const gini=1-2/(a+1);
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    [0.25,0.5,0.75,1].forEach(v=>{
      ctx.beginPath(); ctx.moveTo(pad.l,tY(v)); ctx.lineTo(pad.l+gW,tY(v)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tX(v),pad.t); ctx.lineTo(tX(v),pad.t+gH); ctx.stroke();
      ctx.fillStyle='#6b7280'; ctx.font='10px IBM Plex Mono,monospace';
      ctx.textAlign='right'; ctx.fillText(v.toFixed(2),pad.l-4,tY(v)+4);
      ctx.textAlign='center'; ctx.fillText(v.toFixed(2),tX(v),pad.t+gH+16);
    });
    ctx.beginPath(); ctx.moveTo(tX(0),tY(0));
    for(let i=1;i<=300;i++){const x=i/300; ctx.lineTo(tX(x),tY(x));}
    for(let i=300;i>=0;i--){const x=i/300; ctx.lineTo(tX(x),tY(L(x)));}
    ctx.closePath(); ctx.fillStyle='rgba(192,57,43,0.22)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(tX(0),tY(0));
    for(let i=1;i<=300;i++){const x=i/300; ctx.lineTo(tX(x),tY(L(x)));}
    ctx.strokeStyle='#d4a017'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tX(0),tY(0)); ctx.lineTo(tX(1),tY(1));
    ctx.strokeStyle='#38c9b0'; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
    ctx.fillStyle='#38c9b0'; ctx.font='11px IBM Plex Mono,monospace'; ctx.textAlign='left';
    ctx.fillText('y = x  (perfect equality)',tX(0.04),tY(0.65));
    ctx.fillStyle='#d4a017';
    ctx.fillText('L(x) = x^'+a.toFixed(1),tX(0.04),tY(0.22));
    ctx.fillStyle='#e06b6b'; ctx.font='bold 13px IBM Plex Mono,monospace'; ctx.textAlign='center';
    ctx.fillText('Gini = '+gini.toFixed(3),tX(0.75),tY(0.38));
    ctx.fillStyle='#9ca3af'; ctx.font='11px IBM Plex Mono,monospace';
    ctx.textAlign='center'; ctx.fillText('Cumulative Share of Population',tX(0.5),H-4);
    ctx.save(); ctx.translate(14,pad.t+gH/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('Cumulative Income Share',0,0); ctx.restore();
  };

  useEffect(()=>{draw(alpha);},[alpha]);
  useEffect(()=>{const h=()=>draw(alpha); window.addEventListener('resize',h,{passive:true}); return ()=>window.removeEventListener('resize',h);},[alpha]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>📊 Lorenz Curve & Gini Index — Interactive</div>
      <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'280px',borderRadius:'8px',background:'#111827'}}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:'14px',marginTop:'16px',alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'4px',flex:1}}>
          <label style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>
            Inequality α = <span style={{color:'#d4a017',fontWeight:600}}>{alpha.toFixed(1)}</span>
            <span style={{color:'#6b7280',marginLeft:'10px'}}>(1 = perfect equality · higher = more inequality)</span>
          </label>
          <input type="range" min="1" max="6" step="0.1" value={alpha} onInput={e=>setAlpha(parseFloat(e.target.value))} style={{WebkitAppearance:'none',width:'100%',height:'5px',background:'#374151',borderRadius:'3px',outline:'none'}}/>
        </div>
      </div>
    </div>
  );
}

function AvgValueWidget() {
  const canvasRef = useRef(null);
  const [fnKey, setFnKey] = useState('sin');
  const FNS = {
    sin:   {f:x=>2*Math.sin(x)+3, a:0, b:Math.PI},
    quad:  {f:x=>-0.4*x*x+2*x+1, a:0, b:4},
    exp:   {f:x=>2*Math.exp(-0.5*x)+1, a:0, b:4},
    linear:{f:x=>0.8*x+0.5, a:0, b:4},
  };

  const draw = (k) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.offsetWidth) return;
    const dpr = window.devicePixelRatio||1;
    const W = canvas.offsetWidth, H = 260;
    canvas.width = W*dpr; canvas.height = H*dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const d=FNS[k]; const {f,a,b}=d;
    const pad={l:50,r:20,t:20,b:36};
    const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
    let yMin=Infinity, yMax=-Infinity;
    for(let i=0;i<=300;i++){const y=f(a+(b-a)*i/300); yMin=Math.min(yMin,y); yMax=Math.max(yMax,y);}
    yMin=Math.max(0,yMin-0.3); yMax+=0.5;
    const tX=x=>pad.l+(x-a)/(b-a)*gW;
    const tY=y=>pad.t+gH-(y-yMin)/(yMax-yMin)*gH;
    let sum=0; const steps=1000, dx2=(b-a)/steps;
    for(let i=0;i<steps;i++) sum+=f(a+(i+0.5)*dx2)*dx2;
    const avg=sum/(b-a);
    ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const y=yMin+(yMax-yMin)*i/4; ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke(); ctx.fillStyle='#6b7280'; ctx.font='10px IBM Plex Mono,monospace'; ctx.textAlign='right'; ctx.fillText(y.toFixed(1),pad.l-4,tY(y)+4);}
    ctx.beginPath(); ctx.moveTo(tX(a),tY(yMin));
    for(let i=0;i<=300;i++){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(f(x)));}
    ctx.lineTo(tX(b),tY(yMin)); ctx.closePath(); ctx.fillStyle='rgba(212,160,23,0.18)'; ctx.fill();
    ctx.fillStyle='rgba(56,201,176,0.18)'; ctx.fillRect(tX(a),tY(avg),tX(b)-tX(a),tY(yMin)-tY(avg));
    ctx.strokeStyle='#38c9b0'; ctx.lineWidth=2; ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(tX(a),tY(avg)); ctx.lineTo(tX(b),tY(avg)); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(tX(a),tY(f(a)));
    for(let i=1;i<=300;i++){const x=a+(b-a)*i/300; ctx.lineTo(tX(x),tY(f(x)));}
    ctx.strokeStyle='#c0392b'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
    ctx.fillStyle='#c0392b'; ctx.font='bold 11px serif'; ctx.textAlign='left'; ctx.fillText('f(x)',tX(b)-28,tY(f(b))-8);
    ctx.fillStyle='#38c9b0'; ctx.font='bold 11px IBM Plex Mono,monospace';
    ctx.fillText('f_avg ≈ '+avg.toFixed(3),tX(a)+6,tY(avg)-8);
    ctx.fillStyle='#9ca3af'; ctx.font='10px IBM Plex Mono,monospace'; ctx.textAlign='center';
    ctx.fillText('a',tX(a),H-6); ctx.fillText('b',tX(b),H-6);
  };

  useEffect(()=>{draw(fnKey);},[fnKey]);
  useEffect(()=>{const h=()=>draw(fnKey); window.addEventListener('resize',h,{passive:true}); return ()=>window.removeEventListener('resize',h);},[fnKey]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>📏 Average Value Explorer</div>
      <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'260px',borderRadius:'8px',background:'#111827'}}/>
      <div style={{marginTop:'14px'}}>
        <label style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.68rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>Function</label>
        <select value={fnKey} onChange={e=>setFnKey(e.target.value)} style={{marginLeft:'12px',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.78rem',background:'#1f2937',color:'#e8e2d9',border:'1px solid #374151',borderRadius:'6px',padding:'5px 10px',cursor:'pointer'}}>
          <option value="sin">f(x) = 2sin(x)+3</option>
          <option value="quad">f(x) = −0.4x²+2x+1</option>
          <option value="exp">f(x) = 2e^(−x/2)+1</option>
          <option value="linear">f(x) = 0.8x+0.5</option>
        </select>
      </div>
      <div style={{display:'flex',gap:'20px',marginTop:'10px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'3px',background:'#c0392b',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>f(x)</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'10px',background:'rgba(212,160,23,0.3)',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>Area under f(x)</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'18px',height:'10px',background:'rgba(56,201,176,0.3)',border:'1px solid #38c9b0',borderRadius:'2px'}}></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#9ca3af'}}>Rectangle height = f_avg (same area!)</span></div>
      </div>
    </div>
  );
}


export default function Calc1S54() {
  const [sidebarOpen, setSidebarOpen] = useState({ 5: true });

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const bar = document.getElementById('sk-progress-bar');
      if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const typesetInterval = setInterval(() => {
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); clearInterval(typesetInterval); }
    }, 100);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(typesetInterval); };
  }, []);

  return (
    <>
      <Navbar activePage="courses" />
      <Script id="mjax-cfg" strategy="beforeInteractive">{`
        window.MathJax = {
          tex:{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']]},
          options:{skipHtmlTags:['script','noscript','style','textarea','pre']}
        };
      `}</Script>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec{padding:52px 0 0;}
        .lec-sec:first-child{padding-top:44px;}
        .lec-inner-m p,.lec-inner-m li{color:#1a1a2e!important;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#d4a017;border-radius:50%;cursor:pointer;}
        @media(max-width:860px){.csb-hide{display:none!important;}.lec-inner-m{padding:0 18px 40px!important;}.lec-hero-m{padding:36px 20px 32px!important;}.lec-fnav-m{padding:20px 18px!important;}}
      `}</style>

      {/* STICKY SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§5.4 Applying Definite Integration</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1" style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg" style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      <div style={S.courseFrame}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main style={S.cmain}>
          {/* HERO */}
          <div style={S.lecHero} className="lec-hero-m">
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)',pointerEvents:'none'}}/>
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 5 &nbsp;·&nbsp; Section 5.4</div>
            <h1 style={S.lecHeroH1}>Applying Definite Integration</h1>
            <div style={S.lecHeroSub}>Distribution of Wealth &amp; Average Value</div>
            <p style={S.lecHeroP}>The integral is not just about area — it measures inequality between nations, excess profit between investments, and the "typical" value of any continuously changing quantity.</p>
            <div style={S.lecHeroLine}/>
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#hook','Hook'],['#objectives','Objectives'],['#areabetween','Area Between Curves'],['#derivation','Derivation'],['#examples-simple','Basic Examples'],['#examples-intersect','Intersecting Curves'],['#netexcess','Net Excess Profit'],['#lorenz','Lorenz & Gini'],['#avgvalue','Average Value'],['#interpretations','Interpretations'],['#exercises','Exercises']].map(([href,label])=>(
              <a key={href} href={href} style={S.lecNavA}>{label}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ── HOOK ── */}
            <section id="hook" className="lec-sec">
              <div style={S.secLabel}>Why This Section Matters</div>
              <h2 style={S.h2}>The World's Richest 1% Own<br/>More Than Half of Everything</h2>
              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.07rem',lineHeight:2}}>In 2023, Oxfam reported that the wealthiest 1% accumulated as much new wealth as the bottom 99% combined over the previous decade. Pakistan's own data shows the richest 20% earn over 40% of national income, while the poorest 20% earn less than 9%.</p>
                <p style={{...S.p,fontSize:'1.07rem',lineHeight:2,marginBottom:0}}>How do economists <em>measure</em> inequality precisely? Not with opinion — with calculus. The <strong>Lorenz curve</strong> and <strong>Gini Index</strong> turn wealth distribution into a definite integral. The gap between a fair society and the real one is literally the area between two curves.</p>
              </div>
              <div style={S.calloutGold}><strong>In this section</strong> you will see the definite integral at work in three real-world contexts: measuring the gap between two economic plans (net excess profit), quantifying inequality with the Gini Index, and computing the average value of any continuously changing quantity.</div>
            </section>

            {/* ── OBJECTIVES ── */}
            <section id="objectives" className="lec-sec">
              <div style={S.secLabel}>Learning Objectives</div>
              <h2 style={S.h2}>What You Will Master</h2>
              <div style={{...S.card,...S.cardGl}}>
                {['Find the area between two curves and use it to compute net excess profit and the Gini Index (Lorenz curves).','Derive and apply the formula for the average value of a function.','Interpret average value in terms of rate and area (two interpretations).'].map((text,i)=>(
                  <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start',marginBottom:i<2?'14px':0}}>
                    <div style={{width:'32px',height:'32px',background:'#d4a017',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#1a1a2e',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:'.85rem',flexShrink:0}}>{i+1}</div>
                    <p style={{...S.p,margin:0,paddingTop:'5px'}}>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── AREA BETWEEN CURVES ── */}
            <section id="areabetween" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Area Between Two Curves</div>
              <h2 style={S.h2}>What "Area Between<br/>Two Curves" Really Means</h2>
              <p style={S.p}>You already know how to compute the area under a single curve. Now we ask: <em>what is the area of the region trapped between two curves?</em></p>

              {/* The big visual: Area between = area under f − area under g */}
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'14px',padding:'28px 24px',marginBottom:'28px',overflowX:'auto'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#c0392b',marginBottom:'16px'}}>The Core Idea — Visually</div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap',justifyContent:'center'}}>
                  {/* Diagram 1: area between */}
                  <div style={{textAlign:'center'}}>
                    <svg viewBox="0 0 190 148" xmlns="http://www.w3.org/2000/svg" style={{width:'190px',height:'148px'}}>
                      <rect width="190" height="148" fill="#fdf8f0" rx="6"/>
                      <line x1="24" y1="122" x2="170" y2="122" stroke="#bbb" strokeWidth="1.2"/>
                      <line x1="24" y1="122" x2="24" y2="12" stroke="#bbb" strokeWidth="1.2"/>
                      <path d="M34,94 Q72,22 152,38 L152,90 Q114,80 34,112 Z" fill="rgba(212,160,23,0.32)" stroke="none"/>
                      <path d="M34,94 Q72,22 152,38" fill="none" stroke="#c0392b" strokeWidth="2.2"/>
                      <path d="M34,112 Q114,80 152,90" fill="none" stroke="#2980b9" strokeWidth="2.2"/>
                      <text x="94" y="72" fontSize="12" fontFamily="serif" fill="#b8860b" fontWeight="700" textAnchor="middle">A</text>
                      <text x="158" y="33" fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">f(x)</text>
                      <text x="158" y="94" fontSize="11" fontFamily="serif" fill="#2980b9" fontStyle="italic">g(x)</text>
                      <text x="34" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">a</text>
                      <text x="152" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">b</text>
                    </svg>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.66rem',color:'#7f8c8d',marginTop:'6px'}}>Area between curves</div>
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',color:'#1a1a2e',fontWeight:700,padding:'0 4px'}}>=</div>
                  {/* Diagram 2: area under f */}
                  <div style={{textAlign:'center'}}>
                    <svg viewBox="0 0 190 148" xmlns="http://www.w3.org/2000/svg" style={{width:'190px',height:'148px'}}>
                      <rect width="190" height="148" fill="#fdf8f0" rx="6"/>
                      <line x1="24" y1="122" x2="170" y2="122" stroke="#bbb" strokeWidth="1.2"/>
                      <line x1="24" y1="122" x2="24" y2="12" stroke="#bbb" strokeWidth="1.2"/>
                      <path d="M34,94 Q72,22 152,38 L152,122 L34,122 Z" fill="rgba(192,57,43,0.17)" stroke="none"/>
                      <path d="M34,94 Q72,22 152,38" fill="none" stroke="#c0392b" strokeWidth="2.2"/>
                      <text x="94" y="96" fontSize="11" fontFamily="serif" fill="#c0392b" fontWeight="700" textAnchor="middle">{'∫f dx'}</text>
                      <text x="158" y="33" fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">f(x)</text>
                      <text x="34" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">a</text>
                      <text x="152" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">b</text>
                    </svg>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.66rem',color:'#7f8c8d',marginTop:'6px'}}>Area under f(x)</div>
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.4rem',color:'#1a1a2e',fontWeight:700,padding:'0 4px'}}>−</div>
                  {/* Diagram 3: area under g */}
                  <div style={{textAlign:'center'}}>
                    <svg viewBox="0 0 190 148" xmlns="http://www.w3.org/2000/svg" style={{width:'190px',height:'148px'}}>
                      <rect width="190" height="148" fill="#fdf8f0" rx="6"/>
                      <line x1="24" y1="122" x2="170" y2="122" stroke="#bbb" strokeWidth="1.2"/>
                      <line x1="24" y1="122" x2="24" y2="12" stroke="#bbb" strokeWidth="1.2"/>
                      <path d="M34,112 Q114,80 152,90 L152,122 L34,122 Z" fill="rgba(41,128,185,0.17)" stroke="none"/>
                      <path d="M34,112 Q114,80 152,90" fill="none" stroke="#2980b9" strokeWidth="2.2"/>
                      <text x="94" y="114" fontSize="11" fontFamily="serif" fill="#2980b9" fontWeight="700" textAnchor="middle">{'∫g dx'}</text>
                      <text x="158" y="94" fontSize="11" fontFamily="serif" fill="#2980b9" fontStyle="italic">g(x)</text>
                      <text x="34" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">a</text>
                      <text x="152" y="135" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">b</text>
                    </svg>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.66rem',color:'#7f8c8d',marginTop:'6px'}}>Area under g(x)</div>
                  </div>
                </div>
                <p style={{...S.p,marginTop:'18px',marginBottom:0,textAlign:'center',fontSize:'.97rem'}}>The yellow region = everything under f minus everything under g. Subtracting integrals = integrating the difference.</p>
              </div>

              <p style={S.p}>Each thin vertical rectangle spanning from g(x) up to f(x) has height {'$f(x)-g(x)$'} and width {'$\\Delta x$'}. Summing all these and taking the limit gives the formula:</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Area Between Two Curves</div>
                <p style={S.p}>{'If $f(x) \\geq g(x)$ on $[a,b]$, the area of the region between the two curves is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.18rem'}}>{'$$A = \\int_a^b \\bigl[f(x) - g(x)\\bigr]\\,dx$$'}</p>
                <p style={{...S.p,marginBottom:0}}><strong>Always put the top curve first.</strong> The difference {'$f(x)-g(x) \\geq 0$'}, so {'$A \\geq 0$'} always.</p>
              </div>

              <AreaBetweenWidget />
            </section>

            {/* ── DERIVATION (HIDDEN) ── */}
            <section id="derivation" className="lec-sec">
              <div style={S.secLabel}>§ 1a — Derivation (Optional)</div>
              <h2 style={S.h2}>Where Does the Formula Come From?</h2>
              <p style={S.p}>The formula follows the same Riemann sum logic used in §5.3. Click below for the full derivation.</p>
              <ToggleAnswer label="Show Full Derivation (Riemann Sum → Formula)" btnStyle={S.toggleBtnBlue}>
                <p style={S.p}>{'Divide $[a,b]$ into $n$ equal subintervals of width $\\Delta x = \\dfrac{b-a}{n}$. Pick sample point $x_i^*$ in the $i$-th subinterval.'}</p>
                <p style={S.p}>{'The $i$-th rectangle has height $f(x_i^*)-g(x_i^*)$ and area:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\Delta A_i = \\bigl[f(x_i^*) - g(x_i^*)\\bigr]\\,\\Delta x$$'}</p>
                <p style={S.p}>Sum all $n$ rectangles and take {'$n \\to \\infty$'}:</p>
                <p style={{textAlign:'center'}}>{'$$A = \\lim_{n\\to\\infty}\\sum_{i=1}^n \\bigl[f(x_i^*)-g(x_i^*)\\bigr]\\,\\Delta x = \\int_a^b\\bigl[f(x)-g(x)\\bigr]\\,dx$$'}</p>
                <p style={S.p}>By linearity of the integral this also equals:</p>
                <p style={{textAlign:'center'}}>{'$$\\int_a^b f(x)\\,dx - \\int_a^b g(x)\\,dx$$'}</p>
                <p style={{...S.p,marginBottom:0}}>confirming the visual picture: area between = area under f minus area under g. ∎</p>
              </ToggleAnswer>
            </section>

            {/* ── BASIC EXAMPLES ── */}
            <section id="examples-simple" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Basic Examples (Bounds Given)</div>
              <h2 style={S.h2}>Finding Area Between Curves<br/>— Straightforward Cases</h2>
              <p style={S.p}>In these examples the interval {'$[a,b]$'} is given and one function is clearly on top throughout. Identify top/bottom, set up, integrate.</p>

              {/* Example 1 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Line Above a Parabola</h4>
                <p style={S.p}>{'Find the area between $f(x) = x+4$ and $g(x) = x^2-2$ on $[-1,\\,3]$.'}</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <ToggleAnswer label="Show Graph" btnStyle={S.toggleBtnGreen}>
                    <div style={{background:'#fff9f0',border:'1px solid #e0d6c8',borderRadius:'8px',padding:'8px',marginBottom:'8px'}}>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.6rem',color:'#c0392b',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px',marginBottom:'6px'}}>⚠ Graph shown for understanding only — in exams you must solve without a graph</div>
                      <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'520px',display:'block',margin:'0 auto',borderRadius:'8px'}}>
                        <rect width="420" height="220" fill="#fdf8f0" rx="6"/>
                        {/* x in [-2,4] -> px [40,380], y in [-3.5,8.5] -> px [195,15] */}
                        {[-2,-1,0,1,2,3,4].map(x=><line key={x} x1={40+(x+2)/6*340} y1="15" x2={40+(x+2)/6*340} y2="195" stroke="#e8e0d4" strokeWidth={x===0?1.4:0.8} strokeDasharray={x===0?'':'4,3'}/>)}
                        {[-2,0,2,4,6,8].map(y=><line key={y} x1="40" y1={195-(y+3.5)/12*180} x2="380" y2={195-(y+3.5)/12*180} stroke="#e8e0d4" strokeWidth={y===0?1.4:0.8} strokeDasharray={y===0?'':'4,3'}/>)}
                        {/* Shaded */}
                        <path d={`M${40+1/6*340},${195-(2.5)/12*180} ${Array.from({length:60},(_,i)=>{const x=-1+i*4/60; return `L${40+(x+2)/6*340},${195-((x+4)+3.5)/12*180}`;}).join(' ')} L${40+5/6*340},${195-(7+3.5)/12*180} ${Array.from({length:60},(_,i)=>{const x=3-i*4/60; return `L${40+(x+2)/6*340},${195-((x*x-2)+3.5)/12*180}`;}).join(' ')} Z`} fill="rgba(212,160,23,0.28)" stroke="none"/>
                        {/* f(x)=x+4 */}
                        <line x1={40+0/6*340} y1={195-(2+3.5)/12*180} x2={40+6/6*340} y2={195-(8+3.5)/12*180} stroke="#c0392b" strokeWidth="2.2"/>
                        {/* g(x)=x^2-2 */}
                        <path d={Array.from({length:100},(_,i)=>{const x=-2+i*6/100; return `${i===0?'M':'L'}${40+(x+2)/6*340},${195-((x*x-2)+3.5)/12*180}`;}).join(' ')} fill="none" stroke="#2980b9" strokeWidth="2.2"/>
                        <line x1="40" y1="195" x2="384" y2="195" stroke="#555" strokeWidth="1.5"/>
                        <line x1={40+2/6*340} y1="10" x2={40+2/6*340} y2="205" stroke="#555" strokeWidth="1.5"/>
                        <text x="364" y={195-(5.5+3.5)/12*180} fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">f</text>
                        <text x="364" y={195-(14-2+3.5)/12*180} fontSize="11" fontFamily="serif" fill="#2980b9" fontStyle="italic">g</text>
                        {[-1,0,1,2,3].map(x=><text key={x} x={40+(x+2)/6*340} y="210" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">{x}</text>)}
                        <text x="108" y="105" fontSize="11" fontFamily="monospace" fill="#b8860b" fontWeight="700">A = ?</text>
                      </svg>
                    </div>
                  </ToggleAnswer>
                </div>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Step 1 — Which is on top on {'$[-1,3]$'}?</strong> Test {'$x=1$'}: {'$f(1)=5$, $g(1)=-1$'}. So {'$f \\geq g$'} throughout.</p>
                  <p style={S.p}><strong>Step 2 — Integrate the difference.</strong></p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_{-1}^{3}[(x+4)-(x^2-2)]\\,dx = \\int_{-1}^{3}(-x^2+x+6)\\,dx$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\left[-\\frac{x^3}{3}+\\frac{x^2}{2}+6x\\right]_{-1}^{3} = \\left(-9+\\frac{9}{2}+18\\right)-\\left(\\frac{1}{3}+\\frac{1}{2}-6\\right) = \\frac{27}{2}+\\frac{13}{6} = \\boxed{\\frac{47}{3} \\approx 15.67}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 2 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Exponential vs. Linear</h4>
                <p style={S.p}>{'Find the area between $f(x)=e^x$ and $g(x)=x$ on $[0,2]$.'}</p>
                <ToggleAnswer label="Show Graph" btnStyle={S.toggleBtnGreen}>
                  <div style={{background:'#fff9f0',border:'1px solid #e0d6c8',borderRadius:'8px',padding:'8px',marginBottom:'8px'}}>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.6rem',color:'#c0392b',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px',marginBottom:'6px'}}>⚠ Graph shown for understanding only</div>
                    <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'440px',display:'block',margin:'0 auto'}}>
                      <rect width="380" height="200" fill="#fdf8f0" rx="6"/>
                      {/* x in [-0.3,2.5]->[40,360], y in [-0.5,8]->[180,15] */}
                      <path d={`M${40+0.3/2.8*320},${180} ${Array.from({length:80},(_,i)=>{const x=i*2/80; return `L${40+(x+0.3)/2.8*320},${180-(Math.exp(x)+0.5)/8.5*165}`;}).join(' ')} L${40+2.3/2.8*320},${180-(2+0.5)/8.5*165} L${40+0.3/2.8*320},${180} Z`} fill="rgba(212,160,23,0.28)" stroke="none"/>
                      <path d={Array.from({length:100},(_,i)=>{const x=-0.3+i*2.8/100; return `${i===0?'M':'L'}${40+(x+0.3)/2.8*320},${180-(Math.exp(x)+0.5)/8.5*165}`;}).join(' ')} fill="none" stroke="#c0392b" strokeWidth="2.2"/>
                      <line x1={40+0.3/2.8*320} y1={180-0.5/8.5*165} x2={40+2.8/2.8*320} y2={180-3.5/8.5*165} stroke="#2980b9" strokeWidth="2.2"/>
                      <line x1="40" y1={180-0.5/8.5*165} x2="364" y2={180-0.5/8.5*165} stroke="#555" strokeWidth="1.2"/>
                      <line x1={40+0.3/2.8*320} y1="15" x2={40+0.3/2.8*320} y2="185" stroke="#555" strokeWidth="1.2"/>
                      <text x="352" y={180-(Math.exp(2.3)+0.5)/8.5*165} fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">eˣ</text>
                      <text x="352" y={180-2.8/8.5*165} fontSize="11" fontFamily="serif" fill="#2980b9" fontStyle="italic">x</text>
                      <text x={40+0.3/2.8*320} y="196" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">0</text>
                      <text x={40+2.3/2.8*320} y="196" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">2</text>
                    </svg>
                  </div>
                </ToggleAnswer>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Since $e^x > x$ for all $x \\geq 0$, f is on top throughout.'}</p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_0^2(e^x-x)\\,dx = \\Big[e^x-\\tfrac{x^2}{2}\\Big]_0^2 = (e^2-2)-(1-0) = e^2-3 \\approx \\boxed{4.389}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Profit Margin Over Production Range</h4>
                <p style={S.p}>{'A firm\'s revenue rate is $R(x)=-x^2+6x+4$ and cost rate is $C(x)=x+4$ (PKR thousands/unit). Find the total profit margin on $[0,4]$.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Check: $R-C = -x^2+5x = x(5-x) \\geq 0$ on $[0,5]$, so $R \\geq C$ throughout $[0,4]$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_0^4(-x^2+5x)\\,dx = \\left[-\\frac{x^3}{3}+\\frac{5x^2}{2}\\right]_0^4 = -\\frac{64}{3}+40 = \\boxed{\\frac{56}{3} \\approx \\text{PKR }18{,}667}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── INTERSECTING CURVES ── */}
            <section id="examples-intersect" className="lec-sec">
              <div style={S.secLabel}>§ 3 — When Curves Cross: Splitting the Integral</div>
              <h2 style={S.h2}>Intersecting Curves:<br/>The Golden Rule</h2>

              <div style={S.warnBox}>
                <div style={{...S.lbl,color:'#c0392b'}}>⚠ Critical — Read This First</div>
                <p style={S.p}>In an exam you will only be given <strong>equations</strong>, not graphs. You must:</p>
                <ol style={{paddingLeft:'20px',marginBottom:'8px'}}>
                  <li style={{marginBottom:'8px'}}><strong>Find intersection points:</strong> set {'$f(x)=g(x)$'} and solve. These become your limits or split points.</li>
                  <li style={{marginBottom:'8px'}}><strong>Determine which is on top in each sub-region</strong> by testing a point between each pair of crossings.</li>
                  <li style={{marginBottom:0}}><strong>Split the integral at every crossing.</strong> Always write larger minus smaller.</li>
                </ol>
              </div>

              <div style={S.calloutGold}><strong>The Golden Rule:</strong> If {'$f(c)=g(c)$'} for some c inside {'$[a,b]$'}, the curves switch which is on top at x=c. Write separate integrals: {'$\\int_a^c[\\text{top}-\\text{bottom}]\\,dx + \\int_c^b[\\text{new top}-\\text{new bottom}]\\,dx$'}.</div>

              {/* Example 4 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 4 — Area Enclosed by {'$y=x^3$'} and {'$y=x^2$'}</h4>
                <p style={S.p}>Find the area of the region enclosed by the curves {'$y=x^3$'} and {'$y=x^2$'}.</p>
                <ToggleAnswer label="Show Graph" btnStyle={S.toggleBtnGreen}>
                  <div style={{background:'#fff9f0',border:'1px solid #e0d6c8',borderRadius:'8px',padding:'8px',marginBottom:'8px'}}>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.6rem',color:'#c0392b',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px',marginBottom:'6px'}}>⚠ Graph for understanding only — not guaranteed in exams</div>
                    <svg viewBox="0 0 380 210" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'440px',display:'block',margin:'0 auto'}}>
                      <rect width="380" height="210" fill="#fdf8f0" rx="6"/>
                      {/* x in [-0.3,1.4]->[35,340], y in [-0.3,1.4]->[185,15] */}
                      <path d={`M${35+0.3/1.7*305},${185} ${Array.from({length:80},(_,i)=>{const x=i/80; return `L${35+(x+0.3)/1.7*305},${185-(x*x+0.3)/1.7*170}`;}).join(' ')} L${35+1.3/1.7*305},${185-1.3/1.7*170} ${Array.from({length:80},(_,i)=>{const x=1-i/80; return `L${35+(x+0.3)/1.7*305},${185-(Math.pow(x,3)+0.3)/1.7*170}`;}).join(' ')} Z`} fill="rgba(212,160,23,0.3)" stroke="none"/>
                      <path d={Array.from({length:100},(_,i)=>{const x=-0.3+i*1.7/100; return `${i===0?'M':'L'}${35+(x+0.3)/1.7*305},${185-(Math.pow(x,3)+0.3)/1.7*170}`;}).join(' ')} fill="none" stroke="#c0392b" strokeWidth="2.2"/>
                      <path d={Array.from({length:100},(_,i)=>{const x=-0.3+i*1.7/100; return `${i===0?'M':'L'}${35+(x+0.3)/1.7*305},${185-(x*x+0.3)/1.7*170}`;}).join(' ')} fill="none" stroke="#2980b9" strokeWidth="2.2"/>
                      <line x1="35" y1="185" x2="348" y2="185" stroke="#555" strokeWidth="1.4"/>
                      <line x1={35+0.3/1.7*305} y1="10" x2={35+0.3/1.7*305} y2="195" stroke="#555" strokeWidth="1.4"/>
                      <circle cx={35+0.3/1.7*305} cy="185" r="4" fill="#27ae60" stroke="#fff" strokeWidth="1.5"/>
                      <circle cx={35+1.3/1.7*305} cy={185-1.3/1.7*170} r="4" fill="#27ae60" stroke="#fff" strokeWidth="1.5"/>
                      <text x={35+0.3/1.7*305} y="202" fontSize="9" fontFamily="monospace" fill="#27ae60" textAnchor="middle">x=0</text>
                      <text x={35+1.3/1.7*305} y="202" fontSize="9" fontFamily="monospace" fill="#27ae60" textAnchor="middle">x=1</text>
                      <text x="338" y="95" fontSize="10" fontFamily="serif" fill="#c0392b" fontStyle="italic">x³</text>
                      <text x="338" y="72" fontSize="10" fontFamily="serif" fill="#2980b9" fontStyle="italic">x²</text>
                    </svg>
                  </div>
                </ToggleAnswer>
                <ToggleAnswer label="Show Full Solution">
                  <p style={S.p}><strong>Step 1 — Find intersections.</strong> {'$x^3=x^2 \\Rightarrow x^2(x-1)=0 \\Rightarrow x=0$ or $x=1$.'}</p>
                  <p style={S.p}><strong>Step 2 — Which is on top on (0,1)?</strong> Test {'$x=0.5$'}: {'$x^2=0.25 > x^3=0.125$'}. Top: {'$y=x^2$'}.</p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_0^1(x^2-x^3)\\,dx = \\left[\\frac{x^3}{3}-\\frac{x^4}{4}\\right]_0^1 = \\frac{1}{3}-\\frac{1}{4} = \\boxed{\\frac{1}{12}}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 5 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 5 — Line vs. Cubic: {'$y=4x$'} and {'$y=x^3+3x^2$'}</h4>
                <p style={S.p}>Find the area of the region enclosed by {'$y=4x$'} and {'$y=x^3+3x^2$'}.</p>
                <ToggleAnswer label="Show Graph" btnStyle={S.toggleBtnGreen}>
                  <div style={{background:'#fff9f0',border:'1px solid #e0d6c8',borderRadius:'8px',padding:'8px',marginBottom:'8px'}}>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.6rem',color:'#c0392b',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px',marginBottom:'6px'}}>⚠ Graph for understanding only</div>
                    <svg viewBox="0 0 420 210" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'520px',display:'block',margin:'0 auto'}}>
                      <rect width="420" height="210" fill="#fdf8f0" rx="6"/>
                      {/* x in [-4.5,2]->[30,390], y in [-12,8]->[190,15] */}
                      <path d={`M${30+0.5/6.5*360},${190} ${Array.from({length:60},(_,i)=>{const x=-4+i*4/60;const c=Math.pow(x,3)+3*x*x; return `L${30+(x+4.5)/6.5*360},${190-(c+12)/20*175}`;}).join(' ')} L${30+4.5/6.5*360},${190-0/20*175} ${Array.from({length:60},(_,i)=>{const x=-i*4/60;const l=4*x; return `L${30+(x+4.5)/6.5*360},${190-(l+12)/20*175}`;}).join(' ')} Z`} fill="rgba(192,57,43,0.15)" stroke="none"/>
                      <path d={`M${30+4.5/6.5*360},${190} ${Array.from({length:40},(_,i)=>{const x=i/40; return `L${30+(x+4.5)/6.5*360},${190-(4*x+12)/20*175}`;}).join(' ')} L${30+5.5/6.5*360},${190-(4+12)/20*175} ${Array.from({length:40},(_,i)=>{const x=1-i/40; return `L${30+(x+4.5)/6.5*360},${190-(Math.pow(x,3)+3*x*x+12)/20*175}`;}).join(' ')} Z`} fill="rgba(212,160,23,0.28)" stroke="none"/>
                      <path d={Array.from({length:120},(_,i)=>{const x=-4.5+i*6.5/120; return `${i===0?'M':'L'}${30+(x+4.5)/6.5*360},${190-(Math.pow(x,3)+3*x*x+12)/20*175}`;}).join(' ')} fill="none" stroke="#c0392b" strokeWidth="2.2"/>
                      <line x1="30" y1={190-(-18+12)/20*175} x2="394" y2={190-(8+12)/20*175} stroke="#2980b9" strokeWidth="2.2"/>
                      <line x1="30" y1="190" x2="394" y2="190" stroke="#555" strokeWidth="1.4"/>
                      <line x1={30+4.5/6.5*360} y1="10" x2={30+4.5/6.5*360} y2="200" stroke="#555" strokeWidth="1.4"/>
                      {[[-4,-48,-16],[ 0,0,0],[1,4,4]].map(([xi,c,l])=><circle key={xi} cx={30+(xi+4.5)/6.5*360} cy={190-(l+12)/20*175} r="4" fill="#27ae60" stroke="#fff" strokeWidth="1.5"/>)}
                      <text x={30+0.5/6.5*360} y="204" fontSize="8" fontFamily="monospace" fill="#27ae60" textAnchor="middle">−4</text>
                      <text x={30+4.5/6.5*360} y="204" fontSize="8" fontFamily="monospace" fill="#27ae60" textAnchor="middle">0</text>
                      <text x={30+5.5/6.5*360} y="204" fontSize="8" fontFamily="monospace" fill="#27ae60" textAnchor="middle">1</text>
                      <text x="382" y={190-(8+12)/20*175} fontSize="10" fontFamily="serif" fill="#2980b9" fontStyle="italic">4x</text>
                      <text x="382" y="45" fontSize="10" fontFamily="serif" fill="#c0392b" fontStyle="italic">cubic</text>
                    </svg>
                  </div>
                </ToggleAnswer>
                <ToggleAnswer label="Show Full Solution">
                  <p style={S.p}><strong>Step 1 — Find intersections.</strong> {'$4x=x^3+3x^2 \\Rightarrow x^3+3x^2-4x=0 \\Rightarrow x(x+4)(x-1)=0$'}</p>
                  <p style={S.p}>Crossings at {'$x=-4,\\,0,\\,1$'}. Two enclosed regions: {'$[-4,0]$'} and {'$[0,1]$'}.</p>
                  <p style={S.p}><strong>Step 2 — Check which is on top in each region.</strong></p>
                  <p style={S.p}>{'On $(-4,0)$: test $x=-2$: cubic $=(-8+12)=4$, line $=-8$. Cubic on top. On $(0,1)$: test $x=0.5$: line $=2$, cubic $=0.875$. Line on top.'}</p>
                  <p style={S.p}><strong>Step 3 — Two separate integrals.</strong></p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_{-4}^{0}[(x^3+3x^2)-(4x)]\\,dx + \\int_0^1[(4x)-(x^3+3x^2)]\\,dx$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\left[\\frac{x^4}{4}+x^3-2x^2\\right]_{-4}^0 + \\left[2x^2-\\frac{x^4}{4}-x^3\\right]_0^1 = 32 + \\frac{3}{4} = \\boxed{\\frac{131}{4} = 32.75}$$'}</p>
                </ToggleAnswer>
              </div>

              {/* Example 6 */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 6 — Two Parabolas Switching</h4>
                <p style={S.p}>{'Find the total area enclosed between $f(x)=x^2-1$ and $g(x)=1-x^2$ on $[-2,2]$.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Find crossings:</strong> {'$x^2-1=1-x^2 \\Rightarrow x=\\pm 1$.'}</p>
                  <p style={S.p}>{'On $(-1,1)$: $g>f$. On $(-2,-1)$ and $(1,2)$: $f>g$. Each integrand: $f-g=2x^2-2$, $g-f=2-2x^2$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$A = \\int_{-2}^{-1}(2x^2-2)\\,dx + \\int_{-1}^{1}(2-2x^2)\\,dx + \\int_1^2(2x^2-2)\\,dx = \\frac{4}{3}+\\frac{8}{3}+\\frac{4}{3} = \\boxed{\\frac{16}{3}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── NET EXCESS PROFIT ── */}
            <section id="netexcess" className="lec-sec">
              <div style={S.secLabel}>§ 4 — Net Excess Profit</div>
              <h2 style={S.h2}>Which Investment Plan<br/>Is Actually Better?</h2>
              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.05rem'}}>Imagine comparing two business investment plans — Plan 1 and Plan 2 — both generating profit over time but at <em>different rates</em>. Over the next N years, how much more total profit does the better plan accumulate? The answer is the <strong>area between the two rate-of-profit curves</strong>.</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Net Excess Profit</div>
                <p style={S.p}>{"Suppose two plans generate profits $P_1(t)$ and $P_2(t)$ with rates $P_1'(t)$ and $P_2'(t)$. If $P_2'(t)\\geq P_1'(t)$ over $[0,N]$, the "}<strong>net excess profit</strong>{" of Plan 2 over Plan 1 is:"}</p>
                <p style={{textAlign:'center',fontSize:'1.12rem'}}>{"$$NE = \\int_0^N\\bigl[P_2'(t)-P_1'(t)\\bigr]\\,dt$$"}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{"This is the area between the two rate curves $P_2'$ and $P_1'$ over $[0,N]$."}</p>
              </div>

              {/* Net excess diagram */}
              <div style={{background:'#fff',border:'1px solid #e0d6c8',borderRadius:'12px',padding:'22px 24px',marginBottom:'24px'}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#d4a017',marginBottom:'12px'}}>Net Excess Profit — Visualised</div>
                <svg viewBox="0 0 520 188" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'580px',display:'block',margin:'0 auto'}}>
                  <rect width="520" height="188" fill="#fdf8f0" rx="8"/>
                  {[0,2,4,6,8].map(x=><line key={x} x1={50+x/8*430} y1="15" x2={50+x/8*430} y2="165" stroke="#e0d8cc" strokeWidth="0.8" strokeDasharray="3,3"/>)}
                  {[0,2,4,6].map(y=><line key={y} x1="50" y1={165-y/6*150} x2="480" y2={165-y/6*150} stroke="#e0d8cc" strokeWidth="0.8" strokeDasharray="3,3"/>)}
                  <path d={`M50,${165-1/6*150} ${Array.from({length:100},(_,i)=>{const t=i*8/100;const p2=2.5+1.5*Math.sin(t/3)+0.8*Math.cos(t/5); return `L${50+t/8*430},${165-p2/6*150}`;}).join(' ')} L480,${165-2/6*150} ${Array.from({length:100},(_,i)=>{const t=8-i*8/100;const p1=1+0.5*Math.sin(t/2); return `L${50+t/8*430},${165-p1/6*150}`;}).join(' ')} Z`} fill="rgba(212,160,23,0.30)" stroke="none"/>
                  <path d={Array.from({length:120},(_,i)=>{const t=i*8/120;const p2=2.5+1.5*Math.sin(t/3)+0.8*Math.cos(t/5); return `${i===0?'M':'L'}${50+t/8*430},${165-p2/6*150}`;}).join(' ')} fill="none" stroke="#c0392b" strokeWidth="2.5"/>
                  <path d={Array.from({length:120},(_,i)=>{const t=i*8/120;const p1=1+0.5*Math.sin(t/2); return `${i===0?'M':'L'}${50+t/8*430},${165-p1/6*150}`;}).join(' ')} fill="none" stroke="#2980b9" strokeWidth="2.5"/>
                  <line x1="50" y1="165" x2="488" y2="165" stroke="#555" strokeWidth="1.5"/>
                  <line x1="50" y1="12" x2="50" y2="170" stroke="#555" strokeWidth="1.5"/>
                  <polygon points="488,165 481,162 481,168" fill="#555"/>
                  <text x="490" y="168" fontSize="11" fontFamily="monospace" fill="#555">t</text>
                  <text x="30" y="20" fontSize="10" fontFamily="monospace" fill="#555">Rate</text>
                  <text x="430" y={165-3/6*150} fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">P₂'(t)</text>
                  <text x="430" y={165-1/6*150} fontSize="11" fontFamily="serif" fill="#2980b9" fontStyle="italic">P₁'(t)</text>
                  <text x="50" y="180" fontSize="10" fontFamily="monospace" fill="#888">0</text>
                  <text x="480" y="180" fontSize="10" fontFamily="monospace" fill="#888">N</text>
                  <text x="265" y="85" fontSize="12" fontFamily="monospace" fill="#b8860b" fontWeight="700" textAnchor="middle">NE = shaded area</text>
                </svg>
                <p style={{...S.p,marginTop:'12px',marginBottom:0,fontSize:'.93rem',textAlign:'center'}}>The shaded region = how much extra Plan 2 earns over Plan 1, accumulated over {'$[0,N]$'}.</p>
              </div>

              <div style={S.calloutTeal}><strong>Why it works:</strong> By the Net Change Theorem, {'$\\int_0^N[P_2\'(t)-P_1\'(t)]\\,dt = [P_2(N)-P_1(N)] - [P_2(0)-P_1(0)]$'} — the total accumulated excess profit of Plan 2 over Plan 1 from start to finish.</div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 7 — LUMS Canteen Franchise Plans</h4>
                <p style={S.p}>{'Two franchise options have profit rates (PKR lakhs/year): $P_1\'(t)=2t+4$ and $P_2\'(t)=-t^2+8t+4$. Find the net excess profit of Plan 2 over Plan 1 over $N=5$ years.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Step 1 — Verify Plan 2 is better throughout {'$[0,5]$'}.</strong></p>
                  <p style={S.p}>{'$P_2\'-P_1\'= -t^2+8t+4-(2t+4)=-t^2+6t=t(6-t)\\geq 0$ for $t\\in[0,6]$. ✓'}</p>
                  <p style={{textAlign:'center'}}>{'$$NE = \\int_0^5(-t^2+6t)\\,dt = \\left[-\\frac{t^3}{3}+3t^2\\right]_0^5 = \\left(-\\frac{125}{3}+75\\right) = \\frac{100}{3} \\approx \\boxed{\\text{PKR }33.33\\text{ lakhs}}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 8 — Plans Switch Dominance</h4>
                <p style={S.p}>{"Two startup plans: $P_1'(t)=t^2-4t+5$ and $P_2'(t)=-t^2+4t+1$ over $[0,6]$ years. Find the total net excess profit (whichever plan is better at each moment)."}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Find crossing times:</strong></p>
                  <p style={{textAlign:'center'}}>{"$$t^2-4t+5=-t^2+4t+1 \\Rightarrow 2t^2-8t+4=0 \\Rightarrow t=2\\pm\\sqrt{2}$$"}</p>
                  <p style={S.p}>{'So $t_1 \\approx 0.586$ and $t_2 \\approx 3.414$. On $(t_1,t_2)$: Plan 2 better. Outside: Plan 1 better.'}</p>
                  <p style={S.p}>{'Integrand in each piece: $|2t^2-8t+4|$. Antiderivative $F(t)=\\frac{2t^3}{3}-4t^2+4t$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$NE = |F(t_1)-F(0)| + |F(t_2)-F(t_1)| + |F(6)-F(t_2)| \\approx 0.69+5.66+13.66 \\approx \\boxed{20\\text{ lakhs total gap}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── LORENZ CURVE ── */}
            <section id="lorenz" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Lorenz Curve & Gini Index</div>
              <h2 style={S.h2}>Measuring Inequality:<br/>From 1905 America to Today</h2>
              <div style={{...S.card,...S.cardTl,background:'linear-gradient(135deg,#eef7f7,#f0fcf9)'}}>
                <p style={{...S.p,fontSize:'1.05rem'}}>In 1905, American economist <strong>Max Lorenz</strong> was studying income data and had a brilliant idea: draw a single curve capturing how <em>evenly</em> income is distributed. Forty years later, Italian statistician <strong>Corrado Gini</strong> converted that curve into a single number — the <strong>Gini Index</strong> — now used by every government and the World Bank to rank inequality across nations.</p>
                <p style={{...S.p,marginBottom:0,fontSize:'1.05rem'}}>The Gini Index is literally a ratio of two areas — and computing it requires the definite integral you just learned.</p>
              </div>

              <h3 style={S.h3teal}>Building the Lorenz Curve — Step by Step</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'14px',margin:'20px 0'}}>
                {[
                  {n:'1',title:'Rank everyone by income',body:'Sort the entire population from poorest to richest. Each person gets a number 0%–100% based on their rank in the income ladder.'},
                  {n:'2',title:'Think in cumulative percentages',body:'The point (x, y) on the Lorenz curve means: "the bottom x% of the population earns y% of total income." So (0.4, 0.12) means the bottom 40% earn only 12% of total income.'},
                  {n:'3',title:'The perfect equality line',body:'If everyone earned exactly the same, the bottom 30% would earn 30%, bottom 50% would earn 50%, etc. This gives the straight line y=x — the "line of perfect equality."'},
                  {n:'4',title:'Real curves bow downward',body:'In reality the poor earn a smaller share than their population fraction. The Lorenz curve always lies below or on y=x. The further it bows, the more unequal the society.'},
                ].map((step,i)=>(
                  <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start',background:'#fff',border:'1px solid #e0d6c8',borderRadius:'10px',padding:'16px 20px'}}>
                    <div style={{width:'36px',height:'36px',background:'#1a6b6b',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:'.85rem',flexShrink:0}}>{step.n}</div>
                    <div><strong style={{display:'block',marginBottom:'4px',color:'#1a6b6b'}}>{step.title}</strong>{step.body}</div>
                  </div>
                ))}
              </div>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>The Lorenz Curve</div>
                <p style={S.p}>{'A Lorenz curve $y=L(x)$, $x\\in[0,1]$ satisfies: (1) $L(0)=0$ and $L(1)=1$; (2) $L(x)\\leq x$ for all $x\\in[0,1]$; (3) $L$ is increasing and convex (bows downward).'}</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>The Gini Index</div>
                <p style={S.p}>{'The Gini Index $G$ measures the area between the perfect equality line and the Lorenz curve, as a fraction of the full triangle:'}</p>
                <p style={{textAlign:'center',fontSize:'1.15rem'}}>{'$$G = \\frac{\\int_0^1[x-L(x)]\\,dx}{\\tfrac{1}{2}} = 2\\int_0^1\\bigl[x - L(x)\\bigr]\\,dx$$'}</p>
                <table style={{...S.table,marginTop:'12px'}}>
                  <thead><tr><th style={S.th}>G = 0</th><th style={S.th}>G ≈ 0.3</th><th style={S.th}>G ≈ 0.5</th><th style={S.th}>G = 1</th></tr></thead>
                  <tbody><tr>
                    <td style={S.td}>Perfect equality</td>
                    <td style={S.tdEven}>Relatively equal (Scandinavia)</td>
                    <td style={S.td}>High inequality (many developing nations)</td>
                    <td style={S.tdEven}>One person owns everything (impossible)</td>
                  </tr></tbody>
                </table>
              </div>

              <LorenzWidget />

              <div style={S.calloutGreen}><strong>Pakistan context:</strong> Pakistan's Gini Index is approximately 0.29–0.33 (World Bank, 2023), suggesting moderate income inequality. However, wealth inequality is significantly higher — the richest 10% hold over 60% of total wealth.</div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 9 — Gini Index from {'$L(x)=x^3$'}</h4>
                <p style={S.p}>{'A country\'s income distribution is modelled by $L(x)=x^3$. Find the Gini Index and interpret.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>Verify:</strong> {'$L(0)=0$, $L(1)=1$, $L\'\'(x)=6x\\geq 0$ (convex), $x^3\\leq x$ on $[0,1]$. ✓'}</p>
                  <p style={{textAlign:'center'}}>{'$$G=2\\int_0^1(x-x^3)\\,dx = 2\\left[\\frac{x^2}{2}-\\frac{x^4}{4}\\right]_0^1 = 2\\cdot\\frac{1}{4} = \\boxed{0.5}$$'}</p>
                  <p style={S.p}><strong>Interpretation:</strong> {'Gini = 0.5 signals significant inequality. Check: $L(0.5)=(0.5)^3=0.125$ — the bottom 50% earn only 12.5% of income.'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 10 — {'$L(x)=\\frac{3x^2+x^3}{4}$'}</h4>
                <p style={S.p}>{'Find the Gini Index and determine what fraction of income the bottom 40% earn.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={{textAlign:'center'}}>{'$$G=2\\int_0^1\\left(x-\\frac{3x^2+x^3}{4}\\right)dx = 2\\left[\\frac{x^2}{2}-\\frac{x^3}{4}-\\frac{x^4}{16}\\right]_0^1 = 2\\left(\\frac{1}{2}-\\frac{1}{4}-\\frac{1}{16}\\right) = 2\\cdot\\frac{3}{16} = \\boxed{\\frac{3}{8}=0.375}$$'}</p>
                  <p style={S.p}>{'Bottom 40%: $L(0.4)=\\frac{3(0.16)+0.064}{4}=\\frac{0.544}{4}\\approx 13.6\\%$ of income.'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 11 — Comparing Two Districts</h4>
                <p style={S.p}>{'Districts A and B have $L_A(x)=x^2$ and $L_B(x)=\\frac{x^2+x^3}{2}$. Which is more equal and by how much?'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={{textAlign:'center'}}>{'$$G_A=2\\int_0^1(x-x^2)\\,dx=2\\cdot\\frac{1}{6}=\\frac{1}{3}\\approx 0.333$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$G_B=2\\int_0^1\\left(x-\\frac{x^2+x^3}{2}\\right)dx=2\\left(\\frac{1}{2}-\\frac{1}{6}-\\frac{1}{8}\\right)=\\frac{5}{12}\\approx 0.417$$'}</p>
                  <p style={S.p}>{'District A is more equal ($G_A < G_B$). The Gini gap is $\\approx 0.083$ — District B has substantially more inequality.'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── AVERAGE VALUE ── */}
            <section id="avgvalue" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Average Value of a Function</div>
              <h2 style={S.h2}>What Is the "Average" of a<br/>Continuously Changing Quantity?</h2>
              <p style={S.p}>You know how to average a finite list: add them up, divide by the count. But what if the quantity changes continuously — like temperature through a day, speed over a trip, or drug concentration in blood?</p>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Deriving the Formula from First Principles</h4>
                <p style={S.p}>{'Divide $[a,b]$ into $n$ subintervals, width $\\Delta x=(b-a)/n$, sample $f(x_1),\\ldots,f(x_n)$.'}</p>
                <p style={S.p}><strong>Discrete average:</strong></p>
                <p style={{textAlign:'center'}}>{'$$\\text{avg}\\approx\\frac{1}{n}\\sum_{i=1}^n f(x_i) = \\frac{1}{b-a}\\sum_{i=1}^n f(x_i)\\,\\Delta x$$'}</p>
                <p style={S.p}>{'(since $1/n = \\Delta x/(b-a)$). Take $n\\to\\infty$:'}</p>
                <p style={{textAlign:'center',fontSize:'1.1rem'}}>{'$$\\text{avg}=\\frac{1}{b-a}\\int_a^b f(x)\\,dx$$'}</p>
              </div>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Average Value of a Function</div>
                <p style={S.p}>{'If $f$ is continuous on $[a,b]$, the average value of $f$ over $[a,b]$ is:'}</p>
                <p style={{textAlign:'center',fontSize:'1.22rem'}}>{'$$f_{\\text{avg}} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx$$'}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{'Equivalently: $f_{\\text{avg}}\\cdot(b-a)=\\int_a^b f(x)\\,dx$ — average value times interval length equals area under the curve.'}</p>
              </div>

              <AvgValueWidget />
            </section>

            {/* ── TWO INTERPRETATIONS ── */}
            <section id="interpretations" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Two Interpretations of Average Value</div>
              <h2 style={S.h2}>Two Ways to Understand<br/>Average Value</h2>

              {/* Geometric Interpretation */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>🔷 Geometric Interpretation</h4>
                <p style={S.p}>{'$f_{\\text{avg}}$'} is the <strong>height of a rectangle</strong> on {'$[a,b]$'} that has <em>exactly</em> the same area as the region under {'$f(x)$'}.</p>
                <div style={{display:'flex',gap:'24px',alignItems:'flex-start',flexWrap:'wrap',margin:'12px 0'}}>
                  <svg viewBox="0 0 250 165" xmlns="http://www.w3.org/2000/svg" style={{flex:'0 0 250px',width:'250px',height:'165px',borderRadius:'8px',background:'#fdf8f0',border:'1px solid #e0d6c8'}}>
                    <path d="M28,135 Q62,62 96,88 Q128,112 158,50 Q184,20 208,62 L208,135 Z" fill="rgba(212,160,23,0.2)" stroke="none"/>
                    <path d="M28,135 Q62,62 96,88 Q128,112 158,50 Q184,20 208,62" fill="none" stroke="#c0392b" strokeWidth="2"/>
                    <line x1="28" y1="86" x2="208" y2="86" stroke="#1a6b6b" strokeWidth="1.8" strokeDasharray="5,3"/>
                    <rect x="28" y="86" width="180" height="49" fill="rgba(26,107,107,0.12)" stroke="#1a6b6b" strokeWidth="1.5" strokeDasharray="4,3"/>
                    <line x1="22" y1="135" x2="220" y2="135" stroke="#555" strokeWidth="1.2"/>
                    <line x1="28" y1="140" x2="28" y2="14" stroke="#555" strokeWidth="1.2"/>
                    <text x="118" y="83" fontSize="10" fontFamily="monospace" fill="#1a6b6b" textAnchor="middle">f_avg</text>
                    <text x="195" y="56" fontSize="11" fontFamily="serif" fill="#c0392b" fontStyle="italic">f(x)</text>
                    <text x="28" y="150" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">a</text>
                    <text x="208" y="150" fontSize="9" fontFamily="monospace" fill="#888" textAnchor="middle">b</text>
                    <text x="118" y="118" fontSize="9" fontFamily="monospace" fill="#1a6b6b" textAnchor="middle">Same area!</text>
                  </svg>
                  <div style={{flex:1,minWidth:'160px'}}>
                    <p style={S.p}>{'The rectangle with height $f_{\\text{avg}}$ and width $(b-a)$ has area:'}</p>
                    <p style={{textAlign:'center'}}>{'$$f_{\\text{avg}}\\cdot(b-a)=\\int_a^b f(x)\\,dx$$'}</p>
                    <p style={{...S.p,marginBottom:0}}>{'$f_{\\text{avg}}$'} "levels out" the function — it is the height at which you can replace the wavy curve with a flat horizontal line and preserve the exact same total area.</p>
                  </div>
                </div>
              </div>

              {/* Rate Interpretation */}
              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>⚡ Rate Interpretation</h4>
                <p style={S.p}>When {'$f(t)$'} represents a <strong>rate of change</strong>, the average value has a direct physical meaning:</p>
                <div style={S.defBox}>
                  <div style={{...S.lbl,color:'#1a6b6b'}}>Rate Interpretation</div>
                  <p style={{...S.p,marginBottom:0}}>{'If $f(t)$ is the rate of change of some quantity $Q$, then $f_{\\text{avg}}$ is the constant rate that would produce the same total change in $Q$ over $[a,b]$.'}</p>
                </div>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>{'$f(t)$'} represents</th><th style={S.th}>{'$f_{\\text{avg}}$'} means</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}>Speed (km/h)</td><td style={S.td}>Average speed — same distance if travelling at this constant speed</td></tr>
                    <tr><td style={S.tdEven}>Power consumption (MW)</td><td style={S.tdEven}>Average power — same total energy consumed</td></tr>
                    <tr><td style={S.td}>Marginal revenue (PKR/unit)</td><td style={S.td}>Average marginal revenue over the production range</td></tr>
                    <tr><td style={S.tdEven}>Temperature (°C)</td><td style={S.tdEven}>Average daily temperature reading</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Examples */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 12 — Average Temperature in Lahore</h4>
                <p style={S.p}>{'During a summer day, temperature (°C) at time $t$ hours after midnight is $T(t)=-0.3t^2+6t+22$, $0\\leq t\\leq 20$. Find the average temperature.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={{textAlign:'center'}}>{'$$T_{\\text{avg}}=\\frac{1}{20}\\int_0^{20}(-0.3t^2+6t+22)\\,dt = \\frac{1}{20}\\left[-0.1t^3+3t^2+22t\\right]_0^{20}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$=\\frac{1}{20}(-800+1200+440) = \\frac{840}{20} = \\boxed{42^\\circ\\text{C}}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 13 — Average Velocity of a Delivery Truck</h4>
                <p style={S.p}>{'Velocity $v(t)=t^2-8t+20$ km/h, $0\\leq t\\leq 6$ h. Find (a) average velocity and (b) total distance.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}><strong>(a)</strong></p>
                  <p style={{textAlign:'center'}}>{'$$v_{\\text{avg}}=\\frac{1}{6}\\int_0^6(t^2-8t+20)\\,dt=\\frac{1}{6}\\left[\\frac{t^3}{3}-4t^2+20t\\right]_0^6=\\frac{1}{6}(72-144+120)=\\boxed{8\\text{ km/h}}$$'}</p>
                  <p style={S.p}><strong>(b)</strong> {'$v=(t-4)^2+4>0$ always, so distance = $\\int_0^6 v\\,dt = 48$ km. Check: $v_{\\text{avg}}\\times 6=48$ ✓'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 14 — Karachi Export Firm (Substitution Required)</h4>
                <p style={S.p}>{'Revenue rate: $R(t)=\\dfrac{6t}{\\sqrt{t^2+16}}$ PKR millions/month, $0\\leq t\\leq 3$. Find average monthly revenue rate.'}</p>
                <ToggleAnswer label="Show Solution">
                  <p style={S.p}>{'Let $u=t^2+16$, $du=2t\\,dt$. Limits: $u(0)=16$, $u(3)=25$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^3\\frac{6t}{\\sqrt{t^2+16}}\\,dt=3\\int_{16}^{25}u^{-1/2}\\,du=3\\Big[2\\sqrt{u}\\Big]_{16}^{25}=6(5-4)=6$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$R_{\\text{avg}}=\\frac{1}{3}\\cdot 6=\\boxed{\\text{PKR }2\\text{ million/month}}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ── EXERCISES ── */}
            <section id="exercises" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Practice Problems</div>
              <h2 style={S.h2}>Test Yourself</h2>

              {[
                {
                  acc: 'cardAl', h4s: 'h4red', n:1,
                  title:'Area Between sin and cos',
                  q:'Find the area of the region enclosed between $f(x)=\\sin x$ and $g(x)=\\cos x$ on $[0,\\pi/2]$.',
                  sol:<>
                    <p style={S.p}>{'At $x=\\pi/4$: they intersect. On $[0,\\pi/4]$: $\\cos>\\sin$. On $[\\pi/4,\\pi/2]$: $\\sin>\\cos$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$A=\\int_0^{\\pi/4}(\\cos x-\\sin x)\\,dx+\\int_{\\pi/4}^{\\pi/2}(\\sin x-\\cos x)\\,dx=(\\sqrt{2}-1)+(\\sqrt{2}-1)=\\boxed{2\\sqrt{2}-2\\approx 0.828}$$'}</p>
                  </>
                },
                {
                  acc:'cardGl', h4s:'h4gold', n:2,
                  title:'Cubic vs. x-axis',
                  q:'Find the total area enclosed between $y=x^3-x$ and the $x$-axis on $[-1,1]$.',
                  sol:<>
                    <p style={S.p}>{'Roots: $x=0,\\pm 1$. On $(-1,0)$: $x^3-x>0$. On $(0,1)$: $x^3-x<0$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$A=\\int_{-1}^0(x^3-x)\\,dx+\\int_0^1(x-x^3)\\,dx=\\frac{1}{4}+\\frac{1}{4}=\\boxed{\\frac{1}{2}}$$'}</p>
                  </>
                },
                {
                  acc:'cardTl', h4s:'h4teal', n:3,
                  title:'Net Excess Profit',
                  q:"Two plans: $P_1'(t)=3t^2-6t+4$ and $P_2'(t)=4t+2$ (PKR lakhs/year). Find the net excess profit of the better plan over $[0,4]$.",
                  sol:<>
                    <p style={S.p}>{'Set equal: $3t^2-10t+2=0 \\Rightarrow t=(10\\pm\\sqrt{76})/6$; crossings at $t\\approx 0.21$ and $t\\approx 3.13$.'}</p>
                    <p style={S.p}>{'On $(0.21,3.13)$: $P_2\'$ larger. On $(0,0.21)$ and $(3.13,4)$: $P_1\'$ larger. Total area $\\approx \\boxed{\\text{PKR }20.3\\text{ lakhs}}$.'}</p>
                  </>
                },
                {
                  acc:'cardSl', h4s:'h4blue', n:4,
                  title:'Lorenz Curve',
                  q:'Given $L(x)=\\frac{5x^2+x^4}{6}$: (a) verify it is valid, (b) find Gini Index, (c) what share do the bottom 50% earn?',
                  sol:<>
                    <p style={S.p}><strong>(a)</strong> {'$L(0)=0$, $L(1)=1$, $L\'\'(x)>0$ ✓, $L(x)\\leq x$ ✓.'}</p>
                    <p style={{textAlign:'center'}}>{'$$G=2\\int_0^1\\left(x-\\frac{5x^2+x^4}{6}\\right)dx=2\\left[\\frac{x^2}{2}-\\frac{5x^3}{18}-\\frac{x^5}{30}\\right]_0^1=2\\cdot\\frac{8}{45}=\\boxed{\\frac{16}{45}\\approx 0.356}$$'}</p>
                    <p style={S.p}><strong>(c)</strong> {'$L(0.5)=\\frac{5(0.25)+0.0625}{6}\\approx 0.219$. Bottom 50% earn about 21.9% of income.'}</p>
                  </>
                },
                {
                  acc:'cardPl', h4s:'h4green', n:5,
                  title:'Average Value with Substitution',
                  q:'Find the average value of $f(x)=x\\sqrt{4-x^2}$ on $[0,2]$.',
                  sol:<>
                    <p style={S.p}>{'Let $u=4-x^2$, $du=-2x\\,dx$. Limits: $u(0)=4$, $u(2)=0$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$\\int_0^2 x\\sqrt{4-x^2}\\,dx=\\frac{1}{2}\\int_0^4 u^{1/2}\\,du=\\frac{1}{2}\\cdot\\frac{2}{3}\\cdot 8=\\frac{8}{3}$$'}</p>
                    <p style={{textAlign:'center'}}>{'$$f_{\\text{avg}}=\\frac{1}{2}\\cdot\\frac{8}{3}=\\boxed{\\frac{4}{3}\\approx 1.333}$$'}</p>
                  </>
                },
                {
                  acc:'cardAl', h4s:'h4red', n:6,
                  title:'Average Speed of a Decelerating Car',
                  q:'Speed (km/h): $v(t)=60(1-e^{-0.5t})$ for $0\\leq t\\leq 4$ min. Find average speed.',
                  sol:<>
                    <p style={{textAlign:'center'}}>{'$$v_{\\text{avg}}=\\frac{1}{4}\\int_0^4 60(1-e^{-0.5t})\\,dt=15\\left[t+2e^{-0.5t}\\right]_0^4=15[(4+2e^{-2})-(0+2)]=30+30e^{-2}\\approx\\boxed{34.06\\text{ km/h}}$$'}</p>
                  </>
                },
                {
                  acc:'cardGl', h4s:'h4gold', n:7,
                  title:'Area Bounded by Exponentials',
                  q:'Find the area enclosed by $y=e^x$, $y=e^{-x}$, and $x=\\ln 3$.',
                  sol:<>
                    <p style={S.p}>{'Curves meet at $x=0$. For $x\\in[0,\\ln 3]$: $e^x>e^{-x}$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$A=\\int_0^{\\ln 3}(e^x-e^{-x})\\,dx=\\Big[e^x+e^{-x}\\Big]_0^{\\ln 3}=(3+\\tfrac{1}{3})-2=\\boxed{\\frac{4}{3}}$$'}</p>
                  </>
                },
                {
                  acc:'cardTl', h4s:'h4teal', n:8,
                  title:'Gini from Data — Find n',
                  q:"An NGO models a village's income as $L(x)=x^n$. If the bottom 25% earn 3.125% of income, find $n$ and the Gini Index.",
                  sol:<>
                    <p style={S.p}>{'$L(0.25)=0.03125 \\Rightarrow (1/4)^n=1/32 \\Rightarrow 2^{-2n}=2^{-5} \\Rightarrow n=2.5$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$G=2\\int_0^1(x-x^{2.5})\\,dx=2\\left[\\frac{x^2}{2}-\\frac{x^{3.5}}{3.5}\\right]_0^1=2\\left(\\frac{1}{2}-\\frac{2}{7}\\right)=\\frac{3}{7}\\approx\\boxed{0.429}$$'}</p>
                    <p style={S.p}>A Gini of 0.43 signals significant inequality in this village.</p>
                  </>
                },
                {
                  acc:'cardSl', h4s:'h4blue', n:9,
                  title:'Challenge — Three Curves',
                  q:'Find the area enclosed among $y=x^2$, $y=2-x^2$, and $y=2x-1$.',
                  sol:<>
                    <p style={S.p}>{'Pairwise intersections: $x^2=2-x^2 \\Rightarrow x=\\pm 1$; $x^2=2x-1 \\Rightarrow x=1$; $2-x^2=2x-1 \\Rightarrow x=-3,1$. The enclosed region is on $[-1,1]$ where top $=2-x^2$, bottom $=x^2$.'}</p>
                    <p style={{textAlign:'center'}}>{'$$A=\\int_{-1}^1(2-2x^2)\\,dx=\\left[2x-\\frac{2x^3}{3}\\right]_{-1}^1=\\frac{8}{3}-(-\\frac{8}{3})=\\boxed{\\frac{8}{3}}$$'}</p>
                  </>
                },
                {
                  acc:'cardPl', h4s:'h4green', n:10,
                  title:'Challenge — Average Value of a Solution to an IVP',
                  q:"$Q'(t)=\\sqrt{2t+1}$, $Q(0)=5$. Find (a) $Q(t)$, (b) average rate of change on $[0,4]$, (c) average value of $Q$ on $[0,4]$.",
                  sol:<>
                    <p style={S.p}><strong>(a)</strong> {'$Q(t)=\\int\\sqrt{2t+1}\\,dt=\\frac{1}{3}(2t+1)^{3/2}+C$. $Q(0)=\\frac{1}{3}+C=5 \\Rightarrow C=\\frac{14}{3}$. So $Q(t)=\\frac{(2t+1)^{3/2}+14}{3}$.'}</p>
                    <p style={S.p}><strong>(b)</strong> {'Average rate $=\\frac{1}{4}\\int_0^4\\sqrt{2t+1}\\,dt=\\frac{1}{12}[(2t+1)^{3/2}]_0^4=\\frac{1}{12}(27-1)=\\frac{13}{6}\\approx 2.17$.'}</p>
                    <p style={S.p}><strong>(c)</strong> {'$Q_{\\text{avg}}=\\frac{1}{4}\\int_0^4\\frac{(2t+1)^{3/2}+14}{3}\\,dt=\\frac{1}{12}\\left[\\frac{(2t+1)^{5/2}}{5}+14t\\right]_0^4=\\frac{1}{12}\\left(\\frac{243-1}{5}+56\\right)=\\frac{1}{12}\\cdot\\frac{242+280}{5}=\\frac{522}{60}=\\boxed{8.7}$.'}</p>
                  </>
                },
              ].map(({acc,h4s,n,title,q,sol})=>(
                <div key={n} style={{...S.card,...S[acc]}}>
                  <h3 style={{...S.h3teal,marginTop:0}}>Problem {n} — {title}</h3>
                  <p style={S.p}>{q}</p>
                  <ToggleAnswer label="Reveal Solution">{sol}</ToggleAnswer>
                </div>
              ))}

              <div style={S.divider}/>
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Coming up next —</strong> §5.5 Applications to Business: consumer and producer surplus, present and future value of income streams, and more economic tools built on everything you have learned in this chapter.</div>
            </section>

          </div>{/* end lec-inner */}

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s53" style={S.lnfBtnPrev}>← §5.3 Definite Integral & FTC</Link>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#7f8c8d',textAlign:'center'}}>§5.4 · Chapter 5 · Calculus I</div>
            <Link href="/courses/calc1" style={S.lnfBtnNext}>§5.5 Applications to Business →</Link>
          </div>

        </main>
      </div>
      <Footer/>
    </>
  );
}