import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "quiet" | "accent" | "danger";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
};

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  external?: boolean;
  onClick?: ComponentPropsWithoutRef<"a">["onClick"];
};

type NativeButtonProps = ButtonBaseProps & {
  external?: never;
  type?: ComponentPropsWithoutRef<"button">["type"];
  disabled?: boolean;
  onClick?: ComponentPropsWithoutRef<"button">["onClick"];
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

/* Every fill is paired with a text colour that clears 4.5:1 against it. The
   amber variant is the reason `accent` exists at all: #FFBF00 is 1.65:1 against
   white, so it may only ever carry dark slate text — never white. */
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-1 hover:bg-brand-hover hover:shadow-glow-electric",
  secondary:
    "border border-brand text-brand-ink hover:bg-brand hover:text-white hover:shadow-glow-electric",
  quiet: "border border-line bg-white text-ink hover:border-brand hover:text-brand-ink",
  accent: "bg-accent text-canvas-dark shadow-1 hover:bg-accent-hover hover:shadow-glow-amber",
  danger: "bg-danger text-white hover:bg-danger/90",
};

/* One flat string on purpose: the previous multi-line `"..." + "..."` form lost
   its trailing spaces to a codemod and silently produced `py-3font-heading`.
   44px (min-h-11) is the accessibility floor and the standard control height;
   the label rides the --step-0 scale (14px mobile / 16px desktop) while padding
   keeps the target. Buttons are UI text, so they take Lexend (`font-body`),
   not the heading face, and sit at weight 500 — the Lexend body ceiling. `transition-all duration-200` and the -0.5 lift are the
   mandated micro-interaction; the global prefers-reduced-motion guard
   neutralises the movement. */
const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 font-body text-[length:var(--step-0)] font-medium leading-tight transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], fullWidth && "w-full", className);

  if ("href" in props) {
    if (props.external) {
      return (
        <a href={props.href} className={classes} target="_blank" rel="noreferrer" onClick={props.onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
