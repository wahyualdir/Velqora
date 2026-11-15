import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  drawMiniProgressBar,
  drawVectorArrow,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
  lerp,
  project3D,
  rotate3D,
  traceSmoothPath,
  unprojectPlaneY,
  type RenderCtx,
} from "./types";

interface OptStep {
  u: number;
  v: number;
  loss: number;
  gnorm: number;
  vx: number;
  vz: number;
}

const MIN_U = 0.12;
const MIN_V = 0.08;
const SADDLE_U = -0.68;
const SADDLE_V = 0.56;

function evalStaticLoss(u: number, v: number): number {
  const valleyCurve = 0.34 * Math.sin(u * 1.55);
  const ravine = 0.23 * Math.pow(u + 0.1, 2) + 0.85 * Math.pow(v - valleyCurve, 2);
  const globalBasin = -0.84 * Math.exp(-((u - MIN_U) ** 2 + (v - MIN_V) ** 2) * 1.45);
  const localRidge = 0.36 * Math.exp(-((u - SADDLE_U) ** 2 + (v - SADDLE_V) ** 2) * 3.0);
  return ravine + globalBasin + localRidge;
}

function evalGrad(u: number, v: number): { gu: number; gv: number } {
  const eps = 1e-4;
  const gu = (evalStaticLoss(u + eps, v) - evalStaticLoss(u - eps, v)) / (2 * eps);
  const gv = (evalStaticLoss(u, v + eps) - evalStaticLoss(u, v - eps)) / (2 * eps);
  return { gu, gv };
}

function buildOptimizerTrajectories(): {
  adam: OptStep[];
  sgd: OptStep[];
  minLoss: number;
} {
  const STEPS = 72;
  const minLoss = evalStaticLoss(MIN_U, MIN_V);

  const adam: OptStep[] = [];
  let au = -1.06;
  let av = 0.92;
  let mu = 0;
  let mv = 0;
  let vu = 0;
  let vv = 0;
  const b1 = 0.84;
  const b2 = 0.96;

  for (let i = 0; i <= STEPS; i++) {
    const { gu, gv } = evalGrad(au, av);
    const loss = evalStaticLoss(au, av);
    const gnorm = Math.hypot(gu, gv);
    mu = b1 * mu + (1 - b1) * gu;
    mv = b1 * mv + (1 - b1) * gv;
    vu = b2 * vu + (1 - b2) * gu * gu;
    vv = b2 * vv + (1 - b2) * gv * gv;
    const mHatU = mu / (1 - Math.pow(b1, i + 1));
    const mHatV = mv / (1 - Math.pow(b1, i + 1));
    const vHatU = vu / (1 - Math.pow(b2, i + 1));
    const vHatV = vv / (1 - Math.pow(b2, i + 1));
    const stepU = (-0.044 * mHatU) / (Math.sqrt(vHatU) + 1e-4);
    const stepV = (-0.044 * mHatV) / (Math.sqrt(vHatV) + 1e-4);

    adam.push({ u: au, v: av, loss, gnorm, vx: stepU, vz: stepV });
    au = clamp(au + stepU, -1.35, 1.35);
    av = clamp(av + stepV, -1.35, 1.35);
  }

  const sgd: OptStep[] = [];
  let su = 1.02;
  let sv = -0.94;
  for (let i = 0; i <= STEPS; i++) {
    const { gu, gv } = evalGrad(su, sv);
    const loss = evalStaticLoss(su, sv);
    const gnorm = Math.hypot(gu, gv);
    const osc = Math.sin(i * 1.18) * (1 - i / STEPS) * 0.08;
    const stepU = clamp(-0.052 * gu, -0.14, 0.14);
    const stepV = clamp(-0.088 * gv + osc, -0.18, 0.18);

    sgd.push({ u: su, v: sv, loss, gnorm, vx: stepU, vz: stepV });
    su = clamp(su + stepU, -1.35, 1.35);
    sv = clamp(sv + stepV, -1.35, 1.35);
  }

  return { adam, sgd, minLoss };
}

const TRAJ_DATA = buildOptimizerTrajectories();

