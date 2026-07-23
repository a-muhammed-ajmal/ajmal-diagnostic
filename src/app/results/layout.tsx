import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Your Diagnostic Results',
  description: 'Your personalised business constraint diagnosis.',
  path: '/results',
  index: false, // Per-user results — not for indexing.
});

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
