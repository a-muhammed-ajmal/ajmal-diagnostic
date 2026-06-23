import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const supabase = createAdminClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = z
      .object({ email: z.string().email() })
      .parse(await req.json());
    await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
