-- Defence in depth: remove anon/authenticated table grants across all public tables.
--
-- WHY THIS EXISTS
-- Every table in this schema already has RLS enabled with no permissive policies,
-- which denies the anon and authenticated roles all row access. But Supabase's
-- default privileges grant those roles table-level access when a table is created,
-- so the tables remain EXPOSED through the Data API and RLS is the only thing
-- standing between the public and the data. Verified behaviourally before this
-- migration: a publishable-key SELECT against fdi_sessions returned HTTP 200 with
-- zero rows, not a permission error — proof the grant was present and RLS alone
-- was doing the work.
--
-- That is a single point of failure. Disabling RLS on any one of these tables,
-- for a moment of debugging or by accident, would immediately make lead PII,
-- contact enquiries, subscriber emails and admin session tokens publicly readable.
-- Revoking the grants means RLS and privileges must BOTH fail before anything leaks.
--
-- WHY IT IS SAFE
-- No code path reads these tables with the publishable key. Confirmed exhaustively:
--   · every .from(<table>) call site uses createAdminClient() (src/lib/supabase/server.ts)
--   · createBrowserClient (src/lib/supabase/client.ts) has zero call sites
--   · no 'use client' component imports supabase at all
--   · rate_limits is reached only through consume_rate_limit(), which already
--     revokes execute from public/anon/authenticated and grants it to service_role
--
-- The secret key resolves to service_role, whose own grants are untouched here and
-- which carries BYPASSRLS. Server-side reads and writes are unaffected.
--
-- NOTE ON KEY FORMAT
-- This project uses the current Supabase API keys (sb_publishable_ / sb_secret_),
-- not the deprecated anon/service_role JWTs. The underlying POSTGRES ROLES are
-- unchanged by that format change: the publishable key still resolves to `anon`
-- and the secret key still resolves to `service_role`. So naming the roles here
-- remains correct and is not legacy-key residue.
--
-- SCOPE
-- Existing tables only. Supabase's ALTER DEFAULT PRIVILEGES still grants anon and
-- authenticated access to tables created LATER, so any future table needs either
-- its own revoke or a change to the default privileges. Deliberately not altering
-- default privileges here: that is a project-wide behavioural change and belongs
-- in its own reviewed migration, not folded into this one.

revoke all privileges on table public.fdi_sessions            from anon, authenticated;
revoke all privileges on table public.fdi_answers             from anon, authenticated;
revoke all privileges on table public.diagnostic_leads        from anon, authenticated;
revoke all privileges on table public.contact_enquiries       from anon, authenticated;
revoke all privileges on table public.newsletter_subscribers  from anon, authenticated;
revoke all privileges on table public.admin_sessions          from anon, authenticated;
revoke all privileges on table public.rate_limits             from anon, authenticated;

-- RLS stays enabled on every one of these. This migration adds a second lock; it
-- does not replace the first. Do not treat revoked grants as a reason to relax RLS.
