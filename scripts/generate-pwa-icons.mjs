import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT_DIR, "public");
const ICONS_DIR = path.resolve(PUBLIC_DIR, "icons");

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// ─── CANONICAL VELQORA BRAND GEOMETRY (32x32 Master Grid) ───
const LEFT_PILLAR_PATH = "M6 6.5C6 5.67 6.67 5 7.5 5H12.2C12.87 5 13.46 5.43 13.65 6.07L18.45 22.07C18.74 23.03 18.02 24 17.02 24H12.8C12.13 24 11.54 23.57 11.35 22.93L6.15 7.43C6.05 7.14 6 6.83 6 6.5Z";
const RIGHT_WING_PATH = "M26 6.5C26 5.67 25.33 5 24.5 5H19.8C19.13 5 18.54 5.43 18.35 6.07L13.55 22.07C13.26 23.03 13.98 24 14.98 24H19.2C19.87 24 20.46 23.57 20.65 22.93L25.85 7.43C25.95 7.14 26 6.83 26 6.5Z";
const KEYSTONE_POINTS = "16,21.5 18.5,26 13.5,26";

const COLOR_LEFT = "#0071e3";
const COLOR_RIGHT = "#2997ff";
const COLOR_KEYSTONE = "#60a5fa";
const COLOR_BG = "#0b0f19";

// 1. Master Web Logo / Favicon SVG (32x32 viewBox)
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" shape-rendering="geometricPrecision">
  <rect width="32" height="32" rx="8" fill="${COLOR_BG}"/>
  <!-- Left Foundation Pillar -->
  <path d="${LEFT_PILLAR_PATH}" fill="${COLOR_LEFT}"/>
  <!-- Right Ascending Wing -->
  <path d="${RIGHT_WING_PATH}" fill="${COLOR_RIGHT}"/>
  <!-- Central Keystone Anchor -->
  <polygon points="${KEYSTONE_POINTS}" fill="${COLOR_KEYSTONE}"/>
</svg>`;

// 2. Standard 192x192 SVG Definition
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192" fill="none" shape-rendering="geometricPrecision">
  <rect width="192" height="192" rx="44" fill="${COLOR_BG}"/>
  <rect x="1.5" y="1.5" width="189" height="189" rx="42.5" stroke="#1e293b" stroke-width="3"/>
  <g transform="scale(6)">
    <path d="${LEFT_PILLAR_PATH}" fill="${COLOR_LEFT}"/>
    <path d="${RIGHT_WING_PATH}" fill="${COLOR_RIGHT}"/>
    <polygon points="${KEYSTONE_POINTS}" fill="${COLOR_KEYSTONE}"/>
  </g>
</svg>`;

// 3. Standard 512x512 SVG Definition
const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none" shape-rendering="geometricPrecision">
  <rect width="512" height="512" rx="116" fill="${COLOR_BG}"/>
  <rect x="3" y="3" width="506" height="506" rx="113" stroke="#1e293b" stroke-width="6"/>
  <g transform="scale(16)">
    <path d="${LEFT_PILLAR_PATH}" fill="${COLOR_LEFT}"/>
    <path d="${RIGHT_WING_PATH}" fill="${COLOR_RIGHT}"/>
    <polygon points="${KEYSTONE_POINTS}" fill="${COLOR_KEYSTONE}"/>
  </g>
</svg>`;

// 4. Maskable 512x512 SVG Definition (Full bleed #0b0f19 background, logo scaled to 75% centered within safe zone)
const svgMaskable512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none" shape-rendering="geometricPrecision">
  <!-- Full-bleed background with no rounded corners for OS adaptive cropping -->
  <rect width="512" height="512" fill="${COLOR_BG}"/>
  <!-- Scaled logo in safe zone (384x384 in 512x512 = exactly 75% diameter) -->
  <g transform="translate(64, 64) scale(12)">
    <path d="${LEFT_PILLAR_PATH}" fill="${COLOR_LEFT}"/>
    <path d="${RIGHT_WING_PATH}" fill="${COLOR_RIGHT}"/>
    <polygon points="${KEYSTONE_POINTS}" fill="${COLOR_KEYSTONE}"/>
  </g>
</svg>`;

// 5. OpenGraph & Twitter Social Banner (1200x630)
const svgBanner1200x630 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" fill="none">
  <rect width="1200" height="630" fill="#070b14"/>
  <!-- Ambient subtle radial glow -->
  <circle cx="600" cy="240" r="320" fill="#0071e3" opacity="0.12"/>
  <!-- Center Mark Icon Box -->
  <g transform="translate(520, 120)">
    <rect width="160" height="160" rx="40" fill="${COLOR_BG}"/>
    <rect x="1" y="1" width="158" height="158" rx="39" stroke="#1e293b" stroke-width="2"/>
    <g transform="scale(5)">
      <path d="${LEFT_PILLAR_PATH}" fill="${COLOR_LEFT}"/>
      <path d="${RIGHT_WING_PATH}" fill="${COLOR_RIGHT}"/>
      <polygon points="${KEYSTONE_POINTS}" fill="${COLOR_KEYSTONE}"/>
    </g>
  </g>
  <!-- Text Brand -->
  <text x="600" y="375" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="52" fill="#ffffff" letter-spacing="-1">
    Vel<tspan fill="#2997ff">qora</tspan>
  </text>
  <text x="600" y="420" text-anchor="middle" font-family="ui-monospace, monospace" font-weight="600" font-size="16" fill="#94a3b8" letter-spacing="4">
    LEARNING PLATFORM &amp; AI WORKSPACE
  </text>
  <text x="600" y="475" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="20" fill="#64748b">
    Platform Perkuliahan &amp; Manajemen Modul Terpadu
  </text>
</svg>`;

function renderSvgToPng(svgString, targetWidth, targetHeight, outputPath) {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: "width",
      value: targetWidth,
    },
    shapeRendering: 2,
    textRendering: 1,
    imageRendering: 1,
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Generated PNG: ${outputPath} (${pngData.width}x${pngData.height}, ${pngBuffer.length} bytes)`);
}

// 1. Write SVGs
fs.writeFileSync(path.join(PUBLIC_DIR, "logo.svg"), masterSvg, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon.svg"), masterSvg, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon-192.svg"), svg192, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon-512.svg"), svg512, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon-maskable-512.svg"), svgMaskable512, "utf8");

// 2. Render PNGs
renderSvgToPng(svg192, 192, 192, path.join(ICONS_DIR, "icon-192.png"));
renderSvgToPng(svg512, 512, 512, path.join(ICONS_DIR, "icon-512.png"));
renderSvgToPng(svgMaskable512, 512, 512, path.join(ICONS_DIR, "icon-maskable-512.png"));
renderSvgToPng(svgBanner1200x630, 1200, 630, path.join(PUBLIC_DIR, "logo-banner.png"));

console.log("All canonical Web and App logo & icon assets synchronized successfully!");

