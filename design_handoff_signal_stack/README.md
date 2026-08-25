# Handoff: Signal Stack front-end system

**Target repo:** `a-muhammed-ajmal/consulting` · branch `main` · read at commit `b4f70e9`
**Stack:** Next.js 16 (App Router), React, TypeScript, Tailwind v4 (no config file — `@theme` in `src/app/globals.css` *is* the theme)

## Overview

A complete front-end specification for muhammedajmal.com, covering all 12 routes. It keeps the
existing Electric Blue & Amber palette and the Plus Jakarta Sans / Lexend type pairing **exactly as
they are**, and changes only layout, component structure, interaction and motion.

The direction is **Signal Stack**: a banner hero with a rotating spoke arc and ambient orbs,
tinted-header cards, a chip marquee, a sweeping-shine primary CTA, tint-heavy section banding, and
glass panels on dark bands.

**Read `frontend.md` first. It is the specification.** This README is orientation only.

## About the design files

The files in `prototypes/` are **design references written in HTML** — working prototypes that show
intended look and behaviour. They are **not production code to copy**. They use a self-contained
component runtime (`support.js`), inline styles, and single-file page markup. None of that belongs
in the Next.js app.

The task is to **recreate these designs in the existing codebase**, using its established patterns:
React server/client components under `src/components/`, Tailwind utilities bound to the `@theme`
tokens, and the CSS utility classes that already exist in `globals.css`.

Open each prototype in a browser and scroll it — the motion is the point, and it does not read from
a screenshot.

## Fidelity

**High-fidelity for layout, structure, interaction and motion.**
**Not authoritative for colour, type, shadow, radius or duration values** — the prototypes were
authored with literal hex codes and px sizes before the real `globals.css` was read. Where a
prototype and `frontend.md` §1 disagree, **§1 wins**, because §1 is quoted from `globals.css`.

Four specific places the prototypes are wrong, all corrected in `frontend.md`:

1. **Type.** Prototypes use Plus Jakarta Sans throughout at weights up to 800. Production is a
   two-face pairing — Plus Jakarta Sans for headings, **Lexend for body/UI capped at weight 500**.
2. **Mobile ceilings.** Prototypes cap H1 at 28px. The real ceiling is **24px for H1–H4 and 14px for
   body** below 768px, enforced by the `--step-*` tokens. Never hardcode a px font-size.
3. **Tracking.** Prototypes use negative letter-spacing on headings. House style is
   `+.005em` on H1/H2 and `0` on H3/H4, and the `.eyebrow` utility has **no tracking at all**.
4. **Shadows and hover.** Prototypes invent a deep offset-negative-spread ramp and a 6px card lift.
   The theme has `--shadow-1/2/3` plus two glow tokens, and the house gesture is a **2px** lift at
   200ms (`.hover-lift`, `.card-interactive`).

## Governing documents — read before writing code

`CLAUDE.md` closes the governing register at four documents, cross-referenced by ID:

| ID | File | Governs |
| --- | --- | --- |
| ANCHOR | `docs/ANCHOR.md` | Positioning, clients, sectors, commercial path, claims. **Locked.** |
| PRODUCT | `docs/PRODUCT.md` | Business Health Check, the instrument, Clarity Audit |
| WEB | `docs/WEBSITE.md` | Public routes, navigation, pages, publishing |
| DESIGN | `.claude/skills/frontend-design/SKILL.md` | Colours, typography, components, a11y |

**`frontend.md` is not a fifth governing document.** It is an implementation spec. Its §1 restates
DESIGN and is authoritative only because it matches it. All copy, claims, route structure, FDI band
names and scoring thresholds come from ANCHOR / PRODUCT / WEB — pull them from the source, do not
paraphrase from the prototypes.

**Rule Zero (`AGENTS.md`) outranks everything:** verify against the code, never assume.

## Order of work

1. **Read** `globals.css`, `AGENTS.md`, DESIGN, WEB, and `docs/design-changelog.md`.
   Confirm every token in `frontend.md` §1 still matches. If one has drifted, `globals.css` wins.
