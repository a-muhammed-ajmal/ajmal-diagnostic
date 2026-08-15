import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Founder Dependency Index | Free Business Diagnostic',
  absoluteTitle: true,
  description: 'A free 12-question Founder Dependency Index for founder-led UAE SMEs. Review decision speed, execution consistency, and operational visibility.',
  path: '/diagnostic',
});

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
