import { notFound } from 'next/navigation';
import { FdiResults } from '@/components/fdi/FdiResults';
import { isFdiEnabled } from '@/lib/featureFlags';

export default function FdiResultsPage() {
  if (!isFdiEnabled()) notFound();
  return <FdiResults />;
}
