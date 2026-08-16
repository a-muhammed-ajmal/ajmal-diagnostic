# Muhammed Ajmal Consulting - Founder Dependency Index v1.0

Status: Active working specification  
Date: August 15, 2026  
Owner: Muhammed Ajmal Consulting  
Purpose: Define the public meaning, scope, customer journey, and governance of the Founder Dependency Index (FDI).

## 1. Position in the practice

The Founder Dependency Index is one of the four public frameworks of Muhammed Ajmal Consulting. It is the measurement framework that converts founder dependency into a clear, limited operating score.

It sits in the following architecture:

```text
Founder Trap
  The diagnostic lens: the pattern in which growth and day-to-day work rely too heavily on the founder.

Founder Dependency Index
  The measurement: a score showing where founder dependency appears.

Business Health Check
  The free customer experience that collects the self-report and returns the Founder Dependency Index result.

Business Clarity Audit
  The paid evidence-led next step when the founder wants to verify the result and identify the binding constraint.
```

Business Health Check is an offer name. It is not a fifth framework and it does not replace the Founder Dependency Index. The score, method, and formal result remain the Founder Dependency Index.

## 2. Customer-facing definition

### Offer title

**Business Health Check**

### Supporting line

**A free check of how much day-to-day operations still rely on you.**

### Formal result

**Your Founder Dependency Index**

### Core explanation

The Business Health Check asks founders about three observable operating areas: how decisions move, whether work stays consistent, and whether the business is visible without chasing people for updates. The result is a Founder Dependency Index score and a short explanation of the reported behaviours worth examining.

### Mandatory scope line

Whenever the offer name appears without its explanation, include this sentence or an equivalent:

> This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit.

This scope line matters because "Business Health Check" is commonly used in the market for broad business, tax, and compliance assessments. This offer is deliberately narrower and must not imply otherwise.

## 3. Who it is for

The intended audience is a founder-led UAE SME where growth still depends heavily on the founder's personal involvement.

The commercial target profile is:

| Criterion | Target profile |
|---|---|
| Geography | United Arab Emirates |
| Ownership | Founder-led |
| Revenue | AED 1,000,000 to AED 10,000,000 annually |
| Team | 5 to 50 employees |
| Operating age | 3 years or more |
| Decision authority | The founder can approve operating changes without a board |
| Core condition | Important work, decisions, or visibility still depend heavily on the founder |

The check remains a useful reflection tool for a founder outside that profile. Commercial qualification is recorded separately and never changes the FDI score or removes the founder's result.

## 4. The customer journey

1. **Start the Business Health Check** - the founder sees the scope, time commitment, and privacy link.
2. **Tell us about the business** - country, founder-led status, revenue band, team size, operating age, decision authority, willingness to share operational information, and sector.
3. **Answer 12 behavioural questions** - four questions for each FDI component.
4. **Share contact details** - required to complete the session and access the report flow.
5. **Receive the Founder Dependency Index result** - a 0 to 100 index, band, component scores, reported behaviour findings, and the result limitation.
6. **Choose the right next step** - the public next step is a Business Clarity Audit, which tests the reported patterns against operating evidence.

The current implementation stores the founder-facing report in browser session storage for the results experience. The system also creates a server-side FDI session. Production deployment status and current live feature-flag status are not asserted in this document.

## 5. What FDI-1.0 measures

The Founder Dependency Index measures where founder dependency appears across three components:

| Component | Plain-English question |
|---|---|
| Decision Speed | Do decisions and work continue when the founder is unavailable? |
| Execution Consistency | Does recurring work reach a consistent standard without founder supervision? |
| Operational Visibility | Can the founder see what is happening without chasing people for updates? |

The question set contains 12 item-specific behavioural questions: four per component. Each answer is scored from 0 to 3 in increasing founder-dependency order:

| Score | Meaning |
|---|---|
| 0 | Low dependency behaviour reported |
| 1 | Some dependency behaviour reported |
| 2 | Material dependency behaviour reported |
| 3 | Strong dependency behaviour reported |

Questions must preserve their existing low-to-high behavioural order. They are not agree/disagree questions and must not be randomised.

## 6. Scoring and reporting rules

### Component scores

Each component has four items and a raw maximum of 12. The component score is:

```text
Component Score = (component raw score / 12) x 100
```

### Composite index

FDI-1.0 weights the three components equally. The Founder Dependency Index is the equally weighted mean of the three component scores, calculated from raw units before display rounding.

### Display format

Present the result only in this form:

