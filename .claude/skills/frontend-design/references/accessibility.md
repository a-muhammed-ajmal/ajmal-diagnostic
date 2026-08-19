# Accessibility Standards

## Core Requirements

- **Semantic HTML**: Use appropriate tags (`<main>`, `<nav>`, `<section>`, `<article>`) instead of generic `<div>` wrappers for screen reader compatibility.
- **Interactive Elements**: Every interactive element must be keyboard-accessible. Never remove the focus ring (`outline`) without providing a visible replacement using `--color-focus` (`#0052FF`).
- **ARIA Labels**: All icon-only buttons or interactive elements without visible text must have descriptive `aria-label` attributes.
- **Color Contrast**: Minimum 4.5:1 for body text, 3.0:1 for large text/UI. Body tops out at 14px on mobile and 16px on desktop, so **body never qualifies as WCAG large text — assume 4.5:1 everywhere** and only lean on the 3:1 allowance for genuine display headings. `--color-brand-ink` (`#0037A5`, 10.1:1) is the token for blue text on white and `--color-accent-ink` (`#B45309`, 5.0:1) for amber. `--color-brand` (`#0052FF`) is 5.8:1 and legal as text, but prefer the ink token for prose. `--color-accent` (`#FFBF00`) is **1.65:1 and is never a text colour on a light surface** — it is a fill that carries dark text, or a border highlight. `--color-muted` (`#475569`, 7.6:1) is the lightest legal text colour — never mute text with opacity.
- **Form Labels**: Every input must have a programmatically associated `<label>` or `aria-labelledby`. A placeholder is not a label.

## Focus Ring — Mandatory

Already set globally in `globals.css`:

```css
*:focus-visible {
  outline: 2px solid var(--color-focus); /* #0052FF */
  outline-offset: 2px;
}
```

Never override this to `outline: none` without adding a replacement. Check that focus is not hidden behind sticky headers.

## Implementation Checklist

- [ ] Use `lucide-react` icons with `aria-hidden="true"` when decorative.
- [ ] Tab order follows the logical visual flow.
- [ ] All images have an `alt` attribute; decorative images use `alt=""`.
- [ ] Status messages (e.g. "Message sent") announced via `aria-live` regions.
- [ ] All icon-only buttons use `.tap-target` (44×44px minimum).
- [ ] Use `--color-brand-ink` (`#0037A5`) for blue text and `--color-accent-ink` (`#B45309`) for amber text on light, never the raw amber fill.
- [ ] Below 768px, no heading exceeds 24px and no body copy exceeds 14px — verify by measurement, not by eye.
- [ ] Amber fills (`bg-accent`, `bg-amber-500`) carry `text-canvas-dark`/`text-ink`, never `text-white`.
- [ ] Information is never conveyed by color alone — pair with icon, label, weight, or border.
- [ ] One `<h1>` per page; heading levels are not skipped.
- [ ] Layout survives 200% browser zoom and reflows without horizontal scroll.
- [ ] `prefers-reduced-motion` respected — `globals.css` handles this globally.
