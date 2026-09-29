// app/robots.js
// Auto-generates /robots.txt. Keeps the internal admin tool and the
// per-student private-lookup pages out of search engines' index, even
// though they're technically reachable if someone has the direct link.

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/courses/calc1-fa26/schedule/admin',
        '/courses/linalg/midterm-result-78650',
        '/api/',
      ],
    },
    sitemap: 'https://mathwithshoaib.com/sitemap.xml',
  };
}
