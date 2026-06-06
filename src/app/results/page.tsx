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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading your results...</p>
      </main>
    );
  }

  if (!storedResults) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-3">
            No results found
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete the diagnostic first
          </h1>
          <p className="text-gray-600 mb-8">
            Your report is created after you answer the diagnostic questions and submit your details.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Start the Diagnostic
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
    `Hi Muhammed, I just completed the Business Constraint Diagnostic. My primary constraint is ${results.primaryConstraintLabel}. I would like to discuss my results.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ??
    'https://calendly.com/ajmalconsults/free-business-clarity-consultation';

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-blue-600 font-semibold tracking-widest text-xs uppercase mb-2">
            Business Constraint Diagnosis
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {firstName}, here is your diagnosis.
          </h1>
          {leadData?.email && (
            <p className="text-gray-500 text-sm">
              Your full report has been emailed to {leadData.email}
            </p>
          )}
        </div>

        {/* Primary Constraint Card */}
        <div className="bg-[#1e3a5f] text-white rounded-2xl p-8 shadow-lg">
          <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-3">
            Primary Growth Constraint Identified
          </p>
          <h2 className="text-3xl font-bold mb-4">
            {results.primaryConstraintLabel}
          </h2>
          <p className="text-blue-100 leading-relaxed text-sm">
            {primaryMeta.constraintExplanation}
          </p>
        </div>

        {/* Impact Statement */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-amber-800 italic leading-relaxed text-sm">
            &ldquo;{primaryMeta.impactStatement}&rdquo;
          </p>
        </div>

        {/* Dimension Scores */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-5">
            Your Scores Across All 5 Dimensions
          </h3>
          <div className="space-y-5">
            {results.dimensions.map(dim => (
              <div key={dim.key}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${dim.key === results.primaryConstraint ? 'text-red-600' : 'text-gray-700'}`}>
                      {dim.label}
                    </span>
                    {dim.key === results.primaryConstraint && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        Primary Constraint
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-600 ml-2">
                    {dim.score}/6
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{
                      width: `${dim.percentage}%`,
                      backgroundColor: dim.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4">
            3 Prioritised Directions for {results.primaryConstraintLabel}
          </h3>
          <div className="space-y-3">
            {primaryMeta.actionDirections.map((direction, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{direction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Honesty Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong className="text-gray-800">An important distinction:</strong> This tool
            has identified your constraint category — not the root cause within it.
            Understanding exactly why this constraint exists in your specific business is
            what the paid diagnostic is designed to uncover. That distinction matters.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            You&apos;ve named your constraint. Now let&apos;s find the root cause.
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm">
            Book a free 1-hour Business Clarity Session to walk through your findings
            personally. This is not a sales call — it is the natural next step the tool
            just helped you identify.
          </p>

          
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-[#1e3a5f] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition-colors mb-3"
          >
            📅 Book Your Free Business Clarity Session (1 Hour)
          </a>

          
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-green-500 transition-colors mb-4"
          >
            💬 Message Me on WhatsApp
          </a>

          <p className="text-gray-400 text-xs">
            Not ready to book? WhatsApp is faster — your constraint is pre-filled in the message.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Muhammed Ajmal · Dubai, UAE · Available remotely across the GCC
          </p>
        </div>

      </div>
    </main>
  );
}