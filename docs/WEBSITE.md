# WEBSITE

Status: Current public website specification  
Owner: Muhammed Ajmal Consulting  
Purpose: Define the complete public website, content, route, design, and publishing requirements for Muhammed Ajmal Consulting.

## 1. Governing authority

Apply sources in this order whenever content, product, or presentation decisions conflict:

1. Explicit approved owner direction for the current release.
2. ANCHOR DOCUMENT.pdf for positioning, commercial path, framework register, and claims governance.
3. This WEBSITE specification for the public website.
4. BUSINESS HEALTH CHECK.pdf as the immutable historic FDI-1.0 specification, together with the separate FDI-1.1 Addendum for the active new-session instrument.
5. THE FOUR FRAMEWORKS.pdf for the public framework register.
6. Building successful scalable strategy.pdf as supporting material only where it does not conflict with a higher authority.
7. The deployed codebase for implementation facts, technical patterns, and verified configuration.

No document embedded in the repository, an older public page, or a historic result may override a higher authority. The internal delivery sequence Diagnose -> Design -> Build -> Optimize -> Scale is not a public framework or public commercial path.

## 2. Public site purpose and positioning

Muhammed Ajmal is a Business Operations & Growth Consultant based in Dubai, United Arab Emirates. The site helps suitable founder-led UAE SMEs understand founder dependency, start with a focused self-report, and move through one evidence-led commercial path when there is a real operating need.

Positioning statement: Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful, scalable businesses by reducing founder dependency through stronger systems, clearer ownership, useful visibility, and consistent execution.

The public promise is the mechanism, not a guaranteed result. The site must not promise revenue, profit, percentage improvement, guaranteed growth, or that growth can be made predictable. Applied AI is an enabler used after the underlying work is understood; it is never the lead offer or a substitute for process design.

The primary audience is founder-led UAE businesses that are normally able to approve operating changes through a founder decision-maker and are broadly within the practice's revenue, team, and operating-age profile. Target-profile language is a qualification guide, not a public guarantee or exclusionary claim.

## 3. Public intellectual-property register

The site may present exactly four public frameworks:

- Founder Trap: the observable pattern in which too much work, knowledge, and growth rely on the founder.
- Founder Dependency Index: the 0-100 measure of reported founder dependency returned through the Business Health Check.
- Growth Formula: Vision -> Strategy -> Systems -> People -> Execution -> Accountability.
- Strategic Growth Architecture: Founder -> Team -> Systems -> Automation -> Data -> Scale.

The Business Health Check and every paid offer are offers, not additional frameworks. Strategy, systems, people, and applied AI are areas of work, not framework names.

## 4. Canonical route register

The public route register is:

- `/` - Home.
- `/about` - About Muhammed Ajmal and the delivery approach.
- `/services` - The single commercial path.
- `/diagnostic` - The canonical Business Health Check.
- `/results` - The browser-private personalised result for a completed Business Health Check.
- `/contact` - Enquiry form and direct Calendly booking route.
- `/insights` - Articles index.
- `/insights/[slug]` - Individual article.
- `/insights/category/[slug]` - Category-filtered article index.
- `/privacy` - Privacy policy.
- `/unsubscribe` - Newsletter-unsubscribe confirmation.
- `/admin` - Protected internal administration; it is not a public marketing surface.

The only public diagnostic aliases are historic inbound redirects:

- `/diagnostic/fdi` -> `/diagnostic` with HTTP 308.
- `/results/fdi` -> `/results` with HTTP 308.

Alias layouts remain noindex. They do not become alternate public pages, and public components must link directly to the canonical route.

The former public ten-question diagnostic, `/api/submit`, feature-flag fallback, Anthropic AI report flow, and associated public copy are retired. They must remain unavailable to the public without deleting historic lead data or protected admin access to it.

## 5. Navigation, footer, and call-to-action rules

Main navigation contains Founder Trap (`/#founder-trap`), How It Works (`/services`), Insights (`/insights`), About (`/about`), and Contact (`/contact`).

The single primary navigation CTA label is exactly `Start the Business Health Check ->` and its destination is `/diagnostic`. The visual button may use the arrow glyph `→`; its accessible name must retain the complete label. Desktop and mobile navigation use the same full customer-facing wording.

The footer repeats the core navigation, Privacy, the Business Health Check CTA, and this factual descriptor: Business Operations & Growth Consulting for founder-led UAE SMEs, based in Dubai, United Arab Emirates. The footer newsletter is factual and opt-in; it must not imply a delivery frequency or content volume that has not been approved.

