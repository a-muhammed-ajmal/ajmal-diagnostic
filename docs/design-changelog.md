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
2026-08-26 — [DESIGN CHANGE] register items 2, 3 and 7.
             Item 2, orb drift: orbs were static. .orb-drift / .orb-drift-slow
             translate <=18px and scale <=1.06 over 22s / 18s, alternating.
             Transform only, so it stays on the compositor. Guarded by its own
             prefers-reduced-motion block as well as the global one.
             Item 3, CTA shine: .cta-shine sweeps a 38%-wide highlight across a
             primary CTA over 3.4s. One instance per viewport, primary only —
             the Home hero. The sheen is color-mix over --color-canvas, not a
             new literal.
             Item 7, horizontal stage rail: .stage-rail-snap is a presentation
             variant over the same data at >=768px, Home only. StageRail gains
             an opt-in `snap` prop defaulting false; the vertical rail stays the
             default on Services and About.
             Register item 8, a dedicated tint-surface border token, is NOT
             needed and will not ship. Tinted surfaces use --color-line on
             --color-brand-tint, which reads correctly; the prototypes' #CCE0FF
             was never a token and no surface required it.
2026-08-26 — [DESIGN CHANGE] register item 5, the last one:
             .card-interactive-raised. Two genuinely new tokens were required
             and are now declared: --shadow-raised
             (0 26px 54px -22px rgba(15,23,42,.32)) and --ease-spring
             (cubic-bezier(0.34,1.56,0.64,1)).
             This is NOT the house gesture and does not replace it.
             .card-interactive at 2px remains the default on every card on the
             site. The raised variant is opt-in through Surface's `raised`
             prop, defaulting false, and is restricted to marketing card grids
             — never admin, never forms, never a control. The spring applies
             only to a descendant carrying .icon-tile-spring, so the overshoot
             cannot leak onto a tile used elsewhere.
             --shadow-raised is not a fourth step on the 1/2/3 shadow ramp and
             must not be used as one. --ease-spring passes 1 and settles back,
             which is a wobble on anything larger than a small decorative mark.
             Applied on exactly one surface today: the Founder Trap card grid
             on Home.
2026-09-06 — Palette move, five values: --color-brand/electric-500/--color-focus
             #0052FF->#0066FF; --color-brand-ink/electric-700 #0037A5->#003399;
             --color-accent/amber-500 #FFBF00->#FFCC00; --color-accent-ink/
             amber-700 #B45309->#CC6600; --color-ink/--color-canvas-dark
             #0F172A->#000033. --color-brand-hover and --color-accent-hover were
             deliberately left at #0039CC/#D49E00 — not part of this move.
             The rgba() decompositions of brand/ink used in --shadow-1/2/3,
             --shadow-raised and --shadow-glow-electric/-amber's first stop moved
             in lockstep so shadows and hover glow stay on-palette; the second
             --shadow-glow-amber stop (rgba(212,158,0,...), accent-hover) is
             unaffected. All hardcoded hex outside globals.css moved with it:
             icon.tsx/apple-icon.tsx/opengraph-image.tsx (Satori has no access to
             CSS custom properties), the email templates in
             src/lib/email/templates/, scoring.ts's dimension colors, and
             calendly.ts's POPUP_THEME (calendly.test.ts is the pinned assertion
             against drift, per its own comment — updated alongside).
             Recalculated contrast: brand 5.8:1->4.8:1 (still clears AA-normal,
             barely); brand-ink 10.1:1->10.9:1; accent 1.65:1->1.51:1 (fill-only,
             unaffected); ink 17.9:1->20.0:1; muted-invert vs canvas-dark
             12.0:1->13.5:1. accent-ink 5.0:1->3.8:1 — this is a real regression,
             now below the 4.5:1 AA-normal-text minimum and legal only at
             large-text/UI sizes (18px+, or bold 14px+). Accepted as-is per
             explicit decision, not an oversight. One active pattern is affected
             by it: `.eyebrow` text in accent-ink on light surfaces (globals.css
             @layer base) renders at 12px/500-weight, which does not qualify as
             WCAG large text either — those eyebrows now sit below AA-normal
             with no size-based exemption. Documented as a known gap in
             brand-guidelines/SKILL.md rather than silently left stale.
