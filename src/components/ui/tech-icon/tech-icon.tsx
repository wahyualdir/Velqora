"use client";

import React from "react";
import { TechIconProps } from "./types";
import { renderTechSvgIcon } from "./brand-icons-registry";

export function TechIcon({
  name,
  size = 20,
  className = "",
  animate = true,
  withBg = false,
}: TechIconProps) {
  if (!name) return null;

  const key = name.toLowerCase().trim();
  const iconNode = renderTechSvgIcon(key, size, className);

  if (!withBg) {
    return (
      <span
        className={`inline-flex items-center justify-center ${
          animate ? "transition-transform duration-200 hover:scale-110" : ""
        }`}
      >
        {iconNode}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center p-1.5 rounded-lg bg-surface-secondary border border-border/40 ${
        animate ? "transition-all duration-200 hover:scale-105 hover:border-brand-500/30" : ""
      }`}
    >
      {iconNode}
    </span>
  );
}
