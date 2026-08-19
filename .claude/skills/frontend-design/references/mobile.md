# Mobile-First Optimization

## Viewport Strategy

- **Design mobile first.** Build the 360px layout, then add `md:` for desktop. Desktop is an expansion of the mobile architecture, not a separate design.
- **Breakpoints in use**: `sm` (640px), `md` (768px), `lg` (1024px). `md` carries most of the layout shift — reach for `sm`/`lg` only when `md` alone can't express the change.
- **Content rail**: `max-width: 1280px; margin-inline: auto;` with page padding scaling from 16px on mobile to 48px at `lg`.
- **Always check 320px for overflow** even though 360px is the design baseline.

## Touch Interactions

- **Tap targets**: Every icon-only button, checkbox, and compact control **must** use `.tap-target` for a minimum 44×44px touch area. Density comes from layout efficiency, never from shrinking controls.
- **Reachability**: Keep the primary action within comfortable thumb reach on a 360×640 viewport.
- **Hover is not available.** Anything discoverable only on hover must have a tap-or-focus equivalent.

## Readability

- **No horizontal scrolling** at 320px or 375px — test every layout.
- **Body prose is 12px** (`--step-0`), by explicit brand direction. This overrides the usual 16px readability floor — it is a known, accepted trade-off, not an oversight, so do not "correct" it. Two consequences: there is no size tier below body, and every string needs 4.5:1 contrast because nothing counts as WCAG large text. `input`, `select`, and `textarea` stay pinned to 16px globally to prevent iOS zoom on focus — never override that, even for visual consistency with 12px labels.
- Line length ~60–75 characters where the layout allows.
- Prefer a single content column below `md`. Side-by-side content needs a real justification.

## Tables on Mobile

Don't auto-convert every table to cards. Choose per data shape:

- Horizontal scroll inside an `overflow-x: auto` container
- Priority-column reduction (hide low-value columns below `md`)
- Row expansion for detail
- Stacked label/value pairs

## Safe Area

For any fixed-bottom element:

```css
padding-bottom: env(safe-area-inset-bottom);
```

Always account for the iPhone home indicator.

## Not This Site's Patterns

This is a marketing and diagnostic site, not an app shell. Don't introduce bottom navigation bars, FABs, or drag-handle bottom sheets unless explicitly asked.
