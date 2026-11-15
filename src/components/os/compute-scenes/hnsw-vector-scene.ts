import {
  OBSIDIAN_PALETTE,
  clamp,
  drawFocalNode,
  drawMicroLabel,
  drawMiniProgressBar,
  lerp,
  project3D,
  rotate3D,
  traceSmoothPath,
  unprojectPlaneY,
  type RenderCtx,
  type Vec3,
} from "./types";

interface HnswNode {
  id: number;
  cluster: number;
  nx: number;
  nz: number;
  level: 0 | 1 | 2;
  fp: number[];
  l0Neighbors: number[];
  l1Neighbors: number[];
  l2Neighbors: number[];
}

const CLUSTER_CENTERS = [
  { x: -0.48, z: -0.42 },
  { x: 0.48, z: -0.38 },
  { x: -0.44, z: 0.46 },
  { x: 0.48, z: 0.44 },
] as const;

function buildHnswGraph(): HnswNode[] {
  const nodes: HnswNode[] = Array.from({ length: 32 }, (_, i) => {
    const c = i % 4;
    const ring = Math.floor(i / 4);
    const angle = ring * 1.45 + c * 0.85;
    const rad = 0.08 + ((ring * 3 + c) % 5) * 0.072;
    const nx = clamp(CLUSTER_CENTERS[c].x + Math.cos(angle) * rad, -0.82, 0.82);
    const nz = clamp(CLUSTER_CENTERS[c].z + Math.sin(angle) * rad, -0.82, 0.82);
    const level: 0 | 1 | 2 = i < 3 ? 2 : i < 10 ? 1 : 0;
    const fp = Array.from({ length: 8 }, (_, d) => {
      const val = 0.5 + 0.5 * Math.sin((i + 1) * 1.7 + (d + 1) * (c + 1.3));
      return clamp(val, 0.14, 1);
    });
    return {
      id: i,
      cluster: c,
      nx,
      nz,
      level,
      fp,
      l0Neighbors: [],
      l1Neighbors: [],
      l2Neighbors: [],
    };
  });

  const connectLayer = (layerIds: number[], k: number, key: "l0Neighbors" | "l1Neighbors" | "l2Neighbors") => {
    for (const id of layerIds) {
      const a = nodes[id];
      const sorted = layerIds
        .filter((other) => other !== id)
        .map((other) => ({
          other,
          d: Math.hypot(a.nx - nodes[other].nx, a.nz - nodes[other].nz),
        }))
        .sort((x, y) => x.d - y.d)
        .slice(0, k);
      for (const s of sorted) {
        if (!a[key].includes(s.other)) a[key].push(s.other);
        if (!nodes[s.other][key].includes(id)) nodes[s.other][key].push(id);
      }
    }
  };

  connectLayer(
    nodes.map((n) => n.id),
    4,
    "l0Neighbors"
  );
  connectLayer(
    nodes.filter((n) => n.level >= 1).map((n) => n.id),
    3,
    "l1Neighbors"
  );
  connectLayer(
    nodes.filter((n) => n.level === 2).map((n) => n.id),
    2,
    "l2Neighbors"
  );

  return nodes;
}

const HNSW_NODES = buildHnswGraph();

function greedyHnswStep(
  startId: number,
  qx: number,
  qz: number,
  neighborKey: "l0Neighbors" | "l1Neighbors" | "l2Neighbors"
): number[] {
  const path = [startId];
  let curr = startId;
  let currD = Math.hypot(HNSW_NODES[curr].nx - qx, HNSW_NODES[curr].nz - qz);

  for (let hop = 0; hop < 6; hop++) {
    let bestId = curr;
    let bestD = currD;
    for (const nb of HNSW_NODES[curr][neighborKey]) {
      const d = Math.hypot(HNSW_NODES[nb].nx - qx, HNSW_NODES[nb].nz - qz);
      if (d < bestD - 1e-4) {
        bestD = d;
        bestId = nb;
      }
    }
    if (bestId === curr) break;
    path.push(bestId);
    curr = bestId;
    currD = bestD;
  }
  return path;
}

