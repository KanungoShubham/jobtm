import type { Metadata } from "next";
import Link from "next/link";
import {
  HiDocumentDownload,
  HiPhotograph,
  HiColorSwatch,
  HiTemplate,
} from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Marketing Materials - JOBS TM",
  description:
    "Access our brand assets, marketing guidelines, and downloadable resources for promotional activities.",
};

const materialCategories = [
  {
    title: "Brand Assets",
    description: "Official logos, icons, and brand identity elements",
    icon: HiColorSwatch,
    items: [
      "Primary logo (PNG, SVG, EPS)",
      "Secondary logo variations",
      "Icon set",
      "Typography guide",
    ],
  },
  {
    title: "Marketing Collateral",
    description: "Ready-to-use promotional materials",
    icon: HiTemplate,
    items: [
      "Brochure templates",
      "Flyer designs",
      "Business card templates",
      "Presentation decks",
    ],
  },
  {
    title: "Digital Assets",
    description: "Social media and web graphics",
    icon: HiPhotograph,
    items: [
      "Social media cover images",
      "Post templates",
      "Web banners",
      "Email signatures",
    ],
  },
  {
    title: "Documentation",
    description: "Guidelines and specifications",
    icon: HiDocumentDownload,
    items: [
      "Brand guidelines PDF",
      "Style guide",
      "Usage dos and don'ts",
      "Marketing strategy overview",
    ],
  },
];

export default function MarketingMaterialsPage() {
  return (
    <div>
      <HeroSection
        title="Marketing Materials"
        description="Access our comprehensive collection of brand assets, marketing collateral, and guidelines to effectively promote JOBS TM services."
      />

      {/* Materials Categories */}
      <section className="py-16 md:py-24">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Available Resources
              </h2>
              <p className="text-lg text-muted-foreground">
                Download and use our marketing materials to promote our services
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {materialCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <ScrollReveal key={category.title} animation="scale" delay={index * 150}>
                  <Card className="h-full hover-lift transition-all duration-300">
                    <CardHeader>
                      <div className="mb-4">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle className="mb-2">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" size="sm" className="w-full gap-2 hover-shine">
                        <HiDocumentDownload className="h-4 w-4" />
                        Download Package
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal animation="fade-up">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6 text-center">
                Usage Guidelines
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={100}>
              <Card className="mb-8 hover-lift transition-all duration-300">
              <CardHeader>
                <CardTitle>Brand Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Logo Usage</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      • Maintain minimum clear space around the logo equal to the
                      height of the &quot;T&quot; in JOBS TM
                    </li>
                    <li>• Do not distort, rotate, or modify the logo</li>
                    <li>
                      • Use the primary logo on light backgrounds and the inverse
                      on dark backgrounds
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Typography</h3>
                  <p className="text-sm text-muted-foreground">
                    Our primary typeface is Inter for body text and headings. Use
                    weights from Regular (400) to Bold (700) for hierarchy.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Photography Style</h3>
                  <p className="text-sm text-muted-foreground">
                    Use authentic, professional images that showcase real people
                    in work environments. Avoid overly staged or stock-looking
                    photos.
                  </p>
                </div>
              </CardContent>
            </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Need custom materials or have questions?
                </p>
                <Link href="/contact">
                  <Button size="lg" className="hover-lift hover-shine">Contact Our Team</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
