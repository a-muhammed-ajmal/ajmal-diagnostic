# Website

**The public website specification for Muhammed Ajmal Consulting.**

Document ID: WEB · Version 1.0

---

## 1. Governing authority

Apply sources in this order when content, product, or presentation decisions conflict:

1. Explicit approved owner direction for the current release.
2. ANCHOR — positioning, commercial path, framework register, claims governance.
3. WEB — this document, for the public website.
4. PRODUCT — the Business Health Check instrument and the Business Clarity Audit.
5. DESIGN — colors, typography, components, accessibility.
6. The deployed codebase — implementation facts, technical patterns, verified configuration.

No document inside the repository, no published page, and no historic result may override a higher authority.

The internal delivery sequence defined in ANCHOR is not a public framework and never appears in public copy.

---

## 2. Purpose and positioning

Muhammed Ajmal is a Business Operations & Growth Consultant based in Dubai, United Arab Emirates.

The site helps founder-led UAE SMEs understand founder dependency, start with a focused self-report, and move through one evidence-led commercial path when there is a real operating need.

Positioning statement: *Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful, scalable businesses by reducing founder dependency through stronger systems, clearer ownership, useful visibility, and consistent execution.*

The public promise is the mechanism, not a guaranteed result. The site must not promise revenue, profit, percentage improvement, guaranteed growth, or that growth can be made predictable.

Applied AI is an enabler used after the underlying work is understood. It is never the lead offer and never a substitute for process design.

The primary audience is founder-led UAE businesses that can approve operating changes through a founder decision-maker and sit broadly within the practice's revenue, team, and operating-age profile. Target-profile language is a qualification guide, never a public guarantee or an exclusionary claim.

---

## 3. Public intellectual property

The site may present exactly four frameworks, defined in ANCHOR §10:

- **Founder Trap** — the observable pattern in which too much work, knowledge, and growth rely on the founder.
- **Founder Dependency Index** — the 0–100 measure of reported founder dependency returned through the Business Health Check.
- **Growth Formula** — Vision → Strategy → Systems → People → Execution → Accountability.
- **Strategic Growth Architecture** — Founder → Team → Systems → Automation → Data → Scale.

The Business Health Check and every paid offer are offers, not frameworks. Strategy, systems, people, and applied AI are areas of work, not framework names.

---

## 4. Route register

| Route | Purpose |
| :---- | :---- |
| `/` | Home |
| `/about` | Muhammed Ajmal and the delivery approach |
| `/services` | The single commercial path |
| `/diagnostic` | The Business Health Check |
| `/results` | The browser-private result for a completed Business Health Check |
| `/contact` | Enquiry form and direct Calendly booking |
| `/insights` | Articles index |
| `/insights/[slug]` | Individual article |
| `/insights/category/[slug]` | Category-filtered index |
| `/privacy` | Privacy policy |
| `/unsubscribe` | Newsletter unsubscribe confirmation |
| `/admin` | Protected internal administration — not a public marketing surface |

Two aliases exist and return HTTP 308:

| Alias | Canonical |
| :---- | :---- |
| `/diagnostic/fdi` | `/diagnostic` |
| `/results/fdi` | `/results` |

Alias layouts are noindex. They are not alternate public pages. Public components link to the canonical route directly.

One fallback exists and is not a route:

| Fallback | Serves |
| :---- | :---- |
| `not-found.tsx` | Any unmatched path — HTTP 404 |
| `error.tsx` | An unhandled render error in a public route segment — HTTP 500 |

The fallback is noindex, absent from the sitemap, and absent from navigation. It is not a landing surface: it carries no offer, no lead capture, and no claim. It returns the visitor to a registered route.

The public site exposes no `/api/submit` route, no feature-flag fallback, and no AI-generated report path. Protected administrative access to stored lead data remains available.

---

## 5. Navigation, footer, and calls to action

Main navigation contains exactly: Founder Trap (`/#founder-trap`), How It Works (`/services`), Insights (`/insights`), About (`/about`), Contact (`/contact`).

