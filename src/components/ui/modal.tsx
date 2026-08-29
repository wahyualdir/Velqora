"use client";

import React, { useEffect, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// ========== Modal / Dialog Component ==========
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  maxWidth?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  maxWidth,
  className,
  showCloseButton = true,
}: ModalProps) {
  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        className={cn(
          "relative bg-surface rounded-t-2xl sm:rounded-2xl border border-border shadow-xl w-full max-h-[90dvh] sm:max-h-[85vh] animate-fade-in overflow-hidden flex flex-col mx-auto z-10",
          maxWidth || sizes[size],
          className
        )}
      >
        {/* Header Slot */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border bg-surface-secondary/40 shrink-0">
            <div className="min-w-0 flex-1 pr-3">
              {title && (
                <h2
                  id="modal-title"
                  className="text-sm sm:text-base font-semibold text-text-primary tracking-tight font-display truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-xs text-text-secondary mt-0.5 leading-normal"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-secondary shrink-0 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Body Slot */}
        <div className="px-4 sm:px-5 py-4 overflow-y-auto overscroll-contain scrollbar-thin flex-1 safe-area-bottom">
          {children}
        </div>
      </div>
    </div>
  );
}

// ========== Confirm Dialog Component ==========
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const displayMessage = message || description || "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={!loading}
    >
      <div className="space-y-4">
        {displayMessage && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {displayMessage}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg border border-border hover:bg-surface-secondary transition-colors cursor-pointer min-h-[38px] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs min-h-[38px]",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
            )}
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
