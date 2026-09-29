"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function LineDraw({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.5, rootMargin: "0px" });
  return (
    <div
      ref={elementRef}
      aria-hidden
      className={cn("cin-line-draw", isVisible && "is-visible", className)}
      style={style}
    />
  );
}
