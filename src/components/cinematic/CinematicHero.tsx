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
} from "react-icons/hi";
import { CountUp } from "./CountUp";
import { PhoneMock } from "./PhoneMock";

const headline = ["Trusted", "Gig", "Hiring."];
const accent = ["Verified", "Talent."];

const trust = [
  { icon: HiShieldCheck, label: "100% Verified" },
  { icon: HiLightningBolt, label: "Fast Onboarding" },
  { icon: HiBadgeCheck, label: "Trusted Platform" },
];

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const device = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    root.current?.style.setProperty("--mx", `${x}px`);
    root.current?.style.setProperty("--my", `${y}px`);
    device.current?.style.setProperty("--ry", `${(x / r.width - 0.5) * 12}deg`);
    device.current?.style.setProperty("--rx", `${(y / r.height - 0.5) * -8}deg`);
  };

  const onLeave = () => {
    device.current?.style.setProperty("--ry", "0deg");
    device.current?.style.setProperty("--rx", "0deg");
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 md:px-10 md:pt-32">
        {/* Copy */}
        <div className="cin-hero-exit mx-auto max-w-4xl text-center">
          <div className="cin-rise mb-7 flex flex-wrap items-center justify-center gap-2" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="cin-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#bfe0ff]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Verification-First Platform
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/60">
              <HiLocationMarker className="h-3.5 w-3.5" />
              Khandwa, MP · Since 2011
            </span>
          </div>

          <h1 className="mb-6 font-heading text-[2.6rem] font-bold leading-[1.05] tracking-tight [perspective:800px] sm:text-6xl lg:text-7xl xl:text-[4.4rem]">
            {headline.map((w, i) => (
              <span key={w} className="cin-word mr-[0.28em]" style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            ))}
            <br />
            {accent.map((w, i) => (
              <span key={w} className="cin-word mr-[0.28em] last:mr-0" style={{ "--i": headline.length + i } as React.CSSProperties}>
                <span className="cin-shimmer-text">{w}</span>
              </span>
            ))}
          </h1>

          <p className="cin-rise mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl" style={{ "--d": "700ms" } as React.CSSProperties}>
            We are building a secure, verification-first gig hiring ecosystem
            that connects qualified gig workers with trusted companies—quickly,
            transparently, and at scale.
          </p>

          <div className="cin-rise mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ "--d": "850ms" } as React.CSSProperties}>
            <Link
              href="/login"
              className="cin-btn-glow group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-8 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.7)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Get Started
              <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="cin-glass inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Contact Us
            </Link>
          </div>

          <div className="cin-rise flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/60" style={{ "--d": "1000ms" } as React.CSSProperties}>
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-[#7bb8e8]" />
                <span>{label}</span>
              </div>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">4.9/5</span> Trusted by verified workers &amp; companies
            </span>
          </div>
        </div>

        {/* Product */}
        <div className="relative mx-auto mt-10 h-[400px] max-w-5xl md:mt-8 md:h-[560px]">
          {/* orbit rings + glow */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/25 blur-[110px]" />
            <div className="cin-spin-slow absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 md:h-[720px] md:w-[720px]" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 md:h-[540px] md:w-[540px]" />
          </div>

          {/* floating chips */}
          <div className="cin-phone-in absolute left-0 top-24 z-20 hidden md:block lg:left-8" style={{ "--d": "1500ms" } as React.CSSProperties}>
            <div className="cin-glass cin-float rounded-2xl px-5 py-4">
              <div className="text-3xl font-bold">
                <CountUp to={2.4} decimals={1} suffix="×" />
              </div>
              <div className="text-xs font-medium text-white/60">Faster Hiring</div>
            </div>
          </div>
          <div className="cin-phone-in absolute right-0 top-40 z-20 hidden md:block lg:right-8" style={{ "--d": "1700ms" } as React.CSSProperties}>
            <div className="cin-glass cin-float flex items-center gap-3 rounded-2xl px-4 py-3" style={{ animationDelay: "-2.5s" }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20">
                <HiCheckCircle className="h-5 w-5 text-emerald-300" />
              </span>
              <span>
                <span className="block text-sm font-bold">Identity Verified</span>
                <span className="block text-xs text-white/55">100% complete</span>
              </span>
            </div>
          </div>

          {/* phone: intro -> scroll straighten -> mouse tilt */}
          <div className="cin-phone-in absolute inset-x-0 top-0 mx-auto" style={{ "--d": "700ms" } as React.CSSProperties}>
            <div className="cin-phone-scroll">
              <div ref={device} className="cin-tilt">
                <PhoneMock />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* fade the whole hero into the next section (full width, hides any seam) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-48 bg-gradient-to-b from-transparent to-[#060f1c]" />
    </section>
  );
}