function sampleOptStep(traj: ReadonlyArray<OptStep>, stepFloat: number): OptStep {
  const maxIdx = traj.length - 1;
  const clamped = clamp(stepFloat, 0, maxIdx);
  const i0 = Math.floor(clamped);
  const i1 = Math.min(maxIdx, i0 + 1);
  const f = clamped - i0;
  const a = traj[i0];
  const b = traj[i1];
  return {
    u: lerp(a.u, b.u, f),
    v: lerp(a.v, b.v, f),
    loss: lerp(a.loss, b.loss, f),
    gnorm: lerp(a.gnorm, b.gnorm, f),
    vx: lerp(a.vx, b.vx, f),
    vz: lerp(a.vz, b.vz, f),
  };
}

export function renderLossLandscape(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPx, cursorPy, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);
  const chartW = compact ? 0 : clamp(width * 0.27, 134, 158);
  const cx = compact ? width * 0.5 : (width - chartW - 14) * 0.5;
  const cy = safeTop + stageH * 0.52;

  const ry = -0.58 + Math.sin(t * 0.24) * 0.14 + mx * 0.34;
  const rx = 0.62 + my * 0.16;
  const worldSpan = compact ? Math.min(width, stageH) * 0.43 : Math.min(width - chartW, stageH) * 0.44;
  const yScale = worldSpan * 0.42;
  const floorY = 64;

  const evalSurfaceY = (u: number, v: number): number => {
    let val = evalStaticLoss(u, v) * 0.92;
    val += 0.032 * Math.sin(u * 2.5 + t * 0.75) * Math.cos(v * 2.1 - t * 0.55);

    for (const imp of impulses) {
      if (imp.age > 2.8) continue;
      const iu = (imp.normX - 0.36) * 2.2;
      const iv = (imp.normY - 0.5) * 2.2;
      const dist = Math.hypot(u - iu, v - iv);
      const decay = Math.exp(-imp.age * 1.45 - dist * 1.35);
      val -= decay * Math.sin(dist * 7.2 - imp.age * 7.8) * 0.28;
    }

    return clamp(-val * yScale + 12, -yScale * 1.25, floorY - 4);
  };

  // Subtle projected ground plane grid & basin contour ellipses on y = floorY
  const floorCorner1 = project3D(rotate3D({ x: -worldSpan, y: floorY, z: -worldSpan }, rx, ry), cx, cy, 500);
  const floorCorner2 = project3D(rotate3D({ x: worldSpan, y: floorY, z: -worldSpan }, rx, ry), cx, cy, 500);
  const floorCorner3 = project3D(rotate3D({ x: worldSpan, y: floorY, z: worldSpan }, rx, ry), cx, cy, 500);
  const floorCorner4 = project3D(rotate3D({ x: -worldSpan, y: floorY, z: worldSpan }, rx, ry), cx, cy, 500);

  ctx.strokeStyle = "rgba(168, 162, 158, 0.08)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(floorCorner1.px, floorCorner1.py);
  ctx.lineTo(floorCorner2.px, floorCorner2.py);
  ctx.lineTo(floorCorner3.px, floorCorner3.py);
  ctx.lineTo(floorCorner4.px, floorCorner4.py);
  ctx.closePath();
  ctx.stroke();

  // Concentric ground contour rings centered around theta*
  for (const radU of [0.22, 0.46, 0.72]) {
    const pts: { x: number; y: number }[] = [];
    for (let s = 0; s <= 24; s++) {
      const ang = (s / 24) * Math.PI * 2;
      const cu = clamp(MIN_U + Math.cos(ang) * radU, -1.3, 1.3);
      const cv = clamp(MIN_V + Math.sin(ang) * radU * 0.75, -1.3, 1.3);
      const p = project3D(rotate3D({ x: (cu / 1.35) * worldSpan, y: floorY, z: (cv / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
      pts.push({ x: p.px, y: p.py });
    }
    ctx.strokeStyle = radU < 0.3 ? "rgba(52, 211, 153, 0.18)" : "rgba(168, 162, 158, 0.075)";
    ctx.lineWidth = radU < 0.3 ? 0.9 : 0.65;
    ctx.beginPath();
    traceSmoothPath(ctx, pts);
    ctx.stroke();
  }

  // Axis vectors on floor plane
  const axOrigin = project3D(rotate3D({ x: -worldSpan, y: floorY, z: -worldSpan }, rx, ry), cx, cy, 500);
  const axTheta1 = project3D(rotate3D({ x: worldSpan * 0.92, y: floorY, z: -worldSpan }, rx, ry), cx, cy, 500);
  const axTheta2 = project3D(rotate3D({ x: -worldSpan, y: floorY, z: worldSpan * 0.92 }, rx, ry), cx, cy, 500);
  const axLoss = project3D(rotate3D({ x: -worldSpan, y: floorY - yScale * 1.15, z: -worldSpan }, rx, ry), cx, cy, 500);

  drawVectorArrow(ctx, axOrigin.px, axOrigin.py, axTheta1.px, axTheta1.py, "rgba(168, 162, 158, 0.24)", 0.85, 3.8);
  drawVectorArrow(ctx, axOrigin.px, axOrigin.py, axTheta2.px, axTheta2.py, "rgba(168, 162, 158, 0.24)", 0.85, 3.8);
  drawVectorArrow(ctx, axOrigin.px, axOrigin.py, axLoss.px, axLoss.py, "rgba(229, 193, 148, 0.22)", 0.85, 3.8);

  drawMicroLabel(ctx, "θ₁", axTheta1.px + 6, axTheta1.py, { fontSize: 7.5, color: "rgba(168, 162, 158, 0.62)", backing: false });
  drawMicroLabel(ctx, "θ₂", axTheta2.px + 6, axTheta2.py + 3, { fontSize: 7.5, color: "rgba(168, 162, 158, 0.62)", backing: false });
  drawMicroLabel(ctx, "L(θ)", axLoss.px, axLoss.py - 7, { fontSize: 7.5, color: "rgba(229, 193, 148, 0.62)", backing: false });

  // 3D smooth terrain lattice (15x15 iso-lines with traceSmoothPath)
  const N = 14;
  const grid: { px: number; py: number; elev: number }[][] = [];
  for (let i = 0; i <= N; i++) {
    const row: { px: number; py: number; elev: number }[] = [];
    const u = -1.35 + (i / N) * 2.7;
    for (let j = 0; j <= N; j++) {
      const v = -1.35 + (j / N) * 2.7;
      const y3d = evalSurfaceY(u, v);
      const p3 = rotate3D({ x: (u / 1.35) * worldSpan, y: y3d, z: (v / 1.35) * worldSpan }, rx, ry);
      const proj = project3D(p3, cx, cy, 500);
      row.push({ px: proj.px, py: proj.py, elev: clamp(1 - (y3d + yScale) / (floorY + yScale), 0, 1) });
    }
    grid.push(row);
  }

  // Smooth U-lines
  for (let i = 0; i <= N; i++) {
    const pts = grid[i].map((g) => ({ x: g.px, y: g.py }));
    const avgElev = grid[i].reduce((s, g) => s + g.elev, 0) / (N + 1);
    const isMajor = i % 2 === 0;
    ctx.strokeStyle = isMajor
      ? `rgba(212, 102, 74, ${(0.09 + avgElev * 0.22).toFixed(3)})`
      : `rgba(168, 162, 158, ${(0.04 + avgElev * 0.08).toFixed(3)})`;
    ctx.lineWidth = isMajor ? 0.9 : 0.6;
    ctx.beginPath();
    traceSmoothPath(ctx, pts);
    ctx.stroke();
  }

  // Smooth V-lines
  for (let j = 0; j <= N; j++) {
    const pts: { x: number; y: number }[] = [];
    let sumElev = 0;
    for (let i = 0; i <= N; i++) {
      pts.push({ x: grid[i][j].px, y: grid[i][j].py });
      sumElev += grid[i][j].elev;
    }
    const avgElev = sumElev / (N + 1);
    const isMajor = j % 2 === 0;
    ctx.strokeStyle = isMajor
      ? `rgba(229, 193, 148, ${(0.06 + avgElev * 0.15).toFixed(3)})`
      : `rgba(168, 162, 158, ${(0.035 + avgElev * 0.06).toFixed(3)})`;
    ctx.lineWidth = isMajor ? 0.8 : 0.55;
    ctx.beginPath();
    traceSmoothPath(ctx, pts);
    ctx.stroke();
  }

  // Global minimum theta* & saddle anchor
  const minY3d = evalSurfaceY(MIN_U, MIN_V);
  const minSurf = project3D(rotate3D({ x: (MIN_U / 1.35) * worldSpan, y: minY3d, z: (MIN_V / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
  const minFloor = project3D(rotate3D({ x: (MIN_U / 1.35) * worldSpan, y: floorY, z: (MIN_V / 1.35) * worldSpan }, rx, ry), cx, cy, 500);

  ctx.save();
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = "rgba(52, 211, 153, 0.34)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(minSurf.px, minSurf.py);
  ctx.lineTo(minFloor.px, minFloor.py);
  ctx.stroke();
  ctx.restore();

  drawFocalNode(ctx, minSurf.px, minSurf.py, 2.8, OBSIDIAN_PALETTE.emeraldRgb, OBSIDIAN_PALETTE.emerald, 1.9);
  drawMicroLabel(ctx, "θ* min", minSurf.px + 10, minSurf.py + 9, {
    align: "left",
    fontSize: 8,
    color: "rgba(52, 211, 153, 0.88)",
  });

  const sadY3d = evalSurfaceY(SADDLE_U, SADDLE_V);
  const sadSurf = project3D(rotate3D({ x: (SADDLE_U / 1.35) * worldSpan, y: sadY3d, z: (SADDLE_V / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
  drawFocalNode(ctx, sadSurf.px, sadSurf.py, 1.9, OBSIDIAN_PALETTE.stoneRgb, OBSIDIAN_PALETTE.stone, 1.7);

  // Continuous sub-pixel interpolated loop phase (zero frame-stepping / abrupt reset!)
  const cycle = (t * 0.145) % 1;
  const fadeIn = easeOutCubic(clamp(cycle / 0.09, 0, 1));
  const fadeOut = 1 - easeInOutCubic(clamp((cycle - 0.88) / 0.12, 0, 1));
  const loopAlpha = fadeIn * fadeOut;

  const progress = easeInOutSine(clamp(cycle / 0.88, 0, 1));
  const maxStep = TRAJ_DATA.adam.length - 1;
  const stepFloat = progress * (maxStep - 0.001);
  const stepInt = Math.floor(stepFloat);

  const adamHead = sampleOptStep(TRAJ_DATA.adam, stepFloat);
  const sgdHead = sampleOptStep(TRAJ_DATA.sgd, stepFloat);

  const buildTrailPoints = (traj: ReadonlyArray<OptStep>, head: OptStep, floorMode: boolean) => {
    const pts: { x: number; y: number }[] = [];
    for (let k = 0; k <= stepInt; k++) {
      const s = traj[k];
      const y3d = floorMode ? floorY : evalSurfaceY(s.u, s.v) - 1.5;
      const p = project3D(rotate3D({ x: (s.u / 1.35) * worldSpan, y: y3d, z: (s.v / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
      pts.push({ x: p.px, y: p.py });
    }
    const hy = floorMode ? floorY : evalSurfaceY(head.u, head.v) - 1.5;
    const hp = project3D(rotate3D({ x: (head.u / 1.35) * worldSpan, y: hy, z: (head.v / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
    pts.push({ x: hp.px, y: hp.py });
    return { pts, headPx: hp };
  };

  ctx.save();
  ctx.globalAlpha *= loopAlpha;

  // Floor shadows for depth legibility
  const adamFloor = buildTrailPoints(TRAJ_DATA.adam, adamHead, true);
  const sgdFloor = buildTrailPoints(TRAJ_DATA.sgd, sgdHead, true);

  ctx.strokeStyle = "rgba(229, 193, 148, 0.22)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  traceSmoothPath(ctx, adamFloor.pts);
  ctx.stroke();

  ctx.strokeStyle = "rgba(212, 102, 74, 0.2)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  traceSmoothPath(ctx, sgdFloor.pts);
  ctx.stroke();

  // Primary 3D surface trails
  const adamSurf = buildTrailPoints(TRAJ_DATA.adam, adamHead, false);
  const sgdSurf = buildTrailPoints(TRAJ_DATA.sgd, sgdHead, false);

  ctx.strokeStyle = "rgba(229, 193, 148, 0.86)";
  ctx.lineWidth = 1.85;
  ctx.beginPath();
  traceSmoothPath(ctx, adamSurf.pts);
  ctx.stroke();

  ctx.strokeStyle = "rgba(212, 102, 74, 0.82)";
  ctx.lineWidth = 1.45;
  ctx.beginPath();
  traceSmoothPath(ctx, sgdSurf.pts);
  ctx.stroke();

  // Vertical drop needles from current heads to floor shadows
  ctx.save();
  ctx.setLineDash([1.5, 2.5]);
  ctx.strokeStyle = "rgba(229, 193, 148, 0.26)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(adamSurf.headPx.px, adamSurf.headPx.py);
  ctx.lineTo(adamFloor.headPx.px, adamFloor.headPx.py);
  ctx.stroke();

  ctx.strokeStyle = "rgba(212, 102, 74, 0.24)";
  ctx.beginPath();
  ctx.moveTo(sgdSurf.headPx.px, sgdSurf.headPx.py);
  ctx.lineTo(sgdFloor.headPx.px, sgdFloor.headPx.py);
  ctx.stroke();
  ctx.restore();

  // Subtle negative-gradient tangent vector on Adam head
  const nextPos = project3D(
    rotate3D(
      {
        x: ((adamHead.u + adamHead.vx * 3.2) / 1.35) * worldSpan,
        y: evalSurfaceY(adamHead.u + adamHead.vx * 3.2, adamHead.v + adamHead.vz * 3.2) - 1.5,
        z: ((adamHead.v + adamHead.vz * 3.2) / 1.35) * worldSpan,
      },
      rx,
      ry
    ),
    cx,
    cy,
    500
  );
  drawVectorArrow(
    ctx,
    adamSurf.headPx.px,
    adamSurf.headPx.py,
    nextPos.px,
    nextPos.py,
    "rgba(52, 211, 153, 0.72)",
    1.1,
    3.8
  );

  drawFocalNode(ctx, adamSurf.headPx.px, adamSurf.headPx.py, 2.8, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 2.0);
  drawFocalNode(ctx, sgdSurf.headPx.px, sgdSurf.headPx.py, 2.5, OBSIDIAN_PALETTE.terracottaRgb, OBSIDIAN_PALETTE.terracotta, 1.9);

  drawMicroLabel(ctx, "Adam", adamSurf.headPx.px - 9, adamSurf.headPx.py - 10, {
    align: "right",
    fontSize: 8,
    color: "rgba(229, 193, 148, 0.92)",
  });
  drawMicroLabel(ctx, "SGD", sgdSurf.headPx.px + 9, sgdSurf.headPx.py - 8, {
    align: "left",
    fontSize: 8,
    color: "rgba(212, 102, 74, 0.9)",
  });

  ctx.restore();

  // Smooth eased hover inspection probe on the surface
  if (hoverAlpha > 0.02 && cursorPx < (compact ? width : width - chartW)) {
    const plane = unprojectPlaneY(cursorPx, cursorPy, 0, cx, cy, rx, ry, 500);
    const pu = clamp((plane.x / worldSpan) * 1.35, -1.25, 1.25);
    const pv = clamp((plane.z / worldSpan) * 1.35, -1.25, 1.25);
    const py3d = evalSurfaceY(pu, pv);
    const pSurf = project3D(rotate3D({ x: (pu / 1.35) * worldSpan, y: py3d, z: (pv / 1.35) * worldSpan }, rx, ry), cx, cy, 500);
    const pBot = project3D(rotate3D({ x: (pu / 1.35) * worldSpan, y: floorY, z: (pv / 1.35) * worldSpan }, rx, ry), cx, cy, 500);

    ctx.save();
    ctx.globalAlpha *= hoverAlpha;
    ctx.strokeStyle = "rgba(229, 193, 148, 0.35)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(pSurf.px, pSurf.py);
    ctx.lineTo(pBot.px, pBot.py);
    ctx.stroke();

    drawFocalNode(ctx, pSurf.px, pSurf.py, 2.1, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.7);
    const pLoss = (evalStaticLoss(pu, pv) - TRAJ_DATA.minLoss).toFixed(2);
    drawMicroLabel(ctx, `L=${pLoss}`, pSurf.px + 8, pSurf.py - 6, {
      align: "left",
      fontSize: 7.5,
      color: "rgba(229, 193, 148, 0.85)",
    });
    ctx.restore();
  }

  // Right-side integrated borderless Loss-Epoch chart (desktop)
  if (!compact) {
    const paneX = width - chartW - 14;
    const paneY = safeTop + 14;
    const paneH = Math.min(182, stageH - 28);

    // Whisper-quiet editorial left hairline divider
    ctx.strokeStyle = "rgba(168, 162, 158, 0.11)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(paneX - 10, paneY);
    ctx.lineTo(paneX - 10, paneY + paneH);
    ctx.stroke();

    drawMicroLabel(ctx, "LOSS · EPOCH", paneX, paneY + 5, {
      align: "left",
      fontSize: 8,
      color: "rgba(245, 245, 244, 0.82)",
      backing: false,
    });
    drawMicroLabel(ctx, `e=${Math.round(stepFloat)}`, paneX + chartW, paneY + 5, {
      align: "right",
      fontSize: 8,
      color: "rgba(168, 162, 158, 0.75)",
      backing: false,
    });

    const plotX = paneX + 4;
    const plotW = chartW - 8;
    const plotY = paneY + 24;
    const plotH = paneH - 64;

    // Hairline horizontal reference lines
    ctx.strokeStyle = "rgba(168, 162, 158, 0.12)";
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    // Global optimum hairline
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "rgba(52, 211, 153, 0.28)";
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH - 4);
    ctx.lineTo(plotX + plotW, plotY + plotH - 4);
    ctx.stroke();
    ctx.restore();

    const lossToPlotY = (lossVal: number) => {
      const gap = Math.max(0.002, lossVal - TRAJ_DATA.minLoss);
      const norm = clamp(gap / 1.42, 0, 1);
      return plotY + (1 - norm) * (plotH - 6) + 2;
    };

    const buildLossPts = (traj: ReadonlyArray<OptStep>, head: OptStep) => {
      const pts: { x: number; y: number }[] = [];
      for (let k = 0; k <= stepInt; k++) {
        pts.push({
          x: plotX + (k / maxStep) * plotW,
          y: lossToPlotY(traj[k].loss),
        });
      }
      pts.push({
        x: plotX + (stepFloat / maxStep) * plotW,
        y: lossToPlotY(head.loss),
      });
      return pts;
    };

    ctx.save();
    ctx.globalAlpha *= loopAlpha;
    const adamLossPts = buildLossPts(TRAJ_DATA.adam, adamHead);
    const sgdLossPts = buildLossPts(TRAJ_DATA.sgd, sgdHead);

    // Subtle warm area fill under Adam loss curve
    if (adamLossPts.length >= 2) {
      const lastPt = adamLossPts[adamLossPts.length - 1];
      ctx.fillStyle = "rgba(229, 193, 148, 0.065)";
      ctx.beginPath();
      ctx.moveTo(adamLossPts[0].x, plotY + plotH);
      traceSmoothPath(ctx, adamLossPts, false);
      ctx.lineTo(lastPt.x, plotY + plotH);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(212, 102, 74, 0.72)";
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    traceSmoothPath(ctx, sgdLossPts);
    ctx.stroke();

    ctx.strokeStyle = OBSIDIAN_PALETTE.sand;
    ctx.lineWidth = 1.65;
    ctx.beginPath();
    traceSmoothPath(ctx, adamLossPts);
    ctx.stroke();

    const adamEnd = adamLossPts[adamLossPts.length - 1];
    drawFocalNode(ctx, adamEnd.x, adamEnd.y, 2.2, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.7);
    ctx.restore();

    // Gradient norm footer gauge
    const barY = paneY + paneH - 22;
    drawMicroLabel(ctx, "‖∇L‖", paneX, barY, {
      align: "left",
      fontSize: 7.5,
      color: "rgba(168, 162, 158, 0.72)",
      backing: false,
    });
    drawMicroLabel(ctx, adamHead.gnorm.toFixed(2), paneX + chartW, barY, {
      align: "right",
      fontSize: 7.5,
      color: OBSIDIAN_PALETTE.emerald,
      backing: false,
    });
    drawMiniProgressBar(
      ctx,
      paneX,
      barY + 9,
      chartW,
      2.5,
      clamp(1 - adamHead.gnorm / 1.45, 0.08, 1),
      OBSIDIAN_PALETTE.emerald,
      "rgba(41, 37, 36, 0.55)"
    );
  }

  const adamDelta = Math.max(0.002, adamHead.loss - TRAJ_DATA.minLoss).toFixed(3);
  const sgdDelta = Math.max(0.012, sgdHead.loss - TRAJ_DATA.minLoss).toFixed(3);
  return `Adam L=${adamDelta} · SGD=${sgdDelta} · ‖∇‖=${adamHead.gnorm.toFixed(2)}`;
}
