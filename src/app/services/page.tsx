import type { Metadata } from "next";
import Link from "next/link";
import {
  HiAcademicCap,
  HiUserGroup,
  HiSpeakerphone,
  HiCheckCircle,
  HiLightBulb,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Services - JOBS TM",
  description:
    "Comprehensive vocational training, strategic manpower hiring, dynamic promotion activities, and upskilling programs. Discover how our services can drive your business success.",
};

const services = [
  {
    title: "Vocational Training",
    icon: HiAcademicCap,
    description:
      "Empower your workforce with industry-relevant skills and certifications through our comprehensive training programs.",
    features: [
      "Industry-specific skill development programs",
      "Certified training modules",
      "Hands-on practical sessions",
      "Expert instructors with real-world experience",
      "Flexible scheduling options",
      "Post-training support and resources",
    ],
  },
  {
    title: "Manpower Hiring",
    icon: HiUserGroup,
    description:
      "Connect with top talent through our strategic recruitment solutions tailored to your industry and organizational needs.",
    features: [
      "Comprehensive candidate screening",
      "Industry-specific talent pools",
      "Background verification services",
      "Quick turnaround time",
      "Replacement guarantee",
      "Ongoing candidate management",
    ],
  },
  {
    title: "Promotion Activities",
    icon: HiSpeakerphone,
    description:
      "Elevate your brand presence with our dynamic marketing campaigns and promotional strategies designed for maximum impact.",
    features: [
      "Strategic campaign planning",
      "Multi-channel promotion execution",
      "Brand awareness initiatives",
      "Event management and coordination",
      "Performance tracking and analytics",
      "ROI-focused marketing solutions",
    ],
  },
  {
    title: "Upskill & Grow",
    icon: HiLightBulb,
    description:
      "Access a comprehensive library of courses and certifications. From technical skills to soft skills, enhance your employability and stay ahead in your career journey.",
    features: [
      "Free & premium courses",
      "Industry certifications",
      "Expert instructors",
      "Technical and soft skills training",
      "Self-paced learning modules",
      "Career advancement resources",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <HeroSection
        title="Our Services"
        description="Comprehensive solutions for vocational training, manpower recruitment, business promotion, and professional upskilling. Backed by over 12 years of industry expertise."
      />

      {/* Services Details */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <ScrollReveal key={service.title} animation="fade-up" delay={index * 150}>
                  <Card
                    className={`overflow-hidden hover-lift transition-all duration-300 ${
                      !isEven ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                      <div className={isEven ? "" : "md:order-2"}>
                        <div className="mb-6">
                          <Icon className="h-16 w-16 text-primary mb-4" />
                          <h2 className="font-heading text-3xl font-bold mb-4">
                            {service.title}
                          </h2>
                          <p className="text-lg text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className={isEven ? "" : "md:order-1"}>
                        <h3 className="font-heading text-xl font-semibold mb-4">
                          Key Features:
                        </h3>
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <HiCheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <ScrollReveal animation="scale">
            <div className="mx-auto max-w-4xl bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 shadow-warm-lg text-center hover-lift transition-all duration-300">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss how our services can help achieve your business
                objectives. Contact us today for a consultation.
              </p>
              <Link href="/contact">
                <Button size="lg" className="hover-shine">Contact Us Now</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
