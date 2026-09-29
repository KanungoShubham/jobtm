import type { CSSProperties, ReactNode } from "react";

export const glassBadge =
  "cin-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#bfe0ff]";
export const outlineChip =
  "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/60";

interface PageHeroProps {
  badges?: ReactNode;
  title: string[];
  accent?: string[];
  description: string;
  children?: ReactNode;
}

/** Shared cinematic hero for inner pages. Ends in solid #060f1c so the next section can join it with a WaveTop. */
export function PageHero({ badges, title, accent = [], description, children }: PageHeroProps) {
  return (
    <section className="cin-hero relative overflow-hidden text-white" style={{ "--intro": "0ms" } as CSSProperties}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cin-aurora -left-32 -top-32 h-[520px] w-[520px] bg-[#136BAB]/35" />
        <div className="cin-aurora -right-40 top-1/4 h-[520px] w-[520px] bg-[#3b82f6]/18" style={{ animationDelay: "-6s" }} />
        <div className="cin-aurora bottom-[-200px] left-1/3 h-[440px] w-[440px] bg-[#0f4c7c]/40" style={{ animationDelay: "-11s" }} />
        <div className="cin-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-24 pt-32 text-center md:px-10 md:pb-32 md:pt-40">
        {badges && (
          <div className="cin-rise mb-7 flex flex-wrap items-center justify-center gap-2" style={{ "--d": "0ms" } as CSSProperties}>
            {badges}
          </div>
        )}

        <h1 className="mb-6 font-heading text-5xl font-bold leading-[1.05] tracking-tight [perspective:800px] sm:text-6xl md:text-7xl">
          {title.map((w, i) => (
            <span key={w + i} className="cin-word mr-[0.28em]" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          ))}
          {accent.map((w, i) => (
            <span key={w + i} className="cin-word mr-[0.28em] last:mr-0" style={{ "--i": title.length + i } as CSSProperties}>
              <span className="cin-shimmer-text">{w}</span>
            </span>
          ))}
        </h1>

        <p className="cin-rise mx-auto max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl" style={{ "--d": "600ms" } as CSSProperties}>
          {description}
        </p>

        {children && (
          <div className="cin-rise mt-10" style={{ "--d": "800ms" } as CSSProperties}>
            {children}
          </div>
        )}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-b from-transparent to-[#060f1c]" />
    </section>
  );
}
