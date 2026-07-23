'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isDiagnostic = pathname?.startsWith('/diagnostic');

  if (isAdmin || isDiagnostic) return null;

  return (
    <footer className="bg-footer text-ivory py-12 px-6 border-t border-navy">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-heading font-bold tracking-widest text-sm uppercase mb-3">Muhammed Ajmal Consulting</div>
          <p className="font-body text-xs text-ivory/40 leading-relaxed max-w-xs">Strategic Growth Architecture™ for founder-led SMEs across the UAE and GCC.</p>
        </div>
        <div>
          <div className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-3">Quick Links</div>
          <ul className="space-y-2">
            {[
              { href: '/diagnostic', label: 'Free Diagnostic' },
              { href: '/services', label: 'Services' },
              { href: '/about', label: 'About' },
              { href: '/insights', label: 'Insights' },
              { href: '/contact', label: 'Contact' },
              { href: '/privacy', label: 'Privacy' },
            ].map(l => (
              <li key={l.href}><Link href={l.href} className="font-body text-xs text-ivory/50 hover:text-gold transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-heading font-semibold text-xs uppercase tracking-widest text-gold mb-3">Get Started</div>
          <Link href="/diagnostic" className="inline-block bg-gold text-navy font-heading font-bold py-3 px-6 rounded-xl text-sm hover:bg-gold-bright transition-colors mb-3">
            Free Business Diagnostic →
          </Link>
          <p className="font-body text-xs text-ivory/40">Dubai, UAE · Remote across the GCC</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-ivory/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="font-body text-xs text-ivory/30">© 2026 Muhammed Ajmal. All Rights Reserved.</p>
        <p className="font-body text-xs text-ivory/30">Strategic Growth Architecture™ is a proprietary framework.</p>
      </div>
    </footer>
  );
}
