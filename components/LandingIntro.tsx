"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BreathingSelector } from "@/components/BreathingSelector";

interface LandingIntroProps {
  onComplete: () => void;
}

export function LandingIntro({ onComplete }: LandingIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with sound enabled
    video.muted = false;

    // Attempt to play with music
    video.play().catch(() => {
      // If browser Autoplay policy blocks audio before interaction,
      // start muted and unmute immediately on the user's first click/touch
      video.muted = true;
      video.play().catch(() => {});

      const enableAudioOnGesture = () => {
        if (video) {
          video.muted = false;
        }
        window.removeEventListener("click", enableAudioOnGesture);
        window.removeEventListener("keydown", enableAudioOnGesture);
        window.removeEventListener("touchstart", enableAudioOnGesture);
      };

      window.addEventListener("click", enableAudioOnGesture, { once: true });
      window.addEventListener("keydown", enableAudioOnGesture, { once: true });
      window.addEventListener("touchstart", enableAudioOnGesture, { once: true });
    });

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  // Optional keyboard skip (Escape / Space / Enter) without any visual buttons
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
      onClick={onComplete}
      title="Click anywhere to enter portfolio"
    >
      {/* Top-Right Breathing Style Selector */}
      <div
        className="absolute top-3 right-3 sm:top-5 sm:right-6 z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <BreathingSelector />
      </div>

      {/* Fullscreen Video */}
      <video
        ref={videoRef}
        src="/videos/landing.mp4"
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Subtle cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.72) 100%)",
        }}
      />

      {/* Sleek bottom breathing progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 pointer-events-none z-20">
        <div
          className="h-full transition-all duration-100 ease-linear"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, var(--breath-primary, #8b0000), var(--breath-primary-lt, #c0392b), var(--breath-accent, #ff7700))",
            boxShadow: "0 0 10px var(--breath-glow, rgba(192,57,43,0.9))",
          }}
        />
      </div>
    </motion.div>
  );
}
