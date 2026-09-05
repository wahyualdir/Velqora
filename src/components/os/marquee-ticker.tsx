"use client";

import React from "react";

export function MarqueeTicker() {
  const items = [
    "NEXT.JS 15.5 APP ROUTER",
    "REACT 19 SERVER COMPONENTS",
    "TYPESCRIPT END-TO-END SAFETY",
    "TAILWIND CSS V4 & CVA VARIANTS",
    "POSTGRESQL & PRISMA CONNECTION POOLING",
    "VITEST & PLAYWRIGHT E2E TESTING",
    "DOCKER MULTI-STAGE CONTAINERIZATION",
    "HTTPONLY SECURE COOKIES & RBAC",
    "WAI-ARIA WCAG 2.2 AA ACCESSIBILITY",
    "AUTOMATED GITHUB ACTIONS CI/CD",
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y-2 border-[#E5DDD5] py-2 overflow-hidden select-none font-mono text-xs shadow-inner">
      <div className="animate-vt-marquee flex items-center gap-6 text-[#1C1917]">
        {[...items, ...items, ...items].map((text, index) => (
          <div key={index} className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-[#C2553A] font-black text-sm">★</span>
            <span className="font-bold tracking-wider">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
