import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** `accent` replaced the old `dark` tone — the site has no dark slabs. */
  tone?: "default" | "muted" | "accent";
  interactive?: boolean;
};

export function Surface({ children, tone = "default", interactive = false, className, ...props }: SurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-6",
        tone === "default" && "border-line bg-white shadow-1",
        tone === "muted" && "border-line bg-brand-tint",
        tone === "accent" && "border-brand/30 bg-brand-soft text-ink",
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
