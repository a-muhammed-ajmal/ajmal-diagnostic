---
name: frontend-design
description: Exposes design instructions for Electric Blue & Amber frontend rendering, utilizing Roboto Slab and Figtree typography with strict mobile font-size ceilings.
version: 2.0.0
tags: [frontend, design-system, css, tailwind, typography]
triggers:
  - "creating a user interface"
  - "designing a landing page"
  - "building HTML/CSS templates"
  - "styling frontend components"
  - "modifying CSS or TSX files for layout"
  - "customizing typography or colors on web interfaces"
---

# Frontend Design Skill

This skill governs the visual design and layout of frontend web interfaces to prevent generic "AI slop" (such as Inter font paired with purple gradients and rounded cards). It establishes a distinct, professional identity using an **Electric Blue & Amber** color system, customized typography pairing (**Roboto Slab & Figtree**), and strict responsive typography constraints to optimize mobile viewports.

## 1. Purpose

This skill activates automatically whenever the agent is tasked with creating, modifying, or styling user interfaces, HTML/CSS layouts, Tailwind configurations, or frontend components. Its purpose is to enforce cohesive brand aesthetics, professional visual hierarchies, and flawless mobile layouts across all client deliverables.

## 2. Core Principles

Each user interface produced under this skill must adhere to the following four structural columns:

### A. Typography & Font Pairing

A professional interface utilizes typography to create contrast, personality, and immediate semantic structure.

- **Headings & Display Text:** **Roboto Slab** (fallback to `Georgia` and `serif`).
  - *Styling:* Semi-bold (`font-semibold`) to Bold (`font-bold`) weight with loose letter-spacing for large titles.
- **Body & UI Text:** **Figtree** (fallback to standard system `sans-serif` fonts for interface elements).
  - *Styling:* Light (`font-light`) or Regular (`font-normal`) weight, with a line-height of `1.5` to `1.625` (`leading-relaxed`) to ensure optimal readability.

### B. Color System (Electric Blue & Amber Theme)

A complementary color pairing that balances high-intensity technology (Electric Blue) with warm, premium energy (Amber).

- **Primary Brand Color (Electric Blue):** Represents primary call-to-actions, brand accents, active states, and focal typography.
  - *Base Hex:* `#0052FF` (Vibrant Electric Blue)
  - *Dark/Hover Hex:* `#0039CC`
  - *Light Accent/Bg Hex:* `#E6F0FF`
- **Secondary/Accent Color (Amber):** Highlights interactive focal points, badges, warning states, and premium borders.
  - *Base Hex:* `#FFBF00` (Premium Amber)
  - *Dark Hover Hex:* `#D49E00`
  - *Soft Tint Hex:* `#FFF8E6`
- **Supporting Neutrals:** Ground the vibrant primary colors.
  - *Canvas Dark (Text/Bgs):* `#0F172A` (Slate 900)
  - *Canvas Light (Bgs):* `#F8FAFC` (Slate 50)
  - *Canvas Border:* `#E2E8F0` (Slate 200)

### C. Mobile Viewport Constraints (Strict Ceilings)

To prevent horizontal overflow, cluttered viewports, and poor readability on smaller screens, you must enforce the following strict font ceilings for viewports below **768px (Mobile/Tablet breakpoint)**:

1. **Heading Size Ceiling:** All heading levels (H1 through H4) **MUST NOT** exceed **24px** (1.5rem / `text-2xl`).
   - *H1 Range on Mobile:* `20px` (1.25rem) to `24px` (1.5rem).
2. **Body Text Size Ceiling:** All standard body paragraphs, list items, and form descriptions **MUST NOT** exceed **14px** (0.875rem / `text-sm`).
   - *UI Micro-copy/Labels:* `12px` (0.75rem / `text-xs`).

### D. Motion, Micro-interactions, & Layout Composition

- **Asymmetric Grids:** Break the monotony of equal-width cards. Use left-heavy hero elements or side-by-side splits.
- **Glassmorphism Accents:** Apply thin borders (`border border-white/20`) combined with backdrop blurs (`backdrop-blur-md`) on panels.
- **Staggered Entrance:** Apply subtle transition delays (`delay-100`, `delay-200`) on staggered lists.
- **Hover Micro-interactions:** Buttons must slightly expand or shift upward (`hover:-translate-y-0.5 transition-all duration-200`) accompanied by amber-to-electric-blue glow alterations.

---

## 3. Implementation Patterns

This repo is **Next.js 16 + Tailwind CSS v4**. Two consequences shape how the patterns below are realised, and getting either wrong fails silently:

