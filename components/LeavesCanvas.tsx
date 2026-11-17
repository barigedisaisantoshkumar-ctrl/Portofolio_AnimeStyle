"use client";

import { useEffect, useRef } from "react";
import { useBreathingStyle } from "@/components/BreathingContext";

interface Particle {
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
  shape: "leaf" | "droplet" | "spark" | "butterfly" | "petal";
}

export function LeavesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentStyle } = useBreathingStyle();
  const styleRef = useRef(currentStyle);

  // Keep styleRef in sync
  useEffect(() => {
    styleRef.current = currentStyle;
  }, [currentStyle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    const COUNT = 28;
    const particles: Particle[] = [];

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReduced = mediaQuery.matches;
    const mediaListener = (e: MediaQueryListEvent) => {
      isReduced = e.matches;
    };
    mediaQuery.addEventListener("change", mediaListener);

    function handleResize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    function getParticleShape(mode: string): Particle["shape"] {
      switch (mode) {
        case "water":
          return "droplet";
        case "sparks":
          return "spark";
        case "butterflies":
          return "butterfly";
        case "petals":
          return "petal";
        case "leaves":
        default:
          return "leaf";
      }
    }

    function createParticle(startAtTop: boolean = false): Particle {
      const active = styleRef.current;
      const palette = active.particles.colors;
      const shape = getParticleShape(active.particles.mode);

      const speedMultiplier = isReduced ? 0.25 : 1;

      return {
        x: Math.random() * W,
        y: startAtTop ? -25 - Math.random() * 35 : Math.random() * H,
        size: 6 + Math.random() * 9,
        speedY: (0.4 + Math.random() * 0.6) * speedMultiplier,
        speedX: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * (isReduced ? 0.005 : 0.02),
        color: palette[Math.floor(Math.random() * palette.length)],
        opacity: 0.45 + Math.random() * 0.45,
        swayFreq: 0.006 + Math.random() * 0.008,
        swayAmp: (isReduced ? 0.2 : 0.6) + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        shape,
      };
    }

    // Initialize particles across viewport
    for (let i = 0; i < COUNT; i++) {
      particles.push(createParticle(false));
    }

    // ── Drawing functions for each Breathing Form ──

    // 1. Organic Tapered Leaf / Ember (Flame Breathing)
    function drawLeaf(p: Particle) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.35, p.size * 0.65, p.size * 0.65, 0, p.size * 1.15);
      ctx.bezierCurveTo(-p.size * 0.65, p.size * 0.65, -p.size * 0.75, -p.size * 0.35, 0, -p.size);
      ctx.closePath();
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.75);
      ctx.lineTo(0, p.size * 0.85);
      ctx.stroke();
    }

    // 2. Flowing Water Droplet / Ripple (Water Breathing)
    function drawDroplet(p: Particle) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.1);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.2, p.size * 0.85, p.size * 0.8, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.85, p.size * 0.8, -p.size * 0.7, -p.size * 0.2, 0, -p.size * 1.1);
      ctx.closePath();
      ctx.fill();

      // Liquid reflection highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(-p.size * 0.25, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Electric Diamond Spark (Thunder Breathing)
    function drawSpark(p: Particle) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.25);
      ctx.lineTo(p.size * 0.45, 0);
      ctx.lineTo(0, p.size * 1.25);
      ctx.lineTo(-p.size * 0.45, 0);
      ctx.closePath();
      ctx.fill();

      // Core electric glow
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Soft Butterfly Wing Flake (Insect Breathing)
    function drawButterfly(p: Particle) {
      if (!ctx) return;
      // Dual delicate wing lobes
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.4, -p.size * 0.2, p.size * 0.65, p.size * 0.4, -0.3, 0, Math.PI * 2);
      ctx.ellipse(p.size * 0.4, -p.size * 0.2, p.size * 0.65, p.size * 0.4, 0.3, 0, Math.PI * 2);
      ctx.ellipse(-p.size * 0.35, p.size * 0.4, p.size * 0.45, p.size * 0.3, -0.2, 0, Math.PI * 2);
      ctx.ellipse(p.size * 0.35, p.size * 0.4, p.size * 0.45, p.size * 0.3, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Sakura / Rose Petal with Notched Tip (Flower Breathing)
    function drawPetal(p: Particle) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.9);
      // Sakura notched petal tip
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.65, p.size * 0.75, p.size * 0.4, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.4, -p.size * 0.6, -p.size * 0.65, 0, -p.size * 0.9);
      ctx.closePath();
      ctx.fill();

      // Soft petal ridge
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.5);
      ctx.lineTo(0, p.size * 0.7);
      ctx.stroke();
    }

    let time = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * 1.2 + p.phase) * p.swayAmp;
        p.angle += p.spin;

        // Reset when drifted off viewport
        if (p.y > H + 40 || p.x < -40 || p.x > W + 40) {
          particles[i] = createParticle(true);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        switch (p.shape) {
          case "droplet":
            drawDroplet(p);
            break;
          case "spark":
            drawSpark(p);
            break;
          case "butterfly":
            drawButterfly(p);
            break;
          case "petal":
            drawPetal(p);
            break;
          case "leaf":
          default:
            drawLeaf(p);
            break;
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", mediaListener);
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