The single primary navigation CTA label is exactly **Start the Business Health Check →** and its destination is `/diagnostic`. The visual button may render the arrow glyph; its accessible name retains the complete label. Desktop and mobile use identical wording.

The footer repeats the core navigation, Privacy, the Business Health Check CTA, and this descriptor: *Business Operations & Growth Consulting for founder-led UAE SMEs, based in Dubai, United Arab Emirates.*

The footer newsletter is factual and opt-in. It must not imply a delivery frequency or content volume that has not been approved.

The post-result CTA is exactly **Discuss a Business Clarity Audit** and links to the configured Calendly booking URL. Where a business WhatsApp number is configured, **Message on WhatsApp** may appear as a secondary prefilled enquiry link.

Neither result CTA sends a completed founder to `/contact`, restarts the check, or requires an AI report.

---

## 6. The commercial path on the site

The public path is a required sequence, not a menu. Stage definitions live in ANCHOR §8.

1. **Business Health Check** — a free founder-dependency self-report returning the Founder Dependency Index.
2. **Business Clarity Audit** — an operating audit testing reported patterns against operating evidence.
3. **Focused Improvement Sprint** — a tightly scoped improvement addressing the binding constraint.
4. **Business System Build** — the broader operating-system build where evidence supports it.
5. **Growth Partner Retainer** — ongoing operating support once foundations are in place.

The Business Clarity Audit is not a statutory, financial, tax, compliance, or legal audit. It examines operating evidence: records, workflows, dashboards, decision samples, SOPs, roles, and rework.

---

## 7. The Business Health Check on the site

The Business Health Check is the customer-facing entry offer. It is a focused founder-dependency self-report, not a broad financial, tax, legal, compliance, or whole-business assessment.

It asks 12 questions, four each across Decision Speed, Execution Consistency, and Operational Visibility. It returns a Founder Dependency Index out of 100, one 0–100 component score per operating area, deterministic findings drawn from the respondent's answers, and a direct next step.

The instrument, question wording, scoring, bands, findings, qualification, and report email are defined in PRODUCT. This document does not restate them.

Two rules bind the public presentation:

- Scores display on the 0–100 scale. Never as a percentage, and never with a `%` symbol near the index.
- A high index is the adverse result. Band labels must never read as praise.

Required limitation, reproduced word for word wherever a result appears:

> This result is based on founder self-report. It identifies where dependency appears. It does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.

The results page is reached directly at `/results` after a successful submission. It reads the deterministic report stored in the current browser session. Where no valid browser report is present, it directs the visitor to start a new Business Health Check. It never reconstructs a report from a different session.

---

## 8. Page requirements

### Home — `/`

Reading order: hero · Growth Formula · Founder Trap · Business Health Check and Founder Dependency Index · five-stage commercial path · operating scope · Strategic Growth Architecture · target profile · closing Business Health Check CTA.

Required hero: build a business that grows beyond the founder. Support copy explains the systems, ownership, visibility, and consistent execution that reduce founder dependency. Primary CTA starts the Business Health Check; secondary CTA explains how the practice works.

The Business Health Check presentation names its three operating areas and its self-report boundary.

Do not render score-like graphics, fabricated readings, unsupported band names, or a home-page index meter.

### Services — `/services`

Explains one evidence-led progression. Shows self-report → evidence → root cause and priority assessment, then the five stages in order.

Explains that the Business Health Check suggests where to examine and the Business Clarity Audit tests operating evidence. Ends with the Business Health Check CTA.

### Diagnostic — `/diagnostic`

The only public diagnostic page. States the 12-question scope, progress-saving behavior, the self-report boundary, the privacy link, and the limitation before contact information is collected.

Name, email, company, and phone are required. Optional business details never change the result.

Test mode is protected by authenticated admin access and is visibly marked as a test record.

### Results — `/results`

A browser-private report. Shows the overall score, band label, three component scores, deterministic observations, concentration, any severe-component alert, the limitation, and the Business Clarity Audit CTA.

The email report uses the same deterministic content and the same CTA route.

### About — `/about`

Establishes the consultant's operating approach: management knowledge, systems thinking, execution, and applied AI.

Invents no qualifications, testimonials, client results, logos, certifications, or geographic claims beyond approved factual identity and location.

