# Frontend Design Skill

## Purpose
This skill helps create distinctive, memorable frontends that avoid generic AI-generated design patterns. It emphasizes typography, bespoke color systems, motion that's justified rather than decorative, and copy that does real work — all derived from the specific brief, not reused from project to project.

## Principles

### 1. Distinctive Typography
- Pair a display face with a body face deliberately for the brief at hand — not the same combination reused project to project
- Implement a clear type scale with `clamp()` for responsive sizing, with intentional weights and letter-spacing
- Let the pairing carry the page's personality, not just deliver the words
- Avoid: defaulting to one "go-to" combination (e.g., Playfair Display + Inter) regardless of subject; inconsistent sizes; poor line-height

### 2. Bespoke Color Systems
- Derive a 4–6 color palette **from the brief itself** — what does this subject's world actually look like? — rather than reusing a stock blue/orange/teal set across unrelated projects
- Define CSS variables with semantic names (primary, accent, background, text) so the palette is traceable, not scattered
- Maintain WCAG AA contrast (4.5:1 minimum for text)
- Use opacity/alpha channels for depth where it serves the design, not as decoration
- Avoid: reusing the same "safe" accent color everywhere; random unnamed hex values; treating the palette as an afterthought instead of a brief-driven decision

### 3. Motion With a Reason
Match the easing curve to the brand's personality instead of reusing one "signature" bounce on every project:

| Brand Feel | Easing | Use Case |
|---|---|---|
| Crisp / efficient | `cubic-bezier(0.4, 0, 0.2, 1)` | SaaS dashboards, fintech, ops tools |
| Playful / energetic | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Consumer apps, youth brands, games |
| Luxurious / considered | `cubic-bezier(0.16, 1, 0.3, 1)` | Premium, editorial, high-end consulting |
| Snappy / direct | `cubic-bezier(0.65, 0, 0.35, 1)` | Developer tools, technical products |

- Apply staggered delays to sequenced elements so groups feel orchestrated, not scattered
- Animate transforms (scale, rotate, translateY) — never properties that trigger layout recalculation
- One orchestrated moment (a page-load sequence, a scroll-triggered reveal) usually lands harder than effects sprinkled throughout
- Avoid: using the same bounce curve regardless of brand; animating because you can rather than because it helps; motion so frequent it stops registering as meaningful

### 4. High-Impact Micro-Interactions
- Hover states that provide feedback (scale, color shift, border change) — calibrated to brand intensity, not maxed out by default
- Animated underlines on navigation links where it suits the brand's formality
- Icon animations on hover (rotate, scale), used sparingly so they stay meaningful
- Loading states and visual confirmations on state changes
- Avoid: static, unresponsive interfaces; micro-interactions applied to every element regardless of importance

### 5. Layout & Spacing
- Use CSS custom properties for consistent spacing (`--spacing-xs` through `--spacing-2xl`)
- Implement max-width containers for readability
- Use CSS Grid and Flexbox with proper gap management
- Mobile-first responsive design; whitespace as a design element
- Avoid: fixed pixels, inconsistent spacing, layouts that don't adapt

### 6. Anti-Patterns to Avoid
The risk right now isn't the decade-old "AI slop" list — it's three specific, current defaults that AI-generated design clusters around regardless of subject:
- **The cream/terracotta look:** warm cream background (~`#F4F1EA`) + high-contrast serif + terracotta accent
- **The dark/acid look:** near-black background + a single bright acid-green or vermilion accent
- **The broadsheet look:** hairline rules, zero border-radius, dense newspaper-style columns

None of these is wrong in isolation — the problem is reaching for one *by default*, not as a deliberate choice for this brief. Also still avoid the older, more obvious tells: flat purple/blue gradients with no intention, unstyled system fonts, pure white backgrounds with gray text and no hierarchy, generic emoji as icons, and generic marketing copy ("Streamline Your Workflow"). If the brief explicitly asks for one of these looks, follow it — the issue is defaulting there by omission, not choosing it on purpose.

### 7. Copy That Does a Job
- Words are design material, not decoration — every line should make the interface easier to understand and use
- Write from the user's side of the screen: name things by what people control and recognize, never by backend terms (a person manages "notifications," not "webhook config")
- Default to active voice: a control names exactly what happens when used ("Save changes," not "Submit") — and vocabulary stays constant through the flow, so a "Publish" button produces "Published," not "Success"
- Treat errors and empty states as moments for direction, not mood: explain what went wrong and how to fix it, in the interface's voice — never apologetic or vague
- Keep register conversational and tuned to the brand: plain verbs, sentence case, no filler
- Avoid: generic marketing language; passive or vague button copy ("Submit," "Continue"); apologetic or unclear errors; copy doing two jobs at once

## Implementation Checklist
- [ ] Derive a 4–6 color palette from the brief itself, not a reused default set
- [ ] Define CSS variables for colors, spacing, and typography with semantic names
- [ ] Pair 2+ typefaces deliberately for this project, not a repeated go-to combination
- [ ] Pick an easing curve matched to brand personality — not one default bounce
- [ ] Justify every animation in one sentence before adding it
- [ ] Calibrate hover/focus states to brand intensity, not maxed by default
- [ ] Write all interface copy in active voice from the user's point of view
- [ ] Check the design against the three current AI-look defaults — and the brief — before finalizing
- [ ] Ensure mobile responsiveness with `@media` queries
- [ ] Test contrast ratios with accessibility tools
- [ ] Avoid naming elements generically ("container", "wrapper")

## Example Patterns

**CSS Variables (template — values must come from the brief, not be copied)**
```css
:root {
    --color-primary: /* derive from brief */;
    --color-accent: /* derive from brief */;
    --color-text: /* derive from brief */;
    --spacing-md: 1.5rem;
}
```

**Brand-Matched Easing**
```css
.element--crisp   { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.element--premium { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
```

**Staggered Animation**
```css
.element { animation: fadeInUp 0.8s ease-out 0.2s both; }
.element:nth-child(2) { animation-delay: 0.3s; }
```

**Hover Interaction**
```css
.button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}
```

**Typography Scale**
```css
h1 {
    font-size: clamp(2rem, 6vw, 4rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
}
```

**Copy Pattern**
```
Button: "Save changes"  →  Confirmation: "Changes saved"
Button: "Publish"       →  Confirmation: "Published"
Error: "We couldn't save your changes. Check your connection and try again."
```

## When to Apply
- Building new UI components or pages
- Redesigning existing interfaces that feel generic
- Creating marketing landing pages
- Elevating visual hierarchy in dashboards
- Adding polish and personality to applications

## Success Metrics
- Does the palette trace back to a decision about this specific brief, not a reused default?
- Does the typeface pairing feel chosen for this project, not a repeated habit?
- Does every animation have a one-sentence justification, with easing matched to brand feel?
- Is copy written in active voice, from the user's point of view, with consistent vocabulary?
- Does the design avoid the three current AI-look defaults unless the brief specifically asked for one?
- Is the interface responsive and accessible?

## References
- https://fonts.google.com/
- https://coolors.co/
- https://easings.net/
- https://web.dev/responsive-web-design-basics/
- https://www.w3.org/WAI/WCAG21/quickref/
