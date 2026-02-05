import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function JourneySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Established marketing experts delivering results since 2011
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="mx-auto max-w-3xl space-y-6 text-lg text-muted-foreground">
            <p>
              Since our founding in 2011, we have established ourselves as leading
              marketing professionals, specializing in three core areas that drive
              business success: vocational training, manpower hiring, and promotion
              activities. Our track record speaks for itself.
            </p>
            <p>
              Throughout our journey, we&apos;ve helped countless organizations
              transform their workforce, recruit top talent, and execute successful
              marketing campaigns. Our commitment to excellence and client
              satisfaction has made us a trusted partner across industries.
            </p>
            <p>
              Today, we continue to innovate and adapt to the changing market
              landscape, ensuring our clients receive cutting-edge solutions backed
              by our extensive experience and proven methodologies.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
