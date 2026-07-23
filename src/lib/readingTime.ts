/** Average adult reading speed for informational prose. */
const WORDS_PER_MINUTE = 225;

/** Counts words in a block of plain text. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Reading time in whole minutes, rounded up (never zero for real content).
 * Computed from the actual text so it can never drift out of sync with the article.
 */
export function readingTimeMinutes(text: string): number {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
