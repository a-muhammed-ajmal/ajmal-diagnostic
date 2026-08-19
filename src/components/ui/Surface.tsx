import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** `glass` is the glassmorphism panel — it carries its own border and shadow,
   *  so it deliberately opts out of the shared `border` utility. */
  tone?: "default" | "muted" | "accent" | "glass";
  interactive?: boolean;
};

export function Surface({ children, tone = "default", interactive = false, className, ...props }: SurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-2xl p-6",
        tone !== "glass" && "border",
        tone === "default" && "border-line bg-white shadow-1",
        tone === "muted" && "border-line bg-brand-tint",
        tone === "accent" && "border-brand/30 bg-brand-soft text-ink",
        tone === "glass" && "glass-panel",
        interactive && "card-interactive",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/** Eyebrow colour. The eyebrow class sets shape only, never colour. */
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
