import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Publication dates in prose form: "August 16, 2026".
 *
 * en-US, not en-GB: the Anchor Document fixes the practice on US English and on
 * "Month DD, YYYY" in prose. Locale is pinned rather than left to the runtime so the
 * server render and the client hydration cannot disagree.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
