// Layered, animated page-header art (same spirit as the Math Circles header).
// Pure SVG + CSS/SMIL — no client JS. Styles live under "HERO BACKDROPS" in
// globals.css. Drop as the FIRST child of a `position:relative; overflow:hidden`
// section; the following .container is lifted above it by CSS.

const f = (n) => n.toFixed(1);

/** Floating coloured symbols: [glyph, left%, top%, colourClass, size, delay] */
function Syms({ items }) {
  return items.map(([g, x, y, c, s, d], i) => (
    <span key={i} className={`hb-sym ${c}`} style={{ left: `${x}%`, top: `${y}%`, fontSize: s, animationDelay: `${d}s` }}>{g}</span>
  ));
}

/* ───────────────────────── HOME: unit circle → sine wave ───────────────────────── */
function Home() {
  const cx = 150, cy = 130, r = 88, x0 = 320, W = 1120, turns = 2, N = 96;
  const k = W / (2 * Math.PI * turns);
  const th = (i) => (2 * Math.PI * turns * i) / N;
  const wave = Array.from({ length: N * 2 + 1 }, (_, i) => {
    const t = (2 * Math.PI * turns * i) / (N * 2);
    return `${i ? 'L' : 'M'}${f(x0 + k * t)} ${f(cy - r * Math.sin(t))}`;
  }).join(' ');
  const ys = Array.from({ length: N + 1 }, (_, i) => f(cy - r * Math.sin(th(i)))).join(';');
  const wx = Array.from({ length: N + 1 }, (_, i) => f(x0 + k * th(i))).join(';');
  const cxs = Array.from({ length: N + 1 }, (_, i) => f(cx + r * Math.cos(th(i)))).join(';');
  const dur = '24s';
  const dots = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 12; col++) dots.push([col * 26, row * 26, (row * 12 + col) % 9]);
  return (
    <>
      {/* dotted grid, top right */}
      <svg className="hb-abs" style={{ right: '3%', top: 90 }} width="320" height="160" viewBox="0 0 320 160">
        {dots.map(([x, y, n], i) => <circle key={i} className="ft hb-twinkle" cx={x + 6} cy={y + 6} r="2.6" style={{ animationDelay: `${n * 0.45}s` }} />)}
      </svg>
      {/* big dashed ring + orbiting dots, top right */}
      <svg className="hb-abs" style={{ right: '-90px', top: '-70px' }} width="420" height="420" viewBox="-210 -210 420 420">
        <circle r="180" className="sa" strokeWidth="1.3" strokeDasharray="4 9" opacity=".55" />
        <circle r="120" className="st" strokeWidth="1.2" opacity=".4" />
        <g className="hb-orbit" style={{ animationDuration: '50s' }}>
          <circle cx="180" r="7" className="fa" opacity=".75" />
          <circle cx="-120" r="5" className="ft" opacity=".75" />
        </g>
      </svg>
      {/* unit circle + travelling sine wave along the bottom */}
      <svg className="hb-home-band" viewBox="0 0 1500 260" preserveAspectRatio="xMidYMax slice">
        <line className="hb-grid" x1="40" x2="1480" y1={cy} y2={cy} />
        <line className="hb-grid" x1={cx} x2={cx} y1="20" y2="240" />
        <circle className="sa" cx={cx} cy={cy} r={r} strokeWidth="1.6" opacity=".7" />
        <path className="st" d={wave} strokeWidth="2.2" opacity=".6" />
        <g className="hb-mv">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`-${360 * turns} ${cx} ${cy}`} dur={dur} repeatCount="indefinite" />
          <line className="sa" x1={cx} y1={cy} x2={cx + r} y2={cy} strokeWidth="2" opacity=".8" />
          <circle className="fa" cx={cx + r} cy={cy} r="7" />
        </g>
        <line className="sa hb-mv" strokeWidth="1.3" strokeDasharray="4 5" opacity=".8">
          <animate attributeName="x1" values={cxs} dur={dur} repeatCount="indefinite" />
          <animate attributeName="y1" values={ys} dur={dur} repeatCount="indefinite" />
          <animate attributeName="x2" values={wx} dur={dur} repeatCount="indefinite" />
          <animate attributeName="y2" values={ys} dur={dur} repeatCount="indefinite" />
        </line>
        <circle className="ft hb-mv" r="7">
          <animate attributeName="cx" values={wx} dur={dur} repeatCount="indefinite" />
          <animate attributeName="cy" values={ys} dur={dur} repeatCount="indefinite" />
        </circle>
        <text className="fa" x={cx - 6} y={cy - r - 14} fontSize="20" fontFamily="var(--fh)" fontStyle="italic" opacity=".7">θ</text>
        <text className="ft" x={x0 + 30} y={cy - r - 14} fontSize="20" fontFamily="var(--fh)" fontStyle="italic" opacity=".7">sin θ</text>
      </svg>
      <Syms items={[
        ['π', 4, 16, 'fa', 58, 0], ['∫', 28, 9, 'ft', 62, 1.2], ['Σ', 92, 56, 'fv', 50, 2.2], ['∞', 93, 36, 'ft', 64, 0.6],
        ['√', 5, 52, 'fr', 48, 1.8], ['∂', 47, 6, 'fa', 40, 2.8], ['R₀', 88, 80, 'fr', 36, 1.4], ['Δ', 36, 62, 'fv', 38, 3.1],
      ]} />
    </>
  );
}

