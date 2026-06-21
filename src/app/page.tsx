import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Muhammed Ajmal Consulting | Strategic Growth Architect — Dubai, UAE',
  description:
    'Scale your UAE or GCC SME without daily founder intervention. Strategic Growth Architecture™ — Diagnose → Design → Build → Optimize → Scale. Free diagnostic.',
};

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy text-ivory py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">

          {/* Left */}
          <div>
            <span className="reveal text-gold font-heading font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">
              Strategic Growth Architect for Founder-Led SMEs · UAE &amp; GCC
            </span>
            <h1 className="reveal text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-heading font-extrabold leading-tight mb-6">
              Escape the Founder Trap.<br />
              <span className="gold-gradient-text">Engineer Scalable Growth.</span>
            </h1>
            <p className="reveal font-body text-ivory/90 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Scale your SME without your daily intervention. We engineer the growth infrastructure for UAE &amp; GCC
              founder-led businesses through Strategic Planning, Business Systems, and Operational Excellence.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-8 rounded hover:bg-gold-bright transition-colors shadow-lg text-base min-h-[52px]"
              >
                Discover Your Business Constraint →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-gold/50 text-gold font-heading font-bold py-4 px-8 rounded hover:bg-gold/10 transition-colors text-base min-h-[52px]"
              >
                Book a Strategy Call
              </Link>
            </div>
          </div>

          {/* Right — SGA™ Card */}
          <div className="relative h-72 md:h-80 w-full flex items-center justify-center">
            <div className="hidden sm:block absolute w-64 h-64 border border-gold/20 rounded-full animate-[spin_25s_linear_infinite]" />
            <div className="hidden sm:block absolute w-80 h-80 border border-gold/10 rounded-full animate-[spin_35s_linear_infinite_reverse]" />
            <div className="bg-navy border border-gold/40 p-6 md:p-8 rounded-xl shadow-2xl relative z-10 max-w-xs w-full text-center">
              <div className="text-gold font-heading font-bold text-2xl mb-1">SGA™</div>
              <div className="text-[10px] text-ivory/60 uppercase tracking-widest mb-5 text-center">
                Strategic Growth Architecture™
              </div>
              <div className="space-y-2">
                {[
                  'Strategic Clarity',
                  'Operational Systems',
                  'Team Accountability',
                  'Revenue Predictability',
                  'Scalable Growth',
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-ivory/5 border border-ivory/10 p-2.5 text-xs text-left flex justify-between items-center rounded"
                  >
                    <span className="text-ivory/80">{item}</span>
                    <span className="text-emerald font-bold">✔</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS STRIP ────────────────────────────────────────────────── */}
      <section className="bg-gold py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-2 text-navy font-heading font-bold text-xs md:text-sm">
          {['Diagnose', 'Design', 'Build', 'Optimize', 'Scale'].map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span>{step}</span>
              {i < 4 && <span className="text-navy/40">→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM ──────────────────────────────────────────────────────── */}
      <section id="problem" className="py-16 md:py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-crimson font-heading font-bold tracking-widest text-sm uppercase mb-2 block">
              The Critical Constraint
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-navy mb-4">
              4 Symptoms of the Founder Trap
            </h2>
            <p className="font-body text-navy/70 max-w-2xl mx-auto text-sm md:text-base">
              Why your business cannot scale past its current ceiling without systemic intervention.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: '01',
                title: 'Approval Bottlenecks',
                body: 'Every decision, minor or major, requires founder sign-off, slowing execution to your personal bandwidth.',
              },
              {
                n: '02',
                title: 'Hero Culture',
                body: 'Reliance on ad-hoc individual effort rather than repeatable, documented systems that anyone can follow.',
              },
              {
                n: '03',
                title: 'Firefighting Cycle',
                body: 'Strategic planning is constantly derailed by daily operational emergencies that should never reach you.',
              },
              {
                n: '04',
                title: 'Stagnant Quality',
                body: 'As client volume increases, delivery quality fluctuates because your standards exist only in your head.',
              },
            ].map((card) => (
              <div
                key={card.n}
                className="bg-white p-7 rounded-xl shadow-sm border border-navy/10 hover:border-crimson/30 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-crimson transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="w-10 h-10 bg-crimson/10 text-crimson rounded-full flex items-center justify-center font-heading font-bold text-sm mb-5">
                  {card.n}
                </div>
                <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-3">{card.title}</h3>
                <p className="font-body text-sm text-navy/70 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION / 3 PILLARS ─────────────────────────────────────────── */}
      <section id="solution" className="py-16 md:py-24 px-6 bg-navy text-ivory border-y border-gold/20 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-emerald font-heading font-bold tracking-widest text-sm uppercase mb-2 block">
              The Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">
              The 3 Pillars of Scalability
            </h2>
            <p className="font-body text-ivory/70 max-w-2xl mx-auto text-sm md:text-base">
              Transitioning from Owner-Driven to System-Driven and Team-Enabled.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-gold/20 rounded-xl overflow-hidden">
            {[
              {
                pillar: 'Pillar 1',
                title: 'Committed & Competent Teams',
                body: 'A scalable business is built on collective ownership. We install the A.S.K. framework, role scorecards, and accountability cadence.',
                items: ['A.S.K. Framework Hiring', 'Role Scorecards & KPIs', 'Accountability Cadence'],
                bg: 'bg-navy/50',
              },
              {
                pillar: 'Pillar 2',
                title: 'Simple & Sustainable Systems',
                body: 'Complexity is the enemy of execution. We build lightweight, clear standard operating procedures and meeting rhythms.',
                items: ['"Golden Path" Process SOPs', 'Measured Execution Systems', 'Optimized Delegation Rules'],
                bg: 'bg-gold/5',
              },
              {
                pillar: 'Pillar 3',
                title: 'Profitable & Magnetic Strategies',
                body: 'Deploy marketing, sales, and delivery strategies that operate predictably without you at the centre.',
                items: ['Predictable Revenue Engine', 'High-Margin Business Models', 'Institutional Valuation Growth'],
                bg: 'bg-navy/50',
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`p-8 md:p-10 ${p.bg} ${
                  i < 2 ? 'border-b md:border-b-0 md:border-r border-gold/20' : ''
                } hover:bg-gold/10 transition-colors duration-300`}
              >
                <div className="text-gold font-heading font-bold text-sm md:text-base mb-3">{p.pillar}</div>
                <h3 className="font-heading font-bold text-xl md:text-2xl mb-4 text-ivory">{p.title}</h3>
                <p className="font-body text-sm text-ivory/70 mb-6 leading-relaxed">{p.body}</p>
                <ul className="space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-body text-sm text-ivory/90">
                      <span className="text-emerald font-bold mt-0.5">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY EXPERIENCE ──────────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-6 bg-gray-50 border-b border-navy/10 relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-center text-navy/40 font-body text-xs uppercase tracking-widest mb-8 font-semibold">
            Industry Experience Across
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                co: 'Food & Beverages Sector',
                result: 'SOP systems development, inventory optimization, and operational workflow design.',
              },
              {
                co: 'Corporate Services Sector',
                result:
                  'Financial strategy and advisory, business advisory frameworks, and pipeline management systems.',
              },
              {
                co: 'Technology & Solutions Sector',
                result:
                  'Lead generation systems, marketing automation architecture, analytics, and performance reporting.',
              },
            ].map((anchor) => (
              <div
                key={anchor.co}
                className="bg-white border border-navy/10 rounded-xl p-6 hover:border-gold/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-2 h-2 bg-gold rounded-full mb-3" />
                <p className="font-heading font-bold text-navy text-sm mb-2">{anchor.co}</p>
                <p className="font-body text-xs text-navy/60 leading-relaxed">{anchor.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 bg-navy text-ivory relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-extrabold mb-6">
            What is the biggest constraint in your business?
          </h2>
          <p className="font-body text-base md:text-lg text-ivory/70 mb-10">
            Answer 10 questions. In 4 minutes, identify the single constraint blocking your growth — with a
            personalised AI Action Plan delivered to your inbox.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 md:py-5 px-10 md:px-12 rounded text-base md:text-lg hover:bg-gold-bright transition-colors shadow-lg min-h-[52px] w-full sm:w-auto"
          >
            Start Your Free Diagnostic →
          </Link>
          <p className="text-ivory/30 font-body text-sm mt-4">
            4 minutes · No account required · Report delivered by email
          </p>
          <div className="pt-10 md:pt-12 border-t border-gold/20 mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-10">
            {[
              { stat: '10k+', label: 'LinkedIn Network' },
              { stat: 'UAE/GCC', label: 'Primary Market' },
              { stat: 'AI', label: 'Enabled Systems' },
              { stat: '6', label: 'Business Languages' },
            ].map((s) => (
              <div key={s.stat} className="text-center">
                <div className="font-heading font-bold text-xl md:text-2xl text-gold">{s.stat}</div>
                <div className="font-body text-xs uppercase tracking-widest text-ivory/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}