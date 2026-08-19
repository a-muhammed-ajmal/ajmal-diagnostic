import { PageHero, Button, FounderSystemVisual } from "ajmal-diagnostic";

// Ported from the real homepage hero (src/app/page.tsx). PageHero offers no
// centred variant on purpose — asymmetry is the house layout.

/** The 7/5 split. This is the homepage hero, with the operating-architecture visual as aside. */
export function WithAside() {
  return (
    <PageHero
      eyebrow="Business Operations & Growth Consultant · Dubai, UAE"
      title={
        <>
          Build a business that <span className="brand-gradient-text">grows beyond the founder.</span>
        </>
      }
      lead="Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful, scalable businesses by reducing founder dependency through better systems, clearer ownership, useful visibility, and consistent execution."
      actions={
        <>
          <Button href="/diagnostic">Start the Business Health Check</Button>
          <Button href="/services" variant="quiet">See How It Works</Button>
        </>
      }
      note="Free. Private. A focused founder-dependency self-report."
      aside={<FounderSystemVisual />}
    />
  );
}

/** Without an aside the copy runs to 8 of 12 columns so the measure stays readable. */
export function WithoutAside() {
  return (
    <PageHero
      tone="light"
      eyebrow="Insights"
      title="Operating notes for founder-led businesses"
      lead="Practical writing on systems, ownership and visibility — the things that decide whether a business can run without its founder in the room."
      actions={<Button href="/insights" variant="secondary">Browse all articles</Button>}
    />
  );
}

/** `accent="amber"` switches the eyebrow to the amber text token (#B45309 on light). */
export function AmberAccent() {
  return (
    <PageHero
      tone="tint"
      accent="amber"
      eyebrow="The Business Clarity Audit"
      title="Test the self-reported picture against operating evidence"
      lead="Where the Business Health Check tells you that dependency exists, the Audit establishes why — against the evidence rather than the recollection."
      actions={<Button variant="accent">Request the Audit</Button>}
      note="Engagement begins with a scoping conversation."
    />
  );
}
