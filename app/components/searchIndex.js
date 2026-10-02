// app/components/searchIndex.js
//
// Static site-wide search index — hand-maintained, same convention as the
// other content arrays across this project. Add an entry here whenever a
// new top-level page, course, or major sub-page goes live; no need to list
// every individual lecture/quiz sub-page, just things worth searching for
// by name.

export const SEARCH_INDEX = [
  // Main pages
  { title: 'Home', description: 'Muhammad Shoaib Khan — Mathematician, Educator, Researcher at LUMS', url: '/', type: 'Page' },
  { title: 'Education', description: 'Academic journey — GCU, COMSATS, University of Lille', url: '/education', type: 'Page' },
  { title: 'Research', description: 'Mathematical epidemiology & optimal control — co-infection modeling', url: '/research', type: 'Page' },
  { title: 'Courses', description: 'All courses taught or assisted', url: '/courses', type: 'Page' },
  { title: 'Explore', description: 'A hub of math games, simulations, puzzles, and a daily puzzle — Nim, Paper Folding to the Moon, and more', url: '/explore', type: 'Page' },
  { title: 'Contact', description: 'Email, phone, and social links', url: '/contact', type: 'Page' },

  // Experience
  { title: 'Experience', description: 'Teaching overview — Instructor, TA, Math Circles, private tutoring', url: '/experience', type: 'Page' },
  { title: 'As an Instructor', description: 'Teaching roles — Calculus, Fall 2025 through Fall 2026', url: '/experience/instructor', type: 'Experience' },
  { title: 'As a Teaching Assistant', description: 'TA roles — Calculus and Pre-Calculus, 2023–2026', url: '/experience/ta', type: 'Experience' },
  { title: 'Math Circles', description: 'Outreach — Gilgit-Baltistan, home village, LUMS volunteering', url: '/experience/math-circles', type: 'Experience' },

  // Courses
  { title: 'Pre-Calculus', description: 'MATH-100 course page', url: '/courses/precalc', type: 'Course' },
  { title: 'Calculus I · Fall 2025', description: 'MATH-101 course page', url: '/courses/calc1', type: 'Course' },
  { title: 'Calculus I · Non-SSE · Fall 2026', description: 'Current course — home, schedule, exams, announcements', url: '/courses/calc1-fa26', type: 'Course' },
  { title: 'Calc1 Non-SSE — Weekly Schedule', description: 'Live lecture/tutorial/office-hours grid', url: '/courses/calc1-fa26/schedule', type: 'Course' },
  { title: 'Calc1 Non-SSE — Exams', description: 'Midterm/final dates, syllabus, seat search', url: '/courses/calc1-fa26/exams', type: 'Course' },
  { title: 'Calc1 Non-SSE — Past Papers', description: 'Practice papers from prior offerings', url: '/courses/calc1-fa26/past-papers', type: 'Course' },
  { title: 'Calc1 Non-SSE — Announcements', description: 'All course announcements', url: '/courses/calc1-fa26/announcements', type: 'Course' },
  { title: 'Linear Algebra · Summer 2026', description: 'MATH-120 course page — lecture notes, TAs, schedule', url: '/courses/linalg', type: 'Course' },

  // TA resource pages
  { title: 'MATH-101 Calculus (TA, Spring 2025)', description: 'Tutorials, videos, practice problems, exams', url: '/ta/calculus-sp25', type: 'Resource' },
  { title: 'MATH-100 Pre-Calculus (TA, Fall 2024)', description: 'Notes, videos, quiz & exam solutions', url: '/ta/precalc-fa24', type: 'Resource' },
  { title: 'MATH-100 Pre-Calculus (TA, Spring 2024)', description: 'Tutorials, quiz & exam solutions', url: '/ta/precalc-sp24', type: 'Resource' },

  // Instructor resource pages
  { title: 'MATH-101 Calculus (Instructor, Fall 2025)', description: 'Recitation slides, lecture notes, webwork', url: '/instructor/calculus-fa25', type: 'Resource' },
];
