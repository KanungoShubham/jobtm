"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

/** Short brand intro on the first visit of a session. Repeat visits skip it. */
export function IntroLoader() {
  const [state, setState] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("jstm-intro") === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      document.documentElement.style.setProperty("--intro", "0ms");
      setState("gone");
      return;
    }
    try {
      sessionStorage.setItem("jstm-intro", "1");
    } catch {}
    const t1 = setTimeout(() => setState("fade"), 1000);
    const t2 = setTimeout(() => setState("gone"), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-[#060f1c] transition-opacity duration-500",
        state === "fade" && "pointer-events-none opacity-0"
      )}
    >
      <div style={{ animation: "cin-loader-logo 0.8s cubic-bezier(0.2,0.7,0.2,1) both" }}>
        <Logo width={150} height={60} showText={false} light />
      </div>
      <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full origin-left rounded-full bg-gradient-to-r from-[#136BAB] to-[#9fd0ff]"
          style={{ animation: "cin-loader-bar 0.95s cubic-bezier(0.4,0,0.2,1) both" }}
        />
      </div>
    </div>
  );
}
