import React from "react";
import { cn } from "@/lib/utils";

// Common/shared classes for all BodyText variants
const commonClasses = "font-sans font-normal antialiased first-letter:uppercase";

// Variant-specific classes
const bodyTextVariants = {
  "16r": "text-[16px] leading-[150%] font-normal tracking-[1px]",
  "16m": "text-[16px] leading-[100%] font-medium tracking-[1px]",
  "16l": "text-[16px] leading-[100%] font-light tracking-[0px]",
  "14r": "text-[14px] leading-[120%] font-normal tracking-[1px]",
  "14m": "text-[14px] leading-[100%] font-medium tracking-[1px]",
  "12r": "text-[12px] leading-[120%] font-normal tracking-[0.5px]",
  "12m": "text-[12px] leading-[100%] font-medium tracking-[0.5px]",
  "20b": "text-[20px] leading-[100%] tracking-[0px] font-bold",
} as const;

type BodyTextVariant = keyof typeof bodyTextVariants;

interface BodyTextProps<T extends React.ElementType = "p"> {
  as?: T;
  variant?: BodyTextVariant;
  children: React.ReactNode;
  className?: string;
}

type Props<T extends React.ElementType> = BodyTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BodyTextProps>;

export function BodyText<T extends React.ElementType = "p">({
  as,
  variant = "16r",
  children,
  className,
  ...props
}: Props<T>) {
  const Component = as || "p";

  return (
    <Component
      className={cn(commonClasses, bodyTextVariants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
