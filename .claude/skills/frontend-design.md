---
name: frontend-design
description: Elevates any UI to be distinctive, memorable, and non-generic. Apply when building or modifying frontend components, pages, CSS, design systems, or any visual interface.
---

TRIGGER — Apply this skill BEFORE writing any HTML, CSS, JSX/TSX, or design tokens. Do NOT skip because the task "looks simple" — a single component still needs distinctive typography, correct token usage, and micro-interactions. Re-read when asked to make UI "look better," "less AI-generated," or "more polished."

Also apply whenever:
- The prompt names any UI element, page, component, or style
- You are writing or editing CSS, Tailwind classes, or design tokens
- You are building a landing page, form, card, navigation, or dashboard
- The user asks about fonts, colors, animations, or layout

---

## Purpose

This skill prevents the generation of generic, forgettable "AI slop" frontends. It ensures every UI is:
- **Distinctive** — identifiable typography, intentional color system, not template-like
- **Accessible** — WCAG 2.2 AA contrast, 48px touch targets, semantic HTML, keyboard navigation
- **Performant** — fluid type, sized media, lean transitions, Core Web Vitals aware
- **Memorable** — atmosphere via layered gradients + grain, not flat fills

---

## Core Principles

### 1. Distinctive Typography

Use Google Fonts strategically for personality. Never default to Inter or System UI as a heading font.

**Recommended pairings:**
- `Bricolage Grotesque` (display/heading) + `Hanken Grotesk` (body) — expressive + clean
- `Playfair Display` (editorial heading) + `DM Sans` (body) — prestige
- `Clash Display` (bold display) + `General Sans` (body) — contemporary

**Rules:**
- Always use `clamp()` for fluid font sizes: `font-size: clamp(2rem, 6vw, 4rem)`
- Apply `letter-spacing: -0.02em` on large headings
- `line-height: 1.05` on hero headlines; `1.6` on body
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs
- Never use raw `px` font sizes in production CSS

### 2. Cohesive Token Architecture

Two layers: **primitives** (raw scale) → **semantic** (intent). Components use ONLY the semantic layer.

```css
:root {
  /* Primitives — raw values */
  --neutral-50: #f7f7f8;
  --brand-500: #2dd4a7;
  --accent-500: #ff6b4a;
  --space-4: 1rem;
  --radius-3: 1rem;
  --dur-3: 400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Semantic — intent layer; what components import */
  --color-bg: var(--neutral-50);
  --color-surface: #ffffff;
  --color-border: var(--neutral-200);
  --color-text: var(--neutral-900);
  --color-text-muted: var(--neutral-500);
  --color-primary: var(--brand-500);
  --color-on-primary: var(--neutral-950);
  --color-focus: var(--brand-400);
}
```

**Rules:**
- Never use raw hex colors in component CSS — always reference a semantic token
- Keep primitives in `:root`, expose semantic tokens from the same `:root` block
- Dark theme = remap semantic tokens only in `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`
- Maintain 4.5:1 contrast ratio for all text (WCAG AA)

### 3. Atmosphere — Depth, Not Flat

Replace dead solid backgrounds with layered aurora gradients + grain noise. This one change kills the "AI template" look instantly.

```css
body {
  background-color: var(--color-bg);
  background-image:
    radial-gradient(60% 50% at 80% -5%, rgba(45,212,167,.18), transparent 70%),
    radial-gradient(55% 45% at 0% 8%, rgba(255,107,74,.12), transparent 65%),
    radial-gradient(40% 35% at 50% 100%, rgba(45,212,167,.08), transparent 70%);
  background-attachment: fixed;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

**Rules:**
- Aurora radials: max 18% opacity, at least 2 colors related to brand palette
- Grain opacity: 0.02–0.04 (invisible but removes plasticky sheen)
- `background-attachment: fixed` on the aurora so it stays as content scrolls
- Always `pointer-events: none` on decorative overlays

### 4. Orchestrated Motion

Staggered entrance animations signal intentional craft. Random or instant-load UI signals templates.

```css
.reveal {
  opacity: 0;
  transform: translateY(14px);
  animation: rise var(--dur-4) var(--ease-out) both;
}
.reveal:nth-child(1) { animation-delay: .05s }
.reveal:nth-child(2) { animation-delay: .13s }
.reveal:nth-child(3) { animation-delay: .21s }
.reveal:nth-child(4) { animation-delay: .29s }
@keyframes rise { to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
}
```

**Rules:**
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left`
- Use `cubic-bezier(0.16, 1, 0.3, 1)` (overshoot-free spring) for entrance animations
- Stagger delays: 80ms apart feels natural; >120ms apart feels sluggish
- Always include `prefers-reduced-motion` guard
- Hover states: `transition: transform 220ms ease-out` — fast enough to feel snappy