/* ───────────────────────── EDUCATION: a globe, a journey, a mortarboard ───────────────────────── */
function Education() {
  const R = 140;
  const meridians = Array.from({ length: 6 }, (_, i) => {
    const vals = Array.from({ length: 25 }, (_, j) => f(R * Math.abs(Math.cos((i * Math.PI) / 6 + (2 * Math.PI * j) / 24)))).join(';');
    return vals;
  });
  const lats = [-60, -30, 0, 30, 60];
  const path = 'M62 -10 Q 40 -105 -8 -52 Q -26 -108 -64 -68';
  const nodes = [[62, -10, 0], [-8, -52, 1.6], [-64, -68, 3.2]];
  return (
    <>
      <div className="hb-slot" style={{ right: '9%' }}>
        <svg width="360" height="360" viewBox="-180 -180 360 360">
          <circle r={R} className="sa" strokeWidth="1.8" opacity=".7" />
          <circle r={R} className="ta" stroke="none" />
          {meridians.map((v, i) => (
            <ellipse key={i} className={i % 2 ? 'st' : 'sa'} ry={R} strokeWidth="1.1" opacity=".45">
              <animate attributeName="rx" values={v} dur="26s" repeatCount="indefinite" />
            </ellipse>
          ))}
          {lats.map((d) => {
            const a = (d * Math.PI) / 180;
            return <ellipse key={d} className="sa" cx="0" cy={f(R * Math.sin(a))} rx={f(R * Math.cos(a))} ry={f(R * Math.cos(a) * 0.13)} strokeWidth="1" opacity=".4" strokeDasharray={d % 60 ? undefined : '3 6'} />;
          })}
          <path d={path} className="sr hb-flow" strokeWidth="2.2" opacity=".9" />
          {nodes.map(([x, y, d]) => (
            <g key={x}>
              <circle className="sr hb-pulse" cx={x} cy={y} r="22" style={{ animationDelay: `${d}s` }} />
              <circle className="fr" cx={x} cy={y} r="5.5" />
            </g>
          ))}
          <circle className="fa hb-mv" r="6.5"><animateMotion dur="7s" repeatCount="indefinite" path={path} /></circle>
          <g className="hb-orbit" style={{ animationDuration: '44s' }}>
            <circle r="166" className="st" strokeWidth="1.2" strokeDasharray="3 8" opacity=".5" />
            <circle cx="166" r="8" className="fa" opacity=".8" />
            <circle cx="-166" r="5" className="ft" opacity=".8" />
          </g>
        </svg>
      </div>
      {/* mortarboard */}
      <svg className="hb-abs hb-floaty" style={{ right: '34%', bottom: 22 }} width="120" height="90" viewBox="-60 -40 120 90">
        <polygon points="0,-30 54,-6 0,18 -54,-6" className="ta sa" strokeWidth="1.5" opacity=".8" />
        <path d="M-30 4 v22 q30 16 60 0 v-22" className="sa" strokeWidth="1.5" opacity=".7" />
        <path d="M54 -6 v32" className="sa" strokeWidth="1.5" opacity=".7" />
        <circle className="fa" cx="54" cy="30" r="4" />
      </svg>
      <Syms items={[
        ['Σ', 50, 12, 'fa', 46, 0], ['π', 62, 70, 'ft', 44, 1.4], ['∫', 90, 14, 'fv', 54, 2.2], ['φ', 47, 58, 'fr', 36, 0.8], ['∇', 93, 78, 'fa', 40, 2.9],
      ]} />
    </>
  );
}

