// Design-system barrel for design-sync.
//
// This repo is a Next.js application, not a published component library, so
// there is no dist/ entry to bundle. This file is the explicit surface that
// gets shipped to claude.ai/design: the reusable components, and nothing that
// is page-specific, admin-only, or a third-party integration wrapper.
//
// Excluded on purpose (see .design-sync/NOTES.md):
//   FdiTestStatusForm  — admin-only internal tool
//   CalendlyWidget     — loads a third-party script; renders nothing offline
//   FdiDiagnosticFlow  — stateful quiz orchestrator, not a composable part
//
// Keep this list and cfg.componentSrcMap in agreement.

export { Button } from "@/components/ui/Button";
export { Section } from "@/components/ui/Section";
export { PageHero } from "@/components/ui/PageHero";
export { Surface, SectionHeader } from "@/components/ui/Surface";

export { Navigation } from "@/components/layout/Navigation";
export { Footer } from "@/components/layout/Footer";

export { QuestionCard } from "@/components/quiz/QuestionCard";
export { OptionButton } from "@/components/quiz/OptionButton";
export { ProgressBar } from "@/components/quiz/ProgressBar";
export { FdiResults } from "@/components/fdi/FdiResults";

export { GrowthFormulaRail, ArchitectureLadder, IndexBandMeter } from "@/components/home/Graphics";
export {
  FounderSystemVisual,
  FounderTrapDiagram,
  DependencyIndexPreview,
  CommercialLadder,
} from "@/components/home/SystemVisuals";

export { ContactForm } from "@/components/contact/ContactForm";
export { LeadCaptureForm } from "@/components/lead/LeadCaptureForm";
export { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export { ArticleToc } from "@/components/insights/ArticleToc";
