'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CourseHero } from '../CourseHero';
import { ResourceSection, ResourceGrid, TA_RESOURCE_CSS } from '../ResourceSection';

/* ══════════════════════════════════════════════════════
   MATH-101 Calculus · Spring 2025 — carried over in full from
   the old Google Sites TA page (math-101-calculus-sp-25), with
   every resource link preserved.
   ══════════════════════════════════════════════════════ */

const INSTRUCTORS = ['Adnan Khan', 'Imran Anwar'];
const TAS = [
  'Muhammad Shoaib Khan', 'Rehan Yousaf', 'Syed Muhammad Abdullah', 'Muhammad Saleh',
  'Mikael', 'Ashbala', 'Kousar Parvez', 'Falak Parvaiz', 'Muhammad Bilal', 'Muhammad Ali',
];

const DESCRIPTION = `Calculus is a foundational course at SSE; it plays an important role in the understanding of science, engineering, economics, and computer science, among other disciplines. This introductory calculus course covers differentiation and integration of functions of one variable, with applications. Topics include: concepts of function, limits and continuity, differentiation rules, application to graphing, rates, approximations, and extremum problems, definite and indefinite integration, the Fundamental Theorem of Calculus, techniques of integration, approximation of definite integrals, improper integrals, L'Hopital's rule, and applications of integration.`;