/* ───────────────────────── EXPERIENCE: orbiting roles + drafting ruler ───────────────────────── */
function Experience() {
  const ticks = Array.from({ length: 21 }, (_, i) => i);
  return (
    <>
      <div className="hb-slot" style={{ right: '7%' }}>
        <svg width="400" height="400" viewBox="-200 -200 400 400">
          {[60, 105, 150, 190].map((r, i) => (
            <circle key={r} r={r} className={i % 2 ? 'st' : 'sa'} strokeWidth="1.2" opacity=".4" strokeDasharray={i % 2 ? '3 7' : undefined} />
          ))}
          <circle r="34" className="fa hb-breathe" opacity=".18" />
          <circle r="15" className="fa" opacity=".85" />
          <g className="hb-orbit" style={{ animationDuration: '18s' }}><circle cx="60" r="8" className="fa" /><circle cx="60" r="14" className="sa" strokeWidth="1" opacity=".5" /></g>
          <g className="hb-orbit" style={{ animationDuration: '30s', animationDirection: 'reverse' }}><circle cx="105" r="9" className="ft" /><circle cx="105" r="15" className="st" strokeWidth="1" opacity=".5" /></g>
          <g className="hb-orbit" style={{ animationDuration: '44s' }}><circle cx="150" r="10" className="fv" /><circle cx="150" r="16" className="sv" strokeWidth="1" opacity=".5" /></g>
          <g className="hb-orbit" style={{ animationDuration: '62s', animationDirection: 'reverse' }}><circle cx="190" r="6" className="fr" /></g>
        </svg>
      </div>
      {/* ruler */}
      <svg className="hb-abs hb-floaty" style={{ right: '40%', bottom: 26 }} width="210" height="46" viewBox="0 0 210 46">
        <rect x="2" y="6" width="206" height="34" rx="5" className="ta sa" strokeWidth="1.4" opacity=".85" />
        {ticks.map((i) => <line key={i} className="sa" x1={10 + i * 9.5} x2={10 + i * 9.5} y1="6" y2={i % 5 ? 17 : 24} strokeWidth="1.2" opacity=".6" />)}
      </svg>
      {/* protractor arc */}
      <svg className="hb-abs hb-floaty" style={{ right: '3%', bottom: 14, animationDelay: '-3s' }} width="120" height="64" viewBox="0 0 120 64">
        <path d="M6 60 A54 54 0 0 1 114 60 Z" className="tv sv" strokeWidth="1.4" opacity=".8" />
        <path d="M24 60 A36 36 0 0 1 96 60" className="sv" strokeWidth="1" opacity=".5" strokeDasharray="2 4" />
      </svg>
      <Syms items={[
        ['A+', 52, 12, 'fa', 40, 0], ['Σ', 90, 12, 'ft', 52, 1.2], ['÷', 50, 62, 'fv', 46, 2.1], ['∫', 94, 66, 'fr', 52, 0.7], ['%', 60, 82, 'fa', 34, 2.8],
      ]} />
    </>
  );
}

