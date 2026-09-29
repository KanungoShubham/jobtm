# JobsTM Landing Page — Editorial Luxury Redesign

## Goal
Redesign the landing page (`src/app/page.tsx`, Header, Footer) as a modern, premium, editorial-luxury experience that is fully responsive. Brand, copy and features stay unchanged. Dashboards (jobseeker/employer/admin) are out of scope and get their own cycle later.

## Design system
- **Palette:** ivory background `#FAF7F2`, ink text `#14110F`, accent midnight navy `#0d1f35`, brand blue kept only as a thin accent. 1px hairline borders, minimal shadows.
- **Type:** serif display (Fraunces via next/font) for headlines, Sora/Inter for body. Large headlines, tight tracking, italic emphasis words. Fluid sizes with `clamp()`.
- **Layout:** 12-col grid, generous whitespace, numbered section labels ("01 — Verification"), asymmetric splits.
- **Imagery:** type and SVG/CSS illustration only (no stock photos).
- **Motion:** subtle fade-rise on scroll (existing ScrollReveal), line-draw underlines, logo/trust marquee. Respect `prefers-reduced-motion`.
- Tokens are added alongside existing CSS variables so non-landing pages keep working.

## Responsive requirements (hard)
- Mobile-first; verified at 360, 768, 1024, 1440px.
- No horizontal scroll at any width; touch targets >= 44px.
- Header collapses to a full-screen menu on mobile; multi-column splits stack; timelines turn vertical; headline sizes fluid.

## Structure
`src/components/landing/` with one component per section, composed by `page.tsx`:
Hero, StatsRow, PlatformManifesto, VerificationList, GigWorkers, Businesses, HowItWorks, WhyTrust, Testimonials, FinalCta. Plus restyled Header and Footer. Existing Button/ScrollReveal reused/extended.

## Sections
1. Hero: huge serif headline, verified badge, 2 CTAs.
2. Stats: hairline-divided numeric row.
3. One Platform: two-column manifesto.
4. Verification: numbered editorial list.
5. Gig Workers / 6. Businesses: alternating split features.
7. How It Works: horizontal timeline (vertical on mobile).
8. Why Trust Us: one large stat + compact list.
9. Testimonials: large pull quotes.
10. Final CTA: full-bleed ink block.

## Testing / done criteria
- `next build` and `next lint` pass.
- Visual check at the four breakpoints, no horizontal overflow.
- Other routes render unchanged.
