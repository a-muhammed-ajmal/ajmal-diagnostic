import Link from 'next/link';
import Image from 'next/image';
import { getArticle, getReadingTime, type ArticleStat } from '@/lib/articles';
import { pageMetadata, AUTHOR_HEADSHOT } from '@/lib/metadata';
import { articleJsonLd, articleBreadcrumbJsonLd, jsonLdScript } from '@/lib/jsonLd';
import { ArticleToc, type TocItem } from '@/components/insights/ArticleToc';

const article = getArticle('the-5-stage-business-operating-system')!;

const SECTION_IDS = {
  founderTrap: 'the-founder-trap',
  theFix: 'the-fix',
  payoff: 'enterprise-value',
  whereToStart: 'where-to-start',
} as const;

const baseMetadata = pageMetadata({
  title: article.metaTitle,
  absoluteTitle: true,
  description: article.description,
  path: `/insights/${article.slug}`,
  type: 'article',
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author.name],
  },
};

function StatCallout({ stat }: { stat: ArticleStat }) {
  return (
    <div className="bg-white border-l-4 border-gold rounded-r-xl p-5 md:p-6 shadow-sm my-6">
      <p className="font-heading font-extrabold text-navy text-4xl md:text-5xl leading-none mb-3 gold-gradient-text">
        {stat.value}
      </p>
      <p className="font-heading font-bold text-navy text-base md:text-lg leading-snug">{stat.statement}</p>
      <p className="font-body text-navy/50 text-xs mt-3">
        Source:{' '}
        {stat.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-ink underline hover:text-gold transition-colors"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

export default function ArticlePage() {
  const readingTime = getReadingTime(article);
  const publishedLabel = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tocItems: TocItem[] = [
    { id: SECTION_IDS.founderTrap, label: article.founderTrap.heading },
    { id: SECTION_IDS.theFix, label: article.theFix.heading },
    { id: SECTION_IDS.payoff, label: article.payoff.heading },
    ...(article.whereToStart ? [{ id: SECTION_IDS.whereToStart, label: article.whereToStart.heading }] : []),
  ];

  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleBreadcrumbJsonLd(article)) }}
      />

      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/insights" className="text-gold font-heading font-bold text-xs uppercase tracking-widest mb-4 inline-block">&larr; Insights</Link>
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5 leading-tight">{article.title}</h1>
          <p className="font-body text-ivory/60 text-sm">
            By {article.author.name} &middot; {article.author.role} &middot; {publishedLabel} &middot; {readingTime} min read
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-3xl lg:max-w-6xl mx-auto relative z-10 lg:flex lg:gap-12 lg:items-start">
          <div className="article-longform lg:flex-1 lg:min-w-0 space-y-5">
            {article.intro.map((p, i) => (
              <p key={i} className="font-body text-navy/80 leading-relaxed">{p}</p>
            ))}

            <h2 id={SECTION_IDS.founderTrap} className="font-heading font-extrabold text-2xl text-navy pt-4 scroll-mt-24">{article.founderTrap.heading}</h2>
            <p className="font-body text-navy/80 leading-relaxed">{article.founderTrap.body}</p>
            <StatCallout stat={article.founderTrap.stat} />

            <h2 id={SECTION_IDS.theFix} className="font-heading font-extrabold text-2xl text-navy pt-4 scroll-mt-24">{article.theFix.heading}</h2>
            <StatCallout stat={article.theFix.stat} />
            <p className="font-body text-navy/80 leading-relaxed">{article.theFix.body}</p>

            <ol className="stage-rail pt-2">
              {article.theFix.stages.map(s => (
                <li key={s.n} className="stage-item">
                  <span className="stage-marker" aria-hidden="true">{s.n}</span>
                  <div className="stage-card stage-reveal bg-white rounded-xl p-5 md:p-6">
                    <div className="flex gap-4">
                      <span className="md:hidden font-heading font-extrabold text-gold-ink text-2xl leading-none">{s.n}</span>
                      <div>
                        <h3 className="font-heading font-bold text-navy text-lg mb-1">{s.name}</h3>
                        <p className="font-body text-navy/70 text-sm leading-relaxed">{s.body}</p>
                      </div>
                    </div>

                    {s.practice && s.practice.length > 0 && (
                      <div className="mt-5">
                        <p className="font-heading font-semibold text-navy text-xs uppercase tracking-widest mb-3">What this looks like in practice</p>
                        <ul className="space-y-2">
                          {s.practice.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 font-body text-sm text-navy/80 leading-relaxed">
                              <span className="text-gold-ink font-bold mt-0.5 flex-shrink-0">&rarr;</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.ask && (
                      <div className="mt-5">
                        <p className="font-heading font-semibold text-gold-ink text-xs uppercase tracking-widest mb-1">Ask yourself</p>
                        <p className="font-body italic text-navy/80 text-sm md:text-base leading-relaxed">{s.ask}</p>
                      </div>
                    )}
                  </div>

                  {s.n === '03' && (
                    <p className="font-body text-navy/70 text-sm md:text-base text-center pt-6">
                      Not sure which stage is yours?{' '}
                      <Link href="/diagnostic" className="text-gold-ink font-heading font-bold underline hover:text-gold transition-colors">
                        The free 4-minute diagnostic names it &rarr;
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ol>

            <h2 id={SECTION_IDS.payoff} className="font-heading font-extrabold text-2xl text-navy pt-4 scroll-mt-24">{article.payoff.heading}</h2>
            <p className="font-body text-navy/80 leading-relaxed">{article.payoff.body}</p>
            <div className="border-l-4 border-gold pl-6">
              <p className="font-heading text-lg md:text-xl font-semibold italic text-navy/80">{article.payoff.pullQuote}</p>
            </div>

            {article.whereToStart && (
              <>
                <h2 id={SECTION_IDS.whereToStart} className="font-heading font-extrabold text-2xl text-navy pt-4 scroll-mt-24">{article.whereToStart.heading}</h2>
                {article.whereToStart.body.map((p, i) => (
                  <p key={i} className="font-body text-navy/80 leading-relaxed">{p}</p>
                ))}
              </>
            )}

            {/*
              Author bio. alt="" because the name and role sit directly beside the photo —
              a real alt would just repeat them. No overflow-hidden on the wrapper: the
              gold corner bracket is deliberately outside the box and would be clipped.
            */}
            <div className="mt-6 flex flex-col sm:flex-row gap-5 items-start bg-white border border-navy/10 rounded-xl p-6">
              <div className="relative w-16 h-16 flex-shrink-0 border-2 border-navy/15 rounded-lg bg-navy">
                <Image
                  src={AUTHOR_HEADSHOT.src}
                  alt=""
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute -right-1 -top-1 w-2.5 h-2.5 border-t-2 border-r-2 border-gold" />
              </div>
              <div>
                <p className="font-heading font-bold text-navy text-base">{article.author.name}</p>
                <p className="font-body text-gold-ink text-xs uppercase tracking-widest mb-3">{article.author.role}</p>
                {article.author.bioParagraphs.map((p, i) => (
                  <p key={i} className="font-body text-navy/70 text-sm leading-relaxed mb-2">{p}</p>
                ))}
                <Link href="/about" className="font-body text-gold-ink text-sm font-heading font-bold underline hover:text-gold transition-colors">
                  More about Muhammed Ajmal &rarr;
                </Link>
              </div>
            </div>
          </div>

          <ArticleToc items={tocItems} />
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 bg-navy text-ivory relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl mb-4">{article.cta.heading}</h2>
          <p className="font-body text-ivory/70 mb-8 leading-relaxed">{article.cta.body}</p>
          <Link href="/diagnostic" className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-10 rounded-xl hover:bg-gold-bright transition-colors shadow-lg text-base min-h-[52px]">Take the Free Diagnostic &rarr;</Link>
        </div>
      </section>
    </article>
  );
}
