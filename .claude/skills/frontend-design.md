---

# Frontend Design — Project Skill

This project follows the attached `frontend-design` specification. Build production-grade, mobile-first interfaces that feel structured, compact, professional, fast, scannable, operational, trustworthy, accessible, and conversion-aware.

## Source of truth

Use `src/app/globals.css` as the implementation source of truth. Do not invent alternative colors, fonts, radii, surface effects, or decorative treatments in page components.

## Brand tokens

| Token | Value | Role |
|---|---|---|
| `--color-violet` | `#5B21B6` | Primary actions, selected emphasis, brand moments |
| `--color-violet-deep` | `#3B167A` | Hover and pressed state |
| `--color-ink` | `#111827` | Primary text |
| `--color-canvas` | `#F8FAFC` | Page background |
| `--color-surface` | `#F1F5F9` | Secondary light surface |
| `--color-border` | `#D0D7DE` | Structural light border |
| `--color-slate` | `#475569` | Secondary text |
| `--color-teal` | `#0F766E` | Supporting actions, data highlights, system indicators |
| `--color-teal-bright` | `#0D9488` | Supporting emphasis |
| `--color-dark-surface` | `#0D1117` | Primary dark surface |
| `--color-dark-raised` | `#161B22` | Dark raised panel |
| `--color-dark-border` | `#30363D` | Dark boundary |

Violet is dominant. Teal supports the system. Use separate semantic colors for success, warning, error, and information; neither Violet nor Teal automatically means a status.

## Typography

Use the system stack: `"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`. Do not load Google Fonts or bundle proprietary font files. Use one H1 per page, sentence case, active voice, concrete operational language, and approximately 60–75 characters per prose line.

The mobile baseline is 360px: H1 24px/30px, H2 20px/25px, H3 16px/20px, lead 18px/27px, body 16px/24px, compact UI 14px/20px, metadata 12px/16px, and buttons 14px/20px.

## Surfaces and geometry

Prefer flat white, canvas, surface, dark surface, and dark raised surfaces. Do not use gradients, gradient text, graph-paper overlays, grain, glow effects, decorative blur clouds, glassmorphism, or floating translucent cards by default.

Use 1px borders as a primary structural tool. Controls, buttons, inputs, selects, dropdowns, and menus use a 6px radius. Cards and panels use an 8px radius. Major visual containers may use 12px. Reserve pill geometry for tags, badges, status labels, filters, and segmented controls.

## Layout and navigation

Design the 360px layout first and expand it for desktop. Use 16px page padding at 360px, 24px at 480px, 32px at 768px, 48px at 1024px, and 64px at 1280px. Standard content should normally remain within 1200px.

The header is compact and bordered, approximately 48–56px on mobile, with an approved logo or symbol, explicit current navigation state, a 44px menu trigger, visible focus, and one-interaction mobile access to important destinations. Active navigation must use more than color alone.

A standard hero contains one H1, one supporting paragraph, one primary CTA, and at most one secondary CTA. Do not add decorative dashboards, random metrics, logo clouds, giant gradients, AI illustrations, or floating cards without supplied evidence.

## Interaction and state

Use `src/components/ui/Button.tsx` for actions. Primary buttons use Violet, secondary actions use Teal or neutral styling, and icon-only controls require an accessible name and a 44×44px target. Inputs need visible labels, correct autocomplete and input type, visible focus, explicit validation, and corrective error text. Placeholders never replace labels.

Provide loading, empty, error, success, disabled, and selected states wherever a task requires them. Selected state must use more than color alone. Respect keyboard navigation, reduced motion, 200% zoom, and screen-reader semantics.

## Evidence rules

Never invent testimonials, client names, logos, metrics, awards, certifications, partner relationships, case-study results, customer counts, performance improvements, geographic presence, or legal claims. Use `[TO CONFIRM]` when required information is unavailable.

## Validation

Before merging frontend changes, run `npm run lint`, `npm test -- --runInBand`, `npx tsc --noEmit`, and `npm run build`. Review the homepage, diagnostic, contact, services, insights, and admin routes at mobile and desktop widths.
