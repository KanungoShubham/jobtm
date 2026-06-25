import type { Metadata } from "next";
import Link from "next/link";
import {
  HiAcademicCap,
  HiUserGroup,
  HiSpeakerphone,
  HiLightBulb,
  HiCheckCircle,
  HiArrowRight,
  HiClock,
  HiTrendingUp,
  HiShieldCheck,
  HiBadgeCheck,
  HiLightningBolt,
  HiUsers,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Services - JOBS TM",
  description:
    "Comprehensive vocational training, strategic manpower hiring, dynamic promotion activities, and upskilling programs. Discover how our services can drive your business success.",
};

const services = [
  {
    title: "Vocational Training",
    subtitle: "Empower your workforce with industry-relevant skills and certifications.",
    icon: HiAcademicCap,
    headerBg: "bg-secondary",
    accentColor: "text-secondary",
    features: [
      { label: "Industry-specific skill development", icon: HiTrendingUp },
      { label: "Certified training modules", icon: HiBadgeCheck },
      { label: "Hands-on practical sessions", icon: HiLightningBolt },
      { label: "Expert instructors", icon: HiAcademicCap },
      { label: "Flexible scheduling", icon: HiClock },
      { label: "Post-training support", icon: HiShieldCheck },
    ],
  },
  {
    title: "Manpower Hiring",
    subtitle: "Connect with top talent through strategic recruitment solutions.",
    icon: HiUserGroup,
    headerBg: "bg-primary",
    accentColor: "text-primary",
    features: [
      { label: "Comprehensive candidate screening", icon: HiShieldCheck },
      { label: "Industry-specific talent pools", icon: HiUsers },
      { label: "Background verification", icon: HiBadgeCheck },
      { label: "Quick turnaround", icon: HiLightningBolt },
      { label: "Replacement guarantee", icon: HiCheckCircle },
      { label: "Ongoing candidate management", icon: HiTrendingUp },
    ],
  },
  {
    title: "Promotion Activities",
    subtitle: "Elevate your brand with dynamic campaigns designed for maximum impact.",
    icon: HiSpeakerphone,
    headerBg: "bg-secondary",
    accentColor: "text-secondary",
    features: [
      { label: "Strategic campaign planning", icon: HiTrendingUp },
      { label: "Multi-channel promotion", icon: HiSpeakerphone },
      { label: "Brand awareness initiatives", icon: HiLightBulb },
      { label: "Event management", icon: HiUsers },
      { label: "Performance tracking", icon: HiBadgeCheck },
      { label: "ROI-focused solutions", icon: HiShieldCheck },
    ],
  },
  {
    title: "Upskill & Grow",
    subtitle: "Access a comprehensive library of courses and certifications.",
    icon: HiLightBulb,
    headerBg: "bg-primary",
    accentColor: "text-primary",
    features: [
      { label: "Free & premium courses", icon: HiLightBulb },
      { label: "Industry certifications", icon: HiBadgeCheck },
      { label: "Expert instructors", icon: HiAcademicCap },
      { label: "Technical and soft skills", icon: HiTrendingUp },
      { label: "Self-paced learning", icon: HiClock },
      { label: "Career advancement resources", icon: HiArrowRight },
    ],
  },
];

const stats = [
  { label: "13+ Years", icon: HiClock },
  { label: "4 Services", icon: HiBadgeCheck },
  { label: "100% Verified", icon: HiShieldCheck },
  { label: "Trusted", icon: HiCheckCircle },
];

