'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import type { DiagnosticResult, LeadData } from '@/types';

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

  if (rawResults === cachedRawResults) {
    return cachedStoredResults;
  }

  cachedRawResults = rawResults;
  cachedStoredResults = null;

  if (!rawResults) {
    return cachedStoredResults;
  }

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
  const hasLoaded = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerSnapshot);
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

  return (
    <ResultsDashboard
      results={storedResults.results}
      leadData={storedResults.leadData}
    />
  );
}
