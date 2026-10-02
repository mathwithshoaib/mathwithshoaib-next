'use client';

import { REGISTRY } from '../../explore/registry';

/* Thin client-side indirection so app/explore/[slug]/page.js can stay a
   server component (generateStaticParams/generateMetadata) while the
   actual activity is loaded with next/dynamic(ssr:false) — which Next.js
   only allows inside a Client Component. */
export default function ActivityLoader({ slug, onEvent }) {
  const Component = REGISTRY[slug];
  if (!Component) return null;
  return <Component onEvent={onEvent} />;
}
