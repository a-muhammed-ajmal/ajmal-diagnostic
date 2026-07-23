import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The 5-Stage Business Operating System Every UAE SME Needs',
  description:
    'How founder-led UAE and GCC SMEs move from owner-dependent to system-driven — a five-stage operating system: Diagnose, Design, Build, Optimize, Scale.',
};

const intro = [
  'Most founder-led businesses in the UAE do not have a growth problem. They have a dependency problem. The business runs on the founder — not on a system — and that single fact quietly caps how large it can become.',
  'I have diagnosed dozens of SMEs across the UAE and GCC, and the ones that break through their ceiling all install the same thing: a business operating system. Five stages that move a company from owner-driven to system-driven to team-enabled.',
];

const stages = [
  { n: '01', name: 'Diagnose', body: 'Find the real constraint before you fix anything. Map where decisions bottleneck, where cash leaks, and where work gets redone. Most founders treat symptoms; the operating system starts with an honest diagnosis.' },
  { n: '02', name: 'Design', body: 'Design the structure before you build it: role scorecards, decision rights, KPIs, and an SOP map. Clarity on paper precedes systems in practice.' },
  { n: '03', name: 'Build', body: 'Install the rails — one CRM, one source of truth, documented golden-path SOPs, and automated lead capture, follow-ups, and reporting.' },
  { n: '04', name: 'Optimize', body: 'Tighten the engine. A weekly KPI rhythm and an issue-solving cadence so quality stops depending on your personal standards.' },
  { n: '05', name: 'Scale', body: 'With the system running, you scale capacity instead of chaos. Develop leaders, expand, and step back — the business holds without you in every room.' },
];

export default function ArticlePage() {
  return (
    <article>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/insights" className="text-gold font-heading font-bold text-xs uppercase tracking-widest mb-4 inline-block">&larr; Insights</Link>
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">SME Growth Architecture</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5 leading-tight">The 5-Stage Business Operating System Every UAE SME Needs</h1>
          <p className="font-body text-ivory/60 text-sm">By Muhammed Ajmal &middot; Strategic Growth Architect &middot; 6 min read</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-5">
          {intro.map((p, i) => (
            <p key={i} className="font-body text-navy/80 text-base md:text-lg leading-relaxed">{p}</p>
          ))}

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">The founder trap</h2>
          <p className="font-body text-navy/80 leading-relaxed">When every decision, every fix, and every key client runs through you, growth slows to the speed of your personal bandwidth. It is not a lack of effort — working harder is exactly what keeps the trap closed.</p>
          <div className="bg-white border-l-4 border-gold rounded-r-lg p-5 shadow-sm">
            <p className="font-heading font-bold text-navy text-lg">97% of small-business owners work weekends — and 40% do so always or often.</p>
            <p className="font-body text-navy/50 text-xs mt-1">Source: The Alternative Board</p>
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">The fix: a business operating system</h2>
          <p className="font-body text-navy/80 leading-relaxed">SMEs power 63.5% of the UAE non-oil economy. The difference between the businesses that scale and the ones that stall is rarely talent or market — it is whether the company is engineered to run without its founder in every room. That engineering happens in five stages.</p>

          <div className="space-y-3 pt-2">
            {stages.map(s => (
              <div key={s.n} className="flex gap-4 bg-white border border-navy/10 rounded-xl p-5">
                <span className="font-heading font-extrabold text-gold-ink text-2xl leading-none">{s.n}</span>
                <div>
                  <h3 className="font-heading font-bold text-navy text-lg mb-1">{s.name}</h3>
                  <p className="font-body text-navy/70 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-l-4 border-gold rounded-r-lg p-5 shadow-sm">
            <p className="font-heading font-bold text-navy text-lg">48% of business failures trace back to running out of cash — almost always visible in the numbers months earlier.</p>
            <p className="font-body text-navy/50 text-xs mt-1">Source: Fortunly, 2025</p>
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-navy pt-4">The payoff is enterprise value</h2>
          <p className="font-body text-navy/80 leading-relaxed">The reward is not only your weekends back. A business that does not depend on one person is worth more — often dramatically more.</p>
          <div className="border-l-4 border-gold pl-6">
            <p className="font-heading text-lg md:text-xl font-semibold italic text-navy/80">Founder-dependent businesses typically sell for 3 to 4x earnings. Systemised, independent ones sell for 7 to 8x — a 30 to 50% difference rooted entirely in whether the business depends on one person.</p>
            <p className="font-body text-navy/50 text-xs mt-2">Source: Brentwood Growth; SE Advisors</p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 bg-navy text-ivory relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl mb-4">Which stage is your bottleneck?</h2>
          <p className="font-body text-ivory/70 mb-8 leading-relaxed">The free 4-minute diagnostic identifies your primary growth constraint and sends a personalised action plan to your inbox.</p>
          <Link href="/diagnostic" className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-10 rounded-xl hover:bg-gold-bright transition-colors shadow-lg text-base min-h-[52px]">Take the Free Diagnostic &rarr;</Link>
        </div>
      </section>
    </article>
  );
}
