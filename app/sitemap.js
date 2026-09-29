// app/sitemap.js
// Auto-generates /sitemap.xml — tells Google every real, public page on the
// site so it can be crawled/indexed quickly instead of waiting to discover
// pages by following links. Deliberately leaves out:
//   - /courses/calc1-fa26/schedule/admin (internal tool, not public content)
//   - /courses/calc1-fa26/video-resources (reachable only via a direct link
//     from the resources table / an announcement, not meant to be a
//     search-landing page)
//   - /courses/linalg/midterm-result-78650 (a private per-student lookup
//     tool behind an obscure slug, not real content)
// Update this list by hand when a new course page is added — same
// convention as the other hand-maintained content arrays in this project.

const SITE_URL = 'https://mathwithshoaib.com';

const PATHS = [
  '',
  '/education',
  '/courses',
  '/courses/precalc',

  '/courses/calc1',
  '/courses/calc1/a3',
  '/courses/calc1/ch5-quiz',
  '/courses/calc1/ch6-quiz',
  '/courses/calc1/s41',
  '/courses/calc1/s42',
  '/courses/calc1/s43',
  '/courses/calc1/s51',
  '/courses/calc1/s52',
  '/courses/calc1/s53',
  '/courses/calc1/s54',
  '/courses/calc1/s55',
  '/courses/calc1/s61',

  '/courses/calc1-fa26',
  '/courses/calc1-fa26/schedule',
  '/courses/calc1-fa26/exams',
  '/courses/calc1-fa26/past-papers',
  '/courses/calc1-fa26/announcements',

  '/courses/linalg',
  '/courses/linalg/notes/matrix-multiplication',
  '/courses/linalg/w1/lec1',
  '/courses/linalg/w1/lec2',
  '/courses/linalg/w1/lec3',
  '/courses/linalg/w1/lec4',
  '/courses/linalg/w2/lec5',
  '/courses/linalg/w2/lec6',
  '/courses/linalg/w2/lec7',
  '/courses/linalg/w2/lec8',
  '/courses/linalg/w3/lec9',
  '/courses/linalg/w3/lec10',
  '/courses/linalg/w3/lec11',
  '/courses/linalg/w4/lec12',
  '/courses/linalg/w4/lec13',
  '/courses/linalg/w4/lec14',
  '/courses/linalg/w5/lec15',
  '/courses/linalg/w5/lec16',
  '/courses/linalg/w5/lec17',
  '/courses/linalg/w5/lec18',
  '/courses/linalg/w6/lec19',
  '/courses/linalg/w6/lec20',
  '/courses/linalg/w6/lec21',
];

export default function sitemap() {
  const now = new Date();
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path.startsWith('/courses/calc1-fa26') ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/courses/calc1-fa26' ? 0.9 : 0.6,
  }));
}
