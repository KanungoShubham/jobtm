interface HeroSectionProps {
  title: string;
  description: string;
}

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-background via-background to-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
