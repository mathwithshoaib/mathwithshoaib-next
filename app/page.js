import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Muhammad Shoaib Khan · Mathematician · LUMS',
  description: 'Welcome to the academic home of Muhammad Shoaib Khan — Teaching Fellow at LUMS, researcher in mathematical epidemiology, and passionate mathematics educator.',
};

export default function Home() {
  return (
    <>
      <Navbar activePage="home" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">

            {/* Photo */}
            <div className="hero-img-wrap reveal">
              <div className="hero-img-ring"></div>
              <Image
                src="/images/shoaib.jpeg"
                alt="Muhammad Shoaib Khan"
                className="hero-img"
                width={340}
                height={340}
                priority
                style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            {/* Text */}
            <div className="hero-text">
              <span className="eyebrow">Mathematician · Educator · Researcher</span>
              <h1>Muhammad<br /><em>Shoaib Khan</em></h1>
              <div className="hero-role">Adjunct Teaching Fellow &amp; Research Assistant · LUMS</div>
              <p className="hero-desc">
                Welcome to my academic home. I teach mathematics rigorously and passionately at LUMS, and pursue doctoral research in mathematical epidemiology — using differential equations to understand how diseases spread through populations.
              </p>
              <div className="hero-btns">
                <Link href="/courses" className="btn">My Courses</Link>
                <Link href="/education" className="btn btn-outline">About Me</Link>
                <Link href="/contact" className="btn btn-amber">Get in Touch</Link>
              </div>
              <div className="medals">
                <div className="medal-pill"><span>🥇</span> Gold Medal — GCU Lahore</div>
                <div className="medal-pill"><span>🇫🇷</span> France Fellowship — Lille</div>
                <div className="medal-pill"><span>🌍</span> IMM — COMSATS + ICTP Italy</div>
              </div>
            </div>

          </div>

          {/* Stats Strip */}
          <div className="stats-strip reveal">
            <div className="stat"><span className="stat-n">4</span><div className="stat-l">Courses Taught</div></div>
            <div className="stat"><span className="stat-n">🥇</span><div className="stat-l">Gold Medal</div></div>
            <div className="stat"><span className="stat-n">LUMS</span><div className="stat-l">Institution</div></div>
            <div className="stat"><span className="stat-n">PhD</span><div className="stat-l">Research Ongoing</div></div>
            <div className="stat"><span className="stat-n">∞</span><div className="stat-l">Love for Math</div></div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="sk-section sk-section-alt">
        <div className="container">
          <span className="eyebrow">Explore the Site</span>
          <h2 style={{ marginBottom: '32px' }}>What Would You Like to See?</h2>
          <div className="grid-4 reveal-stagger">
            <Link href="/education" className="card card-navy" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎓</div>
              <h4>Education</h4>
              <p style={{ fontSize: '.88rem' }}>Degrees from LUMS, GCU, COMSATS &amp; University of Lille, France.</p>
            </Link>
            <Link href="/experience/instructor" className="card card-amber" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👨‍🏫</div>
              <h4>Experience</h4>
              <p style={{ fontSize: '.88rem' }}>Teaching fellow, TA, and Math Circles facilitator.</p>
            </Link>
            <Link href="/courses" className="card card-teal" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📐</div>
              <h4>Courses</h4>
              <p style={{ fontSize: '.88rem' }}>Pre-Calculus, Calculus I, Linear Algebra — with interactive notes.</p>
            </Link>
            <Link href="/explore" className="card card-violet" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚀</div>
              <h4>Explore</h4>
              <p style={{ fontSize: '.88rem' }}>Interactive mathematical activities — fold paper to the Moon and more!</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESEARCH SNAPSHOT ── */}
      <section className="sk-section">
        <div className="container">
          <div className="research-grid">
            <div className="reveal">
              <span className="eyebrow">Current Focus</span>
              <h2>Research in Mathematical Epidemiology</h2>
              <p>My doctoral research develops compartmental ODE models for disease co-infection — studying how pathogens like influenza and pneumonia interact in shared host populations. The work involves computing ℛ₀ via the Next Generation Matrix, stability analysis, and bifurcation theory.</p>
              <Link href="/research" className="btn btn-outline" style={{ marginTop: '8px' }}>View Research →</Link>
            </div>
            <div className="code-card reveal">
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', marginBottom: '14px', letterSpacing: '.15em', textTransform: 'uppercase' }}>Co-Infection Model</div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.85rem', lineHeight: '2.1', color: 'var(--text2)' }}>
                <span style={{ color: 'var(--amber)' }}>dS</span>/dt = Λ − β₁<span style={{ color: 'var(--teal)' }}>I₁</span>S/N − β₂<span style={{ color: 'var(--violet)' }}>I₂</span>S/N − μS<br />
                <span style={{ color: 'var(--teal)' }}>dI₁</span>/dt = β₁<span style={{ color: 'var(--teal)' }}>I₁</span>S/N − (γ₁+μ)<span style={{ color: 'var(--teal)' }}>I₁</span><br />
                <span style={{ color: 'var(--violet)' }}>dI₂</span>/dt = β₂<span style={{ color: 'var(--violet)' }}>I₂</span>S/N − (γ₂+μ)<span style={{ color: 'var(--violet)' }}>I₂</span><br />
                <span style={{ color: 'var(--text3)' }}>──────────────────</span><br />
                <span style={{ color: 'var(--amber)' }}>ℛ₀</span> = ρ(FV⁻¹)
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        // Progress bar
        window.addEventListener('scroll', () => {
          const el = document.documentElement;
          const bar = document.getElementById('sk-progress-bar');
          if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
        }, { passive: true });
        // Reveal animations
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      `}} />
    </>
  );
}