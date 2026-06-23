import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default:
      "Muhammed Ajmal Consulting | Strategic Growth Architect for Founder-Led SMEs",
    template: "%s | Muhammed Ajmal Consulting",
  },
  description:
    "Helping founder-led SMEs across the UAE and GCC build scalable, system-driven businesses through Strategic Growth Architecture™. Free diagnostic identifies your primary growth constraint.",
  openGraph: {
    title: "Strategic Growth Architecture for Founder-Led SMEs | UAE & GCC",
    description:
      "Escape the Founder Trap. Engineer Scalable Growth. Free 4-minute diagnostic identifies your primary business constraint.",
    url: "https://muhammedajmal.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-navy font-body">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
