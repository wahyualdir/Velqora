export type ComputeModeId =
  | "python"
  | "pytorch"
  | "rust"
  | "julia"
  | "r"
  | "postgres";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ImpulseState {
  active: boolean;
  x: number;
  y: number;
  age: number;
}

export interface ImpulseEvent {
  id: number;
  x: number;
  y: number;
  normX: number;
  normY: number;
  age: number;
}

export interface RenderCtx {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  compact: boolean;
  safeTop: number;
  safeBottom: number;
  t: number;
  mx: number; // Damped spring normalized cursor X [-1..1]
  my: number; // Damped spring normalized cursor Y [-1..1]
  cursorActive: boolean;
  hoverAlpha: number; // Smoothly eased [0..1] hover presence
  cursorPx: number;
  cursorPy: number;
  impulse: ImpulseState;
  impulses: ImpulseEvent[];
}

export const OBSIDIAN_PALETTE = {
  terracotta: "#D4664A",
  terracottaRgb: "212, 102, 74",
  terracottaDeep: "#C2553A",
  sand: "#E5C194",
  sandRgb: "229, 193, 148",
  emerald: "#34D399",
  emeraldRgb: "52, 211, 153",
  amber: "#FBBF24",
  amberRgb: "251, 191, 36",
  coral: "#F87171",
  coralRgb: "248, 113, 113",
  stone: "#A8A29E",
  stoneRgb: "168, 162, 158",
  muted: "#8C857F",
  ivory: "#F5F5F4",
  surfaceDark: "#1C1917",
  stageDark: "#0F0D0C",
} as const;

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

export function easeOutCubic(u: number): number {
  const c = clamp(u, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

export function easeInOutCubic(u: number): number {
  const c = clamp(u, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

export function easeInOutSine(u: number): number {
  const c = clamp(u, 0, 1);
  return -(Math.cos(Math.PI * c) - 1) / 2;
}

export function lerpRgbTuple(
  a: [number, number, number],
  b: [number, number, number],
  u: number
): string {
  const t = clamp(u, 0, 1);
  const r = Math.round(lerp(a[0], b[0], t));
  const g = Math.round(lerp(a[1], b[1], t));
  const bl = Math.round(lerp(a[2], b[2], t));
  return `${r}, ${g}, ${bl}`;
}

export function rotate3D(p: Vec3, rx: number, ry: number, rz = 0): Vec3 {
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x1 = p.x * cosY + p.z * sinY;
  const z1 = -p.x * sinY + p.z * cosY;

  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;

  if (rz === 0) return { x: x1, y: y2, z: z2 };

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  return {
    x: x1 * cosZ - y2 * sinZ,
    y: x1 * sinZ + y2 * cosZ,
    z: z2,
  };
}

export function project3D(p: Vec3, cx: number, cy: number, fov = 460) {
  const scale = fov / Math.max(120, fov - p.z);
  return {
    px: cx + p.x * scale,
    py: cy + p.y * scale,
    scale,
    z: p.z,
  };
}

/** Exact closed-form inverse ray-plane projection onto horizontal plane y = yPlane. */
export function unprojectPlaneY(
  px: number,
  py: number,
  yPlane: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fov = 480
): { x: number; z: number } {
  const sx = px - cx;
  const sy = py - cy;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);

  const denom = fov * sinX - sy * cosX;
  if (Math.abs(denom) < 1e-2) {
    return { x: 0, z: 0 };
  }

  const z1 = (fov * yPlane * cosX - sy * (fov - yPlane * sinX)) / denom;
  const z2 = yPlane * sinX + z1 * cosX;
  const scale = fov / Math.max(120, fov - z2);
  const x1 = sx / scale;

  return {
    x: x1 * cosY - z1 * sinY,
    z: x1 * sinY + z1 * cosY,
  };
}

export function evalQuadBezier(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  u: number
): { x: number; y: number } {
  const omt = 1 - u;
  return {
    x: omt * omt * x0 + 2 * omt * u * cx + u * u * x1,
    y: omt * omt * y0 + 2 * omt * u * cy + u * u * y1,
  };
}

export function evalCubicBezier(
  x0: number,
  y0: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x1: number,
  y1: number,
  u: number
): { x: number; y: number } {
  const omt = 1 - u;
  const omt2 = omt * omt;
  const u2 = u * u;
  return {
    x: omt2 * omt * x0 + 3 * omt2 * u * cx1 + 3 * omt * u2 * cx2 + u2 * u * x1,
    y: omt2 * omt * y0 + 3 * omt2 * u * cy1 + 3 * omt * u2 * cy2 + u2 * u * y1,
  };
}

/** Trace a smooth C1 quadratic midpoint spline through arbitrary points. */
export function traceSmoothPath(
  ctx: CanvasRenderingContext2D,
  pts: ReadonlyArray<{ x: number; y: number }>,
  moveFirst = true
) {
  if (pts.length === 0) return;
  if (moveFirst) ctx.moveTo(pts[0].x, pts[0].y);
  else ctx.lineTo(pts[0].x, pts[0].y);

  if (pts.length === 1) return;
  if (pts.length === 2) {
    ctx.lineTo(pts[1].x, pts[1].y);
    return;
  }

  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) * 0.5;
    const my = (pts[i].y + pts[i + 1].y) * 0.5;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
}

/** Subtle architectural focal anchor (crisp ring + core, zero garish neon bloom). */
export function drawFocalNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rgb: string,
  fillHex: string,
  haloScale = 1.85
) {
  ctx.fillStyle = `rgba(${rgb}, 0.14)`;
  ctx.beginPath();
  ctx.arc(x, y, radius * haloScale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fillHex;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(245, 245, 244, 0.88)";
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.8, radius * 0.34), 0, Math.PI * 2);
  ctx.fill();
}

