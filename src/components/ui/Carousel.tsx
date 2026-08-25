"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A stepped 3-up track. Never auto-advances — motion the reader did not ask
 * for is the thing that makes a carousel hostile.
 *
 * Movement is `translate3d` on the track, so nothing animates a layout
 * property. Position is announced politely rather than assertively.
 */
export function Carousel({ items, label }: { items: ReactNode[]; label: string }) {
  const [index, setIndex] = useState(0);
  const last = Math.max(0, items.length - 1);

  const go = (next: number) => setIndex(Math.min(Math.max(next, 0), last));

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
      }}
    >
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-[400ms] ease-out"
          style={{ transform: `translate3d(-${index * (100 / 3)}%, 0, 0)` }}
        >
          {items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              aria-hidden={itemIndex < index || itemIndex > index + 2 ? true : undefined}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label={`${label} position`}>
          {items.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Item ${dotIndex + 1} of ${items.length}`}
              onClick={() => go(dotIndex)}
              className={cn(
                "h-2 rounded-full transition-all duration-200 ease-out",
                dotIndex === index ? "w-[22px] bg-brand" : "w-[6px] bg-line-strong",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous"
            className="tap-target flex items-center justify-center rounded-full border border-line text-brand-ink transition-colors duration-200 ease-out hover:border-brand disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label="Next"
            className="tap-target flex items-center justify-center rounded-full border border-line text-brand-ink transition-colors duration-200 ease-out hover:border-brand disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Item {index + 1} of {items.length}
      </p>
    </div>
  );
}
