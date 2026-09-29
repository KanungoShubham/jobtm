"use client";

import { useEffect, useRef, useState } from "react";
import { HiBriefcase, HiTrendingUp, HiUsers, HiViewGridAdd } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WaveTop } from "./WaveTop";

const steps = [
  { icon: HiUsers, title: "Sign Up", description: "Create your free account in minutes with secure authentication" },
  { icon: HiViewGridAdd, title: "Complete Profile", description: "Add skills, experience, and preferences for smart matching" },
  { icon: HiBriefcase, title: "Browse & Apply", description: "Explore gigs or post jobs, then connect with the perfect match" },
  { icon: HiTrendingUp, title: "Work & Earn", description: "Complete projects, get paid, and build your reputation" },
];

const last = steps.length - 1;

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) setActive(last);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [inView, paused, reduced]);

  const pct = (active / last) * 100;

  return (
    <section
      ref={root}
      className="relative overflow-hidden py-20 md:py-24"
      style={{ background: "linear-gradient(180deg, #0f4c7c 0%, #0d1f35 100%)" }}
    >
      <WaveTop fill="#eaf1ff" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-32 top-10 h-96 w-96 bg-[#3b82f6]/25" />
        <div className="cin-aurora -right-32 bottom-0 h-96 w-96 bg-[#136BAB]/30" style={{ animationDelay: "-9s" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 md:px-10">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            <span className="cin-glass mb-5 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-[#bfe0ff]">
              Simple Process
            </span>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              How Jobstm Works
            </h2>
            <p className="text-lg text-white/65">
              Getting started is simple. Follow these four steps to begin your gig work journey.
            </p>
          </div>
        </ScrollReveal>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Desktop: horizontal track with a travelling light */}
          <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 md:block">
            <div className="absolute inset-0 rounded-full bg-white/15" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#7bb8e8] to-[#3b82f6] shadow-[0_0_14px_rgba(123,184,232,0.9)] transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
            <span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(123,184,232,0.8)] transition-[left] duration-700 ease-out"
              style={{ left: `${pct}%` }}
            />
          </div>

          {/* Mobile: vertical track */}
          <div aria-hidden className="absolute bottom-16 left-8 top-8 w-0.5 md:hidden">
            <div className="absolute inset-0 rounded-full bg-white/15" />
            <div
              className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[#7bb8e8] to-[#3b82f6] shadow-[0_0_14px_rgba(123,184,232,0.9)] transition-[height] duration-700 ease-out"
              style={{ height: `${pct}%` }}
            />
          </div>

          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li key={step.title}>
                  <ScrollReveal animation="fade-up" delay={i * 120}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive ? "step" : undefined}
                      className="flex w-full items-start gap-4 text-left md:flex-col md:items-center md:gap-0 md:text-center"
                    >
                      <span
                        className={cn(
                          "relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                          isActive &&
                            "scale-110 border-white/40 bg-gradient-to-br from-[#136BAB] to-[#3b82f6] shadow-[0_0_44px_-4px_rgba(59,130,246,0.95)]",
                          isDone && "border-[#7bb8e8]/50 bg-[#0f4c7c]",
                          !isActive && !isDone && "border-white/15 bg-[#0d1f35]"
                        )}
                      >
                        {isActive && (
                          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#3b82f6]/30" />
                        )}
                        <Icon className={cn("relative h-6 w-6 transition-colors duration-500", isActive || isDone ? "text-white" : "text-white/50")} />
                        <span
                          className={cn(
                            "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black transition-colors duration-500",
                            isActive || isDone
                              ? "border-white/40 bg-white text-[#0d4a7a]"
                              : "border-white/15 bg-[#0d1f35] text-white/60"
                          )}
                        >
                          {i + 1}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "cin-glass relative block flex-1 overflow-hidden rounded-2xl p-5 transition-all duration-500 md:mt-7 md:min-h-[9.5rem] md:w-full",
                          isActive ? "-translate-y-1 border-[#7bb8e8]/50 opacity-100" : "opacity-60"
                        )}
                        style={isActive ? { boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 40px -8px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.18)" } : undefined}
                      >
                        <span aria-hidden className="pointer-events-none absolute -right-1 -top-3 font-heading text-7xl font-black text-white/[0.06]">
                          0{i + 1}
                        </span>
                        <span className="relative block font-heading text-lg font-bold text-white">{step.title}</span>
                        <span className="relative mt-2 block text-sm leading-relaxed text-white/65">{step.description}</span>
                      </span>
                    </button>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
