// app/explore/activityContent.js
//
// Longer-form per-activity text that doesn't belong in activities.js's
// strict card-anatomy schema: the "how to play" line and the "why it
// works" explanation shown on each activity's own page.

export const ACTIVITY_CONTENT = {
  nim: {
    howToPlay: 'Click a stone to remove it and every stone after it in that pile — click near the start of a pile to take almost everything, or near the end to take just one. Take the last object on the board to win.',
    whyItWorks: 'Nim has a complete theory. For any position, XOR together the sizes of all piles — the result is called the nim-sum. If the nim-sum is 0, the position is a loss for whoever is about to move against perfect play: every move they make turns the nim-sum nonzero, handing control back. If the nim-sum is nonzero, there is always a move that returns it to 0 — exactly the strategy the Hint button reveals. Charles Bouton proved this in 1901, and the same XOR-based idea (Sprague–Grundy theory) generalizes to analyze huge families of combinatorial games.',
  },
  'paper-folding': {
    howToPlay: 'Drag the slider to choose a number of folds, and watch the stack thickness race the distance to the Moon.',
    whyItWorks: 'Each fold doubles the thickness, so after n folds a 0.1mm sheet is 0.1 × 2ⁿ millimeters thick — exponential growth, slow-looking at first and then explosive. Solving 0.1 × 2ⁿ ≥ 384,400,000,000 mm gives n ≈ 41.8, so 42 folds is enough. Most people guess a number in the thousands or millions — a good illustration of why exponential growth is so easy to underestimate.',
  },
  '100-square-jigsaw': {
    howToPlay: 'Drag a piece from the tray onto the board, or tap a piece and then tap the square where its top-left corner should go. Pieces always stay the same way up. Use Check to see which placed pieces are right, and Hint if you get stuck — five puzzles are available as tabs, each a little harder than the last.',
    whyItWorks: 'Every piece is a fixed shape cut from a 10×10 grid of consecutive numbers, so getting one right constrains its neighbors — the puzzle is really about reading the arithmetic pattern in the grid (rows add 10 going down, columns add 1 going right) rather than brute-force trial and error. The later puzzles flip that direction, start the count at 0 instead of 1, or hide some of the numbers entirely, so the same grid pattern has to be tracked mentally instead of read off directly.',
  },
  'root-rush': {
    howToPlay: 'Starting from the number shown, press operation buttons to reach the target exactly — but the number on screen can never go over 60. Undo is free (it doesn’t cost you a step); Restart begins a fresh attempt. Three levels per difficulty, each starting where the last one left off.',
    whyItWorks: 'This is a shortest-path search problem in disguise: every reachable number is a node, every button press is an edge, and the fewest-possible-steps shown after you solve a level is the length of the shortest path between start and target, found by searching the whole reachable space breadth-first. √ is the interesting operation — it only ever helps when the number on screen is a perfect square (1, 4, 9, 16, 25, 36, 49), since taking the root of anything else produces an irrational decimal that can never become a whole number again no matter what you do to it afterward.',
  },
};

export function getActivityContent(slug) {
  return ACTIVITY_CONTENT[slug] || null;
}
