// app/explore/daily/puzzles.js
//
// Seed set of daily puzzles. Every answer is either a single integer or one
// of a fixed set of multiple-choice options, and every one has been checked
// by an independent script (two cross-checking methods per puzzle — see the
// verification output from the PR/commit that added this file). Picked by
// local date, see getTodayPuzzle() in ../useExploreProgress.js.

export const PUZZLES = [
  {
    id: 'dice-sum-seven',
    type: 'integer',
    question: 'Roll two fair six-sided dice. In how many of the 36 equally likely outcomes does the sum equal 7?',
    hints: [
      'List the outcomes systematically, ordered pair by ordered pair: (1,6), (2,5), ...',
      'For each value of the first die (1 through 6), at most one value of the second die makes the sum 7.',
      'The outcomes are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — six of them.',
    ],
    answer: 6,
    explanation: 'Out of 36 equally likely outcomes, exactly 6 pairs sum to 7 — the most common sum when rolling two dice.',
  },
  {
    id: 'fibonacci-tenth',
    type: 'integer',
    question: 'The Fibonacci sequence starts 1, 1, 2, 3, 5, ... where each term is the sum of the two before it. What is the 10th term?',
    hints: [
      'Write the sequence term by term — you only need to reach the 10th term.',
      'F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5 — keep adding the previous two terms.',
      '1, 1, 2, 3, 5, 8, 13, 21, 34, 55 — the 10th term is 55.',
    ],
    answer: 55,
    explanation: 'Each term is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.',
  },
  {
    id: 'quadratic-product',
    type: 'integer',
    question: 'The equation x² − 7x + 10 = 0 has two roots. What is their product?',
    hints: [
      'Try factoring the quadratic into two binomials: (x − a)(x − b).',
      "You're looking for two numbers that multiply to 10 and add to 7.",
      '(x − 2)(x − 5) = 0, so the roots are 2 and 5, and their product is 10.',
    ],
    answer: 10,
    explanation: 'x² − 7x + 10 factors as (x − 2)(x − 5), giving roots 2 and 5. Their product is 10 — also readable directly as c/a from the original equation.',
  },
  {
    id: 'rectangle-longer-side',
    type: 'integer',
    question: 'A rectangle has a perimeter of 20 and an area of 24. What is the length of its longer side?',
    hints: [
      'Let the sides be l and w. Write two equations: l + w = 10 and l·w = 24.',
      'Substitute w = 10 − l into the area equation to get a quadratic in l.',
      'l² − 10l + 24 = 0 factors as (l − 4)(l − 6) = 0, so the sides are 4 and 6 — the longer side is 6.',
    ],
    answer: 6,
    explanation: 'Solving l + w = 10 and lw = 24 gives sides 4 and 6. The longer side is 6.',
  },
  {
    id: 'weekday-100-days',
    type: 'mc',
    question: 'If today is Monday, what day of the week will it be 100 days from now?',
    options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hints: [
      'There are 7 days in a week — only the remainder of 100 divided by 7 actually matters.',
      '100 = 14 × 7 + 2, so it behaves the same as counting forward just 2 days from Monday.',
      'Monday + 2 days = Wednesday.',
    ],
    answer: 'Wednesday',
    explanation: '100 mod 7 = 2, so 100 days from Monday lands 2 weekdays later: Wednesday.',
  },
  {
    id: 'modpow-seven-hundred',
    type: 'integer',
    question: 'What is the remainder when 7¹⁰⁰ is divided by 5?',
    hints: [
      'First reduce the base mod 5: 7 ≡ 2 (mod 5).',
      'Powers of 2 mod 5 cycle with period 4: 2, 4, 3, 1, 2, 4, 3, 1, ...',
      '100 is a multiple of 4, so 2¹⁰⁰ ≡ 2⁴ ≡ 1 (mod 5). The remainder is 1.',
    ],
    answer: 1,
    explanation: '7 ≡ 2 (mod 5), and powers of 2 mod 5 repeat every 4 steps. Since 100 is a multiple of 4, 7¹⁰⁰ ≡ 1 (mod 5).',
  },
  {
    id: 'level-arrangements',
    type: 'integer',
    question: 'How many distinct ways can you arrange all the letters of the word LEVEL?',
    hints: [
      'LEVEL has 5 letters, but some repeat — you have to divide out for the repeats.',
      'Count how many times each letter appears: L appears twice, E appears twice, V appears once.',
      '5! / (2! · 2! · 1!) = 120 / 4 = 30.',
    ],
    answer: 30,
    explanation: 'There are 5! = 120 orderings of 5 distinct slots, but L and E each repeat twice, so divide by 2!·2! to get 30 distinct arrangements.',
  },
];

// Deterministic by *local* date, so every student sees the same puzzle all
// day in their own timezone, with no backend. Using local y/m/d (rather
// than Date#getTime(), which is UTC-based) means the puzzle flips over at
// local midnight, not UTC midnight.
export function getTodayPuzzle(date = new Date()) {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceEpoch = Math.floor(localMidnight.getTime() / 86400000);
  const index = ((daysSinceEpoch % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  return PUZZLES[index];
}
