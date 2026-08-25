import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A pill. Static by default — a label in a marquee or a meta row.
 *
 * Give it `href` or `onClick` and it becomes a real control, which is why the
 * interactive form takes the 44px floor: a filter row is a tap target, a
 * marquee label is not, and forcing 44px on the decorative case would make the
 * marquee twice the height it should be.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full border px-4 font-body text-[length:var(--step--1)] font-medium transition-all duration-200 ease-out";

const resting = "border-line bg-canvas-light text-muted";
const selected = "border-brand bg-brand-tint text-brand-ink";
const interactive =
  "min-h-11 hover:border-brand hover:bg-brand-tint hover:text-brand-ink";

type ChipBaseProps = {
  children: ReactNode;
  /** Filter chips: the active one. Adds `aria-current` on the link form. */
  active?: boolean;
  className?: string;
};

type StaticChipProps = ChipBaseProps & { href?: never; onClick?: never };
type LinkChipProps = ChipBaseProps & { href: string; onClick?: never };
type ButtonChipProps = ChipBaseProps & { href?: never; onClick: () => void };

type ChipProps = StaticChipProps | LinkChipProps | ButtonChipProps;

export function Chip({ children, active = false, className, ...props }: ChipProps) {
  const classes = cn(
    base,
    active ? selected : resting,
    ("href" in props && props.href) || ("onClick" in props && props.onClick)
      ? interactive
      : "py-1",
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    );
  }

  if ("onClick" in props && props.onClick) {
    return (
      <button type="button" onClick={props.onClick} aria-pressed={active} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
