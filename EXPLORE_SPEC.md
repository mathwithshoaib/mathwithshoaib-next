# Explore page redesign: build spec

Target: `/explore` on mathwithshoaib.com (Next.js App Router, deployed on Vercel).
Goal: turn Explore from a short list of two activities into an organized hub of math games, simulations, puzzles and art that students want to stay on and come back to.

## 0. Before writing any code

1. Read `PROJECT_CONTEXT.md` and follow its conventions.
2. Inspect the existing `app/explore/` folder, `components/Navbar`, `components/Footer`, and `app/globals.css`. Reuse existing classes (`container`, `sk-section`, `eyebrow`, `card`, `btn`, `tag`, breadcrumb) and CSS variables. Do not introduce a new styling system.
3. The live page currently has two activities, Nim (vs computer / 2 player, several pile setups) and Paper Folding to the Moon. Preserve their logic exactly; only move them into the new structure.
4. If any part of this spec looks like a bad design decision once you see the real code, say so before building.

## 1. Architecture

- One data file `app/explore/activities.js` exporting an array. Each entry:
  `slug`, `title`, `hook` (one line), `category`, `minutes`, `difficulty` ('easy' | 'medium' | 'hard'), `course` (optional: `{ label, href }`), `badge` (optional, e.g. 'From my research'), `status` ('live' | 'soon'), `addedOn` (ISO date).
- Categories: `games`, `sims`, `puzzles`, `art`, `paradox`.
- Hub: `app/explore/page.js` (server component for metadata and layout) rendering a client component `ExploreHub` for filters, search, sort and progress.
- Activity pages: `app/explore/[slug]/page.js` using one shared template. Each activity is its own client component, loaded with `next/dynamic` (`ssr: false`) from a map in `app/explore/registry.js` keyed by slug.
- Shared pieces live in `components/explore/` and are imported, never copy-pasted between files: `ActivityCard`, `CategoryTag`, `ProgressStrip`, `DailyPuzzleCard`, `ActivityShell`, `PlayNext`.
- `activities.js` is the single source of truth. The hub grid, filters, "play next", progress counts and `generateStaticParams` all read from it.

## 2. Hub layout (top to bottom)

1. Hero: eyebrow "Play & wonder", H1 "Explore", one-line intro, search input.
2. Row: Puzzle of the day card (wide, the only accented card on the page) next to two small stat cards: day streak and badges earned (x / total).
3. Progress strip: "Explored N of M activities" with a thin bar (amber to teal, matching the existing page progress bar).
4. Filter chips: All, Games, Simulations, Puzzles, Art, Paradoxes. Single select. Add a "Not played yet" toggle and a sort select (Newest, Shortest, Hardest).
5. Card grid: `repeat(auto-fill, minmax(220px, 1fr))`, 1 column on phones.
6. "Coming next" dashed strip listing activities with `status: 'soon'`. Soon items must not be clickable.

## 3. Card anatomy (identical for every activity)

- Icon tile (tinted by category color) and, top right, a green check if played.
- Title (Cormorant Garamond) and one-line hook (DM Sans, `--text2`).
- Footer row: category tag, time label ("5 min").
- Optional: course link line (e.g. "Calculus I, Lecture 12") and optional badge ("From my research").
- Whole card is one link to `/explore/[slug]`. Hover: slight lift and border in the category color. Respect `prefers-reduced-motion`.

## 4. Category colors (use existing tokens only)

- Games: `--amber`
- Simulations: `--violet`
- Puzzles: `--teal`
- Art: `--rose`
- Paradoxes: `--navy` (the sand/cream token)

Tags use the color at about 12% alpha as background with the full color as text, like the existing `--amber-lt` / `--teal-lt` pattern.

## 5. Activity page template (`ActivityShell`)

Breadcrumb (Home > Explore > Title), title with category tag and time, "How to play" line, the interactive area as large as the viewport allows, a collapsible "Why it works" section (math explanation, KaTeX/MathJax only if the project already uses it there), "Related lecture" link if `course` exists, and a `PlayNext` row of 3 other activities (prefer same category, then unplayed). Calling `markPlayed(slug)` after the first meaningful interaction (not on page load).

## 6. Progress, streak and badges (no login)

- Store in `localStorage` under one key, `mws-explore-v1`: `{ played: {slug: ISODate}, streak: {count, lastDay}, badges: [] }`.
- Read storage only inside `useEffect` to avoid hydration mismatches. Wrap every read and write in try/catch and render correctly when storage is empty or blocked.
- Put this in one hook, `useExploreProgress()`, used by the hub and the shell.
- Starter badges: First play, 3 categories tried, 5-day streak, Nim master (beat the hardest setup), Moon shot (correct fold guess). Badge definitions live in one array.

## 7. Puzzle of the day

- Deterministic by local date: `index = daysSinceEpoch % puzzles.length`, so every student sees the same puzzle that day without a backend.
- Puzzles live in `app/explore/daily/puzzles.js` (question, 3 hints, answer, short explanation). Hint ladder: nudge, bigger hint, full solution.
- Streak increases when the day's puzzle is solved; resets if a day is missed.
- "Share result" copies a short text to the clipboard (no spoilers).
- Seed with 14 puzzles. All answers must be verified (use SymPy or hand-check) before they are committed.

## 8. Activity roster

Phase 1 (migrate): Nim, Paper Folding to the Moon.
Phase 2: Monty Hall simulator, Tower of Hanoi.
Phase 3: Derivative detective (match f to f', links to Calculus I), Fourier doodle.
Phase 4: Epidemic simulator (SIR with sliders for beta, gamma and R0, then a two-pathogen extension; tagged "From my research"), Matrix transformer (drag basis vectors, show determinant as area, find eigenvectors; links to Linear Algebra).
Listed as `soon` from day one: Birthday paradox, Game of Life, Islamic pattern maker.

Any math shown (probabilities, eigenvalues, ODE behavior, puzzle answers) must be verified before publishing.

## 9. Quality bar

- Mobile first: tap targets at least 44px, no horizontal scroll, canvases scale with `max-width: 100%`.
- Keyboard accessible filters and cards, visible focus, `aria-label` on icon-only controls, live region for filter result count.
- Hub page JS stays small: heavy activity code only loads on its own page.
- Page metadata for `/explore` and each activity (title and description).
- Update the home page "Explore" quick-link card text if the new description reads better.

## 10. Working rules

- Prefer targeted edits over full rewrites for small changes; full files for new components.
- Run `npm run build` locally after each phase. It is the gate; do not report a phase done unless it passes.
- Work in phases and stop after each one with: what changed, `npm run build` result, and what you propose next. Do not start the next phase until told.
- Do not add dependencies without asking. Do not touch lecture pages, the midterm portal, or Supabase tables.
- Optional later (ask first): a Supabase-backed leaderboard for Nim streaks, following the existing `edit_token` pattern and with RLS enabled.