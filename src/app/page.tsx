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
  HiDatabase,
  HiDocumentText,
  HiLockClosed,
  HiArrowRight,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LaunchOfferBanner } from "@/components/sections/LaunchOfferBanner";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { ScrollProgress } from "@/components/cinematic/ScrollProgress";
import { LineDraw } from "@/components/cinematic/LineDraw";
import { WaveTop } from "@/components/cinematic/WaveTop";
import { ExploreTabs } from "@/components/cinematic/ExploreTabs";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />
      <CinematicHero />

      <LaunchOfferBanner />

      {/* Stats Band */}
      <section className="relative overflow-hidden bg-white pb-16 pt-28 md:pb-20 md:pt-32">
        <WaveTop fill="#060f1c" />
        <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#136BAB]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#0f5a94]/10 blur-3xl" />
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { number: "100%", label: "Verified Profiles", icon: HiBadgeCheck, bg: "#136BAB", delay: 0 },
              { number: "Zero", label: "Duplicate Records", icon: HiDatabase, bg: "#0F5A94", delay: 0.8 },
              { number: "Fast", label: "Hiring Process", icon: HiLightningBolt, bg: "#0D4A7A", delay: 1.6 },
              { number: "Secure", label: "Document Gateway", icon: HiLockClosed, bg: "#0B3B63", delay: 2.4 },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="cin-shine cin-float flex flex-col items-center text-center p-6 md:p-8 rounded-3xl text-white group transition-transform duration-500 hover:scale-105"
                  style={{ background: `linear-gradient(150deg, ${stat.bg}, ${stat.bg}b3)`, boxShadow: `0 30px 60px -24px ${stat.bg}`, "--sd": `${stat.delay}s`, animationDelay: `${stat.delay - 3}s` } as React.CSSProperties}
                >
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* One Platform Section */}
      <section className="cin-hero py-24 md:py-32 relative overflow-hidden">
        <WaveTop fill="#ffffff" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="cin-aurora -top-40 -right-40 w-[500px] h-[500px] bg-[#136BAB]/35" />
          <div className="cin-aurora -bottom-40 -left-40 w-[500px] h-[500px] bg-[#0f5a94]/20" style={{ animationDelay: "-7s" }} />
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
              { icon: HiDocumentText, title: "No Fragmented Records", description: "One verified profile per user maintained in our unified system of record", accent: "#3b82f6", bg: "rgba(59,130,246,0.2)" },
              { icon: HiLockClosed, title: "Secure Gateway", description: "Professional onboarding portal with all data residing in the secure Jobstm core", accent: "#0f5a94", bg: "rgba(15,90,148,0.3)" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
                  <div className="cin-glass cin-glass-hover rounded-3xl p-7 h-full flex flex-col">
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

      {/* Explore: workers / businesses / verification */}
      <ExploreTabs />

      {/* How It Works */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0f4c7c 0%, #0d1f35 100%)" }}>
        <WaveTop fill="#f0f5ff" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="cin-aurora -top-32 -left-32 w-96 h-96 bg-white/10" />
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
            <div className="cin-stagger relative grid md:grid-cols-4 gap-10 md:gap-4">
              <LineDraw className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-white/20 via-white/70 to-white/20" />
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
                      <div className="cin-card relative z-10 h-14 w-14 rounded-2xl flex items-center justify-center bg-white mb-5">
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
      <section className="cin-hero py-24 md:py-32 relative overflow-hidden">
        <WaveTop fill="#0d1f35" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="cin-aurora top-0 right-0 w-[420px] h-[420px] bg-[#136BAB]/35" />
          <div className="cin-aurora bottom-0 left-0 w-[360px] h-[360px] bg-[#3b82f6]/20" style={{ animationDelay: "-8s" }} />
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
              <div className="cin-glass rounded-3xl p-8 h-full flex flex-col justify-center" style={{ background: "linear-gradient(150deg, rgba(19,107,171,0.55), rgba(13,31,53,0.6))" }}>
                <div className="text-5xl font-black text-white mb-2">0</div>
                <p className="text-sm font-semibold text-white/80 mb-6">Fraud cases reported to date</p>
                <div className="h-px w-full mb-6" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
                <div className="text-5xl font-black text-white mb-2">2×</div>
                <p className="text-sm font-semibold text-white/80">Faster hiring than industry average</p>
              </div>
            </ScrollReveal>
            <div className="cin-stagger grid gap-3 sm:grid-cols-2">
              {[
                { title: "Verified Profiles", description: "Both sides verified for trust and safety", accent: "#136BAB" },
                { title: "Faster Hiring", description: "Streamlined onboarding and matching process", accent: "#3b82f6" },
                { title: "Professional Experience", description: "Business-grade platform and support", accent: "#0f5a94" },
                { title: "Compliance-Ready", description: "Industry-standard data handling and security", accent: "#5b9bd5" },
                { title: "Secure Documents", description: "Centralized, encrypted document management", accent: "#136BAB" },
                { title: "Long-Term Scalability", description: "Built to grow with your needs", accent: "#3b82f6" },
              ].map((benefit, index) => (
                <ScrollReveal key={benefit.title} animation="fade-up" delay={index * 80}>
                  <div className="cin-glass cin-glass-hover flex gap-4 p-5 rounded-2xl h-full">
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
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#f5f8ff" }}>
        <WaveTop fill="#0a1526" />
        <div className="container pt-10">
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
              { quote: "We hired 12 verified workers in one week. Zero background-check issues. The platform's verification-first approach saved us hours.", name: "Priya Mehta", role: "HR Manager · Indore", accent: "#0f5a94", stars: 5 },
              { quote: "As a student, getting my first gig was seamless. My verified profile stood out and I got matched with the right opportunity instantly.", name: "Ankit Verma", role: "Student Worker · MP", accent: "#3b82f6", stars: 5 },
            ].map((t, index) => (
              <ScrollReveal key={t.name} animation="fade-up" delay={index * 100}>
                <div className="cin-card cin-glow-border rounded-3xl bg-white p-7 h-full flex flex-col overflow-hidden relative" style={{ border: `1px solid ${t.accent}25` }}>
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
      <section className="cin-hero py-28 md:py-36 text-white relative overflow-hidden">
        <WaveTop fill="#f5f8ff" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="cin-aurora -top-1/3 -right-1/4 w-[600px] h-[600px] bg-[#3b82f6]/35" />
          <div className="cin-aurora -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-[#0f5a94]/25" style={{ animationDelay: "-9s" }} />
          <div className="cin-grain absolute inset-0" />
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
                  className="cin-btn-glow w-full sm:w-auto rounded-full bg-white text-secondary hover:bg-white/90 shadow-warm-lg hover-lift px-8"
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
