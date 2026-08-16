--- 

name: frontend-design  

description: Creates production-grade, mobile-first frontend interfaces for Muhammed Ajmal Consulting using a compact GitHub-inspired information architecture, Segoe UI typography, the Violet + Teal brand system, Next.js, TypeScript, Tailwind CSS v4, Supabase, and Vercel. 

--- 

This skill guides the creation of production-grade frontend interfaces for Muhammed Ajmal Consulting. 

Use the brand guidelines skill as the source of truth for logo, typography, colors, spacing, and brand treatment. 

The interface is designed like GitHub, focusing on: 

- High information density 

- Easy scanning 

- Compact controls 

- Clear hierarchy 

- Strong borders 

- Organized navigation 

- Efficient use on mobile devices 

Do not copy GitHub trademarks, logos, proprietary assets, or exact page compositions. 

The user provides frontend requirements: a component, page, application, or interface to build. 

Design Thinking 

Before coding, resolve these requirements in order: 

Purpose: State the user's primary task in one sentence. 

Business outcome: State the measurable or observable outcome in one sentence. 

Audience: Default to founder-led SMEs in the UAE, GCC, and South Asia unless a narrower audience is supplied. 

Primary action: Assign exactly one primary action to each page or task state. 

Information hierarchy: Classify content as primary, secondary, or supporting before laying out the page. 

Brand: Read brand guidelines before selecting colors, typography, logo treatment, radius, or spacing. 

Mobile baseline: Design the 360px viewport first. 

Density: Prefer structured density over decorative whitespace. 

Navigation: Keep important destinations reachable within one mobile menu interaction. 

Technical stack: Default to Next.js, TypeScript, Tailwind CSS v4, Supabase, and Vercel. 

Unknown content: Mark unsupplied business evidence, testimonials, client logos, photography, legal details, or metrics as [TO CONFIRM]. 

Use these layout rules: 

Design at 360px first. 

Use one primary content column below 768px. 

Use 16px horizontal padding at 360px. 

Use 24px horizontal padding from 480px. 

Use 32px horizontal padding from 768px. 

Use 48px horizontal padding from 1024px. 

Use 64px horizontal padding from 1280px. 

Use an 8px base spacing rhythm. 

Permit 4px half-steps only for tightly coupled interface elements. 

Use 4-8px gaps between icons and associated text. 

Use 8-12px gaps inside compact interface groups. 

Use 16px gaps between standard content groups. 

Use 24-32px between major page modules on mobile. 

Prefer 1px dividers over unnecessary 48-80px blank gaps. 

Cap normal page content at 1200px. 

Keep prose at 60-75 characters per line. 

Target 68 characters. 

Do not allow standard page content to horizontally overflow at 320px. 

Responsive breakpoints: 

Base: 0px — build for 360px first. 

sm: 480px / 30rem. 

md: 768px / 48rem. 

lg: 1024px / 64rem. 

xl: 1280px / 80rem. 

2xl: 1536px / 96rem. 

Component rules: 

Header: compact, bordered, and persistent only when persistence improves navigation. 

Mobile header: 48-56px high. 

Mobile menu trigger: minimum 44x44px. 

Primary navigation: use 14px text, weight 500 or 600. 

Hero: use one H1, one supporting paragraph, one primary CTA, and at most one secondary CTA. 

Primary button: minimum 44px height, 14px text, weight 500 or 600, 6px radius. 

Secondary button: minimum 44px height, 1px visible border, 6px radius. 

Icon button: minimum 44x44px with an accessible name. 

Text input: minimum 44px height, 6px radius, 1px border. 

Select: minimum 44px height, full width on mobile where appropriate. 

Dropdown menu: compact rows, visible selected state, keyboard navigation, 6px outer radius. 

Card: use 1px border, 8px radius, and 12-16px mobile padding. 

Compact card: permit 8-12px padding for dense dashboard information. 

Accordion: use a minimum 44px interactive header. 

Tabs: use 14px text; expose selected state through more than color alone. 

Table: Use semantic headers and compact 14px data text. 

Badge: use 12px text and reserve pill geometry for status/category labels. 

Alert: include an icon or label in addition to color. 

KPI: display label, value, unit where applicable, and comparison period when a comparison is shown. 

Breadcrumb: Use only when the hierarchy contains at least two meaningful levels. 

Modal: trap focus, support Escape, provide explicit close control, and restore focus. 

Toast: Do not use information that must remain available for task completion. 

Empty state: state what is empty and provide the next valid action. 

Error state: state what failed and the corrective action. 

Loading state: preserve layout dimensions where possible. 

Footer: use compact grouped navigation rather than oversized marketing sections. 

Frontend Aesthetics Guidelines 

Focus on: 

Typography: Use Segoe UI with the approved system fallback stack. H1 is 24px/600 at the 360px baseline. H2 is 20px/600. H3 is 16px/600. Body Prose is 16px/400. Compact UI text is 14px. Metadata is 12px. Do not reduce body prose to 14px. 

