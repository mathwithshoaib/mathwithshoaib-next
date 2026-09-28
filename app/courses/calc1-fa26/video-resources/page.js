'use client';

import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CourseTopBar from '../CourseTopBar';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — VIDEO RESOURCES
   Route: /courses/calc1-fa26/video-resources

   Deliberately NOT in CourseSidebar's nav — this page only exists for
   weeks where a recitation was recorded on video instead of the usual
   slides+PDF (e.g. a university holiday that fell on the recitation
   day). Reached via the "Videos →" link in that week's row of the
   Recitation resources table on the course home page, or via the
   announcement posted when a new recording goes up. Add a new
   { key, ... } block below each time another such recording exists —
   no need to touch the sidebar or any other page.
   ═════════════════════════════════════════════════════════════════ */

const VIDEO_SETS = [
  {
    key: 'w4',
    heading: 'Week 4 Recitation — Friday, Sept 25, 2026',
    note: 'University was off that day, so this recitation was recorded instead of held live. Slides for this week will be added once available.',
    videos: [
      { label: 'Continuity', embedUrl: 'https://drive.google.com/file/d/1rw0zyt86WcHcOWJ1SkwGnub7iPBfypnd/preview' },
      { label: 'Derivatives', embedUrl: 'https://drive.google.com/file/d/1S8YTHLAlzEY8bmo4AZpCUFqjdPYoC6UJ/preview' },
    ],
  },
];

export default function VideoResourcesPage() {
  return (
    <>
      <style>{`
        .vr-wrap { max-width: 820px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 40px) 24px 80px; }
        .vr-set { margin-bottom: 32px; }
        .vr-note { font-size: .85rem; color: var(--text2); margin: 4px 0 18px; }
        .vr-video-card { margin-bottom: 22px; }
        .vr-video-card h4 { font-size: .95rem; margin: 0 0 10px; }
        .vr-video-frame-wrap { position: relative; width: 100%; padding-top: 56.25%; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .vr-video-frame-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
      `}</style>

      <Navbar activePage="courses" />
      <CourseTopBar />

      <div className="vr-wrap">
        <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 10px' }}>Video Resources</h1>
        <p style={{ color: 'var(--text2)', fontSize: '.95rem', marginBottom: '28px', maxWidth: '640px' }}>
          Recorded recitations — for weeks where the usual live session wasn't possible.
        </p>

        {VIDEO_SETS.map((set) => (
          <div key={set.key} className="vr-set card" style={{ padding: '20px 22px' }}>
            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{set.heading}</h4>
            <p className="vr-note">{set.note}</p>
            {set.videos.map((v) => (
              <div key={v.label} className="vr-video-card">
                <h4>{v.label}</h4>
                <div className="vr-video-frame-wrap">
                  <iframe src={v.embedUrl} allow="autoplay" allowFullScreen title={`${set.heading} — ${v.label}`} />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <Link href="/courses/calc1-fa26" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
            ← Course home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
