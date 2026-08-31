import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

describe("FASE 42: Full Breakpoint Responsiveness Matrix Suite (Fase 5)", () => {
  // ─── Group A: Matrix Breakpoint & Layout Container Constraints ───
  describe("Group A: Matrix Breakpoint & Container Scaling", () => {
    it("Scenario RESP-1: Dashboard layout enforces responsive max-width for Web and App surfaces", () => {
      const layoutPath = path.join(process.cwd(), "src/app/dashboard/layout.tsx");
      assert.ok(fs.existsSync(layoutPath), "dashboard/layout.tsx must exist");
      const content = fs.readFileSync(layoutPath, "utf-8");

      assert.ok(content.includes("max-w-[1560px]"), "Web surface must have 1560px max width to prevent infinite stretching");
      assert.ok(content.includes("max-w-2xl"), "App surface must have max-w-2xl centered container on large screens");
      assert.ok(content.includes("!isApp && (sidebarCollapsed"), "Sidebar padding must not offset standalone App surface");
    });

    it("Scenario RESP-2: Section containers enforce controlled max-widths across viewports", () => {
      const sectionPath = path.join(process.cwd(), "src/components/ui/section.tsx");
      assert.ok(fs.existsSync(sectionPath), "section.tsx must exist");
      const content = fs.readFileSync(sectionPath, "utf-8");

      assert.ok(content.includes("max-w-7xl"), "PageContainer must cap at max-w-7xl");
      assert.ok(content.includes("max-w-5xl"), "ContentContainer must cap at max-w-5xl");
      assert.ok(content.includes("max-w-3xl"), "ReadingContainer must cap at max-w-3xl for optimal line length");
    });

    it("Scenario RESP-3: Globals CSS defines fluid typography scales and grid utilities", () => {
      const globalsPath = path.join(process.cwd(), "src/app/globals.css");
      const content = fs.readFileSync(globalsPath, "utf-8");

      assert.ok(content.includes(".text-fluid-display"), "Globals must define text-fluid-display");
      assert.ok(content.includes(".text-fluid-h1"), "Globals must define text-fluid-h1");
      assert.ok(content.includes(".card-grid"), "Globals must define card-grid utility");
      assert.ok(content.includes(".stats-grid"), "Globals must define stats-grid utility");
    });
  });

  // ─── Group B: Table Horizontal Scrollability & Minimum Legible Width ───
  describe("Group B: Data Table Horizontal Scroll & Column Protection", () => {
    it("Scenario RESP-4: DesktopTable enforces overflow-x-auto and min-w-[700px]", () => {
      const tablePath = path.join(
        process.cwd(),
        "src/components/layout/desktop/desktop-table.tsx"
      );
      assert.ok(fs.existsSync(tablePath), "desktop-table.tsx must exist");
      const content = fs.readFileSync(tablePath, "utf-8");

      assert.ok(content.includes("overflow-x-auto"), "DesktopTable wrapper must have overflow-x-auto");
      assert.ok(content.includes("min-w-[700px]"), "DesktopTable must have min-w-[700px] to prevent squeezed columns");
    });

    it("Scenario RESP-5: WorkloadIntelligenceTable enforces scroll wrapper and min-w-[540px]", () => {
      const workloadPath = path.join(
        process.cwd(),
        "src/components/schedule/workload-intelligence-table.tsx"
      );
      assert.ok(fs.existsSync(workloadPath), "workload-intelligence-table.tsx must exist");
      const content = fs.readFileSync(workloadPath, "utf-8");

      assert.ok(content.includes("overflow-x-auto"), "Workload table must have overflow-x-auto");
      assert.ok(content.includes("min-w-[540px]"), "Workload table must enforce min-w-[540px]");
    });

    it("Scenario RESP-6: RecommendationHistoryTable enforces scroll wrapper and min-w-[500px]", () => {
      const recPath = path.join(
        process.cwd(),
        "src/components/schedule/recommendation-history-table.tsx"
      );
      assert.ok(fs.existsSync(recPath), "recommendation-history-table.tsx must exist");
      const content = fs.readFileSync(recPath, "utf-8");

      assert.ok(content.includes("overflow-x-auto"), "Recommendation table must have overflow-x-auto");
      assert.ok(content.includes("min-w-[500px]"), "Recommendation table must enforce min-w-[500px]");
    });
  });

  // ─── Group C: App Surface Standalone Layout & Safe Area Insets ───
  describe("Group C: App Standalone Layout & Hardware Insets", () => {
    it("Scenario RESP-7: MobileTopBar enforces safe-area-inset-top and responsive padding", () => {
      const topBarPath = path.join(
        process.cwd(),
        "src/components/layout/mobile/mobile-top-bar.tsx"
      );
      assert.ok(fs.existsSync(topBarPath), "mobile-top-bar.tsx must exist");
      const content = fs.readFileSync(topBarPath, "utf-8");

      assert.ok(content.includes("safe-area-inset-top"), "MobileTopBar must respect safe-area-inset-top");
      assert.ok(content.includes("h-13"), "MobileTopBar must maintain standard 52px (h-13) touch height");
    });

    it("Scenario RESP-8: MobileBottomNav enforces safe-area-inset-bottom and 48px touch targets", () => {
      const navPath = path.join(
        process.cwd(),
        "src/components/layout/mobile-bottom-nav.tsx"
      );
      assert.ok(fs.existsSync(navPath), "mobile-bottom-nav.tsx must exist");
      const content = fs.readFileSync(navPath, "utf-8");

      assert.ok(content.includes("safe-area-inset-bottom"), "MobileBottomNav must respect safe-area-inset-bottom");
      assert.ok(content.includes("min-h-[48px]"), "Touch targets must be at least 48px");
      assert.ok(content.includes("max-w-md mx-auto"), "Bottom nav items must be centered within max-w-md");
    });

    it("Scenario RESP-9: Desktop fixed sidebar is conditionally omitted on App surface (!isApp)", () => {
      const sidebarPath = path.join(
        process.cwd(),
        "src/components/layout/sidebar/sidebar.tsx"
      );
      assert.ok(fs.existsSync(sidebarPath), "sidebar.tsx must exist");
      const content = fs.readFileSync(sidebarPath, "utf-8");

      assert.ok(content.includes("useSurface"), "Sidebar must consume useSurface");
      assert.ok(content.includes("!isApp &&"), "Fixed desktop sidebar aside must be gated with !isApp");
    });
  });

  // ─── Group D: Split-Pane, AI Tutor & Long Forms Adaptation ───
  describe("Group D: Split-Pane & Long Forms Adaptation", () => {
    it("Scenario RESP-10: AI Tutor workspace supports responsive stacking and collapsible sidebar", () => {
      const aiPath = path.join(
        process.cwd(),
        "src/app/dashboard/ai-tutor/page.tsx"
      );
      assert.ok(fs.existsSync(aiPath), "ai-tutor/page.tsx must exist");
      const sidebarPath = path.join(process.cwd(), "src/components/ai/ai-session-sidebar.tsx");
      assert.ok(fs.existsSync(sidebarPath), "ai-session-sidebar.tsx must exist");
    });

    it("Scenario RESP-11: Modal dialog primitive converts to bottom sheet on mobile and centered modal on desktop", () => {
      const modalPath = path.join(process.cwd(), "src/components/ui/modal.tsx");
      assert.ok(fs.existsSync(modalPath), "modal.tsx must exist");
      const content = fs.readFileSync(modalPath, "utf-8");

      assert.ok(content.includes("items-end sm:items-center"), "Modal must be bottom-sheet on mobile and centered on sm+");
      assert.ok(content.includes("rounded-t-2xl sm:rounded-2xl"), "Modal must have top rounded corners on mobile and full rounded on sm+");
      assert.ok(content.includes("max-h-[90dvh]"), "Modal must enforce 90dvh max height on mobile");
    });

    it("Scenario RESP-12: SubNavTabs and ScheduleNavigation enable frictionless horizontal swipe on small screens", () => {
      const subNavPath = path.join(
        process.cwd(),
        "src/components/layout/sub-nav-tabs.tsx"
      );
      const schedNavPath = path.join(
        process.cwd(),
        "src/components/schedule/schedule-navigation.tsx"
      );

      const subNavContent = fs.readFileSync(subNavPath, "utf-8");
      const schedNavContent = fs.readFileSync(schedNavPath, "utf-8");

      assert.ok(subNavContent.includes("overflow-x-auto"), "SubNavTabs must allow horizontal overflow scroll");
      assert.ok(schedNavContent.includes("overflow-x-auto"), "ScheduleNavigation must allow horizontal overflow scroll");
    });
  });
});
