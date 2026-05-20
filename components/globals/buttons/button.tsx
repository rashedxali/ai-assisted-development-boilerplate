"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { LeadText } from "@/components/globals/typography/lead-text";
import { ArrowRight, Loader2 } from "lucide-react";

type BaseProps = {
  href?: string;
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
  isLoading?: boolean;
};

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;
type ButtonElementProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

type ButtonProps = AnchorProps | ButtonElementProps;

const defaultClasses =
  "group bg-white-100 text-brand-pink hover:bg-brand-pink hover:text-white-100 inline-flex w-fit cursor-pointer items-center justify-center gap-3 px-5 py-2.5 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed";

export function Button({
  href,
  children,
  icon = true,
  className,
  isLoading = false,
  ...props
}: ButtonProps) {
  const content = (
    <>
      <LeadText variant="16b" as="span">
        {children}
      </LeadText>
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin shrink-0" />
      ) : (
        icon && (
          <ArrowRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        )
      )}
    </>
  );

  const combinedClasses = clsx(defaultClasses, className);

  if (href) {
    const { ...anchorProps } = props as AnchorProps;
    return (
      <Link href={href} className={combinedClasses} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonElementProps;
  return (
    <button className={combinedClasses} disabled={isLoading} {...buttonProps}>
      {content}
    </button>
  );
}
