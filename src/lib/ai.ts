import Anthropic from '@anthropic-ai/sdk';
import { AIActionPlan, DiagnosticResult } from '@/types';
import { DIMENSION_META } from './scoring';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAIActionPlan(
  results: DiagnosticResult,
  leadData: { companyName: string; industry: string; teamSize: string; revenueRange: string }
): Promise<AIActionPlan> {
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const secondaryMeta = DIMENSION_META[results.secondaryConstraint];

  const dimensionScoresList = results.dimensions
    .map(d => `${d.label}: ${d.score}/6 (${d.percentage}%)`)
    .join('\n');

  const systemPrompt = `You are the AI advisor for Muhammed Ajmal Consulting, a strategic growth advisory practice in Dubai, UAE serving founder-led SMEs across the GCC.

Your role is to generate a precise, personalised growth action plan based on a founder's completed Business Constraint Diagnostic. The plan must be practical, specific, and grounded in the following consulting framework:

FRAMEWORK: Diagnose → Design → Build → Optimize → Scale
THREE PILLARS: Team Excellence & Accountability | Operational Excellence & Systems | Strategic Growth & Market Positioning

FIVE FAILURE PATTERNS this framework addresses:
1. Founder Dependency — every decision escalates to the owner
2. Lack of Accountability — roles, KPIs and ownership are unclear
3. Poor System Adoption — processes exist but are not followed
4. Fragmented Data — information scattered across tools and individuals
5. Constant Strategic Shifts — direction changes faster than execution

CRITICAL INSTRUCTION: Output ONLY a valid JSON object with no preamble, explanation, or markdown code fences. Return exactly this structure:
{
  "thirtyDayPriorities": ["priority 1", "priority 2", "priority 3"],
  "ninetyDayDirections": ["direction 1", "direction 2"],
  "discussionQuestions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
}`;

  const userPrompt = `Generate a personalised action plan for this founder's business.

COMPANY CONTEXT:
- Company: ${leadData.companyName}
- Industry: ${leadData.industry}
- Team Size: ${leadData.teamSize}
- Annual Revenue: ${leadData.revenueRange}

DIAGNOSTIC SCORES:
${dimensionScoresList}

Business Health Score: ${results.healthScore}% (${results.severityLabel})
Primary Constraint: ${results.primaryConstraintLabel}
Secondary Constraint: ${results.secondaryConstraintLabel}

PRIMARY CONSTRAINT: ${primaryMeta.constraintExplanation}
Known action directions: ${primaryMeta.actionDirections.join(' | ')}

SECONDARY CONSTRAINT: ${secondaryMeta.secondaryExplanation}

Generate:
1. thirtyDayPriorities: 3 specific, immediately actionable priorities for this exact company in the next 30 days. Each must be concrete, referencing their industry and team size where relevant. Focused entirely on the primary constraint.
2. ninetyDayDirections: 2 strategic directions for days 31–90. Address both the primary constraint deeper and begin addressing the secondary constraint.
3. discussionQuestions: 5 sharp diagnostic questions that Muhammed Ajmal should ask this specific founder in the consultation call — questions that will uncover the root cause within their primary constraint category.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');
    return JSON.parse(content.text) as AIActionPlan;
  } catch (error) {
    console.error('AI plan generation failed, using fallback:', error);
    return {
      thirtyDayPriorities: primaryMeta.actionDirections,
      ninetyDayDirections: [
        `Address your secondary constraint: ${results.secondaryConstraintLabel} — begin the first foundational step in this dimension.`,
        `Consolidate gains from your 30-day primary constraint work and establish a measurement system to track progress.`
      ],
      discussionQuestions: [
        `What would change in your business immediately if your ${results.primaryConstraintLabel} was fully resolved?`,
        `Which specific part of the ${results.primaryConstraintLabel} problem costs you the most time or money right now?`,
        `What have you already tried to fix this, and what stopped it from working?`,
        `If you had to prioritise one area within ${results.primaryConstraintLabel}, where would you start?`,
        `What does your ideal state look like 12 months from now across this dimension?`
      ]
    };
  }
}