export function renderVectorSearch(rc: RenderCtx): string {
  const { ctx, width, compact, safeTop, safeBottom, t, mx, my, hoverAlpha, cursorPx, cursorPy, impulses } = rc;
  const stageH = Math.max(200, safeBottom - safeTop);
  const rankW = compact ? 0 : clamp(width * 0.27, 134, 158);
  const cx = compact ? width * 0.52 : (width - rankW - 14) * 0.56 + 14;
  const cy = safeTop + stageH * 0.51;

  const span = compact ? Math.min(width, stageH) * 0.3 : Math.min(width - rankW, stageH) * 0.31;
  const rx = 0.48 + my * 0.15;
  const ry = -0.52 + Math.sin(t * 0.22) * 0.11 + mx * 0.28;
  const planeYs = [50, -8, -62] as const;

  const projNode = (nx: number, nz: number, level: 0 | 1 | 2) => {
    const floatY = Math.sin(t * 1.1 + nx * 3 + nz * 3) * 1.2;
    const v: Vec3 = { x: nx * span, y: planeYs[level] + floatY, z: nz * span };
    return project3D(rotate3D(v, rx, ry), cx, cy, 480);
  };

  // Smooth orbital query coordinate blended gently toward smoothed cursor on plane L0
  const autoQx = Math.sin(t * 0.42) * 0.58;
  const autoQz = Math.cos(t * 0.56) * 0.52;
  let qx = autoQx;
  let qz = autoQz;
  if (hoverAlpha > 0.01 && cursorPx < (compact ? width : width - rankW)) {
    const plane = unprojectPlaneY(cursorPx, cursorPy, planeYs[0], cx, cy, rx, ry, 480);
    const manualQx = clamp(plane.x / Math.max(1, span), -0.85, 0.85);
    const manualQz = clamp(plane.z / Math.max(1, span), -0.85, 0.85);
    qx = lerp(autoQx, manualQx, hoverAlpha);
    qz = lerp(autoQz, manualQz, hoverAlpha);
  }

  // Click burst intensifies retrieval probe cone
  const latestImp = impulses[impulses.length - 1];
  const burst = latestImp && latestImp.age < 1.9 ? Math.exp(-latestImp.age * 1.8) : 0;

  // Draw the 3 stacked HNSW architectural planes (L0 bottom, L1 mid, L2 top)
  const layerNames = ["L0 · 768D", "L1 · EXPRESS", "L2 · ENTRY"] as const;
  for (let lvl = 0; lvl < 3; lvl++) {
    const yP = planeYs[lvl];
    const half = span * (lvl === 2 ? 0.66 : lvl === 1 ? 0.84 : 1.0);
    const c1 = project3D(rotate3D({ x: -half, y: yP, z: -half }, rx, ry), cx, cy, 480);
    const c2 = project3D(rotate3D({ x: half, y: yP, z: -half }, rx, ry), cx, cy, 480);
    const c3 = project3D(rotate3D({ x: half, y: yP, z: half }, rx, ry), cx, cy, 480);
    const c4 = project3D(rotate3D({ x: -half, y: yP, z: half }, rx, ry), cx, cy, 480);

    ctx.fillStyle = lvl === 0 ? "rgba(20, 18, 16, 0.42)" : "rgba(24, 21, 18, 0.24)";
    ctx.strokeStyle = lvl === 0 ? "rgba(168, 162, 158, 0.16)" : "rgba(168, 162, 158, 0.1)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c2.px, c2.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.lineTo(c4.px, c4.py);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const placeLeft = c4.px < 66;
    drawMicroLabel(ctx, layerNames[lvl], placeLeft ? c4.px + 6 : c4.px - 6, c4.py, {
      align: placeLeft ? "left" : "right",
      fontSize: 7,
      color: lvl === 0 ? "rgba(229, 193, 148, 0.72)" : "rgba(168, 162, 158, 0.58)",
      backing: false,
    });
  }

  // Subtle semantic cluster rings on L0 floor
  for (const center of CLUSTER_CENTERS) {
    const ringPts: { x: number; y: number }[] = [];
    for (let s = 0; s <= 18; s++) {
      const ang = (s / 18) * Math.PI * 2;
      const p = project3D(
        rotate3D(
          {
            x: (center.x + Math.cos(ang) * 0.3) * span,
            y: planeYs[0],
            z: (center.z + Math.sin(ang) * 0.3) * span,
          },
          rx,
          ry
        ),
        cx,
        cy,
        480
      );
      ringPts.push({ x: p.px, y: p.py });
    }
    ctx.strokeStyle = "rgba(168, 162, 158, 0.065)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    traceSmoothPath(ctx, ringPts);
    ctx.stroke();
  }

  // Intra-layer k-NN mesh edges
  const drawLayerEdges = (lvl: 0 | 1 | 2, key: "l0Neighbors" | "l1Neighbors" | "l2Neighbors", alpha: number) => {
    ctx.strokeStyle = `rgba(168, 162, 158, ${alpha.toFixed(3)})`;
    ctx.lineWidth = lvl === 2 ? 0.85 : 0.6;
    ctx.beginPath();
    for (const n of HNSW_NODES) {
      if (n.level < lvl) continue;
      const a = projNode(n.nx, n.nz, lvl);
      for (const nbId of n[key]) {
        if (nbId < n.id) continue;
        const nb = HNSW_NODES[nbId];
        if (nb.level < lvl) continue;
        const b = projNode(nb.nx, nb.nz, lvl);
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
      }
    }
    ctx.stroke();
  };

  drawLayerEdges(0, "l0Neighbors", 0.09);
  drawLayerEdges(1, "l1Neighbors", 0.14);
  drawLayerEdges(2, "l2Neighbors", 0.2);

  // Subtle vertical promotion columns for multi-layer hub nodes (L2->L1->L0)
  ctx.save();
  ctx.setLineDash([1.5, 3]);
  ctx.strokeStyle = "rgba(229, 193, 148, 0.13)";
  ctx.lineWidth = 0.65;
  ctx.beginPath();
  for (const n of HNSW_NODES) {
    if (n.level === 0) continue;
    const pBot = projNode(n.nx, n.nz, 0);
    const pTop = projNode(n.nx, n.nz, n.level);
    ctx.moveTo(pBot.px, pBot.py);
    ctx.lineTo(pTop.px, pTop.py);
  }
  ctx.stroke();
  ctx.restore();

  // Hierarchical greedy search L2 -> L1 -> L0
  const l2Path = greedyHnswStep(0, qx, qz, "l2Neighbors");
  const l1Entry = l2Path[l2Path.length - 1];
  const l1Path = greedyHnswStep(l1Entry, qx, qz, "l1Neighbors");
  const l0Entry = l1Path[l1Path.length - 1];
  const l0Path = greedyHnswStep(l0Entry, qx, qz, "l0Neighbors");

  const route3D: { px: number; py: number }[] = [];
  for (const id of l2Path) {
    const p = projNode(HNSW_NODES[id].nx, HNSW_NODES[id].nz, 2);
    route3D.push({ px: p.px, py: p.py });
  }
  for (const id of l1Path) {
    const p = projNode(HNSW_NODES[id].nx, HNSW_NODES[id].nz, 1);
    route3D.push({ px: p.px, py: p.py });
  }
  for (const id of l0Path) {
    const p = projNode(HNSW_NODES[id].nx, HNSW_NODES[id].nz, 0);
    route3D.push({ px: p.px, py: p.py });
  }

  const visitedSet = new Set([...l2Path, ...l1Path, ...l0Path]);

  // Rank all L0 vectors by cosine similarity to current query
  const ranked = HNSW_NODES.map((n) => {
    const dist = Math.hypot(n.nx - qx, n.nz - qz);
    const cosine = clamp(1 - dist * 0.42, 0.35, 0.992);
    return { node: n, dist, cosine };
  }).sort((a, b) => a.dist - b.dist);

  const topK = ranked.slice(0, 5);
  const top1 = topK[0];

  // Query anchor projected on L0
  const qProj = project3D(rotate3D({ x: qx * span, y: planeYs[0] - 2, z: qz * span }, rx, ry), cx, cy, 480);

  // Subtle L0 search cone ellipse around query q
  const searchR = 0.24 + burst * 0.08;
  const conePts: { x: number; y: number }[] = [];
  for (let s = 0; s <= 24; s++) {
    const ang = (s / 24) * Math.PI * 2;
    const p = project3D(
      rotate3D(
        {
          x: clamp(qx + Math.cos(ang) * searchR, -0.95, 0.95) * span,
          y: planeYs[0],
          z: clamp(qz + Math.sin(ang) * searchR, -0.95, 0.95) * span,
        },
        rx,
        ry
      ),
      cx,
      cy,
      480
    );
    conePts.push({ x: p.px, y: p.py });
  }
  ctx.strokeStyle = `rgba(212, 102, 74, ${(0.24 + burst * 0.25).toFixed(3)})`;
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  traceSmoothPath(ctx, conePts);
  ctx.stroke();

  // Render active HNSW traversal polyline across L2 -> L1 -> L0
  if (route3D.length >= 2) {
    ctx.strokeStyle = OBSIDIAN_PALETTE.terracotta;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(route3D[0].px, route3D[0].py);
    for (let k = 1; k < route3D.length; k++) {
      ctx.lineTo(route3D[k].px, route3D[k].py);
    }
    ctx.stroke();

    // Smooth traveling routing pulse descending L2 -> L1 -> L0
    let totalLen = 0;
    const segLens: number[] = [];
    for (let k = 0; k < route3D.length - 1; k++) {
      const l = Math.hypot(route3D[k + 1].px - route3D[k].px, route3D[k + 1].py - route3D[k].py);
      segLens.push(l);
      totalLen += l;
    }
    if (totalLen > 2) {
      const travel = ((t * 0.55) % 1) * totalLen;
      let acc = 0;
      for (let k = 0; k < segLens.length; k++) {
        if (acc + segLens[k] >= travel || k === segLens.length - 1) {
          const segU = clamp((travel - acc) / Math.max(1, segLens[k]), 0, 1);
          const px = lerp(route3D[k].px, route3D[k + 1].px, segU);
          const py = lerp(route3D[k].py, route3D[k + 1].py, segU);
          drawFocalNode(ctx, px, py, 2.3, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 2.0);
          break;
        }
        acc += segLens[k];
      }
    }
  }

  // Cosine similarity chord lines from query q to Top-3 hits
  for (let i = 0; i < 3; i++) {
    const item = topK[i];
    const hp = projNode(item.node.nx, item.node.nz, 0);
    ctx.strokeStyle = i === 0 ? "rgba(52, 211, 153, 0.72)" : "rgba(229, 193, 148, 0.32)";
    ctx.lineWidth = i === 0 ? 1.25 : 0.85;
    ctx.beginPath();
    ctx.moveTo(qProj.px, qProj.py);
    ctx.lineTo(hp.px, hp.py);
    ctx.stroke();
  }

  // Draw all graph nodes cleanly by importance
  for (let lvl = 0; lvl < 3; lvl++) {
    for (const n of HNSW_NODES) {
      if (n.level < lvl) continue;
      const p = projNode(n.nx, n.nz, lvl as 0 | 1 | 2);
      const isTop1 = lvl === 0 && n.id === top1.node.id;
      const isCandidate = lvl === 0 && (n.id === topK[1].node.id || n.id === topK[2].node.id);
      const isVisited = visitedSet.has(n.id);

      if (isTop1) {
        drawFocalNode(ctx, p.px, p.py, 3.0, OBSIDIAN_PALETTE.emeraldRgb, OBSIDIAN_PALETTE.emerald, 2.0);
      } else if (isCandidate) {
        drawFocalNode(ctx, p.px, p.py, 2.1, OBSIDIAN_PALETTE.sandRgb, OBSIDIAN_PALETTE.sand, 1.7);
      } else if (isVisited) {
        ctx.fillStyle = "rgba(212, 102, 74, 0.85)";
        ctx.beginPath();
        ctx.arc(p.px, p.py, 1.9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = lvl === 2 ? "rgba(229, 193, 148, 0.45)" : "rgba(168, 162, 158, 0.34)";
        ctx.beginPath();
        ctx.arc(p.px, p.py, lvl === 0 ? 1.3 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Active Query q focal point
  drawFocalNode(
    ctx,
    qProj.px,
    qProj.py,
    3.1 + burst * 0.6,
    OBSIDIAN_PALETTE.terracottaRgb,
    OBSIDIAN_PALETTE.terracotta,
    2.1
  );
  drawMicroLabel(ctx, "query q", qProj.px - 9, qProj.py - 9, {
    align: "right",
    fontSize: 7.5,
    color: OBSIDIAN_PALETTE.sand,
  });

  // Right-side integrated borderless Top-K Rerank ranking & 8D Embedding Barcodes
  if (!compact) {
    const paneX = width - rankW - 14;
    const paneTop = safeTop + 14;
    const paneBot = safeBottom - 14;

    ctx.strokeStyle = "rgba(168, 162, 158, 0.11)";
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(paneX - 10, paneTop);
    ctx.lineTo(paneX - 10, paneBot);
    ctx.stroke();

    drawMicroLabel(ctx, "TOP-K RERANK", paneX, paneTop + 4, {
      align: "left",
      fontSize: 8,
      color: "rgba(245, 245, 244, 0.82)",
      backing: false,
    });
    drawMicroLabel(ctx, "cos(q, v)", paneX + rankW, paneTop + 4, {
      align: "right",
      fontSize: 7.5,
      color: "rgba(168, 162, 158, 0.68)",
      backing: false,
    });

    const rowStart = paneTop + 26;
    const rowStep = Math.min(34, (paneBot - rowStart - 12) / topK.length);

    for (let i = 0; i < topK.length; i++) {
      const item = topK[i];
      const ryRow = rowStart + i * rowStep;
      const isHit = i === 0;
      const fillCol = isHit ? OBSIDIAN_PALETTE.emerald : OBSIDIAN_PALETTE.sand;

      drawMicroLabel(ctx, `#v${String(item.node.id).padStart(2, "0")}`, paneX, ryRow, {
        align: "left",
        fontSize: 8,
        color: isHit ? OBSIDIAN_PALETTE.emerald : "rgba(229, 193, 148, 0.85)",
        backing: false,
      });

      // Tiny crisp 8-dim quantized embedding fingerprint barcode
      const barStartX = paneX + 34;
      for (let d = 0; d < 8; d++) {
        const amp = item.node.fp[d];
        const bh = 2 + amp * 7;
        ctx.fillStyle = isHit
          ? `rgba(52, 211, 153, ${(0.3 + amp * 0.6).toFixed(2)})`
          : `rgba(168, 162, 158, ${(0.22 + amp * 0.42).toFixed(2)})`;
        ctx.fillRect(barStartX + d * 3.5, ryRow + 3.5 - bh, 2, bh);
      }

      drawMicroLabel(ctx, item.cosine.toFixed(3), paneX + rankW, ryRow, {
        align: "right",
        fontSize: 8,
        color: isHit ? OBSIDIAN_PALETTE.emerald : "rgba(168, 162, 158, 0.78)",
        backing: false,
      });

      drawMiniProgressBar(
        ctx,
        paneX,
        ryRow + 9,
        rankW,
        2.5,
        (item.cosine - 0.3) / 0.7,
        fillCol,
        "rgba(41, 37, 36, 0.55)"
      );
    }
  }

  const totalHops = Math.max(3, l2Path.length + l1Path.length + l0Path.length - 2);
  return `L2→L1→L0 · cos=${top1.cosine.toFixed(3)} · ${totalHops} hops`;
}
