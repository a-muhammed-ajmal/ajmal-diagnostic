-- Founder Dependency Index (FDI-1.0) — session and answer storage.
--
-- ADDITIVE ONLY. This migration creates two new tables and touches nothing that
-- already exists: there is no ALTER, no UPDATE, no DROP anywhere in it. Applying
-- it cannot affect the running diagnostic, which continues to write
-- public.diagnostic_leads until the FDI cutover completes.
--
-- SECURITY MODEL — identical to 20260723000001_initial_schema.sql:
-- every server query uses the Supabase SERVICE ROLE key (src/lib/supabase/server.ts,
-- createAdminClient), which BYPASSES row-level security. RLS is therefore enabled on
-- both new tables with NO permissive policies, which denies all access to the anon and
-- authenticated roles. The browser, which only ever receives the publishable/anon key,
-- can read and write NOTHING here. These tables hold lead PII and self-reported
-- operational detail about real businesses.
--
-- LEGACY PRESERVATION (spec §19 test 16):
-- public.diagnostic_leads is deliberately left untouched and is never backfilled.
-- A legacy health_score is NOT an FDI and must never be converted into one. The two
-- instruments are separated by TABLE, which is the strongest separation available —
-- there is no column, flag or view that could blur them.
--
-- NO MEASUREMENT CONSTANTS IN DDL:
-- there are deliberately no CHECK constraints bounding raw or normalised scores.
-- The item count (4), item range (0–3), scale (100), alert threshold (75) and band
-- edges are CONFIGURATION (src/lib/fdi/config/fdi-1.0.ts), not schema. Encoding them
-- here would hardcode one version's instrument into the database and break the moment
-- a later version changes them. Range validation belongs to the scoring engine, which
-- derives every bound from the config it was handed. The constraints below are purely
-- structural invariants that hold for every conceivable version.

create extension if not exists pgcrypto;

-- ── fdi_sessions ──────────────────────────────────────────────────────────────
-- One row per diagnostic attempt, complete or incomplete.
create table if not exists public.fdi_sessions (
  id                            uuid primary key default gen_random_uuid(),
  created_at                    timestamptz not null default now(),

  -- §12 "Partial attempt | Save as incomplete, no score, no email".
  -- completed_at is null until the attempt is scored.
  completed_at                  timestamptz,
  status                        text not null default 'incomplete'
                                  check (status in ('incomplete', 'complete')),

  -- §18 Versioning. Stamped at completion and NEVER mutated. A historic response
  -- may be recalculated using that same version's configuration to confirm
  -- reproducibility; it is never silently re-scored under later rules.
  instrument                    text not null default 'FDI',
  diagnostic_version            text not null,
  question_set_version          text not null,
  scoring_model_version         text not null,
  band_config_version           text not null,
  -- Null until the qualification rule is specified (open questions B, B′).
  qualification_config_version  text,
  -- §18 test/live status. How a session is marked test is open question F.
  is_test                       boolean not null default false,

  -- Respondent. Nullable while the attempt is incomplete.
  name                          text,
  email                         text,
  phone                         text,
  company_name                  text,

  -- §13 Qualification INPUTS. Recorded alongside the score but structurally
  -- incapable of affecting it: the scoring engine's signature accepts only a
  -- diagnostic version and an answer map. Never increase, decrease, suppress or
  -- reinterpret an FDI because of anything in these columns.
  -- The exact field set is open question B′; these mirror what the current lead
  -- form already collects, plus the Track B profile attributes.
  q_country                     text,
  q_industry                    text,
  q_team_size                   text,
  q_revenue_range               text,
  q_operating_years             text,
  q_founder_decision_authority  text,

  -- §13 Qualification RESULT. Null until the rule exists; never inferred.
  qualification_result          text,
  qualification_reasons         jsonb,

  -- §7 "Store: raw answers · raw component scores · unrounded normalized
  -- components · displayed components · unrounded composite · displayed FDI."
  -- Raw answers live in fdi_answers; the other five artefacts are below.
  --
  -- double precision, not numeric(p,s): these record the exact IEEE-754 values the
  -- engine produced, so a stored score round-trips bit-for-bit. A scaled numeric
  -- would silently truncate and make the reproducibility check approximate.
  raw_ds                        smallint,
  raw_ec                        smallint,
  raw_ov                        smallint,
  component_ds                  double precision,
  component_ec                  double precision,
  component_ov                  double precision,
  display_ds                    smallint,
  display_ec                    smallint,
  display_ov                    smallint,
  fdi_unrounded                 double precision,
  fdi_display                   smallint,

  -- §9 "Store the numeric score independently from the label so bands
  -- recalibrate later without destroying history."
  band_key                      text,
  band_label                    text,

  -- §10 every component at or above the alert threshold, grouped into tiers
  -- ordered by score descending, ties together.
  component_alerts              jsonb,
  -- §11 the highest component(s). ALL of them when two or three tie.
  concentration                 jsonb,
  -- §14 deterministic observations. Empty until the rules are specified (question A).
  observations                  jsonb,

  -- §17 Response-quality control. ANALYSIS FLAGS ONLY — these must never
  -- automatically manipulate a score. Straight-lining and fast completion are
  -- worth monitoring, but straight-lining alone is not proof a response is invalid.
  -- All of it is client-reported and therefore untrusted.
  completion_ms                 integer,
  answer_change_count           integer,
  straight_line_flag            boolean,
  analysis_flags                jsonb,

  -- Delivery. §16: AI failure cannot prevent delivery of the core result, so
  -- ai_failed is recorded separately rather than being inferred from a null
  -- narrative. The legacy table's ai_plan_generated flag could not distinguish a
  -- real AI response from a canned fallback; this pair can.
  email_sent                    boolean not null default false,
  ai_narrative                  jsonb,
  ai_failed                     boolean not null default false,

  -- §15 Consultant workflow.
  contacted                     boolean not null default false,
  booked_call                   boolean not null default false,
  next_action                   text,

  -- §12 "Partial attempt | ... no score" and "Missing does not equal zero
  -- dependency", enforced in storage: an incomplete session cannot carry any
  -- scored value, so no partial composite can ever be persisted or read back.
  constraint fdi_sessions_incomplete_has_no_score check (
    status = 'complete' or (
      raw_ds is null and raw_ec is null and raw_ov is null
      and component_ds is null and component_ec is null and component_ov is null
      and display_ds is null and display_ec is null and display_ov is null
      and fdi_unrounded is null and fdi_display is null
      and band_key is null and band_label is null
    )
  ),

  -- A complete session must be fully stamped: §18 requires the completion
  -- timestamp and the score to exist together.
  constraint fdi_sessions_complete_is_stamped check (
    status <> 'complete' or (
      completed_at is not null
      and fdi_unrounded is not null
      and fdi_display is not null
      and band_key is not null
    )
  )
);

