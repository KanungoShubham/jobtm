/** Curved edge that carries the previous section's colour into the top of the next one. */
export function WaveTop({ fill }: { fill: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] block h-10 w-full md:h-[72px]"
    >
      <path d="M0,0 H1440 V32 C1180,104 260,104 0,32 Z" fill={fill} />
    </svg>
  );
}