const SECTIONS = [
  {
    title: 'Solved Examples',
    note: (
      <>
        For lecture notes and class slides, see the{' '}
        <Link href="https://web.lums.edu.pk/~adnan.khan/classes/classes/Calculus%20I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>
          instructor&rsquo;s website
        </Link>.
      </>
    ),
    groups: [
      {
        rows: [
          { label: 'Basics of Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1ZozNkAWMailb0W3cbpUBgjga6jtJ2IWN/view?usp=sharing' }] },
          { label: 'One Sided and Infinite Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/176s4-RpgqFog2BJi6zI_BxPjl4VT-4TE/view?usp=sharing' }] },
          { label: 'One Sided Limit and Continuity', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1F1gDT78BChwxkI-GsxqNSe4yp_lY49ho/view?usp=sharing' }] },
          { label: 'Sin(x)/x by Grinshpan', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1NM-NfwvV6sgbe91wrr_yMsLDtZXxI5Pw/view?usp=sharing' }] },
          { label: 'All About Limits (by ACE Garmana)', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1c7RYwCtGQRtgfJp-KmdLpH88IxBZ8Exr/view?usp=sharing' }] },
          { label: 'Intermediate Value Theorem (IVT)', links: [
            { tag: '1', href: 'https://drive.google.com/file/d/1emm9gU30oWivu6HJgl6cRsKbI_Q9RBbg/view?usp=sharing' },
            { tag: '2', href: 'https://drive.google.com/file/d/1hawdlA2sfLbvxkcYzClportp35f48xTZ/view?usp=sharing' },
            { tag: '3', href: 'https://drive.google.com/file/d/141n82mww5CQ3QGuWU7ImRek1iOSRPW9f/view?usp=sharing' },
          ] },
          { label: 'Derivatives by Definition', links: [
            { tag: '1', href: 'https://drive.google.com/file/d/1ZfGAHFepAw_8P1P-54IPGqsyJ8NpG47o/view?usp=sharing' },
            { tag: '2', href: 'https://drive.google.com/file/d/188nL5ypZNsqh3HI1P_SWHIbw9rT2ERhz/view?usp=sharing' },
            { tag: '3', href: 'https://drive.google.com/file/d/1yNFMjG1RpMfqxBDxln25W3QGbJYLh166/view?usp=sharing' },
            { tag: '4', href: 'https://drive.google.com/file/d/1qZJRAxt39L6u0kAD65QeDzKA6oeK8Pk8/view?usp=sharing' },
            { tag: '5', href: 'https://drive.google.com/file/d/15H0Pqy3jzizwEkwTbOnsg1j3-3Yd1Gbz/view?usp=sharing' },
          ] },
        ],
      },
    ],
  },
  {
    title: 'Practice Problems',
    groups: [
      {
        rows: [
          { label: 'Darlene Diaz Course Notes (MATH 180)', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/13ziPT1gJKSGq6xgt41afesAH37yznrKX/view?usp=sharing' }] },
          { label: 'Limits Practice Problems', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1HoG1jHJ4bPXswsd_dCms-PJDruvsnBSK/view?usp=sharing' }] },
          { label: 'Intermediate Value Theorem (IVT)', links: [
            { tag: '1', href: 'https://drive.google.com/file/d/1RbZ5Pscc-6cAauh4B18qgl2_AXZRk5Br/view?usp=sharing' },
            { tag: '2', href: 'https://drive.google.com/file/d/1xW_FjVoGDWzkcp3ZmGnT3Il1fu8hAdTs/view?usp=sharing' },
          ] },
        ],
      },
    ],
  },
  {
    title: 'Tutorials (by Shoaib)',
    groups: [
      {
        rows: [
          { label: 'Intro to Limits, Informal Limits, One-Sided Limits, Limits at Infinity, Squeeze Theorem', date: '13 Feb 2025', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1IbBvppGH4PKAyXxYvgCl6ZURhdTEcHOt/view?usp=sharing' }] },
          { label: 'Exercises (with Solutions) on Limits at Infinity, Continuity, and IVT', date: '21 Feb 2025', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1Ir6ezX7Ut3yPLGeoz8KGPGDYOnduVWv6/view?usp=sharing' }] },
          { label: 'Introduction to Derivatives — Power, Product, Quotient, Chain Rule', date: '28 Feb 2025', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1mzFhhh4aFGi4DzRlfuH9OxDzLt-5YNey/view?usp=sharing' }] },
          { label: 'Differentiation Formulas, Chain Rule, Implicit Differentiation', date: '07 Mar 2025', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1lS0zqsHLSyHDxcb9bCdSiGiub50U018f/view?usp=sharing' }] },
          { label: 'Grand Tutorial: Before Midterm', date: '14 Mar 2025', links: [
            { tag: 'Continuity & Limits', href: 'https://drive.google.com/file/d/1BwhpZa-73jjj_yW9AyB78eaAZfDLxPhF/view?usp=sharing' },
            { tag: 'Related Rates', href: 'https://drive.google.com/file/d/1dRinct-AzRTdAM31-BW1FrsI5qoJWmVF/view?usp=sharing' },
          ] },
          { label: 'Linearization and Differentials, Derivatives of Inverse Trig Functions', date: '28 Mar 2025', links: [{ tag: 'Notes', href: 'https://drive.google.com/file/d/1RLoefbAcEhG3N-EFyuXYvhg26t2F1jek/view?usp=sharing' }] },
        ],
      },
    ],
  },
  {
    title: 'Videos (by Shoaib)',
    groups: [
      {
        rows: [
          { label: 'Limits and Continuity', links: [{ tag: 'Watch', href: 'https://youtu.be/r37rKcqzsX0' }] },
          { label: 'Derivatives', links: [{ tag: 'Watch', href: 'https://youtu.be/gDzLNgqFoAo' }] },
          { label: 'Linearization, Derivatives of Inverse Trig Functions', links: [{ tag: 'Watch', href: 'https://youtu.be/rIHRcD5Pi2A' }] },
        ],
      },
    ],
  },
  {
    title: 'Tutorials by Topic — All TAs',
    gridGroups: true,
    fullWidth: true,
    groups: [
      {
        subtitle: 'Functions and Limits',
        rows: [
          { label: '3 Feb (Abdullah) — Functions and Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1ZpVy9w8MyhsTEe2cuPNqrsPJ263wxMFb/view?usp=sharing' }] },
          { label: '12 Feb (Bilal) — Functions and Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1kRwEx4P8CKG6yCugZCtRqpY-0hOtYHWm/view?usp=sharing' }] },
        ],
      },
      {
        subtitle: 'Limits (One-Sided) + Squeeze Theorem',
        rows: [
          { label: '11 Feb (Ashbala) — Limits Evaluation', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/143-HJts7HDvDVzkh7XSJDWSU5dtdCY3s/view?usp=sharing' }] },
          { label: '12 Feb (Kousar) — Evaluation of Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1uHrBMgZCVbUbA9zX4FCg2iSFiQYiBM6g/view?usp=sharing' }] },
          { label: '13 Feb (Mikael) — Evaluation of Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1MWVZ472TR-SwIliQgK8i-gpfIcRzDRNB/view?usp=sharing' }] },
          { label: '14 Feb (Saleh) — Limits and One-Sided Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1tjdnZa0XOrSAj0HHJ0zRzdJlnvR8VvAU/view?usp=sharing' }] },
          { label: '15 Feb (Abdullah) — One-Sided Limits and Squeeze Theorem', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1WooVMZx9oE2L-IXzU7egw06DM2SnAG4q/view?usp=sharing' }] },
          { label: '17 Feb (Ashbala) — Trigonometric Limits', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1Z6hi3w2dsT-JIUnBHUKV40fRMQwATYgY/view?usp=sharing' }] },
        ],
      },
      {
        subtitle: 'Trigonometric Limits & Continuity',
        rows: [
          { label: '17 Feb (Ashbala) — Trigonometric Limits and Limits at Infinity', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1Z6hi3w2dsT-JIUnBHUKV40fRMQwATYgY/view?usp=sharing' }] },
          { label: '18 Feb (Bilal) — Limits at Infinity and Continuity', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1BC8zpiqshEeIfn48nFN_vgWlTZgX8HVG/view?usp=sharing' }] },
          { label: '19 Feb (Kousar) — Continuity', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1AeYSzIPYm-Zf0mGZ7pA6EKjhbLIriGJ3/view?usp=sharing' }] },
          { label: '20 Feb (Mikael) — Continuity and IVT', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1WH8q4XvJkCMQKWHVRw5gRdGAP7xl1ozZ/view?usp=sharing' }] },
        ],
      },
      {
        subtitle: 'Differentiability',
        rows: [
          { label: '24 Feb (Ashbala) — Basic Derivatives', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1rIGS-gqeeSz2MD6HuviTJ4hnJxMdTEls/view?usp=sharing' }] },
          { label: '26 Feb (Falak Parvaiz) — Basic Derivatives', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1rIGS-gqeeSz2MD6HuviTJ4hnJxMdTEls/view?usp=sharing' }] },
          { label: '27 Feb (Mikael) — Derivatives by Definition', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1x9NpqyDnyEgzkxi0Z4O-ENT7TWgkmWQt/view?usp=sharing' }] },
          { label: '05 Mar (Falak) — Implicit Differentiation', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1q-bfvDrRvUjBdECpIOHzNUrbUnWTSnGD/view?usp=sharing' }] },
          { label: '06 Mar (Mikael) — Chain Rule, Implicit Differentiation', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/18f2pDPEj88aE5GiqK34OxbJPIdinrH7k/view?usp=sharing' }] },
          { label: '06 Mar (Saleh) — Implicit Differentiation', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1hDqOPFQztLQI7xvX-8hd1F8Otn3e99-7/view?usp=sharing' }] },
        ],
      },
      {
        subtitle: 'Related Rates',
        rows: [
          { label: '13 Mar (Mikael) — Related Rates', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/1PA65VeURzNm-ZrdkEN7aQYmidM965kun/view?usp=sharing' }] },
        ],
      },
    ],
  },
  {
    title: 'Exams',
    gridGroups: true,
    fullWidth: true,
    groups: [
      {
        subtitle: 'Previous Midterms',
        rows: [
          { label: '2013', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2013Mid.pdf' }] },
          { label: '2014', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2014Mid.pdf' }] },
          { label: '2015', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2015Mid.pdf' }] },
          { label: '2016', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2016Mid.pdf' }] },
          { label: '2018', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2018Mid.pdf' }] },
        ],
      },
      {
        subtitle: 'Previous Finals',
        rows: [
          { label: '2012', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2012Final.pdf' }] },
          { label: '2013', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2013Final.pdf' }] },
          { label: '2014', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2014Final.pdf' }] },
          { label: '2016', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Cal1/2016Final.pdf' }] },
          { label: '2022', links: [{ tag: 'PDF', href: 'https://web.lums.edu.pk/~adnan.khan/classes/classes/Calculus%20I/2022Final.pdf' }] },
        ],
      },
      {
        subtitle: 'This Year (2025)',
        rows: [
          { label: 'Mock Exam', links: [{ tag: 'View', href: 'https://drive.google.com/file/d/15H0Pqy3jzizwEkwTbOnsg1j3-3Yd1Gbz/view?usp=sharing' }] },
        ],
      },
    ],
  },
];

export default function CalculusSp25Page() {
  return (
    <>
      <Navbar activePage="experience" />
      <CourseHero
        title="MATH-101 · Calculus"
        term="Spring 2025"
        instructors={INSTRUCTORS}
        tas={TAS}
        description={DESCRIPTION}
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
