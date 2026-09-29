import { HiChevronDown } from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQS, faqLd } from "@/lib/seo";
import { SectionHead } from "./SectionHead";
import { WaveTop } from "./WaveTop";

/** Visible FAQ (native <details>, no JS) + matching FAQPage JSON-LD for Google rich results and AI answer engines. */
export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-20 md:py-24" style={{ background: "#f3f7ff" }}>
      <WaveTop fill="#0d1f35" />
      <JsonLd data={faqLd()} />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-6 md:px-10">
        <SectionHead
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Quick answers about Jobstm, verification and gig hiring."
        />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <ScrollReveal key={f.q} animation="fade-up" delay={i * 60}>
              <details className="group rounded-2xl border border-secondary/10 bg-white shadow-[0_14px_34px_-20px_rgba(19,107,171,0.35)] open:border-secondary/25">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold">{f.q}</h3>
                  <HiChevronDown className="h-5 w-5 flex-shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
