import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExploreHub from '../components/explore/ExploreHub';

export const metadata = {
  title: 'Explore · Shoaib-K · LUMS',
  description: 'A growing hub of math games, simulations, puzzles, and art — Nim, Paper Folding to the Moon, a daily puzzle, and more on the way.',
};

export default function ExplorePage() {
  return (
    <>
      <Navbar activePage="explore" />
      <ExploreHub />
      <Footer />
    </>
  );
}