Color & Theme: Use confirmed Violet + Teal brand tokens. Violet is primary. Teal is secondary. Use White, Canvas, Surface, Ink, and defined border colors to create structure. Do not use gradients as the default brand treatment. 

Motion: Keep standard interface transitions between 120ms and 200ms. Keep non-essential entrance motion below 300ms. Respect prefers-reduced-motion. 

Spatial Composition: Use structured, compact vertical rhythm. Prefer clear sections, borders, lists, tabs, and grouped modules over floating decorative cards. 

Backgrounds & Visual Details: Default to flat surfaces. Use White, Canvas, Surface, Dark Surface, and Dark Raised. Do not add noise, grain, glassmorphism, glow, gradient mesh, decorative particles, or custom cursors unless explicitly requested. 

Borders: Use #D0D7DE in light mode and #30363D in dark mode for standard boundaries. 

Radius: Use 6px for controls and 8px for cards. Do not apply oversized 20-32px radii to standard interface containers. 

Logo: Use the confirmed Connected Foundation / Scalable System circular mark. Keep the central core and three surrounding nodes visible. Do not replace the symbol with initials. 

Information Density: Fit related information into one scannable module before creating additional cards. 

Hierarchy: Establish hierarchy through weight, size, borders, grouping, and position before using additional colors. 

Navigation: Show active location clearly. 

Links: Remove underline by default for standalone navigation. Underline inline prose links on hover/focus and whenever required for unambiguous identification. 

Touch: Every primary touch target must be at least 44x44px. 

Never use generic AI aesthetics as the default design language. 

Never use large purple gradients merely because the business uses AI. 

Never create glowing AI brains, circuit patterns, generic sparkles, floating glass cards, or decorative network backgrounds. 

Never invent client logos, testimonials, business metrics, certifications, awards, case-study results, or partner relationships. 

Never use a decorative font instead of a Segoe UI. 

Never use the logo symbol as arbitrary decoration throughout every section. 

Never reduce a tap target below 44x44px to increase density. 

Never sacrifice readability for compactness. 

Accessibility checks: 

Verify body prose is at least 16px at 360px. 

Verify normal text contrast is at least 4.5:1. 

Verify that WCAG-defined large text contrast is at least 3:1. 

Verify that every primary interactive target is at least 44x44px. 

Verify keyboard access to all functionalities. 

Verify visible keyboard focus. 

Verify focus is not hidden behind sticky UI. 

Verify logical heading hierarchy. 

Verify one H1 per page. 

Verify that every form of control has an accessible label. 

Verify errors to identify the field and corrective action. 

Verify meaningful images that have alt text. 

Verify decorative images are ignored by assistive technology. 

Verify information is not communicated through color alone. 

Verify controls to expose names, roles, states, and values. 

Verify interface usability at 200% browser zoom. 

Verify reflow without two-dimensional scrolling except where required. 

Verify reduced-motion preference. 

Verify hover-only content has keyboard-accessible behavior. 

Verify light and dark themes independently. 

Pre-ship QA: 

Test 320px for overflow. 

Test 360px as the primary mobile baseline. 

Test 480px. 

Test 768px. 

Test 1024px. 

Test 1280px. 

Test 1536px. 

Confirm body prose is at least 16px. 

Confirm compact UI text is not used as a long-form body copy. 

Confirm prose line length remains 60-75 characters where space permits. 

Confirm the required contrast ratios. 

Confirm 44x44px touch targets. 

Complete primary journeys using keyboard only. 

Confirm visible focus states. 

Test 200% zoom. 

Test reduced motion. 

Confirm heading hierarchy. 

Confirm the form of labels. 

Confirm validation and error states. 

Confirm the loading states. 

Confirm the empty states. 

Confirm disabled states. 

Confirm success states. 

Confirm the dark mode. 

Confirm light mode. 

Confirm that Violet is used as the primary brand/action color. 

Confirm that Teal remains secondary. 

Confirm that Segoe UI is primary. 

Confirm the 6px control radius. 

Confirm 8px standard card radius. 

Confirm 1px structural borders. 

Confirm spacing follows the 8px system with permitted 4px half-steps. 

Confirm that the circular logo retains its central core and three outer nodes. 

Confirm that no initials have been substituted for the logo. 

Confirm that no unapproved gradients or decorative AI motifs exist. 

Confirm that no client evidence or business results have been invented. 

Confirm that Tailwind v4 uses theme variables. 

Confirm that mobile design was completed before desktop refinement. 

Confirm metadata, page title, description, canonical behavior, and social metadata where required. 

IMPORTANT: Match implementation complexity to the information architecture. Do not add complexity to visual spectacles. Every component, border, animation, color, and spacing decision must improve hierarchy, usability, navigation, comprehension, or conversion. 

Remember: the interface should feel like a serious business operating system. Prioritize clarity, density, speed, consistency, and execution over decoration. 
