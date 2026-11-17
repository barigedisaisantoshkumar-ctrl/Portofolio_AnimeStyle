"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  BreathingStyle,
  BreathingStyleId,
  BREATHING_STYLES,
  DEFAULT_BREATHING_STYLE_ID,
  getBreathingStyle,
} from "@/lib/breathingStyles";

interface BreathingContextType {
  currentStyle: BreathingStyle;
  setStyleId: (id: BreathingStyleId) => void;
  availableStyles: BreathingStyle[];
}

const BreathingContext = createContext<BreathingContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_breathing_style";

export function BreathingProvider({ children }: { children: ReactNode }) {
  const [styleId, setStyleIdState] = useState<BreathingStyleId>(DEFAULT_BREATHING_STYLE_ID);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as BreathingStyleId | null;
      if (saved && BREATHING_STYLES.some((s) => s.id === saved)) {
        setStyleIdState(saved);
      }
    } catch {
      // localStorage may fail in restricted/incognito modes
    }
  }, []);

  const currentStyle = getBreathingStyle(styleId);

  // Sync to root element data-breath and update CSS variables for smooth transition
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-breath", currentStyle.id);

    const vars: Record<string, string> = {
      "--breath-bg": currentStyle.colors.bg,
      "--breath-bg-alt": currentStyle.colors.bgAlt,
      "--breath-surface": currentStyle.colors.surface,
      "--breath-surface-2": currentStyle.colors.surface2,
      "--breath-primary": currentStyle.colors.primary,
      "--breath-primary-mid": currentStyle.colors.primaryMid,
      "--breath-primary-lt": currentStyle.colors.primaryLt,
      "--breath-accent": currentStyle.colors.accent,
      "--breath-border": currentStyle.colors.border,
      "--breath-glow": currentStyle.colors.glow,
      "--breath-seigaiha": currentStyle.colors.seigaiha,
      "--breath-swatch": currentStyle.swatchGradient,
    };

    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [currentStyle]);

  const setStyleId = (id: BreathingStyleId) => {
    setStyleIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore
    }
  };

  return (
    <BreathingContext.Provider
      value={{
        currentStyle,
        setStyleId,
        availableStyles: BREATHING_STYLES,
      }}
    >
      {children}
    </BreathingContext.Provider>
  );
}

export function useBreathingStyle() {
  const context = useContext(BreathingContext);
  if (!context) {
    throw new Error("useBreathingStyle must be used within a BreathingProvider");
  }
  return context;
}
