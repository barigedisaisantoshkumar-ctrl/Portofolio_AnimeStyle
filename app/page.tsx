"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrushBlob } from "@/components/BrushBlob";
import { LeavesCanvas } from "@/components/LeavesCanvas";
import { BottomNav } from "@/components/BottomNav";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ConnectSection } from "@/components/ConnectSection";
import { LandingIntro } from "@/components/LandingIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative min-h-screen bg-bg selection:bg-crimson selection:text-ivory overflow-x-hidden">
      {/* ── Continuous elegant anime falling leaves (persists across intro & portfolio) ── */}
      <LeavesCanvas />

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
          {/* Atmospheric background art & brushstrokes */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {/* Ambient textured clouds layer */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
              style={{ backgroundImage: "url('/images/bg-clouds.jpg')" }}
            />

            {/* Dark vignette gradient for high contrast & readable text */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/70 to-bg pointer-events-none" />

            {/* Crimson Japanese inkwash brush blobs */}
            <BrushBlob position="tl" delay={0} />
            <BrushBlob position="br" delay={2} />
          </div>

          {/* Fixed Header (wordmark slides left -> right) & Bottom Nav (slides up) */}
          <BottomNav />

          {/* Main Sections */}
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
