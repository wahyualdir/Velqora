"use client";

import React from "react";
import { Code, Plus, X, Globe, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PROGRAMMING_LANGUAGES,
  PROJECT_TYPES,
  COMMON_TECH_SUGGESTIONS,
} from "./constants";

interface ProjectFieldsProps {
  programmingLanguage: string;
  onChangeProgrammingLanguage: (lang: string) => void;
  projectType: string;
  onChangeProjectType: (type: string) => void;
  repositoryUrl: string;
  onChangeRepositoryUrl: (url: string) => void;
  demoUrl: string;
  onChangeDemoUrl: (url: string) => void;
  techStackList: string[];
  techStackInput: string;
  onChangeTechStackInput: (val: string) => void;
  onAddTechTag: (tag: string) => void;
  onRemoveTechTag: (tag: string) => void;
  disabled?: boolean;
}

export function ProjectFields({
  programmingLanguage,
  onChangeProgrammingLanguage,
  projectType,
  onChangeProjectType,
  repositoryUrl,
  onChangeRepositoryUrl,
  demoUrl,
  onChangeDemoUrl,
  techStackList,
  techStackInput,
  onChangeTechStackInput,
  onAddTechTag,
  onRemoveTechTag,
  disabled = false,
}: ProjectFieldsProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border/70">
        <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
          <Code className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-text-primary">
            Spesifikasi & Lingkungan Proyek Coding
          </h3>
          <p className="text-[11px] text-text-secondary">
            Konfigurasikan bahasa utama, tech stack, dan tautan repositori proyek.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Programming Language */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-text-secondary">
            Bahasa Pemrograman Utama
          </label>
          <select
            value={programmingLanguage}
            onChange={(e) => onChangeProgrammingLanguage(e.target.value)}
            disabled={disabled}
            className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-text-secondary">
            Kategori / Tipe Proyek
          </label>
          <select
            value={projectType}
            onChange={(e) => onChangeProjectType(e.target.value)}
            disabled={disabled}
            className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Stack Tags */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-text-secondary">
          Tech Stack & Library yang Digunakan
        </label>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-surface-secondary/50 border border-border/80">
          {techStackList.length === 0 ? (
            <span className="text-[11px] text-text-tertiary self-center px-1">
              Pilih saran di bawah atau ketikkan tag kustom
            </span>
          ) : (
            techStackList.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTechTag(tag)}
                  disabled={disabled}
                  className="hover:text-text-primary cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Custom Tag Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={techStackInput}
            onChange={(e) => onChangeTechStackInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddTechTag(techStackInput);
              }
            }}
            disabled={disabled}
            placeholder="Ketik teknologi lalu tekan Enter (misal: Pandas, Docker, PyTorch)..."
            className="flex-1 h-9 px-3 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onAddTechTag(techStackInput)}
            disabled={disabled || !techStackInput.trim()}
            className="text-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tag</span>
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-1 pt-1">
          {COMMON_TECH_SUGGESTIONS.slice(0, 10).map((tech) => {
            const isSelected = techStackList.includes(tech);
            if (isSelected) return null;
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onAddTechTag(tech)}
                disabled={disabled}
                className="px-2 py-0.5 rounded-md text-[11px] bg-surface border border-border text-text-secondary hover:text-brand-500 hover:border-brand-500/40 transition-colors cursor-pointer"
              >
                + {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* External Repository & Live Demo URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Tautan GitHub / GitLab</span>
          </label>
          <input
            type="url"
            value={repositoryUrl}
            onChange={(e) => onChangeRepositoryUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://github.com/username/project"
            className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Tautan Live Demo / Publikasi</span>
          </label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => onChangeDemoUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://my-app.vercel.app"
            className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
      </div>
    </div>
  );
}
