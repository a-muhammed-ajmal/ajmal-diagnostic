# Muhammed Ajmal Consulting - Website Structure and Content v1.0

Status: Active working specification  
Date: August 15, 2026  
Owner: Muhammed Ajmal Consulting  
Purpose: Define the information architecture, message hierarchy, and page-level content responsibilities for the consulting website.

## 1. Website role

The website has one job: help a suitable founder understand the founder-dependency problem, start with a focused free check, and move through one evidence-led commercial progression when a real operating need exists.

It is not a general marketing site for disconnected consulting services. It should not lead with AI tools, generic motivation, or broad growth promises.

### Positioning statement

Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful and scalable businesses by reducing founder dependency through stronger systems, clearer ownership, useful visibility, and consistent execution.

### Core audience

Founder-led UAE businesses that are normally:

- AED 1,000,000 to AED 10,000,000 in annual revenue
- 5 to 50 employees
- operating for three years or more
- able to approve operating changes through one founder decision-maker
- experiencing a business that slows down when the founder is unavailable

### One clear promise

Reduce founder dependency by improving decision speed, execution consistency, and operational visibility.

Use the mechanism, never an unsupported magnitude. Do not promise revenue, profit, percentage gains, or "predictable growth" without documented client evidence.

## 2. Brand architecture

The site explains four public frameworks and one commercial path. Do not create a fifth framework through page labels, service names, or visual diagrams.

| Type | Name | Website role |
|---|---|---|
| Diagnostic lens | Founder Trap | Names the observable pattern where too much work and growth rely on the founder. |
| Measurement framework | Founder Dependency Index | The formal 0 to 100 measurement of reported dependency. |
| Sequence framework | Growth Formula | Shows the sequence Vision → Strategy → Systems → People → Execution → Accountability. |
| Architecture framework | Strategic Growth Architecture | Shows how responsibility progresses Founder → Team → Systems → Automation → Data → Scale. |
| Free entry offer | Business Health Check | The customer-friendly experience that returns the Founder Dependency Index result. |

Business Health Check is an offer, not a framework. Its mandatory scope is a focused founder-dependency self-report; it is not a broad financial, tax, legal, or whole-business assessment.

## 3. Information architecture

### Main navigation

| Navigation label | Destination | Purpose |
|---|---|---|
| Founder Trap | `/#founder-trap` | Help a founder recognise the dependency pattern. |
| How It Works | `/services` | Explain the single five-stage commercial path. |
| Insights | `/insights` | Build trust through practical education. |
| About | `/about` | Explain Ajmal's role, approach, and delivery principles. |
| Contact | `/contact` | Provide a direct route for an appropriate enquiry or conversation. |
| Primary CTA | `/diagnostic` | Start the Business Health Check when FDI is enabled. |

The primary CTA should have one consistent customer-facing label: **Start the Business Health Check**. A shorter button may use **Start the Check** where space is constrained, but page copy must define the full name nearby.

### Footer

The footer repeats the primary CTA and the main-navigation routes. It should state the business category and location: Business Operations & Growth Consulting for founder-led UAE SMEs, based in Dubai, United Arab Emirates.

## 4. Page map and content responsibilities

| Route | Page purpose | Required message | Primary CTA |
|---|---|---|---|
| `/` | Explain the problem, practice, and starting point. | A business should grow beyond constant founder intervention. | Start the Business Health Check |
| `/#founder-trap` | Name visible founder-dependency symptoms. | The Founder Trap is a pattern, not a judgement of the founder. | See the Business Health Check |
| `/#dependency-index` | Explain what FDI measures. | The Business Health Check returns the Founder Dependency Index across three operating areas. | Start the Business Health Check |
| `/services` | Explain the commercial progression. | Evidence determines the next stage; clients do not choose from an unconnected menu. | Start the Business Health Check |
| `/diagnostic` | Run the free entry experience. | A focused founder-dependency self-report, not a full audit. | Start the check / continue |
| `/results/fdi` | Present the FDI result and limitation. | The result shows reported patterns; an Audit tests them against evidence. | Discuss a Business Clarity Audit |
| `/about` | Establish credibility and delivery approach. | Management knowledge + systems thinking + execution + applied AI. | Start the Business Health Check |
| `/contact` | Give the founder a direct route after the appropriate first step. | Complete the check first when the need is unclear; contact directly for a specific question. | Start the Business Health Check / book a conversation |
| `/insights` | Publish useful, evidence-led operating education. | Teach problems and mechanisms before selling an offer. | Read an insight / start the check |
| `/insights/[slug]` | Provide one focused educational article. | Each article should lead naturally to an appropriate next step without forced selling. | Start the Business Health Check or contact |
| `/privacy` | Explain data and privacy commitments. | Clear, lawful handling of diagnostic and contact data. | None |
| `/unsubscribe` | Confirm newsletter opt-out. | Keep the page factual and complete. | None |
| `/admin` | Internal lead and FDI-session workspace. | Not a public marketing surface. | None |

`/results` is the legacy diagnostic result route. `/results/fdi` is the Founder Dependency Index result route. Do not describe them as the same diagnostic or allow legacy-result copy to make FDI claims.

## 5. Homepage sequence

The homepage should follow this reading order:

