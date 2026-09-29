"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  HiArrowRight,
  HiBadgeCheck,
  HiCheckCircle,
  HiClock,
  HiLightningBolt,
  HiShieldCheck,
  HiTrendingUp,
  HiViewGridAdd,
} from "react-icons/hi";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WaveTop } from "./WaveTop";

type IconType = React.ComponentType<{ className?: string }>;

const tabs = ["Gig Workers", "Businesses", "Verification"] as const;

const workers = {
  badge: "For Gig Workers",
  title: "Find Work That Fits Your Life",
  lead: "Take control of your career with flexible gig opportunities that match your skills and schedule.",
  features: [
    { icon: HiClock, title: "Flexible Schedule", desc: "Work when you want" },
    { icon: HiTrendingUp, title: "Grow Income", desc: "Multiple streams" },
    { icon: HiViewGridAdd, title: "Skill Matched", desc: "Right opportunities" },
    { icon: HiBadgeCheck, title: "Build Reputation", desc: "Ratings & reviews" },
  ] as { icon: IconType; title: string; desc: string }[],
  cta: { href: "/contact", label: "Start Working Today" },
  panel: {
    title: "Worker Dashboard",
    status: "Live",
    stats: [
      { val: "100%", label: "Verified" },
      { val: "48", label: "Matches" },
      { val: "4.9★", label: "Rating" },
    ],
    rows: [
      { icon: HiBadgeCheck, label: "Identity Verified", value: "✓ Complete" },
      { icon: HiClock, label: "Availability Set", value: "Weekdays" },
      { icon: HiViewGridAdd, label: "Skills Matched", value: "Smart AI" },
      { icon: HiTrendingUp, label: "Income Track", value: "Growing" },
    ] as { icon: IconType; label: string; value: string }[],
  },
};

const businesses = {
  badge: "For Businesses",
  title: "Hire Skilled Talent On-Demand",
  lead: "Scale your workforce instantly with qualified gig workers ready to deliver results.",
  features: [
    { icon: HiLightningBolt, title: "Fast Hiring", desc: "Connect in minutes" },
    { icon: HiShieldCheck, title: "Pre-Verified", desc: "Background checked" },
    { icon: HiTrendingUp, title: "Cost-Effective", desc: "Pay per work" },
    { icon: HiViewGridAdd, title: "Quality Tracked", desc: "Ratings & reviews" },
  ] as { icon: IconType; title: string; desc: string }[],
  cta: { href: "/contact", label: "Post Your First Job" },
  panel: {
    title: "Hiring Dashboard",
    status: "Active",
    stats: [
      { val: "12", label: "Hired" },
      { val: "3min", label: "Avg. Match" },
      { val: "0", label: "Fraud Cases" },
    ],
    rows: [
      { icon: HiLightningBolt, label: "Onboarding Speed", value: "Minutes" },
      { icon: HiShieldCheck, label: "Background Checked", value: "All Workers" },
      { icon: HiTrendingUp, label: "Cost Efficiency", value: "High" },
      { icon: HiBadgeCheck, label: "Quality Rating", value: "Tracked" },
    ] as { icon: IconType; label: string; value: string }[],
  },
};

const verification = [
  {
    audience: "Gig Workers",
    verify: ["Identity", "Education", "Availability"],
    why: ["Genuine profiles only", "Faster shortlisting for companies", "Higher trust for hiring companies"],
    tag: "Ready-to-hire, verified talent from day one.",
  },
  {
    audience: "Companies",
    verify: ["Identity", "Contact", "Auth Rep"],
    why: ["Safe hiring environment", "Trusted job postings", "Better engagement from gig workers"],
    tag: null as string | null,
  },
];

