'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CourseHero } from '../CourseHero';
import { ResourceSection, ResourceGrid, TA_RESOURCE_CSS } from '../ResourceSection';

/* ══════════════════════════════════════════════════════
   MATH-100 Pre-Calculus · Fall 2024 — carried over in full from
   the old Google Sites TA page (math-100-pre-cal-fa-24), with
   every resource link preserved.
   ══════════════════════════════════════════════════════ */

const INSTRUCTORS = ['Ayesha Ahmed'];
const TAS = [
  'Muhammad Shoaib Khan', 'Muhammad Javaid Qayoom', 'Muhammad Ali Shahzad',
  'Zoha Saleem', 'Kousar Pervaiz', 'Zainab Ahmad',
];

const DESCRIPTION = `This course is for students who have not taken A-levels/F.Sc mathematics or the equivalent. It covers the algebra and trigonometry required for students to be able to study calculus afterwards. Topics covered include real and complex numbers, equations, functions, graphs of functions, trigonometry, exponential and logarithmic functions, sequences and series, and conic sections.`;
const OBJECTIVE = `This course aims at preparing students for calculus and other advanced courses, and at helping students develop mathematical reasoning skills. It serves as an introduction to the fundamental concepts and techniques of precalculus mathematics.`;

const SECTIONS = [
  {
    title: 'Notes + Video Explanations',
    groups: [
      {
        rows: [
          { label: 'Chapter 02 — Functions', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/15x3Qsy7wiL9tykNCXCHRGcPR9SESDelk/view?usp=drive_link' }] },
          { label: 'Section 2.8, 3.1–3.4', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/1-4f3g7v0gKD4_yxmJVtO0B9h7_89CZE6/view?usp=drivesdk' },
            { tag: 'Video', href: 'https://youtu.be/oS_iZPP8GV4' },
          ] },
          { label: 'Chapter 04', links: [{ tag: 'Video', href: 'https://youtu.be/SEE466VT_9k' }] },
          { label: 'Chapter 12', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/1-AVyQGH4Xf4hqSPuIgVXD6nYiMzmhqzG/view?usp=drivesdk' },
            { tag: 'Video', href: 'https://youtu.be/t15b_cszcPY' },
          ] },
          { label: 'Chapter 07', links: [
            { tag: 'Notes', href: 'https://drive.google.com/file/d/156nqubxL0XbOTXlHjjnV6yqsISca_baE/view?usp=sharing' },
            { tag: 'Video', href: 'https://youtu.be/xe-_uEx7Q8Y' },
          ] },
        ],
      },
    ],
  },
  {
    title: 'Practice Problems',
    note: 'Problems are taken from savemyexams.com.',
    groups: [
      {
        rows: [
          { label: 'Equations, Inequalities and Graphs', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/12DxPE0bvPWRVspzpSl-p0P4lLCaMYV7x/view?usp=drivesdk' }] },
          { label: 'Factors of Polynomials', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/12KpxwIhwBfrxirfR9d0v9tvi-l3kXRPa/view?usp=drivesdk' }] },
          { label: 'Exponentials and Logarithms', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1-dIRJTgpZL48DWDaqSJGFyOwp3eyFyoY/view?usp=drivesdk' }] },
          { label: 'Trigonometry', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/12BrVlzcAIHyi-idT5DvS2oiTWdI7kQIp/view?usp=drivesdk' }] },
          { label: 'Sequences and Series', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1PLpG9UqJDAuEVCoOa3zILFvc8anB3GhK/view?usp=sharing' }] },
        ],
      },
    ],
  },
  {
    title: 'Quiz Solutions',
    gridGroups: true,
    fullWidth: true,
    groups: [
      {
        subtitle: 'Section 1',
        rows: [
          { label: 'Quiz 1', links: [] },
          { label: 'Quiz 2', links: [] },
          { label: 'Quiz 3', links: [
            { tag: 'V1', href: 'https://drive.google.com/file/d/1r46qanl5dcHP5JpV9jabk38CpvQk9YQA/view?usp=sharing' },
            { tag: 'V2', href: 'https://drive.google.com/file/d/1kwDpEssqmLPFPWOW9nq_vdLQ9wPMFRi5/view?usp=sharing' },
          ] },
          { label: 'Quiz 4', links: [
            { tag: 'Quiz', href: 'https://drive.google.com/file/d/1v-k0LKfi3-EyuE67nscOEwM3oOjbPPfV/view?usp=sharing' },
            { tag: 'Makeup', href: 'https://drive.google.com/file/d/1khA7CxBmgKLLoALX5gOEbqgMliv5BG-w/view?usp=sharing' },
          ] },
          { label: 'Quiz 5', links: [
            { tag: 'Quiz', href: 'https://drive.google.com/file/d/1HvW6YHj2grnkLQbkWE5k6eFji_Y2cjx5/view?usp=sharing' },
            { tag: 'Makeup', href: 'https://drive.google.com/file/d/16C-qnY77HrHpHsEEorZfC1H7zj9JQxaN/view?usp=sharing' },
          ] },
        ],
      },
      {
        subtitle: 'Section 2',
        rows: [
          { label: 'Quiz 1', links: [{ tag: 'Quiz', href: 'https://drive.google.com/file/d/1QJ-JAAalPw88O4jICc3T9jQ-BbVvlf8v/view?usp=sharing' }] },
          { label: 'Quiz 2', links: [
            { tag: 'V1', href: 'https://drive.google.com/file/d/1wbrlMV2jTskUIJHryPWqbJ8ARwYW83uh/view?usp=sharing' },
            { tag: 'V2', href: 'https://drive.google.com/file/d/1cLE2MKBKyCzvqLEEqJe7sirXx96lGacp/view?usp=sharing' },
          ] },
          { label: 'Quiz 3', links: [] },
          { label: 'Quiz 4', links: [
            { tag: 'Quiz', href: 'https://drive.google.com/file/d/1BKsENQFnABcixRXCVskKU_gAbJBKhn1f/view?usp=sharing' },
            { tag: 'Makeup', href: 'https://drive.google.com/file/d/1khA7CxBmgKLLoALX5gOEbqgMliv5BG-w/view?usp=sharing' },
          ] },
          { label: 'Quiz 5', links: [
            { tag: 'Quiz', href: 'https://drive.google.com/file/d/1P8iJCQkW5GkdQCVp3nR5ugKPKDzjfkJe/view?usp=sharing' },
            { tag: 'Makeup', href: 'https://drive.google.com/file/d/16C-qnY77HrHpHsEEorZfC1H7zj9JQxaN/view?usp=sharing' },
          ] },
        ],
      },
    ],
  },
  {
    title: 'Mid & Final Solutions',
    groups: [
      {
        rows: [
          { label: 'Mid-Term — Sections 1 & 2', links: [
            { tag: 'V1', href: 'https://drive.google.com/file/d/1SlyxquIywRyE29chTMhvDjSbGlx7bv_s/view?usp=sharing' },
            { tag: 'V2', href: 'https://drive.google.com/file/d/1Pg34CBWbTR2h_HwFeae-JVWKDpa0Lrid/view?usp=sharing' },
          ] },
        ],
      },
    ],
  },
];

export default function PrecalcFa24Page() {
  return (
    <>
      <Navbar activePage="experience" />
      <CourseHero
        title="MATH-100 · Pre-Calculus"
        term="Fall 2024"
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
