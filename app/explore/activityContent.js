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
};

export function getActivityContent(slug) {
  return ACTIVITY_CONTENT[slug] || null;
}
