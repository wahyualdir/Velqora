"use client";

import React from "react";
import { Sparkles, Terminal, Shield, Zap, Flame, Code } from "lucide-react";

export function MarqueeTicker() {
  const items = [
    { label: "NEXT.JS 15.5 APP ROUTER", icon: <Zap className="w-3 h-3 text-[#FF2E93]" /> },
    { label: "REACT 19 SERVER COMPONENTS", icon: <Flame className="w-3 h-3 text-[#00F2FE]" /> },
    { label: "TYPESCRIPT END-TO-END TYPE SAFETY", icon: <Code className="w-3 h-3 text-emerald-400" /> },
    { label: "TAILWIND CSS V4 + CVA VARIANTS", icon: <Sparkles className="w-3 h-3 text-purple-400" /> },
    { label: "POSTGRESQL & PRISMA CONNECTION POOLING", icon: <Terminal className="w-3 h-3 text-cyan-400" /> },
    { label: "VITEST & PLAYWRIGHT E2E TESTING", icon: <Zap className="w-3 h-3 text-amber-400" /> },
    { label: "DOCKER MULTI-STAGE CONTAINERIZATION", icon: <Shield className="w-3 h-3 text-[#FF2E93]" /> },
    { label: "HTTPONLY COOKIES & ROLE-BASED ACCESS CONTROL", icon: <Flame className="w-3 h-3 text-[#00F2FE]" /> },
  ];

  return (
    <div className="w-full bg-[#090C12] border-y border-[#1E293B] py-2 overflow-hidden select-none font-mono text-xs">
      <div className="animate-vt-marquee flex items-center gap-8">
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap text-slate-300">
            {item.icon}
            <span className="font-bold tracking-wider">{item.label}</span>
            <span className="text-slate-600">///</span>
          </div>
        ))}
      </div>
    </div>
  );
}
