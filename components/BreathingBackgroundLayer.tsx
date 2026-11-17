"use client";

import { useReducedMotion } from "motion/react";
import { useBreathingStyle } from "@/components/BreathingContext";
import { BreathingStyleId } from "@/lib/breathingStyles";

const BACKGROUND_IMAGES: Record<
  BreathingStyleId,
  { desktop: string; mobile: string }
> = {
  flame: {
    desktop: "/images/breathing/bg-flame.webp",
    mobile: "/images/breathing/bg-flame-mobile.webp",
  },
  water: {
    desktop: "/images/breathing/bg-water.webp",
    mobile: "/images/breathing/bg-water-mobile.webp",
  },
  thunder: {
    desktop: "/images/breathing/bg-thunder.webp",
    mobile: "/images/breathing/bg-thunder-mobile.webp",
  },
  insect: {
    desktop: "/images/breathing/bg-insect.webp",
    mobile: "/images/breathing/bg-insect-mobile.webp",
  },
  flower: {
    desktop: "/images/breathing/bg-flower.webp",
    mobile: "/images/breathing/bg-flower-mobile.webp",
  },
};

const STYLES_ORDER: BreathingStyleId[] = ["flame", "water", "thunder", "insect", "flower"];

export function BreathingBackgroundLayer() {
  const { currentStyle } = useBreathingStyle();
  const shouldReduce = useReducedMotion();

  const transitionClass = shouldReduce
    ? ""
    : "transition-opacity duration-700 ease-in-out";

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-bg"
      aria-hidden="true"
    >
      {/* 5 Distinct Full-Screen Painterly Backgrounds derived from the 5 Reference Panels */}
      {STYLES_ORDER.map((styleId) => {
        const isActive = currentStyle.id === styleId;
        const img = BACKGROUND_IMAGES[styleId];

        return (
          <div
            key={styleId}
            className={`absolute inset-0 ${transitionClass}`}
            style={{
              opacity: isActive ? 1 : 0,
              willChange: "opacity",
            }}
          >
            {/* Desktop Background (1920x1080 widescreen) */}
            <div
              className="hidden sm:block absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${img.desktop}')` }}
            />

            {/* Mobile Background (750x1334 portrait with edge framing) */}
            <div
              className="sm:hidden absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${img.mobile}')` }}
            />
          </div>
        );
      })}

      {/* Protected Central Content Vignette (guarantees text remains 100% crisp, dark & readable) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 100%)",
        }}
      />

      {/* Ambient Depth Vignette from top & bottom edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-transparent to-bg/90 pointer-events-none" />
    </div>
  );
}
