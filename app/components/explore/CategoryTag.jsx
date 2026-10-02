import { getCategory } from '../../explore/activities';

export default function CategoryTag({ category }) {
  const cat = getCategory(category);
  if (!cat) return null;
  return (
    <span className="tag" style={{ color: cat.color, background: cat.tint }}>
      {cat.label}
    </span>
  );
}
