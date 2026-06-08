export type DimensionKey =
  | 'strategic_clarity'
  | 'financial_visibility'
  | 'operations'
  | 'people_leadership'
  | 'sales_growth';

export type SeverityLabel = 'Critical' | 'Developing' | 'Progressing';

export interface QuizOption {
  id: string;
  text: string;
  score: number;
}

export interface Question {
  id: number;
  dimension: DimensionKey;
  text: string;
  options: QuizOption[];
}

export interface DimensionScore {
  key: DimensionKey;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
  color: string;
}

export interface AIActionPlan {
  thirtyDayPriorities: string[];
  ninetyDayDirections: string[];
  discussionQuestions: string[];
}

export interface DiagnosticResult {
  answers: Record<number, string>;
  dimensions: DimensionScore[];
  totalScore: number;
  maxPossibleScore: number;
  healthScore: number;
  severityLabel: SeverityLabel;
  primaryConstraint: DimensionKey;
  primaryConstraintLabel: string;
  secondaryConstraint: DimensionKey;
  secondaryConstraintLabel: string;
  aiPlan?: AIActionPlan;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  industry?: string;
  teamSize?: string;
  revenueRange?: string;
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string;
  industry: string | null;
  team_size: string | null;
  revenue_range: string;
  health_score: number | null;
  severity_label: string | null;
  primary_constraint: string | null;
  secondary_constraint: string | null;
  total_score: number | null;
  score_strategic_clarity: number | null;
  score_financial_visibility: number | null;
  score_operations: number | null;
  score_people_leadership: number | null;
  score_sales_growth: number | null;
  ai_plan_generated: boolean;
  ai_30day_plan: string | null;
  ai_90day_plan: string | null;
  ai_discussion_questions: string | null;
  email_sent: boolean;
  booked_call: boolean;
  contacted: boolean;
}
