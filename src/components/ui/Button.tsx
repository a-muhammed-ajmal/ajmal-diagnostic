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
  primary: "bg-gold text-navy hover:bg-gold-bright",
  secondary: "border border-navy text-navy hover:bg-navy hover:text-ivory",
  quiet: "border border-navy/15 bg-white text-navy hover:border-gold hover:text-gold-ink",
  danger: "bg-crimson text-white hover:bg-crimson/90",
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-heading text-sm font-bold leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

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
