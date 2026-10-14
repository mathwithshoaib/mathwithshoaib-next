'use client';

import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════
   Wall Hurdle — a self-contained Quoridor-style board game (board,
   rules engine, and a computer opponent, all in one file), served
   statically at /explore/wall-hurdle.html and embedded here via
   iframe rather than ported into React.

   Resize: unlike the other iframe-based activities (which auto-size
   via postMessage), this one is same-origin, so the wrapper reads
   the iframe's own contentDocument directly — no message-passing
   needed. The game's own layout logic already sizes its board to
   fit the iframe's height without internal scrolling, so giving it
   a sensible starting height here (rather than 0) matters.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking / badges) — it never affects the game itself.
   Online multiplayer is disabled in this build (needs a separate
   realtime backend); solo vs. computer, local two-player, and the
   tutorial all work fully offline.
   ══════════════════════════════════════════════════════ */

const GAME_SRC = '/explore/wall-hurdle.html';

export default function WallHurdle({ onEvent } = {}) {
  const frameRef = useRef(null);
  const [ready, setReady] = useState(false);
  const firedInteracted = useRef(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer;

    function fit() {
      const doc = frame.contentDocument;
      if (doc) frame.style.height = doc.documentElement.scrollHeight + 'px';
    }

    function markInteracted() {
      if (firedInteracted.current) return;
      firedInteracted.current = true;
      onEvent?.('interacted');
    }

    function onLoad() {
      setReady(true);
      fit();
      const doc = frame.contentDocument;
      const body = doc?.body;
      if (body && 'ResizeObserver' in window) {
        observer?.disconnect();
        observer = new ResizeObserver(fit);
        observer.observe(body);
      }
      doc?.addEventListener('pointerdown', markInteracted, { once: true });
      doc?.addEventListener('keydown', markInteracted, { once: true });
    }

    frame.addEventListener('load', onLoad);
    return () => {
      frame.removeEventListener('load', onLoad);
      observer?.disconnect();
    };
  }, [onEvent]);

  return (
    <div style={{ position: 'relative' }}>
      {!ready && (
        <p style={{ color: 'var(--text3)', fontFamily: 'var(--fm)', fontSize: '.8rem', margin: 0, padding: '40px 0', textAlign: 'center' }}>
          Loading the game…
        </p>
      )}
      <iframe
        ref={frameRef}
        src={GAME_SRC}
        title="Wall Hurdle"
        style={{
          width: '100%',
          minHeight: 760,
          border: 'none',
          display: 'block',
          borderRadius: 'var(--radius)',
          opacity: ready ? 1 : 0,
          transition: 'opacity .25s ease',
        }}
      />
    </div>
  );
}