### 5. High-Impact Micro-interactions

```css
.card {
  transition: transform var(--dur-2) var(--ease-out), border-color var(--dur-2);
}
@media (hover: hover) {
  .card:hover { transform: translateY(-3px); border-color: var(--color-primary); }
}
.btn { transition: filter var(--dur-2), transform var(--dur-2) var(--ease-out); }
.btn:active { transform: scale(.97); }
@media (hover: hover) {
  .btn--primary:hover { filter: brightness(1.06); }
}
```

**Rules:**
- `@media (hover: hover)` guard — touch devices don't get stuck hover states
- Buttons: min-height 48px, min-width 44px (WCAG touch targets)
- Card lift: `translateY(-3px)` — enough to feel alive, not theatrical
- Focus: always `outline: 2px solid var(--color-focus); outline-offset: 2px`

### 6. Layout & Spacing

```css
.grid {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
}
.wrap {
  max-inline-size: 34rem;
  margin-inline: auto;
  padding-inline: max(var(--space-4), 5vw);
}
```

**Rules:**
- `min(100%, Xrem)` in `minmax()` prevents overflow at narrow viewports — no media queries needed
- `padding-inline: max(var(--space-4), 5vw)` — generous gutter that scales
- `margin-inline: auto` for centering, never `margin: 0 auto`
- Use `max-inline-size` not `max-width` for writing-mode compatibility

---

## Anti-Patterns to Avoid ("AI Slop")

| What to avoid | What to do instead |
|---|---|
| Inter / system-ui as heading font | Bricolage Grotesque, Playfair, Clash Display |
| `background: purple` or flat gradients | Aurora radials + grain |
| `#fff` background with `#333` text | Semantic tokens, off-white backgrounds |
| Generic emoji icons (`✨🚀💡`) | SVG icons, Unicode symbols with purpose |
| `border-radius: 8px` everywhere | Deliberate radius scale (--radius-1 through pill) |
| Transitions on `all` | Explicit: `transition: transform 220ms, opacity 220ms` |
| Fixed `px` font sizes | `clamp()` fluid type scale |
| Random colors scattered in CSS | All colors via CSS custom properties |
| Flat sections with no depth | Aurora glow + grain + subtle shadows |
| "Streamline Your Workflow" copy | Specific, concrete value propositions |

---

## Implementation Checklist

Before shipping any UI:

- [ ] 2+ custom Google Fonts with clear hierarchy (display vs. body)
- [ ] `clamp()` fluid type scale on all font sizes
- [ ] All colors via CSS custom properties (no raw hex in components)
- [ ] Aurora gradient or textured background (not flat color)
- [ ] Grain noise overlay on body (`::before` pseudo-element)
- [ ] Entrance animations with staggered delays on key content
- [ ] `prefers-reduced-motion` guard on all animations
- [ ] Hover/focus states on all interactive elements
- [ ] `@media (hover: hover)` guard on hover effects
- [ ] 48px min touch targets on buttons and links
- [ ] `:focus-visible` ring using `--color-focus` token
- [ ] Dark theme tokens remapped in semantic layer
- [ ] `text-wrap: balance` on headings
- [ ] Mobile responsive (fluid, not just breakpoint-based)

---

## Worked Example: "Halcyon" Reference Page

