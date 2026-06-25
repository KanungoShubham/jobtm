import type { Metadata } from "next";
import Link from "next/link";
import {
  HiCheckCircle,
  HiEye,
  HiLightningBolt,
  HiShieldCheck,
  HiTrendingUp,
  HiUsers,
  HiBadgeCheck,
  HiBriefcase,
  HiArrowRight,
  HiLocationMarker,
  HiHeart,
  HiStar,
  HiClock,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About Us - Jobstm",
  description:
    "Serving clients since 2011, we've built a reputation for excellence in vocational training, manpower hiring, and promotional activities.",
};


const milestones = [
  { year: "2011", label: "Founded", detail: "Established in Khandwa, MP" },
  { year: "2015", label: "Expanded", detail: "Grew to vocational training" },
  { year: "2020", label: "Digital", detail: "Launched digital hiring platform" },
  { year: "2024", label: "Jobstm", detail: "Verification-first gig ecosystem" },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-secondary text-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
                Since 2011
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm">
                <HiLocationMarker className="h-4 w-4" />
                Khandwa, Madhya Pradesh
              </span>
            </div>
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl mb-6 leading-tight">
              About <span className="text-white/80">Jobstm</span>
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed">
              Building a trusted, verification-first gig hiring ecosystem that connects
              qualified workers with companies — quickly, transparently, and at scale.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { number: "13+", label: "Years Experience" },
                { number: "100%", label: "Verified Profiles" },
                { number: "Trusted", label: "By Companies" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.12)" }} />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-14 lg:grid-cols-2 items-start max-w-6xl mx-auto">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-6" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8" }}>
                  Our Story
                </span>
                <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-6 text-white">
                  A Journey Built on Trust &amp; Results
                </h2>
                <div className="space-y-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <p>
                    Since our founding in 2011, we have established ourselves as leading
                    professionals in vocational training, manpower hiring, and promotional
                    activities. Our track record speaks for itself.
                  </p>
                  <p>
                    We&apos;ve helped countless organizations transform their workforce,
                    recruit top talent, and execute successful campaigns. Our commitment
                    to excellence has made us a trusted partner across industries.
                  </p>
                  <p>
                    Today, through Jobstm, we continue to innovate — building a
                    verification-first gig platform that brings transparency and trust to every hire.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["Vocational Training", "Manpower Hiring", "Gig Platform", "Verified Talent"].map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8", border: "1px solid rgba(19,107,171,0.3)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline — white cards */}
            <ScrollReveal animation="fade-left" delay={150}>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-14 items-center justify-center rounded-2xl text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: "#136BAB" }}>
                        {m.year}
                      </div>
                      {i < milestones.length - 1 && (
                        <div className="w-px flex-1 mt-2" style={{ backgroundColor: "rgba(19,107,171,0.3)" }} />
                      )}
                    </div>
                    <div className="pb-4 pt-1">
                      <h4 className="font-heading text-base font-bold text-white mb-0.5">{m.label}</h4>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{m.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-5 py-2 text-sm font-semibold mb-5">
                Purpose
              </span>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-4">
                Vision &amp; Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                The north star that guides every decision we make
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-7 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Vision */}
            <ScrollReveal animation="fade-left" delay={100}>
              <div className="rounded-3xl overflow-hidden border border-secondary/20 shadow-warm-lg h-full flex flex-col">
                <div className="bg-secondary px-8 pt-8 pb-10 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-11 w-11 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <HiEye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Where we&apos;re going</p>
                        <h3 className="font-heading text-xl font-bold">Our Vision</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex-1 p-8">
                  <p className="text-2xl font-heading font-bold text-foreground mb-4 leading-snug">
                    Connecting every hand to meaningful work through technology.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision a world where every qualified individual can access
                    fair, flexible work opportunities — and every company can find
                    verified talent instantly.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-secondary font-semibold text-sm">
                    <HiStar className="h-4 w-4" />
                    Technology-driven inclusion
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal animation="fade-right" delay={200}>
              <div className="rounded-3xl overflow-hidden border border-primary/20 shadow-warm-lg h-full flex flex-col">
                <div className="bg-primary px-8 pt-8 pb-10 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-11 w-11 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <HiBriefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">What we do daily</p>
                        <h3 className="font-heading text-xl font-bold">Our Mission</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex-1 p-8">
                  <p className="text-2xl font-heading font-bold text-foreground mb-4 leading-snug">
                    Empower youth with flexible and sustainable earning opportunities.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    To build innovative digital platforms that give every young
                    professional the tools, verification, and connections needed to
                    thrive in the gig economy.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm">
                    <HiHeart className="h-4 w-4" />
                    Youth empowerment at scale
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                What We Stand For
              </span>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-white">
                Our Core Values
              </h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
                The principles that guide every decision and every interaction
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              { icon: HiBadgeCheck, title: "Excellence", description: "Committed to delivering the highest quality in every project we undertake.", accent: "#136BAB" },
              { icon: HiTrendingUp, title: "Results-Focused", description: "Driven by measurable outcomes and real, lasting client success.", accent: "#1a8c6e" },
              { icon: HiUsers, title: "Client-Centric", description: "Your goals and satisfaction are always our top priority.", accent: "#7c3aed" },
              { icon: HiLightningBolt, title: "Innovation", description: "Continuously evolving our approach to meet changing market demands.", accent: "#dc6b19" },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} animation="fade-up" delay={index * 100}>
                  <div className="rounded-3xl bg-white p-7 h-full shadow-warm-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${value.accent}20` }}>
                      <Icon className="h-6 w-6" style={{ color: value.accent }} />
                    </div>
                    <h3 className="font-heading text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.1)" }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        </div>
        <div className="container relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8" }}>
                Our Strengths
              </span>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-white">
                Why We Stand Out
              </h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
                Decades of experience distilled into a modern, trusted platform
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { icon: HiShieldCheck, title: "Verification-First", desc: "Every user and company goes through rigorous identity verification before joining.", accent: "#136BAB" },
              { icon: HiClock, title: "13+ Years Experience", desc: "Over a decade of manpower and training expertise backing our platform.", accent: "#1a8c6e" },
              { icon: HiUsers, title: "Community Driven", desc: "Built around the needs of gig workers and the companies that hire them.", accent: "#7c3aed" },
              { icon: HiTrendingUp, title: "Scalable Platform", desc: "Infrastructure designed to grow with businesses of any size.", accent: "#dc6b19" },
              { icon: HiLightningBolt, title: "Fast Onboarding", desc: "Streamlined verification gets workers and companies ready in minutes.", accent: "#136BAB" },
              { icon: HiBadgeCheck, title: "Trusted by Many", desc: "A growing network of verified professionals and verified employers.", accent: "#1a8c6e" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} animation="fade-up" delay={index * 80}>
                  <div className="flex gap-4 p-5 rounded-2xl hover:-translate-y-0.5 transition-all duration-300" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.accent}25` }}>
                      <Icon className="h-5 w-5" style={{ color: item.accent }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white text-sm">{item.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold mb-8">
              Since 2011 — Maikal and Taksharya Pvt Limited
            </div>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl mb-6">
              A Legacy of Excellence
            </h2>
            <p className="text-xl text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
              Our extensive experience has taught us what works. Let us bring that
              knowledge to your business — proven strategies backed by deep industry insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-white text-secondary hover:bg-white/90 shadow-warm-lg hover-lift px-8"
                >
                  Partner With Us
                  <HiArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-white/40 bg-transparent text-white hover:bg-white/15 hover:border-white/60 hover-lift px-8"
                >
                  Our Services
                  <HiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/50 mt-10">
              Indore, Madhya Pradesh • India
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
