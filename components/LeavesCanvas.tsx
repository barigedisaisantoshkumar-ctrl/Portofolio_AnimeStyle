"use client";

import { useEffect, useRef } from "react";

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  color: string;
  opacity: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
}

const LEAF_COLORS = [
  "rgba(192, 57, 43, 0.85)",   // Vibrant crimson
  "rgba(139, 0, 0, 0.75)",     // Deep dark red
  "rgba(217, 83, 79, 0.70)",   // Warm vermilion
  "rgba(163, 0, 0, 0.80)",     // Mid crimson
  "rgba(90, 10, 20, 0.65)",    // Deep wine
  "rgba(235, 77, 75, 0.75)",   // Bright cherry red
];

function createLeaf(W: number, H: number, startAtTop: boolean = false): Leaf {
  return {
    x: Math.random() * W,
    y: startAtTop ? -30 - Math.random() * 40 : Math.random() * H,
    size: 6 + Math.random() * 10,
    speedY: 0.45 + Math.random() * 0.65,
    speedX: (Math.random() - 0.5) * 0.35,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    opacity: 0.45 + Math.random() * 0.5,
    swayFreq: 0.006 + Math.random() * 0.008,
    swayAmp: 0.6 + Math.random() * 0.9,
    phase: Math.random() * Math.PI * 2,
  };
}

export function LeavesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    const COUNT = 26; // Elegant number of drifting leaves
    const leaves: Leaf[] = [];

    function handleResize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize leaves distributed across the screen
    for (let i = 0; i < COUNT; i++) {
      leaves.push(createLeaf(W, H, false));
    }

    // Draw an organic tapered anime leaf / petal silhouette
    function drawOrganicLeaf(l: Leaf) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.globalAlpha = l.opacity;
      ctx.fillStyle = l.color;

      ctx.beginPath();
      // Natural curved leaf shape
      ctx.moveTo(0, -l.size);
      ctx.bezierCurveTo(
        l.size * 0.75,
        -l.size * 0.35,
        l.size * 0.65,
        l.size * 0.65,
        0,
        l.size * 1.15
      );
      ctx.bezierCurveTo(
        -l.size * 0.65,
        l.size * 0.65,
        -l.size * 0.75,
        -l.size * 0.35,
        0,
        -l.size
      );
      ctx.closePath();
      ctx.fill();

      // Subtle center vein
      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.75);
      ctx.lineTo(0, l.size * 0.85);
      ctx.stroke();

      ctx.restore();
    }

    let time = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];
        l.y += l.speedY;
        // Sinusoidal horizontal sway
        l.x += l.speedX + Math.sin(time * 1.2 + l.phase) * l.swayAmp;
        l.angle += l.spin;

        // Reset to top when leaf drifts off bottom or sides
        if (l.y > H + 40 || l.x < -40 || l.x > W + 40) {
          leaves[i] = createLeaf(W, H, true);
        }

        drawOrganicLeaf(l);
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
