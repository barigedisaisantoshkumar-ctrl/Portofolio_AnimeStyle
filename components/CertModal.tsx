"use client";

import { useEffect, useCallback, useRef } from "react";
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

  // Focus close button when open
  useEffect(() => {
    if (file) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [file]);

  // Keyboard trap + Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!file) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [file]);

  const isImage = file?.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  const src = file ? `/certificates/${file}` : "";

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduce ? {} : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${name}`}
          ref={dialogRef}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm" aria-hidden="true" />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-surface border border-crimson/20 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "90vh" }}
            initial={shouldReduce ? {} : { scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={shouldReduce ? {} : { scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-crimson/15 flex-shrink-0">
              <p className="text-ivory text-sm font-medium truncate pr-4">{name}</p>
              <div className="flex items-center gap-2">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-crimson-lt hover:text-ivory transition-colors duration-150 px-3 py-1 border border-crimson/30 rounded hover:border-crimson-lt focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
                >
                  Open ↗
                </a>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-ivory hover:bg-surface-2 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
                  aria-label="Close certificate viewer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto min-h-0">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={name}
                  className="w-full h-auto object-contain"
                />
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
    </AnimatePresence>
  );
}

