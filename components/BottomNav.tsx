"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BreathingSelector } from "@/components/BreathingSelector";

const NAV_LINKS = [
  { label: "About Me",   href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "My Work",    href: "#my-work" },
  { label: "Connect",    href: "#connect" },
];

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const ids = ["hero", "about", "experience", "my-work", "certificates", "connect"];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const handler = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = "";
      for (const s of sections) {
        if (s.offsetTop <= y) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

export function BottomNav() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(href: string) {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isNavActive = (href: string) => {
    const id = href.replace("#", "");
    return active === id;
  };

  return (
    <>
      {/* Top Header — Wordmark on Left, Breathing Style Selector on Top-Right */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 pointer-events-none transition-colors duration-500"
        style={{
          background: "linear-gradient(to bottom, var(--breath-bg, #080303) 70%, transparent)",
        }}
      >
        <motion.div
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="pointer-events-auto"
        >
          <a
            href="#hero"
            className="flex items-center gap-2 sm:gap-3 font-sans font-medium text-[0.72rem] sm:text-[0.78rem] tracking-[0.16em] sm:tracking-[0.2em] uppercase text-ivory hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt rounded"
            aria-label="Santosh Barigedi — back to top"
            onClick={e => { e.preventDefault(); scrollTo("#hero"); }}
          >
            <span
              className="inline-block w-[3px] h-[1.15em] bg-crimson-lt flex-shrink-0 shadow-[0_0_8px_rgba(192,57,43,0.6)]"
              aria-hidden="true"
            />
            <span className="truncate max-w-[130px] sm:max-w-none">SANTOSH BARIGEDI</span>
          </a>
        </motion.div>

        {/* Right side: Breathing Style Selector in top-right corner + Back-to-top floating button */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <BreathingSelector />

          <AnimatePresence>
            {scrolled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -6 }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-crimson hover:bg-crimson-lt flex items-center justify-center text-ivory text-xs sm:text-sm shadow-lg transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt flex-shrink-0"
                aria-label="Back to top"
                onClick={() => scrollTo("#hero")}
              >
                ↑
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Bottom Navigation — Slides up smoothly from the bottom */}
      <motion.nav
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        className="fixed bottom-0 left-0 right-0 z-50 h-14 flex items-center justify-center border-t border-crimson/20"
        style={{
          background: "linear-gradient(to top, var(--breath-bg, #0d0d0d) 80%, transparent)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        aria-label="Site navigation"
      >
        <ul className="flex items-center gap-1 sm:gap-3 list-none" role="list">
          {NAV_LINKS.map((link, i) => {
            const isActive = isNavActive(link.href);
            return (
              <li key={link.href} className="flex items-center gap-1 sm:gap-3">
                {i > 0 && (
                  <span className="text-crimson/40 text-xs select-none hidden sm:inline" aria-hidden="true">|</span>
                )}
                <button
                  className={`relative font-serif text-[0.68rem] sm:text-[0.74rem] tracking-[0.12em] sm:tracking-[0.16em] uppercase px-3 py-1.5 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt ${
                    isActive ? "text-crimson-lt font-semibold" : "text-muted hover:text-ivory"
                  }`}
                  onClick={() => scrollTo(link.href)}
                  aria-current={isActive ? "true" : undefined}
                >
                  {link.label}
                  {/* Active theme indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-[2px] left-2 right-2 h-[2px] bg-crimson-lt rounded-full shadow-[0_0_8px_rgba(192,57,43,0.8)]"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
