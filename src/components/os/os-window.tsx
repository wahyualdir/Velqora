"use client";

import React, { useState } from "react";

export interface OSWindowProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  statusText?: string;
  isActive?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children: React.ReactNode;
  className?: string;
  initialCollapsed?: boolean;
  defaultMaximized?: boolean;
  bodyClassName?: string;
}

export function OSWindow({
  id,
  title,
  icon,
  statusText,
  isActive = true,
  onClose,
  onMinimize,
  onMaximize,
  children,
  className = "",
  initialCollapsed = false,
  defaultMaximized = false,
  bodyClassName = "",
}: OSWindowProps) {
  const [isMinimized, setIsMinimized] = useState(initialCollapsed);
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsClosed(true);
    }
  };

  return (
    <div
      id={id}
      className={`vt-window rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
        isMaximized ? "w-full" : ""
      } ${className}`}
    >
      {/* Editorial Card Header */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between select-none cursor-default border-b transition-colors ${
          isActive
            ? "bg-[#F3EFE9]/75 dark:bg-[#1C1917]/85 border-[#E4DDD4] dark:border-[#292524]"
            : "bg-[#FAF8F5] dark:bg-[#141210] border-[#E4DDD4] dark:border-[#292524]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && (
            <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs bg-[#FAF3EF] dark:bg-[#D4664A]/12 border border-[#D4664A]/25 text-[#C2553A] dark:text-[#D4664A]">
              {icon}
            </span>
          )}
          <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-[#1C1917] dark:text-[#F5F5F4] truncate uppercase">
            {title}
          </span>
        </div>

        {/* Minimal Workspace Window Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleMinimize}
            aria-label="Minimize window"
            title="Minimize"
            className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#E4DDD4]/60 dark:hover:bg-[#2C2724] transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 8.5h7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleMaximize}
            aria-label="Maximize window"
            title={isMaximized ? "Restore" : "Maximize"}
            className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#E4DDD4]/60 dark:hover:bg-[#2C2724] transition-colors cursor-pointer"
          >
            {isMaximized ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="6" height="6" rx="1" />
                <path d="M4.5 4V2.5a.5.5 0 0 1 .5-.5H10a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H8" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                <rect x="2.25" y="2.25" width="7.5" height="7.5" rx="1.25" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close window"
            title="Close"
            className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#8A8378] dark:text-[#8C857F] hover:text-[#C2553A] dark:hover:text-[#D4664A] hover:bg-[#C2553A]/10 dark:hover:bg-[#D4664A]/15 transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Body */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#FFFFFF] dark:bg-[#141210]">
          {/* Main Content Area */}
          <div className={`flex-1 overflow-auto ${bodyClassName}`}>{children}</div>

          {/* Hairline Telemetry Footer */}
          {statusText && (
            <div className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#100E0D] border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-[#A8A29E] select-none shrink-0">
              <span className="flex items-center gap-2 truncate pr-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34D399] shrink-0" />
                {statusText}
              </span>
              <span className="text-[#8A8378] dark:text-[#8C857F] hidden sm:inline shrink-0 tracking-wider">
                VELQORA // WORKSPACE
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
