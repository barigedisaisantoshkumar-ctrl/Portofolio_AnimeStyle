"use client";

import { motion, useReducedMotion } from "motion/react";

/** Animated brushstroke blob using Motion + CSS — no framer-motion parallax, just gentle float */
export function BrushBlob({
  position,
  delay = 0,
}: {
  position: "tl" | "br";
  delay?: number;
}) {
  const shouldReduce = useReducedMotion();

  const isTL = position === "tl";

  const baseClass = isTL
    ? "absolute -top-16 -left-16 w-[min(45vw,440px)]"
    : "absolute -bottom-4 -right-16 w-[min(45vw,450px)]";

  return (
    <motion.svg
      className={`${baseClass} pointer-events-none opacity-60`}
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
      animate={shouldReduce ? {} : {
        y: [0, isTL ? -8 : 6, 0],
        scale: [1, 1.015, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <ellipse
        cx={isTL ? 80 : 320} cy={isTL ? 60 : 240}
        rx={isTL ? 180 : 200} ry={isTL ? 80 : 90}
        fill="#6b0a0a"
        transform={isTL ? "rotate(-25 80 60)" : "rotate(15 320 240)"}
      />
      <ellipse
        cx={isTL ? 140 : 380} cy={isTL ? 90 : 200}
        rx={isTL ? 130 : 150} ry={isTL ? 55 : 60}
        fill="#8b0000" opacity={0.6}
        transform={isTL ? "rotate(-20 140 90)" : "rotate(20 380 200)"}
      />
      <ellipse
        cx={isTL ? 60 : 280} cy={isTL ? 40 : 260}
        rx={isTL ? 90 : 100} ry={isTL ? 30 : 40}
        fill="#3a0505"
        transform={isTL ? "rotate(-30 60 40)" : "rotate(10 280 260)"}
      />
    </motion.svg>
  );
}

