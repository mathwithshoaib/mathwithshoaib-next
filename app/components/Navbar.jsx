'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ activePage = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);

  const closeMenu = () => { setMenuOpen(false); setExpOpen(false); };

  return (
    <nav style={{
      position:'fixed', top:'3px', left:0, right:0, zIndex:1000,
      height:'var(--nav-h)', background:'rgba(24,31,46,0.92)',
      backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', padding:'0 36px'
    }}>
      <Link href="/" style={{
        fontFamily:'var(--fm)', fontSize:'1.05rem', fontWeight:500,
        color:'var(--amber)', letterSpacing:'.02em',
        marginRight:'auto', display:'flex', alignItems:'center', gap:'10px'
      }}>
        Shoaib-K{' '}
        <span style={{background:'var(--amber)',color:'var(--bg)',fontSize:'.7rem',padding:'2px 8px',borderRadius:'4px',letterSpacing:'.06em',fontWeight:600}}>
          LUMS
        </span>
      </Link>

      <div style={{display:'flex', alignItems:'center', gap:'2px'}}>
        {[
          {href:'/', label:'Home', page:'home'},
          {href:'/education', label:'Education', page:'education'},
          {href:'/courses', label:'Courses', page:'courses'},
          {href:'/research', label:'Research', page:'research'},
          {href:'/hobbies', label:'Hobbies', page:'hobbies'},
          {href:'/explore', label:'Explore', page:'explore'},
          {href:'/contact', label:'Contact', page:'contact'},
        ].map(({href,label,page}) => (
          <Link key={page} href={href} style={{
            display:'inline-flex', alignItems:'center',
            fontFamily:'var(--fb)', fontSize:'.875rem', fontWeight:500,
            color: activePage===page ? 'var(--amber)' : 'var(--text2)',
            background: activePage===page ? 'rgba(232,160,32,0.10)' : 'transparent',
            padding:'7px 14px', borderRadius:'8px',
            transition:'all .18s', whiteSpace:'nowrap'
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}