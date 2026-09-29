# Landing Page Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the JobsTM landing page (Header, 10 sections, Footer) in an editorial-luxury visual style that is fully responsive.

**Architecture:** Add editorial design tokens (ivory/ink/navy palette, Fraunces display serif) alongside the existing CSS variables so non-landing pages are unaffected. Split the 800-line `src/app/page.tsx` into one server component per section under `src/components/landing/`, sharing three small primitives. Header keeps all session/auth logic and only changes markup/classes.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 3.4, `next/font/google`, `react-icons/hi`.

**Spec:** `docs/superpowers/specs/2026-09-29-landing-page-editorial-redesign-design.md`

## Global Constraints

- Palette: ivory `#FAF7F2`, paper `#F1ECE3`, ink `#14110F`, navy `#0d1f35`, brand blue `#136BAB` (existing `secondary`) only as thin accent.
- Display font: Fraunces (serif) via `next/font/google`; body font stays Inter/Sora as today.
- All copy/content stays exactly as in the current `page.tsx` (do not reword).
- Mobile-first; verified at 320, 360, 768, 1024, 1440px; no horizontal scroll; interactive targets >= 44px.
- Respect `prefers-reduced-motion`.
- No stock photos; type/CSS/SVG only.
- Existing CSS variables and Tailwind tokens (`primary`, `secondary`, `border`, ...) must keep working — dashboards depend on them.
- Repo has no test framework: verification is `npx tsc --noEmit`, `npm run build`, and the browser overflow check in Task 10. Do not add a test framework.

## Review Focus

- 320px-wide screen: long headline words must not overflow horizontally (Task 5 hero, Task 10 check).
- Logged-in header states (employer / jobseeker / advertiser) still show avatar dropdown on desktop and Dashboard/Sign Out on mobile (Task 3).
- `LaunchOfferBanner` still renders when the stats API fails / returns null (Task 6).
- `prefers-reduced-motion: reduce`: all content is visible and no motion runs (Task 1 CSS, Task 10 check).
- Mobile menu open: page behind does not scroll; menu closes after tapping a link (Task 3).
- Shared Header/Footer also wrap `/about`, `/services`, `/contact`, `/login`, `/privacy`, `/terms`: those pages must still render legibly under the new chrome (Task 10 check).

---

### Task 1: Design tokens, fonts, global CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (append at end)

**Interfaces:**
- Produces: Tailwind colors `ivory`, `paper`, `ink`, `navy`, `hairline`; font family `font-display`; CSS classes `.ed-container`, `.ed-display`, `.ed-h1`, `.ed-h2`, `.ed-marquee`, and `.ed-root` (reduced-motion scope).

- [ ] **Step 1: Record baseline**

Run: `npm run build`
Expected: note whether it passes. If it already fails, save the error summary; later tasks must not add new errors.

- [ ] **Step 2: Add colors and display font to Tailwind**

In `tailwind.config.ts`, inside `theme.extend.colors` add after `card: {...},`:

```ts
        ivory: "#FAF7F2",
        paper: "#F1ECE3",
        ink: "#14110F",
        navy: "#0d1f35",
        hairline: "#14110F1F",
```

and inside `theme.extend.fontFamily` add:

```ts
        display: ["var(--font-fraunces)", "Georgia", "serif"],
```

- [ ] **Step 3: Load Fraunces in layout**

In `src/app/layout.tsx` change the font import and setup:

```tsx
import { Inter, Sora, Fraunces } from "next/font/google";
```

add below the `sora` line:

```tsx
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
```

and change the body className to:

```tsx
      <body className={`${inter.variable} ${sora.variable} ${fraunces.variable} ${inter.className}`}>
```

- [ ] **Step 4: Append editorial CSS**

Append to the end of `src/app/globals.css`:

```css
/* ---------- Editorial landing system ---------- */
.ed-container {
  width: 100%;
  max-width: 78rem;
  margin-inline: auto;
  padding-inline: 1.25rem;
}
@media (min-width: 768px) {
  .ed-container {
    padding-inline: 2.5rem;
  }
}

.ed-display {
  font-family: var(--font-fraunces), Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.04;
  overflow-wrap: break-word;
}
.ed-h1 {
  font-size: clamp(2.5rem, 9vw, 6.25rem);
}
.ed-h2 {
  font-size: clamp(2rem, 5.5vw, 3.75rem);
}

@keyframes ed-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.ed-marquee {
  animation: ed-marquee 40s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ed-root *,
  .ed-root *::before,
  .ed-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
  }
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat(ui): add editorial design tokens and Fraunces display font"
```

---

### Task 2: Shared landing primitives

**Files:**
- Create: `src/components/landing/primitives.tsx`

