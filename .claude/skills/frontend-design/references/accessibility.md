# Accessibility Standards

## Core Requirements

- **Semantic HTML**: Use appropriate tags (`<main>`, `<nav>`, `<section>`, `<article>`) instead of generic `<div>` wrappers for screen reader compatibility.
- **Interactive Elements**: Every interactive element must be keyboard-accessible. Never remove the focus ring (`outline`) without providing a visible replacement using `--color-focus` (`#C6752E`).
- **ARIA Labels**: All icon-only buttons or interactive elements without visible text must have descriptive `aria-label` attributes.
- **Color Contrast**: Minimum 4.5:1 for body text, 3.0:1 for large text/UI elements. Note: `--color-gold-ink` (`#8C4D1F`) is the correct token for brass text on white — not `--color-gold` (`#C6752E`), which fails AA at small sizes. The same split applies to `--color-teal-ink`, `--color-emerald-ink`, and `--color-warning-ink`.
- **Form Labels**: Every input must have a programmatically associated `<label>` or `aria-labelledby`. A placeholder is not a label.

## Focus Ring — Mandatory

Already set globally in `globals.css`:

```css
*:focus-visible {
  outline: 2px solid var(--color-focus); /* #C6752E */
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
- [ ] Use `--color-gold-ink` (`#8C4D1F`) for brass text on white, never raw `--color-gold`.
- [ ] Information is never conveyed by color alone — pair with icon, label, weight, or border.
- [ ] One `<h1>` per page; heading levels are not skipped.
- [ ] Layout survives 200% browser zoom and reflows without horizontal scroll.
- [ ] `prefers-reduced-motion` respected — `globals.css` handles this globally.
