# Product Specification

**The Business Health Check and the Business Clarity Audit.**

Document ID: PRODUCT · Version 1.0

Governed by ANCHOR. Where this document and ANCHOR disagree, ANCHOR governs.

---

# Part A — Business Health Check

## A1. What it is

| Element | Wording |
| :---- | :---- |
| Offer name | Business Health Check |
| Formal result | Your Founder Dependency Index |
| Support line | A free check of how much day-to-day operations still rely on you |

Mandatory scope line, wherever the offer name appears without its explanation:

> This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit.

---

## A2. Active version set

Every new session created from `/diagnostic` records five stamps:

| Stamp | Value |
| :---- | :---- |
| Instrument | FDI-1.1 |
| Question set | FDI-QS-1.1 |
| Qualification configuration | FDI-QF-2.1 |
| Scoring model | FDI-SM-1.0 |
| Band configuration | FDI-BC-1.0 |

FDI-1.1 is the sole active version for new sessions. An unknown or mismatched version is rejected. It is never silently interpreted as FDI-1.1.

Stamps are stored on `public.fdi_sessions`. The version column is `diagnostic_version`; `instrument` holds the constant `FDI`, not the version.

---

## A3. The journey

| Step | What happens |
| :---- | :---- |
| 1 | Intro screen: scope, three reassurance cards, privacy link |
| 2 | 12 questions, four per component. Nothing is asked before this |
| 3 | Final screen: required contact fields, optional business details |
| 4 | Result page: index, band, components, findings, limitation, Audit handoff |
| 5 | Report email sent to the founder |

### Intro screen cards

| Card | Line |
| :---- | :---- |
| 12 questions | Four questions across each operating component |
| Progress saved | You can leave before completion; an unfinished attempt receives no score or email |
| Self-report only | The result identifies reported patterns. It does not diagnose root causes |

---

## A4. The 12 questions

Structure: four questions each for Decision Speed, Execution Consistency, and Operational Visibility. Item identifiers are DS1–DS4, EC1–EC4, OV1–OV4.

Every item uses item-specific behavioral answers. Never agree/disagree, yes/no, or good/bad. The four options form an ordered low-to-high dependency scale, scored 0 to 3, and are never randomized.

Source of truth: `src/lib/fdi/questions/fdi-questions-1.1.ts` — `FDI_1_1_QUESTIONS`, frozen.

**Character integrity.** The only non-ASCII characters in the entire set are five em dashes (U+2014) in OV1-A, OV1-B, OV1-C, OV1-D, and OV4-A. Everything else is plain ASCII. The apostrophe in EC1-C `people's` is a straight apostrophe (U+0027), not a curly one (U+2019). Any editor with autocorrect enabled will silently break both. Verify after any paste.

### Decision Speed

**DS1. When an important decision needs to be made, and you are not available, what usually happens?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| DS1-A | 0 | The responsible person makes the decision |
| DS1-B | 1 | Most decisions continue, but some wait for me |
| DS1-C | 2 | Many important decisions wait until I am available |
| DS1-D | 3 | Important decisions usually stop until I decide |

**DS2. How much can your team decide without asking for your approval?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| DS2-A | 0 | The team handles regular decisions without me |
| DS2-B | 1 | Most regular decisions are handled without me |
| DS2-C | 2 | The team handles smaller decisions, but many still need my approval |
| DS2-D | 3 | I approve most important decisions |

**DS3. If work needs your decision, how long does it usually wait?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| DS3-A | 0 | It usually does not wait because someone else can decide |
| DS3-B | 1 | A few hours |
| DS3-C | 2 | Until later that day or the next working day |
| DS3-D | 3 | More than one working day or until I am available |

**DS4. How often does your team ask you to make decisions they could make themselves?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| DS4-A | 0 | Rarely |
| DS4-B | 1 | Sometimes |
| DS4-C | 2 | Often |
| DS4-D | 3 | Almost every day |

### Execution Consistency

