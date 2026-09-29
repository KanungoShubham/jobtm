import type { Metadata } from "next";
import Link from "next/link";
import {
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
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageHero, glassBadge, outlineChip } from "@/components/cinematic/PageHero";
import { SectionHead } from "@/components/cinematic/SectionHead";
import { WaveTop } from "@/components/cinematic/WaveTop";
import { CountUp } from "@/components/cinematic/CountUp";

export const metadata: Metadata = {
  title: "About Us - Jobstm",
  description:
    "Serving clients since 2011, we've built a reputation for excellence in vocational training, manpower hiring, and promotional activities.",
};

const LIGHT = "#f3f7ff";

const milestones = [
  { year: "2011", label: "Founded", detail: "Established in Khandwa, MP" },
  { year: "2015", label: "Expanded", detail: "Grew to vocational training" },
  { year: "2020", label: "Digital", detail: "Launched digital hiring platform" },
  { year: "2024", label: "Jobstm", detail: "Verification-first gig ecosystem" },
];

const values = [
  { icon: HiBadgeCheck, title: "Excellence", description: "Committed to delivering the highest quality in every project we undertake." },
  { icon: HiTrendingUp, title: "Results-Focused", description: "Driven by measurable outcomes and real, lasting client success." },
  { icon: HiUsers, title: "Client-Centric", description: "Your goals and satisfaction are always our top priority." },
  { icon: HiLightningBolt, title: "Innovation", description: "Continuously evolving our approach to meet changing market demands." },
];

const strengths = [
  { icon: HiShieldCheck, title: "Verification-First", desc: "Every user and company goes through rigorous identity verification before joining." },
  { icon: HiClock, title: "13+ Years Experience", desc: "Over a decade of manpower and training expertise backing our platform." },
  { icon: HiUsers, title: "Community Driven", desc: "Built around the needs of gig workers and the companies that hire them." },
  { icon: HiTrendingUp, title: "Scalable Platform", desc: "Infrastructure designed to grow with businesses of any size." },
  { icon: HiLightningBolt, title: "Fast Onboarding", desc: "Streamlined verification gets workers and companies ready in minutes." },
  { icon: HiBadgeCheck, title: "Trusted by Many", desc: "A growing network of verified professionals and verified employers." },
];