This is the canonical reference for what non-AI-slop UI looks like. Study the patterns:

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Frontend Design — worked example</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
:root{
  --neutral-50:#f7f7f8;--neutral-300:#b0b0b8;--neutral-400:#84848f;
  --neutral-800:#1d1d24;--neutral-900:#141419;--neutral-950:#0b0b0f;
  --brand-400:#8be9c2;--brand-500:#2dd4a7;--accent-500:#ff6b4a;
  --space-2:.5rem;--space-3:.75rem;--space-4:1rem;--space-5:1.5rem;--space-6:2rem;--space-7:3rem;
  --radius-2:.625rem;--radius-3:1rem;--radius-pill:999px;
  --dur-2:220ms;--dur-3:400ms;--dur-4:650ms;--ease-out:cubic-bezier(.16,1,.3,1);
  --font-display:"Bricolage Grotesque",sans-serif;
  --font-sans:"Hanken Grotesk",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",monospace;
  --step-0:clamp(1rem,.93rem+.36vw,1.13rem);--step-1:clamp(1.2rem,1.07rem+.65vw,1.5rem);
  --step-3:clamp(1.73rem,1.36rem+1.85vw,2.67rem);--step-4:clamp(2.07rem,1.49rem+2.9vw,3.55rem);
  --color-bg:var(--neutral-950);--color-surface:var(--neutral-900);--color-border:var(--neutral-800);
  --color-text:var(--neutral-50);--color-text-muted:var(--neutral-300);--color-text-subtle:var(--neutral-400);
  --color-primary:var(--brand-500);--color-on-primary:var(--neutral-950);
  --color-accent:var(--accent-500);--color-focus:var(--brand-400);
  --shadow-3:0 22px 50px rgba(0,0,0,.6);
}
*,*::before,*::after{box-sizing:border-box;margin:0}

