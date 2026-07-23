-- Rate limiting store for the public API routes.
--
-- Lives in Postgres rather than process memory because Vercel functions are per-instance
-- and cold-start frequently: an in-memory counter would reset constantly and would not be
-- shared across instances.
--
-- Consumed by src/lib/rateLimit.ts. If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
-- are set the application uses Redis instead and this table simply goes idle.

create table if not exists public.rate_limits (
  scope          text        not null,
  identifier     text        not null,
  window_start   timestamptz not null default now(),
  request_count  integer     not null default 0,
  primary key (scope, identifier)
);

comment on table public.rate_limits is
  'Fixed-window request counters. One row per (scope, identifier), e.g. ("submit:ip", "1.2.3.4").';

-- Supports the cleanup job below.
create index if not exists rate_limits_window_start_idx
  on public.rate_limits (window_start);

-- Deny by default. Only the service role (which bypasses RLS) may touch this table;
-- the browser has no business reading or writing rate limit counters.
alter table public.rate_limits enable row level security;

/**
 * Atomically consume one unit from a fixed window.
 *
 * Returns whether the request is allowed and how many seconds remain in the current
 * window. The whole read-modify-write happens in a single INSERT ... ON CONFLICT so
 * concurrent requests cannot race past the limit.
 */
create or replace function public.consume_rate_limit(
  p_scope          text,
  p_identifier     text,
  p_limit          integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
as $$
declare
  v_window_start timestamptz;
  v_count        integer;
begin
  insert into public.rate_limits as rl (scope, identifier, window_start, request_count)
  values (p_scope, p_identifier, now(), 1)
  on conflict (scope, identifier) do update
    set
      -- Expired window: start a fresh one. Otherwise keep counting in the current one.
      window_start = case
        when rl.window_start + make_interval(secs => p_window_seconds) <= now() then now()
        else rl.window_start
      end,
      request_count = case
        when rl.window_start + make_interval(secs => p_window_seconds) <= now() then 1
        else rl.request_count + 1
      end
  returning rl.window_start, rl.request_count
  into v_window_start, v_count;

  allowed := v_count <= p_limit;
  retry_after_seconds := greatest(
    0,
    ceil(
      extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - now()))
    )::integer
  );

  return next;
end;
$$;

-- Only the service role may consume. Anonymous callers must go through the API routes.
revoke execute on function public.consume_rate_limit(text, text, integer, integer) from public;
revoke execute on function public.consume_rate_limit(text, text, integer, integer) from anon;
revoke execute on function public.consume_rate_limit(text, text, integer, integer) from authenticated;
grant  execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;

/**
 * Housekeeping. Rows whose window closed long ago are dead weight.
 * Schedule with pg_cron if desired:
 *   select cron.schedule('purge-rate-limits', '0 * * * *', $$select public.purge_stale_rate_limits()$$);
 */
create or replace function public.purge_stale_rate_limits()
returns integer
language plpgsql
as $$
declare
  v_deleted integer;
begin
  delete from public.rate_limits
  where window_start < now() - interval '2 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke execute on function public.purge_stale_rate_limits() from public;
revoke execute on function public.purge_stale_rate_limits() from anon;
revoke execute on function public.purge_stale_rate_limits() from authenticated;
grant  execute on function public.purge_stale_rate_limits() to service_role;
