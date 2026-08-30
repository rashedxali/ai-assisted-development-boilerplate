"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import * as Sentry from "@sentry/nextjs";

import HeadingText from "@/components/globals/typography/heading-text";
import { BodyText } from "@/components/globals/typography/body-text";

import "../globals.css";

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
  display: "optional",
  preload: true,
});

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <HeadingText as="h1" variant="34l">
          Something went wrong
        </HeadingText>
        <BodyText variant="16r">
          An unexpected error occurred. The team has been notified.
        </BodyText>
      </body>
    </html>
  );
}
