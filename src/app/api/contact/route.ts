import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ContactNotificationEmail } from "@/lib/email/templates/ContactNotification";
import { enforcePublicFormLimits } from "@/lib/rateLimit";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  companyName: z.string().min(2).max(200),
  inquiryType: z.string().min(1),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());

    // Guard before the Resend send.
    const limited = await enforcePublicFormLimits(req, "contact", data.email);
    if (limited) return limited;

    const supabase = createAdminClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    await supabase.from("contact_enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company_name: data.companyName,
      inquiry_type: data.inquiryType,
      message: data.message,
    });

    // Rendered as React so every attacker-controlled value is escaped.
    await resend.emails.send({
      from: `Muhammed Ajmal Consulting <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.RESEND_FROM_EMAIL!,
      replyTo: data.email,
      subject: `New Enquiry: ${data.inquiryType} — ${data.companyName}`,
      react: ContactNotificationEmail(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