**EC1. For important work that happens regularly, how well is the process written down for the team?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| EC1-A | 0 | Important processes are written down, easy to find, and used |
| EC1-B | 1 | Most important processes are written down, with some gaps |
| EC1-C | 2 | Some are written down, but much still depends on people's knowledge |
| EC1-D | 3 | Most important work depends on what a few key people or I know |

**EC2. When different team members do the same work, how similar are the results?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| EC2-A | 0 | The results consistently meet the same standard |
| EC2-B | 1 | Results are usually consistent, with some differences |
| EC2-C | 2 | Quality changes noticeably depending on who does the work |
| EC2-D | 3 | Good results depend heavily on certain people or my involvement |

**EC3. How often does completed work need to be corrected or done again?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| EC3-A | 0 | Rarely |
| EC3-B | 1 | Sometimes |
| EC3-C | 2 | Often |
| EC3-D | 3 | Rework and correction are a normal part of our work |

**EC4. When you are not personally supervising the work, what usually happens?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| EC4-A | 0 | Quality and speed stay about the same |
| EC4-B | 1 | Some issues appear, but work generally continues normally |
| EC4-C | 2 | Quality or speed becomes noticeably worse |
| EC4-D | 3 | Serious delays or quality problems occur |

### Operational Visibility

**OV1. Can you see what is happening in the business without asking your team for updates?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| OV1-A | 0 | Yes — the information I need is already available |
| OV1-B | 1 | Mostly — I sometimes need to ask |
| OV1-C | 2 | Only partly — I regularly need to ask for updates |
| OV1-D | 3 | No — asking people is the main way I know what is happening |

**OV2. How up to date is the information you use to manage the business?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| OV2-A | 0 | It is up to date when I need it |
| OV2-B | 1 | It is usually up to date, with some delays |
| OV2-C | 2 | It is often out of date |
| OV2-D | 3 | I regularly do not have reliable, current information |

**OV3. How do you usually find out about an important problem in the business?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| OV3-A | 0 | Our reports or systems show the problem early |
| OV3-B | 1 | The team reports it through the normal process |
| OV3-C | 2 | Someone tells me after it has already affected the work |
| OV3-D | 3 | I find out myself, from a customer, or when it becomes urgent |

**OV4. How often do you have to chase your team for updates, numbers, or explanations?**

| ID | Score | Answer |
| :---- | :---- | :---- |
| OV4-A | 0 | Rarely — the information is usually available |
| OV4-B | 1 | Sometimes |
| OV4-C | 2 | Often |
| OV4-D | 3 | Chasing updates is a regular part of my day |

---

## A5. Scoring

| Score | Meaning |
| :---- | :---- |
| 0 | Low dependency behavior reported |
| 1 | Some dependency behavior reported |
| 2 | Material dependency behavior reported |
| 3 | Strong dependency behavior reported |

| Step | Formula |
| :---- | :---- |
| Raw component | Q1 + Q2 + Q3 + Q4 (0–12) |
| Component score | (raw × 100) ÷ 12 |
| Founder Dependency Index | Weighted mean of the three components, equal weights, computed from raw units |

Rules:

- Bands and alerts read the unrounded value. Rounding is half-up and display-only.
- An incomplete answer set produces no index at all. Missing never means zero dependency.
- Qualification data can never change a score.

---

## A6. Bands

| Range | Band |
| :---- | :---- |
| 0–24 | Low Founder Dependency |
| 25–49 | Moderate Founder Dependency |
| 50–74 | High Founder Dependency |
| 75–100 | Very High Founder Dependency |

Bands are half-open lower bounds, so every value maps to exactly one band.

They are provisional operating labels. Not benchmarks, not percentiles, not validated cut-offs, not performance claims.

**A high index is the adverse result.** Band names must never read as praise.

Presentation: `Founder Dependency Index: 67 / 100 — High Founder Dependency`

Never "67% dependent." No `%` symbol anywhere near the index. Never a standalone Low, Moderate, or High.

---

## A7. Concentration and severe alert

