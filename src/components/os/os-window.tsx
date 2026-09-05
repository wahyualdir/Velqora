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
}

export function OSWindow({
  id,
  title,
  icon,
  statusText,
  isActive = false,
  onClose,
  onMinimize,
  onMaximize,
  children,
  className = "",
  initialCollapsed = false,
  defaultMaximized = false,
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
      className={`vt-window rounded-sm flex flex-col transition-all duration-200 ${
        isMaximized ? "w-full" : ""
      } ${className}`}
    >
      {/* Title Bar */}
      <div
        className={`px-3 py-1.5 flex items-center justify-between select-none cursor-default ${
          isActive ? "vt-titlebar-active" : "vt-titlebar"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {icon && <span className="flex-shrink-0 text-sm text-cyan-400">{icon}</span>}
          <span className="font-mono text-xs font-bold tracking-wide text-slate-200 truncate uppercase">
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleMinimize}
            aria-label="Minimize window"
            title="Minimize"
            className="vt-window-btn"
          >
            _
          </button>
          <button
            type="button"
            onClick={handleMaximize}
            aria-label="Maximize window"
            title="Maximize"
            className="vt-window-btn"
          >
            {isMaximized ? "❐" : "□"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close window"
            title="Close"
            className="vt-window-btn vt-window-btn-close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Body (Hidden if Minimized) */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0C1017]">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">{children}</div>

          {/* Status Bar */}
          {statusText && (
            <div className="px-3 py-1 bg-[#090D14] border-t border-[#1E293B] flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
              <span className="flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {statusText}
              </span>
              <span className="text-slate-600 hidden sm:inline">VELQORA_OS · 64-BIT</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
