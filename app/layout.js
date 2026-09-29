import './globals.css';

const SITE_URL = 'https://mathwithshoaib.com';
const SITE_TITLE = 'Muhammad Shoaib Khan · Shoaib-K · LUMS';
const SITE_DESCRIPTION = 'Academic portfolio of Muhammad Shoaib Khan — Mathematician, Educator, and Researcher at LUMS, Lahore. Calculus and Linear Algebra course pages, lecture notes, and schedules.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s · Shoaib-K' },
  description: SITE_DESCRIPTION,
  keywords: 'mathematics, calculus, linear algebra, LUMS, Lahore, math tutor Pakistan, lecture notes, MATH 101, LUMS calculus',
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Shoaib-K',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="sk-progress"><div id="sk-progress-bar" suppressHydrationWarning></div></div>
        {children}
      </body>
    </html>
  );
}