| Rule | Behavior |
| :---- | :---- |
| Concentration | The highest-scoring component. If two or three tie, all are shown. No tie-break of any kind |
| Severe component alert | Any component at 75 or above, unrounded. All alerted components listed, ordered by score descending, ties grouped |
| Wording | "Dependency appears most concentrated in {component(s)}." · "Severe component alert: {components}." |

Concentration is never the binding constraint, the root cause, or the primary business constraint. Those require the Audit.

---

## A8. Findings

Two or three statements are drawn from the founder's own answers, under the heading **What the answers indicate**.

Each item carries a high-dependency and a low-dependency statement. An item scoring 2 or 3 returns its high statement.

Findings describe reported behavior only. Never a root cause, binding constraint, intervention, or qualification change.

**Selection:** three or more high-dependency items → three findings, spread across components first. Exactly two → both. Exactly one → that one plus the strongest positive from another component. None → one positive per component.

### High-dependency findings

| Item | Finding |
| :---- | :---- |
| DS1 | Important operating decisions slow down when you are unavailable. |
| DS2 | Meaningful operating authority is still concentrated with you. |
| DS3 | Work regularly waits for decisions that depend on you. |
| DS4 | You are frequently pulled into decisions that could reasonably sit elsewhere in the business. |
| EC1 | Important recurring work still depends materially on knowledge held by individuals rather than usable systems. |
| EC2 | Delivery quality varies materially depending on who performs the work or whether you are involved. |
| EC3 | Rework, correction, or re-explanation is a recurring part of execution. |
| EC4 | Day-to-day delivery is likely to weaken when your direct supervision is removed. |
| OV1 | You still depend heavily on asking people to understand the current status of the business. |
| OV2 | The information available to you is often too delayed or unreliable for clear operational visibility. |
| OV3 | Important problems are often becoming visible only after they have already affected operations. |
| OV4 | Chasing people for updates is still a recurring part of your management workload. |

### Low-dependency findings

| Item | Finding |
| :---- | :---- |
| DS1 | Most operating decisions can continue when you are unavailable. |
| DS2 | Your team has meaningful authority to handle recurring operating decisions. |
| DS3 | Founder-related decision waiting time appears relatively limited. |
| DS4 | Unnecessary escalation to you appears relatively limited. |
| EC1 | Critical recurring work is largely supported by documented, usable processes. |
| EC2 | Different capable team members generally produce a consistent standard of work. |
| EC3 | Rework caused by inconsistent execution appears relatively limited. |
| EC4 | Day-to-day execution appears reasonably able to maintain its standard without your direct supervision. |
| OV1 | Important operating status is generally visible without repeatedly asking individuals for updates. |
| OV2 | Important operating information is generally current enough to support management decisions. |
| OV3 | Important operating problems are generally surfaced through the business before they become urgent. |
| OV4 | You spend relatively little time chasing people for routine operating information. |

> **One outstanding check.** The FDI-1.1 question wording is confirmed
> identical to FDI-1.0, so these 24 statements carry over unchanged in
> principle. The findings configuration itself has not been byte-checked.
> Confirm these against the active findings config once. Where they differ,
> the configuration is correct and this table is corrected to match.

---

## A9. Final screen and qualification

Eyebrow: *Your result is ready* · Headline: *Where should we send it?*

| Field | Status | Label |
| :---- | :---- | :---- |
| Name | Required | Your name |
| Company | Required | Company name |
| Email | Required | Email address |
| Mobile | Required | Mobile number |
| Sector | Optional | Sector |
| Employees | Optional | Number of employees |
| Revenue | Optional | Annual revenue |
| Operating age | Optional | Years operating |

Optional block note: *Skip these if you prefer. They help us tailor any follow-up and never change your result.*

Footer line: *By continuing, you agree to our Privacy Policy.*

### Option values

