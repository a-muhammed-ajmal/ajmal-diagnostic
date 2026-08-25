# Component Architecture

## Standards

- **Strict Typing**: All props must have an explicit TypeScript `interface`. `any` is forbidden.
- **Named Exports**: Use `export function Component(…)` / `export const Component = …`. No default exports for components.
- **PascalCase filenames** matching the component name.
- **Class Merging**: Always use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.
- **Font**: Plus Jakarta Sans for headings and display; Lexend for body, UI, and small text. No third face, and nothing in Lexend above weight 500. Every component inherits both from the `body`/heading rules — never set a different `font-family` on any component. Button and control labels are UI text, so they take `font-body`.
- **Forms**: `react-hook-form` + a `zod` schema. No uncontrolled inputs.

## File Structure Pattern

1. `"use client"` directive — only if the component genuinely needs it
2. Imports — external libs → internal hooks/utils → types
3. TypeScript interface definition
4. Component definition using `cn()`
5. Sub-components or helper functions (if small)
6. Named export

## Where Components Live

```text
src/components/
  layout/      Navigation, Footer
  ui/          Button and shared primitives
  quiz/        QuestionCard, OptionButton, ProgressBar
  contact/     ContactForm, CalendlyWidget
  lead/        LeadCaptureForm
  newsletter/  NewsletterForm
  insights/    ArticleToc
```

Place a new component in the folder matching its feature. Create a new folder only when a feature owns two or more components.

## Token Usage Pattern

```tsx
// Correct — Tailwind token classes
<div className="text-ink bg-brand-tint border-line">

// Also correct — CSS custom property where no utility exists
<div style={{ color: 'var(--color-brand-ink)' }}>

// Wrong — hardcoded hex
<div style={{ color: '#0037A5' }}>
```

Two exceptions where literal hex is unavoidable, because CSS custom properties are not available at render time: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/`. Values there must still match the tokens.

One more rule with no exception: a hardcoded **font-size** is always wrong. It escapes the `--step-N` scale and therefore the mobile ceilings.

## Conditional Classes

```tsx
// Correct
className={cn('base', isActive && 'bg-brand text-white', variant === 'ghost' && 'border-0')}

// Wrong
className={`base ${isActive ? 'bg-brand text-white' : ''}`}
```

## Button Usage

Use the shared `<Button>` from [Button.tsx](../../../../src/components/ui/Button.tsx) — do not hand-roll the recipe.

| Variant | Treatment | Use for |
| --- | --- | --- |
| `primary` (default) | `bg-brand text-white`, hover `bg-brand-hover` + electric glow + lift | The one dominant action |
| `secondary` | `border-brand text-brand-ink`, hover fills blue | Supporting action on light |
| `quiet` | `border-line bg-white`, hover blue border + `text-brand-ink` | Low-emphasis action |
| `accent` | `bg-accent text-canvas-dark`, hover `bg-accent-hover` + amber glow | Premium/secondary highlight CTA |
| `danger` | `bg-danger text-white` | Destructive confirm |

The `accent` variant pairs amber with **dark slate text**, never white — `#FFBF00` is 1.65:1 against white.

It picks its element from its props — `href` gives a `next/link`, `href` + `external` gives `<a target="_blank" rel="noreferrer">`, neither gives a `<button>` (default `type="button"`). `fullWidth` spans the container.

The base class already carries `min-h-11` (the 44px floor), `focus-visible` outline, `transition-all duration-200` with the mandated `-0.5` hover lift, and disabled styling. Don't re-add them.

Pair it with `<Surface>` (`tone`: `default` | `muted` | `accent` | `glass`, plus `interactive`) and `<SectionHeader>` (`eyebrow` / `title` / `description`, `align`) from `Surface.tsx`. The `glass` tone is the glassmorphism panel and brings its own border and shadow.

If a genuinely new shape is needed, add a variant to `Button` rather than duplicating the recipe in a page.

Every button and icon-only control must meet the `.tap-target` requirement (44×44px) and carry an accessible name.

## Server vs Client

Default to Server Components. Reach for `"use client"` only for local interaction state, browser APIs, event handlers, or client-only libraries — and keep the boundary as small as possible. Do not convert a whole page to a Client Component because one dropdown needs state.

Use `createAdminClient()` from `src/lib/supabase/server.ts` in Route Handlers and Server Components; `createBrowserClient()` from `client.ts` in Client Components. The admin client holds the service-role key and bypasses RLS — it must never reach the browser.
