"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * A bar that appears once the hero has left the viewport. [DESIGN CHANGE].
 *
 * Visibility is driven by an IntersectionObserver on a sentinel rather than a
 * scroll listener, so it costs nothing on the main thread. Dismissal is
 * remembered for the session only — sessionStorage, not localStorage, so it
 * returns on the next visit rather than being silently suppressed forever.
 *
 * Suppressed on the diagnostic flow and admin by simply not being rendered
 * there (frontend.md §2.2).
 */
const DISMISS_KEY = "sticky-cta-dismissed";

export function StickyCTABar({ label, href, meta }: { label: string; href: string; meta?: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    // Storage is read inside the callback rather than in the effect body: the
    // bar cannot be visible before the sentinel has been observed anyway, and
    // setting state from an effect body is what `set-state-in-effect` forbids.
    const observer = new IntersectionObserver(
      ([entry]) => {
        let alreadyDismissed = false;
        try {
          alreadyDismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
        } catch {
          // Private mode or blocked storage — show the bar rather than hide it.
        }
        setDismissed(alreadyDismissed);
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: "0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to persist to; the bar stays hidden for this render only.
    }
  };

  return (
    <>
      <div ref={sentinel} aria-hidden="true" />
      {visible && !dismissed ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white shadow-3">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-[length:var(--step-0)] font-medium text-ink">{label}</p>
              {meta ? <p className="font-body text-[length:var(--step--1)] text-muted">{meta}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              <Button href={href}>Start the Business Health Check →</Button>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="tap-target flex items-center justify-center rounded-full text-muted transition-colors duration-200 ease-out hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
