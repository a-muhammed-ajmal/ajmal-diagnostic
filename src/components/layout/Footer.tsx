"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

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
    <footer className="border-t border-line-strong bg-brand-tint px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="mb-3 font-heading text-[length:var(--step-0)] font-bold uppercase tracking-widest">Muhammed Ajmal Consulting</p>
          <p className="max-w-xs font-body text-xs leading-relaxed text-muted">Business operations and growth consulting for founder-led UAE SMEs.</p>
        </div>
        <div>
          <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-widest text-brand-ink">Explore</p>
          <nav aria-label="Footer navigation"><ul className="grid grid-cols-2 gap-x-4">
            {links.map((link) => <li key={link.href}><Link href={link.href} className="flex min-h-[44px] items-center font-body text-[length:var(--step-0)] text-muted transition-colors hover:text-brand-ink">{link.label}</Link></li>)}
          </ul></nav>
        </div>
        <div>
          <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-widest text-brand-ink">Start here</p>
          <Link href="/diagnostic" className="inline-flex min-h-[44px] items-center rounded-xl bg-brand px-5 py-3 font-heading text-[length:var(--step-0)] font-bold text-white transition-colors hover:bg-brand-hover">Start the Business Health Check →</Link>
          <p className="mt-3 font-body text-xs text-muted">Free. Private. A focused founder-dependency self-report.</p>
          <p className="mt-3 font-body text-xs text-muted">Dubai, United Arab Emirates</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-line pt-8">
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="font-heading text-[length:var(--step-0)] font-bold uppercase tracking-widest text-brand-ink">Practical operating insight</p>
            <p className="mt-2 max-w-sm font-body text-xs leading-relaxed text-muted">For founder-led UAE SMEs. Sent when there is something worth sending.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-center border-t border-line pt-6">
        <p className="font-body text-xs text-muted">© {new Date().getFullYear()} Muhammed Ajmal Consulting. All rights reserved.</p>
      </div>
    </footer>
  );
}
