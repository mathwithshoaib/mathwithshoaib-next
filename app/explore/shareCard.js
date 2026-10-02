// app/explore/shareCard.js
//
// Renders a small shareable PNG "result card" for the daily puzzle onto an
// off-screen <canvas> — no answer, no spoilers, just the streak/hints result
// and the mathwithshoaib.com link, so it's safe to post anywhere. Canvas is
// a browser-native API; this must only ever run client-side.

const WIDTH = 600;
const HEIGHT = 300;
// Rendered at 3x and downscaled for display, so the PNG stays crisp when
// zoomed in or shared to a platform that displays it larger than 600x300.
const SCALE = 3;

function roundRectPath(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function buildShareCardBlob({ streakCount = 1, hintsUsed = 0, totalHints = 3 } = {}) {
  if (typeof document === 'undefined') return null;

  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    // font loading state unavailable — fall back to default fonts, still fine
  }

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(SCALE, SCALE); // everything below draws in the original 600x300 logical space

  // background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#181f2e');
  bg.addColorStop(1, '#1e2840');
  ctx.fillStyle = bg;
  roundRectPath(ctx, 0, 0, WIDTH, HEIGHT, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, 1, 1, WIDTH - 2, HEIGHT - 2, 20);
  ctx.stroke();

  // subtle glow accent, top-right
  const glow = ctx.createRadialGradient(WIDTH - 60, 40, 10, WIDTH - 60, 40, 180);
  glow.addColorStop(0, 'rgba(232,160,32,0.14)');
  glow.addColorStop(1, 'rgba(232,160,32,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // eyebrow
  ctx.fillStyle = '#e8a020';
  ctx.font = '600 13px "DM Mono", monospace';
  ctx.fillText('PLAY & WONDER', 36, 48);

  // title
  ctx.fillStyle = '#e8e2d8';
  ctx.font = '400 34px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Daily Puzzle — Solved!', 36, 104);

  // streak
  ctx.font = '500 17px "DM Sans", sans-serif';
  ctx.fillStyle = '#a8b0c0';
  ctx.fillText(`🔥  ${streakCount} day${streakCount === 1 ? '' : 's'} streak`, 36, 150);

  // hint pips
  const pipSize = 30;
  const pipGap = 10;
  const pipY = 180;
  ctx.font = '500 14px "DM Sans", sans-serif';
  ctx.fillStyle = '#5a6478';
  ctx.fillText('HINTS USED', 36, pipY - 10);
  for (let i = 0; i < totalHints; i++) {
    const x = 36 + i * (pipSize + pipGap);
    ctx.fillStyle = i < hintsUsed ? '#e8a020' : 'rgba(255,255,255,0.08)';
    roundRectPath(ctx, x, pipY, pipSize, pipSize, 7);
    ctx.fill();
    if (i < hintsUsed) {
      ctx.fillStyle = '#181f2e';
      ctx.font = '700 15px "DM Mono", monospace';
      ctx.fillText('✓', x + pipSize / 2 - 5, pipY + pipSize / 2 + 5);
      ctx.font = '500 14px "DM Sans", sans-serif';
    }
  }
  if (hintsUsed === 0) {
    ctx.fillStyle = '#38c9b0';
    ctx.font = '600 14px "DM Sans", sans-serif';
    ctx.fillText('Solved on the first try!', 36 + totalHints * (pipSize + pipGap) + 6, pipY + pipSize / 2 + 5);
  }

  // footer link
  ctx.font = '600 16px "DM Mono", monospace';
  ctx.fillStyle = '#38c9b0';
  ctx.fillText('mathwithshoaib.com/explore', 36, HEIGHT - 32);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
