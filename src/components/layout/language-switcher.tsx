"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Globe, ChevronDown, Check } from "lucide-react";
import { Language } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; short: string }[] = [
    {
      code: "id",
      label: "Bahasa Indonesia",
      short: "ID",
    },
    {
      code: "en",
      label: "English (US)",
      short: "EN",
    },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Selector Trigger Button (No Flags, Clean Typography) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 h-10 min-h-[40px] rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-text-primary transition-all duration-150 shadow-xs focus:outline-none active:scale-95 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t("selectLanguage")}
      >
        <Globe className="w-3.5 h-3.5 text-text-tertiary" />
        <span className="uppercase text-[11px] font-bold font-mono tracking-wider text-text-primary">
          {currentLang.short}
        </span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-text-tertiary transition-transform duration-150",
            isOpen && "rotate-180 text-brand-500"
          )}
        />
      </button>

      {/* Solid Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-surface shadow-2xl p-1.5 z-50 animate-fade-in">
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary border-b border-border mb-1">
            {t("selectLanguage")}
          </div>

          <div className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "bg-brand-500/15 text-brand-400 border border-brand-500/30 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold opacity-75">{item.short}</span>
                    <span>{item.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
