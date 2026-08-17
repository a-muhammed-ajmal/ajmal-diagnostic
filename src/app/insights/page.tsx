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
      className="card-interactive block rounded-xl border border-navy/10 bg-ivory p-6 hover:border-gold md:p-8"
    >
      <span className="font-heading text-xs font-bold uppercase tracking-widest text-gold-ink">{article.category}</span>
      <h2 className="mb-2 mt-2 font-heading text-xl font-extrabold text-navy md:text-2xl">{article.title}</h2>
      <p className="mb-3 font-body text-sm leading-relaxed text-navy/60">{article.excerpt}</p>
      <p className="mb-3 font-body text-xs text-navy/40">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
      <span className="font-heading text-sm font-bold text-gold-ink">Read the article &rarr;</span>
    </Link>
  );
}

function CompactCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-interactive block rounded-xl border border-navy/10 bg-ivory p-5 hover:border-gold"
    >
      <span className="font-heading text-xs font-bold uppercase tracking-widest text-gold-ink">{article.category}</span>
      <h3 className="mb-1.5 mt-1.5 font-heading text-base font-bold text-navy md:text-lg">{article.title}</h3>
      <p className="mb-2 font-body text-xs leading-relaxed text-navy/60">{article.excerpt}</p>
      <p className="font-body text-xs text-navy/40">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
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
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-gold">Practical thinking</p>
          <h1 className="mb-5 font-heading text-[length:var(--step-5)] font-extrabold">Insights</h1>
          <p className="mx-auto max-w-2xl font-body text-base text-ivory/70 md:text-lg">Practical insight on founder dependency, stronger operating systems, and applied AI for founder-led UAE SMEs.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="eyebrow mb-6 text-center text-navy">Latest</p>

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

      <section className="py-12 md:py-16 px-6 bg-ivory border-y border-navy/10 relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="heading-reveal mb-3 font-heading text-2xl font-extrabold text-navy">Get insights delivered</h2>
          <p className="mb-6 font-body text-sm text-navy/60">Practical operating insight for founder-led UAE SMEs. Delivered when there is something worth sending.</p>
          <NewsletterForm />
          <p className="mt-4 font-body text-xs text-navy/50">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {populatedCategories.length > 1 && (
      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="eyebrow mb-6 text-center text-navy">Browse by topic</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {populatedCategories.map(cat => (
              <Link
                key={cat.slug}
                href={`/insights/category/${cat.slug}`}
                className="card-interactive block rounded-xl border border-navy/10 bg-ivory p-5 hover:border-gold"
              >
                <h3 className="mb-2 font-heading text-sm font-bold text-navy">{cat.name}</h3>
                <p className="font-body text-xs leading-relaxed text-navy/60">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
