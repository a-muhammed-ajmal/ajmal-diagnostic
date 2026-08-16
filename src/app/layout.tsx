import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME } from "@/lib/metadata";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={cn(inter.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col bg-ivory text-navy font-body">
        {/* Keyboard-only escape past the nav. Off-screen until focused; the global
            :focus-visible rule in globals.css supplies the outline. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-gold focus:px-5 focus:py-3 focus:font-heading focus:text-sm focus:font-bold focus:text-navy"
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
