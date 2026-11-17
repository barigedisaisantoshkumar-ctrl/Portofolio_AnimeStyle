"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Gentle fade-and-rise reveal on scroll entry */
export function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger wrapper (clean grid container) */
export function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/** Individual item reveal */
export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
