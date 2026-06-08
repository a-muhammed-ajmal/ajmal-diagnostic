import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export const metadata: Metadata = {
  title: 'Insights | SME Growth, Operational Excellence & AI Systems',
  description: 'Practical frameworks and thought leadership for founder-led SME growth across the UAE and GCC.',
};

const categories = [
  { name: 'SME Growth Architecture', desc: 'Scaling frameworks, strategic planning, and growth infrastructure for founder-led businesses.' },
  { name: 'Operational Excellence', desc: 'SOPs, process design, quality systems, and the operational backbone of scalable businesses.' },
  { name: 'AI-Enabled Systems', desc: 'Practical automation, CRM optimization, and AI integration for SME operations.' },
  { name: 'Founder Leadership', desc: 'The mindset shifts, delegation frameworks, and accountability systems that let founders step back.' },
];

export default function InsightsPage() {
  return (
    <>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Thought Leadership</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">Insights</h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto">Practical frameworks for founder-led SME growth across the UAE and GCC.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory border-b border-navy/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-2xl text-navy mb-3">Get insights delivered</h2>
          <p className="font-body text-navy/60 text-sm mb-6">Practical frameworks for scaling your SME. No fluff. Delivered when there is something worth sending.</p>
          <NewsletterForm />
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="font-heading font-bold text-navy text-xs uppercase tracking-widest mb-6 text-center">Upcoming Content Categories</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div key={cat.name} className="bg-ivory border border-navy/10 rounded-xl p-5 hover:border-gold transition-colors">
                <h3 className="font-heading font-bold text-navy text-sm mb-2">{cat.name}</h3>
                <p className="font-body text-xs text-navy/60 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-navy text-ivory">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-xl md:text-2xl mb-3">First articles publishing soon.</h2>
          <p className="font-body text-ivory/60 text-sm leading-relaxed">Subscribe above to be notified. In the meantime, the free diagnostic is the most direct way to apply the framework to your specific business.</p>
        </div>
      </section>
    </>
  );
}
