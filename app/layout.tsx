import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
  // "optional" keeps the size-adjusted fallback when Inter isn't ready in time,
  // so the LCP text never repaints late — keeps LCP at first paint.
  display: "optional",
  preload: true,
});

export const metadata: Metadata = {
  title: "Next.js Boilerplate",
  description: "A structured Next.js App Router boilerplate with enforced conventions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
