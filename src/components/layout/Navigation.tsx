"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
    <nav className={cn("sticky top-0 z-50 border-b border-brand/30 bg-white/95 px-4 py-4 text-ink backdrop-blur-md transition-shadow duration-300 md:px-6", scrolled && "shadow-1 shadow-black/30")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex min-h-[44px] items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-line">
            <span className="font-heading text-[length:var(--step-0)] font-extrabold leading-none tracking-tighter">M<span className="text-brand-ink">A</span></span>
            <div className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-brand" />
          </div>
          <div>
            <p className="font-heading text-xs font-bold uppercase leading-none tracking-widest">Muhammed Ajmal</p>
            <p className="mt-0.5 hidden font-body text-xs uppercase tracking-[0.2em] text-brand-ink sm:block">Business Operations &amp; Growth</p>
          </div>
        </Link>

        <div className="hidden gap-6 font-body text-[length:var(--step-0)] font-medium tracking-wide lg:flex">
          {navLinks.map((link) => {
            const isActive = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn("group relative transition-colors duration-200 hover:text-brand-ink", isActive && "text-brand-ink")}
              >
                {link.label}
                <span className={cn("absolute -bottom-1 left-0 h-px bg-brand transition-[width] duration-300 group-hover:w-full", isActive ? "w-full" : "w-0")} />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!isResults && <Button href="/diagnostic" className="hidden px-4 py-2 sm:inline-flex">Start the Check</Button>}
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="tap-target inline-flex items-center justify-center text-ink transition-colors hover:text-brand-ink lg:hidden" aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={cn("overflow-hidden border-t border-line transition-[max-height,opacity,padding] duration-300 ease-in-out lg:hidden", mobileOpen ? "mt-3 max-h-[420px] pb-2 pt-3 opacity-100" : "max-h-0 opacity-0")}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} aria-current={isCurrent(pathname, link.href) ? "page" : undefined} className={cn("block border-b border-line px-2 py-3 font-body text-[length:var(--step-0)] transition-colors hover:text-brand-ink last:border-0", isCurrent(pathname, link.href) && "text-brand-ink")}>
            {link.label}
          </Link>
        ))}
        <Button href="/diagnostic" className="mt-3 w-full" onClick={() => setMobileOpen(false)}>Start the Business Health Check →</Button>
      </div>
    </nav>
  );
}
