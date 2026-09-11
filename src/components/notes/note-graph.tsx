"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";
import { select } from "d3-selection";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import { drag as d3Drag } from "d3-drag";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import type { NoteGraphData } from "@/actions/study/notes";

interface D3SimulationNode extends SimulationNodeDatum {
  id: string;
  slug: string;
  title: string;
  categoryId: string | null;
  categoryName?: string;
  categoryColor?: string;
  degree: number;
  isCurrent?: boolean;
  radius: number;
}

interface D3SimulationLink extends SimulationLinkDatum<D3SimulationNode> {
  id: string;
  source: string | D3SimulationNode;
  target: string | D3SimulationNode;
}

interface NoteGraphProps {
  data: NoteGraphData;
  height?: number | string;
  isLocal?: boolean;
  activeSlug?: string;
  className?: string;
}

export function NoteGraph({
  data,
  height = 300,
  isLocal = false,
  activeSlug,
  className = "",
}: NoteGraphProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<D3SimulationNode | null>(null);
  const hoveredNodeRef = useRef<D3SimulationNode | null>(null);

  // References for simulation & zoom state
  const simulationRef = useRef<Simulation<D3SimulationNode, D3SimulationLink> | null>(null);
  const zoomBehaviorRef = useRef<any>(null);
  const transformRef = useRef(zoomIdentity);

  // Initialize and run D3 force graph on canvas
  const renderGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.nodes.length === 0) return;

    const width = container.clientWidth || 300;
    const canvasHeight = typeof height === "number" ? height : container.clientHeight || 300;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Determine dark mode
    const isDark = document.documentElement.classList.contains("dark");
    const linkColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(39, 39, 42, 0.15)";
    const nodeDefaultColor = isDark ? "#A8A29E" : "#78716C";
    const brandColor = "#C2553A";
    const textColor = isDark ? "#FAF8F5" : "#1C1917";

    // Prepare nodes with radius scaled by degree
    const nodes: D3SimulationNode[] = data.nodes.map((n) => {
      const isCurrent = n.isCurrent || (activeSlug && n.slug === activeSlug);
      const baseRadius = isLocal ? 6 : 5;
      const radius = Math.min(18, baseRadius + Math.sqrt(n.degree) * 2.8 + (isCurrent ? 4 : 0));
      return {
        ...n,
        isCurrent: Boolean(isCurrent),
        radius,
      };
    });

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Prepare edges
    const links: D3SimulationLink[] = data.edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      }));

    // Setup D3 Force Simulation
    const simulation = forceSimulation<D3SimulationNode, D3SimulationLink>(nodes)
      .force(
        "link",
        forceLink<D3SimulationNode, D3SimulationLink>(links)
          .id((d) => d.id)
          .distance(isLocal ? 55 : 70)
      )
      .force("charge", forceManyBody().strength(isLocal ? -120 : -160))
      .force("center", forceCenter(width / 2, canvasHeight / 2))
      .force(
        "collision",
        forceCollide<D3SimulationNode>().radius((d) => d.radius + 6)
      );

    simulationRef.current = simulation;

    // Draw frame
    const draw = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Apply zoom & pan transform
      const transform = transformRef.current;
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // 1. Draw Edges
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const link of links) {
        const source = link.source as D3SimulationNode;
        const target = link.target as D3SimulationNode;
        if (source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
        }
      }
      ctx.stroke();

      // 2. Draw Nodes
      for (const node of nodes) {
        if (node.x === undefined || node.y === undefined) continue;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Fill color
        if (node.isCurrent) {
          ctx.fillStyle = brandColor;
        } else if (node.categoryColor) {
          ctx.fillStyle = node.categoryColor;
        } else {
          ctx.fillStyle = nodeDefaultColor;
        }
        ctx.fill();

        // Node outline
        ctx.lineWidth = node.isCurrent ? 3 : 1.5;
        ctx.strokeStyle = node.isCurrent
          ? isDark
            ? "#FFFFFF"
            : "#FAF8F5"
          : isDark
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(0, 0, 0, 0.15)";
        ctx.stroke();

        // Node Glow for Current active note
        if (node.isCurrent) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(194, 85, 58, 0.35)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Labels
        const shouldShowLabel =
          node.isCurrent ||
          node.degree >= 2 ||
          isLocal ||
          transform.k > 1.2 ||
          hoveredNodeRef.current?.id === node.id;

        if (shouldShowLabel) {
          ctx.font = `${node.isCurrent ? "bold " : ""}10px ui-monospace, SFMono-Regular, monospace`;
          ctx.fillStyle = textColor;
          ctx.textAlign = "center";
          ctx.fillText(node.title, node.x, node.y + node.radius + 12);
        }
      }

      ctx.restore();
    };

    simulation.on("tick", draw);

    // D3 Zoom & Pan
    const zoomBehavior = d3Zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.4, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        draw();
      });

    zoomBehaviorRef.current = zoomBehavior;

    const selection = select(canvas);
    selection.call(zoomBehavior);

    // Drag behavior
    const dragBehavior = d3Drag<HTMLCanvasElement, unknown>()
      .subject((event) => {
        const transform = transformRef.current;
        const clickX = (event.x - transform.x) / transform.k;
        const clickY = (event.y - transform.y) / transform.k;
        return nodes.find((n) => {
          if (n.x === undefined || n.y === undefined) return false;
          const dx = clickX - n.x;
          const dy = clickY - n.y;
          return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
        });
      })
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    selection.call(dragBehavior as any);

    // Click on node navigation
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickRawX = e.clientX - rect.left;
      const clickRawY = e.clientY - rect.top;

      const transform = transformRef.current;
      const x = (clickRawX - transform.x) / transform.k;
      const y = (clickRawY - transform.y) / transform.k;

      const clicked = nodes.find((n) => {
        if (n.x === undefined || n.y === undefined) return false;
        const dx = x - n.x;
        const dy = y - n.y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 3;
      });

      if (clicked) {
        router.push(`/dashboard/catatan/${clicked.slug}`);
      }
    };

    // Mouse move for hover tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickRawX = e.clientX - rect.left;
      const clickRawY = e.clientY - rect.top;

      const transform = transformRef.current;
      const x = (clickRawX - transform.x) / transform.k;
      const y = (clickRawY - transform.y) / transform.k;

      const found = nodes.find((n) => {
        if (n.x === undefined || n.y === undefined) return false;
        const dx = x - n.x;
        const dy = y - n.y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 3;
      });

      hoveredNodeRef.current = found || null;
      setHoveredNode(found || null);
      canvas.style.cursor = found ? "pointer" : "grab";
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      simulation.stop();
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [data, height, isLocal, activeSlug, router]);

  useEffect(() => {
    const cleanup = renderGraph();
    return () => {
      cleanup?.();
    };
  }, [renderGraph]);

  // Zoom controls helper
  const handleZoom = (scaleDelta: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !zoomBehaviorRef.current) return;
    const selection = select(canvas);
    zoomBehaviorRef.current.scaleBy(selection as any, scaleDelta);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas || !zoomBehaviorRef.current) return;
    const selection = select(canvas);
    zoomBehaviorRef.current.transform(selection as any, zoomIdentity);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#FFFFFF] dark:bg-[#18181B] border border-border select-none group ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Floating Zoom & Action Controls */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-surface/80 backdrop-blur-xs border border-border rounded-md p-1 shadow-xs z-10">
        <button
          type="button"
          onClick={() => handleZoom(1.3)}
          className="p-1 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Perbesar (Zoom In)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(0.7)}
          className="p-1 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Perkecil (Zoom Out)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-1 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Reset Posisi"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hover Card */}
      {hoveredNode && (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded bg-surface/95 backdrop-blur-xs border border-border text-xs font-mono shadow-md z-10 pointer-events-none space-y-0.5 max-w-[200px]">
          <div className="font-bold text-text-primary truncate">{hoveredNode.title}</div>
          <div className="text-[10px] text-text-tertiary flex items-center justify-between gap-2">
            <span>{hoveredNode.categoryName || "Kurikulum"}</span>
            <span>{hoveredNode.degree} koneksi</span>
          </div>
        </div>
      )}

      {/* Graph Watermark Badge */}
      <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-text-tertiary/70 flex items-center gap-1 pointer-events-none">
        <Sparkles className="w-3 h-3 text-brand-500" />
        <span>{isLocal ? "Local Graph (r=1)" : "Vault Graph"}</span>
      </div>
    </div>
  );
}
