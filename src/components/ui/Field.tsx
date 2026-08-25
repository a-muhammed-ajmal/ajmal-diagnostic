import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Form control primitives.
 *
 * Two near-identical field recipes had drifted apart in `ContactForm` and
 * `FdiDiagnosticFlow`; this is the single one. Font size is deliberately not
 * set here — `globals.css` pins `input, select, textarea` to 16px unlayered,
 * which outranks any Tailwind utility and is what stops iOS zooming the
 * viewport on focus.
 *
 * Focus is the global `:focus-visible` outline. Do not add a ring: the older
 * call sites carry `focus:outline-none focus:ring-2`, which replaces the house
 * outline rather than extending it.
 */
const controlBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-ink placeholder:text-muted transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50";

/** 44px on inputs and selects; a textarea needs room to be worth typing into. */
const controlHeight = "min-h-11";

function stateClasses(invalid?: boolean) {
  return invalid
    ? "border-danger focus:border-danger"
    : "border-line focus:border-brand";
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { invalid?: boolean };

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      className={cn(controlBase, controlHeight, stateClasses(invalid), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; children: ReactNode };

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(controlBase, controlHeight, stateClasses(invalid), className)}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(controlBase, "min-h-[92px]", stateClasses(invalid), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type LabelProps = { htmlFor: string; children: ReactNode; className?: string };

export function Label({ htmlFor, children, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-1 block font-heading text-[length:var(--step-0)] font-semibold text-ink", className)}
    >
      {children}
    </label>
  );
}

/** Renders nothing without a message, so a call site can pass an optional error straight through. */
export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 font-body text-xs text-danger">
      {message}
    </p>
  );
}
