# Design changelog

2026-08-19 — 12px flat body cap adopted with the "Signal" identity.
2026-08-20 — Retired. "Electric Blue & Amber" adopted. Plus Jakarta Sans.
             --step-0 moved to 0.875rem. Body 14px mobile, 16px desktop.
             h1 24px mobile, 48px desktop.
2026-08-23 — Article body on /insights/[slug] opened to 16px on mobile
             as the single approved exception. See DESIGN §1.
2026-08-25 — Two typefaces now. Previously one font did every job.
             Plus Jakarta Sans now handles headings and display text;
             Lexend handles body text, buttons, forms and small text.
             Body text weight capped at 500. Eyebrow labels moved to
             Lexend 500, no letter spacing, dark amber on light
             backgrounds and bright amber on dark bands. See DESIGN §1.
2026-08-26 — DESIGN corrected against globals.css after a drift audit. No token,
             component or CSS value changed; the document was wrong, not the
             implementation. globals.css was the source of truth throughout.
             Five drifts closed: (1) a leftover one-font paragraph in §1 still
             claimed Plus Jakarta Sans mapped onto every semantic font token,
             contradicting the two-face rule directly above it — globals.css
             maps --font-body and --font-sans to Lexend. (2) The §1 audit
             exception table cited scripts/audit-type-scale.mjs lines 45/145/
             259–262; the real lines are 47/154/316. (3) §4 pointed at
             src/components/ui/Navigation.tsx; Navigation lives in
             src/components/layout/. (4) The §3 utility table omitted
             .hover-lift-amber and .animate-fade-in. (5) The §2 token tables
             omitted --color-brand-soft #DBEAFE and --color-muted-invert
             #CBD5E1, the latter while §2 already instructed using
             text-muted-invert on dark bands.
2026-08-26 — Signal Stack primitives (§2.1). Three new files in
             src/components/ui/: Field.tsx (Input, Select, Textarea, Label,
             FieldError), IconTile.tsx, Chip.tsx. Two existing components
             extended, both opt-in and defaulting off so every current call
             site renders unchanged: Surface gains a `header` prop for the
             tinted header strip, and PageHero gains `spokeArc` and `signals`.
             No Card and no GlassPanel component were created — a tinted card
             is Surface + header, and a glass panel is Surface tone="glass".
             Button was not touched: its five shipped variants
             (primary/secondary/quiet/accent/danger) are correct and the
             handoff's primary|secondary|ghost|dark-glass was a spec defect.
             "ghost" maps onto the existing quiet; dark-glass was dropped
             because every dark band already uses variant="accent" and
             .glass-panel composes through className.
             New CSS: .spoke-arc / .spoke-ring in globals.css, with
             spoke-rotate and spoke-counter keyframes. Both colours derive
             from --color-brand via color-mix rather than new literals. Their
             46s / 28s loops are ambient and sit outside the --dur-1..4
             interaction scale, which tops out at 650ms; the global
             prefers-reduced-motion block collapses them to a rest frame.
             No new colour, type, shadow or radius value was introduced.
2026-08-26 — Signal Stack composites (§2.2). CardGrid, StageRail, SectionNav,
             Accordion, Carousel, CTABand, TrustMarquee, StickyCTABar in
             src/components/ui/, and IndexScale/IndexBandList in
             src/components/fdi/. [DESIGN CHANGE] for TrustMarquee (register
             item 4) and StickyCTABar (item 6).
             New CSS: .marquee / .marquee-track with the marquee-slide
             keyframe. The chip set renders twice and translates exactly -50%
             so the loop has no seam; the duplicate set is aria-hidden. Its
             32s loop is ambient and outside --dur-1..4, like the spoke arc.
             IndexScale reads band labels and ranges from FDI_1_1_CONFIG
             rather than restating them, so a recalibration cannot leave
             retired wording on screen. It renders empty unless given both an
             unrounded value and a display figure — there is no code path that
             shows a sample reading. PRODUCT §A6 and DESIGN §7 govern it.
             Accordion animates grid-template-rows 0fr->1fr, the one
             sanctioned layout-property animation, because height cannot
             transition from auto.
             No QuestionStepper component was created. The diagnostic flow
             already lives in FdiDiagnosticFlow.tsx, whose copy is asserted
             directly from PRODUCT by site-copy.test.ts; a competing component
             would fork governed copy. It is restyled in place instead.
