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
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageHero, glassBadge } from "@/components/cinematic/PageHero";
import { SectionHead } from "@/components/cinematic/SectionHead";
import { WaveTop } from "@/components/cinematic/WaveTop";
import { LineDraw } from "@/components/cinematic/LineDraw";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, serviceCatalogLd, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services: Training, Manpower Hiring & Promotions",
  description:
    "Vocational training, manpower hiring, promotion activities and upskilling courses from Jobstm. 13+ years of expertise in Khandwa, Madhya Pradesh and India.",
  path: "/services",
  keywords: [
    "vocational training Khandwa",
    "manpower hiring agency Khandwa",
    "manpower recruitment Madhya Pradesh",
    "promotion activities staffing",
    "BTL promotion and event management",
    "upskilling courses and certifications",
    "background verified candidates",
    "Jobstm services",
  ],
});

const LIGHT = "#f3f7ff";

const services = [
  {
    title: "Vocational Training",
    subtitle: "Empower your workforce with industry-relevant skills and certifications.",
    icon: HiAcademicCap,
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
    <div className="overflow-x-hidden">
      <JsonLd
        data={[
          webPageLd("WebPage", "Our Services", "/services", "Vocational training, manpower hiring, promotion activities and upskilling."),
          serviceCatalogLd(services.map((sv) => ({ name: sv.title, description: sv.subtitle, features: sv.features.map((f) => f.label) }))),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
        ]}
      />
      {/* Hero */}
      <PageHero
        badges={
          <span className={glassBadge}>
            <HiBadgeCheck className="h-4 w-4" />
            Trusted by businesses across India
          </span>
        }
        title={["Our"]}
        accent={["Services"]}
        description="Comprehensive solutions for vocational training, manpower recruitment, business promotion, and professional upskilling — backed by 13+ years of industry expertise."
      >
        <div className="flex flex-wrap justify-center gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <span
                key={stat.label}
                className="cin-glass cin-glass-hover inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
              >
                <Icon className="h-4 w-4 text-[#7bb8e8]" />
                {stat.label}
              </span>
            );
          })}
        </div>
      </PageHero>

      {/* Services */}
      <section className="relative overflow-hidden bg-[#060f1c] pb-20 pt-4 text-white md:pb-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cin-aurora -right-40 top-10 h-[460px] w-[460px] bg-[#136BAB]/30" />
          <div className="cin-aurora -left-40 bottom-0 h-[420px] w-[420px] bg-[#0f4c7c]/40" style={{ animationDelay: "-7s" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
          <SectionHead dark badge="What We Offer" title="Comprehensive Solutions" description="Each service is designed to deliver tangible results." />

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.title} animation="fade-up" delay={(index % 2) * 120}>
                  <div className="cin-glass cin-glass-hover flex h-full flex-col rounded-3xl p-7">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#136BAB] to-[#3b82f6] shadow-[0_0_28px_-4px_rgba(59,130,246,0.8)]">
                        <Icon className="h-7 w-7 text-white" />
                      </span>
                      <div>
                        <h3 className="font-heading text-xl font-bold">{service.title}</h3>
                        <p className="mt-0.5 text-sm text-white/60">{service.subtitle}</p>
                      </div>
                    </div>

                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">Key Features</p>
                    <ul className="grid flex-1 gap-2 sm:grid-cols-2">
                      {service.features.map((feat) => {
                        const FeatIcon = feat.icon;
                        return (
                          <li key={feat.label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/85">
                            <FeatIcon className="h-4 w-4 flex-shrink-0 text-[#7bb8e8]" />
                            {feat.label}
                          </li>
                        );
                      })}
                    </ul>

                    <Link
                      href="/contact"
                      className="group mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-[#136BAB] to-[#3b82f6] px-7 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(59,130,246,0.6)] transition-transform hover:-translate-y-0.5"
                    >
                      Get Started
                      <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: LIGHT }}>
        <WaveTop fill="#060f1c" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 md:px-10">
          <SectionHead badge="Our Process" title="How We Work" description="A simple, proven process that gets results." />
          <div className="relative">
            <LineDraw className="absolute left-[16.6%] right-[16.6%] top-10 hidden h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 sm:block" />
            <div className="relative grid gap-5 sm:grid-cols-3">
              {steps.map((step, i) => (
                <ScrollReveal key={step.number} animation="fade-up" delay={i * 150}>
                  <div className="cin-card cin-glow-border h-full rounded-3xl border border-secondary/10 bg-white p-7">
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#136BAB] to-[#3b82f6] text-sm font-black text-white shadow-[0_10px_24px_-8px_rgba(59,130,246,0.8)]">
                      {step.number}
                    </span>
                    <h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Let&apos;s discuss how our services can help achieve your business
              objectives. Contact us today for a free consultation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="cin-btn-glow group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white px-9 text-sm font-semibold text-[#0d4a7a] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Contact Us Now
                <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="cin-glass inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-9 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Learn About Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
