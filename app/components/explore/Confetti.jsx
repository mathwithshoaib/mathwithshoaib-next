'use client';

import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#e8a020', '#38c9b0', '#9b80e8', '#e06b6b', '#e8dcc8'];

/* Small celebratory burst — pure CSS/JS, no dependency. `fire` is a
   changing token (e.g. a counter or timestamp): every new value replays
   the burst. Renders nothing most of the time. */
export default function Confetti({ fire }) {
  const [active, setActive] = useState(false);

  const pieces = useMemo(() => {
    if (!fire) return [];
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.9,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 80,
      size: 6 + Math.random() * 6,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  useEffect(() => {
    if (!fire) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 2200);
    return () => clearTimeout(t);
  }, [fire]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="explore-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="explore-confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
          }}
        />
      ))}
      <style>{`
        .explore-confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 500; }
        .explore-confetti-piece {
          position: absolute; top: -10px; border-radius: 2px; opacity: 0;
          animation-name: explore-confetti-fall; animation-timing-function: ease-in; animation-fill-mode: forwards;
        }
        @keyframes explore-confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 100vh) rotate(var(--rotate)); opacity: 0; }
        }
        @media(prefers-reduced-motion: reduce) {
          .explore-confetti { display: none; }
        }
      `}</style>
    </div>
  );
}
