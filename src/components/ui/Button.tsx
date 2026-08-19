import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

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

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-1 hover:bg-brand-hover hover:shadow-2",
  secondary: "border border-brand text-white hover:bg-brand hover:text-white",
  quiet: "border border-line bg-white text-ink hover:border-brand hover:text-brand-ink",
  danger: "bg-danger text-white hover:bg-danger/90",
};

/* 44px is the accessibility floor and the standard control height for nav,
   forms and in-page actions. The hover lift is transform-only so it stays on
   the compositor; the global prefers-reduced-motion guard neutralises it. */
const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3" +
  "font-heading text-[length:var(--step-0)] font-bold leading-5" +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out" +
  "hover:-translate-y-px" +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

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
