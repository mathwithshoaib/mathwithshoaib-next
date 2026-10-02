export default function ProgressStrip({ playedCount, total }) {
  const pct = total > 0 ? Math.min(100, (playedCount / total) * 100) : 0;
  return (
    <div className="explore-progress-wrap">
      <div className="explore-progress-label">
        <span>Explored {playedCount} of {total} activities</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="explore-progress-track">
        <div className="explore-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
