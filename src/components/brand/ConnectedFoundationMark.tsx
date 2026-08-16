import type { SVGProps } from "react";

export function ConnectedFoundationMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Muhammed Ajmal Consulting symbol"
      className={className}
      {...props}
    >
      <circle cx="24" cy="24" r="6" fill="currentColor" />
      <path d="M20 19 14 12a12 12 0 0 0-5 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 19 34 12a12 12 0 0 1 5 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 28 10 34a12 12 0 0 0 14 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 28 38 34a12 12 0 0 1-14 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="9" cy="24" r="2.5" fill="currentColor" />
      <circle cx="39" cy="24" r="2.5" fill="currentColor" />
      <circle cx="24" cy="39" r="2.5" fill="currentColor" />
    </svg>
  );
}
