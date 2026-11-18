"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface LandingIntroProps {
  onComplete: () => void;
}

export function LandingIntro({ onComplete }: LandingIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt initial playback with audio automatically
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;

    // First attempt to play unmuted with audio automatically
    video.muted = false;
    video
      .play()
      .then(() => {
        // Unmuted playback started successfully
      })
      .catch(() => {
        // If browser autoplay policy blocks unmuted audio before user interaction,
        // start playback smoothly and immediately unmute on the very first gesture
        video.muted = true;
        video.play().catch(() => {});
      });

    // Automatically unmute audio on any user gesture across the document
    const enableAudio = () => {
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener("pointerdown", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
      window.removeEventListener("mousedown", enableAudio);
      window.removeEventListener("keydown", enableAudio);
      window.removeEventListener("wheel", enableAudio);
    };

    window.addEventListener("pointerdown", enableAudio, { once: true, passive: true });
    window.addEventListener("touchstart", enableAudio, { once: true, passive: true });
    window.addEventListener("mousedown", enableAudio, { once: true, passive: true });
    window.addEventListener("keydown", enableAudio, { once: true, passive: true });
    window.addEventListener("wheel", enableAudio, { once: true, passive: true });

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cleanupGestureListeners();
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

  const handleContainerClick = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.muted) {
        video.muted = false;
        video.volume = 1.0;
      }
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
      onClick={handleContainerClick}
    >
      {/* Fullscreen Cinematic Video */}
      <video
        ref={videoRef}
        src="/videos/landing.mp4"
        autoPlay
        playsInline
        preload="auto"
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
    </motion.div>
  );
}
