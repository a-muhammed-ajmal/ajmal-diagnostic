import { QUESTIONS } from './questions';
import { DimensionKey, DimensionScore, DiagnosticResult, SeverityLabel } from '@/types';

export const DIMENSION_META: Record<DimensionKey, {
  label: string;
  description: string;
  color: string;
  constraintExplanation: string;
  secondaryExplanation: string;
  impactStatement: string;
  actionDirections: string[];
}> = {
  strategic_clarity: {
    label: "Strategic Clarity",
    description: "The degree to which your business operates with a defined direction, documented priorities, and data-informed decision-making.",
    color: "#2563EB",
    constraintExplanation: "Your biggest constraint right now is strategic clarity. Without a documented strategy and defined decision-making criteria, your team cannot execute consistently, priorities shift with whoever speaks loudest, and growth depends entirely on your personal judgment every single day. Every operational problem downstream is harder to solve when the direction at the top is ambiguous.",
    secondaryExplanation: "Strategic clarity is a secondary constraint in your business. While you have addressed more pressing bottlenecks, the absence of a fully documented strategic framework creates friction in decision-making and slows execution as you scale.",
    impactStatement: "Businesses operating without documented strategy typically spend 30–40% of leadership time re-making decisions that should have been settled by clear strategic frameworks.",
    actionDirections: [
      "Document your 12-month strategy in one page — target market, 3 key objectives, 3 metrics that define success",
      "Create a decision-making framework: what gets decided by whom, under what criteria, at what threshold",
      "Establish a quarterly strategic review rhythm so direction is tested against market reality regularly"
    ]
  },
  financial_visibility: {
    label: "Financial Visibility",
    description: "Your ability to see, understand, and act on financial data — margins, cash flow, and profitability — in real time.",
    color: "#059669",
    constraintExplanation: "Your biggest constraint right now is financial visibility. Without clear margin data, rolling cash flow forecasts, and financial tracking by service line, you are navigating your business without instruments. Pricing decisions, hiring decisions, and growth investments all carry unnecessary risk when financial clarity is missing.",
    secondaryExplanation: "Financial visibility is a secondary constraint in your business. You have more urgent bottlenecks to address first, but gaps in your financial tracking are creating background risk — particularly in cash flow forecasting and service-line profitability.",
    impactStatement: "Founder-led businesses with poor financial visibility are 3x more likely to experience cash flow crises that stall or reverse growth momentum, even when revenue is increasing.",
    actionDirections: [
      "Build a simple P&L by service line — even a spreadsheet that shows revenue, direct costs, and gross margin per offer",
      "Implement a rolling 90-day cash flow forecast, updated monthly",
      "Set up one accounting system (Xero or QuickBooks) and commit to a monthly financial review ritual"
    ]
  },
  operations: {
    label: "Operations & Execution",
    description: "How consistently, reliably, and independently your business delivers outcomes — without depending on specific individuals.",
    color: "#7C3AED",
    constraintExplanation: "Your biggest constraint right now is operational systems. Without documented processes, SOPs, and quality standards, your business cannot scale — every new hire starts from scratch, quality depends on who's involved, and your capacity to deliver is capped by the people currently in the building.",
    secondaryExplanation: "Operational systems are a secondary constraint in your business. While your primary bottleneck demands immediate attention, the absence of fully documented processes means your delivery quality is more variable than it should be — and will become a harder problem as you grow.",
    impactStatement: "Operationally undocumented businesses typically lose 20–35% of their productive capacity to rework, re-explanation, and quality inconsistency as they attempt to scale.",
    actionDirections: [
      "Identify your 5 most critical, repeated processes and document them as SOPs this month",
      "Create a simple quality checklist for each service delivery — what does done correctly look like?",
      "Map your current workflows to identify the top 3 bottlenecks consuming the most time"
    ]
  },
  people_leadership: {
    label: "People & Leadership",
    description: "How clearly defined, accountable, and independently capable your team is — and how much depends on you personally.",
    color: "#D97706",
    constraintExplanation: "Your biggest constraint right now is people and leadership infrastructure. When roles lack clear KPIs, performance is not formally tracked, and all issues escalate to you, the business can only grow as fast as you personally can handle. Your capacity becomes the ceiling of the entire organization.",
    secondaryExplanation: "People and leadership infrastructure is a secondary constraint in your business. Roles and performance systems need strengthening, but there is a more pressing bottleneck to address first. As that primary issue resolves, the leadership layer will become the next clear focus.",
    impactStatement: "Founder-dependent businesses where issues consistently escalate to the owner spend an average of 60–70% of the founder's time on operational decisions that should be handled at the team level.",
    actionDirections: [
      "Create a role scorecard for each key team member: responsibilities, 3–5 KPIs, and decision authority",
      "Establish a weekly 1:1 rhythm with direct reports focused on progress, blockers, and coaching",
      "Define clear escalation rules — what decisions belong to which role, and what triggers upward escalation"
    ]
  },
  sales_growth: {
    label: "Sales & Growth Engine",
    description: "How predictable, systematized, and independently operating your revenue generation and lead pipeline are.",
    color: "#DC2626",
    constraintExplanation: "Your biggest constraint right now is your sales and growth engine. When revenue depends on your personal relationships, pipeline visibility is low, and lead generation is inconsistent, growth is unpredictable and vulnerable. Every month starts without clarity on where revenue will come from.",
    secondaryExplanation: "Your sales and growth engine is a secondary constraint in your business. Revenue predictability has gaps that will limit scaling, but your primary bottleneck must be addressed first — it is likely making the sales problem worse by consuming time that should go toward growth.",
    impactStatement: "Businesses without a documented sales process and lead generation system experience 40–60% higher revenue volatility than those with even a basic systematized pipeline.",
    actionDirections: [
      "Map your current sales process end-to-end and identify where leads drop off or slow down",
      "Implement a simple CRM (even Notion-based) to track your pipeline with stages and expected close dates",
      "Document your top 2 lead generation channels and create a 30-day activation plan for each"
    ]
  }
};

