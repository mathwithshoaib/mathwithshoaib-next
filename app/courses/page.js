import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoursesExplorer from './CoursesExplorer';

export const metadata = {
  title: 'Courses · Shoaib-K · LUMS',
  description:
    'Interactive lecture notes, problem sets, and complete course materials for Pre-Calculus, Calculus I, and Linear Algebra at LUMS.',
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
      <div
        style={{
          position: 'relative',
          background:
            'radial-gradient(1200px 400px at 80% -10%, rgba(232,160,32,.10), transparent 60%), radial-gradient(900px 360px at 0% 10%, rgba(56,201,176,.08), transparent 55%), linear-gradient(135deg,var(--bg) 0%,var(--bg2) 100%)',
          padding: '64px 0 52px',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Teaching Portfolio</span>
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', margin: '0 0 14px' }}>
            Explore the{' '}
            <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Courses</span>
          </h1>
          <p style={{ maxWidth: '580px', fontSize: '1.08rem', color: 'var(--text2)' }}>
            Interactive lecture notes, worked problem sets, and complete materials for every
            mathematics course I teach at LUMS. Search, sort, and browse however suits you.
          </p>

          {/* quick stat row */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '26px', flexWrap: 'wrap' }}>
            {[
              ['3', 'Courses'],
              ['21+', 'Lectures live'],
              ['100%', 'Solver-verified'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: '1.9rem', color: 'var(--text)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPLORER */}
      <section className="sk-section" style={{ paddingTop: '44px' }}>
        <div className="container">
          <CoursesExplorer />
        </div>
      </section>

      <Footer />
    </>
  );
}