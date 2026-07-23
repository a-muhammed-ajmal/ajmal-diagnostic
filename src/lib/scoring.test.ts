import { calculateResults, DIMENSION_META } from './scoring';
import type { DimensionKey } from '@/types';

// Every question uses the same option→score mapping (verified in questions.ts):
//   a = 3, b = 2, c = 1, d = 0
// Dimensions (2 questions each):
//   strategic_clarity: q1,q2 · financial_visibility: q3,q4 · operations: q5,q6
//   people_leadership: q7,q8 · sales_growth: q9,q10

type OptionId = 'a' | 'b' | 'c' | 'd';

/** Answer every question with the same option. */
function uniformAnswers(option: OptionId): Record<number, string> {
  const answers: Record<number, string> = {};
  for (let id = 1; id <= 10; id++) answers[id] = option;
  return answers;
}

/** Build answers from an explicit per-question option map (unspecified = omitted). */
function answersFrom(map: Partial<Record<number, OptionId>>): Record<number, string> {
  const answers: Record<number, string> = {};
  for (const [id, opt] of Object.entries(map)) answers[Number(id)] = opt as string;
  return answers;
}

describe('calculateResults — totals and health score', () => {
  it('scores a perfect run (all a) as 30/30, 100%, Progressing', () => {
    const r = calculateResults(uniformAnswers('a'));
    expect(r.totalScore).toBe(30);
    expect(r.maxPossibleScore).toBe(30);
    expect(r.healthScore).toBe(100);
    expect(r.severityLabel).toBe('Progressing');
    r.dimensions.forEach((d) => {
      expect(d.score).toBe(6);
      expect(d.percentage).toBe(100);
      expect(d.maxScore).toBe(6);
    });
  });

  it('scores a worst run (all d) as 0/30, 0%, Critical', () => {
    const r = calculateResults(uniformAnswers('d'));
    expect(r.totalScore).toBe(0);
    expect(r.healthScore).toBe(0);
    expect(r.severityLabel).toBe('Critical');
    r.dimensions.forEach((d) => {
      expect(d.score).toBe(0);
      expect(d.percentage).toBe(0);
    });
  });

  it('scores a uniform middle run (all b) as 20/30, 67%, Developing', () => {
    const r = calculateResults(uniformAnswers('b'));
    expect(r.totalScore).toBe(20);
    expect(r.healthScore).toBe(67);
    expect(r.severityLabel).toBe('Developing');
  });

  it('scores all c as 10/30, 33%, Critical', () => {
    const r = calculateResults(uniformAnswers('c'));
    expect(r.totalScore).toBe(10);
    expect(r.healthScore).toBe(33);
    expect(r.severityLabel).toBe('Critical');
  });
});

describe('calculateResults — severity bands and boundaries', () => {
  // healthScore = round(total / 30 * 100).
  const bandFor = (total: number) => calculateResults(totalScoringAnswers(total)).severityLabel;

  it('Critical at the top of its band, Developing just above', () => {
    // total 11 -> 37% (Critical); total 12 -> 40% (Developing)
    expect(calculateResults(totalScoringAnswers(11)).healthScore).toBe(37);
    expect(bandFor(11)).toBe('Critical');
    expect(calculateResults(totalScoringAnswers(12)).healthScore).toBe(40);
    expect(bandFor(12)).toBe('Developing');
  });

  it('Developing at the top of its band, Progressing just above', () => {
    // total 20 -> 67% (Developing); total 21 -> 70% (Progressing)
    expect(calculateResults(totalScoringAnswers(20)).healthScore).toBe(67);
    expect(bandFor(20)).toBe('Developing');
    expect(calculateResults(totalScoringAnswers(21)).healthScore).toBe(70);
    expect(bandFor(21)).toBe('Progressing');
  });
});

