import { liveActivities } from '../../explore/activities';
import ActivityCard from './ActivityCard';

function pickPlayNext(currentSlug, currentCategory, played) {
  const candidates = liveActivities().filter((a) => a.slug !== currentSlug);
  return candidates
    .map((activity) => {
      let score = 0;
      if (activity.category === currentCategory) score += 2;
      if (!played[activity.slug]) score += 1;
      return { activity, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.activity);
}

export default function PlayNext({ currentSlug, currentCategory, played }) {
  const picks = pickPlayNext(currentSlug, currentCategory, played || {});
  if (picks.length === 0) return null;
  return (
    <div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Play Next</h3>
      <div className="explore-grid">
        {picks.map((activity) => (
          <ActivityCard key={activity.slug} activity={activity} played={!!played[activity.slug]} />
        ))}
      </div>
    </div>
  );
}
