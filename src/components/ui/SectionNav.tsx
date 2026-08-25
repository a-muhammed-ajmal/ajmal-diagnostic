"use client";

import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/**
 * In-page navigation.
 *
 * Reuses `.article-toc` from `globals.css`, which is `display:none` below
 * 1024px and sticky at `top:96px` above it. Below that breakpoint the same
 * links render as a horizontal chip row, so the navigation never disappears —
 * it changes shape.
 */
export type SectionNavItem = { id: string; label: string };

export function SectionNav({
  items,
  activeId,
  className,
}: {
  items: SectionNavItem[];
  activeId?: string;
  className?: string;
}) {
  return (
    <>
      <nav className={cn("article-toc", className)} aria-label="On this page">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? "true" : undefined}
                className={cn(
                  "block border-l-2 py-2 pl-4 font-body text-[length:var(--step-0)] transition-colors duration-200 ease-out",
                  activeId === item.id
                    ? "border-brand bg-brand-tint text-brand-ink"
                    : "border-transparent text-muted hover:text-brand-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="On this page">
        {items.map((item) => (
          <Chip key={item.id} href={`#${item.id}`} active={activeId === item.id}>
            {item.label}
          </Chip>
        ))}
      </nav>
    </>
  );
}
