import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The small square that heads a card or a rail item.
 *
 * Two readings: a numeral (a step in a sequence) or a glyph (an icon). The
 * numeral takes the solid brand fill because it carries meaning; the glyph
 * takes the soft fill because it is decoration beside a title that already
 * says what the card is.
 *
 * `.font-mono` on the numeral is the tabular-figures utility, not a family
 * change — sequences stay aligned as they pass 9.
 */
type IconTileSize = "sm" | "md" | "lg";
type IconTileVariant = "numeral" | "glyph";

/** 26 / 34 / 44px. Radius steps with the tile so the corner stays proportional. */
const sizeClasses: Record<IconTileSize, string> = {
  sm: "h-[26px] w-[26px] rounded-lg text-[length:var(--step--1)]",
  md: "h-[34px] w-[34px] rounded-lg text-[length:var(--step--1)]",
  lg: "h-11 w-11 rounded-xl text-[length:var(--step-0)]",
};

const variantClasses: Record<IconTileVariant, string> = {
  numeral: "bg-brand text-white font-mono",
  glyph: "bg-brand-soft text-brand-ink",
};

type IconTileProps = {
  children: ReactNode;
  variant?: IconTileVariant;
  size?: IconTileSize;
  /** Decorative beside a visible title — the default. Set false to expose it. */
  decorative?: boolean;
  className?: string;
};

export function IconTile({
  children,
  variant = "glyph",
  size = "md",
  decorative = true,
  className,
}: IconTileProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium leading-none transition-transform duration-200 ease-out",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
