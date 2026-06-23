import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { z } from "zod";

const supabase = createAdminClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    await supabase.from("contact_enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company_name: data.companyName,
      inquiry_type: data.inquiryType,
      message: data.message,
    });

    await resend.emails.send({
      from: `Muhammed Ajmal Consulting <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.RESEND_FROM_EMAIL!,
      subject: `New Enquiry: ${data.inquiryType} — ${data.companyName}`,
      html: `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Type:</strong> ${data.inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
