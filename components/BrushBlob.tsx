"use client";

import { motion, useReducedMotion } from "motion/react";
import { useBreathingStyle } from "@/components/BreathingContext";

/** Animated brushstroke blob using Motion + CSS, dynamically themed by active Breathing Style */
export function BrushBlob({
  position,
  delay = 0,
}: {
  position: "tl" | "br";
  delay?: number;
}) {
  const shouldReduce = useReducedMotion();
  const { currentStyle } = useBreathingStyle();

  const isTL = position === "tl";

  const baseClass = isTL
    ? "absolute -top-16 -left-16 w-[min(45vw,440px)]"
    : "absolute -bottom-4 -right-16 w-[min(45vw,450px)]";

  const transitionStyle = shouldReduce
    ? {}
    : { transition: "fill 0.8s cubic-bezier(0.22, 1, 0.36, 1)" };

  return (
    <motion.svg
      className={`${baseClass} pointer-events-none opacity-60`}
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
      animate={
        shouldReduce
          ? {}
          : {
              y: [0, isTL ? -8 : 6, 0],
              scale: [1, 1.015, 1],
            }
      }
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <ellipse
        cx={isTL ? 80 : 320}
        cy={isTL ? 60 : 240}
        rx={isTL ? 180 : 200}
        ry={isTL ? 80 : 90}
        fill={currentStyle.blobColors.dark}
        style={transitionStyle}
        transform={isTL ? "rotate(-25 80 60)" : "rotate(15 320 240)"}
      />
      <ellipse
        cx={isTL ? 140 : 380}
        cy={isTL ? 90 : 200}
        rx={isTL ? 130 : 150}
        ry={isTL ? 55 : 60}
        fill={currentStyle.blobColors.mid}
        style={transitionStyle}
        opacity={0.6}
        transform={isTL ? "rotate(-20 140 90)" : "rotate(20 380 200)"}
      />
      <ellipse
        cx={isTL ? 60 : 280}
        cy={isTL ? 40 : 260}
        rx={isTL ? 90 : 100}
        ry={isTL ? 30 : 40}
        fill={currentStyle.blobColors.deep}
        style={transitionStyle}
        transform={isTL ? "rotate(-30 60 40)" : "rotate(10 280 260)"}
      />
    </motion.svg>
  );
}
