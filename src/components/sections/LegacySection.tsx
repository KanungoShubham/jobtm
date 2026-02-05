import Link from "next/link";
import { Button } from "../ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function LegacySection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-4xl bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 shadow-warm-lg hover-lift transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-block rounded-full bg-primary/20 px-6 py-3 mb-4">
                <span className="font-heading text-4xl font-bold text-primary">
                  Since 2011
                </span>
              </div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                A Legacy of Excellence
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our extensive experience has taught us what works. We bring this
                knowledge to every client relationship, ensuring you benefit from
                our proven strategies and deep industry insights.
              </p>
            </div>
            <div className="text-center">
              <Link href="/contact">
                <Button size="lg" className="hover-shine">Partner With Us</Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
