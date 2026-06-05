import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateResults } from '@/lib/scoring';
import { Resend } from 'resend';
import { DiagnosticReportEmail } from '@/lib/email/templates/DiagnosticReport';
import { z } from 'zod'; // <-- Added Zod import

// 1. Define the strict schema
const submitSchema = z.object({
  leadData: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    companyName: z.string().min(2).max(200),
    revenueRange: z.enum(['under-500k', '500k-2m', '2m-5m', '5m-15m', 'over-15m'])
  }),
  answers: z.record(z.string(), z.enum(['a', 'b', 'c', 'd']))
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 2. Validate the body BEFORE executing any other logic
    const validatedData = submitSchema.parse(body);
    const { leadData, answers } = validatedData; // Use the safe, validated data

    // Calculate results
    const results = calculateResults(answers);

    // Save to Supabase
    const { data: lead, error: dbError } = await supabase
      .from('diagnostic_leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        company_name: leadData.companyName,
        revenue_range: leadData.revenueRange,
        q1_answer: answers[1], q2_answer: answers[2],
        q3_answer: answers[3], q4_answer: answers[4],
        q5_answer: answers[5], q6_answer: answers[6],
        q7_answer: answers[7], q8_answer: answers[8],
        q9_answer: answers[9], q10_answer: answers[10],
        score_strategic_clarity: results.dimensions.find(d => d.key === 'strategic_clarity')?.score,
        score_financial_visibility: results.dimensions.find(d => d.key === 'financial_visibility')?.score,
        score_operations: results.dimensions.find(d => d.key === 'operations')?.score,
        score_people_leadership: results.dimensions.find(d => d.key === 'people_leadership')?.score,
        score_sales_growth: results.dimensions.find(d => d.key === 'sales_growth')?.score,
        total_score: results.totalScore,
        primary_constraint: results.primaryConstraint,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Send email report
    const { error: emailError } = await resend.emails.send({
      from: `Muhammed Ajmal Consulting <${process.env.RESEND_FROM_EMAIL}>`,
      to: leadData.email,
      subject: `Your Business Constraint Diagnosis: ${results.primaryConstraintLabel} is your primary growth blocker`,
      react: DiagnosticReportEmail({
        name: leadData.name,
        companyName: leadData.companyName,
        results,
        calendlyLink: process.env.CALENDLY_LINK!
      })
    });

    if (!emailError) {
      await supabase
        .from('diagnostic_leads')
        .update({ email_sent: true })
        .eq('id', lead.id);
    }

    return NextResponse.json({
      success: true,
      results,
      leadId: lead.id
    });

  } catch (error) {
    console.error('Submission error:', error);

    // 3. Handle failed Zod validation gracefully
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data format", details: error.errors }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}