import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import {
  CATEGORIES,
  getArticlesByCategory,
  getReadingTime,
  type Article,
} from '@/lib/articles';
import { pageMetadata } from '@/lib/metadata';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} | Insights`,
    absoluteTitle: true,
    description: category.desc,
    path: `/insights/category/${category.slug}`,
  });
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-1 md:p-6"
    >
      <span className="inline-flex w-fit rounded-full bg-brand-soft px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">{article.category}</span>
      <h2 className="mb-2 mt-3 font-heading text-[length:var(--step-1)] font-bold text-ink">{article.title}</h2>
      <p className="mb-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
      <p className="mt-auto font-body text-xs text-muted">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
    </Link>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={category.name}
        lead={category.desc}
        accent="amber"
        actions={
          <Button href="/insights" variant="quiet">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All Insights
          </Button>
        }
      />

      <Section tone="light" width="narrow">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <div className="glass-panel mx-auto max-w-md rounded-2xl p-8">
            <p className="mb-2 font-heading text-[length:var(--step-1)] font-bold text-ink">Nothing published here yet.</p>
            <p className="mb-6 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              In the meantime, the Business Health Check is a practical first view of where
              founder dependency may be appearing.
            </p>
            <Button href="/diagnostic">
              Start the Business Health Check
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </Section>

    </>
  );
}
