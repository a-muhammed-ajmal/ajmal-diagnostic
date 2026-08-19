# Accessibility Standards

## Core Requirements

- **Semantic HTML**: Use appropriate tags (`<main>`, `<nav>`, `<section>`, `<article>`) instead of generic `<div>` wrappers for screen reader compatibility.
- **Interactive Elements**: Every interactive element must be keyboard-accessible. Never remove the focus ring (`outline`) without providing a visible replacement using `--color-focus` (`#2563EB`).
- **ARIA Labels**: All icon-only buttons or interactive elements without visible text must have descriptive `aria-label` attributes.
- **Color Contrast**: Minimum 4.5:1 for body text, 3.0:1 for large text/UI. **Because body is 12px, almost nothing on this site qualifies as WCAG large text — assume 4.5:1 everywhere.** `--color-brand-ink` (`#1E40AF`) is the token for blue text on white and `--color-accent-ink` (`#B45309`) for amber; the raw fills `--color-brand` and especially `--color-accent` (2.1:1) are not text colours. `--color-muted` (`#5B6273`) is the lightest legal text colour — never mute text with opacity.
- **Form Labels**: Every input must have a programmatically associated `<label>` or `aria-labelledby`. A placeholder is not a label.

## Focus Ring — Mandatory

Already set globally in `globals.css`:

```css
*:focus-visible {
  outline: 2px solid var(--color-focus); /* #2563EB */
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
- [ ] Use `--color-brand-ink` (`#1E40AF`) for blue text and `--color-accent-ink` (`#B45309`) for amber text on white, never the raw fill tokens.
- [ ] Information is never conveyed by color alone — pair with icon, label, weight, or border.
- [ ] One `<h1>` per page; heading levels are not skipped.
- [ ] Layout survives 200% browser zoom and reflows without horizontal scroll.
- [ ] `prefers-reduced-motion` respected — `globals.css` handles this globally.
