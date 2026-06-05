export type DimensionKey =
  | 'strategic_clarity'
  | 'financial_visibility'
  | 'operations'
  | 'people_leadership'
  | 'sales_growth';

export interface QuizOption {
  id: string;
  text: string;
  score: number; // 0, 1, 2, or 3
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

export interface DiagnosticResult {
  answers: Record<number, string>;
  dimensions: DimensionScore[];
  totalScore: number;
  maxPossibleScore: number;
  primaryConstraint: DimensionKey;
  primaryConstraintLabel: string;
}

export interface LeadData {
  name: string;
  email: string;
  companyName: string;
  revenueRange: string;
}
