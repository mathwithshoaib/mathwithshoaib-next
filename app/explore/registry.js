'use client';

import dynamic from 'next/dynamic';

/* Slug -> activity component map. Heavy activity code only loads on its
   own page (ssr: false keeps it out of the hub's bundle and out of the
   server render entirely). Add an entry here whenever an activity's
   `status` in activities.js flips to 'live'. */
export const REGISTRY = {
  nim: dynamic(() => import('./activities/NimGame'), { ssr: false }),
  'paper-folding': dynamic(() => import('./activities/PaperFolding'), { ssr: false }),
};
