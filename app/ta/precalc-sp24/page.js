'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CourseHero } from '../CourseHero';
import { ResourceSection, ResourceGrid, TA_RESOURCE_CSS } from '../ResourceSection';

/* ══════════════════════════════════════════════════════
   MATH-100 Pre-Calculus · Spring 2024 — carried over in full
   from the old Google Sites TA page (math-100-pre-cal-sp-24),
   with every resource link preserved.
   ══════════════════════════════════════════════════════ */

const INSTRUCTORS = ['Mariam Siddiq Alvi'];
const TAS = ['Muhammad Shoaib Khan', 'Kousar Pervaiz'];

const DESCRIPTION = `This course is for students who have not taken A-levels/F.Sc mathematics or equivalent. It covers algebra and trigonometry required for calculus study. Topics include real and complex numbers, equations, functions, function graphs, trigonometry, exponential and logarithmic functions, sequences, series, and conic sections.`;
const OBJECTIVE = `This course aims at preparing students for calculus and other advanced courses, and helping them develop mathematical reasoning skills as an introduction to fundamental precalculus concepts.`;

const SECTIONS = [
  {
    title: 'Tutorials',
    groups: [
      {
        rows: [
          { label: 'Tutorial 01', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1oKti_kXf8ufReqfyy5r_VR2TVvY6bra3/view?usp=drive_link' }] },
          { label: 'Tutorial 02', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/15x3Qsy7wiL9tykNCXCHRGcPR9SESDelk/view?usp=drive_link' }] },
          { label: 'Tutorial 03', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1qy0XWZxXbzNEbQimcjFjUty3i-zux-o-/view?usp=sharing' }] },
          { label: 'Tutorial 04', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/1A4MAngN0V4w1-4eHElsXGdTqHyydC-Tb/view?usp=sharing' },
            { tag: 'Video', href: 'https://youtu.be/oS_iZPP8GV4' },
          ] },
          { label: 'Tutorial 05', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1ag9yyq2u3JW75b9AZxl9nA4JrLXS-097/view?usp=sharing' }] },
          { label: 'Tutorial 06', links: [{ tag: 'Video', href: 'https://youtu.be/SEE466VT_9k' }] },
          { label: 'Tutorial 07', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/13rswJe2uULs3hNYIpo7srdOiqbhAiL9X/view?usp=sharing' }] },
          { label: 'Tutorial 08', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/1wAWHy2SgKyPy9Fe1M6ri3TAZfXGN_vqe/view?usp=sharing' },
            { tag: 'Video', href: 'https://youtu.be/kdbGVdccYJk' },
          ] },
          { label: 'Tutorial 09', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/156nqubxL0XbOTXlHjjnV6yqsISca_baE/view?usp=sharing' },
            { tag: 'Video', href: 'https://youtu.be/xe-_uEx7Q8Y' },
          ] },
        ],
      },
    ],
  },
  {
    title: 'Quiz Solutions',
    groups: [
      {
        rows: [
          { label: 'Quiz 01', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/16-8prKBJfQcvO5Cqo3VpYR5-ZJW0drKv/view?usp=sharing' }] },
          { label: 'Quiz 02', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1-bGqmB91lbEHTybFVVRk_xIo5a7mymwv/view?usp=sharing' }] },
          { label: 'Quiz 03', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1aeJzHJd783rAi2OvkcXPJ4FhtBMPisYy/view?usp=sharing' }] },
          { label: 'Quiz 04', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1NzMC5fIZV_SRzN41eRIYKmh9VwhiQrGa/view?usp=drive_link' }] },
          { label: 'Quiz 05', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1OnXE5JpyWVgklUV4gAIPwGauZe_ixcpn/view?usp=drive_link' }] },
        ],
      },
    ],
  },
  {
    title: 'Mid & Final Solutions',
    groups: [
      {
        rows: [
          { label: 'Mid-Term Exam', links: [
            { tag: 'Solution', href: 'https://drive.google.com/file/d/1JEc9SrbFA1BlKWpH0A3lRAXRJRxq53Bq/view?usp=sharing' },
            { tag: 'Video', href: 'https://youtu.be/wBPY_Ym4kw4' },
          ] },
          { label: 'Final Exam', links: [] },
        ],
      },
    ],
  },
];

export default function PrecalcSp24Page() {
  return (
    <>
      <Navbar activePage="experience" />
      <CourseHero
        title="MATH-100 · Pre-Calculus"
        term="Spring 2024"
        instructors={INSTRUCTORS}
        tas={TAS}
        description={DESCRIPTION}
        objective={OBJECTIVE}
      />

      <section className="sk-section-sm">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <ResourceGrid>
            {SECTIONS.map((s) => (
              <ResourceSection key={s.title} section={s} fullWidth={s.fullWidth} />
            ))}
          </ResourceGrid>

          <div style={{ paddingTop: '20px', marginTop: '20px', borderTop: '1px solid var(--border)' }}>
            <Link href="/experience/ta" style={{ color: 'var(--text3)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.78rem' }}>
              ← Back to TA Experience
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{TA_RESOURCE_CSS}</style>
    </>
  );
}
