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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="block bg-ivory border border-navy/10 rounded-xl p-5 md:p-6 hover:border-gold card-interactive shadow-sm"
    >
      <span className="text-gold-ink text-[11px] font-heading font-bold uppercase tracking-widest">{article.category}</span>
      <h2 className="font-heading font-bold text-lg text-navy mt-1.5 mb-1.5">{article.title}</h2>
      <p className="font-body text-navy/60 text-sm leading-relaxed mb-2">{article.excerpt}</p>
      <p className="font-body text-navy/40 text-[11px]">{formatDate(article.publishedAt)} · {getReadingTime(article)} min read</p>
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
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">{category.name}</h1>
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
            <div className="text-center max-w-md mx-auto py-8">
              <p className="font-heading font-bold text-navy text-lg mb-2">No articles here yet.</p>
              <p className="font-body text-navy/60 text-sm mb-6">
                Writing on {category.name.toLowerCase()} is on the way. In the meantime, the free
                diagnostic is the fastest way to find your primary growth constraint.
              </p>
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-3 px-8 rounded-xl text-sm hover:bg-gold-bright transition-colors min-h-[48px]"
              >
                Take the Free Diagnostic &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
