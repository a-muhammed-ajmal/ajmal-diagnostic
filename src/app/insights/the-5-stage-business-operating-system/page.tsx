import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticle, getReadingTime, type ArticleStat } from '@/lib/articles';

const article = getArticle('the-5-stage-business-operating-system')!;

export const metadata: Metadata = {
  title: article.metaTitle,
  description: article.description,
};

function StatCallout({ stat }: { stat: ArticleStat }) {
  return (
    <div className="bg-white border-l-4 border-gold rounded-r-lg p-5 shadow-sm">
      <p className="font-heading font-bold text-navy text-lg">{stat.statement}</p>
      <p className="font-body text-navy/50 text-xs mt-2">
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

  return (
    <article>
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
        <div className="max-w-3xl mx-auto relative z-10 space-y-5">
          {article.intro.map((p, i) => (
            <p key={i} className="font-body text-navy/80 text-base md:text-lg leading-relaxed">{p}</p>
          ))}

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">{article.founderTrap.heading}</h2>
          <p className="font-body text-navy/80 leading-relaxed">{article.founderTrap.body}</p>
          <StatCallout stat={article.founderTrap.stat} />

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">{article.theFix.heading}</h2>
          <StatCallout stat={article.theFix.stat} />
          <p className="font-body text-navy/80 leading-relaxed">{article.theFix.body}</p>

          <div className="space-y-3 pt-2">
            {article.theFix.stages.map(s => (
              <div key={s.n} className="flex gap-4 bg-white border border-navy/10 rounded-xl p-5">
                <span className="font-heading font-extrabold text-gold-ink text-2xl leading-none">{s.n}</span>
                <div>
                  <h3 className="font-heading font-bold text-navy text-lg mb-1">{s.name}</h3>
                  <p className="font-body text-navy/70 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">{article.payoff.heading}</h2>
          <p className="font-body text-navy/80 leading-relaxed">{article.payoff.body}</p>
          <div className="border-l-4 border-gold pl-6">
            <p className="font-heading text-lg md:text-xl font-semibold italic text-navy/80">{article.payoff.pullQuote}</p>
          </div>
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
