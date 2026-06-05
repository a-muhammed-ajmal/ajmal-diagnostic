import { Question } from '@/types';

export const QUESTIONS: Question[] = [
  // DIMENSION 1: STRATEGIC CLARITY
  {
    id: 1,
    dimension: 'strategic_clarity',
    text: "When someone asks where your business will be in 3 years, which best describes your answer?",
    options: [
      { id: 'a', text: "I have a documented strategy with specific milestones and quarterly targets.", score: 3 },
      { id: 'b', text: "I have a clear general direction, but it's not formally documented.", score: 2 },
      { id: 'c', text: "We adapt as we go — the market changes too fast for fixed plans.", score: 1 },
      { id: 'd', text: "I haven't had time to think clearly beyond the current quarter.", score: 0 }
    ]
  },
  {
    id: 2,
    dimension: 'strategic_clarity',
    text: "When you make major business decisions, what drives them?",
    options: [
      { id: 'a', text: "Defined criteria, relevant data, and alignment with our strategic priorities.", score: 3 },
      { id: 'b', text: "Experience and judgment — usually directionally correct but informal.", score: 2 },
      { id: 'c', text: "Whoever raised the issue most urgently or most recently.", score: 1 },
      { id: 'd', text: "I make most decisions alone and quickly — there's no real process.", score: 0 }
    ]
  },

  // DIMENSION 2: FINANCIAL VISIBILITY
  {
    id: 3,
    dimension: 'financial_visibility',
    text: "Right now, how clearly can you answer: 'What is your gross margin by service line?'",
    options: [
      { id: 'a', text: "Precisely — it's tracked, broken down by service, and reviewed monthly.", score: 3 },
      { id: 'b', text: "Roughly — I have estimates but not detailed breakdowns.", score: 2 },
      { id: 'c', text: "I know the overall number but not how it splits across services.", score: 1 },
      { id: 'd', text: "I'm not confident I could answer that accurately today.", score: 0 }
    ]
  },
  {
    id: 4,
    dimension: 'financial_visibility',
    text: "How do you currently manage cash flow in your business?",
    options: [
      { id: 'a', text: "Rolling 90-day forecast with a defined buffer strategy and reserves.", score: 3 },
      { id: 'b', text: "I review balances regularly and plan roughly 30 days ahead.", score: 2 },
      { id: 'c', text: "Reactively — I check when something comes up or feels tight.", score: 1 },
      { id: 'd', text: "It's a persistent challenge — cash flow regularly catches me by surprise.", score: 0 }
    ]
  },

  // DIMENSION 3: OPERATIONS & EXECUTION
  {
    id: 5,
    dimension: 'operations',
    text: "If a key team member left tomorrow, what would happen to their responsibilities?",
    options: [
      { id: 'a', text: "Documented SOPs and handover plans mean someone could step in within days.", score: 3 },
      { id: 'b', text: "There would be disruption, but we could recover within a few weeks.", score: 2 },
      { id: 'c', text: "It would significantly impact our delivery quality for months.", score: 1 },
      { id: 'd', text: "The business would struggle — too much critical knowledge lives in individuals' heads.", score: 0 }
    ]
  },
  {
    id: 6,
    dimension: 'operations',
    text: "How would you describe your current operational consistency?",
    options: [
      { id: 'a', text: "Highly predictable — the same processes produce reliable outcomes every time.", score: 3 },
      { id: 'b', text: "Generally consistent, with occasional quality gaps we work to close.", score: 2 },
      { id: 'c', text: "Variable — results depend heavily on who's involved in delivery.", score: 1 },
      { id: 'd', text: "Firefighting is the norm — we're reactive rather than systematic.", score: 0 }
    ]
  },

  // DIMENSION 4: PEOPLE & LEADERSHIP
  {
    id: 7,
    dimension: 'people_leadership',
    text: "How clearly do your team members understand what success looks like in their roles?",
    options: [
      { id: 'a', text: "Every role has documented KPIs, role scorecards, and structured performance reviews.", score: 3 },
      { id: 'b', text: "Most people know what's expected, but tracking is largely informal.", score: 2 },
      { id: 'c', text: "Expectations exist but aren't consistently measured or discussed.", score: 1 },
      { id: 'd', text: "It's mostly assumed — we haven't formally defined this yet.", score: 0 }
    ]
  },
  {
    id: 8,
    dimension: 'people_leadership',
    text: "When something goes wrong operationally, what typically happens?",
    options: [
      { id: 'a', text: "Clear escalation protocols — issues are identified and resolved without reaching me.", score: 3 },
      { id: 'b', text: "The team attempts resolution first, then escalates with context if needed.", score: 2 },
      { id: 'c', text: "Most issues eventually reach me, even when they shouldn't need to.", score: 1 },
      { id: 'd', text: "Everything escalates to me — I'm the single point of resolution for almost everything.", score: 0 }
    ]
  },

  // DIMENSION 5: SALES & GROWTH ENGINE
  {
    id: 9,
    dimension: 'sales_growth',
    text: "How predictable is your revenue over the next 90 days?",
    options: [
      { id: 'a', text: "Highly predictable — pipeline visibility and conversion data guide our forecasts.", score: 3 },
      { id: 'b', text: "Reasonably confident based on patterns, but no formal forecasting system.", score: 2 },
      { id: 'c', text: "Uncertain — revenue depends largely on whoever I'm currently speaking to.", score: 1 },
      { id: 'd', text: "I genuinely don't know — there are too many variables and no real visibility.", score: 0 }
    ]
  },
  {
    id: 10,
    dimension: 'sales_growth',
    text: "What drives most of your new business?",
    options: [
      { id: 'a', text: "A documented lead generation system with multiple consistent, active channels.", score: 3 },
      { id: 'b', text: "Referrals plus some outbound — mostly relationship-driven but not systematized.", score: 2 },
      { id: 'c', text: "Primarily my personal network — entirely dependent on my activity.", score: 1 },
      { id: 'd', text: "Mostly reactive — leads arrive irregularly and unpredictably.", score: 0 }
    ]
  }
];
