import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Linear Algebra I · Shoaib-K · LUMS',
  description:
    'MATH-201 Linear Algebra I at LUMS — systems of equations, vector spaces, linear maps, determinants, eigentheory, and SVD with ML applications.',
};

export default function LinAlg() {
  return (
    <>
      <Navbar activePage="courses" />

      {/* STICKY SUB-HEADER */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Linear Algebra I</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {[
            { href: '/courses/precalc', label: 'Pre-Calculus', active: false },
            { href: '/courses/calc1', label: 'Calculus I', active: false },
            { href: '/courses/linalg', label: 'Linear Algebra I', active: true },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em',
              textTransform: 'uppercase', color: active ? 'var(--amber)' : 'var(--text3)',
              padding: '9px 18px', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
              whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px + 37px + 40px)', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px + 37px + 40px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' }}>MATH-201 · Linear Algebra I</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 }}>Course Contents</div>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' }}>← All Courses</Link>
          </div>

          <nav style={{ padding: '8px 0 24px' }}>
            {[
              {
                ch: 'Chapter 1 — Systems & Matrices',
                items: ['L01 · Systems of Linear Equations', 'L02 · Row Reduction & Echelon Forms', 'L03 · Matrix Operations', 'L04 · Inverse Matrices & LU Factorization'],
              },
              {
                ch: 'Chapter 2 — Vector Spaces',
                items: ['L05 · Vectors & Vector Spaces', 'L06 · Null Space & Column Space', 'L07 · Linear Independence & Bases'],
              },
              {
                ch: 'Chapter 3 — Linear Maps',
                items: ['L08 · Linear Transformations', 'L09 · Matrix Representations'],
              },
              {
                ch: 'Chapter 4 — Determinants',
                items: ['L10 · Determinants & Properties', 'L11 · Geometric Meaning'],
              },
              {
                ch: 'Chapter 5 — Eigentheory',
                items: ['L12 · Eigenvalues & Eigenvectors', 'L13 · Diagonalization', 'L14 · Orthogonality & Gram-Schmidt', 'L15 · SVD & Applications to ML'],
              },
            ].map(({ ch, items }) => (
              <div key={ch}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--text3)', padding: '10px 16px 3px', display: 'block' }}>{ch}</span>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', opacity: .38, lineHeight: 1.35 }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0, background: 'var(--bg)' }}>

          {/* HERO */}
          <div style={{ padding: '44px 52px 36px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)', borderBottom: '1px solid var(--border)' }}>
            <span className="eyebrow">MATH-201 · Undergraduate II · LUMS</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '12px' }}>Linear Algebra I</h1>
            <p style={{ maxWidth: '580px', fontSize: '1.05rem', color: 'var(--text2)' }}>
              The grammar of modern science and data. From solving equations to understanding machine learning — linear algebra is everywhere, and this course builds it from the ground up.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="tag tag-amber">Matrices</span>
              <span className="tag">Eigenvalues</span>
              <span className="tag">ML Applications</span>
              <span className="tag">SVD</span>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginTop: '28px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Level</div>
                <div style={{ fontSize: '.95rem', color: 'var(--text)', marginTop: '4px' }}>Undergraduate II</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Textbook</div>
                <div style={{ fontSize: '.95rem', color: 'var(--text)', marginTop: '4px' }}>Lay, Linear Algebra &amp; Its Applications</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '.95rem', color: 'var(--amber)', marginTop: '4px' }}>Lectures Coming Soon</div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '44px 52px' }}>

            {/* Note callout */}
            <div style={{ background: 'rgba(232,160,32,.08)', borderLeft: '4px solid var(--amber)', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: '36px' }}>
              <strong>📢 Note:</strong> Lecture notes are in preparation. The complete topic outline is shown in the sidebar — lectures will appear as they go live.
            </div>

            {/* Why Linear Algebra */}
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '1.4rem', color: 'var(--text)', marginBottom: '20px' }}>Why Linear Algebra?</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
              Linear algebra is the mathematical backbone of machine learning, computer graphics, quantum mechanics, economics, and virtually every quantitative discipline. This course builds the theory carefully — from first principles — while constantly connecting it to real applications.
            </p>

            {/* Application cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px', marginBottom: '32px' }}>
              {[
                { icon: '🤖', title: 'Machine Learning', desc: 'PCA, SVD, least squares regression — the core of ML is linear algebra applied at scale.' },
                { icon: '🎮', title: 'Computer Graphics', desc: 'Every rotation, reflection, and 3D projection in a video game is a matrix multiplication.' },
                { icon: '⚛️', title: 'Quantum Mechanics', desc: 'Quantum states are vectors. Observables are matrices. Eigenvalues are measurement outcomes.' },
                { icon: '📈', title: 'Economics & Data', desc: 'Systems of equations, input-output models, and data decomposition — all linear algebra.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card" style={{ padding: '26px 28px' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{icon}</div>
                  <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>{title}</h4>
                  <p style={{ fontSize: '.9rem', marginBottom: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Prerequisites */}
            <div style={{ background: 'rgba(56,201,176,.08)', borderLeft: '4px solid var(--teal)', borderRadius: '0 8px 8px 0', padding: '16px 20px' }}>
              <strong style={{ color: 'var(--teal)' }}>Prerequisites:</strong> Calculus I or equivalent. Comfort with functions and basic algebraic manipulation.
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 52px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/courses/calc1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>← Calculus I</Link>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>All Courses →</Link>
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