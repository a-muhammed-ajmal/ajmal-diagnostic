import { renderToStaticMarkup } from 'react-dom/server';
import { FdiReportEmail } from './FdiReport';
import type { FounderFdiReport } from '@/lib/fdi/public-report';

const report: FounderFdiReport = {
  instrument: 'FDI',
  sessionId: 'session',
  completedAt: '2026-08-15T00:00:00.000Z',
  versions: { instrument: 'FDI', diagnostic: 'FDI-1.0', questionSet: 'FDI-QS-1.0', scoringModel: 'FDI-SM-1.0', bandConfig: 'FDI-BC-1.0' },
  index: { unrounded: 50, display: 50, scaleMax: 100, band: { key: 'high', label: 'High Founder Dependency', displayRange: '50–74' }, presentation: 'Founder Dependency Index: 50 / 100 — High Founder Dependency' },
  components: [
    { key: 'DS', label: 'Decision Speed', raw: 6, rawMax: 12, unrounded: 50, display: 50, alert: false },
    { key: 'EC', label: 'Execution Consistency', raw: 6, rawMax: 12, unrounded: 50, display: 50, alert: false },
    { key: 'OV', label: 'Operational Visibility', raw: 6, rawMax: 12, unrounded: 50, display: 50, alert: false },
  ],
  alerts: [],
  concentration: { componentKeys: ['DS', 'EC', 'OV'], labels: ['Decision Speed', 'Execution Consistency', 'Operational Visibility'], raw: 6, unrounded: 50, display: 50 },
  observations: ['Work regularly waits for decisions that depend on you.'],
  limitation: 'This result is based on founder self-report.',
  nextStep: { label: 'Audit', href: 'https://calendly.com/ajmalconsults/free-business-clarity-consultation' },
};

it('renders only deterministic founder content', () => {
  const html = renderToStaticMarkup(FdiReportEmail({
    name: 'Ajmal Test', companyName: 'Test Co', report, calendlyLink: report.nextStep.href,
  }));

  expect(html).toContain('Founder Dependency Index');
  expect(html).toContain('Work regularly waits for decisions that depend on you.');
  expect(html).toContain('Discuss a Business Clarity Audit');
  expect(html).toContain(report.nextStep.href);
  expect(html).not.toContain('Discuss an Audit');
  expect(html).not.toContain('qualified_primary');
  expect(html).not.toContain('AI-generated');
});
