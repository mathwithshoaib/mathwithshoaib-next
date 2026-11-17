// Minimal, decorative animated backdrops for page headers.
// Pure SVG + CSS (see "HERO BACKDROPS" in globals.css) — no client JS needed.
// Each variant is themed to its page. Drop it as the FIRST child of a
// `position: relative; overflow: hidden` section.

const SYMBOLS = [
  // [glyph, x%, y%, size px, float duration s, delay s, colour class]
  ['∫', 6, 18, 64, 14, 0, 'fa'],
  ['π', 44, 8, 52, 17, -4, 'ft'],
  ['∑', 92, 14, 70, 15, -7, 'fa'],
  ['∞', 30, 80, 58, 18, -2, 'fv'],
  ['√', 62, 86, 56, 13, -9, 'ft'],
  ['∂', 84, 74, 60, 16, -5, 'fa'],
  ['R₀', 52, 52, 40, 19, -11, 'fr'],
  ['Δ', 8, 66, 46, 15, -3, 'ft'],
  ['β', 74, 40, 44, 17, -8, 'fv'],
];

function Home() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <path className="sa hb-wave" pathLength="1" d="M0 640 C150 520 250 520 400 640 S650 760 800 640 S1050 520 1200 640" />
      <path className="st hb-wave hb-wave-2" pathLength="1" d="M0 700 C150 600 250 600 400 700 S650 790 800 700 S1050 610 1200 700" />
    </svg>
  );
}

function Education() {
  // A winding path with four milestones; a dot travels along it.
  const d = 'M0 300 C200 300 250 120 450 160 S700 320 850 200 S1050 80 1200 120';
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      <path className="sa hb-flow" d={d} />
      {[[450, 160, 0], [850, 200, 1.2], [1200, 120, 2.4]].map(([x, y, dl]) => (
        <g key={x}>
          <circle className="sa hb-pulse" cx={x - (x === 1200 ? 10 : 0)} cy={y} r="14" style={{ animationDelay: `${dl}s` }} />
          <circle className="fa" cx={x - (x === 1200 ? 10 : 0)} cy={y} r="5" />
        </g>
      ))}
      <circle className="fa" r="7">
        <animateMotion dur="9s" repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}

function Experience() {
  // Math *circles*: ripples spreading outward, like outreach reaching people.
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      {[0, 1.6, 3.2, 4.8].map((dl) => (
        <circle key={dl} className="sa hb-ripple" cx="860" cy="200" r="190" style={{ animationDelay: `${dl}s` }} />
      ))}
      {[[860, 200], [700, 120], [1010, 120], [1050, 290], [720, 300], [930, 340], [640, 230]].map(([x, y], i) => (
        <circle key={i} className="ft hb-twinkle" cx={x} cy={y} r={i === 0 ? 6 : 4} style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}

function Courses() {
  // Calculus: a curve is drawn while a point rides along it.
  const d = 'M0 220 C100 80 200 80 300 220 S500 360 600 220 S800 80 900 220 S1100 360 1200 220';
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      {[100, 200, 300].map((y) => <line key={y} className="hb-grid" x1="0" x2="1200" y1={y} y2={y} />)}
      {[200, 400, 600, 800, 1000].map((x) => <line key={x} className="hb-grid" y1="0" y2="400" x1={x} x2={x} />)}
      <line className="hb-grid hb-axis" x1="0" x2="1200" y1="220" y2="220" />
      <path className="st hb-wave hb-wave-2" pathLength="1" d="M0 300 C300 300 450 60 700 180 S1000 360 1200 120" />
      <path className="sa hb-wave" pathLength="1" d={d} />
      <circle className="fa" r="7">
        <animateMotion dur="10s" repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}

function Research() {
  // Epidemic (SIR) curves drawing themselves: S falls, I peaks, R rises.
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      <line className="hb-grid hb-axis" x1="120" x2="1160" y1="350" y2="350" />
      <line className="hb-grid hb-axis" x1="120" x2="120" y1="40" y2="350" />
      <path className="st hb-sir" pathLength="1" d="M120 70 C420 70 500 110 640 240 S900 335 1150 340" />
      <path className="sr hb-sir hb-sir-2" pathLength="1" d="M120 345 C420 345 480 70 660 70 S900 340 1150 345" />
      <path className="sa hb-sir hb-sir-3" pathLength="1" d="M120 345 C520 345 620 335 780 230 S1020 90 1150 80" />
    </svg>
  );
}

function Explore() {
  // Playful drifting geometry.
  const shapes = [
    ['polygon', { points: '0,-38 33,19 -33,19' }, 880, 110, 'sa', 22, 0],
    ['rect', { x: -28, y: -28, width: 56, height: 56, rx: 4 }, 1040, 260, 'st', 28, -6],
    ['circle', { r: 30 }, 740, 280, 'sv', 0, -3],
    ['polygon', { points: '0,-36 31,-18 31,18 0,36 -31,18 -31,-18' }, 1120, 100, 'sr', 34, -9],
    ['polygon', { points: '0,-30 30,0 0,30 -30,0' }, 640, 120, 'sa', 26, -12],
    ['circle', { r: 14 }, 960, 340, 'st', 0, -7],
  ];
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      {shapes.map(([Tag, props, x, y, c, spin, dl], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="hb-drift" style={{ animationDelay: `${dl}s`, animationDuration: `${12 + i * 2}s` }}>
            <Tag {...props} className={`${c} ${spin ? 'hb-spin' : ''}`} style={spin ? { animationDuration: `${spin}s` } : undefined} />
          </g>
        </g>
      ))}
    </svg>
  );
}

function Contact() {
  // A small network: nodes linked by lines with a message "packet" travelling.
  const nodes = [[720, 90], [900, 210], [1080, 100], [1010, 320], [780, 320], [1150, 230]];
  const links = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [0, 4]];
  const p = (i) => nodes[i].join(' ');
  const path = `M${p(0)} L${p(1)} L${p(2)} L${p(5)}`;
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMaxYMid slice">
      {links.map(([a, b], i) => (
        <line key={i} className="sa hb-flow hb-flow-thin" x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} className="ft hb-twinkle" cx={x} cy={y} r="6" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <circle className="fa" r="6">
        <animateMotion dur="6s" repeatCount="indefinite" path={path} />
      </circle>
    </svg>
  );
}

function Symbols() {
  return (
    <>
      {SYMBOLS.map(([g, x, y, s, dur, dl, c], i) => (
        <span
          key={i}
          className={`hb-sym ${c}`}
          style={{ left: `${x}%`, top: `${y}%`, fontSize: s, animationDuration: `${dur}s`, animationDelay: `${dl}s` }}
        >
          {g}
        </span>
      ))}
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
      {variant === 'home' && <Symbols />}
    </div>
  );
}
