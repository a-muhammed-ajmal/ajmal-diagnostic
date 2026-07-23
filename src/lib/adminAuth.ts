import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdminAuth() {
  // cookies() must come first: it marks the route dynamic, so Next never tries
  // to prerender admin pages at build time (where env vars may be absent).
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) redirect("/admin");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("expires_at")
    .eq("session_token", sessionToken)
    .single();

  if (error || !data) redirect("/admin");
  if (new Date(data.expires_at) < new Date()) redirect("/admin");
  return true;
}
