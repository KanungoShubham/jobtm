"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  HiArrowRight,
  HiBadgeCheck,
  HiCheckCircle,
  HiLightningBolt,
  HiLocationMarker,
  HiShieldCheck,
  HiUsers,
} from "react-icons/hi";
import { CountUp } from "./CountUp";
import { Marquee } from "./Marquee";

const headline = ["Trusted", "Gig", "Hiring."];
const accent = ["Verified", "Talent."];

const ledger = [
  { label: "Identity Verified", pct: 100, done: true },
  { label: "Skills Profile", pct: 87, done: false },
  { label: "Document Check", pct: 100, done: true },
  { label: "Company Match", pct: 72, done: false },
];

const trust = [
  { icon: HiShieldCheck, label: "100% Verified" },
  { icon: HiLightningBolt, label: "Fast Onboarding" },
  { icon: HiBadgeCheck, label: "Trusted Platform" },
];

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    root.current?.style.setProperty("--mx", `${x}px`);
    root.current?.style.setProperty("--my", `${y}px`);
    const nx = x / r.width - 0.5;
    const ny = y / r.height - 0.5;
    card.current?.style.setProperty("--ry", `${nx * 14}deg`);
    card.current?.style.setProperty("--rx", `${ny * -12}deg`);
  };

  const onLeave = () => {
    card.current?.style.setProperty("--ry", "0deg");
    card.current?.style.setProperty("--rx", "0deg");
  };

  return (
    <section
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="cin-hero relative overflow-hidden text-white"
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-32 -top-32 h-[520px] w-[520px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 top-1/4 h-[560px] w-[560px] bg-[#3b82f6]/18" style={{ animationDelay: "-6s" }} />
        <div className="cin-aurora bottom-[-200px] left-1/3 h-[480px] w-[480px] bg-[#0f4c7c]/40" style={{ animationDelay: "-11s" }} />
        <div className="cin-spotlight absolute inset-0" />
        <div className="cin-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-32 md:px-10 md:pt-40 lg:pb-14">
        <div className="cin-hero-exit grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left */}
          <div>
            <div className="cin-rise mb-7 flex flex-wrap items-center gap-2" style={{ "--d": "0ms" } as React.CSSProperties}>
              <span className="cin-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#bfe0ff]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Verification-First Platform
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/60">
                <HiLocationMarker className="h-3.5 w-3.5" />
                Khandwa, MP · Since 2011
              </span>
            </div>

            <h1 className="mb-7 font-heading text-[2.6rem] font-bold leading-[1.06] tracking-tight [perspective:800px] sm:text-6xl xl:text-[4.1rem]">
              {headline.map((w, i) => (
                <span key={w} className="cin-word mr-[0.28em]" style={{ "--i": i } as React.CSSProperties}>
                  {w}
                </span>
              ))}
              <br />
              {accent.map((w, i) => (
                <span
                  key={w}
                  className="cin-word mr-[0.28em]"
                  style={{ "--i": headline.length + i } as React.CSSProperties}
                >
                  <span className="cin-shimmer-text">{w}</span>
                </span>
              ))}
            </h1>

            <p className="cin-rise mb-10 max-w-lg text-lg leading-relaxed text-white/65" style={{ "--d": "700ms" } as React.CSSProperties}>
              We are building a secure, verification-first gig hiring ecosystem
              that connects qualified gig workers with trusted companies—quickly,
              transparently, and at scale.
            </p>

            <div className="cin-rise mb-10 flex flex-col gap-3 sm:flex-row" style={{ "--d": "850ms" } as React.CSSProperties}>
              <Link
                href="/login"
                className="cin-btn-glow group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-8 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.7)] transition-transform hover:-translate-y-0.5"
              >
                Get Started
                <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="cin-glass inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>

            <div className="cin-rise flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60" style={{ "--d": "1000ms" } as React.CSSProperties}>
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-[#7bb8e8]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="cin-rise mt-7 flex items-center gap-3" style={{ "--d": "1150ms" } as React.CSSProperties}>
              <div className="flex -space-x-2.5">
                {["#136BAB", "#0f5a94", "#3b82f6", "#1e3a5f"].map((c, i) => (
                  <div
                    key={c}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0d1f35] text-xs font-bold text-white"
                    style={{ backgroundColor: c, zIndex: 4 - i }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiBadgeCheck key={i} className="h-3.5 w-3.5 text-[#7bb8e8]" />
                  ))}
                  <span className="ml-1 text-xs font-bold">4.9/5</span>
                </div>
                <p className="text-xs text-white/50">Trusted by verified workers &amp; companies</p>
              </div>
            </div>
          </div>

          {/* Right: 3D tilt card */}
          <div className="cin-rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ "--d": "500ms" } as React.CSSProperties}>
            <div ref={card} className="cin-tilt relative">
              <div className="cin-glass relative rounded-3xl p-6 md:p-7">
                <div className="absolute -top-3 left-6 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-3 py-1 text-[11px] font-bold shadow-lg">
                  <HiBadgeCheck className="h-3.5 w-3.5" />
                  Verified Platform
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-[#7bb8e8]/70">Live Status</p>
                    <h3 className="font-heading text-lg font-bold">Verification Dashboard</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
                <div className="space-y-4">
                  {ledger.map((item, i) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                          item.done ? "bg-gradient-to-br from-[#136BAB] to-[#3b82f6] shadow-[0_0_20px_-2px_rgba(59,130,246,0.8)]" : "bg-white/10"
                        }`}
                      >
                        <HiCheckCircle className={`h-4 w-4 ${item.done ? "text-white" : "text-white/40"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-medium text-white/85">{item.label}</span>
                          <span className="text-xs font-bold text-[#9fd0ff]">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="cin-bar h-full rounded-full bg-gradient-to-r from-[#136BAB] to-[#7bb8e8]"
                            style={{ width: `${item.pct}%`, "--d": `${700 + i * 150}ms` } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating chips (parallax depth) */}
              <div
                className="cin-glass cin-float absolute left-0 top-full z-20 -mt-4 hidden rounded-2xl px-5 py-4 sm:block lg:-left-8"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="text-3xl font-bold">
                  <CountUp to={2.4} decimals={1} suffix="×" />
                </div>
                <div className="text-xs font-medium text-white/60">Faster Hiring</div>
              </div>

              <div
                className="cin-glass cin-float absolute -right-2 -top-10 z-20 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex lg:-right-6"
                style={{ transform: "translateZ(50px)", animationDelay: "-2s" }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/20">
                  <HiCheckCircle className="h-4 w-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-bold">Profile Verified!</p>
                  <p className="text-xs text-white/50">Just now</p>
                </div>
              </div>

              <div
                className="cin-glass cin-float absolute right-4 top-full z-20 -mt-4 hidden rounded-2xl px-4 py-3 lg:block"
                style={{ transform: "translateZ(30px)", animationDelay: "-3.5s" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <HiUsers className="h-4 w-4 text-[#7bb8e8]" />
                  <span className="text-xs font-bold">Matches Found</span>
                </div>
                <div className="text-2xl font-bold text-[#9fd0ff]">
                  <CountUp to={48} />
                </div>
                <div className="text-xs text-white/50">Verified companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-14 md:pb-16">
        <Marquee
          items={[
            "Verified Profiles",
            "Zero Duplicate Records",
            "Fast Onboarding",
            "Secure Document Gateway",
            "Trusted Companies",
            "Gig Workers & Students",
          ]}
        />
      </div>
    </section>
  );
}
