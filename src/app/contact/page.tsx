import { ContactForm } from '@/components/contact/ContactForm';
import { CalendlyWidget } from '@/components/contact/CalendlyWidget';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Contact | Book a Strategy Session',
  absoluteTitle: true,
  description: 'Book a free 30-minute consultation or send an enquiry. Serving founder-led SMEs in Dubai, UAE, and across the GCC.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy text-ivory py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-gold font-heading font-bold tracking-widest text-sm uppercase mb-3 block">Get Started</span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-5">Book a Strategy Session</h1>
          <p className="font-body text-ivory/70 text-base md:text-lg max-w-2xl mx-auto">Book directly via Calendly, or send an enquiry and receive a response within 24 hours.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 bg-ivory relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 relative z-10">
          <div>
            <h2 className="font-heading font-bold text-navy text-xl md:text-2xl mb-2">Send an Enquiry</h2>
            <p className="font-body text-navy/60 text-sm mb-6">For specific questions or project scopes. Response within 24 hours.</p>
            <ContactForm />
          </div>
          <div>
            <h2 className="font-heading font-bold text-navy text-xl md:text-2xl mb-2">Book Directly</h2>
            <p className="font-body text-navy/60 text-sm mb-6">A free 30-minute consultation — focused on your business, not a sales pitch.</p>
            <CalendlyWidget />
          </div>
        </div>
      </section>
    </>
  );
}
