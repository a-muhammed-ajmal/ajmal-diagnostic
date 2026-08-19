# Building with this design system

**Electric Blue & Amber** — Roboto Slab headings over Figtree body, on slate neutrals.

## Setup: none

There is no provider, theme object, or root wrapper. Import a component and render it:

```jsx
const { Button, Section, SectionHeader, PageHero } = window.ConsultingDS;
```

Load `styles.css` — it `@import`s the compiled component CSS and the self-hosted
Roboto Slab / Figtree faces. Nothing else is required. Components that link
internally (`Button` with `href`, `Navigation`, `Footer`) render plain `<a>`
elements here, so no router is needed.

## The styling idiom: a CLOSED set of utility classes

This is Tailwind v4, but the shipped stylesheet was compiled by scanning the
real site, so **only the ~640 utilities the site already uses exist.** A class
you invent silently does nothing — and it fails quietly, with no error.

Concretely: unprefixed `grid-cols-1`, `grid-cols-2` and `grid-cols-3` exist, but
a bare `grid-cols-4` does not (only `sm:grid-cols-4` and `md:grid-cols-4` were
compiled). `bg-electric-100` and `bg-electric-500` exist; `bg-electric-700` does
not, though `text-electric-700` does. The set is genuinely arbitrary — it is
whatever the site happened to use.

Two rules follow, and they matter more than anything else here:

1. **Compose DS components first.** They carry the brand and always render right.
2. **For your own layout glue, stay inside the vocabulary below — or use inline
   `style` with a `var(--token)`.** CSS custom properties are always defined, so
   `style={{ background: "var(--color-brand-tint)" }}` never fails, while a
   guessed utility class will.

**Colour** — `bg-brand` `bg-brand-hover` `bg-brand-soft` `bg-brand-tint`
`bg-accent` `bg-accent-hover` `bg-accent-soft` `bg-canvas-light` `bg-canvas-dark`
`bg-white` · `text-ink` `text-muted` `text-brand` `text-brand-ink` `text-accent-ink`
`text-white` `text-success` `text-danger` · `border-line` `border-line-strong`
`border-brand`

**Amber is fill-only.** `#FFBF00` on white is 1.65:1. Use `bg-accent` as a fill
with dark text, or `text-accent-ink` (`#B45309`) for amber *text* on light.

**On a `bg-canvas-dark` band the text tokens invert**: headings `text-white`,
body `text-muted-invert`, eyebrow `text-accent`. `text-ink` and `text-muted` are
unreadable there. Note `SectionHeader` hardcodes the light-ground tokens, so on a
dark band write the heading markup directly instead of using it.

**Type** — `font-heading` (Roboto Slab) for headings, `font-body` (Figtree) for
everything else including button labels. `font-mono` means tabular figures, not a
third family. Sizes come only from the scale:
`text-[length:var(--step-N)]`, N in `-1,0,1,2,3,4,5`.

**Never hardcode a font size.** The scale enforces hard mobile ceilings —
below 768px no heading exceeds 24px and body copy tops out at 14px. A literal
`text-2xl` escapes that and breaks the brand's mobile rules.

**Effects** — `shadow-1` `shadow-2` `shadow-3` `shadow-glow-electric`
`shadow-glow-amber` · `rounded-lg` (inputs, chips) `rounded-xl` (buttons)
`rounded-2xl` (cards) `rounded-full` · `glass-panel` `hover-lift`
`card-interactive` `eyebrow` `brand-gradient-text` `tap-target` `reveal` ·
`orb` with `orb-electric` / `orb-amber` for ambient radials ·
`stage-rail` `stage-item` `stage-marker` `stage-card` for the ladder composition.

**Tokens** for inline styles: `--color-*` (as above), `--font-heading` /
`--font-body`, `--step--1`…`--step-5`, `--space-1`…`--space-9`,
`--radius-1/2/3/pill`, `--dur-1/2/3/4`.

## Layout rules

Every page section is a `<Section>` (`tone` white / light / tint / dark, `width`
prose / narrow / default / wide). Every page opener is a `<PageHero>`. **Neither
offers a centred variant on purpose** — asymmetry is the house layout, and
centred blocks on every section are what made this site read as a template. Dark
bands are a closing-CTA device: roughly one per page.

## Where the truth lives

Read `styles.css` and the `_ds_bundle.css` it imports for the exact token values
and the full class list. Each component's `.prompt.md` carries its props and
usage. `guidelines/` holds the brand's own writing on the Founder Dependency
Index, the commercial path, and site structure — use those for real product
language instead of inventing claims.

## A typical build

```jsx
const { Section, SectionHeader, Surface, Button } = window.ConsultingDS;

<Section tone="light" width="default" orbs>
  <SectionHeader
    eyebrow="How it works"
    title="Three stages, in the order that actually works"
    description="Diagnose where the business depends on you, then remove it."
  />
  <div className="mt-8 grid gap-6 md:grid-cols-3">
    <Surface interactive>
      <p className="eyebrow mb-2 text-brand-ink">Stage 01</p>
      <h3 className="font-heading text-[length:var(--step-3)] font-bold text-ink">
        Business Health Check
      </h3>
      <p className="mt-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
        A free founder self-report that returns your Founder Dependency Index.
      </p>
      <div className="mt-5">
        <Button href="/diagnostic" variant="secondary">Start the check</Button>
      </div>
    </Surface>
  </div>
</Section>
```

## Content integrity

Never invent metrics, testimonials, client names, or case-study results. The
Founder Dependency Index bands are Critical 0–39, Developing 40–69,
Progressing 70–100 — use those real values, or show a scale with no reading.
Where evidence is missing, write `[TO CONFIRM]`.
