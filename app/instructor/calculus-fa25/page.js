'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CourseHero } from '../../ta/CourseHero';
import { ResourceSection, ResourceGrid, TA_RESOURCE_CSS } from '../../ta/ResourceSection';

/* ══════════════════════════════════════════════════════
   MATH-101 Calculus · Fall 2025 (as Instructor) — carried over
   in full from the old Google Sites pages (experience_1/
   as-an-instructor + calculus-1-fall25), with every resource
   link preserved. Shares the same compact card/grid components
   as the /ta/<course> pages — see app/ta/ResourceSection.jsx and
   app/ta/CourseHero.jsx.
   ══════════════════════════════════════════════════════ */

const INSTRUCTORS = ['Imran Anwar (lead)', 'Mariam Alvi', 'Muhammad Shoaib Khan', 'Azhar Javed'];
const TAS = [
  'Muhammad Muzammil Zia (Head TA)', 'Aqsa Noreen', 'Muhammad Ateeq', 'Adnan Hilal',
  'Muhammad Yousaf', 'Fazal Rehman', 'Fatima Asim', 'Ayma Aamir',
  'Muhammad Ali Shah', 'Syed Ibrahim Bin Hassan', 'Haya Afareen', 'Muhammad Aaryan Ijaz', 'Syed Hammad Ali',
];

const DESCRIPTION = `The objective of this course is to develop a foundational understanding of calculus concepts — such as limits, derivatives, and integrals — and their applications in real-world problems, with emphasis on the social sciences, life sciences, and business.`;
const OBJECTIVE = `Core topics: functions, limits and continuity; rules of differentiation and graphing; rates of change, approximation and optimization; applications to business, biology, economics and the social sciences; definite and indefinite integrals; the Fundamental Theorem of Calculus; integration techniques; and L'Hopital's rule.`;

const SECTIONS = [
  {
    title: 'Recitation Slides',
    groups: [
      {
        rows: [
          { label: 'Week 1', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAGxpMLW2Xc/5YonWKRhpjbMdYcMKbvONg/view' }] },
          { label: 'Week 2', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAGypoxbC-k/mOA5fMspJgPVzBc50EBZdQ/view' }] },
          { label: 'Week 3 (quiz week)', links: [] },
          { label: 'Week 4', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAGz-KJCQg8/RwXcWCGNxkKBFG9xoKF_Vg/view' }] },
          { label: 'Week 5', links: [
            { tag: 'Slides', href: 'https://www.canva.com/design/DAG0tvFW67c/jGyCohJsCKLACAz4vVDoIA/view' },
            { tag: 'Quiz', href: 'https://drive.google.com/drive/folders/1Dri8N_8gkRgFSz6orkprCrAu1m4Sd7da?usp=sharing' },
          ] },
          { label: 'Week 6', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAG1T1Qrklo/vk2p7kCq97fQabDMt4InmA/view' }] },
          { label: 'Week 7 (quiz week)', links: [] },
          { label: 'Week 8', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAG2m9ETTTg/x5edd5ksqQb0VemU0mUwKw/view' }] },
          { label: 'Week 9', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAG3QNGtrEc/PJt7maLz_PI-CGV2NZhRUg/view' }] },
          { label: 'Week 10 (quiz week)', links: [] },
          { label: 'Week 11', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAG4jvhI6YE/ehObP57St7IHBy24hXaeuw/view' }] },
          { label: 'Week 12 (quiz week)', links: [] },
          { label: 'Week 13', links: [{ tag: 'Slides', href: 'https://www.canva.com/design/DAG53_UoRT0/U4b6PFUZXdONjqTmOqo3iw/view' }] },
        ],
      },
    ],
  },
  {
    title: 'Lecture Notes (Dr. Imran Anwar)',
    groups: [
      {
        rows: [
          { label: 'Week 1', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1Wo9RC0cSoJiUSm1iknDtm2sFM_Tkk8hP/view?usp=drive_link' }] },
          { label: 'Week 2', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1v4wMaka1oQHMywP-FJfdFdTDKEiJGVDL/view?usp=drive_link' }] },
          { label: 'Week 3', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1QDfhr5PIkDW6N5z1FqPG6W2zcznQtfKP/view?usp=sharing' }] },
          { label: 'Week 4', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1WDbSNMe8xxV7pQCAy64Feaa_KyA3jCfp/view?usp=sharing' }] },
          { label: 'Week 5', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1pIUUkN_0EYWJXy005fagRj6BHZ7BdahU/view?usp=sharing' }] },
          { label: 'Week 6', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1Arlf4SSUC5_BSWDT2pwzwU0gtMPDGgNw/view?usp=sharing' }] },
          { label: 'Week 7', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1xoXcGluefokZgBnuyUVrR2vbB/view?usp=sharing' }] },
          { label: 'Week 8', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1LZzZqrb8UTCvFCiVZA3jfh6tjTRCLugQ/view?usp=sharing' }] },
          { label: 'Week 9', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1o09Q14bZdIWnN5a2Yx-nMHAy2WnKx/view?usp=sharing' }] },
          { label: 'Week 10', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1_cva5KSGCPpTeUsYlfYpwBXel7bYBpAJ/view?usp=sharing' }] },
          { label: 'Week 11', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1s1QsIkDvHauyhoBqHv05ekwGlxTUUcYH/view?usp=sharing' }] },
        ],
      },
    ],
  },
  {
    title: 'Additional Resources',
    groups: [
      {
        rows: [
          { label: 'Webwork Instructions', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1bIanQ--mKQq5R_a-kOq6CLoC7btfjswf/view?usp=sharing' }] },
          { label: 'Mid-Term Mock Exam', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1Kb_UYxorPxlgKlmGAY2dfD_fGZbzklYx/view?usp=sharing' }] },
        ],
      },
    ],
  },
  {
    title: 'Related',
    groups: [
      {
        rows: [
          { label: 'Math-101 Calculus (as TA, Spring 2025)', links: [{ tag: 'View', href: '/ta/calculus-sp25' }] },
          { label: "Dr. Adnan Khan's course website", links: [{ tag: 'Visit', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Calculus%20I/' }] },
        ],
      },
    ],
  },
];

export default function CalculusFa25InstructorPage() {
  return (
    <>
      <Navbar activePage="experience" />
      <CourseHero
        title="MATH-101 · Calculus"
        term="Fall 2025 · as Instructor"
        instructors={INSTRUCTORS}
        tas={TAS}
        description={DESCRIPTION}
        objective={OBJECTIVE}
        backHref="/experience/instructor"
        backLabel="← Back to Instructor Experience"
      />

      <section className="sk-section-sm">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <ResourceGrid>
            {SECTIONS.map((s) => (
              <ResourceSection key={s.title} section={s} fullWidth={s.fullWidth} />
            ))}
          </ResourceGrid>

          <div style={{ paddingTop: '20px', marginTop: '20px', borderTop: '1px solid var(--border)' }}>
            <Link href="/experience/instructor" style={{ color: 'var(--text3)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.78rem' }}>
              ← Back to Instructor Experience
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{TA_RESOURCE_CSS}</style>
    </>
  );
}