**Interfaces:**
- Produces:
  - `SectionLabel({ n, children, tone? }: { n: string; children: React.ReactNode; tone?: "light" | "dark" })`
  - `SectionHeading({ children, className?, tone? }: { children: React.ReactNode; className?: string; tone?: "light" | "dark" })` → renders `<h2>`
  - `CtaLink({ href, children, variant?, className? })` where `variant: "solid" | "ghost" | "light" | "lightGhost"` (default `"solid"`); renders a `next/link` with trailing arrow, min height 48px.
  - `tone="dark"` means the section background is dark (text is ivory).

- [ ] **Step 1: Create the file**

```tsx
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function SectionLabel({
  n,
  children,
  tone = "light",
}: {
  n: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-ivory/60" : "text-ink/60"
      )}
    >
      <span className="ed-display text-sm normal-case tracking-normal">{n}</span>
      <span aria-hidden className={cn("h-px w-8", tone === "dark" ? "bg-ivory/30" : "bg-ink/30")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <h2
      className={cn(
        "ed-display ed-h2",
        tone === "dark" ? "text-ivory" : "text-ink",
        className
      )}
    >
      {children}
    </h2>
  );
}

type Variant = "solid" | "ghost" | "light" | "lightGhost";

const variantStyles: Record<Variant, string> = {
  solid: "bg-ink text-ivory hover:bg-navy",
  ghost: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  light: "bg-ivory text-ink hover:bg-white",
  lightGhost: "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
};

export function CtaLink({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
        variantStyles[variant],
        className
      )}
    >
      {children}
      <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/primitives.tsx
git commit -m "feat(ui): add landing primitives (SectionLabel, SectionHeading, CtaLink)"
```

---

### Task 3: Header restyle (logic untouched)

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: existing `Session`, `readSession`, `navigation`, state vars — unchanged.
- Produces: same exported `Header()`; header height stays `h-16` (64px) because `ConditionalShell` applies `pt-16`.

- [ ] **Step 1: Lock body scroll while mobile menu is open**

In `Header.tsx`, after the `handleClick` effect (the one ending with `document.removeEventListener("mousedown", handleClick)`), add:

```tsx
  React.useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
```

- [ ] **Step 2: Header shell**

Replace the `<header className={cn(...)}>` opening (the `cn("fixed top-0 ... border-b border-gray-100 bg-white transition-shadow duration-300", isScrolled && "shadow-sm")`) with:

```tsx
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b bg-ivory/90 backdrop-blur-md transition-colors duration-300",
        isScrolled ? "border-hairline" : "border-transparent"
      )}
    >
```

Replace `<nav className="container flex items-center justify-between h-16 px-6 md:px-12">` with `<nav className="ed-container flex h-16 items-center justify-between">`.

- [ ] **Step 4: Desktop links and login button**

Replace the desktop nav link className expression:

```tsx
              className={cn(
                "text-sm font-medium transition-colors duration-200 hover:text-secondary",
                pathname === item.href
                  ? "text-secondary font-semibold"
                  : "text-foreground/70"
              )}
```

with:

```tsx
              className={cn(
                "text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 hover:text-ink",
                pathname === item.href
                  ? "text-ink underline decoration-secondary decoration-2 underline-offset-8"
                  : "text-ink/60"
              )}
```

Replace the desktop Login link className `"flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 bg-secondary"` with `"inline-flex min-h-[44px] items-center rounded-full bg-ink px-6 text-xs font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-navy"`.

Replace both `border-l border-gray-200` wrapper classes (`pl-4 border-l border-gray-200`) with `pl-4 border-l border-hairline`. Replace the dropdown container `rounded-xl border border-gray-100 bg-white shadow-lg` with `rounded-2xl border border-hairline bg-ivory shadow-xl`.

- [ ] **Step 5: Mobile toggle button**

Replace the mobile `<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden inline-flex ...">` opening tag with:

```tsx
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="md:hidden -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
        >
```

- [ ] **Step 6: Mobile menu as full-screen sheet**

Replace `<div className="md:hidden border-t border-gray-100 bg-white">` with:

```tsx
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-hairline bg-ivory">
```

Replace `<div className="container py-4 space-y-1 px-6">` with `<div className="ed-container py-8 space-y-1">`.

Replace the mobile nav link className expression:

```tsx
                className={cn(
                  "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  pathname === item.href
                    ? "bg-secondary/10 text-secondary font-semibold"
                    : "text-foreground/70 hover:bg-gray-50 hover:text-foreground"
                )}
```

with:

```tsx
                className={cn(
                  "ed-display block border-b border-hairline py-4 text-3xl transition-colors",
                  pathname === item.href ? "text-secondary italic" : "text-ink"
                )}
```

Replace remaining mobile `border-t border-gray-100` occurrences (two, on the session/login blocks) with `border-t border-hairline`, and change `rounded-xl` on the three login links and Dashboard/Sign Out buttons to `rounded-full` and add `min-h-[48px]` to each of their classNames. Leave the per-role inline background colors as they are (they identify role).

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors. (Behavioural check happens in Task 10.)

