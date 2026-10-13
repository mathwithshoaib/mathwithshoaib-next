'use client';

import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════
   100 Square Jigsaw — a self-contained vanilla JS/HTML game
   (drag-and-drop puzzle logic, no React needed), served as a static
   file at /explore/100-square-jigsaw.html and embedded here via
   iframe rather than ported line-by-line into a component. It posts
   two kinds of messages back to this wrapper:
     - { source: 'mws-jigsaw', type: 'resize', height }  on every layout
       change, so the iframe always matches its content's real height
       instead of scrolling internally or leaving dead space.
     - { source: 'mws-jigsaw', type: 'interacted' }  once, on the first
       real move (not on page load) — mirrors the onEvent('interacted')
       convention the other activities use for progress tracking.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking / badges) — it never affects the game itself.
   ══════════════════════════════════════════════════════ */

const GAME_SRC = '/explore/100-square-jigsaw.html';
const DEFAULT_HEIGHT = 900;

export default function HundredSquareJigsaw({ onEvent } = {}) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [ready, setReady] = useState(false);
  const firedInteracted = useRef(false);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.source !== 'mws-jigsaw') return;

      if (data.type === 'resize' && typeof data.height === 'number' && data.height > 0) {
        setHeight(data.height);
      } else if (data.type === 'interacted' && !firedInteracted.current) {
        firedInteracted.current = true;
        onEvent?.('interacted');
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEvent]);

  return (
    <div style={{ position: 'relative' }}>
      {!ready && (
        <p style={{ color: 'var(--text3)', fontFamily: 'var(--fm)', fontSize: '.8rem', margin: 0, padding: '40px 0', textAlign: 'center' }}>
          Loading the puzzle…
        </p>
      )}
      <iframe
        src={GAME_SRC}
        title="100 Square Jigsaw"
        onLoad={() => setReady(true)}
        style={{
          width: '100%',
          height: `${height}px`,
          border: 'none',
          display: 'block',
          borderRadius: 'var(--radius)',
          opacity: ready ? 1 : 0,
          position: ready ? 'static' : 'absolute',
          transition: 'opacity .25s ease',
        }}
      />
    </div>
  );
}