const orb = "flex items-center justify-center bg-gradient-to-br from-[#136BAB] to-[#3b82f6] shadow-[0_0_24px_-4px_rgba(59,130,246,0.8)]";

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <PageHero
        badges={
          <>
            <span className={glassBadge}>Since 2011</span>
            <span className={outlineChip}>
              <HiLocationMarker className="h-3.5 w-3.5" />
              Khandwa, Madhya Pradesh
            </span>
          </>
        }
        title={["About"]}
        accent={["Jobstm"]}
        description="Building a trusted, verification-first gig hiring ecosystem that connects qualified workers with companies — quickly, transparently, and at scale."
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-4">
          {[
            { node: <CountUp to={13} suffix="+" />, label: "Years Experience" },
            { node: <CountUp to={100} suffix="%" />, label: "Verified Profiles" },
            { node: "Trusted", label: "By Companies" },
          ].map((stat) => (
            <div key={stat.label} className="cin-glass rounded-2xl px-2 py-4">
              <div className="text-2xl font-bold md:text-3xl">{stat.node}</div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/55">{stat.label}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Our Story */}
      <section className="relative overflow-hidden bg-[#060f1c] pb-20 pt-4 text-white md:pb-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cin-aurora -right-40 top-10 h-[460px] w-[460px] bg-[#136BAB]/30" />
          <div className="cin-aurora -left-40 bottom-0 h-[420px] w-[420px] bg-[#0f4c7c]/40" style={{ animationDelay: "-7s" }} />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-14 px-5 md:px-10 lg:grid-cols-2">
          <ScrollReveal animation="fade-up">
            <span className="cin-glass mb-6 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-[#bfe0ff]">
              Our Story
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              A Journey Built on Trust &amp; Results
            </h2>
            <div className="space-y-4 leading-relaxed text-white/65">
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
                <span key={tag} className="cin-glass inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-[#bfe0ff]">
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <ol className="space-y-3">
              {milestones.map((m) => (
                <li key={m.year} className="cin-glass cin-glass-hover flex items-center gap-4 rounded-2xl p-4">
                  <span className={`${orb} h-12 w-16 flex-shrink-0 rounded-2xl text-sm font-bold`}>{m.year}</span>
                  <span>
                    <span className="block font-heading text-base font-bold">{m.label}</span>
                    <span className="block text-sm text-white/55">{m.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: LIGHT }}>
        <WaveTop fill="#060f1c" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-6 md:px-10">
          <SectionHead badge="Purpose" title="Vision & Mission" description="The north star that guides every decision we make" />
          <div className="grid gap-7 lg:grid-cols-2">
            {[
              {
                icon: HiEye,
                kicker: "Where we're going",
                label: "Our Vision",
                head: "Connecting every hand to meaningful work through technology.",
                body: "We envision a world where every qualified individual can access fair, flexible work opportunities — and every company can find verified talent instantly.",
                foot: "Technology-driven inclusion",
                footIcon: HiStar,
                band: "from-[#0d4a7a] to-[#136BAB]",
              },
              {
                icon: HiBriefcase,
                kicker: "What we do daily",
                label: "Our Mission",
                head: "Empower youth with flexible and sustainable earning opportunities.",
                body: "To build innovative digital platforms that give every young professional the tools, verification, and connections needed to thrive in the gig economy.",
                foot: "Youth empowerment at scale",
                footIcon: HiHeart,
                band: "from-[#136BAB] to-[#3b82f6]",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              const FootIcon = c.footIcon;
              return (
                <ScrollReveal key={c.label} animation="fade-up" delay={i * 120}>
                  <div className="cin-card flex h-full flex-col overflow-hidden rounded-3xl border border-secondary/15 bg-white">
                    <div className={`relative overflow-hidden bg-gradient-to-r ${c.band} px-8 pb-9 pt-8 text-white`}>
                      <div aria-hidden className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
                      <div className="relative flex items-center gap-4">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-xs font-medium uppercase tracking-wider text-white/65">{c.kicker}</span>
                          <span className="block font-heading text-xl font-bold">{c.label}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-8">
                      <p className="mb-4 font-heading text-2xl font-bold leading-snug">{c.head}</p>
                      <p className="leading-relaxed text-muted-foreground">{c.body}</p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-secondary">
                        <FootIcon className="h-4 w-4" />
                        {c.foot}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative overflow-hidden bg-[#060f1c] py-20 text-white md:py-28">
        <WaveTop fill={LIGHT} />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cin-aurora -left-32 top-10 h-96 w-96 bg-[#3b82f6]/25" />
          <div className="cin-aurora -right-32 bottom-0 h-96 w-96 bg-[#136BAB]/30" style={{ animationDelay: "-9s" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 md:px-10">
          <SectionHead dark badge="What We Stand For" title="Our Core Values" description="The principles that guide every decision and every interaction" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <ScrollReveal key={v.title} animation="fade-up" delay={i * 100}>
                  <div className="cin-glass cin-glass-hover h-full rounded-3xl p-7">
                    <span className={`${orb} mb-5 h-12 w-12 rounded-2xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </span>
                    <h3 className="mb-2 font-heading text-lg font-bold">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{v.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why we stand out */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: LIGHT }}>
        <WaveTop fill="#060f1c" />
        <div aria-hidden className="pointer-events-none absolute -left-40 bottom-10 h-[380px] w-[380px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-6 md:px-10">
          <SectionHead badge="Our Strengths" title="Why We Stand Out" description="Decades of experience distilled into a modern, trusted platform" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strengths.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.title} animation="fade-up" delay={i * 80}>
                  <div className="cin-card cin-glow-border flex h-full gap-4 rounded-2xl border border-secondary/10 bg-white p-5">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                      <Icon className="h-5 w-5 text-secondary" />
                    </span>
                    <span>
                      <span className="mb-1 block text-sm font-semibold">{s.title}</span>
                      <span className="block text-xs leading-relaxed text-muted-foreground">{s.desc}</span>
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cin-hero relative overflow-hidden py-24 text-white md:py-28">
        <WaveTop fill={LIGHT} />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cin-aurora -right-1/4 -top-1/3 h-[600px] w-[600px] bg-[#3b82f6]/30" />
          <div className="cin-aurora -bottom-1/2 -left-1/4 h-[500px] w-[500px] bg-[#0f4c7c]/40" style={{ animationDelay: "-9s" }} />
          <div className="cin-grain absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-6 text-center md:px-10">
          <ScrollReveal animation="fade-up">
            <span className="cin-glass mb-8 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-[#bfe0ff]">
              Since 2011 — Maikal and Taksharya Pvt Limited
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">A Legacy of Excellence</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/70">
              Our extensive experience has taught us what works. Let us bring that
              knowledge to your business — proven strategies backed by deep industry insight.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="cin-btn-glow group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-[#0d4a7a] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Partner With Us
                <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="cin-glass group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Our Services
                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-10 text-sm text-white/50">Indore, Madhya Pradesh • India</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
