import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Business Constraint Diagnostic | Muhammed Ajmal Consulting",
  description:
    "Answer 10 questions. Identify the single constraint blocking your business growth. Free diagnostic for founder-led SMEs in the UAE and GCC.",
  openGraph: {
    title: "What Is the Biggest Constraint in Your Business?",
    description:
      "Free 4-minute diagnostic. Identify your primary growth blocker across 5 dimensions. Built for founder-led SMEs in the UAE and GCC.",
    url: "https://diagnostic.muhammedajmal.com",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}