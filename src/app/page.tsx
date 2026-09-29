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
import { HowItWorks } from "@/components/cinematic/HowItWorks";
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

      {/* How it works */}
      <HowItWorks />

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
