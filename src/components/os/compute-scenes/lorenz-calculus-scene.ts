import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  drawVectorArrow,
  easeInOutCubic,
  easeOutCubic,
  lerp,
  project3D,
  rotate3D,
  traceSmoothPath,
  type RenderCtx,
  type Vec3,
} from "./types";

interface LorenzState {
  rawX: number;
  rawY: number;
  rawZ: number;
  vx: number;
  vy: number;
  vz: number;
  speed: number;
  pt: Vec3;
}

const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;
const RK4_DT = 0.009;
const LORENZ_FOCUS_XY = Math.sqrt(BETA * (RHO - 1)); // sqrt(72)

function lorenzDeriv(x: number, y: number, z: number): Vec3 {
  return {
    x: SIGMA * (y - x),
    y: x * (RHO - z) - y,
    z: x * y - BETA * z,
  };
}

function rk4Step(x: number, y: number, z: number, dt: number): { x: number; y: number; z: number } {
  const k1 = lorenzDeriv(x, y, z);
  const k2 = lorenzDeriv(x + 0.5 * dt * k1.x, y + 0.5 * dt * k1.y, z + 0.5 * dt * k1.z);
  const k3 = lorenzDeriv(x + 0.5 * dt * k2.x, y + 0.5 * dt * k2.y, z + 0.5 * dt * k2.z);
  const k4 = lorenzDeriv(x + dt * k3.x, y + dt * k3.y, z + dt * k3.z);
  return {
    x: x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    z: z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z),
  };
}

function toSceneVec(x: number, y: number, z: number): Vec3 {
  // Orient Lorenz +z upward in viewport (-y in canvas) for crisp butterfly lobes
  return { x: x * 4.5, y: -(z - 25) * 4.0, z: y * 4.3 };
}

function buildAttractorCache() {
  let x = 1.0;
  let y = 1.0;
  let z = 1.0;

  for (let i = 0; i < 320; i++) {
    ({ x, y, z } = rk4Step(x, y, z, RK4_DT));
  }

  const skeleton: LorenzState[] = [];
  for (let i = 0; i < 1200; i++) {
    const d = lorenzDeriv(x, y, z);
    skeleton.push({
      rawX: x,
      rawY: y,
      rawZ: z,
      vx: d.x,
      vy: d.y,
      vz: d.z,
      speed: Math.hypot(d.x, d.y, d.z),
      pt: toSceneVec(x, y, z),
    });
    ({ x, y, z } = rk4Step(x, y, z, RK4_DT));
  }

  const TWIN_STEPS = 720;
  const seed = skeleton[180];
  let ax = seed.rawX;
  let ay = seed.rawY;
  let az = seed.rawZ;
  let bx = seed.rawX + 0.08;
  let by = seed.rawY;
  let bz = seed.rawZ;

  const twinA: LorenzState[] = [];
  const twinB: LorenzState[] = [];
  const logDivs: number[] = [];

  for (let i = 0; i < TWIN_STEPS; i++) {
    const da = lorenzDeriv(ax, ay, az);
    const db = lorenzDeriv(bx, by, bz);
    twinA.push({
      rawX: ax,
      rawY: ay,
      rawZ: az,
      vx: da.x,
      vy: da.y,
      vz: da.z,
      speed: Math.hypot(da.x, da.y, da.z),
      pt: toSceneVec(ax, ay, az),
    });
    twinB.push({
      rawX: bx,
      rawY: by,
      rawZ: bz,
      vx: db.x,
      vy: db.y,
      vz: db.z,
      speed: Math.hypot(db.x, db.y, db.z),
      pt: toSceneVec(bx, by, bz),
    });
    const dist = Math.max(0.01, Math.hypot(ax - bx, ay - by, az - bz));
    logDivs.push(Math.log(dist / 0.08));

    ({ x: ax, y: ay, z: az } = rk4Step(ax, ay, az, RK4_DT));
    ({ x: bx, y: by, z: bz } = rk4Step(bx, by, bz, RK4_DT));
  }

  return { skeleton, twinA, twinB, logDivs };
}

