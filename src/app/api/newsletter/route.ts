import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NewsletterConfirmationEmail } from "@/lib/email/templates/NewsletterConfirmation";
import { NewsletterSubscriberNotificationEmail } from "@/lib/email/templates/NewsletterSubscriberNotification";
import { enforcePublicFormLimits, normaliseEmail } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/env";
import { Resend } from "resend";
import { z } from "zod";
import { requireResendConfig } from "@/lib/serverEnv";

const RESEND_CONFIG = requireResendConfig();

/** Postgres unique_violation — the address is already on the list. */
const UNIQUE_VIOLATION = "23505";

interface SubscriberRow {
  id: string;
  unsubscribe_token: string;
  unsubscribed_at: string | null;
}

/** US date order, per WEB. Example: August 29, 2026. */
function formatSubscribedOn(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = z
      .object({ email: z.string().email() })
      .parse(await req.json());

    const limited = await enforcePublicFormLimits(req, "newsletter", email);
    if (limited) return limited;

    const supabase = createAdminClient();
    const address = normaliseEmail(email);

    // Insert first rather than upsert: an upsert cannot tell a new subscriber
    // from a repeat, and only a genuinely new one should raise a notification.
    // The unique violation on email is the atomic signal that it already exists.
    //
    // unsubscribe_token is never supplied — the column's random default
    // generates it on insert and an existing row keeps the token it already has,
    // so previously issued unsubscribe links keep working.
    const { data: inserted, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: address })
      .select("id, unsubscribe_token, unsubscribed_at")
      .single();

    let row: SubscriberRow | null = inserted;
    let isNew = false;
    let isReactivated = false;

    if (insertError) {
      if (insertError.code !== UNIQUE_VIOLATION) {
        // A real write failure. It must never present as a subscription.
        console.error("Newsletter subscribe failed to write:", insertError);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      const { data: existing, error: selectError } = await supabase
        .from("newsletter_subscribers")
        .select("id, unsubscribe_token, unsubscribed_at")
        .eq("email", address)
        .single();

      if (selectError || !existing) {
        console.error("Newsletter subscribe could not read the existing row:", selectError);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      row = existing;

      if (existing.unsubscribed_at !== null) {
        const { error: reactivateError } = await supabase
          .from("newsletter_subscribers")
          .update({ unsubscribed_at: null })
          .eq("id", existing.id);

        if (reactivateError) {
          console.error("Newsletter resubscribe failed to write:", reactivateError);
          return NextResponse.json({ success: false }, { status: 500 });
        }
        isReactivated = true;
      }
    } else {
      isNew = true;
    }

    if (!row) {
      console.error("Newsletter subscribe produced no row.");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // The write has succeeded by here. Email failures below are logged and never
    // reverse the subscription, and are never reported as delivered.
    const resend = new Resend(RESEND_CONFIG.apiKey);

    if (isNew || isReactivated) {
      const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}`;
      try {
        const { error: confirmError } = await resend.emails.send({
          from: `Muhammed Ajmal Consulting <${RESEND_CONFIG.fromEmail}>`,
          to: address,
          subject: "You are subscribed",
          react: NewsletterConfirmationEmail({ unsubscribeUrl }),
        });
        if (confirmError) {
          console.error(`Newsletter confirmation rejected for ${address}:`, confirmError);
        }
      } catch (confirmThrew) {
        console.error(`Newsletter confirmation threw for ${address}:`, confirmThrew);
      }
    }

    if (isNew) {
      try {
        const { error: notifyError } = await resend.emails.send({
          from: `Muhammed Ajmal Consulting <${RESEND_CONFIG.fromEmail}>`,
          to: RESEND_CONFIG.fromEmail,
          subject: "New newsletter subscriber",
          react: NewsletterSubscriberNotificationEmail({
            email: address,
            subscribedOn: formatSubscribedOn(new Date()),
          }),
        });
        if (notifyError) {
          console.error(`New-subscriber notification rejected for ${address}:`, notifyError);
        }
      } catch (notifyThrew) {
        console.error(`New-subscriber notification threw for ${address}:`, notifyThrew);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
