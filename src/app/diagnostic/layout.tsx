import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Free Business Diagnostic | Find Your Growth Constraint',
  absoluteTitle: true,
  description: 'A free 4-minute diagnostic for founder-led SMEs. Answer 10 questions to identify your primary growth constraint and receive a personalised AI action plan by email.',
  path: '/diagnostic',
});

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
