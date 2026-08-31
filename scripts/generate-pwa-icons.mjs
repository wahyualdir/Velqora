import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ICONS_DIR = path.resolve(process.cwd(), "public/icons");

// 1. Standard 192x192 SVG Definition
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192" fill="none">
  <rect width="192" height="192" rx="40" fill="#0b0f19"/>
  <rect x="1" y="1" width="190" height="190" rx="39" stroke="#1e293b" stroke-width="2"/>
  <path d="M38 42C38 37 42 33 47 33H75C79 33 82.5 35.5 83.7 39.3L112.5 135.3C114.2 141 109.9 147 103.9 147H78.7C74.7 147 71.2 144.5 70 140.7L38.9 47.6C38.3 45.8 38 43.9 38 42Z" fill="#0071e3"/>
  <path d="M154 42C154 37 150 33 145 33H117C113 33 109.5 35.5 108.3 39.3L79.5 135.3C77.8 141 82.1 147 88.1 147H113.3C117.3 147 120.8 144.5 122 140.7L153.1 47.6C153.7 45.8 154 43.9 154 42Z" fill="#2997ff"/>
  <polygon points="96,132 111,159 81,159" fill="#93c5fd"/>
</svg>`;

// 2. Standard 512x512 SVG Definition
const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <rect width="512" height="512" rx="108" fill="#0b0f19"/>
  <rect x="2" y="2" width="508" height="508" rx="106" stroke="#1e293b" stroke-width="4"/>
  <path d="M102 112C102 98.7 112.7 88 126 88H200C210.7 88 220 94.7 223.2 104.8L300 360.8C304.5 376 293.1 392 277.1 392H210C199.3 392 190 385.3 186.8 375.2L104.4 126.9C102.8 122.1 102 117.1 102 112Z" fill="#0071e3"/>
  <path d="M410 112C410 98.7 399.3 88 386 88H312C301.3 88 292 94.7 288.8 104.8L212 360.8C207.5 376 218.9 392 234.9 392H302C312.7 392 322 385.3 325.2 375.2L407.6 126.9C409.2 122.1 410 117.1 410 112Z" fill="#2997ff"/>
  <polygon points="256,352 296,424 216,424" fill="#93c5fd"/>
</svg>`;

// 3. Maskable 512x512 SVG Definition (Full bleed #0b0f19 background, logo scaled to 75% within 80% safe zone)
const svgMaskable512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Full-bleed background with no rounded corners for OS adaptive cropping -->
  <rect width="512" height="512" fill="#0b0f19"/>
  <!-- Scaled logo in safe zone (centered in 512x512, scaled to 0.72x centered) -->
  <g transform="translate(71.68, 71.68) scale(0.72)">
    <path d="M102 112C102 98.7 112.7 88 126 88H200C210.7 88 220 94.7 223.2 104.8L300 360.8C304.5 376 293.1 392 277.1 392H210C199.3 392 190 385.3 186.8 375.2L104.4 126.9C102.8 122.1 102 117.1 102 112Z" fill="#0071e3"/>
    <path d="M410 112C410 98.7 399.3 88 386 88H312C301.3 88 292 94.7 288.8 104.8L212 360.8C207.5 376 218.9 392 234.9 392H302C312.7 392 322 385.3 325.2 375.2L407.6 126.9C409.2 122.1 410 117.1 410 112Z" fill="#2997ff"/>
    <polygon points="256,352 296,424 216,424" fill="#93c5fd"/>
  </g>
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
  console.log(`Generated: ${outputPath} (${pngData.width}x${pngData.height}, ${pngBuffer.length} bytes)`);
}

renderSvgToPng(svg192, 192, 192, path.join(ICONS_DIR, "icon-192.png"));
renderSvgToPng(svg512, 512, 512, path.join(ICONS_DIR, "icon-512.png"));
renderSvgToPng(svgMaskable512, 512, 512, path.join(ICONS_DIR, "icon-maskable-512.png"));

// Also update the SVG files in public/icons
fs.writeFileSync(path.join(ICONS_DIR, "icon-192.svg"), svg192, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon-512.svg"), svg512, "utf8");
fs.writeFileSync(path.join(ICONS_DIR, "icon-maskable-512.svg"), svgMaskable512, "utf8");

console.log("All icons generated successfully!");
