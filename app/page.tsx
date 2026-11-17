"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BreathingProvider, useBreathingStyle } from "@/components/BreathingContext";
import { BreathingBackgroundLayer } from "@/components/BreathingBackgroundLayer";
import { BreathingCanvas } from "@/components/BreathingCanvas";
import { BreathingSeigaiha } from "@/components/BreathingSeigaiha";
import { BottomNav } from "@/components/BottomNav";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ConnectSection } from "@/components/ConnectSection";
import { LandingIntro } from "@/components/LandingIntro";

function PortfolioApp() {
  const [showIntro, setShowIntro] = useState(true);
  const { currentStyle } = useBreathingStyle();

  return (
    <div
      data-breath={currentStyle.id}
      className="relative min-h-screen bg-bg selection:bg-crimson selection:text-ivory overflow-x-hidden transition-colors duration-700"
    >
      {/* ── 5 Separate Full-Screen Background Designs derived directly from the Reference Panels ── */}
      <BreathingBackgroundLayer />

      {/* ── Subtle Traditional Japanese Seigaiha wave pattern overlay ── */}
      <BreathingSeigaiha />

      {/* ── Dynamic Breathing Style Canvas Particles (sparks, droplets, ripples, lightning, butterflies, petals) ── */}
      <BreathingCanvas />

      {/* ── Fullscreen Cinematic Landing Intro ── */}
      <AnimatePresence>
        {showIntro && (
          <LandingIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* ── Main Portfolio Experience (Reveals after Intro) ── */}
      {!showIntro && (
        <motion.div
          key="portfolio-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fixed Header (wordmark + Breathing Style selector in top-right) & Bottom Nav */}
          <BottomNav />

          {/* Main Sections (strictly above background effects at z-10) */}
          <main className="relative z-10 pb-20">
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            <CertificatesSection />
            <ConnectSection />
          </main>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <BreathingProvider>
      <PortfolioApp />
    </BreathingProvider>
  );
}
