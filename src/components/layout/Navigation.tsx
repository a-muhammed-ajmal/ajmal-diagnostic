"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#founder-trap", label: "Founder Trap" },
  { href: "/services", label: "How It Works" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Whether a nav link points at the page currently being viewed.
 *
 * Hash links ("/#founder-trap") are sections of the homepage, not routes, so they are
 * never marked current — the section a visitor happens to be scrolled to is not a
 * navigation state. /insights matches its article and category children.
 */
function isCurrent(pathname: string | null, href: string): boolean {
  if (!pathname || href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDiagnostic = pathname?.startsWith("/diagnostic");
  const isResults = pathname?.startsWith("/results");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin || isDiagnostic) return null;

  return (
    <nav className={cn("sticky top-0 z-50 border-b border-gold/20 bg-navy/95 px-4 py-4 text-ivory backdrop-blur-md transition-shadow duration-300 md:px-6", scrolled && "shadow-lg shadow-black/30")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex min-h-[44px] items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-ivory/20">
            <span className="font-heading text-lg font-extrabold leading-none tracking-tighter">M<span className="text-gold">A</span></span>
            <div className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-gold" />
          </div>
          <div>
            <p className="font-heading text-xs font-bold uppercase leading-none tracking-widest">Muhammed Ajmal</p>
            <p className="mt-0.5 hidden font-body text-xs uppercase tracking-[0.2em] text-gold sm:block">Business Operations &amp; Growth</p>
          </div>
        </Link>

        <div className="hidden gap-6 font-body text-sm font-medium tracking-wide lg:flex">
          {navLinks.map((link) => {
            const isActive = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn("group relative transition-colors duration-200 hover:text-gold", isActive && "text-gold")}
              >
                {link.label}
                <span className={cn("absolute -bottom-1 left-0 h-px bg-gold transition-[width] duration-300 group-hover:w-full", isActive ? "w-full" : "w-0")} />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!isResults && <Link href="/diagnostic" className="hidden min-h-[44px] items-center rounded-xl bg-gold px-4 py-2 font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright sm:inline-flex">Start the Check</Link>}
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="tap-target inline-flex items-center justify-center text-ivory transition-colors hover:text-gold lg:hidden" aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={cn("overflow-hidden border-t border-gold/20 transition-[max-height,opacity,padding] duration-300 ease-in-out lg:hidden", mobileOpen ? "mt-3 max-h-[420px] pb-2 pt-3 opacity-100" : "max-h-0 opacity-0")}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} aria-current={isCurrent(pathname, link.href) ? "page" : undefined} className={cn("block border-b border-ivory/5 px-2 py-3 font-body text-sm transition-colors hover:text-gold last:border-0", isCurrent(pathname, link.href) && "text-gold")}>
            {link.label}
          </Link>
        ))}
        <Link href="/diagnostic" onClick={() => setMobileOpen(false)} className="mt-3 block rounded-xl bg-gold px-5 py-3 text-center font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright">Start the Business Health Check →</Link>
      </div>
    </nav>
  );
}
