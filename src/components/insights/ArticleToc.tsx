'use client';
import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Sticky table of contents for the article, desktop (lg+) only.
 *
 * The layout and stickiness are pure CSS (.article-toc). The only reason this is a
 * client component is the active-section highlight, which needs an IntersectionObserver —
 * the "no JavaScript" constraint in Block 5 applied specifically to the reading progress
 * bar (5.1), which is CSS-only. Everything degrades gracefully: with JS off, the list of
 * links still renders and works, just without the active highlight.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="article-toc w-56 flex-shrink-0" aria-label="On this page">
      <p className="font-heading font-bold text-muted text-xs uppercase tracking-widest mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-line">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="-ml-px">
              <a
                href={`#${item.id}`}
                className={
                  isActive
                    ? 'block border-l-2 border-brand pl-3 font-body text-[length:var(--step-0)] text-ink font-medium'
                    : 'block border-l-2 border-transparent pl-3 font-body text-[length:var(--step-0)] text-muted hover:text-ink'
                }
                aria-current={isActive ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
