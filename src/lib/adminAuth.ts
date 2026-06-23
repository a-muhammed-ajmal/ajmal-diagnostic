import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const supabase = createAdminClient();

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) redirect("/admin");

  const { data, error } = await supabase
    .from("admin_sessions")
    .select("expires_at")
    .eq("session_token", sessionToken)
    .single();

  if (error || !data) redirect("/admin");
  if (new Date(data.expires_at) < new Date()) redirect("/admin");
  return true;
}
