"use client";

import { useEffect, useRef } from "react";
import { useBreathingStyle } from "@/components/BreathingContext";

interface EmberSpark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
}

interface WaterDroplet {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  bobPhase: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface LightningBranch {
  points: { x: number; y: number }[];
  subBranches: { x: number; y: number }[][];
  alpha: number;
  maxAlpha: number;
  phase: "in" | "hold" | "out" | "dead";
  timer: number;
}

interface Butterfly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  wingAngle: number;
  flapSpeed: number;
  opacity: number;
}

interface PollenParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  phase: number;
}

interface RosePetal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  tilt: number;
  spin: number;
  tiltSpeed: number;
  color: string;
  opacity: number;
  swayAmp: number;
  phase: number;
}

export function BreathingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentStyle } = useBreathingStyle();
  const currentStyleRef = useRef(currentStyle);

  useEffect(() => {
    currentStyleRef.current = currentStyle;
  }, [currentStyle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let rafId = 0;
    let time = 0;

    // Prefers-reduced-motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReduced = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReduced = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── 1. FLAME: Small edge ember sparks ──
    const sparks: EmberSpark[] = [];
    const SPARK_COUNT = 24;

    function createSpark(init = false): EmberSpark {
      // Spawn mostly along left margin (where flame trail is) and bottom edge
      const isLeftEdge = Math.random() < 0.65;
      const x = isLeftEdge
        ? Math.random() * Math.min(W * 0.32, 380)
        : Math.random() * W;
      const y = init
        ? Math.random() * H
        : H - Math.random() * 80;

      const colors = ["#ff5500", "#ffaa00", "#ff7700", "#e63946", "#ffd700"];
      return {
        x,
        y,
        size: 1.2 + Math.random() * 1.5,
        speedY: -(0.5 + Math.random() * 1.1) * (isReduced ? 0.15 : 1),
        speedX: (Math.random() - 0.4) * 0.4 * (isReduced ? 0.15 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1,
        maxOpacity: 0.4 + Math.random() * 0.4,
        life: 0,
        maxLife: 140 + Math.random() * 160,
      };
    }

    for (let i = 0; i < SPARK_COUNT; i++) sparks.push(createSpark(true));

    // ── 2. WATER: Soft ripples & translucent droplets ──
    const droplets: WaterDroplet[] = [];
    const DROPLET_COUNT = 12;
    const ripples: WaterRipple[] = [];
    let rippleTimer = 0;

    function createDroplet(): WaterDroplet {
      // Positioned near left wave or bottom
      const onLeft = Math.random() < 0.6;
      return {
        x: onLeft ? Math.random() * (W * 0.3) : Math.random() * W,
        y: onLeft ? Math.random() * H : H * 0.6 + Math.random() * (H * 0.35),
        size: 2.2 + Math.random() * 2.5,
        speedY: (0.1 + Math.random() * 0.2) * (isReduced ? 0.1 : 1),
        speedX: (Math.random() - 0.5) * 0.15 * (isReduced ? 0.1 : 1),
        opacity: 0.3 + Math.random() * 0.35,
        bobPhase: Math.random() * Math.PI * 2,
      };
    }

    for (let i = 0; i < DROPLET_COUNT; i++) droplets.push(createDroplet());

    // ── 3. THUNDER: Fine, natural gold lightning branches near right edge ──
    let lightning: LightningBranch | null = null;
    let lightningCooldown = 220 + Math.random() * 140; // 4-6s interval

    function createLightning(): LightningBranch {
      // Natural lightning striking along the right edge where stormclouds are
      const startX = W - Math.random() * Math.min(W * 0.28, 350);
      const startY = 10;
      const points = [{ x: startX, y: startY }];
      let cx = startX;
      let cy = startY;

      const segments = 12 + Math.floor(Math.random() * 6);
      const dy = (H * 0.65) / segments;

      for (let i = 0; i < segments; i++) {
        cx += (Math.random() - 0.48) * 28;
        cy += dy * (0.85 + Math.random() * 0.3);
        points.push({ x: cx, y: cy });
      }

      // Fine sub-branches
      const subBranches: { x: number; y: number }[][] = [];
      const branchRoots = [3, 7];
      for (const rootIdx of branchRoots) {
        if (rootIdx < points.length) {
          const root = points[rootIdx];
          const b = [{ x: root.x, y: root.y }];
          let bx = root.x;
          let by = root.y;
          for (let j = 0; j < 3; j++) {
            bx += (Math.random() - 0.45) * 22;
            by += dy * 0.6;
            b.push({ x: bx, y: by });
          }
          subBranches.push(b);
        }
      }

      return {
        points,
        subBranches,
        alpha: 0,
        maxAlpha: 0.75,
        phase: "in",
        timer: 0,
      };
    }

    // ── 4. INSECT: Delicate recognizable butterflies & tiny pollen motes ──
    const butterflies: Butterfly[] = [];
    const BUTTERFLY_COUNT = 3;
    const pollen: PollenParticle[] = [];
    const POLLEN_COUNT = 24;

    function createButterfly(randY = false): Butterfly {
      // Butterfly path along margins (top-left or right edge)
      const isRight = Math.random() < 0.65;
      const x = isRight
        ? W - Math.random() * Math.min(W * 0.35, 360)
        : Math.random() * Math.min(W * 0.35, 360);
      return {
        x,
        y: randY ? Math.random() * H : H + 20,
        size: 7 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 0.5 * (isReduced ? 0.15 : 1),
        speedY: -(0.3 + Math.random() * 0.5) * (isReduced ? 0.15 : 1),
        wingAngle: Math.random() * Math.PI,
        flapSpeed: (0.1 + Math.random() * 0.06) * (isReduced ? 0.15 : 1),
        opacity: 0.6 + Math.random() * 0.3,
      };
    }

    for (let i = 0; i < BUTTERFLY_COUNT; i++) butterflies.push(createButterfly(true));

    function createPollen(): PollenParticle {
      const colors = ["#ba68c8", "#e1bee7", "#ffd700", "#ffffff"];
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        size: 1.0 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.25 * (isReduced ? 0.15 : 1),
        speedY: (Math.random() - 0.5) * 0.25 * (isReduced ? 0.15 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      };
    }

    for (let i = 0; i < POLLEN_COUNT; i++) pollen.push(createPollen());

    // ── 5. FLOWER: A few drifting pink rose / sakura petals ──
    const petals: RosePetal[] = [];
    const PETAL_COUNT = 16;

    function createPetal(randY = false): RosePetal {
      // Spawn near right edge where sakura branches are or top
      const isRight = Math.random() < 0.7;
      const x = isRight
        ? W - Math.random() * Math.min(W * 0.45, 500)
        : Math.random() * W;
      const colors = ["#f06292", "#fbcfe8", "#fda4af", "#ad1457"];
      return {
        x,
        y: randY ? Math.random() * H : -20 - Math.random() * 20,
        size: 5 + Math.random() * 4,
        speedY: (0.5 + Math.random() * 0.8) * (isReduced ? 0.15 : 1),
        speedX: (-0.3 - Math.random() * 0.5) * (isReduced ? 0.15 : 1), // drift gently leftwards
        angle: Math.random() * Math.PI * 2,
        tilt: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.015 * (isReduced ? 0.1 : 1),
        tiltSpeed: (0.015 + Math.random() * 0.02) * (isReduced ? 0.1 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.4 + Math.random() * 0.4,
        swayAmp: (isReduced ? 0.2 : 0.8) + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      };
    }

    for (let i = 0; i < PETAL_COUNT; i++) petals.push(createPetal(true));

    // ── Anatomically Recognizable Delicate Butterfly Drawing ──
    function drawDelicateButterfly(b: Butterfly) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(b.x, b.y);

      const wingScale = Math.cos(b.wingAngle);
      const s = b.size;

      // Forewing & Hindwing (Left side)
      ctx.save();
      ctx.scale(wingScale, 1);

      // Upper Forewing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.7, -s * 0.9, -s * 0.2);
      ctx.bezierCurveTo(-s * 0.8, 0, -s * 0.4, s * 0.1, 0, 0);
      ctx.fillStyle = "rgba(186, 104, 200, 0.75)";
      ctx.shadowColor = "#e1bee7";
      ctx.shadowBlur = 6;
      ctx.fill();

      // Lower Hindwing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.5, s * 0.2, -s * 0.7, s * 0.6, -s * 0.4, s * 0.7);
      ctx.bezierCurveTo(-s * 0.2, s * 0.8, -s * 0.1, s * 0.4, 0, 0);
      ctx.fillStyle = "rgba(142, 36, 170, 0.7)";
      ctx.fill();

      ctx.restore();

      // Forewing & Hindwing (Right side)
      ctx.save();
      ctx.scale(-wingScale, 1);

      // Upper Forewing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.7, -s * 0.9, -s * 0.2);
      ctx.bezierCurveTo(-s * 0.8, 0, -s * 0.4, s * 0.1, 0, 0);
      ctx.fillStyle = "rgba(186, 104, 200, 0.75)";
      ctx.shadowColor = "#e1bee7";
      ctx.shadowBlur = 6;
      ctx.fill();

      // Lower Hindwing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.5, s * 0.2, -s * 0.7, s * 0.6, -s * 0.4, s * 0.7);
      ctx.bezierCurveTo(-s * 0.2, s * 0.8, -s * 0.1, s * 0.4, 0, 0);
      ctx.fillStyle = "rgba(142, 36, 170, 0.7)";
      ctx.fill();

      ctx.restore();

      // Slender butterfly thorax / body
      ctx.beginPath();
      ctx.ellipse(0, 0, 0.9, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();

      ctx.restore();
    }

    // ── Main Render Loop ──
    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      const styleId = currentStyleRef.current.id;

      // 1. FLAME
      if (styleId === "flame") {
        for (let i = 0; i < sparks.length; i++) {
          const s = sparks[i];
          s.y += s.speedY;
          s.x += s.speedX + Math.sin(time * 2 + i) * 0.25;
          s.life++;

          const progress = s.life / s.maxLife;
          if (progress < 0.2) {
            s.opacity = (progress / 0.2) * s.maxOpacity;
          } else {
            s.opacity = (1 - (progress - 0.2) / 0.8) * s.maxOpacity;
          }

          if (s.life >= s.maxLife || s.y < -15) {
            sparks[i] = createSpark(false);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.opacity);
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. WATER
      else if (styleId === "water") {
        rippleTimer++;
        if (rippleTimer > (isReduced ? 220 : 110)) {
          rippleTimer = 0;
          ripples.push({
            x: Math.random() < 0.5 ? Math.random() * (W * 0.35) : Math.random() * W,
            y: H * 0.45 + Math.random() * (H * 0.45),
            radius: 3,
            maxRadius: 45 + Math.random() * 25,
            opacity: 0.35,
            speed: isReduced ? 0.25 : 0.65,
          });
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed;
          r.opacity = (1 - r.radius / r.maxRadius) * 0.35;

          if (r.radius >= r.maxRadius || r.opacity <= 0) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 180, 216, " + r.opacity + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        for (let i = 0; i < droplets.length; i++) {
          const d = droplets[i];
          d.y += d.speedY;
          d.x += d.speedX;
          const bob = Math.sin(time * 1.4 + d.bobPhase) * 0.6;

          if (d.y > H + 15) {
            d.y = -10;
            d.x = Math.random() * (W * 0.35);
          }

          ctx.save();
          ctx.translate(d.x, d.y + bob);
          ctx.beginPath();
          ctx.arc(0, 0, d.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 180, 216, " + d.opacity * 0.25 + ")";
          ctx.fill();
          ctx.strokeStyle = "rgba(144, 224, 239, " + d.opacity * 0.55 + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Highlight
          ctx.beginPath();
          ctx.arc(-d.size * 0.3, -d.size * 0.3, d.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, " + d.opacity * 0.75 + ")";
          ctx.fill();
          ctx.restore();
        }
      }

      // 3. THUNDER
      else if (styleId === "thunder") {
        if (!isReduced) {
          lightningCooldown--;
          if (lightningCooldown <= 0 && !lightning) {
            lightning = createLightning();
            lightningCooldown = 260 + Math.random() * 160;
          }
        }

        if (lightning) {
          const l = lightning;
          if (l.phase === "in") {
            l.alpha += 0.09;
            if (l.alpha >= l.maxAlpha) {
              l.alpha = l.maxAlpha;
              l.phase = "hold";
              l.timer = 10;
            }
          } else if (l.phase === "hold") {
            l.timer--;
            if (l.timer <= 0) l.phase = "out";
          } else if (l.phase === "out") {
            l.alpha -= 0.035;
            if (l.alpha <= 0) {
              l.alpha = 0;
              lightning = null;
            }
          }

          if (lightning) {
            ctx.save();
            // Restrained ambient glow around right edge clouds
            const root = l.points[0];
            const glow = ctx.createRadialGradient(root.x, root.y + 40, 5, root.x, root.y + 40, 140);
            glow.addColorStop(0, "rgba(255, 215, 0, " + l.alpha * 0.22 + ")");
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(root.x, root.y + 40, 140, 0, Math.PI * 2);
            ctx.fill();

            // Natural fine lightning line
            ctx.beginPath();
            ctx.moveTo(l.points[0].x, l.points[0].y);
            for (let i = 1; i < l.points.length; i++) {
              ctx.lineTo(l.points[i].x, l.points[i].y);
            }
            ctx.strokeStyle = "rgba(255, 243, 128, " + l.alpha + ")";
            ctx.lineWidth = 1.4;
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 8;
            ctx.stroke();

            for (const b of l.subBranches) {
              ctx.beginPath();
              ctx.moveTo(b[0].x, b[0].y);
              for (let j = 1; j < b.length; j++) {
                ctx.lineTo(b[j].x, b[j].y);
              }
              ctx.strokeStyle = "rgba(255, 215, 0, " + l.alpha * 0.65 + ")";
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }

      // 4. INSECT
      else if (styleId === "insect") {
        for (let i = 0; i < pollen.length; i++) {
          const pm = pollen[i];
          pm.x += pm.speedX;
          pm.y += pm.speedY;
          const pulse = (Math.sin(time * 1.8 + pm.phase) + 1) * 0.5;

          if (pm.x < -10 || pm.x > W + 10 || pm.y < -10 || pm.y > H + 10) {
            pollen[i] = createPollen();
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(pm.x, pm.y, pm.size, 0, Math.PI * 2);
          ctx.fillStyle = pm.color;
          ctx.globalAlpha = pm.opacity * (0.6 + pulse * 0.4);
          ctx.shadowColor = pm.color;
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        }

        for (let i = 0; i < butterflies.length; i++) {
          const b = butterflies[i];
          b.y += b.speedY;
          b.x += b.speedX + Math.sin(time * 1.2 + i) * 0.6;
          b.wingAngle += b.flapSpeed;

          if (b.y < -30) {
            butterflies[i] = createButterfly(false);
            continue;
          }
          drawDelicateButterfly(b);
        }
      }

      // 5. FLOWER
      else if (styleId === "flower") {
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(time + p.phase) * p.swayAmp;
          p.angle += p.spin;
          p.tilt += p.tiltSpeed;
          const tiltScale = Math.cos(p.tilt);

          if (p.y > H + 25 || p.x < -20) {
            petals[i] = createPetal(false);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(tiltScale, 1);

          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.85);
          ctx.bezierCurveTo(p.size * 0.55, -p.size * 0.6, p.size * 0.7, p.size * 0.35, 0, p.size * 0.9);
          ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.35, -p.size * 0.55, -p.size * 0.6, 0, -p.size * 0.85);
          ctx.closePath();

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowColor = "rgba(240, 98, 146, 0.35)";
          ctx.shadowBlur = 3;
          ctx.fill();
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
