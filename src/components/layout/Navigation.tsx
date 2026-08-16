"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConnectedFoundationMark } from "@/components/brand/ConnectedFoundationMark";

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
    <nav className={cn("sticky top-0 z-50 border-b border-dark-border bg-dark-surface px-4 py-2.5 text-ivory transition-shadow duration-300 md:px-6", scrolled && "shadow-sm shadow-black/20")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3 transition-opacity hover:opacity-90">
          <ConnectedFoundationMark className="h-9 w-9 shrink-0 text-violet" />
          <div>
            <p className="font-heading text-sm font-semibold leading-none">Muhammed Ajmal Consulting</p>
            <p className="mt-1 hidden font-body text-xs text-slate sm:block">Business operations and growth</p>
          </div>
        </Link>

        <div className="hidden gap-5 font-body text-sm font-medium lg:flex">
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
          {!isResults && <Button href="/diagnostic" className="hidden px-4 py-2 sm:inline-flex">Start the Check</Button>}
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
        <Button href="/diagnostic" className="mt-3 w-full" onClick={() => setMobileOpen(false)}>Start the Business Health Check →</Button>
      </div>
    </nav>
  );
}
