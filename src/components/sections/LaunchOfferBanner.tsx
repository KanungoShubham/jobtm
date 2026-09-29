"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiLightningBolt, HiBriefcase, HiUsers, HiOfficeBuilding, HiArrowRight, HiFire } from "react-icons/hi";
import { publicApi } from "@/lib/api";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/cinematic/CountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Stats = Awaited<ReturnType<typeof publicApi.getStats>>["data"];

const R = 118;
const CIRC = 2 * Math.PI * R;

function Gauge({ remaining, limit }: { remaining: number; limit: number }) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const frac = limit > 0 ? Math.min(1, Math.max(0, remaining / limit)) : 0;

  return (
    <div ref={elementRef} className="relative mx-auto aspect-square w-full max-w-[320px]">
      <div aria-hidden className="absolute inset-6 rounded-full bg-[#3b82f6]/25 blur-3xl" />
      <svg viewBox="0 0 300 300" className="relative h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="cin-gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#136BAB" />
            <stop offset="100%" stopColor="#9fd0ff" />
          </linearGradient>
        </defs>
        {/* slowly rotating tick ring */}
        <g className="cin-spin-slow" style={{ transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="144" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="1.5 9" strokeLinecap="round" />
        </g>
        {/* track */}
        <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        {/* progress: spots left */}
        <circle
          cx="150"
          cy="150"
          r={R}
          fill="none"
          stroke="url(#cin-gauge-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={isVisible ? CIRC * (1 - frac) : CIRC}
          transform="rotate(-90 150 150)"
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.2,0.7,0.2,1)", filter: "drop-shadow(0 0 10px rgba(123,184,232,0.8))" }}
        />
        <circle cx="150" cy="150" r="98" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-100">
          <HiFire className="h-3.5 w-3.5 animate-pulse text-sky-200" />
          Limited Time
        </span>
        <div className="text-6xl font-black leading-none tabular-nums">
          <CountUp to={remaining} duration={2000} />
        </div>
        <div className="mt-2 text-xs font-medium text-white/70">spots left of {limit.toLocaleString()}</div>
      </div>
    </div>
  );
}

export function LaunchOfferBanner() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    publicApi.getStats().then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const offer = stats?.launch_offer.is_active ? stats.launch_offer : null;

  const tiles = [
    { value: stats?.total_jobs, label: "Active Jobs", icon: HiBriefcase, from: "#136BAB", to: "#3b82f6" },
    { value: stats?.total_jobseekers, label: "Registered", icon: HiUsers, from: "#0f5a94", to: "#5b9bd5" },
    { value: stats?.total_companies, label: "Companies", icon: HiOfficeBuilding, from: "#0d4a7a", to: "#7bb8e8" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#060f1c] py-16 text-white md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-40 top-0 h-[440px] w-[440px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 bottom-0 h-[440px] w-[440px] bg-[#0f4c7c]/40" style={{ animationDelay: "-8s" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
        <ScrollReveal animation="fade-up">
          <p className="mb-10 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0ff] md:mb-14">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on Jobstm right now
          </p>
        </ScrollReveal>

        <div className={offer ? "grid items-center gap-12 lg:grid-cols-[340px_1fr] lg:gap-20" : "mx-auto max-w-3xl"}>
          {offer && (
            <ScrollReveal animation="fade-up">
              <Gauge remaining={offer.remaining} limit={offer.registration_limit} />
            </ScrollReveal>
          )}

          <ScrollReveal animation="fade-up" delay={120}>
            <div>
              {offer && (
                <>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-400/15">
                      <HiLightningBolt className="h-5 w-5 text-sky-300" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                      Launch Offer — Limited Free Spots!
                    </h2>
                  </div>
                  <p className="mb-7 text-white/65 md:ml-[3.25rem]">
                    First {offer.registration_limit.toLocaleString()} users get unlimited free applications
                  </p>
                </>
              )}

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {tiles.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="cin-glass cin-glass-hover cin-shine rounded-2xl px-3 py-5 text-center md:py-6"
                      style={{ "--sd": `${i * 0.9}s` } as React.CSSProperties}
                    >
                      <div
                        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})`, boxShadow: `0 0 24px -2px ${s.to}` }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-3xl font-bold tabular-nums md:text-4xl">
                        {typeof s.value === "number" ? (
                          <CountUp to={s.value} />
                        ) : (
                          <span className="inline-block h-8 w-9 animate-pulse rounded bg-white/10 align-middle" />
                        )}
                      </div>
                      <div className="mt-1 text-[11px] font-medium uppercase tracking-widest text-white/55">{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {offer && (
                <>
                  <div className="mb-2 mt-7 flex items-center justify-between text-xs font-medium">
                    <span className="text-white/60">{offer.registered.toLocaleString()} already registered</span>
                    <span className="font-bold text-sky-300">{offer.fill_pct}% filled</span>
                  </div>
                  <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="cin-progress-fill h-full rounded-full shadow-[0_0_16px_rgba(59,130,246,0.7)]"
                      style={{ width: `${Math.max(3, offer.fill_pct)}%` }}
                    />
                  </div>
                  <Link
                    href="/jobseeker/register"
                    className="cin-btn-glow group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-8 text-sm font-bold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
                  >
                    Get Started — It&apos;s Free
                    <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