const steps = [
  {
    number: "01",
    title: "Consult & Understand",
    description:
      "We start with a detailed consultation to understand your specific needs, goals, and challenges — tailoring a plan that fits your business.",
  },
  {
    number: "02",
    title: "Strategize & Execute",
    description:
      "Our experts craft a targeted strategy and execute with precision, leveraging 13+ years of domain expertise across every service.",
  },
  {
    number: "03",
    title: "Deliver & Support",
    description:
      "We deliver measurable results and provide ongoing support to ensure long-term success and continuous improvement.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-secondary py-24 md:py-32">
        {/* subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container relative mx-auto max-w-6xl px-4 text-center text-white">
          <ScrollReveal animation="fade-down" duration={600}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <HiBadgeCheck className="h-4 w-4" />
              Trusted by businesses across India
            </span>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100} duration={700}>
            <h1 className="font-heading mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              Our Services
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80 md:text-xl">
              Comprehensive solutions for vocational training, manpower recruitment,
              business promotion, and professional upskilling — backed by 13+ years of
              industry expertise.
            </p>
          </ScrollReveal>

          {/* Stat pills */}
          <ScrollReveal animation="fade-up" delay={250} duration={600}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <span
                    key={stat.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
                  >
                    <Icon className="h-4 w-4" />
                    {stat.label}
                  </span>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Services bento ── */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.1)" }} />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        </div>
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mb-14 text-center">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(19,107,171,0.25)", color: "#7bb8e8" }}>
                What We Offer
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white">
                Comprehensive Solutions
              </h2>
              <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                Each service is designed to deliver tangible results.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isOdd = index % 2 !== 0;

              return (
                <ScrollReveal
                  key={service.title}
                  animation={isOdd ? "fade-left" : "fade-right"}
                  delay={index * 100}
                  duration={650}
                >
                  <div className="rounded-3xl overflow-hidden shadow-warm-lg border border-border/50 transition-shadow duration-300 hover:shadow-xl">
                    {/* Colored header band */}
                    <div
                      className={`${service.headerBg} text-white px-8 py-6 flex items-center gap-5`}
                    >
                      <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-8 w-8 text-white" />
                      </span>
                      <div>
                        <h3 className="font-heading text-2xl font-bold">
                          {service.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-white/80">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* White body — alternating layout */}
                    <div
                      className={`grid gap-6 bg-card p-8 md:grid-cols-2 ${
                        isOdd ? "direction-rtl" : ""
                      }`}
                    >
                      {/* Left / Right: description block */}
                      <div
                        className={`flex flex-col justify-center ${
                          isOdd ? "md:order-2" : "md:order-1"
                        }`}
                      >
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {service.subtitle}
                        </p>
                        <Link href="/contact" className="mt-6 self-start">
                          <button
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95 ${service.headerBg}`}
                          >
                            Get Started
                            <HiArrowRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>

                      {/* Right / Left: feature pills */}
                      <div
                        className={`${isOdd ? "md:order-1" : "md:order-2"}`}
                      >
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Key Features
                        </p>
                        <ul className="space-y-2.5">
                          {service.features.map((feat) => {
                            const FeatIcon = feat.icon;
                            return (
                              <li key={feat.label}>
                                <span className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-muted/70">
                                  <FeatIcon
                                    className={`h-4 w-4 flex-shrink-0 ${service.accentColor}`}
                                  />
                                  {feat.label}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How We Work ── */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="mb-14 text-center">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold mb-5" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                Our Process
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white">
                How We Work
              </h2>
              <p className="mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                A simple, proven process that gets results.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} animation="fade-up" delay={i * 150} duration={600}>
                <div className="rounded-3xl bg-white p-7 shadow-warm-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-4xl font-black" style={{ color: "rgba(19,107,171,0.15)" }}>{step.number}</span>
                    {i < steps.length - 1 && <HiArrowRight className="h-4 w-4" style={{ color: "#136BAB" }} />}
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#0d1f35" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full" style={{ backgroundColor: "rgba(19,107,171,0.1)" }} />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        </div>
        <div className="container mx-auto max-w-4xl px-4 text-center text-white relative z-10">
          <ScrollReveal animation="scale" duration={600}>
            <h2 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Let&apos;s discuss how our services can help achieve your business
              objectives. Contact us today for a free consultation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-secondary hover:bg-white/90 hover:-translate-y-0.5 font-semibold px-10 transition-all duration-200"
                >
                  Contact Us Now
                  <HiArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/50 bg-transparent text-white hover:bg-white/10 hover:border-white hover:-translate-y-0.5 px-10 transition-all duration-200"
                >
                  Learn About Us
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
