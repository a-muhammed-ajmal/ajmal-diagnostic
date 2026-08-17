import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
      className="card-interactive block rounded-xl border border-navy/10 bg-ivory p-5 hover:border-gold md:p-6"
    >
      <span className="font-heading text-xs font-bold uppercase tracking-widest text-gold-ink">{article.category}</span>
      <h2 className="mb-1.5 mt-1.5 font-heading text-lg font-bold text-navy">{article.title}</h2>
      <p className="mb-2 font-body text-sm leading-relaxed text-navy/60">{article.excerpt}</p>
      <p className="font-body text-xs text-navy/40">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
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
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/insights" className="text-gold font-heading font-bold text-xs uppercase tracking-widest mb-4 inline-block">&larr; All Insights</Link>
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Category</span>
          <h1 className="mb-5 font-heading text-[length:var(--step-5)] font-extrabold">{category.name}</h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto">{category.desc}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-4xl mx-auto relative z-10">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md py-8 text-center">
              <p className="mb-2 font-heading text-lg font-bold text-navy">Nothing published here yet.</p>
              <p className="mb-6 font-body text-sm text-navy/60">
                In the meantime, the Business Health Check is a practical first view of where
                founder dependency may be appearing.
              </p>
              <Link
                href="/diagnostic"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gold px-8 py-3 font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright"
              >
                Start the Business Health Check &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