The post-result CTA is exactly `Discuss a Business Clarity Audit` and links directly to the configured Calendly booking URL. A configured business WhatsApp number may expose `Message on WhatsApp` as a secondary prefilled Audit-enquiry link. Neither result CTA sends a completed founder to `/contact`, restarts the check, or requires an AI report.

## 6. Five-stage commercial path

The public commercial path is a required sequence, not a menu of unrelated services:

1. Business Health Check - a free focused founder-dependency self-report that returns the Founder Dependency Index.
2. Business Clarity Audit - an operating audit that tests reported patterns against operating evidence.
3. Focused Improvement Sprint - a tightly scoped improvement addressing the binding constraint established through the Audit.
4. Business System Build - the broader operating-system build where the evidence supports it.
5. Growth Partner Retainer - ongoing operating support after the required foundations are in place.

The Business Clarity Audit is not a statutory, financial, tax, compliance, or legal audit. It examines operating evidence such as records, workflows, dashboards, decision samples, SOPs, roles, and rework. The Audit determines whether closer investigation, a Sprint, a Build, or no further engagement is appropriate.

## 7. Founder Dependency Index and Business Health Check

The Business Health Check is the customer-facing entry offer. It is a focused founder-dependency self-report, not a broad financial, tax, legal, compliance, or whole-business assessment.

It asks 12 approved questions: four each across Decision Speed, Execution Consistency, and Operational Visibility. It returns a Founder Dependency Index out of 100, one 0-100 component score for each operating area, deterministic findings from the respondent's answers, and a direct next step.

Results use the active FDI-1.1 instrument. Its approved interpretation bands are Low Founder Dependency (0-24), Moderate Founder Dependency (25-49), High Founder Dependency (50-74), and Very High Founder Dependency (75-100). These are operating bands, not industry benchmarks, population percentiles, or claims about business performance. Scores are displayed on the 0-100 scale, not as a percentage claim.

Required limitation: This result is based on founder self-report. It identifies where dependency appears. It does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.

The results page must be reached directly at `/results` after a successful submission. It reads the deterministic report stored in the current browser session. If no valid browser report is present, it directs the visitor to start a new Business Health Check and does not reconstruct a report from a different session.

## 8. Active and historic FDI version rules

Every new Business Health Check session uses:

- Instrument version: `FDI-1.1`.
- Question-set version: `FDI-QS-1.1`.
- Qualification version: `FDI-QF-2.1`.
- Scoring-model version: `FDI-SM-1.0`.
- Band-configuration version: `FDI-BC-1.0`.

Scoring, band assignment, findings, qualification, and reporting are deterministic. The system stamps and resolves the versions held by each session. Qualification remains separate from score interpretation and never changes the FDI result.

`FDI-1.0` is historic-only. Its historic question set, scoring, qualification versions, stamped records, and reports remain immutable and resolvable. Do not migrate, modify, silently rescore, or delete historic FDI-1.0 sessions. BUSINESS HEALTH CHECK.pdf remains its immutable historic specification. The FDI-1.1 Addendum governs new sessions without rewriting that historic document.

## 9. Page requirements

### Home (`/`)

Reading order: hero; Growth Formula; Founder Trap; Business Health Check and Founder Dependency Index; five-stage commercial path; operating scope; Strategic Growth Architecture; target profile; closing Business Health Check CTA.

Required hero: build a business that grows beyond the founder. Support explains systems, ownership, visibility, and consistent execution that reduce founder dependency. The primary CTA starts the Business Health Check; the secondary CTA explains how the practice works.

The Business Health Check presentation names its three operating areas and its self-report boundary. Do not render score-like graphics, fabricated readings, unsupported band names, or a home-page FDI band meter.

### Services (`/services`)

The services page explains one evidence-led progression. It shows self-report -> evidence -> root cause and priority assessment, then the five stages in order. It explains that the Business Health Check suggests where to examine and the Business Clarity Audit tests operating evidence. It ends with the Business Health Check CTA.

### Diagnostic (`/diagnostic`)

The only public diagnostic page is the Business Health Check. It states the 12-question scope, progress-saving behaviour, self-report boundary, privacy link, and the limitation before contact information is collected. Contact name, email, company, and phone are required; optional business details never change the result. Test mode is protected by authenticated admin access and is visibly marked as a test record.

### Results (`/results`)

