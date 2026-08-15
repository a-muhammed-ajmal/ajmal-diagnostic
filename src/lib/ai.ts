import Anthropic from "@anthropic-ai/sdk";
import type { AIActionPlan, DiagnosticResult } from "@/types";
import { DIMENSION_META } from "./scoring";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * The plan plus whether the model actually produced it.
 *
 * This function never throws — a failure yields deterministic fallback content so
 * the report still ships. That is deliberate, but it previously made success and
 * failure indistinguishable to the caller, which is why `ai_plan_generated` was
 * recorded as true for canned fallback text on every lead. `generated` is the
 * discriminator: persist it, never assume it.
 */
export interface AIActionPlanResult {
  plan: AIActionPlan;
  /** True ONLY when the plan came from the model. False for fallback content. */
  generated: boolean;
  /** The underlying failure when `generated` is false. */
  error?: unknown;
}

export async function generateAIActionPlan(
  results: DiagnosticResult,
  leadData: { companyName: string; industry: string; teamSize: string; revenueRange: string },
): Promise<AIActionPlanResult> {
  const focusMeta = DIMENSION_META[results.primaryConstraint];
  const nextMeta = DIMENSION_META[results.secondaryConstraint];
  const dimensionScores = results.dimensions.map((dimension) => `${dimension.label}: ${dimension.score}/6 (${dimension.percentage}%)`).join("\n");

  const systemPrompt = `You are an AI assistant for Muhammed Ajmal Consulting, a business operations and growth consultancy in Dubai, UAE for founder-led SMEs.

The diagnostic is a self-reported comparison across operating dimensions. It can highlight patterns for reflection; it does not establish a root cause, prove a binding constraint, or replace an evidence-led Audit.

Use practical, plain language. Apply AI only as an enabling capability where it improves capacity, speed, or visibility. Do not invent business facts, financial outcomes, guarantees, frameworks, or diagnoses.

Return ONLY a valid JSON object with no preamble or markdown code fence. Use exactly this structure:
{
  "thirtyDayPriorities": ["priority 1", "priority 2", "priority 3"],
  "ninetyDayDirections": ["direction 1", "direction 2"],
  "discussionQuestions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
}`;

  const userPrompt = `Create an AI-assisted reflection plan from this self-reported diagnostic.

COMPANY CONTEXT:
- Company: ${leadData.companyName}
- Industry: ${leadData.industry}
- Team size: ${leadData.teamSize}
- Annual revenue range: ${leadData.revenueRange}

DIAGNOSTIC SCORES:
${dimensionScores}

Diagnostic score: ${results.healthScore}% (${results.severityLabel})
Lowest-scoring area: ${results.primaryConstraintLabel}
Next lowest-scoring area: ${results.secondaryConstraintLabel}

AREA DESCRIPTIONS:
- ${focusMeta.description}
- ${nextMeta.description}

PRACTICAL STARTING POINTS FOR THE LOWEST-SCORING AREA:
${focusMeta.actionDirections.join(" | ")}

Create:
1. thirtyDayPriorities: three specific, low-risk actions the founder can use to observe and improve the lowest-scoring area. Do not present them as a guaranteed solution or as proof of root cause.
2. ninetyDayDirections: two practical directions to strengthen the lowest- and next-lowest-scoring areas through clearer systems, ownership, visibility, or consistent execution.
3. discussionQuestions: five evidence-seeking questions for an Audit conversation. They should help test assumptions rather than assume the diagnostic has established the answer.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");
    return { plan: JSON.parse(content.text) as AIActionPlan, generated: true };
  } catch (error) {
    console.error("AI reflection plan generation failed, using fallback:", error);
    return {
      generated: false,
      error,
      plan: {
        thirtyDayPriorities: focusMeta.actionDirections,
        ninetyDayDirections: [
          `Review how ${results.primaryConstraintLabel} is currently managed, then choose one simple way to make progress and blockers visible.`,
          `Strengthen ${results.secondaryConstraintLabel} with one clear owner, expected standard, or regular review rhythm.`,
        ],
        discussionQuestions: [
          `Where does work in ${results.primaryConstraintLabel} most often wait for clarification or approval?`,
          `What operational evidence would show whether ${results.primaryConstraintLabel} is improving?`,
          `Which repeated task or decision creates the most avoidable effort for the team?`,
          "What has the business already tried, and what made consistent adoption difficult?",
          "What would a useful operating standard look like for this area over the next 90 days?",
        ],
      },
    };
  }
}