- [ ] **Step 8: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat(ui): editorial header with full-screen mobile menu"
```

---

### Task 4: Footer restyle

**Files:**
- Modify (full rewrite): `src/components/Footer.tsx`

**Interfaces:**
- Produces: same exported `Footer()`. Keeps all existing links/contact data verbatim.

- [ ] **Step 1: Replace the file contents**

```tsx
import Link from "next/link";
import { HiMail, HiPhone, HiGlobe, HiLocationMarker } from "react-icons/hi";
import { Logo } from "./ui/Logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Vocational Training", href: "/services" },
  { name: "Manpower Hiring", href: "/services" },
  { name: "Promotion Activities", href: "/services" },
  { name: "Upskill & Grow", href: "/services" },
];

const linkClass = "text-sm text-ink/65 transition-colors hover:text-ink";
const headingClass = "mb-5 text-xs font-medium uppercase tracking-[0.18em] text-ink/50";

export function Footer() {
  return (
    <footer className="bg-paper text-ink">
      <div className="ed-container py-16 md:py-24">
        <p className="ed-display ed-h2 max-w-3xl">
          Verified talent, <em className="italic text-secondary">trusted hiring.</em>
        </p>

        <div className="mt-14 grid gap-12 border-t border-hairline pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 inline-flex">
              <Logo width={110} height={44} showText={false} />
            </Link>
            <p className="text-sm leading-relaxed text-ink/65">
              A secure, verification-first gig hiring platform connecting qualified
              workers with trusted companies. By Maikal and Taksharya Pvt Limited.
            </p>
          </div>

          <div>
            <h3 className={headingClass}>Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.name}>
                  <Link href={s.href} className={linkClass}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Contact</h3>
            <div className="space-y-3">
              <a href="mailto:infomnt01@gmail.com" className={`flex items-center gap-2.5 ${linkClass}`}>
                <HiMail className="h-4 w-4 flex-shrink-0 text-secondary" />
                infomnt01@gmail.com
              </a>
              <a href="tel:+919669099914" className={`flex items-center gap-2.5 ${linkClass}`}>
                <HiPhone className="h-4 w-4 flex-shrink-0 text-secondary" />
                +91 9669099914
              </a>
              <a href="https://jobstm.co" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2.5 ${linkClass}`}>
                <HiGlobe className="h-4 w-4 flex-shrink-0 text-secondary" />
                jobstm.co
              </a>
              <div className="flex items-start gap-2.5 text-sm text-ink/65">
                <HiLocationMarker className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                <span>03 Friends Colony, Punjab Colony,<br />Khandwa, MP 450001, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="ed-container flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-xs text-ink/50">
            © 2026 Jobstm · Maikal and Taksharya Pvt Limited · All rights reserved.
          </p>
          <p className="text-xs text-ink/50">Khandwa, Madhya Pradesh, India</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(ui): editorial footer"
```

---

### Task 5: Hero and StatsRow

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/StatsRow.tsx`

**Interfaces:**
- Consumes: `CtaLink` from `./primitives`; `ScrollReveal` from `@/components/ui/ScrollReveal`.
- Produces: `Hero()`, `StatsRow()` (server components, no props).

- [ ] **Step 1: Create `Hero.tsx`**

```tsx
import { HiBadgeCheck, HiLightningBolt, HiShieldCheck } from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CtaLink } from "./primitives";

const ledger = [
  { label: "Identity Verified", pct: 100 },
  { label: "Skills Profile", pct: 87 },
  { label: "Document Check", pct: 100 },
  { label: "Company Match", pct: 72 },
];

const trust = [
  { icon: HiShieldCheck, label: "100% Verified" },
  { icon: HiLightningBolt, label: "Fast Onboarding" },
  { icon: HiBadgeCheck, label: "Trusted Platform" },
];