function FeaturePanel({ data }: { data: typeof workers }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <span className="mb-5 inline-flex items-center rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-4 py-1.5 text-xs font-semibold text-white">
          {data.badge}
        </span>
        <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{data.title}</h2>
        <p className="mb-7 max-w-lg text-lg text-muted-foreground">{data.lead}</p>
        <div className="mb-8 grid grid-cols-2 gap-3">
          {data.features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="cin-card cin-glow-border flex flex-col gap-2.5 rounded-2xl border border-secondary/10 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
                <Icon className="h-[18px] w-[18px] text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href={data.cta.href}
          className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-7 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.7)] transition-transform hover:-translate-y-0.5"
        >
          {data.cta.label}
          <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="cin-card overflow-hidden rounded-3xl border border-secondary/15 bg-white">
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#0d1f35] to-[#136BAB] px-6 py-4 text-white">
          <div>
            <p className="text-xs font-medium text-white/60">Jobstm</p>
            <p className="text-sm font-bold">{data.panel.title}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {data.panel.status}
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
          {data.panel.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-4">
              <span className="text-lg font-bold text-secondary">{s.val}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2.5 p-5">
          {data.panel.rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-secondary/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10">
                  <Icon className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <span className="text-xs font-bold text-secondary">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerificationPanel() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <div>
        <span className="mb-5 inline-flex items-center rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-4 py-1.5 text-xs font-semibold text-white">
          Verification Process
        </span>
        <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Verification-First Onboarding</h2>
        <p className="mb-7 max-w-lg text-lg text-muted-foreground">
          Our platform is designed to meet modern hiring standards, combining technology, compliance, and ease of use.
        </p>
        <div className="rounded-3xl bg-gradient-to-br from-[#0d1f35] to-[#136BAB] p-6 text-white shadow-[0_30px_60px_-24px_rgba(19,107,171,0.7)]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <HiBadgeCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="mb-1 font-heading font-bold">Platform Promise</h4>
              <p className="text-sm text-white/75">
                Only verified users on both sides. Every hire is backed by real identity and document checks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {verification.map((col) => (
          <div key={col.audience} className="cin-card cin-glow-border rounded-3xl border border-secondary/10 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary/60">For</p>
            <h3 className="mb-4 font-heading text-xl font-bold">{col.audience}</h3>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary/50">What We Verify</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {col.verify.map((v) => (
                <span key={v} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                  {v}
                </span>
              ))}
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary/50">Why It Matters</p>
            <ul className="space-y-2">
              {col.why.map((w) => (
                <li key={w} className="flex items-start gap-2 text-sm text-foreground/75">
                  <HiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                  {w}
                </li>
              ))}
            </ul>
            {col.tag && (
              <p className="mt-5 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-white">{col.tag}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExploreTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const panels = [<FeaturePanel key="w" data={workers} />, <FeaturePanel key="b" data={businesses} />, <VerificationPanel key="v" />];

  return (
    <section className="relative overflow-hidden py-20 md:py-24" style={{ background: "linear-gradient(180deg, #ffffff 0%, #eaf1ff 100%)" }}>
      <WaveTop fill="#060f1c" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-10 h-[380px] w-[380px] rounded-full bg-[#136BAB]/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 md:px-10">
        <ScrollReveal animation="fade-up">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-secondary/70">
            Explore Jobstm
          </p>
          <div
            role="tablist"
            aria-label="Explore Jobstm"
            className="relative mx-auto mb-12 grid max-w-md grid-cols-3 rounded-full border border-secondary/15 bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(19,107,171,0.45)] md:mb-16"
          >
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/3)] rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] shadow-[0_8px_24px_-6px_rgba(59,130,246,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
            {tabs.map((t, i) => (
              <button
                key={t}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                role="tab"
                id={`explore-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`explore-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative z-10 min-h-[44px] rounded-full px-2 text-xs font-semibold transition-colors duration-300 sm:text-sm",
                  active === i ? "text-white" : "text-foreground/60 hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* All panels share one grid cell so the section height never jumps between tabs */}
        <div className="grid">
          {panels.map((panel, i) => (
            <div
              key={tabs[i]}
              role="tabpanel"
              id={`explore-panel-${i}`}
              aria-labelledby={`explore-tab-${i}`}
              aria-hidden={active !== i}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-500 ease-out",
                active === i ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-4 opacity-0"
              )}
            >
              {panel}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
