import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Muhammed Ajmal | Strategic Growth Architect',
  description: 'Dubai-based Strategic Growth Architect helping founder-led SMEs across the UAE and GCC build scalable, system-driven businesses.',
};

const credentials = [
  'Google AI Professional Certificate 2026 — Credential: SCSUP9BBKX10',
  'AI for Brainstorming and Planning — Google (2026)',
  'Business Development Foundations — LinkedIn (2024)',
  'Mastering Project Management — LinkedIn (2024)',
  'Basics of Business Consulting — Alison (2024)',
  'Advanced Diploma in Digital Marketing — Digimark Academy (2022)',
];

const languages = ['English', 'Arabic / MSA', 'Hindi', 'Malayalam', 'Tamil', 'Kannada'];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Authority Profile</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">The Architect</h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto">Strategic Growth Architect for founder-led SMEs across the UAE and GCC.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-ivory">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="w-full aspect-[4/5] bg-navy rounded-xl relative shadow-xl overflow-hidden flex items-end max-w-sm mx-auto md:max-w-none">
              <div className="absolute inset-0 border-4 border-gold/20 m-4 rounded-lg pointer-events-none" />
              <div className="p-6 md:p-8 w-full bg-gradient-to-t from-navy via-navy/60 to-transparent">
                <div className="font-heading font-bold text-ivory text-xl md:text-2xl">Muhammed Ajmal</div>
                <div className="text-gold text-xs tracking-widest uppercase mt-1">Strategic Growth Architect · Dubai, UAE</div>
              </div>
            </div>
          </div>

          <div className="md:w-3/5">
            <span className="text-gold font-heading font-bold tracking-widest text-xs uppercase mb-2 block">Who I Am</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-navy mb-6">I built the system. My team implements the framework.</h2>
            <p className="font-body text-navy/70 leading-relaxed mb-5 text-sm md:text-base">As a specialist in SME Strategic Management and Operational Excellence in the UAE and GCC, I help founders transition from exhausting daily operations to engineering genuine enterprise value. My practice focuses on engineering the growth infrastructure of a business — not just advising.</p>
            <p className="font-body text-navy/70 leading-relaxed mb-6 text-sm md:text-base">My background spans strategic management, warehouse and supply chain operations, commercial services, project execution, and business growth initiatives across the UAE market — covering food and beverages, financial advisory, and marketing automation.</p>

            <div className="border-l-4 border-gold pl-5 md:pl-6 mb-8">
              <p className="font-heading text-base md:text-lg font-semibold italic text-navy/80">"What gets you to AED 1 Million will actively prevent you from reaching AED 10 Million without the right architecture."</p>
            </div>

            <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-4">Professional Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {credentials.map(c => (
                <div key={c} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-navy/5">
                  <div className="w-2 h-2 bg-gold rounded-full mt-1.5 flex-shrink-0" />
                  <span className="font-body text-xs font-medium text-navy/80 leading-snug">{c}</span>
                </div>
              ))}
            </div>

            <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-4">Multilingual Business Communication</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {languages.map(lang => (
                <span key={lang} className="bg-navy text-gold text-xs font-heading font-semibold px-3 py-1.5 rounded-full">{lang}</span>
              ))}
            </div>

            <div className="bg-navy rounded-xl p-5 md:p-6">
              <p className="text-gold font-heading font-bold tracking-widest text-xs uppercase mb-3">Consulting Philosophy</p>
              <p className="font-body text-ivory/80 text-sm leading-relaxed mb-3">Sustainable growth is not achieved through effort alone. It is achieved through the right strategy, supported by the appropriate systems, executed by the correct people, measured through the correct metrics, and continuously improved through disciplined accountability.</p>
              <p className="font-body text-ivory/50 text-xs">This is not traditional consulting. It is the engineering of a business&apos;s growth infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory border-t border-navy/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-navy mb-4">Start with the diagnostic.</h2>
          <p className="font-body text-navy/60 mb-8 text-sm md:text-base">Identify your primary growth constraint before our first conversation — so we start at the root cause, not the symptom.</p>
          <Link href="/diagnostic" className="inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-10 rounded text-base hover:bg-gold-bright transition-colors min-h-[52px] w-full sm:w-auto">
            Free Business Constraint Diagnostic →
          </Link>
        </div>
      </section>
    </>
  );
}
