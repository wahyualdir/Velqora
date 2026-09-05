"use client";

import React, { useState } from "react";
import { Folder, Terminal, FileText, Cpu, LayoutDashboard, Calendar } from "lucide-react";
import Link from "next/link";

interface DesktopShortcut {
  id: string;
  name: string;
  subtext: string;
  icon: React.ReactNode;
  iconBg: string;
  targetId?: string;
  href?: string;
}

export function OSDesktopIcons() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const shortcuts: DesktopShortcut[] = [
    {
      id: "curriculum",
      name: "12_Modul.exe",
      subtext: "Kurikulum Web",
      icon: <Folder className="w-6 h-6 text-[#00F2FE]" />,
      iconBg: "bg-cyan-950/60 border-cyan-500/40",
      targetId: "curriculum-section",
    },
    {
      id: "terminal",
      name: "Monitor.sh",
      subtext: "Interactive CLI",
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      iconBg: "bg-emerald-950/60 border-emerald-500/40",
      targetId: "terminal-section",
    },
    {
      id: "readme",
      name: "README.txt",
      subtext: "Manifesto Dosen",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      iconBg: "bg-amber-950/60 border-amber-500/40",
      targetId: "notepad-section",
    },
    {
      id: "companion",
      name: "Companion.exe",
      subtext: "Local Agent",
      icon: <Cpu className="w-6 h-6 text-[#FF2E93]" />,
      iconBg: "bg-pink-950/60 border-pink-500/40",
      targetId: "companion-section",
    },
    {
      id: "dashboard",
      name: "Dashboard.url",
      subtext: "LMS Portal",
      icon: <LayoutDashboard className="w-6 h-6 text-purple-400" />,
      iconBg: "bg-purple-950/60 border-purple-500/40",
      href: "/dashboard",
    },
  ];

  const handleClick = (shortcut: DesktopShortcut) => {
    setSelectedId(shortcut.id);
    if (shortcut.targetId) {
      const el = document.getElementById(shortcut.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto my-6 px-4 select-none">
      {shortcuts.map((shortcut) => {
        const isSelected = selectedId === shortcut.id;

        const content = (
          <div
            onClick={() => handleClick(shortcut)}
            className={`flex flex-col items-center justify-center p-3 rounded-xs text-center cursor-pointer transition-all duration-150 group border ${
              isSelected
                ? "bg-slate-800/80 border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "border-transparent hover:bg-slate-900/60 hover:border-slate-700/60"
            }`}
          >
            {/* Retro Beveled Icon Box */}
            <div
              className={`w-12 h-12 rounded flex items-center justify-center border shadow-md group-hover:scale-105 transition-transform ${shortcut.iconBg}`}
            >
              {shortcut.icon}
            </div>

            {/* Icon Filename Label */}
            <span className="mt-2 font-mono text-xs font-bold text-slate-200 tracking-tight group-hover:text-white truncate max-w-full">
              {shortcut.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-full">
              {shortcut.subtext}
            </span>
          </div>
        );

        if (shortcut.href) {
          return (
            <Link key={shortcut.id} href={shortcut.href}>
              {content}
            </Link>
          );
        }

        return <div key={shortcut.id}>{content}</div>;
      })}
    </div>
  );
}
