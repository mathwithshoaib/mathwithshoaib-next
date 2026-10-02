'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import CategoryTag from './CategoryTag';
import ActivityLoader from './ActivityLoader';
import PlayNext from './PlayNext';
import { getActivityContent } from '../../explore/activityContent';
import { useExploreProgress } from '../../explore/useExploreProgress';

// Maps an activity's onEvent('name') calls to a badge id to unlock.
// 'interacted' is handled separately — it always marks the activity played.
const EVENT_BADGE_MAP = {
  'nim-master': 'nim-master',
  'reached-moon': 'reached-moon',
};

export default function ActivityShell({ activity }) {
  const { played, markPlayed, markBadge } = useExploreProgress();
  const [whyOpen, setWhyOpen] = useState(false);
  const content = getActivityContent(activity.slug);

  function handleEvent(name) {
    if (name === 'interacted') {
      markPlayed(activity.slug);
      return;
    }
    const badgeId = EVENT_BADGE_MAP[name];
    if (badgeId) markBadge(badgeId);
  }

  return (
    <>
      <Navbar activePage="explore" />

      <div className="sk-breadcrumb">
        <div className="sk-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/explore">Explore</Link>
          <span className="sep">›</span>
          <span className="current">{activity.title}</span>
        </div>
      </div>

      <section className="sk-section" style={{ paddingTop: '48px' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <CategoryTag category={activity.category} />
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>{activity.minutes} min</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', marginBottom: '14px' }}>{activity.title}</h1>
          {content?.howToPlay && (
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px' }}>
              <strong style={{ color: 'var(--text)' }}>How to play: </strong>{content.howToPlay}
            </p>
          )}

          <div className="card" style={{ padding: '28px 30px', marginBottom: '32px' }}>
            <ActivityLoader slug={activity.slug} onEvent={handleEvent} />
          </div>

          {content?.whyItWorks && (
            <div style={{ marginBottom: '40px' }}>
              <button
                type="button"
                onClick={() => setWhyOpen((o) => !o)}
                className="btn btn-outline"
                aria-expanded={whyOpen}
              >
                {whyOpen ? 'Hide why it works' : 'Why it works'}
              </button>
              {whyOpen && (
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginTop: '16px' }}>
                  {content.whyItWorks}
                </p>
              )}
            </div>
          )}

          {activity.course && (
            <p style={{ marginBottom: '40px' }}>
              <Link href={activity.course.href} style={{ color: 'var(--amber)' }}>
                Related lecture: {activity.course.label} →
              </Link>
            </p>
          )}

          <PlayNext currentSlug={activity.slug} currentCategory={activity.category} played={played} />
        </div>
      </section>

      <Footer />
    </>
  );
}
