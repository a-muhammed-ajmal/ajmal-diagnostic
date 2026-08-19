import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc, type TocItem } from "@/components/insights/ArticleToc";
import { articleBreadcrumbJsonLd, articleJsonLd, jsonLdScript } from "@/lib/jsonLd";
import { AUTHOR_HEADSHOT, pageMetadata } from "@/lib/metadata";
import { ARTICLES, getArticle, getReadingTime } from "@/lib/articles";
import { formatDate } from "@/lib/utils";

const sectionIds = {
  founderTrap: "founder-trap",
  next: "what-to-examine-next",
  payoff: "business-with-more-than-one-operating-centre",
  start: "where-to-start",
};

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({ title: article.metaTitle, description: article.description, path: `/insights/${article.slug}`, type: "article" });
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const published = formatDate(article.publishedAt);
  const toc: TocItem[] = [
    { id: sectionIds.founderTrap, label: article.founderTrap.heading },
    { id: sectionIds.next, label: article.theFix.heading },
    { id: sectionIds.payoff, label: article.payoff.heading },
    ...(article.whereToStart ? [{ id: sectionIds.start, label: article.whereToStart.heading }] : []),
  ];

  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(article)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleBreadcrumbJsonLd(article)) }} />

      <section className="relative overflow-hidden bg-white px-6 py-16 text-ink md:py-20">
        <div className="relative z-10 mx-auto max-w-3xl">
          <Link href="/insights" className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">← Insights</Link>
          <p className="eyebrow mb-3 text-brand-ink">{article.category}</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">{article.title}</h1>
          <p className="mt-5 font-body text-[length:var(--step-0)] text-muted">By {article.author.name} · {article.author.role} · {published} · {getReadingTime(article)} min read</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-tint px-6 py-12 md:py-16">
        <div className="relative z-10 mx-auto flex max-w-6xl gap-12 lg:items-start">
          <div className="article-longform min-w-0 flex-1 space-y-5">
            {article.intro.map((paragraph) => <p key={paragraph} className="font-body text-[length:var(--step-0)] leading-relaxed text-ink">{paragraph}</p>)}
            <h2 id={sectionIds.founderTrap} className="scroll-mt-24 pt-4 font-heading text-[length:var(--step-3)] font-extrabold text-ink">{article.founderTrap.heading}</h2>
            <p className="font-body text-[length:var(--step-0)] leading-relaxed text-ink">{article.founderTrap.body}</p>

            <h2 id={sectionIds.next} className="scroll-mt-24 pt-4 font-heading text-[length:var(--step-3)] font-extrabold text-ink">{article.theFix.heading}</h2>
            <p className="font-body text-[length:var(--step-0)] leading-relaxed text-ink">{article.theFix.body}</p>
            <ol className="stage-rail pt-2">
              {article.theFix.stages.map((stage) => (
                <li key={stage.n} className="stage-item">
                  <span className="stage-marker" aria-hidden="true">{stage.n}</span>
                  <div className="stage-card stage-reveal rounded-xl bg-white p-5 md:p-6">
                    <div className="flex gap-4">
                      <span className="font-heading text-[length:var(--step-3)] font-extrabold leading-none text-brand-ink md:hidden">{stage.n}</span>
                      <div>
                        <h3 className="font-heading text-[length:var(--step-0)] font-bold text-ink">{stage.name}</h3>
                        <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{stage.body}</p>
                      </div>
                    </div>
                    {stage.practice && <div className="mt-5"><p className="font-heading text-xs font-semibold uppercase tracking-widest text-ink">What this looks like in practice</p><ul className="mt-3 space-y-2">{stage.practice.map((practice) => <li key={practice} className="flex gap-2 font-body text-[length:var(--step-0)] leading-relaxed text-ink"><span className="text-brand-ink" aria-hidden="true">→</span>{practice}</li>)}</ul></div>}
                  </div>
                </li>
              ))}
            </ol>

            <h2 id={sectionIds.payoff} className="scroll-mt-24 pt-4 font-heading text-[length:var(--step-3)] font-extrabold text-ink">{article.payoff.heading}</h2>
            <p className="font-body text-[length:var(--step-0)] leading-relaxed text-ink">{article.payoff.body}</p>
            <blockquote className="border-l-4 border-brand pl-6 font-heading text-[length:var(--step-0)] font-semibold italic leading-relaxed text-ink">{article.payoff.pullQuote}</blockquote>

            {article.whereToStart && <><h2 id={sectionIds.start} className="scroll-mt-24 pt-4 font-heading text-[length:var(--step-3)] font-extrabold text-ink">{article.whereToStart.heading}</h2>{article.whereToStart.body.map((paragraph) => <p key={paragraph} className="font-body text-[length:var(--step-0)] leading-relaxed text-ink">{paragraph}</p>)}</>}

            <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row">
              <Image src={AUTHOR_HEADSHOT.src} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
              <div><p className="font-heading font-bold text-ink">{article.author.name}</p><p className="mt-1 font-body text-xs uppercase tracking-widest text-brand-ink">{article.author.role}</p>{article.author.bioParagraphs.map((paragraph) => <p key={paragraph} className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{paragraph}</p>)}</div>
            </div>
          </div>
          <ArticleToc items={toc} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-6 py-16 text-ink md:py-20">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[length:var(--step-3)] font-extrabold">{article.cta.heading}</h2>
          <p className="mt-4 font-body leading-relaxed text-muted">{article.cta.body}</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-brand px-8 py-4 font-heading text-[length:var(--step-0)] font-bold text-white transition-colors hover:bg-brand-hover">Start the Business Health Check →</Link>
        </div>
      </section>
    </article>
  );
}
