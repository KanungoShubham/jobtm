"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiLightningBolt, HiBriefcase, HiUsers, HiOfficeBuilding, HiArrowRight, HiFire } from "react-icons/hi";
import { publicApi } from "@/lib/api";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type Stats = Awaited<ReturnType<typeof publicApi.getStats>>["data"];

export function LaunchOfferBanner() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    publicApi.getStats().then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white border-b border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Stat tiles */}
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: stats?.total_jobs, label: "Active Jobs", icon: HiBriefcase },
                { value: stats?.total_jobseekers, label: "Registered", icon: HiUsers },
                { value: stats?.total_companies, label: "Companies", icon: HiOfficeBuilding },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-3xl bg-secondary/5 border border-secondary/10 py-6 px-3 text-center hover:-translate-y-1 hover:shadow-warm-lg hover:bg-white hover:border-secondary/20 transition-all duration-300 group">
                    <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                      <Icon className="h-4.5 w-4.5 text-secondary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      {s.value ?? <span className="inline-block w-8 h-7 rounded bg-secondary/10 animate-pulse" />}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Launch offer card — split layout, big number on the left */}
          {stats?.launch_offer.is_active && (
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="rounded-3xl shadow-warm-lg overflow-hidden grid sm:grid-cols-[13rem_1fr]" style={{ border: "1px solid #A7F3D0" }}>
                {/* Left: big number panel */}
                <div className="relative flex flex-col items-center justify-center text-center px-6 py-8 overflow-hidden" style={{ background: "linear-gradient(160deg, #059669, #047857)" }}>
                  <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl bg-white/10" />
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white mb-3">
                    <HiFire className="h-3 w-3" />
                    Limited Time
                  </span>
                  <div className="text-5xl font-black text-white leading-none">{stats.launch_offer.remaining.toLocaleString()}</div>
                  <div className="text-xs text-white/80 font-medium mt-2">spots left of {stats.launch_offer.registration_limit.toLocaleString()}</div>
                </div>

                {/* Right: details */}
                <div className="p-6 sm:p-7 bg-white">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#D1FAE5" }}>
                      <HiLightningBolt className="h-4.5 w-4.5" style={{ color: "#059669" }} />
                    </div>
                    <p className="font-heading font-bold text-lg text-foreground">
                      Launch Offer — Limited Free Spots!
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 ml-12">
                    First {stats.launch_offer.registration_limit.toLocaleString()} users get unlimited free applications
                  </p>

                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-muted-foreground">{stats.launch_offer.registered.toLocaleString()} already registered</span>
                    <span style={{ color: "#059669" }} className="font-bold">{stats.launch_offer.fill_pct}% filled</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary/5 overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(2, stats.launch_offer.fill_pct)}%`, background: "linear-gradient(90deg, #10B981, #059669)" }}
                    />
                  </div>

                  <Link
                    href="/jobseeker/register"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex rounded-2xl px-6 py-3 font-bold text-white shadow-warm hover-lift transition"
                    style={{ backgroundColor: "#0EA5E9" }}
                  >
                    Get Started — It&apos;s Free
                    <HiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
