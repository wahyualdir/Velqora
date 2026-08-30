import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  resolveExperienceType,
  BREAKPOINTS,
  checkIsPwaStandalone,
  checkIsTouchDevice,
} from "@/lib/experience";

describe("FASE 39: True Web vs App Product Experience Separation Suite", () => {
  // ─── Group A: Experience Detection & Breakpoint Resolution ───
  describe("Group A: Experience Detection & Breakpoint Resolution", () => {
    it("Scenario EXP-1: Resolves Mobile experience for viewports < 768px", () => {
      assert.equal(resolveExperienceType(320), "mobile");
      assert.equal(resolveExperienceType(375), "mobile");
      assert.equal(resolveExperienceType(390), "mobile");
      assert.equal(resolveExperienceType(412), "mobile");
      assert.equal(resolveExperienceType(BREAKPOINTS.MOBILE_MAX), "mobile"); // 767px
    });

    it("Scenario EXP-2: Resolves Tablet experience for viewports between 768px and 1023px", () => {
      assert.equal(resolveExperienceType(BREAKPOINTS.TABLET_MIN), "tablet"); // 768px
      assert.equal(resolveExperienceType(800), "tablet");
      assert.equal(resolveExperienceType(834), "tablet");
      assert.equal(resolveExperienceType(900), "tablet");
      assert.equal(resolveExperienceType(BREAKPOINTS.TABLET_MAX), "tablet"); // 1023px
    });

    it("Scenario EXP-3: Resolves Desktop experience for viewports >= 1024px", () => {
      assert.equal(resolveExperienceType(BREAKPOINTS.DESKTOP_MIN), "desktop"); // 1024px
      assert.equal(resolveExperienceType(1280), "desktop");
      assert.equal(resolveExperienceType(1440), "desktop");
      assert.equal(resolveExperienceType(1920), "desktop");
      assert.equal(resolveExperienceType(2560), "desktop");
    });

    it("Scenario EXP-4: Breakpoint constants maintain strict contiguous boundaries", () => {
      assert.equal(BREAKPOINTS.MOBILE_MAX + 1, BREAKPOINTS.TABLET_MIN);
      assert.equal(BREAKPOINTS.TABLET_MAX + 1, BREAKPOINTS.DESKTOP_MIN);
    });

    it("Scenario EXP-5: Standalone and touch helpers return safe defaults in Node environment", () => {
      assert.equal(checkIsPwaStandalone(), false);
      assert.equal(checkIsTouchDevice(), false);
    });
  });

  // ─── Group B: Mobile Bottom Navigation & 5 Destinations Contract ───
  describe("Group B: Mobile Navigation Contract", () => {
    it("Scenario EXP-6: Mobile bottom nav exposes exactly 5 primary destinations", () => {
      const bottomNavPath = path.join(
        process.cwd(),
        "src/components/layout/mobile-bottom-nav.tsx"
      );
      assert.ok(fs.existsSync(bottomNavPath), "mobile-bottom-nav.tsx must exist");
      const content = fs.readFileSync(bottomNavPath, "utf-8");

      // Verify destinations
      assert.ok(content.includes("Beranda"), "Must have Beranda");
      assert.ok(content.includes("Materi"), "Must have Materi");
      assert.ok(content.includes("Tugas"), "Must have Tugas");
      assert.ok(content.includes("Modul"), "Must have Modul");
      assert.ok(content.includes("Menu"), "Must have Menu");
    });

    it("Scenario EXP-7: Mobile menu drawer provides access to secondary features without clutter", () => {
      const drawerPath = path.join(
        process.cwd(),
        "src/components/layout/mobile/mobile-menu-drawer.tsx"
      );
      assert.ok(fs.existsSync(drawerPath), "mobile-menu-drawer.tsx must exist");
      const content = fs.readFileSync(drawerPath, "utf-8");

      assert.ok(content.includes("/dashboard/ai-tutor"), "Drawer must link to AI Tutor");
      assert.ok(content.includes("/dashboard/kelas"), "Drawer must link to Kelas");
      assert.ok(content.includes("/dashboard/file"), "Drawer must link to Berkas");
      assert.ok(content.includes("/dashboard/playground"), "Drawer must link to Playground");
      assert.ok(content.includes("/dashboard/pengaturan"), "Drawer must link to Pengaturan");
      assert.ok(content.includes("Pasang Aplikasi"), "Drawer must have install trigger");
    });
  });

  // ─── Group C: Desktop Workspace Shell & Top Bar Contract ───
  describe("Group C: Desktop Workspace Architecture", () => {
    it("Scenario EXP-8: Desktop workspace components exist with high information density", () => {
      const workspacePath = path.join(
        process.cwd(),
        "src/components/layout/desktop/desktop-workspace.tsx"
      );
      const topBarPath = path.join(
        process.cwd(),
        "src/components/layout/desktop/desktop-top-bar.tsx"
      );
      const tablePath = path.join(
        process.cwd(),
        "src/components/layout/desktop/desktop-table.tsx"
      );

      assert.ok(fs.existsSync(workspacePath), "DesktopWorkspace must exist");
      assert.ok(fs.existsSync(topBarPath), "DesktopTopBar must exist");
      assert.ok(fs.existsSync(tablePath), "DesktopTable primitives must exist");
    });

    it("Scenario EXP-9: Desktop sidebar uses application workspace width (245px / 68px)", () => {
      const sidebarPath = path.join(
        process.cwd(),
        "src/components/layout/sidebar/sidebar.tsx"
      );
      const content = fs.readFileSync(sidebarPath, "utf-8");

      assert.ok(content.includes("w-[245px]"), "Expanded sidebar must be 245px");
      assert.ok(content.includes("w-[68px]"), "Collapsed sidebar must be 68px");
    });
  });

  // ─── Group D: PWA Manifest & Download Experience ───
  describe("Group D: PWA Manifest & Download Experience", () => {
    it("Scenario EXP-10: PWA Manifest contains valid configuration, display standalone, and icons", () => {
      const manifestPath = path.join(process.cwd(), "public/manifest.json");
      assert.ok(fs.existsSync(manifestPath), "manifest.json must exist");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

      assert.equal(manifest.name, "Velqora — Modern Learning Platform");
      assert.equal(manifest.short_name, "Velqora");
      assert.equal(manifest.display, "standalone");
      assert.equal(manifest.start_url, "/dashboard");
      assert.ok(manifest.icons && manifest.icons.length >= 3, "Must have at least 3 icon variants");

      const has192 = manifest.icons.some((i: any) => i.sizes === "192x192");
      const has512 = manifest.icons.some((i: any) => i.sizes === "512x512");
      const hasMaskable = manifest.icons.some((i: any) => i.purpose === "maskable");

      assert.ok(has192, "Must include 192x192 icon");
      assert.ok(has512, "Must include 512x512 icon");
      assert.ok(hasMaskable, "Must include maskable icon");
    });

    it("Scenario EXP-11: Dedicated /download page exists and provides multi-platform guidance", () => {
      const downloadPath = path.join(process.cwd(), "src/app/download/page.tsx");
      assert.ok(fs.existsSync(downloadPath), "download/page.tsx must exist");
      const content = fs.readFileSync(downloadPath, "utf-8");

      assert.ok(content.includes("Android"), "Must guide Android");
      assert.ok(content.includes("iPhone / iPad"), "Must guide iOS");
      assert.ok(content.includes("Desktop"), "Must guide Desktop");
      assert.ok(content.includes("Progressive Web Application"), "Must state PWA clearly");
    });
  });

  // ─── Group E: AI-Slop Prevention & Design Rigor ───
  describe("Group E: Design Rigor & Anti-Slop Policy", () => {
    it("Scenario EXP-12: Desktop & Mobile components adhere to calm, non-glowing aesthetic", () => {
      const filesToCheck = [
        "src/components/layout/desktop/desktop-workspace.tsx",
        "src/components/layout/desktop/desktop-top-bar.tsx",
        "src/components/layout/mobile/mobile-top-bar.tsx",
        "src/components/dashboard/mobile-dashboard-view.tsx",
        "src/components/tasks/desktop-task-workspace.tsx",
      ];

      filesToCheck.forEach((rel) => {
        const full = path.join(process.cwd(), rel);
        if (fs.existsSync(full)) {
          const text = fs.readFileSync(full, "utf-8");
          assert.ok(!text.includes("glow-neon"), `${rel} must not contain neon glow`);
          assert.ok(!text.includes("ai-orb"), `${rel} must not contain ai-orb`);
          assert.ok(!text.includes("floating-orb"), `${rel} must not contain floating-orb`);
        }
      });
    });
  });
});
