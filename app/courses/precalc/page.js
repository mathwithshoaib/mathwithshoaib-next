import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Pre-Calculus · Shoaib-K · LUMS',
  description: 'Pre-Calculus course at LUMS — functions, trigonometry, analytic geometry, exponentials and logarithms. Complete lecture notes and course materials.',
};

export default function PreCalc() {
  return (
    <>
      <Navbar activePage="courses" />

      {/* STICKY SUB-HEADER */}
      <div style={{position:'sticky',top:'calc(var(--nav-h) + 3px)',zIndex:500,background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
        <div style={{padding:'8px 24px',display:'flex',alignItems:'center',gap:'8px',fontFamily:'var(--fm)',fontSize:'.72rem',color:'var(--text3)',borderBottom:'1px solid var(--border)'}}>
          <Link href="/" style={{color:'var(--amber)'}}>Home</Link><span>›</span>
          <Link href="/courses" style={{color:'var(--amber)'}}>Courses</Link><span>›</span>
          <span style={{color:'var(--text2)',fontWeight:500}}>Pre-Calculus</span>
        </div>
        <div style={{display:'flex',alignItems:'center',padding:'0 24px',overflowX:'auto'}}>
          {[
            {href:'/courses/precalc', label:'Pre-Calculus', active:true},
            {href:'/courses/calc1', label:'Calculus I', active:false},
            {href:'/courses/linalg', label:'Linear Algebra I', active:false},
          ].map(({href,label,active}) => (
            <Link key={href} href={href} style={{
              fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.06em',
              textTransform:'uppercase', color: active ? 'var(--amber)' : 'var(--text3)',
              padding:'9px 18px', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
              whiteSpace:'nowrap', textDecoration:'none'
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{display:'flex',paddingTop:'calc(var(--nav-h) + 3px + 37px + 40px)',minHeight:'100vh'}}>

        {/* SIDEBAR */}
        <aside style={{width:'256px',flexShrink:0,position:'sticky',top:'calc(var(--nav-h) + 3px + 37px + 40px)',height:'calc(100vh - var(--nav-h) - 80px)',overflowY:'auto',background:'var(--bg2)',borderRight:'1px solid var(--border)'}}>
          <div style={{padding:'18px 16px 12px',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:'var(--fm)',fontSize:'.6rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--amber)',marginBottom:'4px'}}>Pre-Calculus</div>
            <div style={{fontFamily:'var(--fh)',fontSize:'.95rem',color:'var(--text)',lineHeight:1.3}}>Course Contents</div>
            <Link href="/courses" style={{display:'inline-flex',alignItems:'center',gap:'5px',fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',marginTop:'8px',textDecoration:'none'}}>← Back to Courses</Link>
          </div>
          <nav style={{padding:'8px 0 24px'}}>
            {[
              {ch:'Chapter 1 — Functions', items:['L01 · Introduction to Functions','L02 · Domain, Range & Graphs','L03 · Transformations & Symmetry']},
              {ch:'Chapter 2 — Algebra', items:['L04 · Polynomial Functions','L05 · Rational Functions','L06 · Exponentials & Logs']},
              {ch:'Chapter 3 — Trigonometry', items:['L07 · Unit Circle & Angles','L08 · Trig Functions & Graphs','L09 · Trig Identities','L10 · Solving Trig Equations']},
              {ch:'Chapter 4 — Analytic Geometry', items:['L11 · Conic Sections','L12 · Parametric & Polar']},
            ].map(({ch,items}) => (
              <div key={ch}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.58rem',letterSpacing:'.22em',textTransform:'uppercase',color:'var(--text3)',padding:'10px 16px 3px',display:'block'}}>{ch}</span>
                {items.map(item => (
                  <div key={item} style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 16px',fontFamily:'var(--fm)',fontSize:'.72rem',color:'var(--text3)',opacity:.38,lineHeight:1.35}}>
                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--border2)',flexShrink:0,display:'inline-block'}}></span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{flex:1,minWidth:0,background:'var(--bg)'}}>

          {/* HERO */}
          <div style={{padding:'44px 52px 36px',background:'linear-gradient(135deg,var(--bg) 0%,var(--bg2) 100%)',borderBottom:'1px solid var(--border)'}}>
            <span className="eyebrow">MATH-100 · Introductory Level · LUMS</span>
            <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',marginBottom:'12px'}}>Pre-Calculus</h1>
            <p style={{maxWidth:'640px',fontSize:'1.05rem',color:'var(--text2)'}}>The essential mathematical foundation — built carefully so that when you reach calculus, every concept feels natural rather than mysterious.</p>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'20px'}}>
              <span className="tag tag-amber">Functions</span>
              <span className="tag">Trigonometry</span>
              <span className="tag">Algebra</span>
              <span className="tag">Analytic Geometry</span>
            </div>
            <div style={{display:'flex',gap:'40px',marginTop:'28px',flexWrap:'wrap'}}>
              <div>
                <div style={{fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Level</div>
                <div style={{fontSize:'.95rem',color:'var(--text)',marginTop:'4px'}}>Introductory Undergraduate</div>
              </div>
              <div>
                <div style={{fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Textbook</div>
                <div style={{fontSize:'.95rem',color:'var(--text)',marginTop:'4px'}}>Sullivan, Pre-Calculus</div>
              </div>
              <div>
                <div style={{fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Status</div>
                <div style={{fontSize:'.95rem',color:'var(--amber)',marginTop:'4px'}}>Lectures Coming Soon</div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div style={{padding:'44px 52px'}}>

            <div style={{background:'rgba(232,160,32,.08)',borderLeft:'4px solid var(--amber)',borderRadius:'0 8px 8px 0',padding:'16px 20px',marginBottom:'36px'}}>
              <strong>📢 Note:</strong> Lecture notes for this course are currently being prepared. Check back soon — they will appear in the sidebar as they go live.
            </div>

            <h3 style={{fontFamily:'var(--fh)',fontSize:'1.4rem',color:'var(--text)',marginBottom:'20px'}}>What This Course Covers</h3>

            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'20px',marginBottom:'32px'}}>
              {[
                {icon:'📊', title:'Functions & Graphs', desc:'Definition, domain, range, composition, inverse functions, and the visual language of mathematical curves. Understanding how functions behave is the foundation of all higher mathematics.'},
                {icon:'📐', title:'Trigonometry', desc:'Unit circle, radian measure, all six trig functions, identities, and solving trigonometric equations. The language of angles and periodic behaviour.'},
                {icon:'🔢', title:'Algebra & Polynomials', desc:'Polynomial division, rational functions, exponentials, logarithms, and systems of equations. The algebraic toolkit that calculus will transform into a powerful analytical engine.'},
                {icon:'🌀', title:'Analytic Geometry', desc:'Parabolas, ellipses, hyperbolas, and parametric curves — the shapes calculus will soon let you analyse. Connecting algebraic equations to geometric intuition.'},
              ].map(({icon,title,desc}) => (
                <div key={title} className="card" style={{padding:'26px 28px'}}>
                  <div style={{fontSize:'1.8rem',marginBottom:'12px'}}>{icon}</div>
                  <h4 style={{color:'var(--text)',marginBottom:'8px'}}>{title}</h4>
                  <p style={{fontSize:'.9rem',marginBottom:0}}>{desc}</p>
                </div>
              ))}
            </div>

            <div style={{background:'rgba(56,201,176,.08)',borderLeft:'4px solid var(--teal)',borderRadius:'0 8px 8px 0',padding:'16px 20px'}}>
              <strong style={{color:'var(--teal)'}}>Prerequisites:</strong> Secondary school mathematics. No prior university mathematics required. This course is designed to be self-contained and accessible.
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 52px',borderTop:'1px solid var(--border)',flexWrap:'wrap',gap:'12px'}}>
            <Link href="/courses" style={{display:'inline-flex',alignItems:'center',gap:'8px',fontFamily:'var(--fm)',fontSize:'.74rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text3)',padding:'8px 18px',border:'1px solid var(--border)',borderRadius:'8px',textDecoration:'none'}}>← All Courses</Link>
            <Link href="/courses/calc1" style={{display:'inline-flex',alignItems:'center',gap:'8px',fontFamily:'var(--fm)',fontSize:'.74rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--amber)',padding:'8px 18px',border:'1px solid rgba(232,160,32,.4)',borderRadius:'8px',background:'rgba(232,160,32,.07)',textDecoration:'none'}}>Next: Calculus I →</Link>
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