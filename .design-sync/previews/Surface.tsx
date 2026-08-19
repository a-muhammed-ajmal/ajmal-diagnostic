import type { CSSProperties } from "react";
import { Surface, SectionHeader, Button } from "ajmal-diagnostic";

const grid: CSSProperties = { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" };
// glass only reads against something behind it — the tint band is where it lives on the site.
const tintBed: CSSProperties = { background: "var(--color-brand-tint)", padding: "24px", borderRadius: "16px" };

/** The four tones. `default` is the workhorse card; `glass` carries its own border and shadow. */
export function Tones() {
  return (
    <div style={grid}>
      <Surface>
        <SectionHeader eyebrow="Default" title="White card" description="Hairline border and a shadow-1 lift." />
      </Surface>
      <Surface tone="muted">
        <SectionHeader eyebrow="Muted" title="Brand tint" description="For grouping without introducing a new band." />
      </Surface>
      <Surface tone="accent">
        <SectionHeader eyebrow="Accent" title="Soft blue" description="Draws the eye to one card in a set." />
      </Surface>
      <div style={tintBed}>
        <Surface tone="glass">
          <SectionHeader eyebrow="Glass" title="Glass panel" description="Translucent, blurred, hairline border." />
        </Surface>
      </div>
    </div>
  );
}

/** `interactive` adds the hover lift, shadow step and brand border. */
export function Interactive() {
  return (
    <div style={grid}>
      <Surface interactive>
        <SectionHeader
          eyebrow="Business Health Check"
          title="Free founder-dependency self-report"
          description="Twelve questions across decision speed, execution consistency and operational visibility."
        />
        <div style={{ marginTop: "20px" }}>
          <Button href="/diagnostic" variant="secondary">Start the check</Button>
        </div>
      </Surface>
      <Surface interactive>
        <SectionHeader
          eyebrow="Business Clarity Audit"
          title="Evidence, not recollection"
          description="Establishes where dependency actually originates before any build work begins."
        />
        <div style={{ marginTop: "20px" }}>
          <Button href="/services" variant="secondary">See the method</Button>
        </div>
      </Surface>
    </div>
  );
}
