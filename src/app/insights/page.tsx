import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { pageMetadata } from '@/lib/metadata';
import { ARTICLES, CATEGORIES, getReadingTime, type Article } from '@/lib/articles';

export const metadata = pageMetadata({
  title: 'SME Growth Insights & Frameworks | Muhammed Ajmal Consulting',
  absoluteTitle: true,
  description: 'Operating systems, process optimization frameworks, and strategies for scaling founder-led UAE SMEs.',
  path: '/insights',
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="block bg-ivory border border-navy/10 rounded-xl p-6 md:p-8 hover:border-gold card-interactive shadow-sm"
    >
      <span className="text-gold-ink text-xs font-heading font-bold uppercase tracking-widest">{article.category}</span>
      <h2 className="font-heading font-extrabold text-xl md:text-2xl text-navy mt-2 mb-2">{article.title}</h2>
      <p className="font-body text-navy/60 text-sm leading-relaxed mb-3">{article.excerpt}</p>
      <p className="font-body text-navy/40 text-xs mb-3">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
      <span className="text-gold-ink font-heading font-bold text-sm">Read the article &rarr;</span>
    </Link>
  );
}

function CompactCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="block bg-ivory border border-navy/10 rounded-xl p-5 hover:border-gold card-interactive shadow-sm"
    >
      <span className="text-gold-ink text-[11px] font-heading font-bold uppercase tracking-widest">{article.category}</span>
      <h3 className="font-heading font-bold text-base md:text-lg text-navy mt-1.5 mb-1.5">{article.title}</h3>
      <p className="font-body text-navy/60 text-xs leading-relaxed mb-2">{article.excerpt}</p>
      <p className="font-body text-navy/40 text-[11px]">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
    </Link>
  );
}

export default function InsightsPage() {
  // Newest first. One article renders as a single featured card; more than one puts the
  // newest as featured with the rest in a grid below.
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [featured, ...rest] = sorted;

  return (
    <>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Thought Leadership</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">Insights</h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto">Practical frameworks for founder-led SME growth across the UAE and GCC.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="font-heading font-bold text-navy text-xs uppercase tracking-widest mb-6 text-center">
            {rest.length > 0 ? 'Latest Articles' : 'Latest Article'}
          </p>

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
        <div className="max-w-xl mx-auto text-center relative z-10">
          <h2 className="font-heading font-extrabold text-2xl text-navy mb-3">Get insights delivered</h2>
          <p className="font-body text-navy/60 text-sm mb-6">Practical frameworks for scaling your SME. No fluff. Delivered when there is something worth sending.</p>
          <NewsletterForm />
          <p className="font-body text-navy/50 text-xs mt-4">No spam. Unsubscribe anytime. Typically one email a month.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="font-heading font-bold text-navy text-xs uppercase tracking-widest mb-6 text-center">Content Categories</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const count = ARTICLES.filter(a => a.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/insights/category/${cat.slug}`}
                  className="block bg-ivory border border-navy/10 rounded-xl p-5 hover:border-gold card-interactive"
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="font-heading font-bold text-navy text-sm">{cat.name}</h3>
                    <span className="font-body text-[11px] text-navy/40 whitespace-nowrap">
                      {count} {count === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                  <p className="font-body text-xs text-navy/60 leading-relaxed">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
