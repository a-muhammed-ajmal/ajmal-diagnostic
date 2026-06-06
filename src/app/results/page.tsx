'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { DiagnosticResult, LeadData } from '@/types';
import { DIMENSION_META } from '@/lib/scoring';

type StoredDiagnosticResults = {
  results: DiagnosticResult;
  leadData?: LeadData;
};

function isStoredDiagnosticResults(value: unknown): value is StoredDiagnosticResults {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StoredDiagnosticResults>;
  return (
    !!candidate.results &&
    Array.isArray(candidate.results.dimensions) &&
    typeof candidate.results.totalScore === 'number' &&
    typeof candidate.results.primaryConstraint === 'string'
  );
}

let cachedRawResults: string | null = null;
let cachedStoredResults: StoredDiagnosticResults | null = null;

function readStoredResults(): StoredDiagnosticResults | null {
  const rawResults = window.sessionStorage.getItem('diagnosticResults');
  if (rawResults === cachedRawResults) return cachedStoredResults;
  cachedRawResults = rawResults;
  cachedStoredResults = null;
  if (!rawResults) return cachedStoredResults;
  try {
    const parsedResults: unknown = JSON.parse(rawResults);
    if (isStoredDiagnosticResults(parsedResults)) {
      cachedStoredResults = parsedResults;
    }
  } catch {
    cachedStoredResults = null;
  }
  return cachedStoredResults;
}

function subscribeToSessionStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

function subscribeToHydration() {
  return () => undefined;
}

const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;
const getEmptyResultsSnapshot = () => null;

export default function ResultsPage() {
  const hasLoaded = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot
  );
  const storedResults = useSyncExternalStore(
    subscribeToSessionStorage,
    readStoredResults,
    getEmptyResultsSnapshot
  );

  if (!hasLoaded) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center">
          <p className="text-sm font-medium text-slate-500">Loading your results...</p>
        </div>
      </main>
    );
  }

  if (!storedResults) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">No results found</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Complete the diagnostic first</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Your report is created after you answer the diagnostic questions and submit your details.
          </p>
          <Link
            href="/diagnostic"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Start diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const { results, leadData } = storedResults;
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const firstName = leadData?.name?.split(' ')[0] ?? 'there';

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '971527218844';
  const whatsappMessage = encodeURIComponent(
    `Hi Muhammed, I just completed the Business Constraint Diagnostic. My primary constraint is ${results.primaryConstraintLabel}. I'd like to discuss my results.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ??
    'https://calendly.com/ajmalconsults/free-business-clarity-consultation';

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-2">
            Business Constraint Diagnosis
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {firstName}, here is your diagnosis.
          </h1>
          {leadData?.email && (
            <p className="text-gray-500 text-sm">
              Your report has been emailed to {leadData.email}
            </p>
          )}
        </div>

        {/* Primary Constraint Card */}
        <div className="bg-[#1e3a5f] text-white rounded-2xl p-8 mb-6 shadow-lg">
          <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-2">
            PRIMARY GROWTH CONSTRAINT IDENTIFIED
          </p>
          <h2 className="text-3xl font-bold mb-4">{results.primaryConstraintLabel}</h2>
          <p className="text-blue-100 leading-relaxed">{primaryMeta.constraintExplanation}</p>
        </div>

        {/* Impact Statement */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-amber-800 italic leading-relaxed">
            &ldquo;{primaryMeta.impactStatement}&rdquo;
          </p>
        </div>

        {/* Dimension Scores */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4">
            Your Scores Across All 5 Dimensions
          </h3>
          <div className="space-y-4">
            {results.dimensions.map(dim => (
              <div key={dim.key}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium text-sm ${dim.key === results.primaryConstraint ? 'text-red-600' : 'text-gray-700'}`}>
                    {dim.label}
                    {dim.key === results.primaryConstraint && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Primary Constraint
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-bold text-gray-600">{dim.score}/6</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${dim.percentage}%`, backgroundColor: dim.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honesty Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong className="text-gray-800">An important distinction:</strong> We can identify
            your constraint category from 10 questions. We cannot tell you the root cause within
            it — that is what the paid diagnostic is designed to uncover. This distinction is not
            a limitation — it is the most honest thing we can offer you at this stage.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            You&apos;ve named your constraint. Now let&apos;s find the root cause.
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Book a free 1-hour Business Clarity Session to walk through your findings personally.
            This is not a sales call — it is the natural next step the tool just helped you identify.
          </p>

          {/* Primary CTA — Calendly */}
          
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition-colors mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Your Free Business Clarity Session (1 Hour)
          </a>

          {/* Secondary CTA — WhatsApp */}
          
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-green-500 transition-colors mb-4"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message Me on WhatsApp
          </a>

          <p className="text-gray-400 text-xs">
            Not ready to book a call? WhatsApp is faster — your constraint is pre-filled in the message.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Muhammed Ajmal · Dubai, UAE · Available remotely across the GCC
          </p>
        </div>

      </div>
    </main>
  );
}