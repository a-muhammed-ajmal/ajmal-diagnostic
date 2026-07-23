-- Initial schema for the consulting site.
--
-- Four tables are written by the route handlers in src/app/api and read by the admin
-- dashboard. Columns mirror src/types/index.ts (Lead) and the insert shapes in the routes.
--
-- SECURITY MODEL — read this before changing anything:
-- Every server query uses the Supabase SERVICE ROLE key (src/lib/supabase/server.ts,
-- createAdminClient), which BYPASSES row-level security. RLS is therefore enabled on every
-- table with NO permissive policies, which denies all access to the anon and authenticated
-- roles. In other words: the browser (which only ever gets the publishable/anon key) can
-- read and write NOTHING here; all access flows through server-side route handlers. This is
-- deliberate — these tables hold lead PII and admin session tokens.
--
-- The service-role key must never be exposed to the client. It is read only from the
-- non-public env var SUPABASE_SERVICE_ROLE_KEY and only in server.ts, which is imported
-- exclusively by route handlers, server components and admin auth helpers.

create extension if not exists pgcrypto;

-- ── diagnostic_leads ──────────────────────────────────────────────────────────
create table if not exists public.diagnostic_leads (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),

  name                      text not null,
  email                     text not null,
  phone                     text,
  company_name              text not null,
  industry                  text,
  team_size                 text,
  revenue_range             text not null default '',

  q1_answer                 text,
  q2_answer                 text,
  q3_answer                 text,
  q4_answer                 text,
  q5_answer                 text,
  q6_answer                 text,
  q7_answer                 text,
  q8_answer                 text,
  q9_answer                 text,
  q10_answer                text,

  score_strategic_clarity   integer,
  score_financial_visibility integer,
  score_operations          integer,
  score_people_leadership   integer,
  score_sales_growth        integer,

  total_score               integer,
  health_score              integer,
  severity_label            text,
  primary_constraint        text,
  secondary_constraint      text,

  ai_plan_generated         boolean not null default false,
  ai_30day_plan             text,
  ai_90day_plan             text,
  ai_discussion_questions   text,

  email_sent                boolean not null default false,
  booked_call               boolean not null default false,
  contacted                 boolean not null default false
);

create index if not exists diagnostic_leads_created_at_idx
  on public.diagnostic_leads (created_at desc);

alter table public.diagnostic_leads enable row level security;

-- ── contact_enquiries ─────────────────────────────────────────────────────────
create table if not exists public.contact_enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text not null,
  company_name  text not null,
  inquiry_type  text not null,
  message       text not null
);

create index if not exists contact_enquiries_created_at_idx
  on public.contact_enquiries (created_at desc);

alter table public.contact_enquiries enable row level security;

-- ── newsletter_subscribers ────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  email              text not null unique,
  -- Random, unguessable token embedded in every unsubscribe link so links cannot be
  -- enumerated. Generated on insert; preserved across re-subscribes.
  unsubscribe_token  text not null unique default encode(gen_random_bytes(32), 'hex'),
  unsubscribed_at    timestamptz
);

alter table public.newsletter_subscribers enable row level security;

-- ── admin_sessions ────────────────────────────────────────────────────────────
create table if not exists public.admin_sessions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  session_token  text not null unique,
  expires_at     timestamptz not null
);

create index if not exists admin_sessions_token_idx
  on public.admin_sessions (session_token);

alter table public.admin_sessions enable row level security;

-- No policies are defined on purpose. With RLS enabled and no permissive policies, the
-- anon and authenticated roles are denied all access; only the service role (used server
-- side) can read or write. Do not add anon/authenticated policies without a review.