function getSeverityLabel(healthScore: number): SeverityLabel {
  if (healthScore <= 39) return 'Critical';
  if (healthScore <= 69) return 'Developing';
  return 'Progressing';
}

export function calculateResults(answers: Record<number, string>): DiagnosticResult {
  const dimensionScores: Record<DimensionKey, number> = {
    strategic_clarity: 0,
    financial_visibility: 0,
    operations: 0,
    people_leadership: 0,
    sales_growth: 0
  };

  QUESTIONS.forEach(question => {
    const answerId = answers[question.id];
    if (answerId) {
      const option = question.options.find(o => o.id === answerId);
      if (option) {
        dimensionScores[question.dimension] += option.score;
      }
    }
  });

  const dimensions: DimensionScore[] = (Object.keys(dimensionScores) as DimensionKey[]).map(key => ({
    key,
    label: DIMENSION_META[key].label,
    score: dimensionScores[key],
    maxScore: 6,
    percentage: Math.round((dimensionScores[key] / 6) * 100),
    description: DIMENSION_META[key].description,
    color: DIMENSION_META[key].color
  }));

  const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0);
  const healthScore = Math.round((totalScore / 30) * 100);
  const severityLabel = getSeverityLabel(healthScore);

  const sortedByScore = [...dimensions].sort((a, b) => a.score - b.score);
  const primaryDimension = sortedByScore[0];
  const secondaryDimension = sortedByScore[1];

  return {
    answers,
    dimensions,
    totalScore,
    maxPossibleScore: 30,
    healthScore,
    severityLabel,
    primaryConstraint: primaryDimension.key,
    primaryConstraintLabel: primaryDimension.label,
    secondaryConstraint: secondaryDimension.key,
    secondaryConstraintLabel: secondaryDimension.label,
  };
}
