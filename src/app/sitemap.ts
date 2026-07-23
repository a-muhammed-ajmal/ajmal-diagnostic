import { MetadataRoute } from 'next';
import { ARTICLES, CATEGORIES } from '@/lib/articles';
import { SITE_URL } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/diagnostic`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Generated from the article registry, so future articles are included automatically.
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/insights/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Only categories that actually have articles behind them.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter((c) =>
    ARTICLES.some((a) => a.categorySlug === c.slug),
  ).map((c) => ({
    url: `${base}/insights/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}