2. **Primitives** (§2.1) — `Button`, `Card`, `IconTile`, `Chip`, `Input`, `GlassPanel`, `Orb`.
   Wrap the existing CSS utilities; do not re-author `.glass-panel`, `.orb`, `.hover-lift`,
   `.card-interactive`, `.eyebrow`, `.tap-target`, `.brand-gradient-text`.
3. **Composites** (§2.2) — `PageHero` first, since every route depends on it. `StageRail`,
   `SectionNav` and `Accordion` reuse existing CSS (`.stage-rail`, `.article-toc`) — wire, don't rebuild.
4. **Routes** (§3), in this order: Home → Diagnostic entry → Diagnostic flow → Result → Services →
   Insights → About → Contact → Privacy → 404 → Admin.
5. **[DESIGN CHANGE] items last** (§6). Each needs a DESIGN skill update and a
   `docs/design-changelog.md` entry **in the same commit**. Item 5 (the 6px raised card hover)
   touches the house interaction — land it last, behind an opt-in class, or drop it.
6. **Validate:** `npm run lint`, `npm run test:coverage`, `npm run build`, `npm run audit:type`,
   then follow `.claude/commands/ship.md`.

## Existing code to reuse, not rewrite

| Concern | Location |
| --- | --- |
| Theme tokens, CSS utilities, keyframes | `src/app/globals.css` |
| FDI question set | `src/lib/fdi/questions/fdi-questions-1.1.ts` |
| FDI scoring | `src/lib/fdi/score.ts`, `bands.ts`, `rounding.ts` |
| FDI session/state | `src/lib/fdi/`, `src/lib/fdi-server/` |
| ~~`src/lib/questions.ts` / `scoring.ts`~~ | **RETIRED** (ten-question diagnostic, AGENTS.md). `scoring.ts` survives only for `DIMENSION_META` in the admin historic-lead view. Do not bind the stepper to either. |
| Articles, reading time | `src/lib/articles.ts`, `src/lib/readingTime.ts` |
| Calendly / WhatsApp handoff | `src/lib/calendly.ts`, `src/lib/whatsapp.ts` |
| Email delivery | `src/lib/email/` |
| Admin auth | `src/lib/adminAuth.ts` |
| Metadata, JSON-LD, sitemap | `src/lib/metadata.ts`, `src/lib/jsonLd.ts`, `src/app/sitemap.ts` |
| Existing components | `src/components/{ui,layout,home,fdi,contact}/` |

Two test files assert against the current spec and will need updating alongside:
`src/lib/website-specification.test.ts` and `src/lib/site-copy.test.ts`.

## Content integrity

No claim, figure, client name, logo, or testimonial ships without evidence. The prototypes contain
**placeholder copy only** — treat every sentence in them as illustrative. Real copy comes from
ANCHOR / PRODUCT / WEB.

Two hard content rules carried into the spec:
- **`IndexScale` renders empty everywhere except a completed result page.** No sample readings on
  any marketing page, ever.
- Diagnostic language stays honest: a self-report, not an audit; it identifies reported patterns and
  does not diagnose root causes; a higher index is the adverse result.

## Files in this bundle

| File | What it is |
| --- | --- |
| `frontend.md` | **The specification.** Foundations, 9 primitives, 11 composites, 12 routes, responsive, 14 rules, change register. |
| `prototypes/Direction C - Signal Stack.dc.html` | The chosen direction — hero, cards, stage rail, dark band. Scroll it. |
| `prototypes/Ossisto Component Library.dc.html` | Source of the interaction vocabulary: hover ramps, spring tiles, marquee, carousel, accordion, count-up. **Different palette — reference the behaviour, not the colours.** |
| `prototypes/Diagnostic Landing.dc.html` | Diagnostic entry page in the real palette, incl. the empty `IndexScale` and the live question stepper. |
| `prototypes/support.js` | Prototype runtime. Required to open the HTML files. Not for production. |

## Assets

None. The prototypes use CSS-only decoration (conic gradients, radial gradients, masks) and no
images or icon fonts. The one real asset already in the repo is
`public/images/muhammed-ajmal.jpg`.
