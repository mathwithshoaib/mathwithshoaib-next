import { notFound } from 'next/navigation';
import { liveActivities, getActivity } from '../activities';
import ActivityShell from '../../components/explore/ActivityShell';

export function generateStaticParams() {
  return liveActivities().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity || activity.status !== 'live') return {};
  return {
    title: `${activity.title} · Explore · Shoaib-K`,
    description: activity.hook,
  };
}

export default async function ActivityPage({ params }) {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity || activity.status !== 'live') notFound();
  return <ActivityShell activity={activity} />;
}
