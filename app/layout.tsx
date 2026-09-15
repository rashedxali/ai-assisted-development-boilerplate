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
  title: "AI-Assisted Development Boilerplate",
  description:
    "A production-ready Next.js boilerplate where AI agents plan, build, and review features while following your conventions.",
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
