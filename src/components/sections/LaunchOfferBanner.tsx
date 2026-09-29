"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiLightningBolt, HiBriefcase, HiUsers, HiOfficeBuilding, HiArrowRight, HiFire } from "react-icons/hi";
import { publicApi } from "@/lib/api";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/cinematic/CountUp";

type Stats = Awaited<ReturnType<typeof publicApi.getStats>>["data"];

export function LaunchOfferBanner() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    publicApi.getStats().then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const tiles = [
    { value: stats?.total_jobs, label: "Active Jobs", icon: HiBriefcase, glow: "#3b82f6", from: "#136BAB", to: "#3b82f6" },
    { value: stats?.total_jobseekers, label: "Registered", icon: HiUsers, glow: "#5b9bd5", from: "#0f5a94", to: "#5b9bd5" },
    { value: stats?.total_companies, label: "Companies", icon: HiOfficeBuilding, glow: "#7bb8e8", from: "#0d4a7a", to: "#7bb8e8" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#060f1c] py-16 text-white md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-40 top-0 h-[440px] w-[440px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 bottom-0 h-[440px] w-[440px] bg-[#136BAB]/25" style={{ animationDelay: "-8s" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-10">
        {/* Live stat tiles */}
        <ScrollReveal animation="fade-up">
          <p className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0ff]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on Jobstm right now
          </p>
          <div className="mb-8 grid grid-cols-3 gap-3 md:gap-5">
            {tiles.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="cin-glass cin-glass-hover cin-shine group rounded-3xl px-3 py-6 text-center md:py-8"
                  style={{ "--sd": `${i * 0.9}s` } as React.CSSProperties}
                >
                  <div
                    className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12"
                    style={{
                      background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                      boxShadow: `0 0 28px -2px ${s.glow}`,
                    }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-4xl font-bold tabular-nums md:text-5xl">
                    {typeof s.value === "number" ? (
                      <CountUp to={s.value} />
                    ) : (
                      <span className="inline-block h-9 w-10 animate-pulse rounded bg-white/10 align-middle" />
                    )}
                  </div>
                  <div className="mt-1.5 text-xs font-medium uppercase tracking-widest text-white/55">{s.label}</div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Launch offer card with rotating gradient border */}
        {stats?.launch_offer.is_active && (
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="cin-conic rounded-[1.75rem] p-[1.5px] shadow-[0_40px_90px_-30px_rgba(59,130,246,0.4)]">
              <div className="grid overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[#0a1a2d] sm:grid-cols-[15rem_1fr]">
                {/* Left: big number */}
                <div
                  className="cin-shine relative flex flex-col items-center justify-center px-6 py-10 text-center"
                  style={{ background: "linear-gradient(160deg, #136BAB, #0f4c7c 60%, #0d1f35)" }}
                >
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                    <HiFire className="h-3.5 w-3.5 animate-pulse text-sky-200" />
                    Limited Time
                  </span>
                  <div className="text-6xl font-black leading-none tabular-nums">
                    <CountUp to={stats.launch_offer.remaining} duration={2000} />
                  </div>
                  <div className="mt-3 text-xs font-medium text-white/80">
                    spots left of {stats.launch_offer.registration_limit.toLocaleString()}
                  </div>
                </div>

                {/* Right: details */}
                <div className="p-6 sm:p-9">
                  <div className="mb-1 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-400/15">
                      <HiLightningBolt className="h-5 w-5 text-sky-300" />
                    </div>
                    <p className="font-heading text-lg font-bold md:text-xl">Launch Offer — Limited Free Spots!</p>
                  </div>
                  <p className="mb-6 ml-[3.25rem] text-sm text-white/60">
                    First {stats.launch_offer.registration_limit.toLocaleString()} users get unlimited free applications
                  </p>

                  <div className="mb-2 flex items-center justify-between text-xs font-medium">
                    <span className="text-white/60">{stats.launch_offer.registered.toLocaleString()} already registered</span>
                    <span className="font-bold text-sky-300">{stats.launch_offer.fill_pct}% filled</span>
                  </div>
                  <div className="mb-7 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="cin-progress-fill h-full rounded-full shadow-[0_0_18px_rgba(59,130,246,0.7)]"
                      style={{ width: `${Math.max(3, stats.launch_offer.fill_pct)}%` }}
                    />
                  </div>

                  <Link
                    href="/jobseeker/register"
                    className="cin-btn-glow group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-8 text-sm font-bold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
                  >
                    Get Started — It&apos;s Free
                    <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
