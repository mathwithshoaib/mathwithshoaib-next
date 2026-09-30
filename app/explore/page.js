'use client';

import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NimGame from './NimGame';
import PaperFolding from './PaperFolding';

/* ══════════════════════════════════════════════════════
   Explore — a growing hub of math games, puzzles, and fun
   activities. Started with 2 activities carried over from the
   old Google Sites portfolio (Nim + Paper Folding to the Moon —
   rebuilt natively here since the old embeds weren't reachable).
   Add a new <section className="card"> block for each new
   activity/puzzle as it's ready.
   ══════════════════════════════════════════════════════ */

export default function ExplorePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activePage="explore" />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'calc(var(--nav-h) + 3px)',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ padding: '64px 32px 56px' }}>
          <span className="eyebrow reveal">Play &amp; Wonder</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            Explore
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            A growing collection of math games and puzzles — no coursework attached, just things worth
            playing with. New activities and puzzles added regularly.
          </p>
        </div>
      </section>

      {/* ── NIM GAME ── */}
      <section className="sk-section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="reveal card" style={{ padding: '28px 30px' }}>
            <span className="eyebrow" style={{ color: 'var(--teal)' }}>Strategy Game</span>
            <h2 style={{ fontSize: '1.5rem', margin: '6px 0 10px' }}>Nim</h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '22px' }}>
              An ancient strategy game: players remove objects from piles, and whoever takes the last object
              wins. Beneath the simple setup lies elegant mathematics — a perfect winning strategy based on
              the binary <em>nim-sum</em>, discovered by Charles Bouton in 1901.
            </p>
            <NimGame />
          </div>
        </div>
      </section>

      {/* ── PAPER FOLDING ── */}
      <section className="sk-section sk-section-alt">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="reveal card" style={{ padding: '28px 30px' }}>
            <span className="eyebrow" style={{ color: 'var(--amber)' }}>Exponential Growth</span>
            <h2 style={{ fontSize: '1.5rem', margin: '6px 0 10px' }}>Paper Folding to the Moon</h2>
            <PaperFolding />
          </div>
        </div>
      </section>

      {/* ── MORE COMING ── */}
      <section className="sk-section">
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <div className="reveal" style={{ border: '1px dashed var(--border2)', borderRadius: 'var(--radius)', padding: '32px' }}>
            <span className="eyebrow">More on the Way</span>
            <h3 style={{ margin: '8px 0 8px' }}>Weekly &amp; Monthly Puzzles</h3>
            <p style={{ color: 'var(--text3)', fontSize: '.88rem', margin: 0 }}>
              More games, brain-teasers, and a running puzzle-of-the-week are coming — check back soon.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
