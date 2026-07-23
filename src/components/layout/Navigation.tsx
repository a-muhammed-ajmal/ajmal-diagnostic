'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#problem', label: 'The Founder Trap' },
  { href: '/#solution', label: 'SGA Framework' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'The Architect' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isDiagnostic = pathname?.startsWith('/diagnostic');
  const isResults = pathname?.startsWith('/results');

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin || isDiagnostic) return null;

  return (
    <nav
      className={cn(
        'bg-navy/95 backdrop-blur-md text-ivory py-4 px-4 md:px-6 border-b border-gold/20 sticky top-0 z-50 transition-shadow duration-300',
        scrolled && 'shadow-lg shadow-black/30'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo — name always visible on all screen sizes, subtitle hidden on mobile */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative w-9 h-9 flex items-center justify-center border-2 border-ivory/20 rounded-sm flex-shrink-0">
            <span className="font-heading font-extrabold text-lg tracking-tighter leading-none">
              M<span className="text-gold">A</span>
            </span>
            <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-gold" />
          </div>
          <div>
            <div className="font-heading font-bold tracking-widest text-xs leading-none uppercase">
              Muhammed Ajmal
            </div>
            <div className="hidden sm:block font-body text-[9px] tracking-[0.25em] text-gold mt-0.5 uppercase">
              Strategic Consulting
            </div>
          </div>
        </Link>

        {/* Desktop nav links with underline hover animation */}
        <div className="hidden lg:flex gap-6 text-sm font-body font-medium tracking-wide">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group hover:text-gold transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-[width] duration-300" />
            </Link>
          ))}
        </div>

        {/* Right side — CTA + hamburger */}
        <div className="flex items-center gap-3">
          {!isResults && (
            <Link
              href="/diagnostic"
              className="hidden sm:inline-flex items-center bg-gold text-navy font-heading font-bold py-2 px-4 rounded-xl hover:bg-gold-bright transition-colors text-sm min-h-[44px]"
            >
              Free Diagnostic
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden tap-target inline-flex items-center justify-center text-ivory hover:text-gold transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — smooth animated open/close */}
      <div
        className={cn(
          'lg:hidden border-t border-gold/20 mt-3 overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-in-out',
          mobileOpen ? 'max-h-[520px] opacity-100 pt-3 pb-2' : 'max-h-0 opacity-0'
        )}
      >
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-2 text-sm font-body hover:text-gold transition-colors border-b border-ivory/5 last:border-0"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/diagnostic"
          onClick={() => setMobileOpen(false)}
          className="block mt-3 bg-gold text-navy font-heading font-bold py-3 px-5 rounded-xl text-sm text-center hover:bg-gold-bright transition-colors"
        >
          Free Diagnostic →
        </Link>
      </div>
    </nav>
  );
}