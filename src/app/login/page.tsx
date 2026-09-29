'use client';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { HiOfficeBuilding, HiUser, HiSpeakerphone, HiArrowLeft, HiArrowRight, HiShieldCheck, HiBadgeCheck } from 'react-icons/hi';

const OPTIONS = [
  {
    href: '/employer/login',
    label: 'Employer',
    desc: 'Post jobs and manage your hiring pipeline',
    icon: HiOfficeBuilding,
    from: '#0d4a7a',
    to: '#3b82f6',
  },
  {
    href: '/jobseeker/login',
    label: 'Job Seeker',
    desc: 'Find jobs and build your career profile',
    icon: HiUser,
    from: '#136BAB',
    to: '#5b9bd5',
  },
  {
    href: '/advertiser/login',
    label: 'Ad Center',
    desc: 'Run banner ads and reach real users',
    icon: HiSpeakerphone,
    from: '#0f5a94',
    to: '#7bb8e8',
  },
];

const headline = ['Welcome'];
const accent = ['back.'];

function spotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--px', `${e.clientX - r.left}px`);
  el.style.setProperty('--py', `${e.clientY - r.top}px`);
}

export default function LoginChooserPage() {
  return (
    <div
      className="cin-hero relative flex min-h-screen items-center overflow-hidden text-white"
      style={{ '--intro': '0ms' } as CSSProperties}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-32 -top-32 h-[520px] w-[520px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 top-1/3 h-[520px] w-[520px] bg-[#3b82f6]/18" style={{ animationDelay: '-6s' }} />
        <div className="cin-aurora bottom-[-200px] left-1/3 h-[440px] w-[440px] bg-[#0f4c7c]/40" style={{ animationDelay: '-11s' }} />
        <div className="cin-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-32 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Left: message */}
        <div>
          <Link
            href="/"
            className="cin-rise mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition-colors hover:text-white"
            style={{ '--d': '0ms' } as CSSProperties}
          >
            <HiArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>

          <h1 className="mb-5 font-heading text-5xl font-bold leading-[1.05] tracking-tight [perspective:800px] sm:text-6xl lg:text-7xl">
            <span className="cin-word mr-[0.28em]" style={{ '--i': 0 } as CSSProperties}>{headline[0]}</span>
            <br />
            <span className="cin-word" style={{ '--i': 1 } as CSSProperties}>
              <span className="cin-shimmer-text">{accent[0]}</span>
            </span>
          </h1>

          <p className="cin-rise mb-8 max-w-md text-lg text-white/65" style={{ '--d': '500ms' } as CSSProperties}>
            Sign In — choose your account type to continue
          </p>

          <ul className="cin-rise space-y-3 text-sm text-white/60" style={{ '--d': '700ms' } as CSSProperties}>
            <li className="flex items-center gap-2.5">
              <HiShieldCheck className="h-4 w-4 text-[#7bb8e8]" /> Verification-first platform
            </li>
            <li className="flex items-center gap-2.5">
              <HiBadgeCheck className="h-4 w-4 text-[#7bb8e8]" /> Trusted by verified workers &amp; companies
            </li>
          </ul>
        </div>

        {/* Right: account cards */}
        <div className="space-y-4">
          {OPTIONS.map((o, i) => (
            <Link
              key={o.href}
              href={o.href}
              onPointerMove={spotlight}
              className="cin-rise cin-glass cin-glass-hover group relative flex items-center gap-5 overflow-hidden rounded-3xl p-5 md:p-6"
              style={{ '--d': `${300 + i * 150}ms` } as CSSProperties}
            >
              {/* cursor-following light */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'radial-gradient(260px circle at var(--px, 50%) var(--py, 50%), rgba(123,184,232,0.22), transparent 60%)' }}
              />
              <span
                className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${o.from}, ${o.to})`, boxShadow: `0 0 30px -4px ${o.to}` }}
              >
                <o.icon className="h-7 w-7 text-white" />
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block font-heading text-lg font-bold">{o.label}</span>
                <span className="block text-sm text-white/60">{o.desc}</span>
              </span>
              <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-[#7bb8e8] group-hover:bg-[#136BAB]">
                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
