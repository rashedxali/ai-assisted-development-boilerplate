"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type DrawerProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  direction?: "right" | "left" | "top" | "bottom";
};

function Drawer({ direction = "right", ...props }: DrawerProps) {
  void direction;
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-lg",
          "right-0 top-0 h-full",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-semibold", className)}
      {...props}
    />
  );
}

export { Drawer, DrawerContent, DrawerHeader, DrawerTitle };
