'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════
   Contact — carried over from the old Google Sites portfolio
   (sites.google.com/view/shoaib-k/contact). The message form is
   a placeholder for now (Google Form vs. custom form still to be
   decided) — swap CONTACT_FORM_URL in once that's picked.
   ══════════════════════════════════════════════════════ */

const CONTACT_FORM_URL = null; // e.g. a Google Form link, once decided

const CHANNELS = [
  { icon: '📨', label: 'Personal Email', value: 'bssk.khan@gmail.com', href: 'mailto:bssk.khan@gmail.com' },
  { icon: '🎓', label: 'LUMS Email', value: 'shoaib.khan@lums.edu.pk', href: 'mailto:shoaib.khan@lums.edu.pk' },
  { icon: '📲', label: 'Phone', value: '+92 348 9696996', href: 'tel:+923489696996' },
];

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/shoaiib.k' },
  { label: 'Twitter', href: 'https://twitter.com/msking_shoaib' },
  { label: 'Instagram', href: 'https://instagram.com/msking.shoaib' },
];

export default function ContactPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activePage="contact" />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'calc(var(--nav-h) + 3px)',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ padding: '64px 32px 56px' }}>
          <span className="eyebrow reveal">Get in Touch</span>
          <h1 style={{ marginBottom: '16px', maxWidth: '680px' }} className="reveal">
            Contact
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }} className="reveal">
            Questions about a course, research collaboration, or LUMS Math Circles — happy to hear from you.
          </p>
        </div>
      </section>

      {/* ── CHANNELS + PHOTO ── */}
      <section className="sk-section">
        <div className="container contact-grid">
          <div className="reveal">
            <div className="card" style={{ padding: '28px 30px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '18px' }}>Reach Me Directly</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {CHANNELS.map((c) => (
                  <a key={c.label} href={c.href} className="contact-channel">
                    <span className="contact-channel-icon">{c.icon}</span>
                    <span>
                      <span className="contact-channel-label">{c.label}</span>
                      <span className="contact-channel-value">{c.value}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '18px' }}>
                <h4 style={{ fontSize: '.82rem', color: 'var(--text3)', fontFamily: 'var(--fm)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '12px' }}>Social</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="tag">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="card contact-photo-card">
              <div className="contact-photo-wrap">
                <Image src="/images/shoaib.jpeg" alt="Muhammad Shoaib Khan" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px' }}>Muhammad Shoaib Khan</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--text3)', margin: 0, fontFamily: 'var(--fm)' }}>
                  Mathematician · Educator · Researcher, LUMS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MESSAGE FORM (placeholder) ── */}
      <section className="sk-section sk-section-alt">
        <div className="container" style={{ maxWidth: '620px', textAlign: 'center' }}>
          <span className="eyebrow reveal">Coming Soon</span>
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Send a Message</h2>
          <p className="reveal" style={{ color: 'var(--text2)', marginBottom: '24px' }}>
            A direct message form will live here shortly — for now, email is the fastest way to reach me.
          </p>
          {CONTACT_FORM_URL ? (
            <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn reveal">Open Contact Form →</a>
          ) : (
            <div className="reveal" style={{ border: '1px dashed var(--border2)', borderRadius: 'var(--radius)', padding: '28px', color: 'var(--text3)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>
              Form not set up yet
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; }
        .contact-channel { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .contact-channel-icon { font-size: 1.4rem; flex-shrink: 0; }
        .contact-channel-label { display: block; font-family: var(--fm); font-size: .68rem; color: var(--text3); letter-spacing: .04em; text-transform: uppercase; }
        .contact-channel-value { display: block; font-size: .92rem; color: var(--text); margin-top: 2px; }
        .contact-channel:hover .contact-channel-value { color: var(--amber); }
        .contact-photo-card { padding: 0; overflow: hidden; }
        .contact-photo-wrap { position: relative; width: 100%; aspect-ratio: 4/3; }
        @media (max-width: 760px) { .contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
