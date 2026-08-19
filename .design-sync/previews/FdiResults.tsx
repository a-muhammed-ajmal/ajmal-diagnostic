import { FdiResults } from "ajmal-diagnostic";
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from "@/lib/fdi/config/index";
import { answersForRaw } from "@/lib/fdi/test-support";
import { scoreFdi } from "@/lib/fdi/score";
import { buildReport } from "@/lib/fdi/report";
import { toFounderFdiReport } from "@/lib/fdi/public-report";
import { evaluateQualification } from "@/lib/fdi/qualification";

// FdiResults reads its report from sessionStorage. Rather than hand-write a
// report object — which would put invented scores on screen — this seeds the
// store by running the product's OWN scoring pipeline over a declared answer
// profile. Every number the card shows is therefore a genuine output of
// scoreFdi/buildReport for those inputs, not a plausible-looking placeholder.
// The raw target {DS:6, EC:6, OV:6} is the one the repo's own
// public-report.test.ts uses. NOTE the explicit /index on the config import:
// design-sync's tsconfig paths plugin resolves a bare directory path before it
// tries /index.ts, and esbuild then fails on the directory.
function seed() {
  if (typeof window === "undefined") return;
  const scored = scoreFdi(
    {
      diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion,
      answers: answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, { DS: 6, EC: 6, OV: 6 }),
    },
    FDI_1_0_CONFIG,
    FDI_1_0_QUESTIONS,
  );
  if (!scored.ok) return;
  const report = buildReport(scored.result, FDI_1_0_CONFIG, {
    sessionId: "design-system-preview",
    completedAt: "2026-01-01T00:00:00.000Z",
    qualification: evaluateQualification({
      annualRevenue: "aed_1m_to_10m",
      employeeCount: "employees_5_to_50",
      operatingYears: "years_3_or_more",
      sector: "real_estate_business_services",
    }),
    ai: { internalOnly: true },
  });
  sessionStorage.setItem("fdiFounderReport", JSON.stringify(toFounderFdiReport(report)));
}
seed();

/** The founder-facing result screen, computed by the real scoring engine. */
export function Report() {
  return <FdiResults />;
}
