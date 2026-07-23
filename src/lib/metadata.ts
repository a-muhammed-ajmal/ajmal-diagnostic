import type { Metadata } from "next";
import { SITE_URL } from "./env";

export const SITE_NAME = "Muhammed Ajmal Consulting";

interface PageMetadataOptions {
  /** Page-specific title. Brand is appended unless `absoluteTitle` is set. */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/services". Becomes the canonical URL. */
  path: string;
  /** When true, the <title> is used verbatim (no " | Muhammed Ajmal Consulting"). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  /** Override the og/twitter title. Defaults to the branded title. */
  ogTitle?: string;
  /** Set false on pages that should not be indexed (e.g. results, admin). */
  index?: boolean;
}

/**
 * Builds a complete, self-consistent metadata block for a page: unique title and
 * description, a canonical URL, a full Open Graph block, and a large-image Twitter card.
 * Every page passes its own values so no page inherits the homepage's tags.
 */
export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const brandedTitle = opts.absoluteTitle ? opts.title : `${opts.title} | ${SITE_NAME}`;
  const ogTitle = opts.ogTitle ?? brandedTitle;

  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: opts.description,
      url,
      type: opts.type ?? "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.description,
    },
    ...(opts.index === false ? { robots: { index: false, follow: false } } : {}),
  };
}