### Insights — `/insights`, article, and category routes

Insights teach operating problems and mechanisms before selling an offer.

Article metadata, dates, author identity, categories, summaries, read times, and calls to action are factual and come from the article registry. Do not invent article counts, readership, business results, or authority signals.

**Approved type exception.** Article body copy on `/insights/[slug]` renders at 16px on mobile rather than the 14px site ceiling. This is the only sustained-reading surface on the site and the exception is deliberate. The token change and its audit exception are defined in DESIGN. No other route may claim this exception.

### Privacy — `/privacy` and unsubscribe — `/unsubscribe`

Privacy content describes the actual data collected, deterministic diagnostic use, processors, cross-border processing, retention, contact channel, and rights. Review it whenever processors, retention, consent, or data practices change.

The unsubscribe route is factual, handles valid, invalid, and error states, and is noindex.

### Not found and error fallback

Factual and brief. States that the page does not exist, offers Home and the Business Health Check as the two ways forward, and may list registered routes as likely destinations. The error boundary states that something failed and offers a retry.

Neither surface invents a reason, apologises at length, captures an email, or presents an offer. Both use the standard page shell so a visitor who lands there is still on the site.

### Administration — `/admin`

Cookie-protected internal tools with access to stored leads and diagnostic sessions. Not a public page. Internal diagnostic labels used here are not public copy.

---

## 9. Design

DESIGN is the single specification for colors, typography, spacing, components, and accessibility. `globals.css` is the implementation truth; DESIGN documents it.

This document does not repeat hex values, font sizes, or token names. Where a page requirement above depends on a visual rule, it names the rule and points here.

Two site-level requirements sit above any component choice:

- Plus Jakarta Sans and Lexend are the entire web-font budget — Plus Jakarta Sans for headings and display, Lexend for body, UI, and small text. No third face.
- Every page maintains one `h1`, semantic heading order, visible keyboard focus, 44px minimum icon-control targets, no horizontal overflow at 320px, usability at 200% zoom, reduced-motion support, accessible error states, and 4.5:1 text contrast.

---

## 10. Technical and content standards

The site uses Next.js App Router, TypeScript strict mode, React, Tailwind CSS v4 tokens in `globals.css`, Supabase server-side access, Resend email delivery, React Hook Form with Zod validation, native CSS motion, and Lucide icons.

Prefer server components. Keep client boundaries small. Public browser code never receives Supabase service-role credentials.

Use US English spelling and date order — for example, August 21, 2026.

Do not publish raw implementation terms, inactive route names, database field names, or version labels in customer-facing copy unless the version context is specifically required.

Use truthful JSON-LD for Person, ProfessionalService, the service path, FAQ, and articles where relevant. Do not publish aggregate ratings, reviews, customer counts, prices, employee counts, certifications, testimonials, client logos, or performance statistics unless approved and verifiable.

---

## 11. Publishing checklist

Run before every release.

- [ ] All public diagnostic links use `/diagnostic`; the completed flow uses `/results`.
- [ ] `/diagnostic/fdi` and `/results/fdi` return HTTP 308 to canonical routes.
- [ ] New sessions stamp the active instrument version set defined in PRODUCT.
- [ ] No historic session record has changed.
- [ ] Scoring, findings, qualification, report email, and `email_sent` behavior remain deterministic.
- [ ] A completed session resolves the question, scoring, band, and qualification versions stamped on that session. An FDI-1.0 result is never rescored as FDI-1.1.
- [ ] `/contact` presents a working Calendly control and a working enquiry form.
- [ ] The Business Clarity Audit CTA opens the configured Calendly. WhatsApp appears only when valid configuration is present.
- [ ] No AI-generated report path, no public `/api/submit`, no feature-flag fallback.
- [ ] No invented index meter, band name, or performance claim.
- [ ] `npm run audit:type` passes — responsive type scale, mobile overflow, and global font-family checks, including the `/insights/[slug]` exception.
- [ ] Lint, coverage, production build, browser type audit, route checks, and a production-style result-delivery check all pass.

---

END OF WEBSITE
