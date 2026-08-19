import { IndexBandMeter } from "ajmal-diagnostic";

// Shows the Founder Dependency Index scale (Critical 0-39 / Developing 40-69 /
// Progressing 70-100) without a reading on it — the bands are the product's own
// defined values; a needle position here would be an invented metric.

/** The FDI band scale, unpopulated. */
export function Default() {
  return <IndexBandMeter />;
}