```text
Founder Dependency Index: 67 / 100 — High Founder Dependency
```

Never present it as "67% dependent." The number is an index, not an empirically measured percentage of dependence.

### Bands

| Index range | Band |
|---|---|
| 0 to 24 | Low Founder Dependency |
| 25 to 49 | Moderate Founder Dependency |
| 50 to 74 | High Founder Dependency |
| 75 to 100 | Very High Founder Dependency |

The bands are provisional FDI-1.0 operating labels. They are not industry benchmarks, population percentiles, validated clinical-style cut-offs, or claims about commercial performance.

### Severe component alert

When a component is 75 or above before display rounding, surface a severe component alert. If two or more components tie, show every tied component. Do not use a tie-breaker to manufacture one "main problem."

### Findings

The report provides two or three deterministic statements based on the founder's reported answers. They describe reported behaviour only. They never claim to establish a root cause, diagnose the business, determine a binding constraint, prescribe an intervention, or change commercial qualification.

## 7. Result boundary and Audit handoff

The free result must always make the following distinction clear:

| The Business Health Check and FDI can do | They cannot do |
|---|---|
| Show where founder dependency appears in the founder's self-report | Prove why dependency exists |
| Show the three component scores | Identify the root cause |
| Surface the highest reported concentration | Establish the single binding constraint |
| Provide reported-behaviour findings | Determine the correct intervention |

Required result limitation:

> This result is based on founder self-report. It identifies where dependency appears. It does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.

The correct next step is the **Business Clarity Audit**. The public copy may call it an Audit, but it must explain that the Audit tests the self-reported patterns against records, workflows, dashboards, decision samples, SOPs, and related operating evidence.

## 8. Approved public copy

### Homepage or services-card version

**Business Health Check**  
Get a free Founder Dependency Index and see where day-to-day operations may still rely too heavily on you.

CTA: **Start the Business Health Check**

### Diagnostic-page version

**Business Health Check**  
Answer 12 questions to receive your Founder Dependency Index across decision speed, execution consistency, and operational visibility.

Support line: **Free. Private. A focused founder-dependency self-report.**

### Results-page version

**Your Founder Dependency Index**  
This result describes reported operating patterns. A Business Clarity Audit is the evidence-led next step when you need to verify what is actually constraining growth.

CTA: **Discuss a Business Clarity Audit**

## 9. Claims and language rules

Use:

- "shows where dependency appears"
- "self-reported operating patterns"
- "worth examining"
- "tests the pattern against evidence"
- "helps founders see what to investigate next"

Do not use:

- "full business health assessment"
- "business diagnosis" without the self-report qualifier
- "proves the root cause"
- "finds the binding constraint" for the free check
- "guarantees growth, profit, savings, or business performance"
- "benchmark" or "industry standard" for the current FDI bands

## 10. Version governance

FDI-1.0 is frozen. Do not edit its question set, weights, bands, thresholds, item count, response scale, or rounding rules.

Any change to the instrument requires a new version file and a new set of version identifiers. Historical FDI-1.0 sessions must stay attached to the version that scored them.

The Business Health Check label may be refined as website copy. It must never be used to silently alter what FDI-1.0 measures.

## 11. Implementation dependencies

The official Business Health Check copy is for the FDI route only.

| Condition | Required handling |
|---|---|
| `NEXT_PUBLIC_FDI_ENABLED=true` | Present the Business Health Check and the FDI flow. |
| `NEXT_PUBLIC_FDI_ENABLED` is not `true` | The existing legacy diagnostic remains active. Do not label it as the Business Health Check or imply that it produces an FDI score. |
| FDI result page | Use "Founder Dependency Index" as the result title and retain the full limitation. |
| Services page | Explain that the Business Clarity Audit, not the free check, verifies evidence and identifies the binding constraint. |

## 12. Source files to keep aligned

- `src/lib/fdi/config/fdi-1.0.ts`
- `src/lib/fdi/questions/fdi-questions-1.0.ts`
- `src/lib/fdi/score.ts`
- `src/lib/fdi/report.ts`
- `src/lib/fdi/observations.ts`
- `src/components/fdi/FdiDiagnosticFlow.tsx`
- `src/components/fdi/FdiResults.tsx`
- `src/components/home/SystemVisuals.tsx`
- `src/app/services/page.tsx`

## Change log

| Version | Date | Change |
|---|---|---|
| v1.0 | August 15, 2026 | Established Business Health Check as the customer-facing free entry experience and retained Founder Dependency Index as the formal measurement and result. |
