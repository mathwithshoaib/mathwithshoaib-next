'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

/* NAV ITEMS — add/remove pages here only */
const NAV = [
  { href: '/',          label: 'Home',      page: 'home' },
  { href: '/education', label: 'Education', page: 'education' },
  {
    label: 'Experience', page: 'experience',
    children: [
      { href: '/experience/instructor', label: '👨‍🏫 As Instructor' },
      { href: '/experience/ta',         label: '📋 As Teaching Assistant' },
    ],
  },
  { href: '/courses',  label: 'Courses',   page: 'courses' },
  { href: '/research', label: 'Research',  page: 'research' },
  { href: '/hobbies',  label: 'Hobbies',   page: 'hobbies' },
  { href: '/explore',  label: 'Explore',   page: 'explore' },
  { href: '/contact',  label: 'Contact',   page: 'contact' },
];

export default function Navbar({ activePage = 'home' }) {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const dropRef = useRef(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeAll = () => { setMenuOpen(false); setDropOpen(false); };

  return (
    <>
      <nav className={styles.nav}>
        {/* LOGO */}
        <Link href="/" className={styles.logo} onClick={closeAll}>
          Shoaib-K
          <span className={styles.badge}>LUMS</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV.map(item => {
            /* Dropdown item */
            if (item.children) {
              const isActive = activePage === item.page;
              return (
                <div key={item.label} className={styles.item} ref={dropRef}>
                  <button
                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                    onClick={() => setDropOpen(o => !o)}
                    aria-expanded={dropOpen}
                  >
                    {item.label}
                    <span className={`${styles.arrow} ${dropOpen ? styles.arrowOpen : ''}`}>▾</span>
                  </button>
                  {dropOpen && (
                    <div className={styles.dropdown}>
                      {item.children.map(c => (
                        <Link key={c.href} href={c.href} onClick={closeAll}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            /* Plain link */
            const isActive = activePage === item.page;
            return (
              <div key={item.page} className={styles.item}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>

        {/* HAMBURGER */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamActive : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE BACKDROP */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={closeAll} />
      )}
    </>
  );
}