# Product Specification

## Purpose

Muhammed Ajmal Consulting is a B2B consulting website for founder-led UAE SMEs. Its primary commercial journey is a Business Health Check that identifies founder dependency patterns and leads qualified visitors to a Business Clarity Audit conversation.

## Core Journey

- `/diagnostic` serves the Founder Dependency Index (FDI) Business Health Check when `NEXT_PUBLIC_FDI_ENABLED=true`; new sessions use the PDF-aligned `FDI-1.1` instrument (12 questions across decision speed, execution consistency, and operational visibility), while historic `FDI-1.0` sessions retain their stamped instrument and qualification versions.
- Completing the FDI captures contact details, stores the result, delivers a report email, and shows the personalised result at `/results/fdi`.
- The FDI and legacy results use the approved “Discuss a Business Clarity Audit” CTA as a direct Calendly booking link. A completed check must not return a qualified visitor to `/contact` or restart the check.
- The FDI and legacy report emails use the same approved CTA label and direct Calendly destination. When `NEXT_PUBLIC_WHATSAPP_NUMBER` is configured with the business E.164 number, both emails offer a secondary WhatsApp message link with an Audit enquiry prefilled.
- `/contact` provides both an enquiry form and a Calendly booking control. Booking opens Calendly; it does not create a booking within the website.

## Product Requirements and Invariants

- The free Business Health Check is a self-report. It identifies patterns and does not establish root cause, a single binding constraint, or an intervention.
- FDI scoring and report generation are deterministic; the email report contains no AI or qualification language.
- The FDI final screen accepts only the approved `FDI-QF-2.1` sectors: Real Estate & Business Services, Trading & Distribution, Construction & Contracting, Professional Services, Retail & E-commerce, Hospitality & F&B, Manufacturing, and Other (with a required description).
- Test Mode requires authenticated admin access and marks the FDI session as a test record.
- Public form handling, database access, and email delivery occur server-side. Browser code must not use Supabase service-role credentials.
- Calendly is the primary post-check conversion route. WhatsApp is an optional secondary question-first route and must be omitted when no business WhatsApp number is configured.
- Website text—including headings, body copy, eyebrows, buttons, controls, and numeric text—uses Plus Jakarta Sans. Existing type sizes, weights, spacing, and layout remain unchanged.

## Acceptance Criteria

- A completed Business Health Check produces a result and report email with the approved Business Clarity Audit CTA, linked directly to Calendly rather than `/contact`.
- Completing an FDI session must resolve the question, scoring, band, and qualification versions stamped on that session; an `FDI-1.0` result must never be silently rescored as `FDI-1.1`.
- When the business WhatsApp number is configured, the result and report email expose a working, prefilled WhatsApp Audit-enquiry link.
- The contact page presents a working Calendly control and enquiry form.
- The website maintains its responsive type-scale, mobile overflow, and global font-family checks through `npm run audit:type`.
