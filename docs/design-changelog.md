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