body{
  background:var(--color-bg);color:var(--color-text);
  font:400 var(--step-0)/1.6 var(--font-sans);
  -webkit-font-smoothing:antialiased;min-height:100dvh;
  background-image:
    radial-gradient(60% 50% at 80% -5%, rgba(45,212,167,.18), transparent 70%),
    radial-gradient(55% 45% at 0% 8%, rgba(255,107,74,.12), transparent 65%),
    radial-gradient(40% 35% at 50% 100%, rgba(45,212,167,.08), transparent 70%);
  background-attachment:fixed;
}
body::before{
  content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Staggered hero reveal */
.reveal{opacity:0;transform:translateY(14px);animation:rise var(--dur-4) var(--ease-out) forwards}
.reveal:nth-child(1){animation-delay:.05s}.reveal:nth-child(2){animation-delay:.13s}
.reveal:nth-child(3){animation-delay:.21s}.reveal:nth-child(4){animation-delay:.29s}
@keyframes rise{to{opacity:1;transform:none}}

/* Cards with hover lift */
.card{
  background:var(--color-surface);border:1px solid var(--color-border);
  border-radius:var(--radius-3);padding:var(--space-5);box-shadow:var(--shadow-3);
  transition:transform var(--dur-2) var(--ease-out),border-color var(--dur-2);
}
@media(hover:hover){.card:hover{transform:translateY(-3px);border-color:var(--brand-500)}}

/* Button with haptic feedback */
.btn{
  min-height:48px;display:inline-flex;align-items:center;gap:.5rem;
  padding-inline:var(--space-5);border-radius:var(--radius-pill);font-weight:600;
  cursor:pointer;border:1px solid transparent;
  transition:filter var(--dur-2),transform var(--dur-2) var(--ease-out);
}
.btn--primary{background:var(--color-primary);color:var(--color-on-primary);}
@media(hover:hover){.btn--primary:hover{filter:brightness(1.06)}}
.btn:active{transform:scale(.97)}

:focus-visible{outline:2px solid var(--color-focus);outline-offset:2px}
@media(prefers-reduced-motion:reduce){.reveal{animation:none;opacity:1;transform:none}}
</style>
</head>
<body>
<div class="wrap" style="position:relative;z-index:1;max-inline-size:34rem;margin-inline:auto;padding:2rem max(1rem,5vw) 6rem">
  <header style="display:flex;align-items:center;justify-content:space-between;padding-block:.75rem;margin-bottom:2rem">
    <span style="font-family:var(--font-display);font-weight:700;font-size:var(--step-1);letter-spacing:-.02em">
      <span style="display:inline-block;width:1.4rem;height:1.4rem;border-radius:6px;background:conic-gradient(from 210deg,#8be9c2,#ff6b4a,#2dd4a7);box-shadow:0 0 24px rgba(45,212,167,.5);vertical-align:middle;margin-right:.5rem"></span>
      Halcyon
    </span>
    <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--brand-400);border:1px solid var(--color-border);padding:.45rem .6rem;border-radius:999px">v2.0 · live</span>
  </header>

  <section>
    <p class="reveal" style="font-family:var(--font-mono);font-size:.8rem;color:var(--color-text-subtle);text-transform:uppercase;letter-spacing:.18em;margin-bottom:1rem">Mobile-first by default</p>
    <h1 class="reveal" style="font-family:var(--font-display);font-weight:800;font-size:var(--step-4);line-height:1.0;letter-spacing:-.03em;text-wrap:balance">
      Ship interfaces that
      <span style="background:linear-gradient(100deg,#8be9c2,#ff6b4a);-webkit-background-clip:text;background-clip:text;color:transparent">don't look<br>AI-generated.</span>
    </h1>
    <p class="reveal" style="color:var(--color-text-muted);font-size:var(--step-1);margin-top:1rem;max-inline-size:32ch">
      A design system tuned for thumbs, screen readers, and Core Web Vitals — not for the median template.
    </p>
    <div class="reveal" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem">
      <div style="flex:1 1 8rem;background:color-mix(in oklab,#141419 70%,transparent);border:1px solid var(--color-border);border-radius:.625rem;padding:1rem;backdrop-filter:blur(6px)">
        <b style="font-family:var(--font-display);font-size:var(--step-3);display:block;letter-spacing:-.02em">44px</b>
        <span style="color:var(--color-text-subtle);font-size:.82rem">min touch target</span>
      </div>
      <div style="flex:1 1 8rem;background:color-mix(in oklab,#141419 70%,transparent);border:1px solid var(--color-border);border-radius:.625rem;padding:1rem">
        <b style="font-family:var(--font-display);font-size:var(--step-3);display:block;letter-spacing:-.02em">4.5:1</b>
        <span style="color:var(--color-text-subtle);font-size:.82rem">text contrast</span>
      </div>
      <div style="flex:1 1 8rem;background:color-mix(in oklab,#141419 70%,transparent);border:1px solid var(--color-border);border-radius:.625rem;padding:1rem">
        <b style="font-family:var(--font-display);font-size:var(--step-3);display:block;letter-spacing:-.02em">≤2.5s</b>
        <span style="color:var(--color-text-subtle);font-size:.82rem">LCP budget</span>
      </div>
    </div>
  </section>

  <section style="display:grid;gap:.75rem;margin-top:3rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))">
    <article class="card"><div style="width:2.4rem;height:2.4rem;border-radius:10px;display:grid;place-items:center;background:color-mix(in oklab,#2dd4a7 18%,transparent);color:#8be9c2;font-family:var(--font-mono);font-weight:500;margin-bottom:.75rem">Aa</div>
      <h3 style="font-family:var(--font-display);font-size:var(--step-1);letter-spacing:-.01em">Distinctive type</h3>
      <p style="color:var(--color-text-muted);font-size:.9rem;margin-top:.5rem">Bricolage Grotesque + Hanken Grotesk, fluid with clamp(). No Inter in sight.</p>
    </article>
    <article class="card"><div style="width:2.4rem;height:2.4rem;border-radius:10px;display:grid;place-items:center;background:color-mix(in oklab,#2dd4a7 18%,transparent);color:#8be9c2;font-family:var(--font-mono);font-weight:500;margin-bottom:.75rem">◑</div>
      <h3 style="font-family:var(--font-display);font-size:var(--step-1);letter-spacing:-.01em">Depth, not flat</h3>
      <p style="color:var(--color-text-muted);font-size:.9rem;margin-top:.5rem">Layered aurora gradients and grain replace the dead solid background.</p>
    </article>
  </section>
