import { IndexBandMeter } from "ajmal-diagnostic";

// Shows the Founder Dependency Index scale without a reading on it. The four
// bands are defined in PRODUCT §A6; a needle position here would be an
// invented metric.

/** The FDI band scale, unpopulated. */
export function Default() {
  return <IndexBandMeter />;
}
