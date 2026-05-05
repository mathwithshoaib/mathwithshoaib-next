'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// ─── Supabase ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ujmxucxfqohlvssoxpsc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oh6eOOEaCpb420HxsaMreA_lB0BRzN7';

async function sbPostReview(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/course_reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function sbGetReviews() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/course_reviews?select=*&order=created_at.desc&limit=50`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
  return res.ok ? await res.json() : [];
}

// ─── Chapters ─────────────────────────────────────────────────────────────
const chapters = [
  {
    ch: 'Ch 1 — Functions, Graphs & Limits',
    items: ['1.1 · Functions', '1.2 · The Graph of a Function', '1.3 · Lines and Linear Functions', '1.4 · Functional Models', '1.5 · Limits', '1.6 · One-Sided Limits and Continuity'],
    live: [],
  },
  {
    ch: 'Ch 2 — Differentiation: Basic Concepts',
    items: ['2.1 · The Derivative', '2.2 · Techniques of Differentiation', '2.3 · Product and Quotient Rules', '2.4 · The Chain Rule', '2.5 · Marginal Analysis', '2.6 · Implicit Differentiation'],
    live: [],
  },
  {
    ch: 'Ch 3 — Applications of the Derivative',
    items: ['3.1 · Increasing & Decreasing Functions', '3.2 · Concavity & Inflection Points', '3.3 · Curve Sketching', '3.4 · Optimization; Elasticity', '3.5 · Additional Optimization'],
    live: [],
  },
  {
    ch: 'Ch 4 — Exponential & Logarithmic Functions',
    items: ['4.1 · Exponential Functions', '4.2 · Logarithmic Functions', '4.3 · Differentiation of Exp & Log', '4.4 · Exponential Models'],
    live: [],
  },
  {
    ch: 'Ch 5 — Integration',
    items: ['5.1 · Indefinite Integration', '5.2 · Integration by Substitution', '5.3 · The Definite Integral & FTC', '5.4 · Applying Definite Integration', '5.5 · Applications to Business'],
    live: [
      { label: '5.1 · Indefinite Integration',        href: '/courses/calc1/s51' },
      { label: '5.2 · Integration by Substitution',   href: '/courses/calc1/s52' },
      { label: '5.3 · The Definite Integral & FTC',   href: '/courses/calc1/s53' },
      { label: '5.4 · Applying Definite Integration', href: '/courses/calc1/s54' },
      { label: '5.5 · Applications to Business',      href: '/courses/calc1/s55' },
    ],
    defaultOpen: true,
    quiz: true,
  },
  {
    ch: 'Ch 6 — Additional Integration Topics',
    items: ['6.1 · Integration by Parts', '6.2 · Numerical Integration', '6.3 · Improper Integrals', '6.4 · Continuous Probability'],
    live: [
      { label: '6.1 · Integration by Parts',  href: '/courses/calc1/s61', live: true },
      { label: '6.2 · Numerical Integration', soon: true },
      { label: '6.3 · Improper Integrals',    soon: true },
      { label: '6.4 · Continuous Probability',soon: true },
    ],
    quiz2: true,
  },
  {
    ch: 'Appendix — Additional Topics',
    items: ['A.1 · A Brief Review of Algebra', 'A.2 · Factoring Polynomials & Solving Systems', 'A.3 · Evaluating Limits with L\'Hôpital\'s Rule', 'A.4 · The Summation Notation'],
    live: [
      { label: 'A.3 · Evaluating Limits with L\'Hôpital\'s Rule', href: '/courses/calc1/a3' },
    ],
  },
];

// ─── Star Rating Component ─────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '3px', cursor: readonly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s}
          style={{ fontSize: size, color: (hover || value) >= s ? '#d4a017' : '#e0d6c8', transition: 'color .15s' }}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange && onChange(s)}
        >★</span>
      ))}
    </div>
  );
}

// ─── Review Form ───────────────────────────────────────────────────────────
function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState({ name: '', institute: '', stars: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.name || !form.stars) { setError('Please fill in your name and rating.'); return; }
    setSubmitting(true); setError('');
    const ok = await sbPostReview({
      student_name: form.name,
      institute: form.institute,
      stars: form.stars,
      comment: form.comment,
    });
    setSubmitting(false);
    if (ok) { setForm({ name: '', institute: '', stars: 0, comment: '' }); onSubmitted(); }
    else setError('Something went wrong. Please try again.');
  };

  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e0d6c8', borderRadius: '7px', fontFamily: "'Source Sans 3', sans-serif", fontSize: '.95rem', color: '#1a1a2e', background: '#fdf8f0', outline: 'none', marginBottom: '10px' };

  return (
    <div style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '12px', padding: '22px 24px', marginBottom: '20px' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '12px' }}>Leave a Review</div>
      <input style={inp} placeholder="Your name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
      <input style={inp} placeholder="Institute (e.g. LUMS)" value={form.institute} onChange={e => setForm(f => ({ ...f, institute: e.target.value }))}/>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.62rem', color: '#7f8c8d', marginBottom: '5px' }}>Rating *</div>
        <StarRating value={form.stars} onChange={s => setForm(f => ({ ...f, stars: s }))} size={26}/>
      </div>
      <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical', fontFamily: "'Source Sans 3', sans-serif" }} placeholder="Your comment on the course content" value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}/>
      {error && <div style={{ color: '#c0392b', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', marginBottom: '8px' }}>{error}</div>}
      <button onClick={submit} disabled={submitting}
        style={{ width: '100%', padding: '10px', background: '#1a6b6b', color: '#fff', border: 'none', borderRadius: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1 }}>
        {submitting ? 'Submitting...' : 'Submit Review →'}
      </button>
    </div>
  );
}

// ─── Reviews Panel ─────────────────────────────────────────────────────────
function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStar, setFilterStar] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    sbGetReviews().then(r => { setReviews(r); setLoading(false); }).catch(() => setLoading(false));
  }, [refreshKey]);

  const filtered = filterStar ? reviews.filter(r => r.stars === filterStar) : reviews;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1) : '—';
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ s, count: reviews.filter(r => r.stars === s).length }));

  const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 30) return `${d} days ago`;
    if (d < 365) return `${Math.floor(d / 30)} months ago`;
    return `${Math.floor(d / 365)} years ago`;
  };

  return (
    <div>
      <ReviewForm onSubmitted={() => setRefreshKey(k => k + 1)}/>

      {/* Summary bar */}
      <div style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '2.2rem', fontWeight: 700, color: '#d4a017', lineHeight: 1 }}>{avgRating}</div>
            <StarRating value={Math.round(Number(avgRating))} readonly size={14}/>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', color: '#7f8c8d', marginTop: '3px' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            {starCounts.map(({ s, count }) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.65rem', width: '8px', color: '#7f8c8d' }}>{s}</span>
                <span style={{ fontSize: '10px', color: '#d4a017' }}>★</span>
                <div style={{ flex: 1, height: '5px', background: '#f0e8dc', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`, background: '#d4a017', borderRadius: '3px', transition: 'width .4s' }}/>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', color: '#7f8c8d', width: '16px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Star filter */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilterStar(0)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', background: filterStar === 0 ? '#1a1a2e' : '#f5ede0', color: filterStar === 0 ? '#d4a017' : '#7f8c8d', border: '1px solid #e0d6c8', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer' }}>All</button>
          {[5, 4, 3, 2, 1].map(s => (
            <button key={s} onClick={() => setFilterStar(filterStar === s ? 0 : s)}
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', background: filterStar === s ? '#d4a017' : '#f5ede0', color: filterStar === s ? '#fff' : '#7f8c8d', border: '1px solid #e0d6c8', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer' }}>
              {s}★
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '2px' }}>
        {loading && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>Loading reviews...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
            {filterStar ? `No ${filterStar}-star reviews yet.` : 'No reviews yet — be the first!'}
          </div>
        )}
        {filtered.map((r, i) => (
          <div key={r.id || i} style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.78rem', fontWeight: 700, color: '#1a1a2e' }}>{r.student_name || r.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', color: '#7f8c8d' }}>
                  {r.course}{r.institute ? ` · ${r.institute}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StarRating value={r.stars} readonly size={12}/>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.55rem', color: '#9ca3af', marginTop: '2px' }}>{timeAgo(r.created_at)}</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '.88rem', color: '#374151', margin: 0, lineHeight: 1.5 }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function ReviewsPanelCompact() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStar, setFilterStar] = useState(0);

  useEffect(() => {
    sbGetReviews().then(r => { setReviews(r); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filterStar ? reviews.filter(r => r.stars === filterStar) : reviews;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1) : '—';
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ s, count: reviews.filter(r => r.stars === s).length }));

  const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 30) return `${d}d ago`;
    return `${Math.floor(d / 30)}mo ago`;
  };

  return (
    <div>
      {/* Rating summary */}
      <div style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '2rem', fontWeight: 700, color: '#d4a017', lineHeight: 1 }}>{avgRating}</div>
            <StarRating value={Math.round(Number(avgRating))} readonly size={13}/>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', color: '#7f8c8d', marginTop: '2px' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ flex: 1 }}>
            {starCounts.map(({ s, count }) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', color: '#7f8c8d', width: '7px' }}>{s}</span>
                <span style={{ fontSize: '9px', color: '#d4a017' }}>★</span>
                <div style={{ flex: 1, height: '4px', background: '#f0e8dc', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`, background: '#d4a017', borderRadius: '2px' }}/>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', color: '#7f8c8d', width: '14px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Star filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilterStar(0)} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', background: filterStar === 0 ? '#1a1a2e' : '#f5ede0', color: filterStar === 0 ? '#d4a017' : '#7f8c8d', border: '1px solid #e0d6c8', borderRadius: '4px', padding: '2px 7px', cursor: 'pointer' }}>All</button>
          {[5, 4, 3, 2, 1].map(s => (
            <button key={s} onClick={() => setFilterStar(filterStar === s ? 0 : s)}
              style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', background: filterStar === s ? '#d4a017' : '#f5ede0', color: filterStar === s ? '#fff' : '#7f8c8d', border: '1px solid #e0d6c8', borderRadius: '4px', padding: '2px 7px', cursor: 'pointer' }}>
              {s}★
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
        {loading && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.68rem', color: '#7f8c8d', textAlign: 'center', padding: '16px' }}>Loading...</div>}
        {!loading && filtered.length === 0 && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.68rem', color: '#7f8c8d', textAlign: 'center', padding: '16px' }}>{filterStar ? `No ${filterStar}★ reviews yet.` : 'No reviews yet — share your feedback below!'}</div>}
        {filtered.map((r, i) => (
          <div key={r.id || i} style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '9px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.74rem', fontWeight: 700, color: '#1a1a2e' }}>{r.student_name || r.name}</div>
                {r.institute && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.58rem', color: '#7f8c8d' }}>{r.institute}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <StarRating value={r.stars} readonly size={11}/>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '.54rem', color: '#9ca3af' }}>{timeAgo(r.created_at)}</div>
              </div>
            </div>
            {r.comment && <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '.85rem', color: '#374151', margin: 0, lineHeight: 1.5 }}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroRating() {
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    sbGetReviews().then(rows => {
      if (!rows.length) return;
      const a = rows.reduce((s, r) => s + (r.stars || 0), 0) / rows.length;
      setAvg(a.toFixed(1));
      setCount(rows.length);
    }).catch(() => {});
  }, []);

  if (!avg) return null;

  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Student Rating</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.4rem', fontWeight: 700, color: '#d4a017', lineHeight: 1 }}>{avg}</span>
        <div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '14px', color: Math.round(Number(avg)) >= s ? '#d4a017' : 'rgba(212,160,23,0.25)' }}>★</span>
            ))}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '.6rem', color: 'var(--text3)', marginTop: '2px' }}>
            {count} review{count !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Calc1() {
  const [open, setOpen] = useState({});

  const toggle = (i) => setOpen(prev => ({ ...prev, [i]: !prev[i] }));

  const fm = "'IBM Plex Mono', monospace";
  const fh = "'Playfair Display', Georgia, serif";
  const fb = "'Source Sans 3', sans-serif";
  const teal = '#1a6b6b', gold = '#d4a017', ink = '#1a1a2e', border = '#e0d6c8', cream = '#f5ede0', paper = '#fdf8f0';

  return (
    <>
      <Navbar activePage="courses" />

      {/* STICKY SUB-HEADER */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Calculus I</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {[{ href: '/courses/precalc', label: 'Pre-Calculus' }, { href: '/courses/calc1', label: 'Calculus I', active: true }, { href: '/courses/linalg', label: 'Linear Algebra I' }].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase', color: active ? 'var(--amber)' : 'var(--text3)', padding: '9px 18px', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent', whiteSpace: 'nowrap', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' }}>

        {/* LEFT SIDEBAR — accordion TOC */}
        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' }}>MATH-101 · Calculus I</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 }}>Course Contents</div>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' }}>← All Courses</Link>
          </div>
          <div style={{ padding: '8px 0 4px' }}>
            <Link href="/courses/calc1" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--amber)', borderLeft: '2px solid var(--amber)', background: 'rgba(232,160,32,.08)', textDecoration: 'none' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0, display: 'inline-block' }}></span>
              Course Overview
            </Link>
          </div>
          <nav style={{ padding: '4px 0 24px' }}>
            {chapters.map(({ ch, items, live = [] }, i) => {
              const isOpen = !!open[i];
              const liveMap = Object.fromEntries(live.filter(l => l.href).map(l => [l.label, l.href]));
              const hasLive = live.filter(l => l.href).length > 0;
              return (
                <div key={ch} style={{ borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: hasLive ? 'var(--teal)' : 'var(--text3)', textAlign: 'left' }}>
                    <span>{ch}</span>
                    <span style={{ fontSize: '.6rem', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom: '6px' }}>
                      {items.map(item => {
                        const href = liveMap[item];
                        return href ? (
                          <Link key={item} href={href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--teal)', textDecoration: 'none', lineHeight: 1.35 }}>
                            <span style={{ fontSize: '.55rem' }}>✦</span>{item}
                          </Link>
                        ) : (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 5px 24px', fontFamily: 'var(--fm)', fontSize: '.71rem', color: 'var(--text3)', opacity: .38, lineHeight: 1.35 }}>
                            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0, background: 'var(--bg)' }}>

          {/* HERO */}
          <div style={{ padding: '44px 40px 36px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)', borderBottom: '1px solid var(--border)' }}>
            <span className="eyebrow">MATH-101 · Undergraduate I · LUMS</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '12px' }}>Calculus I</h1>
            <p style={{ maxWidth: '560px', color: 'var(--text2)', fontSize: '1.02rem' }}>
              The language in which physics, economics, and engineering are written. Taught in two parallel tracks — rigorously from first principles, and through the lens of business and economic application.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
              <span className="tag tag-teal">Limits</span><span className="tag tag-teal">Derivatives</span>
              <span className="tag tag-teal">Integration</span><span className="tag">Differential Equations</span>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginTop: '28px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Textbooks</div>
                <div style={{ fontSize: '.95rem', color: 'var(--text)', marginTop: '4px' }}>James Stewart · Hoffmann &amp; Bradley</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '.95rem', color: 'var(--teal)', marginTop: '4px' }}>Ch 5 ,6 &amp; A3 Live ✦</div>
              </div>
              {/* ── Live rating from Supabase ── */}
              <HeroRating />
            </div>
          </div>

          {/* BODY — 3-column: chapters (2-col grid) + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '0', alignItems: 'start' }}>

            {/* LEFT: chapters grid + track cards */}
            <div style={{ padding: '36px 32px 60px', borderRight: `1px solid ${border}` }}>

              {/* Track cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '32px' }}>
                {[
                  { color: gold, label: 'Track A', title: 'Rigorous Track', desc: "Epsilon-delta definitions, formal proofs, classical analysis. Based on Stewart's Calculus." },
                  { color: teal, label: 'Track B', title: 'Applied Track', desc: "Business, economics & social science applications. Based on Hoffmann's Calculus." },
                ].map(({ color, label, title, desc }) => (
                  <div key={title} className="card" style={{ padding: '18px 20px', borderLeft: `3px solid ${color}` }}>
                    <div style={{ fontFamily: fm, fontSize: '.66rem', color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</div>
                    <h4 style={{ color: 'var(--text)', marginBottom: '5px' }}>{title}</h4>
                    <p style={{ fontSize: '.88rem', marginBottom: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,${border},transparent)`, margin: '8px 0 28px' }}/>

              {/* Chapter notes TOC — 2-column grid */}
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontFamily: fh, fontSize: '1.3rem', color: 'var(--text)' }}>Course Lecture Notes</h3>
                <span style={{ fontFamily: fm, fontSize: '.68rem', color: 'var(--text3)' }}>✦ = Live &nbsp;·&nbsp; Greyed = Coming soon</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
                {chapters.map(({ ch, items, live = [], quiz, quiz2 }) => {
                  const liveMap = Object.fromEntries(live.filter(l => l.href).map(l => [l.label, l.href]));
                  return (
                    <div key={ch} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 18px' }}>
                      <div style={{ fontFamily: fm, fontSize: '.56rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '2px' }}>{ch.split('—')[0].trim()}</div>
                      <div style={{ fontFamily: fh, fontSize: '.86rem', color: 'var(--text)', marginBottom: '10px', lineHeight: 1.3 }}>{ch.split('—')[1]?.trim() || ch}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px' }}>
                        {items.map(item => {
                          const href = liveMap[item];
                          return href ? (
                            <Link key={item} href={href} style={{ fontFamily: fm, fontSize: '.7rem', color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '.52rem' }}>✦</span>{item}
                            </Link>
                          ) : (
                            <span key={item} style={{ fontFamily: fm, fontSize: '.7rem', color: 'var(--text3)', opacity: .38 }}>{item}</span>
                          );
                        })}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        {quiz ? (
                          <Link href="/courses/calc1/ch5-quiz" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: fm, fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(56,201,176,.12)', color: 'var(--teal)', border: '1px solid rgba(56,201,176,.3)', borderRadius: '6px', padding: '4px 9px', textDecoration: 'none' }}>⚡ Take Quiz</Link>
                        ) : quiz2 ? (
                          <Link href="/courses/calc1/ch6-quiz" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: fm, fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(56,201,176,.12)', color: 'var(--teal)', border: '1px solid rgba(56,201,176,.3)', borderRadius: '6px', padding: '4px 9px', textDecoration: 'none' }}>⚡ Practice Quiz</Link>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: fm, fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'var(--bg)', color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 9px', opacity: .4 }}>📝 Quiz Coming</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT PANEL — quizzes, resources, reviews */}
            <div style={{ padding: '28px 20px 60px', background: paper }}>

              {/* ── QUIZZES ── */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: fm, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '10px' }}>Practice Quizzes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/courses/calc1/ch5-quiz" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: teal, color: '#fff', borderRadius: '8px', padding: '10px 14px', textDecoration: 'none' }}>
                    <span style={{ fontFamily: fm, fontSize: '.65rem', opacity: .8 }}>§5.1 · §5.2 · §5.3</span>
                    <span style={{ fontFamily: fm, fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>⚡ Quiz →</span>
                  </Link>
                  <Link href="/courses/calc1/ch6-quiz" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#2980b9', color: '#fff', borderRadius: '8px', padding: '10px 14px', textDecoration: 'none' }}>
                    <span style={{ fontFamily: fm, fontSize: '.65rem', opacity: .8 }}>§5.4 · §5.5 · §6.1 · §A.3</span>
                    <span style={{ fontFamily: fm, fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>⚡ Quiz →</span>
                  </Link>
                </div>
              </div>

              {/* ── EXTRA RESOURCES ── */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: fm, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '10px' }}>Extra Resources</div>
                <div style={{ background: '#fff', border: '1px solid #e0d6c8', borderRadius: '10px', padding: '16px 18px' }}>
                  {[
                    { icon: '📄', label: 'Integral Table (§6.1)', href: '/courses/calc1/s61', sub: 'All 28 formulas — downloadable' },
                    { icon: '📐', label: 'Formula Sheet', href: '#', sub: 'Key formulas — coming soon', soon: true },
                    { icon: '📝', label: 'Past Exam Paper — 2024', href: '#', sub: 'Coming soon', soon: true },
                    { icon: '📝', label: 'Past Exam Paper — 2023', href: '#', sub: 'Coming soon', soon: true },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f0e8dc' }}>
                      <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
                      <div style={{ flex: 1 }}>
                        {r.soon ? (
                          <div style={{ fontFamily: fm, fontSize: '.72rem', color: '#9ca3af', opacity: .6 }}>{r.label}</div>
                        ) : (
                          <Link href={r.href} style={{ fontFamily: fm, fontSize: '.72rem', color: teal, textDecoration: 'none' }}>{r.label}</Link>
                        )}
                        <div style={{ fontFamily: fm, fontSize: '.58rem', color: '#9ca3af' }}>{r.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── COURSE REVIEWS ── */}
              <div>
                <div style={{ fontFamily: fm, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '10px' }}>Student Reviews</div>
                <ReviewsPanelCompact />
              </div>

            </div>
          </div>

          {/* ── REVIEW FORM — bottom of page ── */}
          <div style={{ padding: '40px 40px 48px', borderTop: '1px solid var(--border)', background: paper }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ fontFamily: fm, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '6px' }}>Share Your Feedback</div>
              <h3 style={{ fontFamily: fh, fontSize: '1.4rem', color: ink, marginBottom: '4px' }}>How was the course content?</h3>
              <p style={{ fontFamily: fb, fontSize: '.92rem', color: '#7f8c8d', marginBottom: '20px' }}>Your feedback helps other students and helps improve the material.</p>
              <ReviewForm onSubmitted={() => {}} />
            </div>
          </div>            


          {/* FOOTER NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/courses/precalc" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: fm, fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>← Pre-Calculus</Link>
            <Link href="/courses/linalg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: fm, fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>Next: Linear Algebra I →</Link>
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