- **There is no `tailwind.config.js`.** Tailwind v4 reads its theme from `@theme {}` inside [globals.css](../../../src/app/globals.css). Adding a config file has no effect at all. Every `--color-*` key declared there generates the matching utility — `--color-electric-500` gives you `bg-electric-500`, `text-electric-500`, `border-electric-500`.
- **Fonts load through `next/font/google` in [layout.tsx](../../../src/app/layout.tsx)**, never a `<link>` tag or a CSS `@import`. `next/font` self-hosts the files, eliminating the round-trip and the FOUT. It exposes each family as a CSS variable (`--font-figtree`, `--font-roboto-slab`) that the `@theme` block maps onto `--font-body` and `--font-heading`.

### Theme Layout (`src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Fonts — supplied by next/font/google in layout.tsx */
  --font-heading: var(--font-roboto-slab), Georgia, serif;
  --font-display: var(--font-roboto-slab), Georgia, serif;
  --font-body:    var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
  --font-sans:    var(--font-figtree), ui-sans-serif, system-ui, sans-serif;

  /* Electric Blue scale */
  --color-electric-50:  #EFF6FF;
  --color-electric-100: #DBEAFE;
  --color-electric-500: #0052FF;  /* Brand Primary */
  --color-electric-600: #0046D5;
  --color-electric-700: #0037A5;
  --color-electric-900: #1E3A8A;

  /* Amber scale */
  --color-amber-50:  #FFFBEB;
  --color-amber-100: #FEF3C7;
  --color-amber-500: #FFBF00;     /* Brand Secondary Accent */
  --color-amber-600: #D97706;
  --color-amber-700: #B45309;

  /* Slate grounding neutrals */
  --color-canvas-dark:   #0F172A;
  --color-canvas-light:  #F8FAFC;
  --color-canvas-border: #E2E8F0;

  /* Semantic aliases — what components actually reference */
  --color-brand:        #0052FF;
  --color-brand-hover:  #0039CC;
  --color-brand-ink:    #0037A5;  /* blue TEXT on white — 10:1 */
  --color-brand-tint:   #E6F0FF;
  --color-accent:       #FFBF00;
  --color-accent-hover: #D49E00;
  --color-accent-ink:   #B45309;  /* amber TEXT on light — 5.0:1 */
  --color-accent-soft:  #FFF8E6;
  --color-ink:          #0F172A;
  --color-muted:        #475569;
  --color-line:         #E2E8F0;
}
```

Reach for the semantic alias (`bg-brand`, `text-ink`, `border-line`) in components; reach for the numbered scale (`bg-electric-100`, `text-amber-700`) when you need a specific rung the aliases do not name.

**On a `tone="dark"` band**, the text tokens invert: headings take `text-white`, secondary copy takes `text-muted-invert` (`#CBD5E1`, 12:1 on slate 900), and the eyebrow takes `text-accent` — amber's one legitimate home as a text colour, at 10.8:1. `text-muted` and `text-ink` must never appear on a dark band; they land around 2.4:1. A white card sitting *on* a dark band keeps its normal light-ground tokens.

Dark bands are a closing-CTA device, not a section type to reach for freely — roughly one per page.

### Responsive Type Scale

The ceilings in §2C are enforced once, in the `--step-N` scale, so every call site inherits them. The steps live on `:root` and are re-declared at the 768px breakpoint. Components reference `text-[length:var(--step-N)]` and never hardcode a pixel size.

| Token | < 768px | ≥ 768px | Role |
| --- | --- | --- | --- |
| `--step--1` | 12px | 13px | UI micro-copy, labels, eyebrows |
| `--step-0` | **14px** | 16px | Body, list items, form descriptions |
| `--step-1` | 16px | 18px | Card titles, h5 |
| `--step-2` | 18px | 20px | h4 |
| `--step-3` | 20px | 24px | h3 |
| `--step-4` | 22px | 32px | h2 / section titles |
| `--step-5` | **24px** | 48px | h1 |

Below 768px every heading step lands at or under 24px and body lands at or under 14px, which is exactly the constraint. Above it, the scale opens into a real display hierarchy.

`input`, `select`, and `textarea` stay pinned at 16px at every width — below 16px iOS Safari zooms the viewport on focus, which breaks the diagnostic, lead capture, and contact forms. On mobile that puts 16px inputs next to 14px body copy; that is expected, not a bug.

### Reference Component (Responsive Hero Section with Navbar)

