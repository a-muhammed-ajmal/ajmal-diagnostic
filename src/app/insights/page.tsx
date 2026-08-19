import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/Surface';
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

function CategoryTag({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">
      {children}
    </span>
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
          <CategoryTag>{article.category}</CategoryTag>
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

function CompactCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-1"
    >
      <CategoryTag>{article.category}</CategoryTag>
      <h3 className="mb-2 mt-3 font-heading text-[length:var(--step-1)] font-bold text-ink">{article.title}</h3>
      <p className="mb-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
      <div className="mt-auto">
        <ArticleMeta article={article} />
      </div>
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

      <Section width="narrow" tone="light">
        <SectionHeader eyebrow="Latest" title="The most recent writing." />
        <div className="mt-10">{featured && <FeaturedCard article={featured} />}</div>

        {rest.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {rest.map((a) => (
              <CompactCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </Section>

      {populatedCategories.length > 1 && (
        <Section width="narrow">
          <SectionHeader eyebrow="Browse by topic" accent="amber" title="Start from a theme." />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {populatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/insights/category/${cat.slug}`}
                className="card-interactive block rounded-2xl border border-line bg-white p-5 shadow-1"
              >
                <h3 className="mb-2 font-heading text-[length:var(--step-1)] font-bold text-ink">{cat.name}</h3>
                <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Stays on a light band: NewsletterForm carries its own muted privacy line
          and error text, which are built for light ground. */}
      <Section tone="tint" width="wide" orbs>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-3 text-accent-ink">Newsletter</p>
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
    </>
  );
}
