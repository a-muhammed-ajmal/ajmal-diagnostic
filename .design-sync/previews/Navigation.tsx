import { Navigation } from "ajmal-diagnostic";

// Renders the real site header. next/navigation is aliased to a preview shim
// that reports "/" as the pathname, so this is the home-active state.

/** The site header: brand lockup, primary nav, and the diagnostic CTA. */
export function Default() {
  return <Navigation />;
}
