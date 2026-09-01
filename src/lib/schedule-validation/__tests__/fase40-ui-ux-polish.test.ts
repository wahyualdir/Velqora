import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

describe("FASE 40: Professional Product UI, Visual System & UX Polish Suite", () => {
  // ─── Group A: Design Tokens & Neutral Foundation ───
  describe("Group A: Design Token Normalization & Palette Consistency", () => {
    it("Scenario POLISH-1: Globals CSS defines dark neutral foundation and Precision Blue brand scale", () => {
      const globalsPath = path.join(process.cwd(), "src/app/globals.css");
      assert.ok(fs.existsSync(globalsPath), "globals.css must exist");
      const content = fs.readFileSync(globalsPath, "utf-8");

      // Verify Precision Blue Scale
      assert.ok(content.includes("--color-brand-600: #2563eb;"), "Must define Precision Blue #2563eb");
      assert.ok(content.includes("--color-brand-500: #3b82f6;"), "Must define Brand 500 #3b82f6");

      // Verify Dark Surface Neutral Scale
      assert.ok(content.includes("--color-background: #090d16;"), "Must define background #090d16");
      assert.ok(content.includes("--color-surface: #0f172a;"), "Must define surface #0f172a");
      assert.ok(content.includes("--color-surface-hover: #1e293b;"), "Must define surface hover #1e293b");

      // Verify Light Surface Palette
      assert.ok(content.includes(".light {"), "Must define light theme block");
      assert.ok(content.includes("--color-background: #f8fafc;"), "Must define light background");
      assert.ok(content.includes("--color-surface: #ffffff;"), "Must define light surface");
    });

    it("Scenario POLISH-2: Layout containers enforce consistent max-widths and responsive padding", () => {
      const globalsPath = path.join(process.cwd(), "src/app/globals.css");
      const content = fs.readFileSync(globalsPath, "utf-8");

      assert.ok(content.includes(".page-container {"), "Must define page-container");
      assert.ok(content.includes("max-width: 80rem;"), "Page container max-width 1280px (80rem)");
      assert.ok(content.includes(".content-container {"), "Must define content-container");
      assert.ok(content.includes(".reading-container {"), "Must define reading-container");
    });
  });

  // ─── Group B: Anti-Slop & Excessive Decoration Elimination ───
  describe("Group B: Anti-Slop & Zero Excessive Decoration Policy", () => {
    it("Scenario POLISH-3: Zero gradient text (bg-clip-text) across entire codebase", () => {
      const srcDir = path.join(process.cwd(), "src");
      
      function scanDir(dir: string): string[] {
        let violations: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== "__tests__" && entry.name !== "node_modules") {
              violations = violations.concat(scanDir(fullPath));
            }
          } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
            const fileContent = fs.readFileSync(fullPath, "utf-8");
            if (fileContent.includes("bg-clip-text") || fileContent.includes("text-transparent bg-gradient")) {
              violations.push(fullPath);
            }
          }
        }
        return violations;
      }

      const violations = scanDir(srcDir);
      assert.equal(
        violations.length,
        0,
        `Expected 0 files with bg-clip-text gradient text, found: ${violations.join(", ")}`
      );
    });

    it("Scenario POLISH-4: User profile menu uses clean border avatars without rainbow rings or neon glow", () => {
      const menuPath = path.join(process.cwd(), "src/components/layout/user-profile-menu.tsx");
      assert.ok(fs.existsSync(menuPath), "user-profile-menu.tsx must exist");
      const content = fs.readFileSync(menuPath, "utf-8");

      assert.ok(
        !content.includes("from-[#0071e3] via-[#8b5cf6] to-[#ec4899]"),
        "Must NOT contain rainbow gradient rings"
      );
      assert.ok(
        !content.includes("shadow-[0_0_15px_rgba(0,113,227,0.35)]"),
        "Must NOT contain neon avatar shadow glow"
      );
      assert.ok(
        !content.includes("shadow-[0_0_6px_#10b981]"),
        "Must NOT contain neon status dot shadow glow"
      );
    });

    it("Scenario POLISH-5: Auth pages (register & reset-password) eliminate neon glow dropshadows and bounce animations", () => {
      const registerPath = path.join(process.cwd(), "src/app/(auth)/register/page.tsx");
      const resetPath = path.join(process.cwd(), "src/app/(auth)/reset-password/page.tsx");

      assert.ok(fs.existsSync(registerPath), "register/page.tsx must exist");
      assert.ok(fs.existsSync(resetPath), "reset-password/page.tsx must exist");

      const registerContent = fs.readFileSync(registerPath, "utf-8");
      const resetContent = fs.readFileSync(resetPath, "utf-8");

      // Verify no drop-shadow glow
      assert.ok(
        !registerContent.includes("drop-shadow-[0_0_8px"),
        "Register must NOT contain neon drop-shadows"
      );
      assert.ok(
        !registerContent.includes("shadow-[0_0_20px"),
        "Register must NOT contain neon shadows"
      );
      assert.ok(
        !registerContent.includes("animate-pulse"),
        "Register must NOT contain pulsating input line animations"
      );

      // Verify reset password has no bounce animation
      assert.ok(
        !resetContent.includes("animate-bounce"),
        "Reset password must NOT contain animate-bounce"
      );
      assert.ok(
        !resetContent.includes("shadow-indigo-600"),
        "Reset password must NOT contain rainbow indigo shadows"
      );
    });
  });

  // ─── Group C: Button System Hierarchy & Accessibility ───
  describe("Group C: Button System Hierarchy & Touch Targets", () => {
    it("Scenario POLISH-6: Button component defines strict semantic variants and sizes", () => {
      const buttonPath = path.join(process.cwd(), "src/components/ui/button.tsx");
      assert.ok(fs.existsSync(buttonPath), "button.tsx must exist");
      const content = fs.readFileSync(buttonPath, "utf-8");

      // Verify variants
      assert.ok(content.includes("primary:"), "Must define primary variant");
      assert.ok(content.includes("secondary:"), "Must define secondary variant");
      assert.ok(content.includes("outline:"), "Must define outline variant");
      assert.ok(content.includes("ghost:"), "Must define ghost variant");
      assert.ok(content.includes("destructive:"), "Must define destructive variant");

      // Verify focus accessibility
      assert.ok(content.includes("focus-visible:outline-none"), "Must have focus-visible styling");
      assert.ok(content.includes("focus-visible:ring-brand-500"), "Must have brand ring focus indicator");
    });
  });

  // ─── Group D: Desktop Workspace & Mobile App Separation ───
  describe("Group D: Workspace Refinement & True Separation", () => {
    it("Scenario POLISH-7: Desktop Top Bar has clean spotlight search and non-glowing online indicator", () => {
      const topBarPath = path.join(process.cwd(), "src/surfaces/web/layout/desktop-top-bar.tsx");
      assert.ok(fs.existsSync(topBarPath), "desktop-top-bar.tsx must exist");
      const content = fs.readFileSync(topBarPath, "utf-8");

      assert.ok(content.includes("Ctrl + K") || content.includes("Ctrl"), "Must have command shortcut");
      assert.ok(
        !content.includes("shadow-[0_0_8px_rgba(16,185,129,0.5)]"),
        "Online indicator must be calm, without neon glow shadow"
      );
    });

    it("Scenario POLISH-8: Mobile bottom navigation provides single-hand thumb navigation with safe touch targets", () => {
      const navPath = path.join(process.cwd(), "src/surfaces/app/layout/mobile-bottom-nav.tsx");
      assert.ok(fs.existsSync(navPath), "mobile-bottom-nav.tsx must exist");
      const content = fs.readFileSync(navPath, "utf-8");

      assert.ok(content.includes("min-h-[48px]"), "Touch target must be at least 48px");
      assert.ok(content.includes("safe-area-inset-bottom"), "Must respect iOS safe area");
    });

    it("Scenario POLISH-9: Mobile dashboard view hero card is calm and devoid of excessive rainbow gradients", () => {
      const mobileDashPath = path.join(process.cwd(), "src/surfaces/app/dashboard/mobile-dashboard-view.tsx");
      assert.ok(fs.existsSync(mobileDashPath), "mobile-dashboard-view.tsx must exist");
      const content = fs.readFileSync(mobileDashPath, "utf-8");

      assert.ok(
        !content.includes("bg-gradient-to-br from-brand-500/10 via-surface to-surface"),
        "Hero card must NOT use heavy gradient backgrounds"
      );
      assert.ok(content.includes("Lanjutkan Belajar"), "Must feature Continue Learning hero");
    });
  });

  // ─── Group E: Download Hub & PWA Polish ───
  describe("Group E: Download Hub & PWA Guidance Experience", () => {
    it("Scenario POLISH-10: Dedicated /download page provides calm multi-platform guidance and install trigger", () => {
      const downloadPath = path.join(process.cwd(), "src/app/download/page.tsx");
      assert.ok(fs.existsSync(downloadPath), "download/page.tsx must exist");
      const content = fs.readFileSync(downloadPath, "utf-8");

      assert.ok(content.includes("Android"), "Must guide Android users");
      assert.ok(content.includes("iPhone / iPad"), "Must guide iOS users");
      assert.ok(content.includes("Desktop"), "Must guide Desktop users");
      assert.ok(content.includes("bg-brand-600"), "Buttons must use standard brand-600");
    });
  });

  // ─── Group F: Symmetrical Card System & Primitives Contract ───
  describe("Group F: Symmetrical Card System & Primitives Contract", () => {
    it("Scenario POLISH-11: Card and CardStat components exist with standardized padding and variants", () => {
      const cardPath = path.join(process.cwd(), "src/components/ui/card.tsx");
      assert.ok(fs.existsSync(cardPath), "card.tsx must exist");
      const content = fs.readFileSync(cardPath, "utf-8");

      assert.ok(content.includes("export function Card"), "Must export Card");
      assert.ok(content.includes("export function CardStat"), "Must export CardStat");
      assert.ok(content.includes("padding?: \"none\" | \"sm\" | \"md\" | \"lg\""), "Must support standard padding scale");
      assert.ok(content.includes("h-full flex flex-col justify-between"), "CardStat must stretch symmetrically with flex column");
    });

    it("Scenario POLISH-12: Metric grids enforce auto-rows-fr across Web and App views", () => {
      const filesWithGrids = [
        "src/surfaces/web/dashboard/dashboard-metrics.tsx",
        "src/surfaces/app/dashboard/mobile-dashboard-view.tsx",
        "src/components/schedule/behavior-insights-card.tsx",
        "src/components/schedule/current-academic-state-card.tsx",
        "src/components/schedule/schedule-intelligence-summary.tsx",
      ];

      filesWithGrids.forEach((rel) => {
        const fullPath = path.join(process.cwd(), rel);
        assert.ok(fs.existsSync(fullPath), `${rel} must exist`);
        const content = fs.readFileSync(fullPath, "utf-8");
        assert.ok(content.includes("auto-rows-fr"), `${rel} must enforce auto-rows-fr for symmetric card heights`);
      });
    });
  });
});
