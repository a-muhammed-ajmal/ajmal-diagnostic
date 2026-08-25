import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** `glass` is the glassmorphism panel — it carries its own border and shadow,
   *  so it deliberately opts out of the shared `border` utility. */
  tone?: "default" | "muted" | "accent" | "glass";
  interactive?: boolean;
  /**
   * Optional tinted header strip — a brand-tint band with a hairline bottom
   * edge, holding a numeral tile and a title, with the body on white below.
   *
   * Opt-in and off by default: supplying it moves the padding off the card and
   * onto the two regions, so a card without a header renders exactly as before.
   */
  header?: ReactNode;
};

export function Surface({
  children,
  tone = "default",
  interactive = false,
  header,
  className,
  ...props
}: SurfaceProps) {
  const shell = cn(
    "rounded-2xl",
    // With a header the strip runs to the card edge, so the padding moves
    // inward and the corners have to clip it.
    header ? "overflow-hidden" : "p-6",
    tone !== "glass" && "border",
    tone === "default" && "border-line bg-white shadow-1",
    tone === "muted" && "border-line bg-brand-tint",
    tone === "accent" && "border-brand/30 bg-brand-soft text-ink",
    tone === "glass" && "glass-panel",
    interactive && "card-interactive",
    className,
  );

  if (!header) {
    return (
      <section className={shell} {...props}>
        {children}
      </section>
    );
  }

  return (
    <section className={shell} {...props}>
      <div className="flex items-center gap-3 border-b border-line bg-brand-tint px-6 py-4">
        {header}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

/** Eyebrow colour override. `.eyebrow` defaults to accent-ink on light
 *  surfaces and accent on dark bands; these win over that default. */
type SectionAccent = "brand" | "amber" | "danger";

const accentClasses: Record<SectionAccent, string> = {
  brand: "text-brand-ink",
  amber: "text-accent-ink",
  danger: "text-danger",
};

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  accent?: SectionAccent;
  /** Left is the house default — centred blocks on every section read as a template. */
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  accent = "brand",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className={cn("eyebrow mb-3", accentClasses[accent])}>{eyebrow}</p> : null}
      <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
