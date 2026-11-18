"use client";

import { useEffect, useState } from "react";

// Nezuko running poses (from nezuko_running_4poses.svg)
const NEZUKO_POSES = [
  "/nezuko/pose_0.webp",
  "/nezuko/pose_1.webp",
  "/nezuko/pose_2.webp",
  "/nezuko/pose_3.webp",
];

// Zenitsu running poses (from zenitsu_running_4poses.svg)
const ZENITSU_POSES = [
  "/zenitsu/pose_0.webp",
  "/zenitsu/pose_1.webp",
  "/zenitsu/pose_2.webp",
  "/zenitsu/pose_3.webp",
];

interface NezukoRunnerProps {
  progress?: number;
  direction?: "right" | "left";
  scrollY?: number;
}

export function NezukoRunner({
  progress: externalProgress,
  direction: externalDirection,
  scrollY: externalScrollY,
}: NezukoRunnerProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalDirection, setInternalDirection] = useState<"right" | "left">("right");
  const [internalScrollY, setInternalScrollY] = useState(0);
  const [winWidth, setWinWidth] = useState(1200);
  const [isMounted, setIsMounted] = useState(false);

  // Preload all 8 running poses on mount
  useEffect(() => {
    setIsMounted(true);
    setWinWidth(window.innerWidth || 1200);

    [...NEZUKO_POSES, ...ZENITSU_POSES].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Internal scroll listener fallback if props are not passed
  useEffect(() => {
    if (externalProgress !== undefined) return;

    let lastY = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / docH));

      setInternalProgress(p);
      setInternalScrollY(y);

      const delta = y - lastY;
      if (Math.abs(delta) >= 1) {
        setInternalDirection(delta > 0 ? "right" : "left");
        lastY = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [externalProgress]);

  if (!isMounted) return null;

  // Active state (prefers props from BottomNav, falls back to internal state)
  const progress = externalProgress !== undefined ? externalProgress : internalProgress;
  const direction = externalDirection !== undefined ? externalDirection : internalDirection;
  const scrollY = externalScrollY !== undefined ? externalScrollY : internalScrollY;

  // Sizing and boundaries
  const isMobile = winWidth < 640;
  const nezukoWidth = isMobile ? 40 : 48;
  const gap = isMobile ? 28 : 40;
  const padding = isMobile ? 12 : 24;

  const totalDuoWidth = nezukoWidth + gap;
  const availableWidth = Math.max(0, winWidth - totalDuoWidth - padding * 2);

  // Position calculations:
  // When scrolling down (direction === "right"):
  //   Nezuko leads forward (right), Zenitsu trails behind (left of Nezuko)
  // When scrolling up (direction === "left"):
  //   Nezuko leads back (left), Zenitsu trails behind (right of Nezuko)
  let nezukoX: number;
  let zenitsuX: number;

  if (direction === "right") {
    nezukoX = padding + gap + progress * availableWidth;
    zenitsuX = nezukoX - gap;
  } else {
    nezukoX = padding + progress * availableWidth;
    zenitsuX = nezukoX + gap;
  }

  // Running pose frame cycling (changes every 30px of scroll)
  const stride = 30;
  const poseIndex = Math.floor(Math.abs(scrollY) / stride) % 4;
  const zenitsuPoseIndex = (poseIndex + 1) % 4;

  return (
    <div
      className="absolute bottom-full left-0 right-0 h-10 sm:h-12 pointer-events-none select-none overflow-visible"
      aria-hidden="true"
    >
      {/* Subtle glowing runner track line right along the navbar's top border */}
      <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-crimson-lt/40 to-transparent pointer-events-none" />

      {/* Zenitsu Runner — Rendered behind Nezuko (z-0), smaller scale, following */}
      <div
        className="absolute bottom-0 left-0 z-0 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${zenitsuX}px, 0, 0)`,
        }}
      >
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-150 ease-out ${
            direction === "left" ? "-scale-x-100" : "scale-x-100"
          }`}
        >
          <img
            key={`zenitsu-${zenitsuPoseIndex}`}
            src={ZENITSU_POSES[zenitsuPoseIndex]}
            alt="Zenitsu running"
            width={615}
            height={615}
            draggable={false}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] select-none pointer-events-none"
          />
        </div>
      </div>

      {/* Nezuko Runner — Rendered in front (z-10), leading the run */}
      <div
        className="absolute bottom-0 left-0 z-10 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${nezukoX}px, 0, 0)`,
        }}
      >
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-150 ease-out ${
            direction === "left" ? "-scale-x-100" : "scale-x-100"
          }`}
        >
          <img
            key={`nezuko-${poseIndex}`}
            src={NEZUKO_POSES[poseIndex]}
            alt="Nezuko running"
            width={615}
            height={615}
            draggable={false}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}