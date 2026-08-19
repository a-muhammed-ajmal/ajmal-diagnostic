import type { Metadata, Viewport } from "next";
import { Lexend, Roboto_Slab } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME } from "@/lib/metadata";
import { cn } from "@/lib/utils";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.muhammedajmal.com"),
  title: {
    default:
      "Muhammed Ajmal Consulting | Business Operations & Growth Consultant",
    template: "%s | Muhammed Ajmal Consulting",
  },
  description:
    "Business operations and growth consulting for founder-led UAE SMEs. Build systems, ownership, visibility, and consistent execution that reduce founder dependency.",
  openGraph: {
    title: "Build a business that grows beyond the founder | Muhammed Ajmal Consulting",
    description:
      "Business operations and growth consulting for founder-led UAE SMEs.",
    url: "https://www.muhammedajmal.com",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(lexend.variable, robotoSlab.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink font-body">
        {/* Keyboard-only escape past the nav. Off-screen until focused; the global
            :focus-visible rule in globals.css supplies the outline. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-5 focus:py-3 focus:font-heading focus:text-[length:var(--step-0)] focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
