import { notFound } from 'next/navigation';
import { FdiDiagnosticFlow } from '@/components/fdi/FdiDiagnosticFlow';
import { isFdiEnabled } from '@/lib/featureFlags';

export default function FdiDiagnosticPage() {
  if (!isFdiEnabled()) notFound();
  return <FdiDiagnosticFlow />;
}