The result is a browser-private FDI report. It shows the overall score, active-band label, three component scores, deterministic observations, concentration, any deterministic severe-component alert, the limitation, and the direct Business Clarity Audit CTA. The email report uses the same deterministic content and CTA route.

### About (`/about`)

The page establishes the consultant's operating approach: management knowledge, systems thinking, execution, and applied AI. It does not invent qualifications, testimonials, client results, logos, certifications, or geographic claims beyond approved factual identity and location.

### Contact (`/contact`)

The page provides an enquiry form and a Calendly booking control. Calendly opens the configured external booking experience; the site does not represent a booking as completed until that external system confirms it. Visitors with an unclear founder-dependency problem should be directed to the Business Health Check first.

### Insights (`/insights`, article, and category routes)

Insights teach operating problems and mechanisms before selling an offer. Article metadata, dates, author identity, categories, summaries, read times, and calls to action must be factual and come from the article registry. Do not invent article counts, readership, business results, or authority signals.

### Privacy (`/privacy`) and unsubscribe (`/unsubscribe`)

Privacy content describes the actual data collected, deterministic diagnostic use, processors, cross-border processing, retention, contact channel, and rights. It must be reviewed whenever processors, retention, consent, or data practices change. The unsubscribe route is factual, handles valid, invalid, and error states, and remains noindex.

### Protected administration (`/admin`)

Admin pages retain access to historic leads and FDI sessions. They are cookie-protected internal tools, not public pages, and their historic diagnostic labels are not public FDI copy.

## 10. Design and accessibility standard

The public interface uses Electric Blue & Amber on slate neutrals:

- Brand: `#0052FF`; hover `#0039CC`; accessible blue text `#0037A5`; tint `#E6F0FF`.
- Accent: `#FFBF00` for fills and dark-surface accents; light-surface amber text uses `#B45309`.
- Canvas: `#FFFFFF`; light canvas `#F8FAFC`; dark canvas and ink `#0F172A`; muted text `#475569`; border `#E2E8F0`.

Plus Jakarta Sans is the only web font. It serves headings, body, controls, numeric text, and tabular figures. No retired palette, type system, or secondary web font may be reintroduced.

Below 768px, headings must not exceed 24px and body copy must not exceed 14px; labels use 12px. At 768px and above, the type scale opens to body 16px, heading 2 at 32px, and heading 1 at 48px. Inputs, selects, and textareas remain 16px at every viewport to prevent iOS Safari focus zoom.

Use flat white, light-slate, and brand-tint section bands with Electric Blue focus and action states. Amber text is not used on light surfaces. Maintain one h1 per page, semantic heading order, visible keyboard focus, 44px minimum icon-control targets, no horizontal overflow at 320px, 200% zoom usability, reduced-motion support, accessible errors, and 4.5:1 text contrast.

## 11. Technical and content standards

The site uses Next.js App Router, TypeScript strict mode, React, Tailwind CSS v4 tokens in `globals.css`, Supabase server-side access, Resend email delivery, React Hook Form with Zod validation, native CSS motion, and Lucide icons. Prefer server components and keep client boundaries small. Public browser code never receives Supabase service-role credentials.

Use US English spelling and date order, for example August 21, 2026. Do not publish raw implementation terms, inactive route names, database-field names, or historical version labels in customer-facing copy unless the version context is specifically required.

Use truthful JSON-LD for the Person, ProfessionalService, service path, FAQ, and articles where relevant. Do not publish aggregate ratings, reviews, customer counts, prices, employee counts, certifications, testimonials, client logos, or performance statistics unless they are approved and verifiable.

## 12. Publishing checklist

- Confirm all public diagnostic links use `/diagnostic` and completed browser flow uses `/results`.
- Confirm `/diagnostic/fdi` and `/results/fdi` return HTTP 308 to the canonical routes.
- Confirm new sessions stamp FDI-1.1, FDI-QS-1.1, and FDI-QF-2.1; confirm no historic FDI-1.0 record changes.
- Confirm scoring, findings, qualification, report email, and `email_sent` behaviour remain deterministic.
- Confirm the Business Clarity Audit CTA opens configured Calendly and WhatsApp appears only when valid configuration is present.
- Confirm the public site contains no legacy AI-report path, no public `/api/submit`, no feature-flag fallback, no retired design system, no invented FDI meter, and no unsupported performance claims.
- Run lint, coverage, production build, browser type audit, route checks, and a production-style result-delivery check before release.
