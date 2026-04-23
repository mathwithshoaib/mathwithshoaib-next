import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sk-footer">
      <div className="sk-footer-inner">
        <div>
          <div className="sk-footer-logo">Shoaib-K</div>
          <p style={{color:'var(--text2)',fontSize:'.875rem',marginTop:'10px'}}>
            Mathematician · Educator · Researcher<br/>LUMS, Lahore, Pakistan
          </p>
          <div style={{display:'flex',gap:'14px',marginTop:'16px'}}>
            <a href="https://www.facebook.com/shoaiib.k" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com/msking_shoaib" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com/msking.shoaib" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div>
          <h5>Navigation</h5>
          <Link href="/">Home</Link>
          <Link href="/education">Education</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/research">Research</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h5>Contact</h5>
          <a href="mailto:bssk.khan@gmail.com">bssk.khan@gmail.com</a>
          <a href="https://lums.edu.pk" target="_blank" rel="noopener noreferrer">LUMS Website</a>
        </div>
      </div>
      <div className="sk-footer-bottom">
        <p>© 2025 Muhammad Shoaib Khan · LUMS · Lahore, Pakistan</p>
        <p>Built with Next.js &amp; Mathematics</p>
      </div>
    </footer>
  );
}