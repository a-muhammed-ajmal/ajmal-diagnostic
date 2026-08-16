import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "default" | "muted" | "dark";
  interactive?: boolean;
};

export function Surface({ children, tone = "default", interactive = false, className, ...props }: SurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-6",
        tone === "default" && "border-navy/10 bg-white shadow-sm",
        tone === "muted" && "border-navy/10 bg-ivory",
        tone === "dark" && "border-ivory/15 bg-navy text-ivory",
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
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-3", tone === "dark" ? "text-gold" : "text-gold-ink")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("font-heading text-[length:var(--step-4)] font-extrabold leading-tight", tone === "dark" ? "text-ivory" : "text-navy")}>
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 font-body text-base leading-relaxed", tone === "dark" ? "text-ivory/70" : "text-navy/65")}>
          {description}
        </p>
      ) : null}
    </header>
  );
}
