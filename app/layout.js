import './globals.css';

export const metadata = {
  title: 'Muhammad Shoaib Khan · Shoaib-K · LUMS',
  description: 'Academic portfolio of Muhammad Shoaib Khan — Mathematician, Educator, and Researcher at LUMS, Lahore.',
  keywords: 'mathematics, calculus, LUMS, Lahore, integration, lecture notes, math tutor Pakistan',
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