'use client';
import type { CSSProperties, ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';

interface AuthShellProps {
  heading: ReactNode;
  body: string;
  bullets: { icon: ComponentType<{ className?: string }>; label: string }[];
  /** Let the form panel scroll (long register forms). */
  scroll?: boolean;
  children: ReactNode;
}

/** Cinematic sign-in / register frame: dark animated scene, brand panel on the left, light form panel on the right. */
export function AuthShell({ heading, body, bullets, scroll, children }: AuthShellProps) {
  return (
    <div
      className="cin-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-8 pt-24 text-white"
      style={{ '--intro': '0ms' } as CSSProperties}
    >
      <Header />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-32 -top-32 h-[520px] w-[520px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 top-1/3 h-[520px] w-[520px] bg-[#3b82f6]/18" style={{ animationDelay: '-6s' }} />
        <div className="cin-aurora bottom-[-200px] left-1/3 h-[440px] w-[440px] bg-[#0f4c7c]/40" style={{ animationDelay: '-11s' }} />
        <div className="cin-grain absolute inset-0" />
      </div>

      <div
        className={cn(
          'cin-rise relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)] lg:grid-cols-2',
          scroll && 'lg:h-[min(46rem,calc(100vh-7.5rem))]'
        )}
        style={{ '--d': '0ms' } as CSSProperties}
      >
        {/* Left: brand */}
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
          style={{ background: 'linear-gradient(150deg, #136BAB 0%, #0d4a7a 55%, #0d1f35 100%)' }}
        >
          <div aria-hidden className="cin-aurora -right-16 -top-16 h-64 w-64 bg-white/15" />
          <div aria-hidden className="cin-aurora -bottom-20 -left-10 h-56 w-56 bg-[#3b82f6]/30" style={{ animationDelay: '-5s' }} />
          <div className="relative z-10">
            <Link href="/" className="mb-10 flex w-fit items-center gap-2.5 transition-opacity hover:opacity-85">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/15">
                <Image src="/assets/logo-white.png" alt="jobstm" width={32} height={32} className="rounded-lg" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">jobstm</span>
            </Link>
            <h2 className="mb-4 font-heading text-3xl font-bold leading-tight">{heading}</h2>
            <p className="max-w-xs text-sm text-white/70">{body}</p>
          </div>
          <ul className="relative z-10 mt-10 space-y-3">
            {bullets.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className="cin-item-in flex items-center gap-3 text-sm text-white/85"
                style={{ '--d': `${300 + i * 150}ms` } as CSSProperties}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <div className={cn('bg-white p-8 text-slate-900 sm:p-10', scroll && 'cin-scroll lg:overflow-y-auto')}>{children}</div>
      </div>
    </div>
  );
}