</div>
</body>
</html>
```

---

## Starter Design Tokens (CSS)

Copy into any new project as `tokens.css`. Replace brand colors per project:

```css
:root {
  /* Primitives: color scales */
  --neutral-50:  #f7f7f8; --neutral-100: #ebebed; --neutral-200: #d3d3d8;
  --neutral-300: #b0b0b8; --neutral-400: #84848f; --neutral-500: #5d5d68;
  --neutral-600: #44444d; --neutral-700: #2f2f37; --neutral-800: #1d1d24;
  --neutral-900: #141419; --neutral-950: #0b0b0f;

  --brand-400: #8be9c2; --brand-500: #2dd4a7; --brand-600: #16a37f;
  --accent-500: #ff6b4a;
  --green-500: #22c55e; --amber-500: #f59e0b; --red-500: #ef4444; --blue-500: #3b82f6;

  /* Primitives: space */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;    --space-5: 1.5rem;  --space-6: 2rem;
  --space-7: 3rem;    --space-8: 4rem;    --space-9: 6rem;

  /* Primitives: radius */
  --radius-1: 0.375rem; --radius-2: 0.625rem; --radius-3: 1rem; --radius-pill: 999px;

  /* Primitives: motion */
  --dur-1: 120ms; --dur-2: 220ms; --dur-3: 400ms; --dur-4: 650ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:  cubic-bezier(0.5, 0, 0.75, 0);

  /* Primitives: typography */
  --font-display: "Bricolage Grotesque", "Clash Display", ui-sans-serif, sans-serif;
  --font-sans:    "Hanken Grotesk", "General Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* Fluid type scale: min @360px, max @1240px */
  --step--1: clamp(0.83rem, 0.78rem + 0.25vw, 0.94rem);
  --step-0:  clamp(1.00rem, 0.93rem + 0.36vw, 1.13rem);
  --step-1:  clamp(1.20rem, 1.07rem + 0.65vw, 1.50rem);
  --step-2:  clamp(1.44rem, 1.21rem + 1.14vw, 2.00rem);
  --step-3:  clamp(1.73rem, 1.36rem + 1.85vw, 2.67rem);
  --step-4:  clamp(2.07rem, 1.49rem + 2.90vw, 3.55rem);
  --step-5:  clamp(2.49rem, 1.59rem + 4.49vw, 4.74rem);

  /* Semantic: light theme (remap for dark — see below) */
  --color-bg:            var(--neutral-50);
  --color-surface:       #ffffff;
  --color-border:        var(--neutral-200);
  --color-text:          var(--neutral-900);
  --color-text-muted:    var(--neutral-500);
  --color-text-subtle:   var(--neutral-400);
  --color-primary:       var(--brand-600);
  --color-primary-hover: var(--brand-500);
  --color-on-primary:    var(--neutral-950);
  --color-accent:        var(--accent-500);
  --color-focus:         var(--brand-600);
  --color-success: var(--green-500); --color-warning: var(--amber-500);
  --color-danger:  var(--red-500);   --color-info:    var(--blue-500);
  --shadow-1: 0 1px 2px rgba(11,11,15,.06), 0 1px 1px rgba(11,11,15,.04);
  --shadow-2: 0 4px 12px rgba(11,11,15,.08), 0 2px 4px rgba(11,11,15,.05);
  --shadow-3: 0 18px 40px rgba(11,11,15,.16), 0 6px 12px rgba(11,11,15,.08);
}

/* Dark: remap semantic layer only */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg:            var(--neutral-950);
    --color-surface:       var(--neutral-900);
    --color-border:        var(--neutral-800);
    --color-text:          var(--neutral-50);
    --color-text-muted:    var(--neutral-300);
    --color-primary:       var(--brand-500);
    --color-on-primary:    var(--neutral-950);
    --color-focus:         var(--brand-400);
    --shadow-3: 0 22px 50px rgba(0,0,0,.6);
  }
}
[data-theme="dark"] {
  --color-bg: var(--neutral-950); --color-surface: var(--neutral-900);
  --color-border: var(--neutral-800); --color-text: var(--neutral-50);
  --color-text-muted: var(--neutral-300); --color-primary: var(--brand-500);
  --color-focus: var(--brand-400);
}
```
