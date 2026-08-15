import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Founder Dependency Index',
  description: 'A private Founder Dependency Index diagnostic.',
  path: '/diagnostic/fdi',
  index: false,
});

export default function FdiDiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
