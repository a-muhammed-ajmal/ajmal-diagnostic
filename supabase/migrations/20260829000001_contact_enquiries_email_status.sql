-- ─────────────────────────────────────────────────────────────────────────────
-- contact_enquiries — record the outcome of the notification send
--
-- WHY
--   /api/contact stored the inquiry, attempted the Resend notification, logged
--   any error, and then returned { success: true } regardless. The Resend SDK
--   reports API failures by RETURNING an error rather than throwing, so a
--   dropped notification produced no exception, no visitor-facing signal, and
--   no trace on the row. Because nothing in the application reads
--   contact_enquiries, a failed send meant the message was effectively lost.
--
--   These two columns give the send an outcome that outlives the request log.
--
-- SECURITY MODEL
--   Unchanged. contact_enquiries already has RLS enabled with no policies and
--   all privileges revoked from anon/authenticated (20260814000002). Adding
--   columns to an existing table inherits that posture — no new grant or
--   revoke is required. Writes remain service-role only.
--
-- SCOPE
--   Additive and idempotent. No backfill: existing rows keep email_sent = false,
--   which is truthful — their send outcome was never recorded either way.
--   Mirrors the established email_sent flag on fdi_sessions and diagnostic_leads.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.contact_enquiries
  add column if not exists email_sent  boolean not null default false,
  add column if not exists email_error text;

comment on column public.contact_enquiries.email_sent is
  'True once Resend accepted the internal notification for this inquiry.';

comment on column public.contact_enquiries.email_error is
  'Resend rejection message when the notification failed. Null when it sent, or when no send has been attempted yet.';
