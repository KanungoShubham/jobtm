import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  badge: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export function SectionHead({ badge, title, description, dark = false }: SectionHeadProps) {
  return (
    <ScrollReveal animation="fade-up">
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <span
          className={cn(
            "mb-5 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold",
            dark ? "cin-glass text-[#bfe0ff]" : "bg-secondary/10 text-secondary"
          )}
        >
          {badge}
        </span>
        <h2 className={cn("mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl", dark && "text-white")}>
          {title}
        </h2>
        {description && (
          <p className={cn("text-lg", dark ? "text-white/60" : "text-muted-foreground")}>{description}</p>
        )}
      </div>
    </ScrollReveal>
  );
}
