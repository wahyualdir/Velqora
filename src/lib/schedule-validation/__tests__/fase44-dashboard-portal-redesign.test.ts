import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { SIDEBAR_CATEGORIES } from "@/lib/constants";
import {
  getCurrentAcademicPeriod,
  getIndonesianDayName,
  getScheduleTimeRange,
  isScheduleLiveNow,
  resolveActiveTopicEmblem,
} from "@/surfaces/web/dashboard/dashboard-utils";

describe("FASE 44: Learning Workspace Dashboard Redesign & Integration Suite", () => {
  describe("Group A: Workspace Date & Schedule Time Helpers", () => {
    it("Formats November date cleanly without college semester labels", () => {
      const novDate = new Date(2026, 10, 15, 10, 0, 0);
      const info = getCurrentAcademicPeriod(novDate);
      assert.equal(info.badgeText, "Kurikulum AI & Data");
      assert.equal(info.semesterLabel, "Minggu, 15 November 2026");
      assert.equal(info.shortPeriod, "Minggu, 15 Nov");
    });

    it("Formats February date cleanly without college semester labels", () => {
      const febDate = new Date(2027, 1, 10, 10, 0, 0);
      const info = getCurrentAcademicPeriod(febDate);
      assert.equal(info.badgeText, "Kurikulum AI & Data");
      assert.equal(info.semesterLabel, "Rabu, 10 Februari 2027");
    });

    it("Maps weekdays cleanly to Indonesian day names", () => {
      const sunday = new Date(2026, 10, 15, 10, 0, 0); // 2026-11-15 is Minggu
      assert.equal(getIndonesianDayName(sunday), "Minggu");
      const monday = new Date(2026, 10, 16, 10, 0, 0);
      assert.equal(getIndonesianDayName(monday), "Senin");
    });

    it("Formats time ranges and accurately detects live active schedule sessions", () => {
      const sundaySession = {
        day: "Minggu",
        start_time: "08:45",
        end_time: "11:15",
        time: "08:45 - 11:15",
      };
      assert.equal(getScheduleTimeRange(sundaySession), "08:45 - 11:15 WIB");

      const insideWindow = new Date(2026, 10, 15, 9, 30, 0); // Sunday 09:30
      const outsideWindow = new Date(2026, 10, 15, 13, 0, 0); // Sunday 13:00
      const wrongDay = new Date(2026, 10, 16, 9, 30, 0); // Monday 09:30

      assert.equal(isScheduleLiveNow(sundaySession, insideWindow), true);
      assert.equal(isScheduleLiveNow(sundaySession, outsideWindow), false);
      assert.equal(isScheduleLiveNow(sundaySession, wrongDay), false);
    });
  });

  describe("Group B: Contextual Topic Emblem Resolution", () => {
    it("Resolves recognizable programming/academic tracks accurately", () => {
      const tsEmblem = resolveActiveTopicEmblem(
        [{ id: "m1", title: "TypeScript Web Architecture", category: { name: "TypeScript" } }],
        [],
        []
      );
      assert.equal(tsEmblem.code, "TS");
      assert.equal(tsEmblem.label, "TYPESCRIPT");
      assert.equal(tsEmblem.href, "/dashboard/modul?module=m1");

      const pyEmblem = resolveActiveTopicEmblem(
        [{ id: "m2", title: "Python Data Science", category: { name: "Python" } }],
        [],
        []
      );
      assert.equal(pyEmblem.code, "PY");
      assert.equal(pyEmblem.label, "PYTHON & DATA");

      const sqlEmblem = resolveActiveTopicEmblem(
        [],
        [{ id: "t1", subject: "Basis Data SQL" }],
        []
      );
      assert.equal(sqlEmblem.code, "SQL");
    });

    it("Falls back to a clean 2-letter monogram when no preset matches", () => {
      const custom = resolveActiveTopicEmblem(
        [{ id: "m3", title: "Sistem Operasi Modern", category: { name: "Jaringan Komputer" } }],
        [],
        []
      );
      assert.equal(custom.code, "JK");
      assert.equal(custom.label, "JARINGAN KOMPUTER");
    });
  });

  describe("Group C: Portal Layout & Velqora Theme Architecture", () => {
    it("Mounts DesktopTopBar inside DashboardLayout and links Jadwal & Tugas safely", () => {
      const layout = fs.readFileSync(
        path.join(process.cwd(), "src/app/dashboard/layout.tsx"),
        "utf-8"
      );
      assert.ok(layout.includes("<DesktopTopBar"), "DesktopTopBar must be mounted in dashboard layout");

      const sidebarHrefs = SIDEBAR_CATEGORIES.flatMap((c) => c.links.map((l) => l.href));
      assert.ok(sidebarHrefs.includes("/dashboard/jadwal"), "Sidebar must link /dashboard/jadwal");
      assert.ok(sidebarHrefs.includes("/dashboard/tugas"), "Sidebar must link /dashboard/tugas");
      assert.ok(!sidebarHrefs.includes("/dashboard/kelas"), "SIDEBAR_CATEGORIES must not link deprecated /dashboard/kelas");
    });

    it("DesktopDashboardView composes Portal Header, Focus PRIORITAS UTAMA, Jadwal Hari Ini, Tenggat Terdekat, and Right Contextual Rail", () => {
      const deskView = fs.readFileSync(
        path.join(process.cwd(), "src/surfaces/web/dashboard/desktop-dashboard-view.tsx"),
        "utf-8"
      );
      assert.ok(deskView.includes("DashboardHeader"));
      assert.ok(deskView.includes("DashboardFocus"));
      assert.ok(deskView.includes("DashboardTodaySchedule"));
      assert.ok(deskView.includes("DashboardTasksList"));
      assert.ok(deskView.includes("DashboardRightRail"));

      const focus = fs.readFileSync(
        path.join(process.cwd(), "src/surfaces/web/dashboard/dashboard-focus.tsx"),
        "utf-8"
      );
      assert.ok(focus.includes("Prioritas Utama"));
      assert.ok(focus.includes("w-1 rounded-full"), "Must use clean internal accent pill");

      const rail = fs.readFileSync(
        path.join(process.cwd(), "src/surfaces/web/dashboard/dashboard-right-rail.tsx"),
        "utf-8"
      );
      assert.ok(rail.includes("Hari Ini"));
      assert.ok(rail.includes("Detail Modul"));
      assert.ok(rail.includes("Status Workspace"));
    });
  });
});
