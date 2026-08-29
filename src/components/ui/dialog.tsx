"use client";

import React from "react";
import { Modal, ModalProps, ConfirmDialog, ConfirmDialogProps } from "./modal";
import { cn } from "@/lib/utils";

export { Modal as Dialog, ConfirmDialog };
export type { ModalProps as DialogProps, ConfirmDialogProps };

export function DialogHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left pb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-base sm:text-lg font-semibold text-text-primary tracking-tight font-display",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs sm:text-sm text-text-secondary leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-3 border-t border-border gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
