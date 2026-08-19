import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A full-bleed page band.
 *
 * Every section on the site is one of these, which is what keeps the vertical
 * rhythm and the banded background alternation consistent without each page
 * restating `px-6 py-16 md:py-24` and its own border rules.
 *
 * `tone` picks the band colour. Tint and light bands carry their own `border-y`;
 * two adjacent white bands need `divided` on the second, or they merge.
 */
type SectionTone = "white" | "light" | "tint" | "dark";
type SectionWidth = "prose" | "narrow" | "default" | "wide";

const toneClasses: Record<SectionTone, string> = {
  white: "bg-white text-ink",
  light: "border-y border-line bg-canvas-light text-ink",
  tint: "border-y border-line bg-brand-tint text-ink",
  dark: "bg-canvas-dark text-white",
};

const widthClasses: Record<SectionWidth, string> = {
  prose: "max-w-3xl",
  narrow: "max-w-5xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

type SectionProps = {
  children: ReactNode;
  tone?: SectionTone;
  width?: SectionWidth;
  /** Ambient blurred radials behind the content. Two per section is the budget. */
  orbs?: boolean;
  /** Tighter vertical padding, for utility bands rather than content sections. */
  compact?: boolean;
  /** Adds a top hairline. Use when this white band follows another white band. */
  divided?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
  /** Applied to the inner container rather than the band. */
  innerClassName?: string;
};

export function Section({
  children,
  tone = "white",
  width = "default",
  orbs = false,
  compact = false,
  divided = false,
  id,
  className,
  innerClassName,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={props["aria-label"]}
      className={cn(
        "relative overflow-hidden px-6",
        compact ? "py-10" : "py-16 md:py-24",
        toneClasses[tone],
        divided && "border-t border-line",
        className,
      )}
    >
      {orbs ? <Orbs tone={tone} /> : null}
      <div className={cn("relative z-10 mx-auto", widthClasses[width], innerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Decorative only. Sits behind the content in a clipped, positioned parent, and
 * is hidden from assistive tech. Blur radius is heavy enough that the shapes
 * read as ambient colour rather than as objects.
 */
function Orbs({ tone }: { tone: SectionTone }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className={cn(
          "orb orb-electric absolute -right-32 -top-40 h-[28rem] w-[28rem]",
          tone === "dark" && "opacity-20",
        )}
      />
      <div
        className={cn(
          "orb orb-amber absolute -bottom-40 -left-32 h-96 w-96",
          tone === "dark" && "opacity-25",
        )}
      />
    </div>
  );
}
