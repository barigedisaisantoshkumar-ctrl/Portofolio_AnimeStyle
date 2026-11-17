"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BreathingSelector } from "@/components/BreathingSelector";

interface LandingIntroProps {
  onComplete: () => void;
}

export function LandingIntro({ onComplete }: LandingIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Attempt initial playback and handle browser autoplay policy
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;

    // First attempt to play unmuted with audio
    video.muted = false;
    video
      .play()
      .then(() => {
        setIsMuted(false);
      })
      .catch(() => {
        // Browser autoplay policy blocked unmuted audio; start muted and prompt
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });

    // Automatically unmute on any user gesture across the document
    const handleFirstGesture = () => {
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        setIsMuted(false);
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

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
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [onComplete]);

  // Keyboard skip (Escape or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const unmuteAudio = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, []);

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      video.volume = 1.0;
      setIsMuted(nextMuted);
    }
  }, []);

  const handleContainerClick = () => {
    // If muted, clicking anywhere on the video unmutes it immediately
    if (isMuted) {
      unmuteAudio();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
      onClick={handleContainerClick}
      title={isMuted ? "Click to enable sound" : "Video playing"}
    >
      {/* Top Header: Sound Toggle on Left, Breathing Style & Skip on Right */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={toggleSound}
          className="group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-surface/90 hover:bg-surface-2 border border-crimson/35 hover:border-crimson-lt shadow-[0_2px_14px_rgba(0,0,0,0.6)] backdrop-blur-md text-ivory text-xs font-sans tracking-wide cursor-pointer transition-all duration-200"
          aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
        >
          <span className="text-sm drop-shadow-[0_0_6px_currentColor]">
            {isMuted ? "🔇" : "🔊"}
          </span>
          <span className="font-medium text-[0.7rem] sm:text-[0.74rem] uppercase tracking-wider text-soft group-hover:text-ivory">
            {isMuted ? "Sound: Muted (Click)" : "Sound: On"}
          </span>
        </button>
      </div>

      <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <div onClick={(e) => e.stopPropagation()}>
          <BreathingSelector />
        </div>

        {/* Explicit Skip Intro Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-surface/80 hover:bg-surface-2 border border-white/15 hover:border-crimson-lt text-soft hover:text-ivory text-xs tracking-wider uppercase font-sans shadow-md backdrop-blur-md cursor-pointer transition-all duration-200"
          aria-label="Skip intro and enter portfolio"
        >
          <span className="hidden sm:inline">Skip Intro</span>
          <span className="sm:hidden">Skip</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Fullscreen Cinematic Video */}
      <video
        ref={videoRef}
        src="/videos/landing.mp4"
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />

      {/* Prominent Floating "Click for Music" Prompt when Autoplay is Muted */}
      <AnimatePresence>
        {isMuted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-40 pointer-events-auto"
          >
            <motion.button
              type="button"
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                  "0 0 15px rgba(255, 69, 0, 0.4)",
                  "0 0 30px rgba(255, 69, 0, 0.8)",
                  "0 0 15px rgba(255, 69, 0, 0.4)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
              onClick={unmuteAudio}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-crimson hover:bg-crimson-lt text-ivory font-serif text-xs sm:text-sm tracking-[0.14em] uppercase border border-white/25 shadow-2xl backdrop-blur-md flex items-center gap-2.5 cursor-pointer select-none"
            >
              <span className="text-base sm:text-lg animate-pulse">🔊</span>
              <span className="font-bold">Play With Music & Sound</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
            background:
              "linear-gradient(to right, var(--breath-primary, #8b0000), var(--breath-primary-lt, #ff4500), var(--breath-accent, #ffaa00))",
            boxShadow: "0 0 10px var(--breath-glow, rgba(255,69,0,0.9))",
          }}
        />
      </div>
    </motion.div>
  );
}