```html
<header class="w-full border-b border-canvas-border bg-white sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- Brand Logo -->
    <div class="flex items-center space-x-2">
      <span class="w-3 h-3 bg-electric-500 rounded-full"></span>
      <span class="font-heading font-bold text-[length:var(--step-1)] text-canvas-dark">Aura<span class="text-amber-700">Design</span></span>
    </div>
    <!-- Desktop Navigation -->
    <nav class="hidden md:flex space-x-8">
      <a href="#" class="font-body text-[length:var(--step-0)] font-medium text-electric-700 hover:text-electric-900 transition-colors duration-200">Overview</a>
      <a href="#" class="font-body text-[length:var(--step-0)] font-medium text-muted hover:text-electric-700 transition-colors duration-200">Features</a>
      <a href="#" class="font-body text-[length:var(--step-0)] font-medium text-muted hover:text-electric-700 transition-colors duration-200">Pricing</a>
    </nav>
    <!-- Action Button — amber fill demands dark text -->
    <div>
      <button class="font-body text-[length:var(--step-0)] font-semibold text-canvas-dark bg-amber-500 hover:bg-accent-hover px-4 py-2 rounded-lg shadow-1 hover:shadow-glow-amber transition-all hover:-translate-y-0.5 duration-200">
        Launch Console
      </button>
    </div>
  </div>
</header>

<main class="relative bg-canvas-light py-16 md:py-28 overflow-hidden">
  <!-- Ambient background radials -->
  <div class="orb orb-electric absolute top-0 right-0 w-96 h-96 -mr-20 -mt-20"></div>
  <div class="orb orb-amber absolute bottom-0 left-0 w-96 h-96 -ml-20 -mb-20"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Asymmetric split: 7 / 5, not two equal halves -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <!-- Left Column: Copy & CTAs -->
      <div class="md:col-span-7 space-y-6">
        <!-- Floating tag -->
        <span class="inline-flex items-center px-3 py-1 rounded-full text-[length:var(--step--1)] font-semibold bg-electric-100 text-electric-700 font-body">
          Release v1.0 • Stable Production
        </span>
        <!-- Hero title — capped at 24px below 768px by --step-5 -->
        <h1 class="font-heading font-extrabold text-[length:var(--step-5)] text-canvas-dark leading-tight">
          Ship your development loops with <span class="text-electric-500 underline decoration-amber-500 decoration-wavy underline-offset-8">Aura Engine</span>
        </h1>
        <!-- Body copy — capped at 14px below 768px by --step-0 -->
        <p class="font-body text-[length:var(--step-0)] text-muted max-w-lg leading-relaxed">
          High-fidelity rendering pipelines, native Model Context integrations, and modular layout ecosystems that scale concurrently across any environment.
        </p>
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 pt-2">
          <button class="font-body text-[length:var(--step-0)] font-bold text-white bg-electric-500 hover:bg-brand-hover px-6 py-3 rounded-lg shadow-1 hover:shadow-glow-electric transition-all hover:-translate-y-0.5 duration-200">
            Get Started Free
          </button>
          <button class="font-body text-[length:var(--step-0)] font-semibold text-electric-700 hover:text-electric-900 border border-electric-500/20 bg-white hover:bg-canvas-light px-6 py-3 rounded-lg transition-all duration-200">
            Read Documentation
          </button>
        </div>
      </div>
      <!-- Right Column: Glassmorphism card -->
      <div class="md:col-span-5 relative">
        <div class="glass-panel hover-lift rounded-2xl p-6 space-y-6">
          <div class="flex items-center justify-between">
            <span class="font-heading text-[length:var(--step-0)] font-semibold text-muted">Pipeline Performance</span>
            <span class="w-2 h-2 rounded-full bg-success"></span>
          </div>
          <div class="space-y-1">
            <span class="font-body text-[length:var(--step--1)] font-medium text-muted block uppercase tracking-wider">Initialization Speed</span>
            <div class="flex items-baseline space-x-2">
              <span class="font-heading font-extrabold text-[length:var(--step-4)] text-canvas-dark">[TO CONFIRM]</span>
              <span class="font-body text-[length:var(--step-0)] font-semibold text-electric-700">microseconds</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-[length:var(--step--1)] font-semibold text-muted font-body">
              <span>Concurrency Capacity</span>
              <span>[TO CONFIRM]</span>
            </div>
            <div class="w-full bg-canvas-border h-2 rounded-full overflow-hidden">
              <div class="bg-electric-500 h-full rounded-full w-2/3 border-r-2 border-amber-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
```

