import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  lerp,
  traceSmoothPath,
  type RenderCtx,
} from "./types";

function gaussianDensity(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / Math.max(0.015, sigma);
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

function evalContinuousChain(s: number, targetMu: number, targetSd: number, chainSeed: number): number {
  // Continuous ergodic HMC/MCMC path scrolled smoothly at sub-pixel precision
  const drift =
    0.48 * Math.sin(s * 0.72 + chainSeed) +
    0.31 * Math.cos(s * 1.43 - chainSeed * 1.7) +
    0.21 * Math.sin(s * 2.61 + chainSeed * 0.5);
  return clamp(targetMu + drift * targetSd * 1.65, 0.08, 0.92);
}

export function renderBayesianCurve(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPx, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);

  const padX = width * (compact ? 0.08 : 0.075);
  const plotW = width - padX * 2;
  const splitY = safeTop + stageH * 0.62;

  const latestImp = impulses[impulses.length - 1];
  const obsBurst = latestImp && latestImp.age < 2.2 ? Math.exp(-latestImp.age * 1.25) : 0;

  // Continuous Conjugate Normal-Normal parameters
  const priorMu = 0.34;
  const priorSd = 0.145;
  const likMu = clamp(0.67 + Math.sin(t * 0.36) * 0.045 + mx * 0.04, 0.42, 0.84);
  const likSd = clamp(0.115 - obsBurst * 0.032 + my * 0.012, 0.068, 0.155);

  const nEff = 3.2 + 9.5 * (0.5 + 0.5 * Math.sin(t * 0.42)) + obsBurst * 14.0;
  const priorPrec = 1 / (priorSd * priorSd);
  const dataPrec = nEff / (likSd * likSd) * 0.25;
  const postVar = 1 / (priorPrec + dataPrec);
  const postSd = Math.sqrt(postVar);
  const postMu = (priorPrec * priorMu + dataPrec * likMu) * postVar;

  // Interactive hover probe along parameter axis theta in [0, 1]
  const hoverNormX = clamp((cursorPx - padX) / Math.max(1, plotW), 0.04, 0.96);

  // Top zone: Prior, Likelihood, Posterior Density Curves
  const topPlotTop = safeTop + 26;
  const baseLineY = splitY - 22;
  const peakH = Math.max(70, baseLineY - topPlotTop);

  drawMicroLabel(ctx, "BAYES POSTERIOR P(θ|D)", padX, safeTop + 11, {
    align: "left",
    fontSize: 8,
    color: "rgba(245, 245, 244, 0.84)",
    backing: false,
  });
  drawMicroLabel(ctx, `N_eff=${nEff.toFixed(1)}`, padX + plotW, safeTop + 11, {
    align: "right",
    fontSize: 8,
    color: OBSIDIAN_PALETTE.emerald,
    backing: false,
  });

  // Subtle horizontal baseline & theta tick marks
  ctx.strokeStyle = "rgba(168, 162, 158, 0.15)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(padX, baseLineY);
  ctx.lineTo(padX + plotW, baseLineY);
  ctx.stroke();

  const thetaTicks = [0.2, 0.5, 0.8];
  for (const th of thetaTicks) {
    const tx = padX + th * plotW;
    ctx.strokeStyle = "rgba(168, 162, 158, 0.14)";
    ctx.beginPath();
    ctx.moveTo(tx, baseLineY - 2.5);
    ctx.lineTo(tx, baseLineY + 2.5);
    ctx.stroke();
    drawMicroLabel(ctx, th.toFixed(1), tx, baseLineY + 10, {
      fontSize: 7,
      color: "rgba(168, 162, 158, 0.52)",
      backing: false,
    });
  }

  const samples = 60;
  const maxPeak = Math.max(
    gaussianDensity(postMu, postMu, postSd),
    gaussianDensity(likMu, likMu, likSd),
    3.2
  );

  const buildDensityPts = (mu: number, sd: number) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= samples; i++) {
      const th = i / samples;
      const d = gaussianDensity(th, mu, sd) / maxPeak;
      pts.push({
        x: padX + th * plotW,
        y: baseLineY - clamp(d, 0, 1.05) * peakH,
      });
    }
    return pts;
  };

  const priorPts = buildDensityPts(priorMu, priorSd);
  const likPts = buildDensityPts(likMu, likSd);
  const postPts = buildDensityPts(postMu, postSd);

  // 1. Prior curve (quiet dashed stone line)
  ctx.save();
  ctx.setLineDash([3, 3.5]);
  ctx.strokeStyle = "rgba(168, 162, 158, 0.42)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  traceSmoothPath(ctx, priorPts);
  ctx.stroke();
  ctx.restore();

  // 2. Likelihood curve (warm sand translucent fill + stroke)
  ctx.fillStyle = "rgba(229, 193, 148, 0.055)";
  ctx.beginPath();
  ctx.moveTo(likPts[0].x, baseLineY);
  traceSmoothPath(ctx, likPts, false);
  ctx.lineTo(likPts[likPts.length - 1].x, baseLineY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(229, 193, 148, 0.62)";
  ctx.lineWidth = 1.15;
  ctx.beginPath();
  traceSmoothPath(ctx, likPts);
  ctx.stroke();

  // 3. Posterior curve (rich terracotta gradient fill + crisp stroke)
  const postGrad = ctx.createLinearGradient(0, baseLineY - peakH, 0, baseLineY);
  postGrad.addColorStop(0, "rgba(212, 102, 74, 0.28)");
  postGrad.addColorStop(1, "rgba(212, 102, 74, 0.02)");
  ctx.fillStyle = postGrad;
  ctx.beginPath();
  ctx.moveTo(postPts[0].x, baseLineY);
  traceSmoothPath(ctx, postPts, false);
  ctx.lineTo(postPts[postPts.length - 1].x, baseLineY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = OBSIDIAN_PALETTE.terracotta;
  ctx.lineWidth = 1.85;
  ctx.beginPath();
  traceSmoothPath(ctx, postPts);
  ctx.stroke();

  // 95% HDI caliper bracket right along the base
  const hdiLo = clamp(postMu - 1.96 * postSd, 0.05, 0.95);
  const hdiHi = clamp(postMu + 1.96 * postSd, 0.05, 0.95);
  const hdiX1 = padX + hdiLo * plotW;
  const hdiX2 = padX + hdiHi * plotW;

  ctx.strokeStyle = "rgba(52, 211, 153, 0.62)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(hdiX1, baseLineY + 1);
  ctx.lineTo(hdiX2, baseLineY + 1);
  ctx.moveTo(hdiX1, baseLineY - 2);
  ctx.lineTo(hdiX1, baseLineY + 4);
  ctx.moveTo(hdiX2, baseLineY - 2);
  ctx.lineTo(hdiX2, baseLineY + 4);
  ctx.stroke();

  drawMicroLabel(ctx, "95% HDI", (hdiX1 + hdiX2) * 0.5, baseLineY + 11, {
    fontSize: 7,
    color: "rgba(52, 211, 153, 0.85)",
    backing: false,
  });

  // Posterior MAP anchor vertical stem + focal node
  const mapX = padX + postMu * plotW;
  const mapTopY = baseLineY - clamp(gaussianDensity(postMu, postMu, postSd) / maxPeak, 0, 1.05) * peakH;

  ctx.save();
  ctx.setLineDash([2, 2.5]);
  ctx.strokeStyle = "rgba(212, 102, 74, 0.4)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(mapX, mapTopY);
  ctx.lineTo(mapX, baseLineY);
  ctx.stroke();
  ctx.restore();

  drawFocalNode(ctx, mapX, mapTopY, 2.6, OBSIDIAN_PALETTE.terracottaRgb, OBSIDIAN_PALETTE.terracotta, 2.0);
  drawMicroLabel(ctx, `θ̂=${postMu.toFixed(2)}`, mapX, Math.max(topPlotTop + 4, mapTopY - 12), {
    fontSize: 7.5,
    color: OBSIDIAN_PALETTE.sand,
  });

  // Smooth cursor parameter probe
  if (hoverAlpha > 0.02) {
    const px = padX + hoverNormX * plotW;
    const dPost = gaussianDensity(hoverNormX, postMu, postSd);
    const py = baseLineY - clamp(dPost / maxPeak, 0, 1.05) * peakH;
    ctx.save();
    ctx.globalAlpha *= hoverAlpha;
    ctx.strokeStyle = "rgba(229, 193, 148, 0.32)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(px, topPlotTop);
    ctx.lineTo(px, baseLineY);
    ctx.stroke();
    drawFocalNode(ctx, px, py, 2.0, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.7);
    drawMicroLabel(ctx, `θ=${hoverNormX.toFixed(2)}`, px, py - 10, {
      fontSize: 7,
      color: "rgba(229, 193, 148, 0.9)",
    });
    ctx.restore();
  }

  // Quiet horizontal rule separating Density zone from MCMC Trace & Marginal Hist
  const midDivY = splitY + 4;
  ctx.strokeStyle = "rgba(168, 162, 158, 0.1)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(padX, midDivY);
  ctx.lineTo(padX + plotW, midDivY);
  ctx.stroke();

  const botTop = midDivY + 18;
  const botH = Math.max(46, safeBottom - botTop - 8);
  const traceW = compact ? plotW : plotW * 0.57;

  // Bottom-Left: Sub-pixel Smooth 2-Chain MCMC Ergodic Trace (zero 9Hz jitter!)
  drawMicroLabel(ctx, "2-CHAIN MCMC TRACE", padX, midDivY + 10, {
    align: "left",
    fontSize: 7.5,
    color: "rgba(245, 245, 244, 0.78)",
    backing: false,
  });

  const chainMidY = botTop + botH * 0.5;
  ctx.save();
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(padX, chainMidY);
  ctx.lineTo(padX + traceW, chainMidY);
  ctx.stroke();
  ctx.restore();

  const traceSamples = 48;
  const scrollPhase = t * 3.8;
  const windowDuration = 12.0;
  const chain1Pts: { x: number; y: number }[] = [];
  const chain2Pts: { x: number; y: number }[] = [];

  for (let i = 0; i <= traceSamples; i++) {
    const u = i / traceSamples;
    const x = padX + u * traceW;
    const s = scrollPhase - (1 - u) * windowDuration;
    const v1 = evalContinuousChain(s, postMu, postSd, 0.4);
    const v2 = evalContinuousChain(s, postMu, postSd, 3.1);
    const y1 = chainMidY - clamp((v1 - postMu) / Math.max(0.14, postSd * 2.8), -1, 1) * (botH * 0.46);
    const y2 = chainMidY - clamp((v2 - postMu) / Math.max(0.14, postSd * 2.8), -1, 1) * (botH * 0.46);
    chain1Pts.push({ x, y: y1 });
    chain2Pts.push({ x, y: y2 });
  }

  ctx.strokeStyle = "rgba(229, 193, 148, 0.65)";
  ctx.lineWidth = 1.05;
  ctx.beginPath();
  traceSmoothPath(ctx, chain1Pts);
  ctx.stroke();

  ctx.strokeStyle = OBSIDIAN_PALETTE.terracotta;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  traceSmoothPath(ctx, chain2Pts);
  ctx.stroke();

  const end1 = chain1Pts[chain1Pts.length - 1];
  const end2 = chain2Pts[chain2Pts.length - 1];
  drawFocalNode(ctx, end1.x, end1.y, 1.7, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.6);
  drawFocalNode(ctx, end2.x, end2.y, 1.9, OBSIDIAN_PALETTE.terracottaRgb, OBSIDIAN_PALETTE.terracotta, 1.7);

  // Bottom-Right (desktop): Marginal Posterior Histogram + KDE Spline Overlay
  if (!compact) {
    const histX = padX + traceW + 18;
    const histW = padX + plotW - histX;

    ctx.strokeStyle = "rgba(168, 162, 158, 0.1)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(histX - 9, midDivY + 6);
    ctx.lineTo(histX - 9, botTop + botH);
    ctx.stroke();

    drawMicroLabel(ctx, "HISTOGRAM + KDE", histX, midDivY + 10, {
      align: "left",
      fontSize: 7.5,
      color: "rgba(245, 245, 244, 0.78)",
      backing: false,
    });

    const bins = 12;
    const binGap = 2;
    const barW = Math.max(3, (histW - binGap * (bins - 1)) / bins);
    const kdePts: { x: number; y: number }[] = [];
    const postPeakHist = gaussianDensity(postMu, postMu, postSd);

    ctx.strokeStyle = "rgba(168, 162, 158, 0.14)";
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(histX, botTop + botH);
    ctx.lineTo(histX + histW, botTop + botH);
    ctx.stroke();

    for (let b = 0; b < bins; b++) {
      const binCenter = lerp(postMu - postSd * 2.8, postMu + postSd * 2.8, (b + 0.5) / bins);
      const dens = gaussianDensity(binCenter, postMu, postSd) / Math.max(0.5, postPeakHist);
      const jitter = 0.94 + 0.06 * Math.sin(t * 1.3 + b * 1.4);
      const h = clamp(dens * jitter, 0.06, 1) * (botH - 6);
      const bx = histX + b * (barW + binGap);
      const by = botTop + botH - h;

      ctx.fillStyle = "rgba(212, 102, 74, 0.24)";
      ctx.beginPath();
      ctx.roundRect(bx, by, barW, h, 1.5);
      ctx.fill();

      kdePts.push({ x: bx + barW * 0.5, y: botTop + botH - clamp(dens, 0, 1) * (botH - 6) });
    }

    ctx.strokeStyle = OBSIDIAN_PALETTE.emerald;
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    traceSmoothPath(ctx, kdePts);
    ctx.stroke();
  }

  const rHat = (1.0 + Math.abs(Math.sin(t * 0.5)) * 0.004).toFixed(2);
  const confidence = Math.round(clamp(nEff / 14, 0.72, 0.97) * 100) / 100;
  return `MAP=${postMu.toFixed(2)} · P=${confidence.toFixed(2)} · R̂=${rHat}`;
}
