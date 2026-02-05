"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "flip" | "zoom" | "slide-up";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const animationClasses = {
    "fade-up": "opacity-0 translate-y-8",
    "fade-down": "opacity-0 -translate-y-8",
    "fade-left": "opacity-0 -translate-x-8",
    "fade-right": "opacity-0 translate-x-8",
    "scale": "opacity-0 scale-95",
    "flip": "opacity-0 rotate-12 scale-90",
    "zoom": "opacity-0 scale-50",
    "slide-up": "opacity-0 translate-y-16",
  };

  const visibleClasses = "opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0";

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all ease-out",
        animationClasses[animation],
        isVisible && visibleClasses,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