The two metric readings are `[TO CONFIRM]` on purpose — see §5.

### Utility Classes That Already Exist

Use these rather than rebuilding the recipe inline. All are declared in `globals.css`.

| Class | Effect |
| --- | --- |
| `.glass-panel` | Glassmorphism panel — translucent white, `backdrop-blur`, hairline border |
| `.orb` + `.orb-electric` / `.orb-amber` | Ambient blurred background radials |
| `.hover-lift` | 2px upward shift plus electric glow on hover, 200ms |
| `.card-interactive` | Card hover: lift, shadow step, electric border |
| `.reveal` | Staggered entrance, 100ms apart |
| `.stage-reveal` / `.heading-reveal` | Scroll-driven reveal (`animation-timeline: view()`) |
| `.brand-gradient-text` | Gradient text, electric-700 to electric-500 |
| `.eyebrow` | Uppercase 800-weight section label — shape only, sets no colour |
| `.tap-target` | `min-height/width: 44px` — every icon-only control |
| `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` | Process/timeline composition |
| `.article-longform` / `.article-toc` / `.reading-progress` | Insights article chrome |

Shadows are real utilities generated from `@theme`: `shadow-1` hairline, `shadow-2` card, `shadow-3` modal, plus `shadow-glow-electric` and `shadow-glow-amber` for the hover glow. Use those names, not `shadow-lg`.

Space, radius, and motion tokens:

```
--space-1 .25rem  --space-2 .5rem   --space-3 .75rem  --space-4 1rem
--space-5 1.5rem  --space-6 2rem    --space-7 3rem    --space-8 4rem   --space-9 6rem

--radius-1 .5rem   --radius-2 .75rem   --radius-3 1rem   --radius-pill 999px

--dur-1 120ms  --dur-2 200ms  --dur-3 400ms  --dur-4 650ms
--ease-out cubic-bezier(0.16, 1, 0.3, 1)   --ease-in cubic-bezier(0.5, 0, 0.75, 0)
```

`--dur-2` is 200ms to match the mandated `transition-all duration-200`. In practice: `rounded-lg` for inputs and chips, `rounded-xl` for buttons, `rounded-2xl` for cards. The `prefers-reduced-motion: reduce` guard is already global.

### Shared Primitives

Five exist in `src/components/ui/`. Use them instead of re-deriving the recipe.

- **`<Section>`** — the full-bleed page band every section is built from. `tone` of `white` · `light` (slate band) · `tint` (electric band) · `dark` (slate 900); `width` of `prose` · `narrow` · `default` · `wide`; `orbs` to add the ambient radials; `compact` for utility bands; `divided` when a white band follows another white band. It owns the padding, the banding, the clipping, and the orb placement — do not hand-roll `px-6 py-16 md:py-24` on a new section.
- **`<PageHero>`** — the page opener. Takes `eyebrow` / `title` / `lead` / `actions` / `note` / `aside`, plus `tone` and `accent`. Deliberately asymmetric: 7/5 with an `aside`, 8-of-12 without. **It offers no centred variant on purpose** — a centred hero on every page is what made this site read as one template.

- **`<Button>`** — variants `primary` (electric fill) · `secondary` · `quiet` · `accent` (amber fill, dark text) · `danger`, plus `fullWidth`. Renders a `next/link` for `href`, a plain `<a target="_blank" rel="noreferrer">` for `href` + `external`, and a `<button>` otherwise. Focus ring, disabled state, the 200ms hover lift with glow, and the 44px floor (`min-h-11`) are built in.

  ```tsx
  <Button href="/diagnostic">Start the Check</Button>
  <Button variant="accent" onClick={launch}>Launch Console</Button>
  ```

- **`<Surface>`** — card/section container; `tone` of `default` (white) · `muted` (electric tint) · `accent` (soft blue) · `glass` (glassmorphism), and `interactive` to add `.card-interactive`.
- **`<SectionHeader>`** — takes `eyebrow` / `title` / `description`, with `align`.

Components: PascalCase filenames, named exports, explicit prop interfaces, `cn()` from [src/lib/utils.ts](../../../src/lib/utils.ts) for conditional classes. API routes: `route.ts` with named `GET`/`POST` exports. Prefer Server Components; keep `"use client"` boundaries small.

Control heights: `<Button>` is 44px (`min-h-11`), the accessibility floor. `min-h-[48px]` and `min-h-[52px]` appear on some admin and diagnostic forms. Those three are the whole ladder — reuse one, do not introduce a fourth.

---

## 4. Anti-Patterns

Avoid the following implementation traps:

