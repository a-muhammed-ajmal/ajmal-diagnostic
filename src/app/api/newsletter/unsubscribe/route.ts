import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/env";

/**
 * One-click unsubscribe. The link in every newsletter email carries the subscriber's
 * random token: GET /api/newsletter/unsubscribe?token=<token>. We mark the row
 * unsubscribed and redirect to a human-readable confirmation page.
 *
 * A GET is deliberate — email clients only follow links, not POSTs — and safe here
 * because the token is unguessable, so this cannot be used to unsubscribe someone else.
 */
export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/unsubscribe?status=invalid", base));
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token)
      .select("email")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.redirect(new URL("/unsubscribe?status=invalid", base));
    }

    return NextResponse.redirect(new URL("/unsubscribe?status=success", base));
  } catch {
    return NextResponse.redirect(new URL("/unsubscribe?status=error", base));
  }
}
