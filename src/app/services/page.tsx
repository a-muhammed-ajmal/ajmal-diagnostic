import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Consulting Services',
  description: 'Consulting services for founder-led SMEs across the UAE and GCC — from a free growth diagnostic to strategic planning, systems development, process optimization, performance management, and AI automation.',
  path: '/services',
});

const services = [
  { n: '01', name: 'Business Growth Diagnostic', stage: 'Diagnose', problem: 'You sense there is a growth constraint but cannot pinpoint which system, team issue, or strategic gap is causing it.', deliverables: ['10-dimension business health assessment', 'Primary and secondary constraint identification', 'AI-generated 30-day and 90-day action plan', 'Strategic priorities report'], ideal: 'Founder-led SMEs with AED 500K–15M revenue ready to understand the real bottleneck before investing in solutions.' },
  { n: '02', name: 'Strategic Planning', stage: 'Design', problem: 'Your business has no documented strategy. Decisions are made reactively, priorities shift constantly, and your team cannot execute independently.', deliverables: ['12-month strategic plan', 'Decision-making framework', 'Quarterly review rhythm setup', 'SMART goals at company and department level'], ideal: 'Founders transitioning from intuition-led to strategy-led operations.' },
  { n: '03', name: 'Business Systems Development', stage: 'Build', problem: 'Critical knowledge lives in individuals\' heads. Delivery quality varies by who is involved. There are no documented, replicable standard operating procedures.', deliverables: ['Core SOP library across Sales, Onboarding, Delivery, Finance, HR', 'Process mapping current and future state', 'CRM implementation or optimization', 'Meeting rhythm structure and templates'], ideal: 'SMEs with 5–50 employees where delivery quality is inconsistent and the founder spends significant time on tasks the team should own.' },
  { n: '04', name: 'Process Optimization', stage: 'Optimize', problem: 'Systems exist but are not followed. Workflows have accumulated inefficiency. Waste and rework are consuming team capacity.', deliverables: ['Bottleneck analysis and root-cause mapping', 'Workflow redesign and optimization', 'Automation opportunity audit', 'Capacity planning and utilization report'], ideal: 'Businesses with existing systems that need to be tightened and made to work without constant founder supervision.' },
  { n: '05', name: 'Performance Management', stage: 'Optimize / Scale', problem: 'Team members do not know what success looks like. Performance reviews are gut-feel. Issues consistently escalate to the founder.', deliverables: ['Role scorecards with KPIs for each position', '30-60-90 day plans for all key roles', 'Weekly 1:1 and performance review templates', 'Escalation protocols and decision rights framework'], ideal: 'Founder-led businesses with 3+ team members where accountability is informal.' },
  { n: '06', name: 'AI & Automation Advisory', stage: 'Build / Scale', problem: 'AI feels like experimentation rather than measurable operational value. Manual repetitive tasks consume team capacity.', deliverables: ['AI readiness assessment', 'Automation opportunity audit', 'Workflow design and Make.com/n8n/Zapier implementation', 'CRM automation and lead routing'], ideal: 'SMEs ready to treat AI as operational infrastructure — automating lead qualification, follow-up, reporting, and client communication.' },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Consulting Services</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">Precision Interventions for<br /><span className="gold-gradient-text">Founder-Led Growth</span></h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Six services, each designed to address a specific stage in the Strategic Growth Architecture™.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
          {services.map(s => (
            <div key={s.n} className="bg-white p-7 md:p-8 rounded-xl border border-navy/10 hover:border-gold card-interactive flex flex-col">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-navy text-gold rounded flex items-center justify-center font-heading font-bold text-xl">{s.n}</div>
                <span className="text-xs font-heading font-semibold text-ivory bg-navy px-3 py-1 rounded-full">{s.stage}</span>
              </div>
              <h3 className="font-heading font-bold text-navy text-lg md:text-xl mb-3">{s.name}</h3>
              <p className="font-body text-sm text-navy/60 mb-5 leading-relaxed flex-grow">{s.problem}</p>
              <div className="mb-5">
                <p className="font-heading font-semibold text-navy text-xs uppercase tracking-widest mb-3">Deliverables</p>
                <ul className="space-y-2">
                  {s.deliverables.map(d => (
                    <li key={d} className="flex items-start gap-2 font-body text-sm text-navy/80">
                      <span className="text-emerald-ink font-bold mt-0.5 flex-shrink-0">✔</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ivory border border-navy/10 rounded-lg p-3 mb-5">
                <p className="font-heading font-semibold text-navy text-[10px] uppercase tracking-widest mb-1">Ideal For</p>
                <p className="font-body text-xs text-navy/70 leading-relaxed">{s.ideal}</p>
              </div>
              <Link href="/contact" className="w-full text-center text-gold-ink font-heading font-bold text-sm uppercase tracking-wider hover:text-gold transition-colors">
                Book a Strategy Call →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-navy text-ivory relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl mb-4">Not sure which service fits?</h2>
          <p className="font-body text-ivory/70 mb-8 leading-relaxed text-sm md:text-base">Start with the free diagnostic. It identifies your primary constraint in 4 minutes — and the right service becomes obvious from your results.</p>
          <Link href="/diagnostic" className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-10 rounded-xl text-base hover:bg-gold-bright transition-colors min-h-[52px] w-full sm:w-auto">
            Start Your Free Diagnostic →
          </Link>
        </div>
      </section>
    </>
  );
}
