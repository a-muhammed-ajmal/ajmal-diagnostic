import type { Metadata } from "next";
import { SITE_URL } from "./env";

export const SITE_NAME = "Muhammed Ajmal Consulting";

/**
 * The studio headshot in /public. Site-wide brand identity rather than article content,
 * so it lives here instead of on ArticleAuthor — /about and the JSON-LD Person nodes use
 * it too, and none of those are article-scoped.
 *
 * A string path rather than a static import: JSON-LD needs a stable absolute URL, and a
 * static import resolves to a content-hashed /_next/static/media/… path that changes
 * between builds.
 */
export const AUTHOR_HEADSHOT = {
  src: "/images/muhammed-ajmal.jpg",
  width: 1440,
  height: 1440,
  alt: "Muhammed Ajmal, Strategic Growth Architect, Dubai",
} as const;

/** Absolute form — schema.org image fields must not be relative. */
export const AUTHOR_HEADSHOT_URL = `${SITE_URL}${AUTHOR_HEADSHOT.src}`;

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
