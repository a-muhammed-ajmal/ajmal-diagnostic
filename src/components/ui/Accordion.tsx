"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Single-open accordion.
 *
 * The body animates on `grid-template-rows: 0fr → 1fr` rather than height.
 * That is the one sanctioned layout-property animation (frontend.md §1.4) —
 * height cannot be transitioned from `auto`, and the alternative is measuring
 * in JavaScript on every resize.
 */
export type AccordionItem = {
  question: string;
  answer: ReactNode;
};

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={index} className={cn(isOpen && "bg-canvas-light")}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 ease-out hover:bg-canvas-light"
              >
                <span className="font-heading text-[length:var(--step-1)] font-bold text-ink">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "tap-target flex shrink-0 items-center justify-center rounded-full border transition-all duration-200 ease-out",
                    isOpen ? "rotate-45 border-brand bg-brand text-white" : "border-line text-brand-ink",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-[400ms] ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