/** Crisp geometric directional tangent/gradient vector arrow. */
export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeStyle: string,
  lineWidth = 1.2,
  headLen = 4.5
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;

  const angle = Math.atan2(dy, dx);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

/** Clean borderless editorial mono label directly on canvas (no sticker box clutter). */
export function drawMicroLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    fontSize?: number;
    weight?: number;
    color?: string;
    backing?: boolean;
  } = {}
) {
  const {
    align = "center",
    baseline = "middle",
    fontSize = 8.5,
    weight = 500,
    color = "rgba(168, 162, 158, 0.85)",
    backing = true,
  } = options;

  ctx.save();
  ctx.font = `${weight} ${fontSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if (backing) {
    ctx.strokeStyle = "rgba(15, 13, 12, 0.88)";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export interface CanvasBadgeOptions {
  align?: "left" | "center" | "right";
  fontSize?: number;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  padX?: number;
  padY?: number;
  radius?: number;
  dotColor?: string;
}

/** Minimal inline chip reserved strictly for focal phase indicators. */
export function drawCanvasBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: CanvasBadgeOptions = {}
) {
  const {
    align = "center",
    fontSize = 8,
    textColor = OBSIDIAN_PALETTE.ivory,
    bgColor = "rgba(18, 15, 13, 0.84)",
    borderColor = "rgba(168, 162, 158, 0.18)",
    padX = 5.5,
    padY = 2.5,
    radius = 999,
    dotColor,
  } = options;

  ctx.save();
  ctx.font = `500 ${fontSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`;
  const textW = ctx.measureText(text).width;
  const dotSpace = dotColor ? 8 : 0;
  const boxW = textW + padX * 2 + dotSpace;
  const boxH = fontSize + padY * 2;

  let boxX = x - boxW * 0.5;
  if (align === "left") boxX = x;
  else if (align === "right") boxX = x - boxW;
  const boxY = y - boxH * 0.5;

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, Math.min(radius, boxH * 0.5));
  ctx.fill();
  ctx.stroke();

  if (dotColor) {
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(boxX + padX + 2, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, boxX + padX + dotSpace, y + 0.5);
  ctx.restore();
}

export function drawMiniProgressBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  ratio: number,
  fillHex: string,
  bgColor = "rgba(41, 37, 36, 0.7)"
) {
  const r = Math.min(h * 0.5, 2);
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();

  const fillW = Math.max(h, w * clamp(ratio, 0, 1));
  ctx.fillStyle = fillHex;
  ctx.beginPath();
  ctx.roundRect(x, y, fillW, h, r);
  ctx.fill();
}
