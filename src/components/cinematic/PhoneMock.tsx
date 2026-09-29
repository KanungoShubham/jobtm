import { HiBadgeCheck, HiCheckCircle, HiUsers } from "react-icons/hi";
import { CountUp } from "./CountUp";

const ledger = [
  { label: "Identity Verified", pct: 100, done: true },
  { label: "Skills Profile", pct: 87, done: false },
  { label: "Document Check", pct: 100, done: true },
  { label: "Company Match", pct: 72, done: false },
];

const R = 44;
const CIRC = 2 * Math.PI * R;

/** The Jobstm app, as a phone. Everything inside animates on load. */
export function PhoneMock() {
  return (
    <div className="relative mx-auto w-[270px] rounded-[2.9rem] border border-white/20 bg-[#0a1a2d] p-2.5 shadow-[0_60px_140px_-30px_rgba(59,130,246,0.7)] sm:w-[310px]">
      {/* side buttons */}
      <span aria-hidden className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-white/25" />
      <span aria-hidden className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-white/25" />
      <span aria-hidden className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-white/25" />

      <div className="relative h-[600px] overflow-hidden rounded-[2.3rem] bg-gradient-to-b from-[#123458] via-[#0d2440] to-[#0a1a2d] px-4 pt-3 text-white">
        {/* notch + status */}
        <div aria-hidden className="absolute left-1/2 top-2.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-semibold text-white/80">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-sm bg-white/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
        </div>

        {/* toast */}
        <div className="cin-toast cin-glass absolute inset-x-3 top-9 z-30 flex items-center gap-3 rounded-2xl px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/20">
            <HiCheckCircle className="h-4 w-4 text-emerald-300" />
          </span>
          <span>
            <span className="block text-[11px] font-bold">Profile Verified!</span>
            <span className="block text-[10px] text-white/60">Just now</span>
          </span>
        </div>

        {/* header */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9fd0ff]/70">Live Status</p>
            <p className="font-heading text-base font-bold">Verification Dashboard</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        {/* ring */}
        <div className="relative mx-auto mt-5 h-32 w-32">
          <div aria-hidden className="absolute inset-2 rounded-full bg-[#3b82f6]/25 blur-2xl" />
          <svg viewBox="0 0 100 100" className="relative h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="#7bb8e8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              className="cin-ring"
              style={{ "--circ": CIRC, "--off": 0, filter: "drop-shadow(0 0 6px rgba(123,184,232,0.9))" } as React.CSSProperties}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black leading-none">100%</span>
            <span className="mt-1 text-[9px] uppercase tracking-wider text-white/60">Verified</span>
          </div>
        </div>

        {/* ledger */}
        <ul className="mt-5 space-y-3">
          {ledger.map((item, i) => (
            <li key={item.label} className="cin-item-in flex items-center gap-2.5" style={{ "--d": `${900 + i * 160}ms` } as React.CSSProperties}>
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg ${
                  item.done ? "bg-gradient-to-br from-[#136BAB] to-[#3b82f6]" : "bg-white/10"
                }`}
              >
                <HiCheckCircle className={`h-3.5 w-3.5 ${item.done ? "text-white" : "text-white/40"}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 flex items-center justify-between text-[10px]">
                  <span className="text-white/85">{item.label}</span>
                  <span className="font-bold text-[#9fd0ff]">{item.pct}%</span>
                </span>
                <span className="block h-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="cin-bar block h-full rounded-full bg-gradient-to-r from-[#136BAB] to-[#7bb8e8]"
                    style={{ width: `${item.pct}%`, "--d": `${1000 + i * 160}ms` } as React.CSSProperties}
                  />
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* matches */}
        <div className="cin-item-in cin-glass mt-5 flex items-center justify-between rounded-2xl px-3.5 py-3" style={{ "--d": "1700ms" } as React.CSSProperties}>
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3b82f6]/25">
              <HiUsers className="h-4 w-4 text-[#9fd0ff]" />
            </span>
            <span>
              <span className="block text-[11px] font-bold">Matches Found</span>
              <span className="block text-[10px] text-white/55">Verified companies</span>
            </span>
          </span>
          <span className="text-2xl font-bold text-[#9fd0ff]">
            <CountUp to={48} />
          </span>
        </div>

        <div className="cin-item-in mt-3 flex items-center justify-center gap-1.5 text-[10px] text-white/50" style={{ "--d": "1900ms" } as React.CSSProperties}>
          <HiBadgeCheck className="h-3.5 w-3.5 text-[#7bb8e8]" />
          Verified Platform
        </div>
      </div>
    </div>
  );
}
