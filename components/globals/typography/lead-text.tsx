import React from "react";
import { cn } from "@/lib/utils";

type LeadTextVariant = "20b" | "16l" | "16b";

interface LeadTextProps<T extends React.ElementType = "p"> {
  as?: T;
  variant?: LeadTextVariant;
  children: React.ReactNode;
  className?: string;
}

// Polymorphic type for proper TS props inference
type Props<T extends React.ElementType> = LeadTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof LeadTextProps>;

// Shared/common classes for all LeadText versions
const commonClasses = "font-sans antialiased first-letter:uppercase";

// Variant-specific classes
const leadTextVariants: Record<LeadTextVariant, string> = {
  "20b": "text-[20px] leading-[100%] font-bold tracking-[0px]",
  "16l": "text-[16px] leading-[100%] font-light tracking-[0px]",
  "16b": "text-[16px] leading-[100%] font-bold tracking-[0px]",
} as const;

export function LeadText<T extends React.ElementType = "p">({
  as,
  variant = "20b",
  children,
  className,
  ...props
}: Props<T>) {
  const Component = as || "p";

  return (
    <Component
      className={cn(commonClasses, leadTextVariants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
