import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CardGrid, CardGridItem } from '@/components/ui/CardGrid';
import { CTABand } from '@/components/ui/CTABand';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Surface } from '@/components/ui/Surface';
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

/** Same tinted-header card as the Insights index, so the two listings match. */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="block h-full">
      <Surface
        interactive
        className="h-full"
        header={
          <span className="font-body text-[length:var(--step--1)] font-medium uppercase text-brand-ink">
            {article.category}
          </span>
        }
      >
        <h2 className="font-heading text-[length:var(--step-1)] font-bold text-ink">{article.title}</h2>
        <p className="mb-3 mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
        <p className="font-body text-xs text-muted">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
      </Surface>
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
          <CardGrid columns={3} scrollReveal>
            {articles.map((a) => (
              <CardGridItem key={a.slug} scrollReveal>
                <ArticleCard article={a} />
              </CardGridItem>
            ))}
          </CardGrid>
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

      <CTABand
        eyebrow="Start with clarity"
        title="Reading is a start. Measuring is better."
        body="The Business Health Check returns your Founder Dependency Index across decision speed, execution consistency, and operational visibility."
        actions={
          <Button href="/diagnostic" variant="accent">
            Start the Business Health Check
            {/* WEB §5 fixes the label including the arrow. The icon is decorative,
                so the glyph is restated here for the accessible name only. */}
            <span className="sr-only"> →</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />
    </>
  );
}
