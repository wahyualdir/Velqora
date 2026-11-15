import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  easeInOutSine,
  evalQuadBezier,
  lerp,
  lerpRgbTuple,
  traceSmoothPath,
  type RenderCtx,
} from "./types";

const SAND_RGB: [number, number, number] = [229, 193, 148];
const TERRA_RGB: [number, number, number] = [212, 102, 74];
const EMERALD_RGB: [number, number, number] = [52, 211, 153];
const CORAL_RGB: [number, number, number] = [248, 113, 113];

interface CapsuleSeed {
  lane: number;
  offset: number;
  speed: number;
  w: number;
  bad: boolean;
}

const CAPSULES: ReadonlyArray<CapsuleSeed> = [
  { lane: 0, offset: 0.08, speed: 0.16, w: 30, bad: false },
  { lane: 0, offset: 0.56, speed: 0.16, w: 26, bad: false },
  { lane: 1, offset: 0.24, speed: 0.185, w: 34, bad: false },
  { lane: 1, offset: 0.72, speed: 0.185, w: 28, bad: true },
  { lane: 2, offset: 0.14, speed: 0.15, w: 28, bad: false },
  { lane: 2, offset: 0.62, speed: 0.15, w: 32, bad: false },
  { lane: 3, offset: 0.36, speed: 0.17, w: 27, bad: false },
  { lane: 3, offset: 0.84, speed: 0.17, w: 30, bad: true },
];

