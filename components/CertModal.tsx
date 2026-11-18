"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface CertModalProps {
  file: string | null;
  name: string;
  onClose: () => void;
}

export function CertModal({ file, name, onClose }: CertModalProps) {
  const shouldReduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Focus close button when opened
  useEffect(() => {
    if (file) {
      setTimeout(() => closeRef.current?.focus(), 60);
    }
  }, [file]);

  // Keyboard trap + Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!file) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [file, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when open
  useEffect(() => {
    if (file) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [file]);

  if (!mounted) return null;

  const isImage = file?.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  const src = file ? `/certificates/${file}` : "";

  return createPortal(
    <AnimatePresence>
      {file && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduce ? {} : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${name}`}
          ref={dialogRef}
        >
          {/* Backdrop with heavy blur and dark overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-surface border border-crimson/30 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
            style={{ maxHeight: "90vh" }}
            initial={shouldReduce ? {} : { scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={shouldReduce ? {} : { scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-crimson/20 bg-surface-2/60 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-3">
                <span className="text-crimson-lt text-sm" aria-hidden="true">📜</span>
                <p className="text-ivory text-xs sm:text-sm font-medium truncate">
                  {name}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-crimson-lt hover:text-ivory transition-colors duration-150 px-3 py-1.5 border border-crimson/30 rounded-md hover:border-crimson-lt hover:bg-crimson/10 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt flex items-center gap-1"
                >
                  <span>Open</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-ivory hover:bg-surface-2 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
                  aria-label="Close certificate viewer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto min-h-0 bg-bg/60">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={name}
                  className="w-full h-auto object-contain max-h-[75vh]"
                />
              ) : isMobile ? (
                /* Mobile optimized PDF preview card */
                <div className="p-6 sm:p-8 flex flex-col items-center text-center max-w-md mx-auto my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-crimson/10 border border-crimson/30 flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(229,57,53,0.2)]">
                    📜
                  </div>
                  <span className="text-[0.68rem] tracking-[0.16em] uppercase text-crimson-lt font-semibold mb-2 px-2.5 py-0.5 rounded-full bg-crimson/10 border border-crimson/20">
                    Verified Credential Document
                  </span>
                  <h3 className="text-ivory font-display text-lg sm:text-xl font-medium leading-snug mb-3">
                    {name}
                  </h3>
                  <p className="text-soft text-xs mb-6 leading-relaxed">
                    Mobile browsers display PDF documents best with their native high-definition reader, featuring pinch-to-zoom and full document verification.
                  </p>

                  <div className="w-full flex flex-col gap-2.5">
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-lg bg-crimson hover:bg-crimson-lt text-ivory font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,57,53,0.35)] active:scale-[0.98]"
                    >
                      <span>View Full Certificate (PDF)</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href={src}
                      download
                      className="w-full py-2.5 px-4 rounded-lg bg-surface-2 border border-crimson/20 hover:border-crimson/40 text-muted hover:text-ivory text-xs transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <span>Download PDF</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={src}
                  title={name}
                  className="w-full border-0"
                  style={{ height: "75vh" }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
