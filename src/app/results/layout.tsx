import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Your Founder Dependency Index',
  description: 'Your private Business Health Check result.',
  path: '/results',
  index: false, // Per-user results — not for indexing.
});

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
