import type { ReactNode } from "react";
import { Chip } from "@/components/ui/Chip";

/**
 * A looping chip track. [DESIGN CHANGE] — new in the Signal Stack pass.
 *
 * The set is rendered twice: the animation translates the track by exactly
 * -50%, so the second copy arrives where the first began and the loop has no
 * visible seam. Only the first copy is exposed to assistive tech.
 *
 * Home and Diagnostic only, per frontend.md §2.2.
 */
export function TrustMarquee({ items }: { items: ReactNode[] }) {
  return (
    <div className="marquee border-b border-line bg-white py-5" aria-label="Patterns this addresses">
      <div className="marquee-track gap-3">
        {items.map((item, index) => (
          <Chip key={`a-${index}`}>{item}</Chip>
        ))}
        <span className="flex gap-3 pl-3" aria-hidden="true">
          {items.map((item, index) => (
            <Chip key={`b-${index}`}>{item}</Chip>
          ))}
        </span>
      </div>
    </div>
  );
}
