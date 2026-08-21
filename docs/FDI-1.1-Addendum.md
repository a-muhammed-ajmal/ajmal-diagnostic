# FDI-1.1 Addendum

Status: Active new-session instrument addendum  
Owner: Muhammed Ajmal Consulting  
Purpose: Establish the current Founder Dependency Index instrument for all new Business Health Check sessions while preserving FDI-1.0 records and their historic specification unchanged.

## 1. Scope and authority

This addendum governs new Business Health Check sessions only. It is read with the approved ANCHOR DOCUMENT and the current WEBSITE specification. BUSINESS HEALTH CHECK.pdf remains the immutable historic FDI-1.0 specification; it is not edited, replaced, migrated, or rescored by this addendum.

If a record already carries an FDI-1.0 version stamp, resolve its score, question set, qualification configuration, band configuration, and reporting with the historic version recorded on that session. Never fall back to the active version for a historic session.

## 2. Active new-session version set

Every new session created from the canonical `/diagnostic` route records:

- Instrument: `FDI-1.1`.
- Question set: `FDI-QS-1.1`.
- Qualification configuration: `FDI-QF-2.1`.
- Scoring model: `FDI-SM-1.0`.
- Band configuration: `FDI-BC-1.0`.

`FDI-1.1` is the sole active diagnostic version for new sessions. `FDI-1.0` remains historical-only and resolvable. An unknown or mismatched version is rejected; it must never be silently interpreted as FDI-1.1.

## 3. Canonical public journey

The public Business Health Check lives at `/diagnostic`. `/diagnostic/fdi` is a historic HTTP 308 alias to `/diagnostic`. A successful completion stores the deterministic browser report and navigates directly to `/results`. `/results/fdi` is a historic HTTP 308 alias to `/results`.

The public ten-question diagnostic, public `/api/submit`, feature-flag fallback, and AI-generated public report path are retired. Historic lead data and protected administration remain accessible; retirement does not delete or alter them.

## 4. Instrument and scoring

The active approved question set has 12 questions: four each for Decision Speed, Execution Consistency, and Operational Visibility. Each answer has its fixed approved numeric value. Component scores are calculated on a 0-100 scale; the unrounded composite is used for the band and alert decision; presentation uses the configured deterministic half-up rounding convention.

The active interpretation bands are Low Founder Dependency (0-24), Moderate Founder Dependency (25-49), High Founder Dependency (50-74), and Very High Founder Dependency (75-100).

These bands are provisional operating labels. They are not industry benchmarks, population percentiles, validated cutoffs, or claims about business performance. The public result displays scores as values out of 100, not as percentage claims.

## 5. Findings, limitation, and Audit boundary

Findings are selected deterministically from the submitted answers and configured component outcomes. No AI model, prompt, generative summary, or commercial-fit language may change the score, findings, band, or report.

Required limitation: This result is based on founder self-report. It identifies where dependency appears. It does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.

The result proposes a Business Clarity Audit as the next step. The Audit tests reported patterns against operating evidence such as records, workflows, dashboards, decision samples, SOPs, roles, and rework. It is an operating audit, not a statutory, financial, tax, legal, or compliance audit. The direct public CTA is `Discuss a Business Clarity Audit` and opens the configured Calendly booking route; configured WhatsApp is secondary only.

## 6. Contact and qualification

Name, email, company name, and phone are required to complete the public session. Sector, employee count, revenue band, and operating age are optional. Optional details do not affect scoring, findings, result availability, or report delivery.

FDI-QF-2.1 evaluates commercial fit separately from the FDI score. Its valid sector taxonomy is Real Estate & Business Services, Trading & Distribution, Construction & Contracting, Professional Services, Retail & E-commerce, Hospitality & F&B, Manufacturing, and Other with a required description.

When an optional field is blank, record its individual reason exactly: `revenue_not_provided`, `team_size_not_provided`, `operating_age_not_provided`, and `sector_not_provided`.

When every optional field is blank, qualification is `not_assessed` with all four reasons. A result is still completed and delivered. Qualification is not score interpretation and must never suppress, mutate, or rewrite the FDI result.

## 7. Deterministic report and email acceptance

The completed session persists the version stamps, answers, deterministic score, component values, band, findings, qualification outcome, and public report. The report is rendered from this deterministic result for the browser and the report email.

`email_sent` is set to `true` only after Resend accepts the deterministic FDI report and the completed session update succeeds. If Resend returns a rejection or sending throws, the completed result remains stored, the public result remains available, and `email_sent` remains false. Delivery acceptance does not trigger rescoring, recomputation, AI generation, or qualification changes.

## 8. Historic preservation and release checks

No database migration is required for this addendum. Do not modify FDI-1.0 configuration files, question files, hashes, session rows, qualification records, scoring outputs, or historic email/report records.

Before release, verify all of the following:

- New sessions receive FDI-1.1, FDI-QS-1.1, and FDI-QF-2.1.
- Existing FDI-1.0 sessions still resolve through their recorded historic versions.
- Exact approved FDI-1.1 question wording and version integrity coverage pass.
- Scoring, bands, findings, qualification, reports, and delivery acceptance are deterministic.
- Canonical routes and 308 aliases behave as specified.
- A production-style submission confirms persisted active stamps, deterministic result, report receipt, and `email_sent`.