describe('calculateResults — primary and secondary constraint', () => {
  it('picks the lowest-scoring dimension as primary, second-lowest as secondary', () => {
    // Make sales_growth clearly worst (both d = 0), people_leadership next (both c = 1),
    // everything else strong (a = 3).
    const r = calculateResults(
      answersFrom({
        1: 'a', 2: 'a', // strategic_clarity = 6
        3: 'a', 4: 'a', // financial_visibility = 6
        5: 'a', 6: 'a', // operations = 6
        7: 'c', 8: 'c', // people_leadership = 2
        9: 'd', 10: 'd', // sales_growth = 0
      }),
    );
    expect(r.primaryConstraint).toBe<DimensionKey>('sales_growth');
    expect(r.primaryConstraintLabel).toBe(DIMENSION_META.sales_growth.label);
    expect(r.secondaryConstraint).toBe<DimensionKey>('people_leadership');
    expect(r.secondaryConstraintLabel).toBe(DIMENSION_META.people_leadership.label);
  });

  it('breaks ties by dimension declaration order (strategic_clarity first)', () => {
    // All dimensions tie at 6. The stable sort keeps object-key order, so
    // strategic_clarity is primary and financial_visibility is secondary.
    const r = calculateResults(uniformAnswers('a'));
    expect(r.primaryConstraint).toBe<DimensionKey>('strategic_clarity');
    expect(r.secondaryConstraint).toBe<DimensionKey>('financial_visibility');
  });
});

describe('calculateResults — percentage rounding', () => {
  it('rounds a 5/6 dimension to 83%', () => {
    // strategic_clarity: a (3) + b (2) = 5 -> round(5/6*100) = 83
    const r = calculateResults(answersFrom({ 1: 'a', 2: 'b' }));
    const sc = r.dimensions.find((d) => d.key === 'strategic_clarity')!;
    expect(sc.score).toBe(5);
    expect(sc.percentage).toBe(83);
  });

  it('rounds a 1/6 dimension to 17%', () => {
    // operations: d (0) + c (1) = 1 -> round(1/6*100) = 17
    const r = calculateResults(answersFrom({ 5: 'd', 6: 'c' }));
    const ops = r.dimensions.find((d) => d.key === 'operations')!;
    expect(ops.score).toBe(1);
    expect(ops.percentage).toBe(17);
  });
});

describe('calculateResults — missing, partial and invalid answers', () => {
  it('treats missing answers as zero contribution', () => {
    // Only answer q1 = a (3). Everything else omitted -> 0.
    const r = calculateResults(answersFrom({ 1: 'a' }));
    expect(r.totalScore).toBe(3);
    const sc = r.dimensions.find((d) => d.key === 'strategic_clarity')!;
    expect(sc.score).toBe(3);
    // A fully-unanswered dimension scores 0.
    const ops = r.dimensions.find((d) => d.key === 'operations')!;
    expect(ops.score).toBe(0);
  });

  it('ignores an answer whose option id does not exist on the question', () => {
    const r = calculateResults({ ...answersFrom({ 2: 'a' }), 1: 'z' });
    // q1 'z' contributes nothing; q2 'a' contributes 3.
    const sc = r.dimensions.find((d) => d.key === 'strategic_clarity')!;
    expect(sc.score).toBe(3);
  });

  it('ignores an answer for a question id that does not exist', () => {
    const r = calculateResults({ ...answersFrom({ 1: 'a' }), 999: 'a' });
    expect(r.totalScore).toBe(3);
  });

  it('returns all five dimensions with an empty answer set', () => {
    const r = calculateResults({});
    expect(r.dimensions).toHaveLength(5);
    expect(r.totalScore).toBe(0);
    expect(r.severityLabel).toBe('Critical');
  });
});

describe('calculateResults — shape and metadata', () => {
  it('carries the answers through and exposes every dimension key', () => {
    const answers = uniformAnswers('a');
    const r = calculateResults(answers);
    expect(r.answers).toBe(answers);
    const keys = r.dimensions.map((d) => d.key).sort();
    expect(keys).toEqual(
      ['financial_visibility', 'operations', 'people_leadership', 'sales_growth', 'strategic_clarity'].sort(),
    );
    r.dimensions.forEach((d) => {
      expect(d.label).toBe(DIMENSION_META[d.key].label);
      expect(d.color).toBe(DIMENSION_META[d.key].color);
    });
  });
});

/**
 * Build an answer set that sums to an exact total, using q1 as the variable and
 * filling the rest with 'd' (0). Each question can contribute 0–3, and with ten
 * questions any total in 0..30 is reachable; we only need totals up to 21 here.
 */
function totalScoringAnswers(total: number): Record<number, string> {
  if (total < 0 || total > 30) throw new Error('total out of range');
  const perQuestion: OptionId[] = ['d', 'c', 'b', 'a']; // 0,1,2,3
  const answers: Record<number, string> = {};
  let remaining = total;
  for (let id = 1; id <= 10; id++) {
    const give = Math.min(3, remaining);
    answers[id] = perQuestion[give];
    remaining -= give;
  }
  return answers;
}