export function renderSimdLanes(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPy, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);
  const centerY = safeTop + stageH * 0.45 + my * 2.5;

  const latestImp = impulses[impulses.length - 1];
  const cdcBurst = latestImp && latestImp.age < 1.9 ? Math.exp(-latestImp.age * 1.7) : 0;

  // Spatial zones matching editorial Clean Warm Obsidian composition
  const ringR = compact ? 28 : clamp(width * 0.068, 32, 38);
  const ringX = width * (compact ? 0.15 : 0.16) + mx * 2.5;
  const ringY = centerY - 6;

  const sinkW = compact ? 38 : 48;
  const sinkX = width - sinkW - (compact ? 14 : 24);
  const laneStartX = ringX + ringR + (compact ? 22 : 34);
  const laneEndX = sinkX - (compact ? 18 : 26);
  const laneSpan = Math.max(110, laneEndX - laneStartX);

  const laneCount = 4;
  const laneSpread = Math.min(138, stageH * 0.46);
  const laneYs = Array.from({ length: laneCount }, (_, i) => {
    const frac = i / (laneCount - 1) - 0.5;
    return centerY - 6 + frac * laneSpread;
  });

  // Determine hovered lane index gently via smoothed hoverAlpha
  let hoveredLane = -1;
  if (hoverAlpha > 0.02) {
    let bestD = 24;
    for (let i = 0; i < laneCount; i++) {
      const d = Math.abs(cursorPy - laneYs[i]);
      if (d < bestD) {
        bestD = d;
        hoveredLane = i;
      }
    }
  }

  // 1. Kafka 12-Partition Rotary Ingest Ring (smooth angular sweep, zero discrete snap)
  ctx.strokeStyle = "rgba(168, 162, 158, 0.14)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  const sweepAng = t * (1.55 + cdcBurst * 1.2);
  ctx.strokeStyle = "rgba(212, 102, 74, 0.52)";
  ctx.lineWidth = 1.45;
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringR, sweepAng - 0.55, sweepAng + 0.18);
  ctx.stroke();

  // 12 partition dots around inner orbit (smooth phase luminance)
  for (let p = 0; p < 12; p++) {
    const ang = (p / 12) * Math.PI * 2;
    const pr = ringR * 0.72;
    const px = ringX + Math.cos(ang) * pr;
    const py = ringY + Math.sin(ang) * pr;
    const dAng = Math.atan2(Math.sin(ang - sweepAng), Math.cos(ang - sweepAng));
    const wake = Math.exp(-(dAng * dAng) * 2.1);
    const colRgb = p % 4 === 0 ? TERRA_RGB : SAND_RGB;

    ctx.fillStyle = `rgba(${lerpRgbTuple(colRgb, TERRA_RGB, wake * 0.6)}, ${(0.22 + wake * 0.74).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(px, py, 1.55 + wake * 1.15, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFocalNode(ctx, ringX, ringY, 2.5 + cdcBurst * 0.7, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.85);
  drawMicroLabel(ctx, "KAFKA 12P", ringX, ringY + ringR + 13, {
    fontSize: 7.5,
    color: "rgba(168, 162, 158, 0.72)",
    backing: false,
  });

  // Smooth quadratic fan-out connectors from ring exit -> 4 worker lanes
  const fanSrcX = ringX + ringR + 2;
  for (let i = 0; i < laneCount; i++) {
    const ly = laneYs[i];
    const isHov = hoveredLane === i;
    const cpx = lerpRgbTuple(SAND_RGB, EMERALD_RGB, isHov ? 0.5 * hoverAlpha : 0);

    ctx.strokeStyle = `rgba(${cpx}, ${(0.18 + (isHov ? 0.18 * hoverAlpha : 0)).toFixed(3)})`;
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(fanSrcX, ringY);
    ctx.quadraticCurveTo(fanSrcX + 16, ly, laneStartX, ly);
    ctx.stroke();

    // Smooth micro-event dot feeding each fan-out branch
    const branchU = (t * 0.72 + i * 0.24) % 1;
    const bPt = evalQuadBezier(fanSrcX, ringY, fanSrcX + 16, ly, laneStartX, ly, branchU);
    const bFade = Math.sin(branchU * Math.PI);
    ctx.fillStyle = `rgba(229, 193, 148, ${(bFade * 0.78).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(bPt.x, bPt.y, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Lane baseline rail
    ctx.strokeStyle = `rgba(168, 162, 158, ${(isHov ? 0.12 + 0.14 * hoverAlpha : 0.12).toFixed(3)})`;
    ctx.lineWidth = isHov ? 1.15 : 0.8;
    ctx.beginPath();
    ctx.moveTo(laneStartX, ly);
    ctx.lineTo(laneEndX, ly);
    ctx.stroke();
  }

  // 2. Schema Validation Gate (Phi) & Late Watermark Gate (Tau)
  const phiX = laneStartX + laneSpan * 0.37;
  const tauX = laneStartX + laneSpan * 0.74;
  const gateTop = laneYs[0] - 16;
  const gateBot = laneYs[laneCount - 1] + 18;

  ctx.save();
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = "rgba(168, 162, 158, 0.2)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(phiX, gateTop + 6);
  ctx.lineTo(phiX, gateBot);
  ctx.stroke();

  ctx.strokeStyle = "rgba(52, 211, 153, 0.24)";
  ctx.beginPath();
  ctx.moveTo(tauX, gateTop + 6);
  ctx.lineTo(tauX, gateBot);
  ctx.stroke();
  ctx.restore();

  drawMicroLabel(ctx, "Φ schema", phiX, gateTop - 3, {
    fontSize: 7.5,
    color: "rgba(168, 162, 158, 0.68)",
    backing: false,
  });
  drawMicroLabel(ctx, "τ watermark", tauX, gateTop - 3, {
    fontSize: 7.5,
    color: "rgba(52, 211, 153, 0.76)",
    backing: false,
  });

  // 3. Smooth Cross-Lane Shuffle Join Arcs (continuous sin^2 breathing, zero sudden switch)
  const shufflePairs: ReadonlyArray<{ from: number; to: number; phase: number; rgb: [number, number, number] }> = [
    { from: 1, to: 2, phase: 0.0, rgb: EMERALD_RGB },
    { from: 2, to: 0, phase: 0.5, rgb: SAND_RGB },
  ];
  for (const sh of shufflePairs) {
    const cycle = (t * 0.38 + sh.phase) % 1;
    const vis = Math.pow(Math.sin(cycle * Math.PI), 1.4);
    if (vis < 0.03) continue;

    const sx = laneStartX + laneSpan * (sh.from === 1 ? 0.48 : 0.6);
    const sy = laneYs[sh.from];
    const ex = sx + laneSpan * 0.14;
    const ey = laneYs[sh.to];
    const cxCtrl = (sx + ex) * 0.5 + (sh.to < sh.from ? 16 : -14);
    const cyCtrl = (sy + ey) * 0.5;

    ctx.save();
    ctx.setLineDash([2.5, 3]);
    ctx.strokeStyle = `rgba(${sh.rgb[0]}, ${sh.rgb[1]}, ${sh.rgb[2]}, ${(vis * 0.45).toFixed(3)})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cxCtrl, cyCtrl, ex, ey);
    ctx.stroke();
    ctx.restore();

    const pkt = evalQuadBezier(sx, sy, cxCtrl, cyCtrl, ex, ey, cycle);
    ctx.fillStyle = `rgba(${sh.rgb[0]}, ${sh.rgb[1]}, ${sh.rgb[2]}, ${(vis * 0.92).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(pkt.x, pkt.y, 1.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle DLQ drain path beneath Phi on bottom lane
  const dlqTargetY = laneYs[laneCount - 1] + 22;
  ctx.save();
  ctx.setLineDash([1.5, 3]);
  ctx.strokeStyle = "rgba(248, 113, 113, 0.22)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(phiX - 4, laneYs[laneCount - 1]);
  ctx.quadraticCurveTo(phiX + 12, dlqTargetY, phiX + 34, dlqTargetY);
  ctx.stroke();
  ctx.restore();
  drawMicroLabel(ctx, "DLQ", phiX + 44, dlqTargetY, {
    align: "left",
    fontSize: 7,
    color: "rgba(248, 113, 113, 0.65)",
    backing: false,
  });

  // 4. Streaming Parquet Micro-Batch Capsules with Continuous Color Morph
  const capH = 11.5;
  for (let i = 0; i < CAPSULES.length; i++) {
    const cap = CAPSULES[i];
    const spd = cap.speed * (1 + cdcBurst * 0.45);
    const u = (cap.offset + t * spd) % 1;

    const fade = Math.pow(Math.sin(u * Math.PI), 0.38);
    if (fade < 0.04) continue;

    let x = laneStartX + u * laneSpan;
    let y = laneYs[cap.lane];

    // Crossed Phi & Tau progression [0..1]
    const pastPhi = clamp((x - (phiX - 18)) / 36, 0, 1);
    const pastTau = clamp((x - (tauX - 18)) / 36, 0, 1);

    // Occasional bad schema packet gracefully peels off to DLQ on lane 3
    let rgbStr: string;
    let extraFade = 1;
    if (cap.bad && cap.lane === 3 && x > phiX - 4) {
      const divertU = clamp((x - (phiX - 4)) / 42, 0, 1);
      const easedDiv = easeInOutSine(divertU);
      x = lerp(phiX - 4, phiX + 34, easedDiv);
      y = lerp(laneYs[3], dlqTargetY, easedDiv);
      rgbStr = lerpRgbTuple(SAND_RGB, CORAL_RGB, easedDiv);
      extraFade = 1 - Math.pow(divertU, 1.8);
    } else if (cap.bad) {
      rgbStr = lerpRgbTuple(SAND_RGB, TERRA_RGB, pastPhi);
    } else {
      const toSilver = lerpRgbTuple(SAND_RGB, TERRA_RGB, pastPhi * 0.45);
      rgbStr =
        pastTau > 0
          ? lerpRgbTuple(
              [
                Math.round(229 * (1 - pastPhi * 0.45) + 212 * (pastPhi * 0.45)),
                Math.round(193 * (1 - pastPhi * 0.45) + 102 * (pastPhi * 0.45)),
                Math.round(148 * (1 - pastPhi * 0.45) + 74 * (pastPhi * 0.45)),
              ],
              EMERALD_RGB,
              pastTau
            )
          : toSilver;
    }

    const alpha = fade * extraFade;
    if (alpha < 0.03) continue;

    const bx = x - cap.w * 0.5;
    const by = y - capH * 0.5;

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = `rgba(${rgbStr}, 0.22)`;
    ctx.strokeStyle = `rgba(${rgbStr}, 0.65)`;
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.roundRect(bx, by, cap.w, capH, 4.5);
    ctx.fill();
    ctx.stroke();

    // Subtle Parquet columnar tick striations inside each capsule
    ctx.strokeStyle = `rgba(${rgbStr}, 0.48)`;
    ctx.lineWidth = 0.7;
    const cols = 3;
    for (let c = 1; c <= cols; c++) {
      const cxTick = bx + (cap.w / (cols + 1)) * c;
      ctx.beginPath();
      ctx.moveTo(cxTick, by + 3);
      ctx.lineTo(cxTick, by + capH - 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Sleek Medallion Delta Sink Pill Rack (Right — signature clean editorial silhouette)
  const sinkTop = laneYs[0] - 14;
  const sinkBot = laneYs[laneCount - 1] + 14;
  const sinkH = sinkBot - sinkTop;

  // Connecting collector hairlines into sink
  for (let i = 0; i < laneCount; i++) {
    ctx.strokeStyle = "rgba(52, 211, 153, 0.16)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(laneEndX, laneYs[i]);
    ctx.quadraticCurveTo((laneEndX + sinkX) * 0.5, laneYs[i], sinkX, lerp(sinkTop + 12, sinkBot - 12, i / 3));
    ctx.stroke();
  }

  // Outer sleek hairline sink pill
  ctx.fillStyle = "rgba(20, 18, 16, 0.78)";
  ctx.strokeStyle = "rgba(52, 211, 153, 0.34)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.roundRect(sinkX, sinkTop, sinkW, sinkH, 7);
  ctx.fill();
  ctx.stroke();

  drawMicroLabel(ctx, "DELTA Δ", sinkX + sinkW * 0.5, sinkTop - 10, {
    fontSize: 7.5,
    color: "rgba(52, 211, 153, 0.85)",
    backing: false,
  });

  // 6 internal animated Medallion slots (2 Gold, 2 Silver, 2 Bronze flowing smoothly)
  const slotCount = 6;
  const innerPadX = 8;
  const innerBarW = sinkW - innerPadX * 2;
  for (let s = 0; s < slotCount; s++) {
    const sy = sinkTop + 13 + (s / (slotCount - 1)) * (sinkH - 26);
    const slotWave = 0.55 + 0.45 * Math.sin(t * 2.1 - s * 0.85 + cdcBurst * 2);
    const tierRgb = s < 2 ? EMERALD_RGB : s < 4 ? TERRA_RGB : SAND_RGB;

    ctx.fillStyle = `rgba(${tierRgb[0]}, ${tierRgb[1]}, ${tierRgb[2]}, ${(0.28 + slotWave * 0.62).toFixed(3)})`;
    ctx.beginPath();
    ctx.roundRect(sinkX + innerPadX, sy - 1.5, innerBarW * (0.68 + slotWave * 0.32), 2.8, 1.4);
    ctx.fill();
  }

  drawMicroLabel(ctx, "B → S → G", sinkX + sinkW * 0.5, sinkBot + 10, {
    fontSize: 7,
    color: "rgba(168, 162, 158, 0.68)",
    backing: false,
  });

  // 6. Quiet Bottom Dual-Channel Throughput Spline Wave (zero boxed panel!)
  const waveBaseY = Math.min(safeBottom - 16, sinkBot + 36);
  const waveLeft = width * 0.08;
  const waveRight = width * 0.92;
  const waveW = waveRight - waveLeft;
  const samples = 44;

  const terraPts: { x: number; y: number }[] = [];
  const emeraldPts: { x: number; y: number }[] = [];
  for (let k = 0; k <= samples; k++) {
    const u = k / samples;
    const x = waveLeft + u * waveW;
    const env = Math.sin(u * Math.PI);
    const amp = (5.5 + cdcBurst * 4.5) * env;
    const yTerra =
      waveBaseY +
      Math.sin(u * 14 - t * 2.4) * amp * 0.72 +
      Math.cos(u * 7 + t * 1.1) * amp * 0.28;
    const yEmer =
      waveBaseY +
      Math.sin(u * 11 - t * 1.85 + 1.3) * amp * 0.55;
    terraPts.push({ x, y: yTerra });
    emeraldPts.push({ x, y: yEmer });
  }

  ctx.strokeStyle = "rgba(52, 211, 153, 0.26)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  traceSmoothPath(ctx, emeraldPts);
  ctx.stroke();

  ctx.strokeStyle = "rgba(212, 102, 74, 0.58)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  traceSmoothPath(ctx, terraPts);
  ctx.stroke();

  const evRate = (42.4 + Math.sin(t * 1.3) * 1.8 + cdcBurst * 16.5).toFixed(1);
  const lagMs = Math.max(4, Math.round(9 - Math.cos(t * 0.9) * 2 + cdcBurst * 5));
  return `${evRate}k ev/s · Lag ${lagMs}ms · SLA 99.8%`;
}
