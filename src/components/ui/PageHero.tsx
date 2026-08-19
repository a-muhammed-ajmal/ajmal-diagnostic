import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";

/**
 * The page-opening hero.
 *
 * Deliberately asymmetric: with an `aside` it splits 7/5, and without one the
 * copy runs to 8 of 12 columns so the measure stays readable and the ambient
 * orb has room on the right. Centred hero blocks are what made every page here
 * read as the same template, so this component does not offer that option.
 */
type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons. Rendered in a row that wraps to a column on small screens. */
  actions?: ReactNode;
  /** Fine print under the actions — disclaimers, "free and private", etc. */
  note?: string;
  /** The right-hand 5 columns. A visual, a glass panel, a form. */
  aside?: ReactNode;
  tone?: "white" | "light" | "tint";
  /** Eyebrow colour. Amber is the accent voice; blue is the default. */
  accent?: "brand" | "amber";
};

export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  note,
  aside,
  tone = "white",
  accent = "brand",
}: PageHeroProps) {
  return (
    <Section tone={tone} width="wide" orbs className="py-16 md:py-24">
      <div
        className={cn(
          "grid items-center gap-12",
          aside ? "lg:grid-cols-12 lg:gap-16" : "lg:grid-cols-12",
        )}
      >
        <div className={aside ? "lg:col-span-7" : "lg:col-span-8"}>
          <span
            className={cn(
              "reveal eyebrow mb-4 block",
              accent === "amber" ? "text-accent-ink" : "text-brand-ink",
            )}
          >
            {eyebrow}
          </span>
          <h1 className="reveal font-heading text-[length:var(--step-5)] font-extrabold leading-tight">
            {title}
          </h1>
          {lead ? (
            <p className="reveal mt-6 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              {lead}
            </p>
          ) : null}
          {actions ? (
            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
          ) : null}
          {note ? (
            <p className="reveal mt-4 font-body text-xs text-muted">{note}</p>
          ) : null}
        </div>
        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </Section>
  );
}
