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
      "Muhammed Ajmal Consulting | Strategic Growth Architect for Founder-Led SMEs",
    template: "%s | Muhammed Ajmal Consulting",
  },
  description:
    "Helping founder-led SMEs across the UAE and GCC build scalable, system-driven businesses through Strategic Growth Architecture. Free diagnostic identifies your primary growth constraint.",
  openGraph: {
    title: "Strategic Growth Architecture for Founder-Led SMEs | UAE & GCC",
    description:
      "Escape the Founder Trap. Engineer Scalable Growth. Free 4-minute diagnostic identifies your primary business constraint.",
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
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
