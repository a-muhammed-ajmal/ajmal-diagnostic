# Frontend design implementation

## Purpose

The consulting website uses a compact, operational interface for founder-led SMEs. The visual system prioritizes **clarity, control, and action**: users should understand the page quickly, find the next step without searching, and complete the primary task with minimal interaction.

## Source of truth

The implementation source of truth is `src/app/globals.css` together with `.claude/skills/frontend-design.md`. Existing project tokens are intentionally reused rather than duplicated in JSX or component-local CSS.

| Area | Implementation |
|---|---|
| Primary surface | `bg-ivory` / `bg-white` with the existing graph-paper and aurora treatment |
| Strong surface | `bg-navy` with `text-ivory` |
| Action color | `bg-gold`, with `bg-gold-bright` on hover |
| Supporting accent | `text-teal` and `text-teal-ink` |
| Typography | `font-heading` and `font-body`, both backed by the project font variable |
| Borders | `border-navy/10`, `border-ivory/15`, or the semantic `border-line` token |
| Interaction | Minimum 44px target, visible focus ring, explicit transition properties |
| Motion | Existing `.reveal`, `.card-interactive`, and reduced-motion guard |

## Reusable primitives

`src/components/ui/Button.tsx` is the canonical action component. It provides `primary`, `secondary`, `quiet`, and `danger` variants for both internal links and buttons, preserves a 44px minimum touch target, and supports disabled and external-link states.

`src/components/ui/Surface.tsx` provides the canonical compact surface treatments (`default`, `muted`, and `dark`) and the `SectionHeader` hierarchy pattern. It should be preferred for new cards and section introductions so page-level layouts stay consistent.

## Page composition

Every page should identify one primary action before layout work begins. A typical page uses a compact navigation bar, a clear page-introduction block, bordered content modules, explicit empty/loading/error/success states where the task requires them, and a single dominant CTA. Mobile layouts start at approximately 360px and expand through the project’s existing responsive utilities.

## Content and evidence

Business claims must be supported by the supplied project content. Do not add client names, logos, testimonials, awards, certifications, revenue figures, or performance claims without evidence. Unknown information must be marked `[TO CONFIRM]` rather than replaced with plausible-looking filler.

## Validation checklist

Before merging frontend changes, verify that the main journey works with a keyboard, focus is visible, controls meet the touch-target minimum, text remains readable at 200% zoom, reduced motion leaves the page usable, images have appropriate alternative text, and the primary action remains obvious at mobile widths. Run `npm run lint`, `npm test -- --runInBand`, and `npm run build`.