| Field | Choices |
| :---- | :---- |
| Sector | Real Estate & Business Services · Trading & Distribution · Construction & Contracting · Professional Services · Retail & E-commerce · Hospitality & F&B · Manufacturing · Other (requires description) |
| Employees | Under 5 · 5–50 · Over 50 |
| Revenue | Under AED 1,000,000 · AED 1,000,000–10,000,000 · Over AED 10,000,000 |
| Years operating | Under 3 years · 3 years or more |

This sector list is the public taxonomy under FDI-QF-2.1. It is not the practice's target-sector table in ANCHOR §4, and neither list is derived from the other.

### Qualification — consultant-only, never shown

Runs separately from scoring. Commercial fit never changes, suppresses, or reinterprets the index.

| Outcome | Condition |
| :---- | :---- |
| Not assessed | All four optional fields blank |
| Outside target profile | Any answered field falls outside AED 1,000,000–10,000,000, 5–50 employees, or 3+ years |
| Qualified primary | Inside profile and sector is Real Estate & Business Services, Trading & Distribution, or Construction & Contracting |
| Qualified secondary | Inside profile, any other sector |

Every blank field records an explicit reason: `revenue_not_provided`, `team_size_not_provided`, `operating_age_not_provided`, `sector_not_provided`. A thin classification is never mistaken for a confirmed one.

---

## A10. Result page

| Element | Content |
| :---- | :---- |
| Header | Eyebrow: Founder Dependency Index. Score: {score} / 100. Band label in full |
| Support | This result describes self-reported operating patterns. It is not a diagnosis of root cause. |
| Components | Three cards, each {score} / 100, then the concentration line |
| Alert | "Severe component alert: {components}." Shown only at 75+ |
| Findings | Heading: What the answers indicate |
| Limitation | Reproduced word for word, below |
| Next step | Heading: Next step: Business Clarity Audit. CTA: Discuss a Business Clarity Audit → Calendly, WhatsApp secondary |
| Fallback | Your result is not available in this browser. Complete the Business Health Check again to view a new result. |

### Limitation — never edited

> This result is based on founder self-report. It identifies where dependency appears. It does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.

---

## A11. Report email

Sent through Resend the moment the founder submits the final screen.

| Element | Rule |
| :---- | :---- |
| Trigger | On successful submission. Incomplete attempts get no score and no email |
| From | Muhammed Ajmal Consulting |
| To | The founder's submitted email |
| Subject | Your Founder Dependency Index: {score} / 100 — {Band label} |
| Opening | {First name}, your Founder Dependency Index · Prepared for {Company name} |
| Score block | {score} / 100 with the full band label |
| Body | Component scores · concentration line · severe alert if any · What the answers indicate · limitation |
| CTA | Discuss a Business Clarity Audit → Calendly, WhatsApp secondary |
| Content rule | Deterministic only. No AI-written text, no qualification language, no score alteration |
| Delivery record | `email_sent` is set true only after Resend accepts and the session update succeeds. A failed send never blocks the on-screen result |

Delivery acceptance never triggers rescoring, recomputation, AI generation, or qualification change.

---

## A12. Version governance

- Scoring, band assignment, findings, qualification, and reporting are deterministic.
- Any change to questions, weights, bands, thresholds, item count, response scale, or rounding requires a new registered version. Never an edit to an existing one.
- Every session resolves under the version stamped on it. Sessions are never silently rescored.
- A hash test fails CI on any unauthorized edit to a registered instrument.
- Displayed result strings use the em dash, per ANCHOR §15.
- Question and option wording is character-exact. Em dashes are U+2014 and apostrophes are U+0027. A rendering difference is a wording difference and fails the release check.

### FDI-1.0 — historic

FDI-1.0 is historic-only and resolvable. Completed sessions carrying an FDI-1.0 stamp resolve their score, question set, qualification configuration, band configuration, and reporting through the version recorded on that session. The active version is never used as a fallback for a historic session.

Do not migrate, modify, rescore, or delete FDI-1.0 configuration files, question files, hashes, session rows, qualification records, scoring outputs, or historic report records.

