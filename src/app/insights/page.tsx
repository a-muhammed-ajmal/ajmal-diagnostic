import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { pageMetadata } from '@/lib/metadata';
import { formatDate } from '@/lib/utils';
import { ARTICLES, CATEGORIES, getReadingTime, type Article } from '@/lib/articles';

export const metadata = pageMetadata({
  title: 'Insights for Founder-Led UAE SMEs | Muhammed Ajmal Consulting',
  absoluteTitle: true,
  description: 'Practical insights on founder dependency, operating systems, ownership, visibility, and applied AI for founder-led UAE SMEs.',
  path: '/insights',
});

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive block rounded-xl border border-line bg-brand-tint p-6 hover:border-brand md:p-8"
    >
      <span className="font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">{article.category}</span>
      <h2 className="mb-2 mt-2 font-heading text-[length:var(--step-2)] font-extrabold text-ink">{article.title}</h2>
      <p className="mb-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{article.excerpt}</p>
      <p className="mb-3 font-body text-xs text-muted">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
      <span className="font-heading text-[length:var(--step-0)] font-bold text-brand-ink">Read the article &rarr;</span>
    </Link>
  );
}

function CompactCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive block rounded-xl border border-line bg-brand-tint p-5 hover:border-brand"
    >
      <span className="font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">{article.category}</span>
      <h3 className="mb-1.5 mt-1.5 font-heading text-[length:var(--step-0)] font-bold text-ink">{article.title}</h3>
      <p className="mb-2 font-body text-xs leading-relaxed text-muted">{article.excerpt}</p>
      <p className="font-body text-xs text-muted">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
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
      <section className="border-b border-line bg-white text-ink py-16 md:py-20 px-6">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-brand-ink">Practical thinking</p>
          <h1 className="mb-5 font-heading text-[length:var(--step-5)] font-extrabold">Insights</h1>
          <p className="mx-auto max-w-2xl font-body text-[length:var(--step-0)] text-muted">Practical insight on founder dependency, stronger operating systems, and applied AI for founder-led UAE SMEs.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="eyebrow mb-6 text-center text-ink">Latest</p>

          {featured && <FeaturedCard article={featured} />}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {rest.map((a) => (
                <CompactCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-brand-tint border-y border-line relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="heading-reveal mb-3 font-heading text-[length:var(--step-3)] font-extrabold text-ink">Get insights delivered</h2>
          <p className="mb-6 font-body text-[length:var(--step-0)] text-muted">Practical operating insight for founder-led UAE SMEs. Delivered when there is something worth sending.</p>
          <NewsletterForm />
          <p className="mt-4 font-body text-xs text-muted">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {populatedCategories.length > 1 && (
      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="eyebrow mb-6 text-center text-ink">Browse by topic</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {populatedCategories.map(cat => (
              <Link
                key={cat.slug}
                href={`/insights/category/${cat.slug}`}
                className="card-interactive block rounded-xl border border-line bg-brand-tint p-5 hover:border-brand"
              >
                <h3 className="mb-2 font-heading text-[length:var(--step-0)] font-bold text-ink">{cat.name}</h3>
                <p className="font-body text-xs leading-relaxed text-muted">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
