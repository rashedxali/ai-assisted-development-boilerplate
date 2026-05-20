import React from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
type HeadingVariant = "44l" | "34l" | "24l";

// Shared/common classes for all headings
const commonClasses = "font-serif font-light antialiased first-letter:uppercase";

// Variant-specific classes
const headingVariants: Record<HeadingVariant, string> = {
  "44l": "text-[44px] leading-[100%] tracking-[-2px]",
  "34l": "text-[34px] leading-[100%] tracking-[-2px]",
  "24l": "text-[24px] leading-[110%] tracking-[-1px]",
} as const;

interface HeadingTextProps<
  T extends HeadingTag = "h1",
> extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML tag to render */
  as?: T;
  /** Typography style variant */
  variant?: HeadingVariant;
  children: React.ReactNode;
  className?: string;
}

export default function HeadingText<T extends HeadingTag = "h1">({
  as,
  variant = "44l",
  children,
  className,
  ...props
}: HeadingTextProps<T>) {
  const Tag: HeadingTag = as ?? "h1"; // actual HTML element
  const styleVariant: HeadingVariant = variant; // style variant

  return (
    <Tag
      className={cn(commonClasses, headingVariants[styleVariant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
