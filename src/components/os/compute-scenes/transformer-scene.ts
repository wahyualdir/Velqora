import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  easeInOutSine,
  evalCubicBezier,
  evalQuadBezier,
  lerp,
  lerpRgbTuple,
  traceSmoothPath,
  type RenderCtx,
} from "./types";

const LAYER_COUNTS: ReadonlyArray<number> = [5, 5, 5, 7, 4];
const LAYER_NAMES = ["x+PE", "MHSA", "⊕LN", "FFN", "ŷ"] as const;
const TOKEN_LABELS = ["t₀", "t₁", "t₂", "t₃", "t₄", "t₅"] as const;

const SAND_RGB: [number, number, number] = [229, 193, 148];
const TERRA_RGB: [number, number, number] = [212, 102, 74];

export function renderNeuralFlow(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPx, cursorPy, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);

  // Right causal attention matrix + softmax distribution sizing (borderless layout)
  const matN = 6;
  const cell = compact ? clamp(Math.floor(width * 0.026), 9, 11) : clamp(Math.floor(width * 0.024), 12, 14);
  const gap = compact ? 2.5 : 3;
  const matW = matN * (cell + gap) - gap;
  const rightAreaW = matW + 18;
  const dividerX = width - rightAreaW - (compact ? 14 : 22);

  const leftPad = width * (compact ? 0.075 : 0.07) + mx * 2.5;
  const netRightX = dividerX - (compact ? 14 : 22);
  const usableW = Math.max(120, netRightX - leftPad);
  const topY = safeTop + 56;
  const usableH = Math.max(118, safeBottom - topY - 38);

  // Smooth layer node coordinates with organic breath
  const layers = LAYER_COUNTS.map((count, li) => {
    const lx = leftPad + (li / (LAYER_COUNTS.length - 1)) * usableW;
    return Array.from({ length: count }, (_, ni) => {
      const span = count === 1 ? 0.5 : ni / (count - 1);
      const driftY = Math.sin(t * 0.95 + li * 0.85 + ni * 0.7) * 1.4 + my * 2.2 * (span - 0.5);
      return { x: lx, y: topY + span * usableH + driftY };
    });
  });

  // Smooth continuous Forward / Backward phase envelope (zero triangle reversal snap)
  const latestImp = impulses[impulses.length - 1];
  const impEnergy = latestImp && latestImp.age < 1.8 ? Math.exp(-latestImp.age * 1.9) : 0;

  const cycle = (t * 0.21) % 1;
  let waveNorm = 0;
  if (cycle < 0.44) {
    waveNorm = easeInOutSine(cycle / 0.44);
  } else if (cycle < 0.52) {
    waveNorm = 1;
  } else if (cycle < 0.94) {
    waveNorm = 1 - easeInOutSine((cycle - 0.52) / 0.42);
  } else {
    waveNorm = 0;
  }

  // Smooth continuous forward <-> autograd blend [0 = forward, 1 = autograd]
  const bwdEnter = easeInOutSine(clamp((cycle - 0.45) / 0.07, 0, 1));
  const bwdExit = 1 - easeInOutSine(clamp((cycle - 0.93) / 0.07, 0, 1));
  const bwdBlend = clamp(bwdEnter * bwdExit, 0, 1);
  const waveX = leftPad + waveNorm * usableW;
  const activeRgb = lerpRgbTuple(SAND_RGB, TERRA_RGB, bwdBlend);

  // Whisper-quiet top pass indicator (borderless mono text + subtle dot)
  const passText = bwdBlend > 0.5 ? "← AUTOGRAD ∂L/∂W" : "FWD PASS → x+PE → ŷ";
  ctx.fillStyle = `rgba(${activeRgb}, 0.88)`;
  ctx.beginPath();
  ctx.arc(leftPad + 3, safeTop + 12, 2.1, 0, Math.PI * 2);
  ctx.fill();
  drawMicroLabel(ctx, passText, leftPad + 10, safeTop + 12, {
    align: "left",
    fontSize: 8,
    color: `rgba(${activeRgb}, 0.9)`,
    backing: false,
  });

  // Subtle vertical hairline column guides + borderless layer headers
  for (let li = 0; li < layers.length; li++) {
    const colX = layers[li][0].x;
    const dist = Math.abs(waveX - colX) / Math.max(1, usableW * 0.22);
    const colGlow = Math.exp(-dist * dist * 1.6);

    ctx.strokeStyle = `rgba(168, 162, 158, ${(0.055 + colGlow * 0.08).toFixed(3)})`;
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(colX, topY - 8);
    ctx.lineTo(colX, topY + usableH + 8);
    ctx.stroke();

    drawMicroLabel(ctx, LAYER_NAMES[li], colX, topY - 17, {
      fontSize: compact ? 7.5 : 8,
      color: `rgba(${activeRgb}, ${(0.52 + colGlow * 0.45).toFixed(3)})`,
      backing: false,
    });
  }

  // Soft synaptic connections (cubic Beziers) with smooth traveling wave attenuation
  for (let li = 0; li < layers.length - 1; li++) {
    const src = layers[li];
    const dst = layers[li + 1];
    const midX = (src[0].x + dst[0].x) * 0.5;
    const spanNorm = Math.abs(waveX - midX) / Math.max(1, usableW * 0.28);
    const energy = Math.exp(-spanNorm * spanNorm * 1.45) + impEnergy * 0.35;

    for (let i = 0; i < src.length; i++) {
      for (let j = 0; j < dst.length; j++) {
        // Sparse clean connectivity to preserve visual elegance
        const keep =
          src.length * dst.length <= 25 || (i + j) % 2 === 0 || i === j;
        if (!keep) continue;

        const w = 0.5 + 0.5 * Math.sin(i * 1.7 + j * 2.3 + t * 0.45);
        const alpha = 0.045 + energy * w * 0.19;
        const c1x = lerp(src[i].x, dst[j].x, 0.45);
        const c2x = lerp(src[i].x, dst[j].x, 0.55);

        ctx.strokeStyle =
          energy > 0.22
            ? `rgba(${activeRgb}, ${alpha.toFixed(3)})`
            : `rgba(168, 162, 158, ${(0.04 + w * 0.04).toFixed(3)})`;
        ctx.lineWidth = energy > 0.35 ? 0.95 : 0.6;
        ctx.beginPath();
        ctx.moveTo(src[i].x, src[i].y);
        ctx.bezierCurveTo(c1x, src[i].y, c2x, dst[j].y, dst[j].x, dst[j].y);
        ctx.stroke();

        // Smooth continuous packet light along sparse high-weight edges
        if ((i + j) % 3 === 0) {
          const rawU = (t * (0.48 + (i % 2) * 0.12) + li * 0.27 + i * 0.19 + j * 0.11) % 1;
          const u = bwdBlend > 0.5 ? 1 - rawU : rawU;
          const pt = evalCubicBezier(src[i].x, src[i].y, c1x, src[i].y, c2x, dst[j].y, dst[j].x, dst[j].y, u);
          const packetFade = Math.sin(rawU * Math.PI);
          if (packetFade > 0.05) {
            ctx.fillStyle = `rgba(${activeRgb}, ${(packetFade * (0.38 + energy * 0.48)).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.35 + impEnergy * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }

  // Skip Residual Connections (+Res1 over top, +Res2 below bottom)
  const res1Start = layers[0][0];
  const res1End = layers[2][0];
  const res1CtrlX = (res1Start.x + res1End.x) * 0.5;
  const res1CtrlY = topY - 26;

  ctx.strokeStyle = "rgba(52, 211, 153, 0.28)";
  ctx.lineWidth = 1.05;
  ctx.beginPath();
  ctx.moveTo(res1Start.x, res1Start.y - 3);
  ctx.quadraticCurveTo(res1CtrlX, res1CtrlY, res1End.x, res1End.y - 3);
  ctx.stroke();

  const res1U = (t * 0.34) % 1;
  const res1Pt = evalQuadBezier(res1Start.x, res1Start.y - 3, res1CtrlX, res1CtrlY, res1End.x, res1End.y - 3, res1U);
  const res1Fade = Math.sin(res1U * Math.PI);
  ctx.fillStyle = `rgba(52, 211, 153, ${(res1Fade * 0.9).toFixed(3)})`;
  ctx.beginPath();
  ctx.arc(res1Pt.x, res1Pt.y, 1.9, 0, Math.PI * 2);
  ctx.fill();

  drawMicroLabel(ctx, "+Res₁", res1CtrlX, res1CtrlY - 4, {
    fontSize: 7.5,
    color: "rgba(52, 211, 153, 0.85)",
    backing: false,
  });

  const res2Start = layers[2][layers[2].length - 1];
  const res2End = layers[4][layers[4].length - 1];
  const res2CtrlX = (res2Start.x + res2End.x) * 0.5;
  const res2CtrlY = topY + usableH + 28;

  ctx.strokeStyle = "rgba(229, 193, 148, 0.25)";
  ctx.lineWidth = 1.05;
  ctx.beginPath();
  ctx.moveTo(res2Start.x, res2Start.y + 3);
  ctx.quadraticCurveTo(res2CtrlX, res2CtrlY, res2End.x, res2End.y + 3);
  ctx.stroke();

  const res2U = (t * 0.34 + 0.5) % 1;
  const res2Pt = evalQuadBezier(res2Start.x, res2Start.y + 3, res2CtrlX, res2CtrlY, res2End.x, res2End.y + 3, res2U);
  const res2Fade = Math.sin(res2U * Math.PI);
  ctx.fillStyle = `rgba(229, 193, 148, ${(res2Fade * 0.88).toFixed(3)})`;
  ctx.beginPath();
  ctx.arc(res2Pt.x, res2Pt.y, 1.85, 0, Math.PI * 2);
  ctx.fill();

  drawMicroLabel(ctx, "+Res₂", res2CtrlX, res2CtrlY - 4, {
    fontSize: 7.5,
    color: "rgba(229, 193, 148, 0.78)",
    backing: false,
  });

  // Render subtle vertical wavefront glow line
  const waveGrad = ctx.createLinearGradient(waveX - 24, 0, waveX + 24, 0);
  waveGrad.addColorStop(0, `rgba(${activeRgb}, 0)`);
  waveGrad.addColorStop(0.5, `rgba(${activeRgb}, ${(0.1 + impEnergy * 0.1).toFixed(3)})`);
  waveGrad.addColorStop(1, `rgba(${activeRgb}, 0)`);
  ctx.fillStyle = waveGrad;
  ctx.fillRect(waveX - 24, topY - 12, 48, usableH + 24);

  // Layer nodes with continuous focal activation
  for (let li = 0; li < layers.length; li++) {
    const col = layers[li];
    for (let ni = 0; ni < col.length; ni++) {
      const node = col[ni];
      const d = Math.abs(waveX - node.x) / Math.max(1, usableW * 0.16);
      const act = Math.exp(-d * d * 1.8);
      const nodeColor =
        li === 2 ? OBSIDIAN_PALETTE.emerald : bwdBlend > 0.5 ? OBSIDIAN_PALETTE.terracotta : OBSIDIAN_PALETTE.sand;
      const nodeRgb =
        li === 2 ? OBSIDIAN_PALETTE.emeraldRgb : activeRgb;

      if (act > 0.25) {
        drawFocalNode(ctx, node.x, node.y, 2.3 + act * 1.1, nodeRgb, nodeColor, 1.75);
      } else {
        ctx.fillStyle = "#1C1917";
        ctx.strokeStyle = `rgba(${nodeRgb}, 0.42)`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // Borderless Right Attention Panel: Q·Kᵀ / √dₖ + Softmax Area Spline
  const divTop = safeTop + 12;
  const divBot = safeBottom - 10;
  ctx.strokeStyle = "rgba(168, 162, 158, 0.11)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(dividerX, divTop);
  ctx.lineTo(dividerX, divBot);
  ctx.stroke();

  const matX = dividerX + 18;
  const matY = safeTop + Math.max(38, (stageH - (matW + 78)) * 0.44);

  drawMicroLabel(ctx, "Q·Kᵀ/√dₖ", matX, matY - 22, {
    align: "left",
    fontSize: 8,
    color: "rgba(245, 245, 244, 0.84)",
    backing: false,
  });

  // Compute Causal Softmax Attention weights
  const attnMatrix: number[][] = [];
  for (let r = 0; r < matN; r++) {
    const raw: number[] = [];
    let sum = 0;
    for (let c = 0; c < matN; c++) {
      if (c > r) {
        raw.push(0);
      } else {
        const score = Math.exp(
          Math.sin(t * 0.7 + r * 1.1 - c * 0.85) * 0.85 + (r === c ? 0.65 : 0)
        );
        raw.push(score);
        sum += score;
      }
    }
    attnMatrix.push(raw.map((v) => (sum > 0 ? v / sum : 0)));
  }

  // Smooth continuous query row selection (plus smooth cursor hover weighting)
  let hoverRowTarget = -1;
  if (
    cursorPx >= matX - 10 &&
    cursorPx <= matX + matW + 4 &&
    cursorPy >= matY - 4 &&
    cursorPy <= matY + matW + 4
  ) {
    const rIdx = Math.floor((cursorPy - matY) / (cell + gap));
    if (rIdx >= 0 && rIdx < matN) hoverRowTarget = rIdx;
  }

  const autoRowPhase = (t * 0.52) % matN;
  const rowWeights: number[] = [];
  let rowWeightSum = 0;
  for (let r = 0; r < matN; r++) {
    const circDist = Math.min(Math.abs(r - autoRowPhase), matN - Math.abs(r - autoRowPhase));
    const autoW = Math.exp(-(circDist * circDist) * 2.4);
    const manualW = hoverRowTarget === r ? 1 : 0;
    const blended = hoverRowTarget >= 0 ? lerp(autoW, manualW, hoverAlpha) : autoW;
    rowWeights.push(blended);
    rowWeightSum += blended;
  }
  const normRowWeights = rowWeights.map((w) => w / Math.max(1e-4, rowWeightSum));

  let peakAttn = 0;
  let dominantRowIdx = 0;
  for (let r = 0; r < matN; r++) {
    if (normRowWeights[r] > normRowWeights[dominantRowIdx]) dominantRowIdx = r;
    const rowAct = normRowWeights[r];
    const cyCell = matY + r * (cell + gap);

    drawMicroLabel(ctx, TOKEN_LABELS[r], matX - 5, cyCell + cell * 0.5, {
      align: "right",
      fontSize: 7,
      color: rowAct > 0.35 ? OBSIDIAN_PALETTE.sand : "rgba(168, 162, 158, 0.45)",
      backing: false,
    });

    for (let c = 0; c < matN; c++) {
      const cxCell = matX + c * (cell + gap);
      const isMasked = c > r;
      const prob = attnMatrix[r][c];
      if (!isMasked && rowAct > 0.35 && prob > peakAttn) peakAttn = prob;

      if (isMasked) {
        ctx.fillStyle = "rgba(28, 25, 23, 0.35)";
        ctx.beginPath();
        ctx.roundRect(cxCell, cyCell, cell, cell, 2);
        ctx.fill();
      } else {
        const cellAlpha = clamp(0.1 + prob * 0.52 + rowAct * prob * 0.38, 0.08, 0.96);
        const rgb = rowAct > 0.38 && prob > 0.32 ? OBSIDIAN_PALETTE.emeraldRgb : OBSIDIAN_PALETTE.sandRgb;
        ctx.fillStyle = `rgba(${rgb}, ${cellAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.roundRect(cxCell, cyCell, cell, cell, 2);
        ctx.fill();
      }
    }
  }

  // Softmax output curve for smoothly blended query row
  const softmaxCurveY = matY + matW + 18;
  const softmaxH = 26;
  drawMicroLabel(ctx, `SOFTMAX α[${TOKEN_LABELS[dominantRowIdx]}]`, matX, softmaxCurveY, {
    align: "left",
    fontSize: 7.5,
    color: "rgba(168, 162, 158, 0.72)",
    backing: false,
  });

  const softPts: { x: number; y: number }[] = [];
  for (let c = 0; c < matN; c++) {
    let blendedProb = 0;
    for (let r = 0; r < matN; r++) {
      blendedProb += normRowWeights[r] * attnMatrix[r][c];
    }
    softPts.push({
      x: matX + c * (cell + gap) + cell * 0.5,
      y: softmaxCurveY + 12 + softmaxH * (1 - clamp(blendedProb * 1.45, 0, 1)),
    });
  }

  const baseY = softmaxCurveY + 12 + softmaxH;
  ctx.strokeStyle = "rgba(168, 162, 158, 0.14)";
  ctx.lineWidth = 0.65;
  ctx.beginPath();
  ctx.moveTo(matX, baseY);
  ctx.lineTo(matX + matW, baseY);
  ctx.stroke();

  ctx.fillStyle = "rgba(52, 211, 153, 0.11)";
  ctx.beginPath();
  ctx.moveTo(softPts[0].x, baseY);
  traceSmoothPath(ctx, softPts, false);
  ctx.lineTo(softPts[softPts.length - 1].x, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = OBSIDIAN_PALETTE.emerald;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  traceSmoothPath(ctx, softPts);
  ctx.stroke();

  for (let c = 0; c < softPts.length; c++) {
    if (c <= dominantRowIdx) {
      drawFocalNode(ctx, softPts[c].x, softPts[c].y, 1.6, OBSIDIAN_PALETTE.emeraldRgb, OBSIDIAN_PALETTE.emerald, 1.6);
    }
  }

  const passTag = bwdBlend > 0.5 ? "BWD" : "FWD";
  return `${passTag} · 8-Head · α=${peakAttn.toFixed(2)}`;
}
