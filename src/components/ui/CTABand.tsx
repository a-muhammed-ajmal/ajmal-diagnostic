import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

/**
 * The closing dark band. One per route; Home is the only page allowed two
 * `--color-ink` bands (frontend.md §1.1).
 *
 * `.eyebrow` resolves to amber inside `.bg-canvas-dark` on its own, which is
 * amber's one legitimate home as a text colour — no per-use class needed.
 */
type CTABandProps = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
  /** The right-hand 5 columns — normally a glass panel. */
  aside?: ReactNode;
};

export function CTABand({ eyebrow, title, body, actions, aside }: CTABandProps) {
  return (
    <Section tone="dark" width="wide" orbs>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-8"}>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-white">
            {title}
          </h2>
          {body ? (
            <p className="mt-4 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted-invert">
              {body}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
        </div>
        {aside ? <div className="lg:col-span-5 lg:justify-self-end">{aside}</div> : null}
      </div>
    </Section>
  );
}
