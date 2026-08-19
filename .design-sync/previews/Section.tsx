import { Section, SectionHeader, Surface, Button } from "ajmal-diagnostic";

// Section is a full-bleed band, so each cell is one complete band rather than a
// fragment — that is the only way its padding, banding and border rules read
// true. Children are real DS components so the card shows real brand styling.

/**
 * The three light band tones. Rhythm on a page comes from alternating these.
 * Shown `compact` so all three fit one card — tone is what varies here, not padding.

 */
export function Tones() {
  return (
    <div>
      <Section tone="white" compact>
        <SectionHeader
          eyebrow="White band"
          title="The default band"
          description="Two adjacent white bands need `divided` on the second, or they merge into one."
        />
      </Section>
      <Section tone="light" compact>
        <SectionHeader
          eyebrow="Light band"
          title="Slate 50, with hairlines"
          description="Carries its own border-y. Use it to separate two content-heavy white bands."
        />
      </Section>
      <Section tone="tint" compact>
        <SectionHeader
          eyebrow="Tint band"
          title="The electric wash"
          description="Brand tint at low saturation — the accent band in the alternating rhythm."
        />
      </Section>
    </div>
  );
}

/**
 * The dark band — the closing call-to-action device, roughly one per page.
 *
 * It does NOT use SectionHeader: that component hardcodes light-ground tokens
 * (text-ink heading, text-brand-ink eyebrow) which are invisible / sub-2:1 on
 * slate 900. This is the inverted pattern the site itself uses on dark bands
 * (src/app/page.tsx) — amber eyebrow, white heading, muted-invert body.
 */
export function DarkBand() {
  return (
    <Section tone="dark" compact>
      <p className="eyebrow mb-3 text-accent">Dark band</p>
      <h2 className="font-heading text-[length:var(--step-4)] font-extrabold text-white">
        The closing call to action
      </h2>
      <p className="mt-4 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted-invert">
        Roughly one per page. Amber is legible here, and only here — on light
        surfaces it drops to 1.65:1 and must be a fill instead.
      </p>
      <div className="mt-6">
        <Button variant="accent">Start the Business Health Check</Button>
      </div>
    </Section>
  );
}

/** `orbs` adds two ambient radials behind the content. Two per section is the budget. */
export function WithOrbs() {
  return (
    <Section tone="light" orbs>
      <SectionHeader
        eyebrow="Operating architecture"
        title="Where founder dependency actually shows up"
        description="Ambient radials sit behind the content in a clipped, positioned parent and are hidden from assistive tech."
      />
      <div style={{ marginTop: "24px" }}>
        <Button href="/diagnostic">Start the Business Health Check</Button>
      </div>
    </Section>
  );
}

/** `compact` tightens the vertical padding for utility bands. `width` sets the measure. */
export function CompactAndNarrow() {
  return (
    <Section tone="tint" compact width="narrow">
      <Surface tone="glass">
        <SectionHeader
          eyebrow="Utility band"
          title="Compact padding, narrow measure"
          description="Use compact for bands that carry a control or a single statement rather than a full content block."
        />
      </Surface>
    </Section>
  );
}
