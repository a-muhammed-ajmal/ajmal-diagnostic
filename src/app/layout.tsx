import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Muhammed Ajmal Consulting | Strategic Growth Architect for Founder-Led SMEs",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-navy font-body">
        {children}
      </body>
    </html>
  );
}