// Poisons this module for any client bundle: importing it from a "use client"
// component becomes a build error rather than a silently broken client holding an
// undefined key. createAdminClient bypasses RLS, so it must never cross the
// server boundary — every table is RLS-enabled with all privileges revoked from
// anon/authenticated, and service_role is the only role that can read them.
import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
