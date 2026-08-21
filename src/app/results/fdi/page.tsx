import { permanentRedirect } from 'next/navigation';

/** Historic FDI alias; the browser-private result lives at /results. */
export default function FdiResultsAliasPage() {
  permanentRedirect('/results');
}
