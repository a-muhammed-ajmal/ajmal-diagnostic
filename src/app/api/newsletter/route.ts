import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { enforcePublicFormLimits, normaliseEmail } from "@/lib/rateLimit";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { email } = z
      .object({ email: z.string().email() })
      .parse(await req.json());

    const limited = await enforcePublicFormLimits(req, "newsletter", email);
    if (limited) return limited;

    const supabase = createAdminClient();

    // unsubscribe_token is omitted deliberately: the column has a random default, so a
    // first insert generates one and a re-subscribe leaves the existing token intact
    // (old unsubscribe links keep working). Re-subscribing clears unsubscribed_at.
    await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: normaliseEmail(email), unsubscribed_at: null },
        { onConflict: "email" },
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
