import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { consume, getClientIp, tooManyRequests } from "@/lib/rateLimit";
import { z } from "zod";
import crypto from "crypto";

/** Constant-time comparison so response timing does not leak the password. */
function passwordMatches(candidate: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const { password } = z
      .object({ password: z.string() })
      .parse(await req.json());

    // Brute-force guard on ADMIN_PASSWORD: 10 attempts per IP per hour.
    const attempt = await consume({
      scope: "admin-login:ip",
      identifier: getClientIp(req),
      limit: 10,
      windowSeconds: 60 * 60,
    });
    if (!attempt.allowed) return tooManyRequests(attempt.retryAfterSeconds);

    if (!passwordMatches(password, process.env.ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await supabase.from("admin_sessions").insert({
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
