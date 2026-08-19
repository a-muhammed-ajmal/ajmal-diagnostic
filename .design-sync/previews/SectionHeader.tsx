import type { CSSProperties } from "react";
import { SectionHeader } from "ajmal-diagnostic";

const stack: CSSProperties = { display: "flex", flexDirection: "column", gap: "40px" };

// SectionHeader is light-ground only: the title uses text-ink and the eyebrow a
// blue/amber/red ink token. On a dark band compose the inverted markup instead
// (see the Section component's DarkBand cell).

/** Eyebrow, title, description — the standard section opener. Left is the house default. */
export function Default() {
  return (
    <SectionHeader
      eyebrow="How it works"
      title="Three stages, in the order that actually works"
      description="Diagnose where the business depends on you, establish why against the evidence, then build the systems that remove it."
    />
  );
}

/** The three eyebrow accents. The eyebrow class sets shape only, never colour. */
export function Accents() {
  return (
    <div style={stack}>
      <SectionHeader accent="brand" eyebrow="Brand accent" title="The default voice" description="Blue ink at 10:1 on white." />
      <SectionHeader accent="amber" eyebrow="Amber accent" title="The warm voice" description="Amber text on light uses #B45309 — never the #FFBF00 fill." />
      <SectionHeader accent="danger" eyebrow="Danger accent" title="The warning voice" description="Reserved for destructive or high-risk framing." />
    </div>
  );
}

/** `align="center"` exists, but centred blocks on every section read as a template — use it sparingly. */
export function Centered() {
  return (
    <SectionHeader
      align="center"
      eyebrow="Ready when you are"
      title="Start with the Business Health Check"
      description="Free, private, and about ten minutes."
    />
  );
}
