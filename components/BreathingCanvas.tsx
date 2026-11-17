"use client";

import { useEffect, useRef } from "react";
import { useBreathingStyle } from "@/components/BreathingContext";

interface FlameParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  coreColor: string;
  type: "droplet" | "spark";
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  phase: number;
  angle: number;
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
  rootX: number;
  rootY: number;
}

interface ThunderSpark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
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

    // ── 1. FLAME: Glowing fire droplets & ember sparks drifting upward diagonally ──
    const flameParticles: FlameParticle[] = [];
    const FLAME_COUNT = 58;

    function createFlameParticle(init = false): FlameParticle {
      // Spawn mostly around the outer edges (left margin, bottom edge, right margin)
      const rand = Math.random();
      let x = 0;
      let y = 0;

      if (rand < 0.65) {
        // Left margin where flame trails sweep
        x = Math.random() * Math.min(W * 0.35, 420);
        y = init ? Math.random() * H : H - Math.random() * 120;
      } else if (rand < 0.85) {
        // Bottom edge
        x = Math.random() * W;
        y = init ? Math.random() * H : H - Math.random() * 60;
      } else {
        // Right margin
        x = W - Math.random() * Math.min(W * 0.28, 340);
        y = init ? Math.random() * H : H - Math.random() * 100;
      }

      const isDroplet = Math.random() < 0.45;
      const emberColors = ["#ff5500", "#ffaa00", "#ff7700", "#e63946", "#ffd700"];
      const color = emberColors[Math.floor(Math.random() * emberColors.length)];

      return {
        x,
        y,
        size: isDroplet ? 2.0 + Math.random() * 2.4 : 1.1 + Math.random() * 1.5,
        speedY: -(0.7 + Math.random() * 1.3) * (isReduced ? 0.15 : 1),
        // Gentle diagonal drift to the right
        speedX: (0.2 + Math.random() * 0.5) * (isReduced ? 0.15 : 1),
        color,
        coreColor: isDroplet ? "rgba(255, 245, 200, 0.95)" : "#ffffff",
        type: isDroplet ? "droplet" : "spark",
        opacity: 0.1,
        maxOpacity: isDroplet ? 0.65 + Math.random() * 0.3 : 0.5 + Math.random() * 0.45,
        life: 0,
        maxLife: 150 + Math.random() * 180,
        phase: Math.random() * Math.PI * 2,
        angle: (Math.random() - 0.5) * 0.4,
      };
    }

    for (let i = 0; i < FLAME_COUNT; i++) flameParticles.push(createFlameParticle(true));

    // ── 2. WATER: Floating water droplets & gentle low waves along bottom edge ──
    const droplets: WaterDroplet[] = [];
    const DROPLET_COUNT = 44;
    const ripples: WaterRipple[] = [];
    let rippleTimer = 0;

    function createDroplet(init = false): WaterDroplet {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : Math.random() * H,
        size: 1.8 + Math.random() * 2.6,
        speedY: (0.12 + Math.random() * 0.25) * (isReduced ? 0.1 : 1),
        speedX: (Math.random() - 0.5) * 0.18 * (isReduced ? 0.1 : 1),
        opacity: 0.3 + Math.random() * 0.4,
        bobPhase: Math.random() * Math.PI * 2,
      };
    }

    for (let i = 0; i < DROPLET_COUNT; i++) droplets.push(createDroplet(true));

    // ── 3. THUNDER: Visible storm clouds & vivid yellow branching lightning ──
    let lightning: LightningBranch | null = null;
    let lightningCooldown = 260 + Math.random() * 140; // 5.0 to 7.5 seconds
    const thunderSparks: ThunderSpark[] = [];
    const THUNDER_SPARK_COUNT = 18;

    function createLightning(): LightningBranch {
      // Lightning originates directly from the storm clouds near the top-right
      const rootX = W - 40 - Math.random() * Math.min(W * 0.25, 300);
      const rootY = 20 + Math.random() * 40;
      const points = [{ x: rootX, y: rootY }];
      let cx = rootX;
      let cy = rootY;

      const segments = 14 + Math.floor(Math.random() * 6);
      const dy = (H * 0.62) / segments;

      for (let i = 0; i < segments; i++) {
        cx += (Math.random() - 0.52) * 32;
        cy += dy * (0.85 + Math.random() * 0.35);
        points.push({ x: cx, y: cy });
      }

      // 2-3 vivid sub-branches
      const subBranches: { x: number; y: number }[][] = [];
      const branchIndices = [4, 8, 11];
      for (const idx of branchIndices) {
        if (idx < points.length) {
          const root = points[idx];
          const b = [{ x: root.x, y: root.y }];
          let bx = root.x;
          let by = root.y;
          const branchLen = 3 + Math.floor(Math.random() * 2);
          for (let j = 0; j < branchLen; j++) {
            bx += (Math.random() - 0.45) * 26;
            by += dy * 0.65;
            b.push({ x: bx, y: by });
          }
          subBranches.push(b);
        }
      }

      return {
        points,
        subBranches,
        alpha: 0,
        maxAlpha: 0.95,
        phase: "in",
        timer: 0,
        rootX,
        rootY,
      };
    }

    function createThunderSpark(): ThunderSpark {
      return {
        x: W - Math.random() * Math.min(W * 0.38, 440),
        y: Math.random() * H,
        size: 1.2 + Math.random() * 1.8,
        speedY: -(0.4 + Math.random() * 0.8) * (isReduced ? 0.15 : 1),
        speedX: (Math.random() - 0.5) * 0.3 * (isReduced ? 0.15 : 1),
        color: Math.random() < 0.6 ? "#ffd700" : "#ffe600",
        opacity: 0.3 + Math.random() * 0.5,
        life: 0,
        maxLife: 100 + Math.random() * 120,
      };
    }

    for (let i = 0; i < THUNDER_SPARK_COUNT; i++) thunderSparks.push(createThunderSpark());

    // ── 4. INSECT: Delicate butterflies & glowing pollen ──
    const butterflies: Butterfly[] = [];
    const BUTTERFLY_COUNT = 3;
    const pollen: PollenParticle[] = [];
    const POLLEN_COUNT = 24;

    function createButterfly(randY = false): Butterfly {
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

    // ── 5. FLOWER: Rose petals drifting gently across edges ──
    const petals: RosePetal[] = [];
    const PETAL_COUNT = 16;

    function createPetal(randY = false): RosePetal {
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
        speedX: (-0.3 - Math.random() * 0.5) * (isReduced ? 0.15 : 1),
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

    // ── Butterfly Drawing ──
    function drawDelicateButterfly(b: Butterfly) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(b.x, b.y);

      const wingScale = Math.cos(b.wingAngle);
      const s = b.size;

      ctx.save();
      ctx.scale(wingScale, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.7, -s * 0.9, -s * 0.2);
      ctx.bezierCurveTo(-s * 0.8, 0, -s * 0.4, s * 0.1, 0, 0);
      ctx.fillStyle = "rgba(186, 104, 200, 0.75)";
      ctx.shadowColor = "#e1bee7";
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.5, s * 0.2, -s * 0.7, s * 0.6, -s * 0.4, s * 0.7);
      ctx.bezierCurveTo(-s * 0.2, s * 0.8, -s * 0.1, s * 0.4, 0, 0);
      ctx.fillStyle = "rgba(142, 36, 170, 0.7)";
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.scale(-wingScale, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.7, -s * 0.9, -s * 0.2);
      ctx.bezierCurveTo(-s * 0.8, 0, -s * 0.4, s * 0.1, 0, 0);
      ctx.fillStyle = "rgba(186, 104, 200, 0.75)";
      ctx.shadowColor = "#e1bee7";
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.5, s * 0.2, -s * 0.7, s * 0.6, -s * 0.4, s * 0.7);
      ctx.bezierCurveTo(-s * 0.2, s * 0.8, -s * 0.1, s * 0.4, 0, 0);
      ctx.fillStyle = "rgba(142, 36, 170, 0.7)";
      ctx.fill();
      ctx.restore();

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

      // ══════════════════════════════════════════════════════════
      // 1. FLAME: Glowing fire droplets & ember sparks drifting diagonally
      // ══════════════════════════════════════════════════════════
      if (styleId === "flame") {
        for (let i = 0; i < flameParticles.length; i++) {
          const p = flameParticles[i];
          p.y += p.speedY;
          // Drift diagonally with gentle wave sway
          p.x += p.speedX + Math.sin(time * 2.2 + p.phase) * 0.28;
          p.life++;

          const progress = p.life / p.maxLife;
          if (progress < 0.18) {
            p.opacity = (progress / 0.18) * p.maxOpacity;
          } else {
            p.opacity = (1 - (progress - 0.18) / 0.82) * p.maxOpacity;
          }

          // Flicker pulse
          const flicker = 0.85 + 0.15 * Math.sin(time * 4 + p.phase);
          const currentAlpha = Math.max(0, p.opacity * flicker);

          if (p.life >= p.maxLife || p.y < -20 || p.x > W + 20) {
            flameParticles[i] = createFlameParticle(false);
            continue;
          }

          ctx.save();
          if (p.type === "droplet") {
            // Teardrop / small glowing fire droplet
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);

            // Outer radiant flame aura
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.7, p.size * 1.15, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentAlpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 7;
            ctx.fill();

            // Hot inner droplet core
            ctx.beginPath();
            ctx.ellipse(0, -p.size * 0.2, p.size * 0.35, p.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.coreColor;
            ctx.globalAlpha = Math.min(1, currentAlpha * 1.25);
            ctx.fill();
          } else {
            // Sharp pinpoint ember spark
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentAlpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 5;
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // ══════════════════════════════════════════════════════════
      // 2. WATER: Floating water droplets & subtle low waves along bottom edge
      // ══════════════════════════════════════════════════════════
      else if (styleId === "water") {
        // Subtle, low waves along the bottom edge (strictly in the bottom 32-38px)
        const waveBaseHeight = isReduced ? 20 : 28;
        const waveY = H - waveBaseHeight;

        // Wave Layer 1: Deep ocean navy ribbon
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 16) {
          const y = isReduced
            ? waveY
            : waveY + Math.sin(time * 0.8 + x * 0.007) * 5 + Math.cos(time * 0.5 + x * 0.015) * 3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 78, 124, 0.32)";
        ctx.fill();

        // Wave Layer 2: Flowing cyan crest ribbon
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 16) {
          const y = isReduced
            ? waveY + 4
            : waveY + 5 + Math.sin(time * 1.05 + x * 0.009 + 2) * 5 + Math.cos(time * 0.65 + x * 0.018) * 3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 180, 216, 0.22)";
        ctx.fill();

        // Shimmering foam line along the wave crest
        if (!isReduced) {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 20) {
            const y = waveY + Math.sin(time * 0.8 + x * 0.007) * 5 + Math.cos(time * 0.5 + x * 0.015) * 3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "rgba(144, 224, 239, 0.38)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();

        // Soft expanding ripples
        rippleTimer++;
        if (rippleTimer > (isReduced ? 220 : 100)) {
          rippleTimer = 0;
          ripples.push({
            x: Math.random() < 0.5 ? Math.random() * (W * 0.4) : Math.random() * W,
            y: H * 0.45 + Math.random() * (H * 0.45),
            radius: 3,
            maxRadius: 42 + Math.random() * 26,
            opacity: 0.35,
            speed: isReduced ? 0.2 : 0.65,
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
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.38, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 180, 216, " + r.opacity + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // Floating water droplets across background
        for (let i = 0; i < droplets.length; i++) {
          const d = droplets[i];
          d.y += d.speedY;
          d.x += d.speedX;
          const bob = isReduced ? 0 : Math.sin(time * 1.3 + d.bobPhase) * 0.65;

          if (d.y > H + 15) {
            d.y = -10;
            d.x = Math.random() * W;
          }

          ctx.save();
          ctx.translate(d.x, d.y + bob);

          // Translucent liquid sphere
          ctx.beginPath();
          ctx.arc(0, 0, d.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 180, 216, " + d.opacity * 0.28 + ")";
          ctx.fill();

          ctx.strokeStyle = "rgba(144, 224, 239, " + d.opacity * 0.6 + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Specular highlight dot
          ctx.beginPath();
          ctx.arc(-d.size * 0.32, -d.size * 0.32, d.size * 0.24, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, " + d.opacity * 0.85 + ")";
          ctx.fill();

          ctx.restore();
        }
      }

      // ══════════════════════════════════════════════════════════
      // 3. THUNDER: Visible outer storm clouds & vivid yellow branching lightning
      // ══════════════════════════════════════════════════════════
      else if (styleId === "thunder") {
        // Atmospheric cloud depth puffs near top-right outer edge
        ctx.save();
        const cloudGrad = ctx.createRadialGradient(W * 0.88, 70, 20, W * 0.88, 70, 240);
        cloudGrad.addColorStop(0, "rgba(24, 26, 46, 0.45)");
        cloudGrad.addColorStop(0.55, "rgba(14, 15, 28, 0.3)");
        cloudGrad.addColorStop(1, "transparent");
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(W * 0.88, 70, 240, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Occasional, elegant lightning from those clouds (strictly non-flashing)
        if (!isReduced) {
          lightningCooldown--;
          if (lightningCooldown <= 0 && !lightning) {
            lightning = createLightning();
            lightningCooldown = 300 + Math.random() * 150; // 5 to 7.5 seconds
          }
        }

        if (lightning) {
          const l = lightning;
          if (l.phase === "in") {
            l.alpha += 0.08;
            if (l.alpha >= l.maxAlpha) {
              l.alpha = l.maxAlpha;
              l.phase = "hold";
              l.timer = 7; // brief hold (~110ms)
            }
          } else if (l.phase === "hold") {
            l.timer--;
            if (l.timer <= 0) l.phase = "out";
          } else if (l.phase === "out") {
            l.alpha -= 0.03;
            if (l.alpha <= 0) {
              l.alpha = 0;
              lightning = null;
            }
          }

          if (lightning) {
            ctx.save();

            // Soft golden ambient glow blooming within the storm cloud
            const glow = ctx.createRadialGradient(l.rootX, l.rootY + 50, 10, l.rootX, l.rootY + 50, 180);
            glow.addColorStop(0, "rgba(255, 215, 0, " + l.alpha * 0.28 + ")");
            glow.addColorStop(0.6, "rgba(184, 134, 11, " + l.alpha * 0.12 + ")");
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(l.rootX, l.rootY + 50, 180, 0, Math.PI * 2);
            ctx.fill();

            // Vivid electric yellow main lightning bolt
            ctx.beginPath();
            ctx.moveTo(l.points[0].x, l.points[0].y);
            for (let i = 1; i < l.points.length; i++) {
              ctx.lineTo(l.points[i].x, l.points[i].y);
            }
            ctx.strokeStyle = "rgba(255, 215, 0, " + l.alpha + ")";
            ctx.lineWidth = 2.8;
            ctx.shadowColor = "#ffe600";
            ctx.shadowBlur = 14;
            ctx.stroke();

            // Intense white-yellow lightning core highlight
            ctx.strokeStyle = "rgba(255, 255, 255, " + l.alpha * 0.95 + ")";
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Vivid sub-branches spreading from the clouds
            for (const b of l.subBranches) {
              ctx.beginPath();
              ctx.moveTo(b[0].x, b[0].y);
              for (let j = 1; j < b.length; j++) {
                ctx.lineTo(b[j].x, b[j].y);
              }
              ctx.strokeStyle = "rgba(255, 230, 0, " + l.alpha * 0.8 + ")";
              ctx.lineWidth = 1.4;
              ctx.shadowColor = "#ffd700";
              ctx.shadowBlur = 8;
              ctx.stroke();
            }

            ctx.restore();
          }
        }

        // Subtle electric static sparks near clouds
        for (let i = 0; i < thunderSparks.length; i++) {
          const s = thunderSparks[i];
          s.y += s.speedY;
          s.x += s.speedX + (Math.random() - 0.5) * (isReduced ? 0.1 : 0.6);
          s.life++;

          const progress = s.life / s.maxLife;
          const currentAlpha = Math.max(0, (1 - progress) * s.opacity);

          if (s.life >= s.maxLife || s.y < -15) {
            thunderSparks[i] = createThunderSpark();
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = currentAlpha;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }
      }

      // ══════════════════════════════════════════════════════════
      // 4. INSECT: Butterflies & drifting pollen (Preserved)
      // ══════════════════════════════════════════════════════════
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

      // ══════════════════════════════════════════════════════════
      // 5. FLOWER: Falling petals (Preserved)
      // ══════════════════════════════════════════════════════════
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
