import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Button } from '@/components/ui/Button';
import { CardGrid, CardGridItem } from '@/components/ui/CardGrid';
import { Chip } from '@/components/ui/Chip';
import { CTABand } from '@/components/ui/CTABand';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Surface, SectionHeader } from '@/components/ui/Surface';
import { pageMetadata } from '@/lib/metadata';
import { formatDate } from '@/lib/utils';
import { ARTICLES, CATEGORIES, getReadingTime, type Article } from '@/lib/articles';

export const metadata = pageMetadata({
  title: 'Insights for Founder-Led UAE SMEs | Muhammed Ajmal Consulting',
  absoluteTitle: true,
  description: 'Practical insights on founder dependency, operating systems, ownership, visibility, and applied AI for founder-led UAE SMEs.',
  path: '/insights',
});

/** Article meta line. One definition so the featured and compact cards stay in step. */
function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="font-body text-xs text-muted">
      {formatDate(article.publishedAt)} · {getReadingTime(article)} min read
    </p>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive group block rounded-2xl border border-line bg-white p-6 shadow-1 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-8">
          <Chip>{article.category}</Chip>
          <h2 className="mb-3 mt-4 font-heading text-[length:var(--step-3)] font-extrabold text-ink">{article.title}</h2>
          <p className="mb-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
          <ArticleMeta article={article} />
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <span className="inline-flex items-center gap-2 font-heading text-[length:var(--step-0)] font-bold text-brand-ink">
            Read the article
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Tinted-header card: category strip above, title and dek on white below. */
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
        <h3 className="font-heading text-[length:var(--step-1)] font-bold text-ink">{article.title}</h3>
        <p className="mb-3 mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
        <ArticleMeta article={article} />
      </Surface>
    </Link>
  );
}

export default function InsightsPage() {
  // Newest first. The newest article renders as the featured card; the rest fill a grid
  // below it. The page must read as intentional at any article count, so nothing here
  // announces how many there are.
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [featured, ...rest] = sorted;

  // A category with nothing behind it links to an empty listing, so it is not offered.
  const populatedCategories = CATEGORIES.filter((cat) =>
    ARTICLES.some((article) => article.categorySlug === cat.slug),
  );

  return (
    <>
      <PageHero
        eyebrow="Practical thinking"
        title="Insights"
        lead="Practical insight on founder dependency, stronger operating systems, and applied AI for founder-led UAE SMEs."
      />

      {/*
        Filter row. Links rather than client-side filters: each category already
        has a real route at /insights/category/[slug], so filtering here would
        duplicate a page that is in WEB §4's register.
      */}
      {populatedCategories.length > 1 && (
        <Section tone="light" width="narrow" compact aria-label="Browse by topic">
          <nav className="flex flex-wrap gap-2" aria-label="Article categories">
            <Chip href="/insights" active>
              All
            </Chip>
            {populatedCategories.map((cat) => (
              <Chip key={cat.slug} href={`/insights/category/${cat.slug}`}>
                {cat.name}
              </Chip>
            ))}
          </nav>
        </Section>
      )}

      <Section width="narrow">
        <SectionHeader eyebrow="Latest" title="The most recent writing." />
        <div className="mt-10">{featured && <FeaturedCard article={featured} />}</div>

        {rest.length > 0 && (
          <CardGrid className="mt-6" columns={3} scrollReveal>
            {rest.map((article) => (
              <CardGridItem key={article.slug} scrollReveal>
                <ArticleCard article={article} />
              </CardGridItem>
            ))}
          </CardGrid>
        )}
      </Section>

      {populatedCategories.length > 1 && (
        <Section width="narrow" tone="light">
          <SectionHeader eyebrow="Browse by topic" accent="amber" title="Start from a theme." />
          <CardGrid className="mt-10" columns={2} scrollReveal>
            {populatedCategories.map((cat) => (
              <CardGridItem key={cat.slug} scrollReveal>
                <Link
                  href={`/insights/category/${cat.slug}`}
                  className="card-interactive block h-full rounded-2xl border border-line bg-white p-5 shadow-1"
                >
                  <h3 className="mb-2 font-heading text-[length:var(--step-1)] font-bold text-ink">{cat.name}</h3>
                  <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">{cat.desc}</p>
                </Link>
              </CardGridItem>
            ))}
          </CardGrid>
        </Section>
      )}

      {/* Stays on a light band: NewsletterForm carries its own muted privacy line
          and error text, which are built for light ground. */}
      <Section tone="tint" width="wide" orbs>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-3">Newsletter</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">
              Get insights delivered
            </h2>
            <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              Practical operating insight for founder-led UAE SMEs. Delivered when there is something worth sending.
            </p>
          </div>
          <div className="lg:col-span-6">
            <NewsletterForm />
            <p className="mt-4 font-body text-xs text-muted">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
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