There is no FDI-1.0 documentation. Its record is the code: `src/lib/fdi/config/fdi-1.0.ts`, `src/lib/fdi/questions/fdi-questions-1.0.ts`, and `src/lib/fdi/__fixtures__/fdi-1.0-golden.json`. Those files are the specification for the six sessions stamped FDI-1.0 and are covered by `golden.test.ts`. Do not delete or modify them.

---

## A13. AI restrictions

AI may never: calculate the index, alter a score, infer an unanswered question, change a weight, change qualification, determine the binding constraint, or declare a root cause.

No model, prompt, generative summary, or commercial-fit language may change the score, findings, band, or report.

---

# Part B — Business Clarity Audit

## B1. Purpose

The paid diagnostic stage following the Business Health Check. Its purpose is to move from founder self-report to evidence-based diagnosis.

The Business Health Check identifies where founder dependency appears. The Business Clarity Audit is the stage permitted to determine the operational root cause, identify the single binding constraint, and establish what should be addressed next.

It is not a statutory, financial, tax, compliance, or legal audit.

---

## B2. Relationship to the Founder Dependency Index

| Variable | The Check captures | The Audit verifies |
| :---- | :---- | :---- |
| Decision Speed | Decision Speed component score | Cycle-time sample |
| Execution Consistency | Execution Consistency component score | SOP adherence and rework rate |
| Operational Visibility | Operational Visibility component score | Dashboard coverage |
| Founder Dependency | Founder Dependency Index | Full evidence review |

The Check result is evidence input, not the Audit conclusion. Component concentration is not automatically the binding constraint.

---

## B3. Scope

The Audit may examine these operating areas when the evidence makes them relevant. They are operating areas, not frameworks.

| Area | What may be examined |
| :---- | :---- |
| Strategy | Direction, priorities, positioning, growth choices |
| Systems | Processes, SOPs, management rhythm, KPIs, structure |
| People | Roles, ownership, decision rights, accountability, capability |
| Applied AI | Automation and AI where they improve capacity, speed, or visibility, after the underlying process is understood |

---

## B4. Required inputs

**From the Business Health Check:** the completed session, its Founder Dependency Index, component scores, concentration statement, severe alerts, deterministic findings, and its instrument version. Consultant-only qualification data is reviewed separately from the score.

**From the client:** evidence sufficient to verify each area below.

---

## B5. Evidence model

| Area | Required evidence | Audit question |
| :---- | :---- | :---- |
| Decision Speed | Actual decision and work cycle-time samples | Where does work wait, for how long, and because of whose authority? |
| Execution Consistency | SOP adherence evidence and rework-rate evidence | Does recurring work follow a usable standard, and where does execution break? |
| Operational Visibility | Dashboard coverage and current operating information | Can required status be seen without chasing individuals? |
| Founder Dependency | Full evidence review across the operating system | Where does the business still depend materially on founder intervention? |

Evidence tests the self-report rather than confirming it. Contradictions between reported behavior and operating evidence are recorded, never averaged away.

---

## B6. Workflow

1. Open the Audit case from the completed Business Health Check handoff.
2. Review the Check result and consultant-only qualification information.
3. Define the evidence request using the areas in B5.
4. Collect and record the evidence received.
5. Review evidence across all four areas.
6. Separate observed symptoms from underlying causes.
7. Identify the single binding constraint supported by the available evidence.
8. Define the structure that would remove or materially reduce that constraint.
9. Select the next commercial stage based on the diagnosed constraint and required depth.
10. Record the conclusion and handoff.

The Check score and the qualification classification remain separate throughout.

---

## B7. Symptom, cause, constraint

| Level | Meaning | Rule |
| :---- | :---- | :---- |
| Symptom | An observable operating effect or reported dependency pattern | Never treated automatically as the cause |
| Cause | An operating condition that explains why a symptom occurs | Must be supported by evidence, not assumption |
| Binding constraint | The single currently limiting operating constraint to address first | Selected only after evidence review. One at a time |

The conclusion must not restate the highest component score. The highest component indicates concentration only.

---

## B8. Framework use

