import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { toFounderFdiReport } from './public-report';
import { evaluateQualification } from './qualification';
import { buildReport } from './report';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';

it('removes consultant-only qualification and AI from the founder payload', () => {
  const scored = scoreFdi({
    diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion,
    answers: answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, { DS: 6, EC: 6, OV: 6 }),
  }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);
  if (!scored.ok) throw new Error('unexpected rejection');
  const report = buildReport(scored.result, FDI_1_0_CONFIG, {
    sessionId: 'session',
    completedAt: '2026-08-15T00:00:00.000Z',
    qualification: evaluateQualification({
      annualRevenue: 'aed_1m_to_10m', employeeCount: 'employees_5_to_50',
      operatingYears: 'years_3_or_more', sector: 'real_estate_business_services',
    }),
    ai: { internalOnly: true },
  });

  expect(toFounderFdiReport(report)).not.toHaveProperty('qualification');
  expect(toFounderFdiReport(report)).not.toHaveProperty('ai');
});