- ❌ **AI Slop Fonts:** Do not fall back to using `Inter` or standard sans-serif system fonts as headings.
- ❌ **The "Purple Gradient" Trap:** Avoid combining soft purple linear background overlays with generic floating card shapes.
- ❌ **Violating Mobile Size Caps:** Never serve headings larger than `24px` or body text larger than `14px` when viewports collapse below `768px`. Check size constraints across device breakpoints.
- ❌ **Contrast Deficiencies:** Never overlay primary Amber `#FFBF00` text directly onto white or light gray surfaces — it lands at 1.65:1. Amber must be restricted to dark backgrounds (`bg-canvas-dark`) or used as a border highlight/accent. For amber *text* on a light surface use `--color-accent-ink` (`#B45309`, 5.0:1).
- ❌ **Static Rigidity:** Avoid delivering static interfaces devoid of active/hover interactions. All CTA triggers should feature micro-interactions.
- ❌ **Raw hex in JSX:** Use token classes. Two exceptions, where CSS custom properties genuinely are not available at render time: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (rendered through Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/` (rendered outside the app's CSS). Values there must still match the tokens.
- ❌ **A `tailwind.config.js`:** Tailwind v4 ignores it entirely. Tokens go in `@theme {}`.
- ❌ **A third typeface.** Roboto Slab and Figtree are the whole budget. `font-mono` means `tabular-nums`, not a family change.
- ❌ **Muting text with opacity** (`text-ink/60`). Use `text-muted` (`#475569`, 7.6:1).

---

## 5. Content Integrity

Never invent testimonials, client names or logos, revenue figures, metrics, certifications, awards, partnerships, case-study results, customer counts, or geographic claims. This includes charts and score displays: a dial showing a plausible number is an invented metric. Use the product's own defined values — for example the real Founder Dependency Index bands (Critical 0–39 / Developing 40–69 / Progressing 70–100) — or show the scale without a fabricated reading.

When a page needs evidence that has not been supplied, write `[TO CONFIRM]`. Do not write a realistic-looking placeholder that could be mistaken for a real business claim.

Voice: executive, analytical, practical — bold and distinctive, not generic. Avoid "revolutionize," "unlock your potential," "next-generation," "seamless," "supercharge."

---

## 6. Verification Checklist

Before pushing any frontend updates or declaring a UI layout complete, verify against this strict checklist:

- [ ] **Font Ingestion:** Are Roboto Slab and Figtree loaded via `next/font/google` in `layout.tsx` — with no `<link>` tag and no CSS `@import` for either?
- [ ] **CSS Variable Pairing:** Are the typography structures mapped precisely to `var(--font-heading)` and `var(--font-body)`?
- [ ] **Mobile Heading Check:** Verify by measurement that no H1, H2, H3, or H4 exceeds `24px` when screen width drops under `768px`.
- [ ] **Mobile Body Check:** Validate that all paragraph copy resolves to `14px` or less on mobile viewports.
- [ ] **Electric Blue Hex Verification:** Verify primary actions are styled using the specific hex `#0052FF`.
- [ ] **Amber Color Contrast Check:** Ensure Amber `#FFBF00` is strictly paired with high-contrast, dark slate components to satisfy WCAG AA; amber text on a light surface uses `#B45309`.
- [ ] **Transition Verification:** Ensure hover and translate movements are bound by `transition-all duration-200`.
- [ ] All text meets 4.5:1 contrast; state is never signalled by colour alone.
- [ ] One `<h1>` per page; heading levels are not skipped.
- [ ] Icon-only buttons carry `.tap-target` and an accessible name; the keyboard reaches every interactive element with a visible focus ring.
- [ ] No horizontal overflow at 320px; usable at 200% zoom.
- [ ] Loading, empty, and error states exist wherever the data can be absent.
- [ ] No invented business evidence; unknowns marked `[TO CONFIRM]`.
- [ ] No new dependency without a functional reason.

---

## Deeper references — load only when the trigger applies

| Read | When |
| --- | --- |
| `references/accessibility.md` | Running an accessibility pass, or a review flags a11y |
| `references/aesthetics.md` | Asked to make UI "look better," "less generic," or "more polished" |
| `references/components.md` | Creating a new component file and unsure of the internal structure |
| `references/mobile.md` | The task is specifically mobile layout, touch, or bottom-sheet behaviour |
| `references/performance.md` | Addressing Core Web Vitals, bundle size, or layout shift |

For an exact token declaration, read [globals.css](../../../src/app/globals.css) — it is the only source of truth.