const LORENZ_CACHE = buildAttractorCache();

function sampleLorenz(arr: ReadonlyArray<LorenzState>, idxFloat: number): LorenzState {
  const maxIdx = arr.length - 1;
  const c = clamp(idxFloat, 0, maxIdx);
  const i0 = Math.floor(c);
  const i1 = Math.min(maxIdx, i0 + 1);
  const f = c - i0;
  const a = arr[i0];
  const b = arr[i1];
  return {
    rawX: lerp(a.rawX, b.rawX, f),
    rawY: lerp(a.rawY, b.rawY, f),
    rawZ: lerp(a.rawZ, b.rawZ, f),
    vx: lerp(a.vx, b.vx, f),
    vy: lerp(a.vy, b.vy, f),
    vz: lerp(a.vz, b.vz, f),
    speed: lerp(a.speed, b.speed, f),
    pt: {
      x: lerp(a.pt.x, b.pt.x, f),
      y: lerp(a.pt.y, b.pt.y, f),
      z: lerp(a.pt.z, b.pt.z, f),
    },
  };
}

export function renderLorenzAttractor(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPx, cursorPy, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);
  const panelW = compact ? 0 : clamp(width * 0.27, 134, 158);
  const cx = compact ? width * 0.5 : (width - panelW - 14) * 0.5;
  const cy = safeTop + stageH * 0.53;

  const scaleFit = compact
    ? Math.min(width, stageH) / 280
    : Math.min(width - panelW, stageH) / 260;

  // Smooth orbital camera rotation
  const ry = -0.45 + t * 0.14 + mx * 0.42;
  const rx = 0.24 + Math.sin(t * 0.22) * 0.08 + my * 0.24;

  const projScaled = (v: Vec3) =>
    project3D(rotate3D({ x: v.x * scaleFit, y: v.y * scaleFit, z: v.z * scaleFit }, rx, ry), cx, cy, 480);

  // Subtle 3D reference axes
  const orig = projScaled(toSceneVec(0, 0, 25));
  const axX = projScaled(toSceneVec(24, 0, 25));
  const axY = projScaled(toSceneVec(0, 24, 25));
  const axZ = projScaled(toSceneVec(0, 0, 48));
  drawVectorArrow(ctx, orig.px, orig.py, axX.px, axX.py, "rgba(168, 162, 158, 0.18)", 0.75, 3.2);
  drawVectorArrow(ctx, orig.px, orig.py, axY.px, axY.py, "rgba(168, 162, 158, 0.18)", 0.75, 3.2);
  drawVectorArrow(ctx, orig.px, orig.py, axZ.px, axZ.py, "rgba(229, 193, 148, 0.2)", 0.75, 3.2);
  drawMicroLabel(ctx, "x", axX.px + 5, axX.py, { fontSize: 7, color: "rgba(168, 162, 158, 0.55)", backing: false });
  drawMicroLabel(ctx, "y", axY.px + 5, axY.py, { fontSize: 7, color: "rgba(168, 162, 158, 0.55)", backing: false });
  drawMicroLabel(ctx, "z(t)", axZ.px, axZ.py - 6, { fontSize: 7, color: "rgba(229, 193, 148, 0.6)", backing: false });

  // Underlying strange-attractor skeleton manifold
  const skelPts: { x: number; y: number }[] = [];
  let hoveredMinDist = 18;
  let hoveredSkelPt: { px: number; py: number } | null = null;
  for (let i = 0; i < LORENZ_CACHE.skeleton.length; i += 2) {
    const p = projScaled(LORENZ_CACHE.skeleton[i].pt);
    skelPts.push({ x: p.px, y: p.py });
    if (hoverAlpha > 0.02) {
      const d = Math.hypot(p.px - cursorPx, p.py - cursorPy);
      if (d < hoveredMinDist) {
        hoveredMinDist = d;
        hoveredSkelPt = p;
      }
    }
  }
  ctx.strokeStyle = "rgba(229, 193, 148, 0.185)";
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  traceSmoothPath(ctx, skelPts);
  ctx.stroke();

  if (hoveredSkelPt && hoverAlpha > 0.02) {
    ctx.save();
    ctx.globalAlpha *= hoverAlpha;
    drawFocalNode(ctx, hoveredSkelPt.px, hoveredSkelPt.py, 2.2, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.8);
    ctx.restore();
  }

  // Twin Equilibrium Foci C- and C+
  const cMinus = projScaled(toSceneVec(-LORENZ_FOCUS_XY, -LORENZ_FOCUS_XY, RHO - 1));
  const cPlus = projScaled(toSceneVec(LORENZ_FOCUS_XY, LORENZ_FOCUS_XY, RHO - 1));
  drawFocalNode(ctx, cMinus.px, cMinus.py, 2.0, OBSIDIAN_PALETTE.stoneRgb, OBSIDIAN_PALETTE.sand, 1.8);
  drawFocalNode(ctx, cPlus.px, cPlus.py, 2.0, OBSIDIAN_PALETTE.stoneRgb, OBSIDIAN_PALETTE.sand, 1.8);
  drawMicroLabel(ctx, "C⁻", cMinus.px - 9, cMinus.py, { align: "right", fontSize: 7.5, color: "rgba(229, 193, 148, 0.72)" });
  drawMicroLabel(ctx, "C⁺", cPlus.px + 9, cPlus.py, { align: "left", fontSize: 7.5, color: "rgba(229, 193, 148, 0.72)" });

  // Continuous RK4 twin orbital sweep with smooth fade-in / fade-out envelope
  const latestImp = impulses[impulses.length - 1];
  const impBurst = latestImp && latestImp.age < 1.9 ? Math.exp(-latestImp.age * 1.7) : 0;

  const N_STEPS = LORENZ_CACHE.twinA.length;
  const cycle = (t * 0.115) % 1;
  const fadeIn = easeOutCubic(clamp(cycle / 0.08, 0, 1));
  const fadeOut = 1 - easeInOutCubic(clamp((cycle - 0.89) / 0.11, 0, 1));
  const loopAlpha = fadeIn * fadeOut;

  // Warm-start after first butterfly wing flip so chaotic divergence & wing switching show right away
  const headFloat = lerp(240, N_STEPS - 2, clamp(cycle / 0.9, 0, 1));
  const tailLen = 175;
  const startFloat = Math.max(0, headFloat - tailLen);
  const iStart = Math.floor(startFloat);
  const iEnd = Math.floor(headFloat);

  const headA = sampleLorenz(LORENZ_CACHE.twinA, headFloat);
  const headB = sampleLorenz(LORENZ_CACHE.twinB, headFloat);

  ctx.save();
  ctx.globalAlpha *= loopAlpha;

  // Draw tapered multi-band orbital ribbons (split into 6 smooth spline batches for silky alpha gradient)
  const bands = 6;
  const totalCount = Math.max(2, iEnd - iStart);
  const stepPerBand = Math.max(2, Math.ceil(totalCount / bands));

  const drawRibbon = (arr: ReadonlyArray<LorenzState>, headState: LorenzState, rgb: string, baseWidth: number) => {
    let prevAnchor: { x: number; y: number } | null = null;
    for (let b = 0; b < bands; b++) {
      const bi0 = iStart + b * stepPerBand;
      const bi1 = Math.min(iEnd, iStart + (b + 1) * stepPerBand);
      if (bi0 > iEnd) break;

      const pts: { x: number; y: number }[] = [];
      if (prevAnchor) pts.push(prevAnchor);
      for (let k = bi0; k <= bi1; k++) {
        const p = projScaled(arr[k].pt);
        pts.push({ x: p.px, y: p.py });
      }
      if (b === bands - 1 || bi1 === iEnd) {
        const hp = projScaled(headState.pt);
        pts.push({ x: hp.px, y: hp.py });
      }
      if (pts.length < 2) continue;
      prevAnchor = pts[pts.length - 1];

      const uBand = (b + 1) / bands;
      ctx.strokeStyle = `rgba(${rgb}, ${(0.12 + uBand * 0.78).toFixed(3)})`;
      ctx.lineWidth = baseWidth * (0.45 + uBand * 0.65);
      ctx.beginPath();
      traceSmoothPath(ctx, pts);
      ctx.stroke();
    }
  };

  drawRibbon(LORENZ_CACHE.twinB, headB, OBSIDIAN_PALETTE.sandRgb, 1.3);
  drawRibbon(LORENZ_CACHE.twinA, headA, OBSIDIAN_PALETTE.terracottaRgb, 1.85);

  // Instantaneous Divergence Vector delta(t) between gamma1 & gamma2
  const pHeadA = projScaled(headA.pt);
  const pHeadB = projScaled(headB.pt);
  ctx.save();
  ctx.setLineDash([2, 2.5]);
  ctx.strokeStyle = "rgba(52, 211, 153, 0.72)";
  ctx.lineWidth = 1.05;
  ctx.beginPath();
  ctx.moveTo(pHeadA.px, pHeadA.py);
  ctx.lineTo(pHeadB.px, pHeadB.py);
  ctx.stroke();
  ctx.restore();

  // Tangent flow velocity vector dr/dt on primary orbit gamma1
  const tanTarget = projScaled({
    x: headA.pt.x + headA.vx * 0.36,
    y: headA.pt.y - headA.vz * 0.34,
    z: headA.pt.z + headA.vy * 0.34,
  });
  drawVectorArrow(ctx, pHeadA.px, pHeadA.py, tanTarget.px, tanTarget.py, "rgba(212, 102, 74, 0.82)", 1.0, 3.6);

  drawFocalNode(ctx, pHeadB.px, pHeadB.py, 2.2, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.85);
  drawFocalNode(
    ctx,
    pHeadA.px,
    pHeadA.py,
    2.8 + impBurst * 0.7,
    OBSIDIAN_PALETTE.terracottaRgb,
    OBSIDIAN_PALETTE.terracotta,
    2.0
  );

  ctx.restore();

  const logIdx = Math.min(N_STEPS - 1, Math.floor(headFloat));
  const nextLogIdx = Math.min(N_STEPS - 1, logIdx + 1);
  const logFrac = headFloat - logIdx;
  const curLogDiv = lerp(LORENZ_CACHE.logDivs[logIdx], LORENZ_CACHE.logDivs[nextLogIdx], logFrac);
  const deltaNorm = Math.hypot(
    headA.rawX - headB.rawX,
    headA.rawY - headB.rawY,
    headA.rawZ - headB.rawZ
  );

  // Right-side integrated borderless telemetry plots (Lyapunov & Wing x(t))
  if (!compact) {
    const paneX = width - panelW - 14;
    const paneTop = safeTop + 14;
    const paneBot = safeBottom - 14;
    const paneH = paneBot - paneTop;

    ctx.strokeStyle = "rgba(168, 162, 158, 0.11)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(paneX - 10, paneTop);
    ctx.lineTo(paneX - 10, paneBot);
    ctx.stroke();

    // Chart 1: Lyapunov Divergence ln(delta / delta0)
    const c1Y = paneTop + 18;
    const c1H = Math.min(68, (paneH - 54) * 0.48);
    drawMicroLabel(ctx, "LYAPUNOV ln(δ/δ₀)", paneX, paneTop + 4, {
      align: "left",
      fontSize: 7.5,
      color: "rgba(245, 245, 244, 0.8)",
      backing: false,
    });

    ctx.strokeStyle = "rgba(168, 162, 158, 0.12)";
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(paneX, c1Y + c1H);
    ctx.lineTo(paneX + panelW, c1Y + c1H);
    ctx.stroke();

    const lyPts: { x: number; y: number }[] = [];
    const maxSample = Math.max(2, Math.floor(headFloat));
    const stride = Math.max(2, Math.floor(maxSample / 36));
    for (let k = 0; k <= maxSample; k += stride) {
      const xP = paneX + (k / N_STEPS) * panelW;
      const valNorm = clamp((LORENZ_CACHE.logDivs[k] + 0.5) / 6.2, 0, 1);
      lyPts.push({ x: xP, y: c1Y + c1H * (1 - valNorm) });
    }
    lyPts.push({
      x: paneX + (headFloat / N_STEPS) * panelW,
      y: c1Y + c1H * (1 - clamp((curLogDiv + 0.5) / 6.2, 0, 1)),
    });

    ctx.save();
    ctx.globalAlpha *= loopAlpha;
    if (lyPts.length >= 2) {
      const endPt = lyPts[lyPts.length - 1];
      ctx.fillStyle = "rgba(52, 211, 153, 0.08)";
      ctx.beginPath();
      ctx.moveTo(lyPts[0].x, c1Y + c1H);
      traceSmoothPath(ctx, lyPts, false);
      ctx.lineTo(endPt.x, c1Y + c1H);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = OBSIDIAN_PALETTE.emerald;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      traceSmoothPath(ctx, lyPts);
      ctx.stroke();
      drawFocalNode(ctx, endPt.x, endPt.y, 1.8, OBSIDIAN_PALETTE.emeraldRgb, OBSIDIAN_PALETTE.emerald, 1.7);
    }
    ctx.restore();

    // Chart 2: Strange Attractor Wing Switching Signal x(t)
    const c2Top = c1Y + c1H + 26;
    const c2H = Math.min(72, paneBot - c2Top - 4);
    drawMicroLabel(ctx, "WING SIGNAL x(t)", paneX, c2Top - 10, {
      align: "left",
      fontSize: 7.5,
      color: "rgba(245, 245, 244, 0.8)",
      backing: false,
    });

    const midY = c2Top + c2H * 0.5;
    ctx.strokeStyle = "rgba(168, 162, 158, 0.12)";
    ctx.beginPath();
    ctx.moveTo(paneX, midY);
    ctx.lineTo(paneX + panelW, midY);
    ctx.stroke();

    const wingPtsA: { x: number; y: number }[] = [];
    const wingPtsB: { x: number; y: number }[] = [];
    const wStart = Math.max(0, Math.floor(headFloat) - 180);
    const wSpan = Math.max(1, Math.floor(headFloat) - wStart);
    for (let k = wStart; k <= Math.floor(headFloat); k += 5) {
      const u = (k - wStart) / Math.max(180, wSpan);
      const px = paneX + u * panelW;
      wingPtsA.push({ x: px, y: midY - clamp(LORENZ_CACHE.twinA[k].rawX / 20, -1, 1) * (c2H * 0.44) });
      wingPtsB.push({ x: px, y: midY - clamp(LORENZ_CACHE.twinB[k].rawX / 20, -1, 1) * (c2H * 0.44) });
    }
    const endU = wSpan / Math.max(180, wSpan);
    const endX = paneX + endU * panelW;
    wingPtsA.push({ x: endX, y: midY - clamp(headA.rawX / 20, -1, 1) * (c2H * 0.44) });
    wingPtsB.push({ x: endX, y: midY - clamp(headB.rawX / 20, -1, 1) * (c2H * 0.44) });

    ctx.save();
    ctx.globalAlpha *= loopAlpha;
    if (wingPtsB.length >= 2) {
      ctx.strokeStyle = "rgba(229, 193, 148, 0.55)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      traceSmoothPath(ctx, wingPtsB);
      ctx.stroke();
    }
    if (wingPtsA.length >= 2) {
      ctx.strokeStyle = OBSIDIAN_PALETTE.terracotta;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      traceSmoothPath(ctx, wingPtsA);
      ctx.stroke();
    }
    ctx.restore();
  }

  const lambdaApprox = (0.91 + Math.sin(t * 0.55) * 0.03).toFixed(2);
  return `λ₁=+${lambdaApprox} · ‖δ‖=${deltaNorm.toFixed(2)} · RK4`;
}
