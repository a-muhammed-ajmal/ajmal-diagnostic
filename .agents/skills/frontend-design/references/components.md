# Component Architecture

## Standards

- **Strict Typing**: All props must have an explicit TypeScript `interface`. `any` is forbidden.
- **Named Exports**: Use `export function Component(…)` / `export const Component = …`. No default exports for components.
- **PascalCase filenames** matching the component name.
- **Class Merging**: Always use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.
- **Font**: Every component inherits Inter from `body`. Never set a different `font-family` on any component.
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
<div className="text-navy bg-ivory border-line">

// Also correct — CSS custom property where no utility exists
<div style={{ color: 'var(--color-gold-ink)' }}>

// Wrong — hardcoded hex
<div style={{ color: '#D6450F' }}>
```

Two exceptions where literal hex is unavoidable, because CSS custom properties are not available at render time: `icon.tsx` / `apple-icon.tsx` (Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/`. Values there must still match the tokens.

## Conditional Classes

```tsx
// Correct
className={cn('base', isActive && 'bg-gold text-navy', variant === 'ghost' && 'border-0')}

// Wrong
className={`base ${isActive ? 'bg-gold text-navy' : ''}`}
```

## Button Usage

**There is no shared `Button` component in this repo** — the recipe is applied inline with Tailwind. Canonical primary CTA:

```tsx
className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 py-4 font-heading text-base font-bold text-navy transition-colors hover:bg-gold-bright"
```

| Context | Treatment |
| --- | --- |
| Primary CTA | `bg-gold text-navy`, hover `bg-gold-bright`, `rounded-xl` |
| Secondary action on light | Bordered, `border-line`, navy text |
| Action on navy sections | Ghost / inverted, white text, visible border |

44px is the accessibility floor; primary CTAs here sit at 52–56px (`min-h-[52px]` / `min-h-[56px]`). Use `transition-colors` or an explicit property list — never `transition-all`.

If you find yourself writing this recipe a fourth time, extracting a `Button` primitive is justified — but don't create one speculatively as part of an unrelated change.

Every button and icon-only control must meet the `.tap-target` requirement (44×44px) and carry an accessible name.

## Server vs Client

Default to Server Components. Reach for `"use client"` only for local interaction state, browser APIs, event handlers, or client-only libraries — and keep the boundary as small as possible. Do not convert a whole page to a Client Component because one dropdown needs state.

Use `createAdminClient()` from `src/lib/supabase/server.ts` in Route Handlers and Server Components; `createBrowserClient()` from `client.ts` in Client Components. The admin client holds the service-role key and bypasses RLS — it must never reach the browser.
