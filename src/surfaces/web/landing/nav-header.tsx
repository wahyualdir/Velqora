import React from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function NavHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group focus-visible:outline-hidden">
            <Logo variant="sidebar" withTile />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-text-secondary">
          <a
            href="#arsitektur"
            className="relative py-1 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full"
          >
            Web & Mobile
          </a>
          <a
            href="#fitur"
            className="relative py-1 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full"
          >
            Fitur Lengkap
          </a>
          <a
            href="#alur-kerja"
            className="relative py-1 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full"
          >
            Cara Kerja
          </a>
          <Link
            href="/download"
            className="hover:text-text-primary transition-colors flex items-center gap-1.5 text-brand-500 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Aplikasi</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-[13px] font-medium text-text-secondary hover:text-text-primary"
            >
              Masuk
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="text-[13px] font-semibold gap-1.5 bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            >
              <span>Buka Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