| Step | Framework | Use |
| :---- | :---- | :---- |
| Recognize the pattern | Founder Trap | Describe observable dependency without judging the founder |
| Measure it | Founder Dependency Index | Use the Check result as self-report input |
| Order the fix | Growth Formula | Sequence the change through Vision → Strategy → Systems → People → Execution → Accountability |
| Move responsibility | Strategic Growth Architecture | Determine how responsibility moves through Founder → Team → Systems → Automation → Data → Scale |

The Audit is a commercial offer, not a fifth framework.

---

## B9. Intervention selection

The immediate recommendation follows the diagnosed constraint, never the client's preferred tool or a generic package.

- **Focused Improvement Sprint** — one bounded operating change can materially address the identified binding constraint.
- **Business System Build** — connected changes across processes, roles, ownership, management systems, reporting, or data are required.
- **No immediate downstream engagement** — evidence does not support further work, the business is not ready, or another prerequisite must be resolved first.

The Growth Partner Retainer remains a later stage after foundations exist. Never prescribe AI or automation before the underlying process is understood. Never prescribe a website build. Never position motivation or mindset as the intervention.

---

## B10. Output

| Element | Required content |
| :---- | :---- |
| Check reference | Session and version reference, self-report result |
| Evidence reviewed | Evidence actually received and reviewed |
| Verified observations | Evidence-supported observations across the relevant areas |
| Root cause | The evidence-supported explanation of why the dependency occurs |
| Binding constraint | One clearly stated constraint to address first |
| Recommended structure | What operating structure removes or reduces it |
| Recommended next stage | Focused Improvement Sprint, Business System Build, or No immediate downstream engagement |
| Limitations | Missing or weak evidence that limits confidence |

---

## B11. Commercial and delivery standard

The initial Business Clarity Audit standard is:

- Fixed fee: **AED 4,500**
- Normal duration: **10 business days from the confirmed Audit Start Date**
- First payment: **AED 2,250 on acceptance**
- Second payment: **AED 2,250 on Business Day 5**
- Initial evidence request: within one business day after acceptance and first payment
- Starting evidence normally due: within three business days
- Additional evidence normally due: within two business days
- Kickoff: up to 45 minutes
- Evidence clarification: up to 45 minutes when required
- Closeout: up to 60 minutes

The Audit Start Date is confirmed after proposal acceptance, first payment, completed Business Health Check availability, primary contact confirmation, initial required evidence receipt, and kickoff availability. Client-caused evidence, access, clarification, decision-maker, or meeting delays pause or move the delivery timetable.

Evidence sufficiency uses only **Sufficient for conclusion**, **Sufficient with stated limitation**, and **Insufficient — more evidence required**. No confidence percentages are used.

Immediate next-stage decisions use only Focused Improvement Sprint, Business System Build, or No immediate downstream engagement.

The standard proposal, Operating Conversation guide, Audit report, delivery controls, onboarding templates, and fictional workflow test are complete reusable operating assets. Improve them only from real sales or delivery evidence.

---

## B12. Claims

Claim the mechanism, never an unsupported magnitude. No revenue, profit, or growth guarantees. No percentage or multiple claims without documented client evidence. "Predictable growth" is prohibited. No client logos, testimonials, case studies, or results sections until real evidence exists. Anonymize client references.

Full rules in ANCHOR §12.

---

## B13. Current implementation status

As of August 29, 2026, the Business Health Check is implemented and production-verified as the deterministic founder-dependency self-report defined in Part A. The active version rules, scoring, findings, qualification separation, and report behavior remain governed by the registered version set.

The Business Clarity Audit is operational as the first paid diagnostic stage. Its commercial standard, evidence-sufficiency rule, symptom/cause/binding-constraint rule, immediate next-stage rule, standard proposal, Operating Conversation guide, standard report, delivery controls, onboarding templates, and fictional end-to-end workflow test are complete. The next priority is acquisition and real-client delivery, not further generic Audit design.

END OF PRODUCT SPECIFICATION
