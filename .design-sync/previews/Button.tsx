import type { CSSProperties } from "react";
import { Button } from "ajmal-diagnostic";

// Layout glue is inline-styled on purpose: the bundle's stylesheet is compiled
// by scanning src/, so a Tailwind utility used only here might not exist in it.
// Everything that should carry brand styling is a real DS component.
const row: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" };
const stack: CSSProperties = { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px" };

/** The five fills. `accent` is amber-on-slate — the one place amber is a fill. */
export function Variants() {
  return (
    <div style={row}>
      <Button variant="primary">Start the Check</Button>
      <Button variant="secondary">Book a Call</Button>
      <Button variant="quiet">Read the Method</Button>
      <Button variant="accent">Get the Report</Button>
      <Button variant="danger">Delete Lead</Button>
    </div>
  );
}

/** With `href` it renders an anchor; add `external` for off-site links. */
export function AsLinks() {
  return (
    <div style={row}>
      <Button href="/diagnostic">Start the Business Health Check</Button>
      <Button href="/insights" variant="secondary">Read Insights</Button>
      <Button href="https://calendly.com/" external variant="quiet">Book on Calendly</Button>
    </div>
  );
}

/** Disabled applies to the native button; fullWidth fills its container. */
export function States() {
  return (
    <div style={stack}>
      <Button fullWidth>Send Enquiry</Button>
      <Button fullWidth variant="secondary">Save for Later</Button>
      <Button disabled>Submitting…</Button>
    </div>
  );
}
