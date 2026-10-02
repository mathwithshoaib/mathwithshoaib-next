import Link from 'next/link';
import { getCategory } from '../../explore/activities';
import CategoryTag from './CategoryTag';

export default function ActivityCard({ activity, played }) {
  const cat = getCategory(activity.category);
  return (
    <Link
      href={`/explore/${activity.slug}`}
      className="explore-card"
      style={{ '--card-hover': cat?.color }}
    >
      <div className="explore-card-icon" style={{ background: cat?.tint, color: cat?.color }}>
        <span aria-hidden="true">{cat?.icon}</span>
      </div>
      {played && <span className="explore-card-check" aria-label="Played">✓</span>}
      <h4>{activity.title}</h4>
      <p className="explore-card-hook">{activity.hook}</p>
      <div className="explore-card-footer">
        <CategoryTag category={activity.category} />
        <span className="explore-card-time">{activity.minutes} min</span>
      </div>
      {activity.course && <div className="explore-card-course">{activity.course.label}</div>}
      {activity.badge && <span className="explore-card-badge">{activity.badge}</span>}
    </Link>
  );
}
