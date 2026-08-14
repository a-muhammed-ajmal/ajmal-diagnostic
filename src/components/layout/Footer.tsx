"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#founder-trap", label: "Founder Trap" },
  { href: "/services", label: "How It Works" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDiagnostic = pathname?.startsWith("/diagnostic");

  if (isAdmin || isDiagnostic) return null;

  return (
    <footer className="border-t border-navy bg-footer px-6 py-12 text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="mb-3 font-heading text-sm font-bold uppercase tracking-widest">Muhammed Ajmal Consulting</p>
          <p className="max-w-xs font-body text-xs leading-relaxed text-ivory/55">Business operations and growth consulting for founder-led UAE SMEs.</p>
        </div>
        <div>
          <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-widest text-gold">Explore</p>
          <nav aria-label="Footer navigation"><ul className="grid grid-cols-2 gap-x-4">
            {links.map((link) => <li key={link.href}><Link href={link.href} className="flex min-h-[38px] items-center font-body text-sm text-ivory/80 transition-colors hover:text-gold">{link.label}</Link></li>)}
          </ul></nav>
        </div>
        <div>
          <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-widest text-gold">Start here</p>
          <Link href="/diagnostic" className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-5 py-3 font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright">Take the Free Diagnostic →</Link>
          <p className="mt-3 font-body text-xs text-ivory/55">Dubai, United Arab Emirates</p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl items-center border-t border-ivory/10 pt-6">
        <p className="font-body text-xs text-ivory/35">© 2026 Muhammed Ajmal Consulting. All rights reserved.</p>
      </div>
    </footer>
  );
}
