import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { detectSurface } from "@/context/surface-context";

describe("FASE 41: Dual Surface Architecture & Foundation Suite", () => {
  describe("Group A: Surface Detection Contracts", () => {
    it("Scenario DUAL-1: detectSurface returns 'web' by default in non-browser/SSR environment", () => {
      const surface = detectSurface();
      assert.equal(surface, "web", "Should default to web surface in Node environment");
    });

    it("Scenario DUAL-2: Surface context and provider exist and export required contracts", () => {
      const surfaceContextPath = path.join(
        process.cwd(),
        "src/context/surface-context.tsx"
      );
      assert.ok(fs.existsSync(surfaceContextPath), "surface-context.tsx must exist");
      const content = fs.readFileSync(surfaceContextPath, "utf-8");

      assert.ok(content.includes("export function SurfaceProvider"), "Must export SurfaceProvider");
      assert.ok(content.includes("export function useSurface"), "Must export useSurface hook");
      assert.ok(content.includes("detectSurface"), "Must export detectSurface function");
      assert.ok(content.includes("display-mode: standalone"), "Must check display-mode: standalone");
      assert.ok(content.includes("data-surface"), "Must bind to data-surface attribute");
    });
  });

  describe("Group B: Anti-Flicker & Root Layout Integration", () => {
    it("Scenario DUAL-3: Root layout integrates anti-flicker script in head and SurfaceProvider", () => {
      const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
      assert.ok(fs.existsSync(layoutPath), "layout.tsx must exist");
      const content = fs.readFileSync(layoutPath, "utf-8");

      assert.ok(content.includes("<SurfaceProvider>"), "Must wrap application in SurfaceProvider");
      assert.ok(content.includes("display-mode: standalone"), "Head script must detect standalone display-mode");
      assert.ok(content.includes("document.documentElement.dataset.surface"), "Must set dataset.surface early");
      assert.ok(content.includes("document.documentElement.setAttribute('data-surface'"), "Must set attribute data-surface");
    });
  });

  describe("Group C: Dual Surface CSS Token Architecture", () => {
    it("Scenario DUAL-4: Globals CSS defines distinct token sets for [data-surface='web'] and [data-surface='app']", () => {
      const globalsPath = path.join(process.cwd(), "src/app/globals.css");
      assert.ok(fs.existsSync(globalsPath), "globals.css must exist");
      const content = fs.readFileSync(globalsPath, "utf-8");

      // Web Surface Token Verification
      assert.ok(content.includes('[data-surface="web"]'), "Must define [data-surface='web'] block");
      assert.ok(content.includes("--color-background: #090d16;"), "Web surface uses deep dark background");

      // App Surface Token Verification
      assert.ok(content.includes('[data-surface="app"]'), "Must define [data-surface='app'] block");
      assert.ok(content.includes("--color-background: #ffffff;"), "App surface uses clean white background");
      assert.ok(content.includes("--color-surface: #f8fafc;"), "App surface uses clean neutral card surface");
      assert.ok(content.includes("--color-text-primary: #0f172a;"), "App surface uses high-contrast dark text");
      assert.ok(content.includes("--shadow-card: 0 1px 2px rgba(15, 23, 42, 0.06);"), "App surface uses subtle non-glow card shadow");
    });
  });
});
