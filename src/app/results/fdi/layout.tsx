import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Founder Dependency Index result',
  description: 'Your private Founder Dependency Index result.',
  path: '/results/fdi',
  index: false,
});

export default function FdiResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
