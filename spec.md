# Product Specification

## Purpose

Muhammed Ajmal Consulting is a B2B consulting website for founder-led UAE SMEs. Its primary commercial journey is a Business Health Check that identifies founder dependency patterns and leads qualified visitors to a Business Clarity Audit conversation.

## Core Journey

- `/diagnostic` serves the Founder Dependency Index (FDI) Business Health Check when `NEXT_PUBLIC_FDI_ENABLED=true`; it asks 12 questions across decision speed, execution consistency, and operational visibility.
- Completing the FDI captures contact details, stores the result, delivers a report email, and shows the personalised result at `/results/fdi`.
- The FDI result’s “Discuss a Business Clarity Audit” CTA routes to `/contact`.
- The FDI and legacy report emails, and the legacy result page, use the same approved CTA label and retain their existing Calendly destinations.
- `/contact` provides both an enquiry form and a Calendly booking control. Booking opens Calendly; it does not create a booking within the website.

## Product Requirements and Invariants

- The free Business Health Check is a self-report. It identifies patterns and does not establish root cause, a single binding constraint, or an intervention.
- FDI scoring and report generation are deterministic; the email report contains no AI or qualification language.
- Test Mode requires authenticated admin access and marks the FDI session as a test record.
- Public form handling, database access, and email delivery occur server-side. Browser code must not use Supabase service-role credentials.
- Website text—including headings, body copy, eyebrows, buttons, controls, and numeric text—uses Plus Jakarta Sans. Existing type sizes, weights, spacing, and layout remain unchanged.

## Acceptance Criteria

- A completed Business Health Check produces a result and report email with the approved Business Clarity Audit CTA.
- The contact page presents a working Calendly control and enquiry form.
- The website maintains its responsive type-scale, mobile overflow, and global font-family checks through `npm run audit:type`.
