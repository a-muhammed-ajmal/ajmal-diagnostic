import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The card grid. 4-up desktop, 2-up tablet, 1-up mobile by default.
 *
 * Entrance is the existing `.reveal` stagger, which is capped at five children
 * by `nth-child` rules in `globals.css` — beyond that the delay simply stops
 * increasing, which is the intended behaviour rather than a bug to work around.
 */
type CardGridColumns = 2 | 3 | 4;

const columnClasses: Record<CardGridColumns, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

type CardGridProps = {
  children: ReactNode;
  columns?: CardGridColumns;
  /** Scroll-driven rather than load-driven. Use for sections below the fold. */
  scrollReveal?: boolean;
  className?: string;
};

export function CardGrid({ children, columns = 4, scrollReveal = false, className }: CardGridProps) {
  return (
    <div className={cn("grid gap-6", columnClasses[columns], className)} data-reveal={scrollReveal ? "scroll" : "load"}>
      {children}
    </div>
  );
}

/** Wraps one grid child so the stagger class lands on the direct child. */
export function CardGridItem({
  children,
  scrollReveal = false,
  className,
}: {
  children: ReactNode;
  scrollReveal?: boolean;
  className?: string;
}) {
  return <div className={cn(scrollReveal ? "stage-reveal" : "reveal", className)}>{children}</div>;
}
