import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc, type TocItem } from "@/components/insights/ArticleToc";
import { articleBreadcrumbJsonLd, articleJsonLd, jsonLdScript } from "@/lib/jsonLd";
import { AUTHOR_HEADSHOT, pageMetadata } from "@/lib/metadata";
import { ARTICLES, getArticle, getReadingTime } from "@/lib/articles";

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

  const published = new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
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

      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Link href="/insights" className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-widest text-gold">← Insights</Link>
          <p className="eyebrow mb-3 text-gold">{article.category}</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">{article.title}</h1>
          <p className="mt-5 font-body text-sm text-ivory/60">By {article.author.name} · {article.author.role} · {published} · {getReadingTime(article)} min read</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-12 md:py-16">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto flex max-w-6xl gap-12 lg:items-start">
          <div className="article-longform min-w-0 flex-1 space-y-5">
            {article.intro.map((paragraph) => <p key={paragraph} className="font-body text-base leading-relaxed text-navy/80">{paragraph}</p>)}
            <h2 id={sectionIds.founderTrap} className="scroll-mt-24 pt-4 font-heading text-2xl font-extrabold text-navy">{article.founderTrap.heading}</h2>
            <p className="font-body text-base leading-relaxed text-navy/80">{article.founderTrap.body}</p>

            <h2 id={sectionIds.next} className="scroll-mt-24 pt-4 font-heading text-2xl font-extrabold text-navy">{article.theFix.heading}</h2>
            <p className="font-body text-base leading-relaxed text-navy/80">{article.theFix.body}</p>
            <ol className="stage-rail pt-2">
              {article.theFix.stages.map((stage) => (
                <li key={stage.n} className="stage-item">
                  <span className="stage-marker" aria-hidden="true">{stage.n}</span>
                  <div className="stage-card stage-reveal rounded-xl bg-white p-5 md:p-6">
                    <div className="flex gap-4">
                      <span className="font-heading text-2xl font-extrabold leading-none text-gold-ink md:hidden">{stage.n}</span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-navy">{stage.name}</h3>
                        <p className="mt-2 font-body text-sm leading-relaxed text-navy/70">{stage.body}</p>
                      </div>
                    </div>
                    {stage.practice && <div className="mt-5"><p className="font-heading text-xs font-semibold uppercase tracking-widest text-navy">What this looks like in practice</p><ul className="mt-3 space-y-2">{stage.practice.map((practice) => <li key={practice} className="flex gap-2 font-body text-sm leading-relaxed text-navy/75"><span className="text-gold-ink" aria-hidden="true">→</span>{practice}</li>)}</ul></div>}
                  </div>
                </li>
              ))}
            </ol>

            <h2 id={sectionIds.payoff} className="scroll-mt-24 pt-4 font-heading text-2xl font-extrabold text-navy">{article.payoff.heading}</h2>
            <p className="font-body text-base leading-relaxed text-navy/80">{article.payoff.body}</p>
            <blockquote className="border-l-4 border-gold pl-6 font-heading text-lg font-semibold italic leading-relaxed text-navy/80">{article.payoff.pullQuote}</blockquote>

            {article.whereToStart && <><h2 id={sectionIds.start} className="scroll-mt-24 pt-4 font-heading text-2xl font-extrabold text-navy">{article.whereToStart.heading}</h2>{article.whereToStart.body.map((paragraph) => <p key={paragraph} className="font-body text-base leading-relaxed text-navy/80">{paragraph}</p>)}</>}

            <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-navy/10 bg-white p-6 sm:flex-row">
              <Image src={AUTHOR_HEADSHOT.src} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
              <div><p className="font-heading font-bold text-navy">{article.author.name}</p><p className="mt-1 font-body text-xs uppercase tracking-widest text-gold-ink">{article.author.role}</p>{article.author.bioParagraphs.map((paragraph) => <p key={paragraph} className="mt-2 font-body text-sm leading-relaxed text-navy/65">{paragraph}</p>)}</div>
            </div>
          </div>
          <ArticleToc items={toc} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[length:var(--step-3)] font-extrabold">{article.cta.heading}</h2>
          <p className="mt-4 font-body leading-relaxed text-ivory/70">{article.cta.body}</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 py-4 font-heading text-base font-bold text-navy transition-colors hover:bg-gold-bright">Take the Free Diagnostic →</Link>
        </div>
      </section>
    </article>
  );
}
