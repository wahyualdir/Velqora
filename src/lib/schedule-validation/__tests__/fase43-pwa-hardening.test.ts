import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("FASE 43: PWA Install Experience & Hardening Suite (Fase 7)", () => {
  const rootDir = process.cwd();

  // ─── Group A: Real PNG Icon Validation & Dimensions ───
  describe("Group A: Genuine PNG Icons & Safe Zone Validation", () => {
    it("Scenario PWA-1: public/icons/icon-192.png is a genuine PNG with 192x192 dimensions", () => {
      const iconPath = path.join(rootDir, "public/icons/icon-192.png");
      assert.ok(fs.existsSync(iconPath), "icon-192.png must exist");

      const buf = fs.readFileSync(iconPath);
      // PNG Magic Bytes: 89 50 4E 47 0D 0A 1A 0A
      const isPng = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      assert.ok(isPng, "icon-192.png must be genuine PNG data (not JPEG)");

      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      assert.equal(width, 192, "Width must be 192px");
      assert.equal(height, 192, "Height must be 192px");
    });

    it("Scenario PWA-2: public/icons/icon-512.png is a genuine PNG with 512x512 dimensions", () => {
      const iconPath = path.join(rootDir, "public/icons/icon-512.png");
      assert.ok(fs.existsSync(iconPath), "icon-512.png must exist");

      const buf = fs.readFileSync(iconPath);
      const isPng = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      assert.ok(isPng, "icon-512.png must be genuine PNG data (not JPEG)");

      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      assert.equal(width, 512, "Width must be 512px");
      assert.equal(height, 512, "Height must be 512px");
    });

    it("Scenario PWA-3: public/icons/icon-maskable-512.png is a genuine PNG with 512x512 dimensions and full-bleed safe zone", () => {
      const iconPath = path.join(rootDir, "public/icons/icon-maskable-512.png");
      assert.ok(fs.existsSync(iconPath), "icon-maskable-512.png must exist");

      const buf = fs.readFileSync(iconPath);
      const isPng = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      assert.ok(isPng, "icon-maskable-512.png must be genuine PNG data (not JPEG)");

      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      assert.equal(width, 512, "Width must be 512px");
      assert.equal(height, 512, "Height must be 512px");

      // Verify maskable SVG master has full bleed rect without rounded corners
      const svgMaskable = fs.readFileSync(path.join(rootDir, "public/icons/icon-maskable-512.svg"), "utf8");
      assert.ok(svgMaskable.includes('<rect width="512" height="512" fill="#0b0f19"/>'), "Must have full-bleed rect");
    });
  });

  // ─── Group B: Manifest.json PWA Compliance ───
  describe("Group B: Manifest.json PWA Standards", () => {
    it("Scenario PWA-4: manifest.json defines valid standalone configuration and correct icon mime types", () => {
      const manifestPath = path.join(rootDir, "public/manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      assert.equal(manifest.display, "standalone");
      assert.equal(manifest.start_url, "/dashboard");
      assert.ok(manifest.theme_color, "Must define theme_color");
      assert.ok(manifest.background_color, "Must define background_color");

      const icon192 = manifest.icons.find((i: any) => i.src === "/icons/icon-192.png");
      const icon512 = manifest.icons.find((i: any) => i.src === "/icons/icon-512.png");
      const iconMaskable = manifest.icons.find((i: any) => i.src === "/icons/icon-maskable-512.png");

      assert.ok(icon192 && icon192.type === "image/png", "icon-192 must have type image/png");
      assert.ok(icon512 && icon512.type === "image/png", "icon-512 must have type image/png");
      assert.ok(iconMaskable && iconMaskable.purpose === "maskable" && iconMaskable.type === "image/png", "icon-maskable must have purpose maskable and type image/png");
    });
  });

  // ─── Group C: iOS Safari Integration & Meta Tags ───
  describe("Group C: iOS Safari Integration & Meta Tags", () => {
    it("Scenario PWA-5: Root Layout defines apple-touch-icon, apple-mobile-web-app meta tags", () => {
      const layoutPath = path.join(rootDir, "src/app/layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf8");

      assert.ok(layoutContent.includes('rel="apple-touch-icon"'), "Must include apple-touch-icon link");
      assert.ok(layoutContent.includes("/icons/icon-192.png"), "apple-touch-icon must point to icon-192.png");
      assert.ok(layoutContent.includes('name="apple-mobile-web-app-capable" content="yes"'), "Must have apple-mobile-web-app-capable meta");
      assert.ok(layoutContent.includes('name="apple-mobile-web-app-title" content="Velqora"'), "Must have apple-mobile-web-app-title meta");
    });

    it("Scenario PWA-6: PWA Register detects iOS Safari and provides manual install guidance", () => {
      const registerPath = path.join(rootDir, "src/components/layout/pwa-register.tsx");
      const registerContent = fs.readFileSync(registerPath, "utf8");

      assert.ok(registerContent.includes("iphone|ipad|ipod"), "Must detect iOS user agent");
      assert.ok(registerContent.includes("Add to Home Screen") || registerContent.includes("Tambah ke Layar Utama"), "Must instruct Add to Home Screen");
      assert.ok(registerContent.includes("Share"), "Must mention Share button");
      assert.ok(registerContent.includes("pwa_install_dismissed"), "Must have persistent dismissal");
    });
  });

  // ─── Group D: Service Worker Cache Hardening ───
  describe("Group D: Service Worker Asset Hardening", () => {
    it("Scenario PWA-7: public/sw.js includes genuine PNG icons in pre-cache list", () => {
      const swPath = path.join(rootDir, "public/sw.js");
      const swContent = fs.readFileSync(swPath, "utf8");

      assert.ok(swContent.includes("/icons/icon-192.png"), "SW must pre-cache icon-192.png");
      assert.ok(swContent.includes("/icons/icon-512.png"), "SW must pre-cache icon-512.png");
      assert.ok(swContent.includes("/icons/icon-maskable-512.png"), "SW must pre-cache icon-maskable-512.png");
      assert.ok(swContent.includes("caches.delete"), "SW must purge old caches on activation");
    });
  });
});