export function Hero() {
  return (
    <section className="bg-ivory pb-16 pt-10 md:pb-24 md:pt-20">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/60">
            <span className="inline-flex items-center gap-2">
              <HiBadgeCheck className="h-4 w-4 text-secondary" />
              Verification-First Platform
            </span>
            <span aria-hidden className="hidden h-px w-8 bg-ink/30 sm:block" />
            <span>Khandwa, MP · Since 2011</span>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="ed-display ed-h1 mt-6 max-w-5xl">
            Trusted gig hiring.{" "}
            <em className="italic text-secondary">Verified talent.</em>
          </h1>
        </ScrollReveal>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-6">
            <p className="max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl">
              We are building a secure, verification-first gig hiring ecosystem
              that connects qualified gig workers with trusted companies—quickly,
              transparently, and at scale.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/login" variant="solid">Get Started</CtaLink>
              <CtaLink href="/contact" variant="ghost">Contact Us</CtaLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink/70">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-secondary" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink/55">
              <span className="font-semibold text-ink">4.9/5</span> · Trusted by verified workers &amp; companies
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300} className="lg:col-span-5 lg:col-start-8">
            <div className="border border-ink/15 bg-paper p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-hairline pb-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/50">Live Status</p>
                  <h2 className="ed-display mt-1 text-2xl">Verification Dashboard</h2>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-medium text-ink/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 motion-safe:animate-pulse" />
                  Active
                </span>
              </div>
              <ul className="divide-y divide-hairline">
                {ledger.map((item) => (
                  <li key={item.label} className="py-4">
                    <div className="mb-2 flex items-baseline justify-between text-sm">
                      <span className="text-ink/80">{item.label}</span>
                      <span className="ed-display text-lg">{item.pct}%</span>
                    </div>
                    <div className="h-px w-full bg-ink/15">
                      <div className="h-px bg-ink" style={{ width: `${item.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between border-t border-hairline pt-5 text-sm">
                <span className="text-ink/60">Faster Hiring</span>
                <span className="ed-display text-2xl text-secondary">2.4×</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `StatsRow.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  { number: "100%", label: "Verified Profiles" },
  { number: "Zero", label: "Duplicate Records" },
  { number: "Fast", label: "Hiring Process" },
  { number: "Secure", label: "Document Gateway" },
];

export function StatsRow() {
  return (
    <section className="bg-ivory">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-2 gap-px border-y border-hairline bg-hairline md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-ivory px-4 py-8 md:px-8 md:py-12">
                <div className="ed-display text-4xl md:text-5xl">{s.number}</div>
                <div className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-ink/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Hero.tsx src/components/landing/StatsRow.tsx
git commit -m "feat(ui): editorial hero and stats row"
```

---

### Task 6: LaunchOfferBanner restyle, PlatformManifesto, VerificationList

**Files:**
- Modify: `src/components/sections/LaunchOfferBanner.tsx` (classes only)
- Create: `src/components/landing/PlatformManifesto.tsx`
- Create: `src/components/landing/VerificationList.tsx`

**Interfaces:**
- Consumes: `SectionLabel`, `SectionHeading` from `./primitives`; `ScrollReveal`.
- Produces: `PlatformManifesto()`, `VerificationList()`.

- [ ] **Step 1: Restyle `LaunchOfferBanner.tsx` — classes only**

Read the whole file first. Do NOT change the `useEffect`, `stats` state, `publicApi` usage, or any rendered text/logic. Apply only these class substitutions across the JSX:

| Find | Replace with |
|---|---|
| section `bg-white border-b border-border/40` | `bg-ivory border-b border-hairline` |
| blur blobs (`blur-3xl` decorative divs) | remove the decorative divs |
| `container` | `ed-container` |
| `rounded-3xl`, `rounded-2xl`, `rounded-xl` on cards/tiles | `rounded-none` |
| card `bg-white`/`shadow-*`/colored `bg-*` backgrounds | `bg-paper border border-ink/15` (no shadows) |
| numbers (`text-2xl`/`text-3xl font-bold` stat values) | add `ed-display font-normal` |
| CTA links/buttons | `rounded-full bg-ink text-ivory hover:bg-navy` |
| any `font-heading` | `ed-display` |

Keep every fallback (e.g. `stats?.total_jobs ?? "—"`) exactly as is.

- [ ] **Step 2: Create `PlatformManifesto.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel, SectionHeading } from "./primitives";

const items = [
  { title: "No Duplicate Storage", description: "Single centralized database ensures data integrity and consistency across the platform" },
  { title: "No Fragmented Records", description: "One verified profile per user maintained in our unified system of record" },
  { title: "Secure Gateway", description: "Professional onboarding portal with all data residing in the secure Jobstm core" },
];

export function PlatformManifesto() {
  return (
    <section className="bg-navy py-20 text-ivory md:py-32">
      <div className="ed-container grid gap-12 lg:grid-cols-12 lg:gap-8">
        <ScrollReveal animation="fade-up" className="lg:col-span-5">
          <SectionLabel n="01" tone="dark">Core Infrastructure</SectionLabel>
          <SectionHeading tone="dark" className="mt-6">
            One platform. <em className="italic text-[#7bb8e8]">One source of truth.</em>
          </SectionHeading>
          <p className="mt-6 max-w-md text-lg text-ivory/65">
            All user data and documents are securely managed within our core Jobstm system.
          </p>
        </ScrollReveal>

        <ol className="lg:col-span-7">
          {items.map((item, i) => (
            <li key={item.title} className="border-t border-ivory/15">
              <ScrollReveal animation="fade-up" delay={i * 100} className="grid grid-cols-[3rem_1fr] gap-4 py-8 md:grid-cols-[4rem_1fr] md:py-10">
                <span className="ed-display text-2xl text-ivory/40 md:text-3xl">0{i + 1}</span>
                <div>
                  <h3 className="ed-display text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-ivory/60">{item.description}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `VerificationList.tsx`**

```tsx
import { HiCheckCircle } from "react-icons/hi";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel, SectionHeading } from "./primitives";

const columns = [
  {
    audience: "Gig Workers",
    verify: ["Identity", "Education", "Availability"],
    why: ["Genuine profiles only", "Faster shortlisting for companies", "Higher trust for hiring companies"],
    tag: "Ready-to-hire, verified talent from day one.",
  },
  {
    audience: "Companies",
    verify: ["Identity", "Contact", "Auth Rep"],
    why: ["Safe hiring environment", "Trusted job postings", "Better engagement from gig workers"],
    tag: null,
  },
];

export function VerificationList() {
  return (
    <section className="bg-paper py-20 md:py-32">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <SectionLabel n="02">Verification Process</SectionLabel>
          <SectionHeading className="mt-6 max-w-3xl">
            Verification-first <em className="italic text-secondary">onboarding</em>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-lg text-ink/65 text-balance">
            Our platform is designed to meet modern hiring standards, combining technology, compliance, and ease of use.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-16">
          {columns.map((col, i) => (
            <ScrollReveal key={col.audience} animation="fade-up" delay={i * 120}>
              <div className="border-t-2 border-ink pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/50">For</p>
                <h3 className="ed-display mt-1 text-3xl md:text-4xl">{col.audience}</h3>

                <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-[0.18em] text-ink/50">What we verify</p>
                <ul className="flex flex-wrap gap-2">
                  {col.verify.map((v) => (
                    <li key={v} className="rounded-full border border-ink/20 px-4 py-2 text-sm">
                      {v}
                    </li>
                  ))}
                </ul>

                <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-[0.18em] text-ink/50">Why it matters</p>
                <ul className="space-y-3">
                  {col.why.map((w) => (
                    <li key={w} className="flex items-start gap-3 text-ink/80">
                      <HiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                      {w}
                    </li>
                  ))}
                </ul>

                {col.tag && (
                  <p className="ed-display mt-8 border-l-2 border-secondary pl-4 text-xl italic">{col.tag}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-16 flex flex-col gap-2 border-y border-hairline py-8 md:flex-row md:items-baseline md:gap-10">
            <h4 className="ed-display text-2xl md:w-1/3">Platform Promise</h4>
            <p className="text-lg text-ink/70 md:w-2/3">
              Only verified users on both sides. Every hire is backed by real identity and document checks.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors. Then `git diff src/components/sections/LaunchOfferBanner.tsx` and confirm only `className` strings and removed decorative divs changed (no logic lines).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/LaunchOfferBanner.tsx src/components/landing/PlatformManifesto.tsx src/components/landing/VerificationList.tsx
git commit -m "feat(ui): editorial banner, manifesto and verification sections"
```

---

### Task 7: FeatureSplit, GigWorkers, Businesses

**Files:**
- Create: `src/components/landing/FeatureSplit.tsx`
- Create: `src/components/landing/GigWorkers.tsx`
- Create: `src/components/landing/Businesses.tsx`

**Interfaces:**
- Produces:
  - `FeatureSplit(props: FeatureSplitProps)` with
    ```ts
    type IconType = React.ComponentType<{ className?: string }>;
    interface FeatureSplitProps {
      n: string; label: string; title: React.ReactNode; lead: string;
      features: { icon: IconType; title: string; desc: string }[];
      cta: { href: string; label: string };
      panel: {
        title: string; status: string;
        stats: { val: string; label: string }[];
        rows: { icon: IconType; label: string; value: string }[];
      };
      flip?: boolean;      // panel on the left on desktop
      tone?: "ivory" | "paper";
    }
    ```
  - `GigWorkers()`, `Businesses()`.

- [ ] **Step 1: Create `FeatureSplit.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { CtaLink, SectionLabel, SectionHeading } from "./primitives";

type IconType = React.ComponentType<{ className?: string }>;

export interface FeatureSplitProps {
  n: string;
  label: string;
  title: React.ReactNode;
  lead: string;
  features: { icon: IconType; title: string; desc: string }[];
  cta: { href: string; label: string };
  panel: {
    title: string;
    status: string;
    stats: { val: string; label: string }[];
    rows: { icon: IconType; label: string; value: string }[];
  };
  flip?: boolean;
  tone?: "ivory" | "paper";
}

export function FeatureSplit({ n, label, title, lead, features, cta, panel, flip, tone = "ivory" }: FeatureSplitProps) {
  return (
    <section className={cn("py-20 md:py-32", tone === "paper" ? "bg-paper" : "bg-ivory")}>
      <div className="ed-container grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <ScrollReveal animation="fade-up" className={cn("lg:col-span-6", flip && "lg:order-2 lg:col-start-7")}>
          <SectionLabel n={n}>{label}</SectionLabel>
          <SectionHeading className="mt-6">{title}</SectionHeading>
          <p className="mt-6 max-w-lg text-lg text-ink/65">{lead}</p>
          <ul className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {features.map(({ icon: Icon, title: t, desc }) => (
              <li key={t} className="bg-ivory p-5">
                <Icon className="h-5 w-5 text-secondary" />
                <h3 className="mt-4 text-sm font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-ink/60">{desc}</p>
              </li>
            ))}
          </ul>
          <CtaLink href={cta.href} className="mt-10">{cta.label}</CtaLink>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
          <div className="border border-ink/15 bg-white">
            <div className="flex items-center justify-between gap-3 bg-ink px-6 py-4 text-ivory">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/50">Jobstm</p>
                <p className="ed-display text-xl">{panel.title}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-ivory/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                {panel.status}
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-hairline border-b border-hairline">
              {panel.stats.map((s) => (
                <div key={s.label} className="px-2 py-5 text-center">
                  <div className="ed-display text-2xl">{s.val}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-ink/50">{s.label}</div>
                </div>
              ))}
            </div>
            <ul className="divide-y divide-hairline">
              {panel.rows.map(({ icon: Icon, label: l, value }) => (
                <li key={l} className="flex items-center justify-between gap-3 px-6 py-4">
                  <span className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-secondary" />
                    {l}
                  </span>
                  <span className="text-xs font-semibold text-ink/70">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `GigWorkers.tsx`**

```tsx
import { HiBadgeCheck, HiClock, HiTrendingUp, HiViewGridAdd } from "react-icons/hi";
import { FeatureSplit } from "./FeatureSplit";

export function GigWorkers() {
  return (
    <FeatureSplit
      n="03"
      label="For Gig Workers"
      title={<>Find work that <em className="italic text-secondary">fits your life</em></>}
      lead="Take control of your career with flexible gig opportunities that match your skills and schedule."
      features={[
        { icon: HiClock, title: "Flexible Schedule", desc: "Work when you want" },
        { icon: HiTrendingUp, title: "Grow Income", desc: "Multiple streams" },
        { icon: HiViewGridAdd, title: "Skill Matched", desc: "Right opportunities" },
        { icon: HiBadgeCheck, title: "Build Reputation", desc: "Ratings & reviews" },
      ]}
      cta={{ href: "/contact", label: "Start Working Today" }}
      panel={{
        title: "Worker Dashboard",
        status: "Live",
        stats: [
          { val: "100%", label: "Verified" },
          { val: "48", label: "Matches" },
          { val: "4.9★", label: "Rating" },
        ],
        rows: [
          { icon: HiBadgeCheck, label: "Identity Verified", value: "✓ Complete" },
          { icon: HiClock, label: "Availability Set", value: "Weekdays" },
          { icon: HiViewGridAdd, label: "Skills Matched", value: "Smart AI" },
          { icon: HiTrendingUp, label: "Income Track", value: "Growing" },
        ],
      }}
    />
  );
}
```

- [ ] **Step 3: Create `Businesses.tsx`**

```tsx
import { HiBadgeCheck, HiLightningBolt, HiShieldCheck, HiTrendingUp, HiViewGridAdd } from "react-icons/hi";
import { FeatureSplit } from "./FeatureSplit";

export function Businesses() {
  return (
    <FeatureSplit
      n="04"
      label="For Businesses"
      title={<>Hire skilled talent <em className="italic text-secondary">on-demand</em></>}
      lead="Scale your workforce instantly with qualified gig workers ready to deliver results."
      features={[
        { icon: HiLightningBolt, title: "Fast Hiring", desc: "Connect in minutes" },
        { icon: HiShieldCheck, title: "Pre-Verified", desc: "Background checked" },
        { icon: HiTrendingUp, title: "Cost-Effective", desc: "Pay per work" },
        { icon: HiViewGridAdd, title: "Quality Tracked", desc: "Ratings & reviews" },
      ]}
      cta={{ href: "/contact", label: "Post Your First Job" }}
      flip
      tone="paper"
      panel={{
        title: "Hiring Dashboard",
        status: "Active",
        stats: [
          { val: "12", label: "Hired" },
          { val: "3min", label: "Avg. Match" },
          { val: "0", label: "Fraud Cases" },
        ],
        rows: [
          { icon: HiLightningBolt, label: "Onboarding Speed", value: "Minutes" },
          { icon: HiShieldCheck, label: "Background Checked", value: "All Workers" },
          { icon: HiTrendingUp, label: "Cost Efficiency", value: "High" },
          { icon: HiBadgeCheck, label: "Quality Rating", value: "Tracked" },
        ],
      }}
    />
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/FeatureSplit.tsx src/components/landing/GigWorkers.tsx src/components/landing/Businesses.tsx
git commit -m "feat(ui): editorial feature splits for workers and businesses"
```

---

### Task 8: HowItWorks and WhyTrust

**Files:**
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/WhyTrust.tsx`

**Interfaces:**
- Produces: `HowItWorks()`, `WhyTrust()`.

- [ ] **Step 1: Create `HowItWorks.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel, SectionHeading } from "./primitives";

const steps = [
  { title: "Sign Up", description: "Create your free account in minutes with secure authentication" },
  { title: "Complete Profile", description: "Add skills, experience, and preferences for smart matching" },
  { title: "Browse & Apply", description: "Explore gigs or post jobs, then connect with the perfect match" },
  { title: "Work & Earn", description: "Complete projects, get paid, and build your reputation" },
];

export function HowItWorks() {
  return (
    <section className="bg-ivory py-20 md:py-32">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <SectionLabel n="05">Simple Process</SectionLabel>
          <SectionHeading className="mt-6 max-w-3xl">
            How Jobstm <em className="italic text-secondary">works</em>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-lg text-ink/65">
            Getting started is simple. Follow these four steps to begin your gig work journey.
          </p>
        </ScrollReveal>

        <ol className="mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative border-t border-ink/25 pt-8">
              <span aria-hidden className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-secondary" />
              <ScrollReveal animation="fade-up" delay={i * 120}>
                <span className="ed-display text-5xl text-ink/25 md:text-6xl">0{i + 1}</span>
                <h3 className="ed-display mt-4 text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.description}</p>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `WhyTrust.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel, SectionHeading } from "./primitives";

const benefits = [
  { title: "Verified Profiles", description: "Both sides verified for trust and safety" },
  { title: "Faster Hiring", description: "Streamlined onboarding and matching process" },
  { title: "Professional Experience", description: "Business-grade platform and support" },
  { title: "Compliance-Ready", description: "Industry-standard data handling and security" },
  { title: "Secure Documents", description: "Centralized, encrypted document management" },
  { title: "Long-Term Scalability", description: "Built to grow with your needs" },
];

export function WhyTrust() {
  return (
    <section className="bg-ink py-20 text-ivory md:py-32">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <SectionLabel n="06" tone="dark">Trust &amp; Safety</SectionLabel>
          <SectionHeading tone="dark" className="mt-6 max-w-4xl">
            Why companies &amp; gig workers <em className="italic text-[#7bb8e8]">trust us</em>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-lg text-ivory/60">
            Built for scale, security, and speed with industry-standard practices
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <ScrollReveal animation="fade-up" className="lg:col-span-5">
            <div className="ed-display text-[clamp(5rem,16vw,10rem)] leading-none">0</div>
            <p className="mt-2 text-sm text-ivory/70">Fraud cases reported to date</p>
            <div className="my-8 h-px w-full bg-ivory/15" />
            <div className="ed-display text-[clamp(5rem,16vw,10rem)] leading-none text-[#7bb8e8]">2×</div>
            <p className="mt-2 text-sm text-ivory/70">Faster hiring than industry average</p>
          </ScrollReveal>

          <ul className="grid gap-px bg-ivory/15 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b, i) => (
              <li key={b.title} className="bg-ink p-6 md:p-8">
                <ScrollReveal animation="fade-up" delay={i * 80}>
                  <h3 className="ed-display text-xl">{b.title}</h3>
                  <p className="mt-2 text-sm text-ivory/60">{b.description}</p>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/WhyTrust.tsx src/components/landing/PlatformManifesto.tsx
git commit -m "feat(ui): editorial how-it-works timeline and trust section"
```

---

### Task 9: Testimonials and FinalCta

**Files:**
- Create: `src/components/landing/Testimonials.tsx`
- Create: `src/components/landing/FinalCta.tsx`

**Interfaces:**
- Consumes: `CtaLink`, `SectionLabel`, `SectionHeading`.
- Produces: `Testimonials()`, `FinalCta()`.

- [ ] **Step 1: Create `Testimonials.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel, SectionHeading } from "./primitives";

const quotes = [
  { quote: "Jobstm helped me find verified gig work within days. The verification process gave companies confidence to hire me immediately.", name: "Ravi Sharma", role: "Gig Worker · Khandwa" },
  { quote: "We hired 12 verified workers in one week. Zero background-check issues. The platform's verification-first approach saved us hours.", name: "Priya Mehta", role: "HR Manager · Indore" },
  { quote: "As a student, getting my first gig was seamless. My verified profile stood out and I got matched with the right opportunity instantly.", name: "Ankit Verma", role: "Student Worker · MP" },
];

export function Testimonials() {
  const [lead, ...rest] = quotes;
  return (
    <section className="bg-paper py-20 md:py-32">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <SectionLabel n="07">What People Say</SectionLabel>
          <SectionHeading className="mt-6 max-w-3xl">
            Trusted by workers &amp; <em className="italic text-secondary">companies</em>
          </SectionHeading>
          <p className="mt-6 text-lg text-ink/65">Here&apos;s what our verified users have to say</p>
        </ScrollReveal>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <ScrollReveal animation="fade-up" className="lg:col-span-7">
            <figure>
              <blockquote className="ed-display text-2xl italic leading-snug md:text-4xl">
                &ldquo;{lead.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-hairline pt-4">
                <p className="text-sm font-semibold">{lead.name}</p>
                <p className="text-sm text-ink/60">{lead.role}</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <div className="space-y-10 lg:col-span-5">
            {rest.map((t, i) => (
              <ScrollReveal key={t.name} animation="fade-up" delay={(i + 1) * 120}>
                <figure className="border-t border-ink/25 pt-6">
                  <blockquote className="text-lg leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-sm text-ink/60">{t.role}</p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `FinalCta.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CtaLink } from "./primitives";

export function FinalCta() {
  return (
    <section className="bg-navy py-24 text-ivory md:py-40">
      <div className="ed-container">
        <ScrollReveal animation="fade-up">
          <h2 className="ed-display ed-h1 max-w-5xl">
            Ready to transform <em className="italic text-[#7bb8e8]">your work life?</em>
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-ivory/70 md:text-xl">
            Join Jobstm today and discover the freedom of gig work or the
            flexibility of on-demand hiring
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/contact" variant="light">Sign Up Now</CtaLink>
            <CtaLink href="/about" variant="lightGhost">Learn More</CtaLink>
          </div>
          <p className="mt-14 border-t border-ivory/15 pt-6 text-sm text-ivory/55">
            Proudly built by{" "}
            <span className="font-semibold text-ivory/80">Maikal and Taksharya Pvt Limited</span>{" "}
            • Indore, Madhya Pradesh
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Testimonials.tsx src/components/landing/FinalCta.tsx
git commit -m "feat(ui): editorial testimonials and final CTA"
```

---

### Task 10: Compose page, build, responsive verification

**Files:**
- Modify (full rewrite): `src/app/page.tsx`

**Interfaces:**
- Consumes: all landing components plus `LaunchOfferBanner`.

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/landing/Hero";
import { StatsRow } from "@/components/landing/StatsRow";
import { PlatformManifesto } from "@/components/landing/PlatformManifesto";
import { VerificationList } from "@/components/landing/VerificationList";
import { GigWorkers } from "@/components/landing/GigWorkers";
import { Businesses } from "@/components/landing/Businesses";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyTrust } from "@/components/landing/WhyTrust";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCta } from "@/components/landing/FinalCta";
import { LaunchOfferBanner } from "@/components/sections/LaunchOfferBanner";

export default function HomePage() {
  return (
    <div className="ed-root overflow-x-hidden bg-ivory text-ink">
      <Hero />
      <StatsRow />
      <LaunchOfferBanner />
      <PlatformManifesto />
      <VerificationList />
      <GigWorkers />
      <Businesses />
      <HowItWorks />
      <WhyTrust />
      <Testimonials />
      <FinalCta />
    </div>
  );
}
```

- [ ] **Step 2: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run build`
Expected: passes (or matches the Task 1 baseline). Also run `npm run lint` and compare with baseline; fix any new warnings in touched files.

- [ ] **Step 3: Run the dev server and check responsiveness**

Run: `npm run dev` (use the `run` skill/browser tooling), open `http://localhost:3000`. At each width **320, 360, 768, 1024, 1440** run in the browser console:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true` at every width. Also visually confirm: hero headline wraps without clipping at 320; stats grid is 2-col below 768 and 4-col above; feature splits stack on mobile with the panel below the copy; Businesses panel is on the left on desktop only; HowItWorks is 1-col on mobile, 4-col at 768+; no element smaller than 44px tall for links/buttons.

- [ ] **Step 4: Check the Review Focus items**

1. Header, logged out: desktop Login pill and mobile menu (open: page behind doesn't scroll; tap a link → menu closes and scroll unlocks).
2. Header, logged in: in the console set a session as the app does (login through `/employer/login` or `/jobseeker/login`, or set the tokens used by `src/lib/roleAuth.ts`) and confirm desktop dropdown shows Dashboard/Profile/Sign Out and mobile shows Dashboard/Sign Out.
3. Block the stats request (DevTools → block `publicApi.getStats` URL) and reload: `LaunchOfferBanner` still renders with fallbacks.
4. DevTools → Rendering → "Emulate prefers-reduced-motion: reduce": all sections visible, no marquee/pulse motion.
5. Visit `/about`, `/services`, `/contact`, `/login`, `/privacy`, `/terms`: content legible under the new Header/Footer, no horizontal scroll.
6. Tab through the page: focus rings visible on `CtaLink`s and nav.

Fix anything that fails, re-run Step 2.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(ui): compose editorial landing page"
```