/* ───────────────────────── COURSES: Riemann bars, curve, sliding tangent ───────────────────────── */
function Courses() {
  const fx = (t) => 160 - 72 * Math.sin(t / 72) - 14 * Math.sin(t / 25);
  const base = 280, left = 34;
  const curve = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${f(left + i * 4)} ${f(fx(i * 4))}`).join(' ');
  const bars = Array.from({ length: 20 }, (_, i) => {
    const t = i * 24 + 12;
    return [left + i * 24, fx(t)];
  });
  return (
    <>
      <div className="hb-slot" style={{ right: '5%' }}>
        <svg width="540" height="330" viewBox="0 0 540 330">
          {[80, 160, 240].map((y) => <line key={y} className="hb-grid" x1={left} x2="520" y1={y} y2={y} />)}
          <line className="sa" x1={left} x2="526" y1={base} y2={base} strokeWidth="1.6" opacity=".55" />
          <line className="sa" x1={left} x2={left} y1="20" y2={base} strokeWidth="1.6" opacity=".55" />
          {bars.map(([x, y], i) => (
            <rect key={i} className="ta st hb-bar" x={x} y={f(y)} width="22" height={f(base - y)} strokeWidth="1" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
          <path d={curve} className="sa" strokeWidth="2.8" opacity=".85" />
          <g className="hb-mv">
            <animateMotion dur="14s" repeatCount="indefinite" path={curve} rotate="auto" />
            <line className="sr" x1="-64" x2="64" y1="0" y2="0" strokeWidth="2.2" opacity=".85" />
            <circle className="fa" r="6.5" />
          </g>
          <text className="fa" x="470" y="48" fontSize="26" fontFamily="var(--fh)" fontStyle="italic" opacity=".7">f(x)</text>
        </svg>
      </div>
      <Syms items={[
        ['∫', 49, 12, 'fa', 54, 0], ['dy/dx', 54, 76, 'ft', 30, 1.4], ['lim', 93, 10, 'fv', 32, 2.3], ['f′', 46, 50, 'fr', 40, 0.8], ['Σ', 91, 84, 'fa', 40, 2.9],
      ]} />
    </>
  );
}

/* ───────────────────────── RESEARCH: infection spreading through a population ───────────────────────── */
function Research() {
  const cols = 16, rows = 9, gap = 29, ox = 3, oy = 4;
  const dots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const d = Math.hypot(c - ox, r - oy);
    dots.push([c * gap + 14, r * gap + 14, d]);
  }
  const w = cols * gap, h = rows * gap;
  const spikes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <>
      <div className="hb-slot" style={{ right: '5%' }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <path d={`M10 ${h - 8} C150 ${h - 8} 190 20 250 20 S340 ${h - 8} 454 ${h - 8}`} className="sr hb-sir" pathLength="1" strokeWidth="2.2" opacity=".55" />
          <path d="M10 18 C120 18 170 60 230 150 S340 205 454 210" className="st hb-sir hb-sir-2" pathLength="1" strokeWidth="2.2" opacity=".45" />
          <path d={`M10 ${h - 8} C170 ${h - 8} 220 ${h - 40} 290 120 S400 40 454 34`} className="sv hb-sir hb-sir-3" pathLength="1" strokeWidth="2.2" opacity=".45" />
          {dots.map(([x, y, d], i) => (
            <circle key={i} className="hb-dot" cx={x} cy={y} r="5" style={{ animationDelay: `${(d * 0.42).toFixed(2)}s` }} />
          ))}
        </svg>
      </div>
      {/* virus */}
      <svg className="hb-abs" style={{ right: '1%', top: 14 }} width="110" height="110" viewBox="-55 -55 110 110">
        <g className="hb-spin-slow">
          <circle r="20" className="tr sr" strokeWidth="1.6" opacity=".85" />
          {spikes.map((a, i) => (
            <g key={i}>
              <line className="sr" x1={f(Math.cos(a) * 20)} y1={f(Math.sin(a) * 20)} x2={f(Math.cos(a) * 36)} y2={f(Math.sin(a) * 36)} strokeWidth="1.5" opacity=".7" />
              <circle className="fr" cx={f(Math.cos(a) * 40)} cy={f(Math.sin(a) * 40)} r="3.4" opacity=".8" />
            </g>
          ))}
        </g>
      </svg>
      <Syms items={[
        ['R₀', 47, 14, 'fr', 46, 0], ['β', 54, 80, 'ft', 46, 1.3], ['γ', 91, 80, 'fv', 44, 2.2], ['dI/dt', 46, 60, 'fa', 28, 0.8], ['S·I', 80, 8, 'ft', 28, 2.8],
      ]} />
    </>
  );
}

/* ───────────────────────── EXPLORE: spirograph, dice, star, tangram ───────────────────────── */
function spiro(Rr, r, d, scale, turns) {
  const pts = [];
  const steps = 900;
  for (let i = 0; i <= steps; i++) {
    const t = (turns * 2 * Math.PI * i) / steps;
    const x = (Rr - r) * Math.cos(t) + d * Math.cos(((Rr - r) / r) * t);
    const y = (Rr - r) * Math.sin(t) - d * Math.sin(((Rr - r) / r) * t);
    pts.push(`${i ? 'L' : 'M'}${f(x * scale)} ${f(y * scale)}`);
  }
  return pts.join(' ');
}
function Explore() {
  const star = Array.from({ length: 8 }, (_, i) => {
    const a = (((i * 3) % 7) * 2 * Math.PI) / 7 - Math.PI / 2;
    return `${i ? 'L' : 'M'}${f(Math.cos(a) * 56)} ${f(Math.sin(a) * 56)}`;
  }).join(' ');
  const pips = [[-17, -17], [17, -17], [0, 0], [-17, 17], [17, 17]];
  return (
    <>
      <div className="hb-slot" style={{ right: '9%' }}>
        <svg width="340" height="340" viewBox="-170 -170 340 340">
          <g className="hb-spin-slow" style={{ animationDuration: '90s' }}>
            <path d={spiro(100, 30, 65, 1.2, 3)} className="st" strokeWidth="1.3" opacity=".6" />
          </g>
          <g className="hb-spin-slow" style={{ animationDuration: '60s', animationDirection: 'reverse' }}>
            <path d={spiro(100, 45, 50, 0.85, 9)} className="sa" strokeWidth="1.1" opacity=".5" />
          </g>
          <circle r="165" className="sv" strokeWidth="1.2" strokeDasharray="3 8" opacity=".45" />
        </svg>
      </div>
      {/* die */}
      <svg className="hb-abs hb-tumble" style={{ right: '34%', bottom: 34 }} width="80" height="80" viewBox="-40 -40 80 80">
        <rect x="-34" y="-34" width="68" height="68" rx="12" className="ta sa" strokeWidth="1.6" opacity=".9" />
        {pips.map(([x, y], i) => <circle key={i} className="fa" cx={x} cy={y} r="5" opacity=".85" />)}
      </svg>
      {/* star polygon {7/3} */}
      <svg className="hb-abs" style={{ right: '1%', top: 22 }} width="120" height="120" viewBox="-60 -60 120 120">
        <g className="hb-spin-slow" style={{ animationDuration: '40s' }}><path d={`${star}Z`} className="sv" strokeWidth="1.6" opacity=".7" /></g>
      </svg>
      {/* tangram pieces */}
      <svg className="hb-abs hb-floaty" style={{ right: '27%', top: 30 }} width="120" height="80" viewBox="0 0 120 80">
        <polygon points="0,70 50,70 25,20" className="tr sr" strokeWidth="1.4" opacity=".85" />
        <polygon points="56,70 110,70 110,16" className="tt st" strokeWidth="1.4" opacity=".85" />
      </svg>
      <Syms items={[
        ['?', 48, 62, 'fa', 50, 0], ['∞', 92, 78, 'ft', 54, 1.2], ['π', 60, 12, 'fv', 44, 2], ['√2', 47, 18, 'fr', 32, 0.7], ['+', 78, 6, 'fa', 40, 2.6],
      ]} />
    </>
  );
}

/* ───────────────────────── CONTACT: an envelope at the centre of a network ───────────────────────── */
function Contact() {
  const cx = 0, cy = 0;
  const nodes = [[-170, -90], [-150, 85], [0, -140], [10, 130], [165, -70], [175, 80]];
  return (
    <>
      <div className="hb-slot" style={{ right: '9%' }}>
        <svg width="420" height="320" viewBox="-210 -160 420 320">
          {[70, 120, 170].map((r, i) => (
            <circle key={r} className="sa hb-ripple" r={r} style={{ animationDelay: `${i * 2}s` }} />
          ))}
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <line className="st hb-flow hb-flow-thin" x1={x} y1={y} x2={cx} y2={cy} opacity=".65" />
              <circle className="ft hb-twinkle" cx={x} cy={y} r="7" style={{ animationDelay: `${i * 0.6}s` }} />
              <circle className="st" cx={x} cy={y} r="13" strokeWidth="1" opacity=".4" />
              <circle className="fa hb-mv" r="4.5">
                <animateMotion dur={`${4 + (i % 3)}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" path={`M${x} ${y} L${cx} ${cy}`} />
              </circle>
            </g>
          ))}
          <g className="hb-floaty-svg">
            <rect x="-48" y="-32" width="96" height="64" rx="8" className="ta sa" strokeWidth="2" opacity=".95" />
            <path d="M-48 -26 L0 8 L48 -26" className="sa" strokeWidth="2" opacity=".9" />
            <path d="M-48 28 L-14 -4 M48 28 L14 -4" className="sa" strokeWidth="1.4" opacity=".55" />
          </g>
        </svg>
      </div>
      <Syms items={[
        ['@', 48, 14, 'fa', 54, 0], ['✉', 52, 72, 'ft', 38, 1.4], ['?', 93, 14, 'fv', 46, 2.1], ['✦', 94, 76, 'fr', 34, 0.8], ['@', 62, 84, 'fv', 30, 2.7],
      ]} />
    </>
  );
}

const VARIANTS = { home: Home, education: Education, experience: Experience, courses: Courses, research: Research, explore: Explore, contact: Contact };

export default function HeroBackdrop({ variant }) {
  const V = VARIANTS[variant];
  if (!V) return null;
  return (
    <div className={`hb hb-${variant}`} aria-hidden="true">
      <V />
    </div>
  );
}
