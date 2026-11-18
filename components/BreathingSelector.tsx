"use client";

import { useEffect, useRef, useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useBreathingStyle } from "@/components/BreathingContext";
import { BreathingStyle, BreathingStyleId } from "@/lib/breathingStyles";

export function BreathingSelector() {
  const { currentStyle, setStyleId, availableStyles } = useBreathingStyle();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const shouldReduce = useReducedMotion();

  // Close on outside click or touch
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Sync focused index with active style on open
  useEffect(() => {
    if (isOpen) {
      const idx = availableStyles.findIndex((s) => s.id === currentStyle.id);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, currentStyle.id, availableStyles]);

  // Focus the active option DOM element when focusedIndex changes
  useEffect(() => {
    if (isOpen && listboxRef.current && focusedIndex >= 0) {
      const items = listboxRef.current.querySelectorAll<HTMLLIElement>('[role="option"]');
      if (items[focusedIndex]) {
        items[focusedIndex].focus();
      }
    }
  }, [isOpen, focusedIndex]);

  // Keyboard navigation on trigger button
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Keyboard navigation inside listbox
  const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % availableStyles.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + availableStyles.length) % availableStyles.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusedIndex(availableStyles.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < availableStyles.length) {
        selectStyle(availableStyles[focusedIndex].id);
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  const selectStyle = (id: BreathingStyleId) => {
    setStyleId(id);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id="breathing-style-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`Breathing Style Selector. Current style: ${currentStyle.name}. Click to change theme`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="group flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-surface/90 hover:bg-surface-2 border border-crimson/35 hover:border-crimson-lt shadow-[0_2px_14px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt text-ivory text-xs font-sans tracking-wide"
      >
        {/* Style kanji / element badge with dynamic glowing aura */}
        <span
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[0.65rem] sm:text-xs font-serif font-bold text-white shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: currentStyle.swatchGradient,
            boxShadow: `0 0 10px ${currentStyle.colors.glow}`,
          }}
          aria-hidden="true"
        >
          {currentStyle.kanji}
        </span>

        {/* Clear BREATHING STYLE label & selected form name */}
        <div className="flex items-center gap-1.5 font-display tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[0.74rem] sm:text-[0.8rem]">
          <span className="text-muted text-[0.68rem] hidden sm:inline opacity-80">BREATHING:</span>
          <span className="text-ivory font-medium hidden md:inline">{currentStyle.name}</span>
          <span className="text-ivory font-medium md:hidden">{currentStyle.shortName} Form</span>
        </div>

        {/* Chevron Icon */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.2 }}
          className="text-[0.65rem] text-soft group-hover:text-ivory ml-0.5"
          aria-hidden="true"
        >
          ▼
        </motion.span>
      </button>

      {/* Accessible Dropdown Listbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: shouldReduce ? 0 : 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-84 max-w-[350px] z-50 rounded-2xl bg-surface/95 border border-crimson/35 shadow-[0_16px_40px_rgba(0,0,0,0.88)] backdrop-blur-xl p-2.5 overflow-hidden"
          >
            {/* Header label inside dropdown */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1 text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              <span>BREATHING STYLE / 呼吸法</span>
              <span className="text-[0.62rem] text-crimson-lt font-mono">5 Styles</span>
            </div>

            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label="Breathing Style selection"
              tabIndex={-1}
              onKeyDown={handleListboxKeyDown}
              className="space-y-1 outline-none list-none"
            >
              {availableStyles.map((style: BreathingStyle, idx: number) => {
                const isSelected = style.id === currentStyle.id;
                const isFocused = idx === focusedIndex;

                return (
                  <li
                    key={style.id}
                    role="option"
                    id={`breathing-option-${style.id}`}
                    aria-selected={isSelected}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => selectStyle(style.id)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`group relative flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 outline-none select-none min-h-[48px] ${
                      isSelected
                        ? "bg-surface-2 border border-crimson/35"
                        : isFocused
                        ? "bg-surface-2/60 border border-transparent"
                        : "hover:bg-surface-2/40 border border-transparent"
                    }`}
                  >
                    {/* Visual Element Swatch Badge with Japanese Kanji */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-serif font-bold text-white shadow-md flex-shrink-0 transition-transform duration-200 group-hover:scale-105 mt-0.5"
                      style={{
                        background: style.swatchGradient,
                        boxShadow: isSelected ? `0 0 12px ${style.colors.glow}` : "none",
                      }}
                      aria-hidden="true"
                    >
                      {style.kanji}
                    </div>

                    {/* Style Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-sans text-[0.82rem] font-semibold tracking-wide transition-colors ${
                            isSelected ? "text-ivory" : "text-soft group-hover:text-ivory"
                          }`}
                        >
                          {style.name}
                        </span>

                        {/* Active Indicator Checkmark */}
                        {isSelected && (
                          <span
                            className="text-xs text-crimson-lt font-bold flex-shrink-0 drop-shadow-[0_0_6px_currentColor]"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Accent Description matching user prompt */}
                      <p className="text-[0.72rem] text-muted leading-tight mt-0.5 line-clamp-2">
                        {style.accentLabel}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
