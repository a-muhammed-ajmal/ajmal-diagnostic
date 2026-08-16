import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Business Health Check | Free Founder Dependency Index',
  absoluteTitle: true,
  description: 'A free 12-question founder-dependency self-report for founder-led UAE SMEs. Receive your Founder Dependency Index across decision speed, execution consistency, and operational visibility.',
  path: '/diagnostic',
});

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
