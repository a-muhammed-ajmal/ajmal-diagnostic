-- Founder Dependency Index (FDI-1.0) — Phase 3 session lifecycle.
--
-- This migration changes only FDI tables introduced by 20260814000001. Legacy
-- diagnostic tables are intentionally untouched.
-- Browser access remains deny-all through RLS: all writes occur server-side
-- with the Supabase secret key after validation and session-capability checks.

alter table public.fdi_sessions
  drop constraint if exists fdi_sessions_status_check,
  drop constraint if exists fdi_sessions_incomplete_has_no_score,
  drop constraint if exists fdi_sessions_complete_is_stamped;

-- Translate Phase 2's intentionally provisional names before applying the
-- finalized Phase 3 lifecycle. No completed score is recalculated or changed.
update public.fdi_sessions
  set status = 'in_progress'
  where status = 'incomplete';

update public.fdi_sessions
  set status = 'completed'
  where status = 'complete';

alter table public.fdi_sessions
  alter column status set default 'in_progress',
  add constraint fdi_sessions_status_check
    check (status in ('in_progress', 'completed')),
  add column if not exists q_founder_led boolean,
  add column if not exists q_willing_to_share_operational_information boolean,
  add column if not exists q_secondary_sector text,
  add column if not exists q_other_sector text;

-- An incomplete attempt can retain raw answers and qualification responses,
-- but never a calculated measurement, delivery state, or completion timestamp.
alter table public.fdi_sessions
  add constraint fdi_sessions_in_progress_has_no_score check (
    status = 'completed' or (
      completed_at is null
      and raw_ds is null and raw_ec is null and raw_ov is null
      and component_ds is null and component_ec is null and component_ov is null
      and display_ds is null and display_ec is null and display_ov is null
      and fdi_unrounded is null and fdi_display is null
      and band_key is null and band_label is null
      and qualification_result is null and qualification_reasons is null
      and qualification_config_version is null
      and email_sent = false
    )
  ),
  add constraint fdi_sessions_completed_is_stamped check (
    status <> 'completed' or (
      completed_at is not null
      and name is not null and email is not null and company_name is not null
      and fdi_unrounded is not null and fdi_display is not null
      and band_key is not null and band_label is not null
      and qualification_result is not null and qualification_config_version is not null
    )
  );

comment on column public.fdi_sessions.status is
  'in_progress until all twelve answers and contact fields validate; completed only after deterministic scoring.';

create table public.fdi_test_status_history (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.fdi_sessions(id) on delete cascade,
  previous_is_test    boolean not null,
  new_is_test         boolean not null,
  changed_at          timestamptz not null default now(),
  admin_identifier    text,
  reason              text
);

comment on table public.fdi_test_status_history is
  'Append-only audit history for explicit authenticated admin live/test overrides.';

create index fdi_test_status_history_session_changed_idx
  on public.fdi_test_status_history (session_id, changed_at desc);

alter table public.fdi_test_status_history enable row level security;

revoke all privileges on table public.fdi_test_status_history from anon, authenticated;

-- No anon/authenticated policies. Server-side use of the secret key bypasses
-- RLS; the public browser never receives direct table access.
