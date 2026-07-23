import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { calculateResults } from "@/lib/scoring";
import { generateAIActionPlan } from "@/lib/ai";
import { Resend } from "resend";
import { DiagnosticReportEmail } from "@/lib/email/templates/DiagnosticReport";
import { CALENDLY_LINK } from "@/lib/env";
import { enforcePublicFormLimits } from "@/lib/rateLimit";
import { z } from "zod";

const submitSchema = z.object({
  leadData: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    companyName: z.string().min(2).max(200),
    phone: z.string().optional(),
    industry: z.string().optional(),
    teamSize: z.string().optional(),
    revenueRange: z.string().optional(),
  }),
  answers: z.record(z.string(), z.enum(["a", "b", "c", "d"])),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadData, answers } = submitSchema.parse(body);

    // Guard before any paid work: each accepted request costs one Anthropic call
    // plus one Resend send.
    const limited = await enforcePublicFormLimits(req, "submit", leadData.email);
    if (limited) return limited;

    const supabase = createAdminClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const results = calculateResults(answers);

    const { data: lead, error: dbError } = await supabase
      .from("diagnostic_leads")
      .insert({
        name: leadData.name,
        email: leadData.email,
        company_name: leadData.companyName,
        phone: leadData.phone || null,
        industry: leadData.industry || null,
        team_size: leadData.teamSize || null,
        revenue_range: leadData.revenueRange || "",
        q1_answer: answers["1"],
        q2_answer: answers["2"],
        q3_answer: answers["3"],
        q4_answer: answers["4"],
        q5_answer: answers["5"],
        q6_answer: answers["6"],
        q7_answer: answers["7"],
        q8_answer: answers["8"],
        q9_answer: answers["9"],
        q10_answer: answers["10"],
        score_strategic_clarity: results.dimensions.find(
          (d) => d.key === "strategic_clarity",
        )?.score,
        score_financial_visibility: results.dimensions.find(
          (d) => d.key === "financial_visibility",
        )?.score,
        score_operations: results.dimensions.find((d) => d.key === "operations")
          ?.score,
        score_people_leadership: results.dimensions.find(
          (d) => d.key === "people_leadership",
        )?.score,
        score_sales_growth: results.dimensions.find(
          (d) => d.key === "sales_growth",
        )?.score,
        total_score: results.totalScore,
        health_score: results.healthScore,
        severity_label: results.severityLabel,
        primary_constraint: results.primaryConstraint,
        secondary_constraint: results.secondaryConstraint,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    try {
      const aiPlan = await generateAIActionPlan(results, {
        companyName: leadData.companyName,
        industry: leadData.industry || "Not specified",
        teamSize: leadData.teamSize || "Not specified",
        revenueRange: leadData.revenueRange || "Not specified",
      });
      results.aiPlan = aiPlan;
      await supabase
        .from("diagnostic_leads")
        .update({
          ai_plan_generated: true,
          ai_30day_plan: JSON.stringify(aiPlan.thirtyDayPriorities),
          ai_90day_plan: JSON.stringify(aiPlan.ninetyDayDirections),
          ai_discussion_questions: JSON.stringify(aiPlan.discussionQuestions),
        })
        .eq("id", lead.id);
    } catch (aiError) {
      console.error("AI plan failed (non-blocking):", aiError);
    }

    try {
      const { error: emailError } = await resend.emails.send({
        from: `Muhammed Ajmal Consulting <${process.env.RESEND_FROM_EMAIL}>`,
        to: leadData.email,
        subject: `Your Business Constraint Diagnosis: ${results.primaryConstraintLabel} is your primary growth blocker`,
        react: DiagnosticReportEmail({
          name: leadData.name,
          companyName: leadData.companyName,
          results,
          calendlyLink: CALENDLY_LINK,
        }),
      });
      if (!emailError) {
        await supabase
          .from("diagnostic_leads")
          .update({ email_sent: true })
          .eq("id", lead.id);
      }
    } catch (emailError) {
      console.error("Email failed (non-blocking):", emailError);
    }

    return NextResponse.json({ success: true, results, leadId: lead.id });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export const maxDuration = 30;