1. **Hero** - the business needs to grow beyond the founder.
2. **Growth Formula** - show the sequence from vision to accountability.
3. **Founder Trap** - make the dependency pattern concrete through observable symptoms.
4. **Business Health Check / Founder Dependency Index** - explain the free entry offer, the three measured areas, and its limitation.
5. **How We Work** - show the five-stage progression and why evidence determines the next step.
6. **Operating Scope** - clarify Strategy, Systems, People, and Applied AI as areas of work, not additional frameworks.
7. **Strategic Growth Architecture** - show the progressive operating architecture.
8. **Target profile** - help unsuitable visitors self-select out without making exclusions hostile.
9. **Closing CTA** - invite the appropriate founder to start the Business Health Check.

### Hero copy direction

**Headline:** Build a business that grows beyond the founder.  
**Support:** Build systems, ownership, visibility, and consistent execution that reduce founder dependency.  
**Primary CTA:** Start the Business Health Check  
**Secondary CTA:** See How It Works

## 6. Service-page sequence

The services page is a commercial-path page, not a conventional services menu.

1. Explain the destination: a practical path from founder dependency to a stronger operating system.
2. Explain the evidence ladder: self-report → evidence → root-cause and priority assessment.
3. Present the five stages in the required order.
4. Clarify that the Business Health Check suggests where to examine; the Business Clarity Audit tests evidence and identifies the binding constraint.
5. End with the Business Health Check CTA.

The public stage names, copy, and CTAs are controlled by `Muhammed_Ajmal_Consulting_Commercial_Path_and_Offer_Names_v1.0.md`.

## 7. Diagnostic and result experience

### Customer-facing labels

| Surface | Required label |
|---|---|
| Website CTA | Start the Business Health Check |
| Diagnostic page heading | Business Health Check |
| Supporting description | Receive your Founder Dependency Index across three operating areas. |
| Results page heading | Your Founder Dependency Index |
| Follow-up CTA | Discuss a Business Clarity Audit |

### Scope language

Use the phrase "focused founder-dependency self-report" in the diagnostic introduction, services page, and result page. This creates a consistent expectation before contact details are requested.

### Feature-flag rule

The current `/diagnostic` route selects the FDI flow only when `NEXT_PUBLIC_FDI_ENABLED=true`. The preceding labels are therefore valid only for that flow.

If the feature flag is not enabled, the legacy ten-question diagnostic remains active. Do not rename it to Business Health Check or imply it produces an FDI score without a separate, approved migration of its questions, scoring, and results content.

Live environment status is `UNKNOWN` from this source review.

## 8. Content rules

### Use

- founder-led UAE SMEs
- systems, ownership, visibility, and consistent execution
- self-reported patterns
- operating evidence
- practical, simple, sustainable
- AI as an enabler after the process is understood
- one constraint at a time

### Avoid

- generic AI-consulting language
- unsupported revenue, margin, profit, or growth claims
- "predictable growth" until documented evidence supports it
- calling the free check a full business audit
- diagnosing root cause from a self-report
- presenting the FDI as a percentage of a business's dependence
- implying that a score makes the business qualified, unqualified, good, or bad

## 9. Content implementation inventory

After approving this document, update the following public copy surfaces together so the customer journey remains consistent:

| Location | Required change |
|---|---|
| `src/components/home/SystemVisuals.tsx` | Rename the Free Diagnostic stage to Business Health Check and update the stage explanation. |
| `src/app/services/page.tsx` | Update the entry and closing CTA language; retain the self-report → evidence → root-cause distinction. |
| `src/components/fdi/FdiDiagnosticFlow.tsx` | Use Business Health Check as the page/flow title and clarify that the result is the FDI. |
| `src/components/fdi/FdiResults.tsx` | Keep Founder Dependency Index as the result heading; rename Audit CTA to Business Clarity Audit. |
| `src/app/page.tsx` | Change primary homepage CTA from Free Diagnostic to Business Health Check. |
| `src/app/contact/page.tsx` | Change first-step language and CTA to Business Health Check. |
| `src/components/layout/Navigation.tsx` | Change the prominent CTA to Business Health Check. |
| `src/components/layout/Footer.tsx` | Change the primary footer CTA to Business Health Check. |
| Metadata and structured data | Review titles and descriptions for the final offer names before publishing. |

This document specifies the content work. It does not assert that the above website updates have already been applied.

## 10. Editorial and visual standards

- Use US English.
- Use direct, calm, practical language suitable for a busy business owner.
- Keep the visual identity consistent: Inter type, charcoal-navy surfaces, orange for primary action, and the graph-paper motif.
- Make the page hierarchy understandable before decorative detail. The CTA should be visible on mobile without relying on hover or animation.
- Keep public messaging separate from internal scoring, qualification, and implementation detail.

## 11. Quality gate before publishing copy

- Every FDI claim matches the actual question set, scoring, report, and limitation.
- Every Business Health Check mention includes enough context to avoid a broad-assessment implication.
- Every service-stage name maps to exactly one commercial stage.
- No new framework is introduced.
- Every primary CTA takes the visitor to the correct enabled diagnostic route.
- Desktop and mobile layouts preserve readability, tap-target size, safe-area spacing, and current motion behaviour.
- Lint, tests, and production build pass after code changes.

## Change log

| Version | Date | Change |
|---|---|---|
| v1.0 | August 15, 2026 | Established website structure and content responsibilities, including the Business Health Check → Founder Dependency Index journey. |
