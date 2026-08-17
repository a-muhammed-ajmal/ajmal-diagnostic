# Performance Targets

## Core Web Vitals

- **LCP** < 2.5s — optimise the critical rendering path. Inter loads via `next/font/google`, which self-hosts and avoids FOUT.
- **CLS** < 0.1 — always give images explicit `width`/`height`, and reserve space for content that arrives late.
- **INP** < 200ms — the responsiveness metric that replaced FID. Avoid main-thread tasks over 50ms; break up heavy client work.

## Font Loading

Inter is the only typeface, loaded once in `src/app/layout.tsx`:

```ts
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
```

`--font-heading`, `--font-body`, `--font-sans`, and `--font-display` all resolve to `var(--font-inter)`. Never add a `<link>` to Google Fonts — `next/font` self-hosts and eliminates the round-trip.

## Rendering

- **Default to Server Components.** Every `"use client"` boundary ships JavaScript; keep them small and pushed to the leaves.
- Fetch on the server where possible rather than in a client effect.
- Give routes explicit loading and error boundaries.
- Avoid making a whole page a Client Component for one interactive control.

## Optimization Rules

- **Images**: `next/image` for all production images, WebP/AVIF, `loading="lazy"` off-screen, explicit dimensions.
- **Animations**: `transform` and `opacity` only — never `width`, `height`, `top`, `left`, or any layout-triggering property.
- **Transitions**: keep UI feedback at `--dur-1` (120ms) or `--dur-2` (220ms); nothing over `--dur-4` (650ms). `prefers-reduced-motion` is handled globally in `globals.css`.
- **Layout thrashing**: never read and write DOM style in the same loop; batch reads before writes.

## Bundle

- **No animation library.** Motion is native CSS, including the scroll-driven `animation-timeline` effects already in `globals.css`.
- **No icon sets beyond `lucide-react`** — it tree-shakes per icon. Import named icons, never the barrel.
- **No utility-heavy dependencies** (lodash, moment) — use native JS and `Intl`.
- Audit before adding anything: a dependency needs a functional reason, not a convenience one.
