import { LeadCaptureForm } from "ajmal-diagnostic";

// onSubmit and isLoading are required props; the parent flow owns both.
const noop = () => {};

/** The results-gate form, ready for input. */
export function Idle() {
  return <LeadCaptureForm onSubmit={noop} isLoading={false} />;
}

/** Mid-submit: the action is disabled while the lead is written. */
export function Submitting() {
  return <LeadCaptureForm onSubmit={noop} isLoading />;
}
