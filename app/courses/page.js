import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Courses · Shoaib-K · LUMS',
  description: 'Interactive lecture notes, problem sets, and complete course materials for Pre-Calculus, Calculus I, and Linear Algebra at LUMS.',
};

export default function Courses() {
  return (
    <>
      <Navbar activePage="courses" />

      {/* BREADCRUMB */}
      <div className="sk-breadcrumb">
        <div className="sk-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep"> › </span>
          <span className="current">Courses</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,var(--bg) 0%,var(--bg2) 100%)',padding:'60px 0 48px',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <span className="eyebrow">Teaching Portfolio</span>
          <h1 style={{fontSize:'clamp(2.4rem,5vw,4rem)'}}>Courses</h1>
          <p style={{maxWidth:'560px',fontSize:'1.05rem'}}>Interactive lecture notes, problem sets, and complete course materials for all mathematics courses I teach at LUMS.</p>
          <div style={{display:'flex',gap:'10px',marginTop:'20px',flexWrap:'wrap'}}>
            <span className="tag tag-amber">4 Courses</span>
            <span className="tag tag-teal">Interactive Notes</span>
            <span className="tag">LUMS · Mathematics</span>
          </div>
        </div>
      </div>

      {/* COURSES */}
      <section className="sk-section">
        <div className="container">

          {/* PRE-CALCULUS */}
          <div className="card card-amber" style={{marginBottom:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'20px'}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:'var(--text3)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'8px'}}>Pre-Calculus · Introductory Level</div>
                <h3 style={{marginBottom:'10px'}}>Pre-Calculus</h3>
                <p style={{maxWidth:'560px'}}>Functions, trigonometry, analytic geometry, exponentials, logarithms, and the complete mathematical toolkit needed before calculus. Emphasis on deep understanding over rote memorisation.</p>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'12px'}}>
                  <span className="tag">Functions</span>
                  <span className="tag">Trigonometry</span>
                  <span className="tag">Algebra</span>
                  <span className="tag">Exponentials</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'12px'}}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',background:'var(--amber-lt)',border:'1px solid var(--amber-bd)',color:'var(--amber)',padding:'4px 12px',borderRadius:'20px'}}>Introductory</span>
                <Link href="/courses/precalc" className="btn btn-sm btn-amber">View Course →</Link>
              </div>
            </div>
          </div>

          {/* CALCULUS I */}
          <div className="card card-teal" style={{marginBottom:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'20px'}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:'var(--text3)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'8px'}}>MATH-101 · Calculus I · Two Tracks</div>
                <h3 style={{marginBottom:'10px'}}>Calculus I</h3>
                <p style={{maxWidth:'560px'}}>Taught in two parallel versions — the <strong style={{color:'var(--amber)'}}>rigorous track</strong> (Stewart) builds calculus from epsilon-delta limits upward, while the <strong style={{color:'var(--teal)'}}>applied track</strong> (Hoffmann) emphasises business and economics applications throughout.</p>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'12px'}}>
                  <span className="tag tag-teal">Limits</span>
                  <span className="tag tag-teal">Derivatives</span>
                  <span className="tag tag-teal">Integration</span>
                  <span className="tag">Differential Equations</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'12px'}}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',background:'var(--teal-lt)',border:'1px solid rgba(56,201,176,.4)',color:'var(--teal)',padding:'4px 12px',borderRadius:'20px'}}>Undergraduate I</span>
                <Link href="/courses/calc1" className="btn btn-sm" style={{background:'var(--teal)',borderColor:'var(--teal)',color:'var(--bg)'}}>View Course →</Link>
              </div>
            </div>
          </div>

          {/* LINEAR ALGEBRA */}
          <div className="card card-navy" style={{marginBottom:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'20px'}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:'var(--text3)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'8px'}}>MATH-201 · Linear Algebra I</div>
                <h3 style={{marginBottom:'10px'}}>Linear Algebra I</h3>
                <p style={{maxWidth:'560px'}}>Vectors, matrices, linear transformations, determinants, eigenvalues, and eigenvectors. Applications to machine learning (SVD, PCA), computer graphics, and data science highlighted throughout.</p>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'12px'}}>
                  <span className="tag tag-navy">Matrices</span>
                  <span className="tag tag-navy">Eigenvalues</span>
                  <span className="tag">ML Links</span>
                  <span className="tag">SVD</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'12px'}}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',background:'rgba(155,128,232,.1)',border:'1px solid rgba(155,128,232,.3)',color:'var(--violet)',padding:'4px 12px',borderRadius:'20px'}}>Undergraduate II</span>
                <Link href="/courses/linalg" className="btn btn-sm" style={{background:'var(--violet)',borderColor:'var(--violet)',color:'#fff'}}>View Course →</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        window.addEventListener('scroll', () => {
          const el = document.documentElement;
          const bar = document.getElementById('sk-progress-bar');
          if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
        }, { passive: true });
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      `}} />
    </>
  );
}