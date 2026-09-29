export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="cin-marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-12 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            {t}
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#7bb8e8]" />
          </span>
        ))}
      </div>
    </div>
  );
}
