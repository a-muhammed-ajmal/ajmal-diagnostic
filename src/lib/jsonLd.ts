import { SITE_URL } from "./env";
import { SITE_NAME, AUTHOR_HEADSHOT_URL } from "./metadata";
import type { Article } from "./articles";

/**
 * Structured data (schema.org / JSON-LD) builders.
 *
 * Rendered into a <script type="application/ld+json"> tag. Everything here is true today:
 * no aggregateRating, no review, no employee counts, no fabricated ratings.
 *
 * Serialise with JSON.stringify(...).replace(/</g, "\\u003c") when embedding, to neutralise
 * any "<" that could break out of the script tag.
 */

/** The practice as a person + professional service. Used on /about. */
export function personAndServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/about#person`,
        name: "Muhammed Ajmal",
        jobTitle: "Strategic Growth Architect",
        url: `${SITE_URL}/about`,
        image: AUTHOR_HEADSHOT_URL,
        knowsLanguage: ["English", "Arabic", "Hindi", "Malayalam", "Tamil", "Kannada"],
        worksFor: { "@id": `${SITE_URL}#service` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}#service`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Strategic growth consulting for founder-led SMEs across the UAE and GCC — helping owner-dependent businesses become system-driven.",
        areaServed: ["United Arab Emirates", "GCC"],
        founder: { "@id": `${SITE_URL}/about#person` },
        provider: { "@id": `${SITE_URL}/about#person` },
      },
    ],
  };
}

/** BlogPosting for an article. */
export function articleJsonLd(article: Article) {
  const url = `${SITE_URL}/insights/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${SITE_URL}/about`,
      image: AUTHOR_HEADSHOT_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    articleSection: article.category,
  };
}

/** Breadcrumb trail for an article page. */
export function articleBreadcrumbJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/insights/${article.slug}`,
      },
    ],
  };
}

/** Serialises a JSON-LD object safely for embedding in a script tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
