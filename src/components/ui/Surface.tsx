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

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? <p className="eyebrow mb-3 text-brand-ink">{eyebrow}</p> : null}
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
