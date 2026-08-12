import Link from "next/link";
import {
  HiClock,
  HiTrendingUp,
  HiViewGridAdd,
  HiBadgeCheck,
  HiUsers,
  HiLightningBolt,
  HiShieldCheck,
  HiBriefcase,
  HiCheckCircle,
  HiLocationMarker,
  HiDatabase,
  HiDocumentText,
  HiLockClosed,
  HiArrowRight,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LaunchOfferBanner } from "@/components/sections/LaunchOfferBanner";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-to-br from-secondary/8 via-background to-primary/5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/3 right-0 w-[600px] h-[600px] bg-secondary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left: Content */}
            <div className="animate-fade-in-up">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 text-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                  Verification-First Platform
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 text-muted-foreground px-4 py-1.5 text-xs font-medium">
                  <HiLocationMarker className="h-3.5 w-3.5" />
                  Khandwa, MP · Since 2011
                </span>
              </div>
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6 leading-[1.08]">
                Trusted Gig Hiring.{" "}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Verified Talent.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
                We are building a secure, verification-first gig hiring ecosystem
                that connects qualified gig workers with trusted companies—quickly,
                transparently, and at scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/auth" className="group">
                  <Button size="lg" className="w-full sm:w-auto rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-warm-lg hover-lift px-8">
                    Get Started
                    <HiArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto rounded-full text-foreground hover:bg-secondary/5 hover-lift px-8">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                {[
                  { icon: HiShieldCheck, label: "100% Verified" },
                  { icon: HiLightningBolt, label: "Fast Onboarding" },
                  { icon: HiBadgeCheck, label: "Trusted Platform" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-secondary" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Social proof — avatar stack + rating */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {["#136BAB", "#7c3aed", "#1a8c6e", "#dc6b19"].map((c, i) => (
                    <div key={c} className="h-9 w-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: c, zIndex: 4 - i }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiBadgeCheck key={i} className="h-3.5 w-3.5 text-secondary" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-foreground">4.9/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by verified workers &amp; companies</p>
                </div>
              </div>
            </div>

            {/* Right: Floating UI Mockup */}
            <div className="relative animate-fade-in-up animate-delay-200 hidden lg:block">
              {/* Main verification card */}
              <div className="rounded-3xl border border-border/60 bg-white shadow-warm-lg p-6 relative z-10 hover-tilt" style={{ transform: "rotate(-1deg)" }}>
                {/* Verified ribbon */}
                <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-secondary text-white px-3 py-1 text-[11px] font-bold shadow-warm z-20">
                  <HiBadgeCheck className="h-3.5 w-3.5" />
                  Verified Platform
                </div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary/50 mb-0.5">Live Status</p>
                    <h3 className="font-heading text-base font-bold">Verification Dashboard</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-600 px-3 py-1 text-xs font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Identity Verified", pct: 100, done: true },
                    { label: "Skills Profile", pct: 87, done: false },
                    { label: "Document Check", pct: 100, done: true },
                    { label: "Company Match", pct: 72, done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`h-7 w-7 rounded-xl flex items-center justify-center flex-shrink-0 ${item.done ? "bg-secondary text-white" : "bg-secondary/10"}`}>
                        <HiCheckCircle className={`h-4 w-4 ${item.done ? "text-white" : "text-secondary/50"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{item.label}</span>
                          <span className="text-xs font-bold text-secondary">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat card — bottom left */}
              <div className="absolute -bottom-5 -left-6 rounded-2xl bg-secondary text-white px-5 py-4 shadow-warm-lg z-20">
                <div className="text-2xl font-bold">2.4×</div>
                <div className="text-xs text-white/70 font-medium">Faster Hiring</div>
              </div>

              {/* Floating notification — top right */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-white border border-border/60 shadow-warm px-4 py-3 flex items-center gap-3 z-20 animate-float">
                <div className="h-8 w-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <HiCheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">Profile Verified!</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>

              {/* Floating users card — middle right */}
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 rounded-2xl bg-white border border-border/60 shadow-warm px-4 py-3 z-20 animate-float-slow">
                <div className="flex items-center gap-2 mb-1">
                  <HiUsers className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold">Matches Found</span>
                </div>
                <div className="text-2xl font-bold text-secondary">48</div>
                <div className="text-xs text-muted-foreground">Verified companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaunchOfferBanner />

      {/* Stats Band */}
      <section className="py-14 border-y border-border/40 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { number: "100%", label: "Verified Profiles", icon: HiBadgeCheck, bg: "#136BAB" },
              { number: "Zero", label: "Duplicate Records", icon: HiDatabase, bg: "#1a8c6e" },
              { number: "Fast", label: "Hiring Process", icon: HiLightningBolt, bg: "#7c3aed" },
              { number: "Secure", label: "Document Gateway", icon: HiLockClosed, bg: "#dc6b19" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center p-6 rounded-3xl text-white hover:-translate-y-1 hover:shadow-warm-lg transition-all duration-300 group"
                  style={{ backgroundColor: stat.bg }}
                >
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* One Platform Section */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.12)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} />
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8" }}>
                Core Infrastructure
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-white">
                One Platform. One Source of Truth.
              </h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
                All user data and documents are securely managed within our core Jobstm system.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { icon: HiDatabase, title: "No Duplicate Storage", description: "Single centralized database ensures data integrity and consistency across the platform", accent: "#136BAB", bg: "rgba(19,107,171,0.2)" },
              { icon: HiDocumentText, title: "No Fragmented Records", description: "One verified profile per user maintained in our unified system of record", accent: "#1a8c6e", bg: "rgba(26,140,110,0.2)" },
              { icon: HiLockClosed, title: "Secure Gateway", description: "Professional onboarding portal with all data residing in the secure Jobstm core", accent: "#7c3aed", bg: "rgba(124,58,237,0.2)" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
                  <div className="rounded-3xl p-7 h-full flex flex-col hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0" style={{ backgroundColor: item.bg }}>
                      <Icon className="h-6 w-6" style={{ color: item.accent }} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{item.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verification-First Onboarding */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
        </div>
        <div className="container relative z-10">

          {/* White header on blue bg */}
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                Verification Process
              </span>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-white">
                Verification-First Onboarding
              </h2>
              <p className="text-lg text-balance" style={{ color: "rgba(255,255,255,0.7)" }}>
                Our platform is designed to meet modern hiring standards, combining technology, compliance, and ease of use.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento grid layout */}
          <div className="max-w-5xl mx-auto grid gap-4 lg:grid-cols-2">

            {/* Left: Gig Workers — white card */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="rounded-3xl bg-white p-7 h-full flex flex-col shadow-warm-lg">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(19,107,171,0.1)" }}>
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#136BAB" }}>
                    <HiUsers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(19,107,171,0.5)" }}>For</p>
                    <h3 className="font-heading text-lg font-bold text-foreground">Gig Workers</h3>
                  </div>
                  <span className="ml-auto inline-flex items-center rounded-full text-xs font-semibold px-3 py-1" style={{ backgroundColor: "rgba(19,107,171,0.1)", color: "#136BAB" }}>
                    Workers
                  </span>
                </div>

                {/* Verify grid: 2-col icon badges */}
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(19,107,171,0.5)" }}>What We Verify</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: HiShieldCheck, label: "Identity" },
                    { icon: HiBadgeCheck, label: "Education" },
                    { icon: HiClock, label: "Availability" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center" style={{ backgroundColor: "rgba(19,107,171,0.06)" }}>
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(19,107,171,0.12)" }}>
                          <Icon className="h-4 w-4" style={{ color: "#136BAB" }} />
                        </div>
                        <span className="text-xs font-semibold text-foreground/70">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Why it matters: checklist */}
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(19,107,171,0.5)" }}>Why It Matters</p>
                <div className="space-y-2 flex-1">
                  {["Genuine profiles only", "Faster shortlisting for companies", "Higher trust for hiring companies"].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/75">
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#136BAB" }} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Bottom tag */}
                <div className="mt-6 rounded-2xl px-4 py-3 text-sm font-medium text-white" style={{ backgroundColor: "#136BAB" }}>
                  Ready-to-hire, verified talent from day one.
                </div>
              </div>
            </ScrollReveal>

            {/* Right col: two stacked cards */}
            <div className="flex flex-col gap-4">

              {/* Companies card */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="rounded-3xl bg-white p-7 shadow-warm-lg">
                  <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary">
                      <HiBriefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary/50">For</p>
                      <h3 className="font-heading text-lg font-bold text-foreground">Companies</h3>
                    </div>
                    <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                      Business
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { icon: HiShieldCheck, label: "Identity" },
                      { icon: HiDocumentText, label: "Contact" },
                      { icon: HiUsers, label: "Auth Rep" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary/5 text-center">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-xs font-semibold text-foreground/70">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    {["Safe hiring environment", "Trusted job postings", "Better engagement from gig workers"].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/75">
                        <HiCheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Bottom accent card */}
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="rounded-3xl p-6 shadow-warm-lg" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <HiBadgeCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-white mb-1">Platform Promise</h4>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Only verified users on both sides. Every hire is backed by real identity and document checks.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* For Gig Workers Feature Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <ScrollReveal animation="fade-right" delay={100}>
              <div>
                <span className="inline-flex items-center rounded-full bg-secondary text-white px-4 py-1.5 text-xs font-semibold mb-6">
                  For Gig Workers
                </span>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-5">
                  Find Work That Fits Your Life
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Take control of your career with flexible gig opportunities that match your skills and schedule.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { icon: HiClock, title: "Flexible Schedule", desc: "Work when you want" },
                    { icon: HiTrendingUp, title: "Grow Income", desc: "Multiple streams" },
                    { icon: HiViewGridAdd, title: "Skill Matched", desc: "Right opportunities" },
                    { icon: HiBadgeCheck, title: "Build Reputation", desc: "Ratings & reviews" },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-secondary/15 hover:border-secondary/40 hover:bg-secondary/3 hover:-translate-y-0.5 transition-all duration-300 group">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(19,107,171,0.1)" }}>
                          <Icon className="h-5 w-5" style={{ color: "#136BAB" }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5 group-hover:text-secondary transition-colors">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link href="/contact">
                  <Button className="rounded-full bg-secondary text-white hover:bg-secondary/90 shadow-warm hover-lift px-6">
                    Start Working Today
                    <HiArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={200}>
              <div className="rounded-3xl overflow-hidden shadow-warm-lg border border-secondary/15">
                {/* App-style header bar */}
                <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#136BAB" }}>
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <HiUsers className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-medium">Jobstm</p>
                    <p className="text-sm font-bold text-white">Worker Dashboard</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </span>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x" style={{ borderBottom: "1px solid rgba(19,107,171,0.1)" }}>
                  {[{ val: "100%", label: "Verified" }, { val: "48", label: "Matches" }, { val: "4.9★", label: "Rating" }].map((s) => (
                    <div key={s.label} className="flex flex-col items-center py-4 bg-white">
                      <span className="text-lg font-bold" style={{ color: "#136BAB" }}>{s.val}</span>
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
                {/* Feature rows */}
                <div className="bg-white p-5 space-y-2.5">
                  {[
                    { icon: HiBadgeCheck, label: "Identity Verified", value: "✓ Complete" },
                    { icon: HiClock, label: "Availability Set", value: "Weekdays" },
                    { icon: HiViewGridAdd, label: "Skills Matched", value: "Smart AI" },
                    { icon: HiTrendingUp, label: "Income Track", value: "Growing" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl" style={{ backgroundColor: "rgba(19,107,171,0.05)" }}>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(19,107,171,0.12)" }}>
                            <Icon className="h-4 w-4" style={{ color: "#136BAB" }} />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: "#136BAB" }}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* For Businesses Feature Section */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#f0f5ff" }}>
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <ScrollReveal animation="fade-right" delay={200}>
              <div className="rounded-3xl overflow-hidden shadow-warm-lg border border-primary/15">
                {/* App header */}
                <div className="px-6 py-4 flex items-center gap-3 bg-primary">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <HiBriefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-medium">Jobstm</p>
                    <p className="text-sm font-bold text-white">Hiring Dashboard</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 divide-x" style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                  {[{ val: "12", label: "Hired" }, { val: "3min", label: "Avg. Match" }, { val: "0", label: "Fraud Cases" }].map((s) => (
                    <div key={s.label} className="flex flex-col items-center py-4 bg-white">
                      <span className="text-lg font-bold text-primary">{s.val}</span>
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-5 space-y-2.5">
                  {[
                    { icon: HiLightningBolt, label: "Onboarding Speed", value: "Minutes" },
                    { icon: HiShieldCheck, label: "Background Checked", value: "All Workers" },
                    { icon: HiTrendingUp, label: "Cost Efficiency", value: "High" },
                    { icon: HiBadgeCheck, label: "Quality Rating", value: "Tracked" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={100}>
              <div>
                <span className="inline-flex items-center rounded-full bg-primary text-white px-4 py-1.5 text-xs font-semibold mb-6">
                  For Businesses
                </span>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-5">
                  Hire Skilled Talent On-Demand
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Scale your workforce instantly with qualified gig workers ready to deliver results.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { icon: HiLightningBolt, title: "Fast Hiring", desc: "Connect in minutes" },
                    { icon: HiShieldCheck, title: "Pre-Verified", desc: "Background checked" },
                    { icon: HiTrendingUp, title: "Cost-Effective", desc: "Pay per work" },
                    { icon: HiViewGridAdd, title: "Quality Tracked", desc: "Ratings & reviews" },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-primary/15 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link href="/contact">
                  <Button className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-warm hover-lift px-6">
                    Post Your First Job
                    <HiArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                Simple Process
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-white">
                How Jobstm Works
              </h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
                Getting started is simple. Follow these four steps to begin your gig work journey.
              </p>
            </div>
          </ScrollReveal>
          {/* Connected stepper — numbered circles on a joining line, not another card grid */}
          <div className="max-w-5xl mx-auto">
            <div className="relative grid md:grid-cols-4 gap-10 md:gap-4">
              <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
              {[
                { number: "01", icon: HiUsers, title: "Sign Up", description: "Create your free account in minutes with secure authentication" },
                { number: "02", icon: HiViewGridAdd, title: "Complete Profile", description: "Add skills, experience, and preferences for smart matching" },
                { number: "03", icon: HiBriefcase, title: "Browse & Apply", description: "Explore gigs or post jobs, then connect with the perfect match" },
                { number: "04", icon: HiTrendingUp, title: "Work & Earn", description: "Complete projects, get paid, and build your reputation" },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={step.number} animation="fade-up" delay={index * 120}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10 h-14 w-14 rounded-2xl flex items-center justify-center bg-white shadow-warm-lg mb-5">
                        <Icon className="h-6 w-6" style={{ color: "#136BAB" }} />
                        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: "#0d1f35" }}>
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold mb-2 text-white">{step.title}</h3>
                      <p className="text-sm max-w-[220px]" style={{ color: "rgba(255,255,255,0.7)" }}>{step.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.1)" }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8" }}>
                Trust &amp; Safety
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-white">
                Why Companies &amp; Gig Workers Trust Us
              </h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
                Built for scale, security, and speed with industry-standard practices
              </p>
            </div>
          </ScrollReveal>
          {/* Asymmetric layout — one featured stat panel + compact list, not a 6-up card grid */}
          <div className="max-w-5xl mx-auto grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <ScrollReveal animation="fade-right">
              <div className="rounded-3xl p-8 h-full flex flex-col justify-center" style={{ background: "linear-gradient(150deg, #136BAB, #0d1f35)" }}>
                <div className="text-5xl font-black text-white mb-2">0</div>
                <p className="text-sm font-semibold text-white/80 mb-6">Fraud cases reported to date</p>
                <div className="h-px w-full mb-6" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
                <div className="text-5xl font-black text-white mb-2">2×</div>
                <p className="text-sm font-semibold text-white/80">Faster hiring than industry average</p>
              </div>
            </ScrollReveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Verified Profiles", description: "Both sides verified for trust and safety", accent: "#136BAB" },
                { title: "Faster Hiring", description: "Streamlined onboarding and matching process", accent: "#1a8c6e" },
                { title: "Professional Experience", description: "Business-grade platform and support", accent: "#7c3aed" },
                { title: "Compliance-Ready", description: "Industry-standard data handling and security", accent: "#dc6b19" },
                { title: "Secure Documents", description: "Centralized, encrypted document management", accent: "#136BAB" },
                { title: "Long-Term Scalability", description: "Built to grow with your needs", accent: "#1a8c6e" },
              ].map((benefit, index) => (
                <ScrollReveal key={benefit.title} animation="fade-up" delay={index * 80}>
                  <div className="flex gap-4 p-5 rounded-2xl h-full hover:-translate-y-0.5 transition-all duration-300" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${benefit.accent}25` }}>
                      <HiCheckCircle className="h-5 w-5" style={{ color: benefit.accent }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white">{benefit.title}</h3>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{benefit.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-5 py-2 text-sm font-semibold mb-5">
                What People Say
              </span>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-4">
                Trusted by Workers &amp; Companies
              </h2>
              <p className="text-lg text-muted-foreground">
                Here&apos;s what our verified users have to say
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { quote: "Jobstm helped me find verified gig work within days. The verification process gave companies confidence to hire me immediately.", name: "Ravi Sharma", role: "Gig Worker · Khandwa", accent: "#136BAB", stars: 5 },
              { quote: "We hired 12 verified workers in one week. Zero background-check issues. The platform's verification-first approach saved us hours.", name: "Priya Mehta", role: "HR Manager · Indore", accent: "#7c3aed", stars: 5 },
              { quote: "As a student, getting my first gig was seamless. My verified profile stood out and I got matched with the right opportunity instantly.", name: "Ankit Verma", role: "Student Worker · MP", accent: "#1a8c6e", stars: 5 },
            ].map((t, index) => (
              <ScrollReveal key={t.name} animation="fade-up" delay={index * 100}>
                <div className="rounded-3xl bg-white p-7 shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden relative" style={{ border: `1px solid ${t.accent}25` }}>
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: t.accent }} />
                  <div className="flex gap-0.5 mb-4 mt-2">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <HiBadgeCheck key={i} className="h-4 w-4" style={{ color: t.accent }} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: t.accent }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Work Life?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Join Jobstm today and discover the freedom of gig work or the
              flexibility of on-demand hiring
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-white text-secondary hover:bg-white/90 shadow-warm-lg hover-lift px-8"
                >
                  Sign Up Now
                  <HiCheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-white/40 bg-transparent text-white hover:bg-white/15 hover:border-white/60 hover-lift px-8"
                >
                  Learn More
                  <HiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/55 mt-10">
              Proudly built by{" "}
              <span className="font-semibold text-white/80">
                Maikal and Taksharya Pvt Limited
              </span>{" "}
              • Indore, Madhya Pradesh
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
