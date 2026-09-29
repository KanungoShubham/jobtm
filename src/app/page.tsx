import Link from "next/link";
import {
  HiTrendingUp,
  HiViewGridAdd,
  HiUsers,
  HiBriefcase,
  HiCheckCircle,
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

      {/* Explore: workers / businesses / verification */}
      <ExploreTabs />

      {/* How It Works */}
      <section className="py-20 md:py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0f4c7c 0%, #0d1f35 100%)" }}>
        <WaveTop fill="#eaf1ff" />
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

      {/* Final CTA */}
      <section className="cin-hero py-24 md:py-28 text-white relative overflow-hidden">
        <WaveTop fill="#0d1f35" />
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
