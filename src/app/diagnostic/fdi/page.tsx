import { permanentRedirect } from 'next/navigation';

/** Historic FDI alias; the public Business Health Check lives at /diagnostic. */
export default function FdiDiagnosticAliasPage() {
  permanentRedirect('/diagnostic');
}