comment on table public.fdi_sessions is
  'One Founder Dependency Index attempt. Scored rows are immutable measurement records: '
  'never re-score an existing row under a later version (spec §18).';

comment on column public.fdi_sessions.fdi_unrounded is
  'Unrounded composite (§7). The displayed value is derived by rounding; bands and the '
  'component alert are evaluated against this unrounded value.';

comment on column public.fdi_sessions.analysis_flags is
  'Response-quality signals for consultant review only (§17). Never inputs to scoring.';

create index if not exists fdi_sessions_created_at_idx
  on public.fdi_sessions (created_at desc);

create index if not exists fdi_sessions_status_created_at_idx
  on public.fdi_sessions (status, created_at desc);

create index if not exists fdi_sessions_email_idx
  on public.fdi_sessions (email);

alter table public.fdi_sessions enable row level security;

-- ── fdi_answers ───────────────────────────────────────────────────────────────
-- One row per answered item. Replaces the legacy table's ten fixed qN_answer
-- columns, so a future version with a different item count needs no migration.
create table if not exists public.fdi_answers (
  id                 uuid primary key default gen_random_uuid(),
  session_id         uuid not null references public.fdi_sessions(id) on delete cascade,

  question_id        text not null,
  component_key      text not null,
  option_id          text not null,

  -- The score resolved from the session's question_set_version at write time.
  -- Storing BOTH the chosen option and its resolved score gives §18 reproducibility
  -- (recompute from option_id under the stored version) AND drift detection
  -- (compare the recomputed score against this one). The legacy table stored bare
  -- 'a'–'d' letters whose meaning was defined only by the then-current code.
  score              smallint not null,

  -- §17 analysis flags, per item. Never inputs to scoring.
  first_answered_at  timestamptz not null default now(),
  answered_at        timestamptz not null default now(),
  change_count       integer not null default 0,
  dwell_ms           integer,

  -- §12 "Duplicate answer before submission | Latest replaces previous within
  -- same session". Upsert on this key makes last-write-wins the only outcome.
  constraint fdi_answers_one_per_question unique (session_id, question_id)
);

comment on table public.fdi_answers is
  'Raw answers (§7). option_id plus its resolved score, so a historic response stays '
  'interpretable and reproducible under the question set version it was collected with.';

create index if not exists fdi_answers_session_idx
  on public.fdi_answers (session_id);

alter table public.fdi_answers enable row level security;

-- No policies are defined on purpose. With RLS enabled and no permissive policies,
-- the anon and authenticated roles are denied all access; only the service role
-- (used server side) can read or write. Do not add anon/authenticated policies
-- without a review.
