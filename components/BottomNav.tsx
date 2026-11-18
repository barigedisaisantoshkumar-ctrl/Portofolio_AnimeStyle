"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BreathingSelector } from "@/components/BreathingSelector";
import { NezukoRunner } from "@/components/NezukoRunner";

const NAV_LINKS = [
  { id: "about",      label: "About Me",   href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "my-work",    label: "My Work",    href: "#my-work" },
  { id: "connect",    label: "Connect",    href: "#connect" },
];

export function BottomNav() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (about) to 3 (connect)

  // Track page-wide scroll progress and direction for Nezuko & Zenitsu runners
  const [runnerProgress, setRunnerProgress] = useState(0);
  const [runnerDirection, setRunnerDirection] = useState<"right" | "left">("right");
  const [runnerScrollY, setRunnerScrollY] = useState(0);
  const lastScrollYRef = useRef(0);

  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [lineGeometry, setLineGeometry] = useState<{
    left: number;
    width: number;
    totalLeft: number;
    totalWidth: number;
  }>({ left: 0, width: 0, totalLeft: 0, totalWidth: 0 });

  // Update line geometry based on button measurements and scroll progress
  const updateLine = useCallback((progress: number) => {
    const list = listRef.current;
    if (!list) return;

    const b0 = buttonRefs.current[0];
    const b1 = buttonRefs.current[1];
    const b2 = buttonRefs.current[2];
    const b3 = buttonRefs.current[3];

    if (!b0 || !b1 || !b2 || !b3) return;

    const totalLeft = b0.offsetLeft + 8;
    const totalRight = b3.offsetLeft + b3.offsetWidth - 8;
    const totalWidth = Math.max(0, totalRight - totalLeft);

    // Positions for each tab's left edge
    const p0 = b0.offsetLeft + 8;
    const p1 = b1.offsetLeft + 8;
    const p2 = b2.offsetLeft + 8;
    const p3 = b3.offsetLeft + 8;

    let currentLeft = p0;
    if (progress <= 1) {
      currentLeft = p0 + progress * (p1 - p0);
    } else if (progress <= 2) {
      currentLeft = p1 + (progress - 1) * (p2 - p1);
    } else {
      currentLeft = p2 + Math.min(1, progress - 2) * (p3 - p2);
    }

    // The line ends at totalRight (Connect's right edge), so width decreases as left advances
    const currentWidth = Math.max(b3.offsetWidth - 16, totalRight - currentLeft);

    setLineGeometry({
      left: currentLeft,
      width: currentWidth,
      totalLeft,
      totalWidth,
    });
  }, []);

  // Track scroll position, active section, and continuous section progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 80);

      const sAbout = document.getElementById("about");
      const sExp = document.getElementById("experience");
      const sWork = document.getElementById("my-work");
      const sConnect = document.getElementById("connect");

      if (!sAbout || !sExp || !sWork || !sConnect) {
        updateLine(0);
        return;
      }

      const viewportMid = scrollY + window.innerHeight * 0.4;

      const yAbout = sAbout.offsetTop;
      const yExp = sExp.offsetTop;
      const yWork = sWork.offsetTop;
      const yConnect = sConnect.offsetTop;

      // Determine active section id
      if (viewportMid >= yConnect) {
        setActive("connect");
      } else if (viewportMid >= yWork) {
        setActive("my-work");
      } else if (viewportMid >= yExp) {
        setActive("experience");
      } else {
        setActive("about");
      }

      // Continuous progress from 0 (About) to 3 (Connect)
      let prog = 0;
      if (viewportMid < yAbout) {
        prog = 0;
      } else if (viewportMid < yExp) {
        prog = (viewportMid - yAbout) / Math.max(1, yExp - yAbout);
      } else if (viewportMid < yWork) {
        prog = 1 + (viewportMid - yExp) / Math.max(1, yWork - yExp);
      } else if (viewportMid < yConnect) {
        prog = 2 + (viewportMid - yWork) / Math.max(1, yConnect - yWork);
      } else {
        prog = 3;
      }

      setScrollProgress(prog);
      updateLine(prog);

      // Update page-wide scroll progress and direction for the runners
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const overallProgress = Math.min(1, Math.max(0, scrollY / docHeight));
      setRunnerProgress(overallProgress);
      setRunnerScrollY(scrollY);

      const delta = scrollY - lastScrollYRef.current;
      if (Math.abs(delta) >= 1) {
        setRunnerDirection(delta > 0 ? "right" : "left");
        lastScrollYRef.current = scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => updateLine(scrollProgress), { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", () => updateLine(scrollProgress));
    };
  }, [updateLine, scrollProgress]);

  function scrollTo(href: string) {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            className="flex items-center gap-2 sm:gap-3 font-display font-medium text-[0.78rem] sm:text-[0.88rem] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-ivory hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt rounded"
            aria-label="Santosh Barigedi — back to top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#hero");
            }}
          >
            <span
              className="inline-block w-[3px] h-[1.15em] bg-crimson-lt flex-shrink-0 shadow-[0_0_8px_rgba(255,69,0,0.7)]"
              aria-hidden="true"
            />
            <span className="truncate max-w-[150px] sm:max-w-none">SANTOSH BARIGEDI</span>
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-crimson hover:bg-crimson-lt flex items-center justify-center text-ivory text-xs sm:text-sm shadow-lg transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt flex-shrink-0 cursor-pointer"
                aria-label="Back to top"
                onClick={() => scrollTo("#hero")}
              >
                ↑
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Bottom Navigation — With smooth decreasing line from About to Connect */}
      <motion.nav
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        className="fixed bottom-0 left-0 right-0 z-50 h-14 flex items-center justify-center border-t border-crimson/20"
        style={{
          background: "linear-gradient(to top, var(--breath-bg, #080303) 80%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        aria-label="Site navigation"
      >
        {/* Nezuko & Zenitsu Runners — Grounded directly on top of the navbar ledge */}
        <NezukoRunner
          progress={runnerProgress}
          direction={runnerDirection}
          scrollY={runnerScrollY}
        />

        <div className="relative">
          <ul
            ref={listRef}
            className="flex items-center gap-1 sm:gap-3 list-none relative pb-1.5"
            role="list"
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = active === link.id;
              return (
                <li key={link.href} className="flex items-center gap-1 sm:gap-3">
                  {i > 0 && (
                    <span
                      className="text-crimson/35 text-xs select-none hidden sm:inline"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  )}
                  <button
                    ref={(el) => {
                      buttonRefs.current[i] = el;
                    }}
                    className={`relative font-serif text-[0.68rem] sm:text-[0.74rem] tracking-[0.12em] sm:tracking-[0.16em] uppercase px-3 py-1.5 rounded transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt cursor-pointer ${
                      isActive ? "text-crimson-lt font-semibold" : "text-muted hover:text-ivory"
                    }`}
                    onClick={() => scrollTo(link.href)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Faint Background Track (Under the full line from About to Connect) */}
          {lineGeometry.totalWidth > 0 && (
            <div
              className="absolute -bottom-[2px] h-[2px] bg-white/10 rounded-full pointer-events-none"
              style={{
                left: lineGeometry.totalLeft,
                width: lineGeometry.totalWidth,
              }}
              aria-hidden="true"
            />
          )}

          {/* Active Glowing Decreasing Line — Starts from About to Connect, and decreases while scrolling */}
          {lineGeometry.width > 0 && (
            <motion.div
              className="absolute -bottom-[2px] h-[2.5px] bg-crimson-lt rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 10px var(--breath-glow, rgba(255,69,0,0.85))",
              }}
              animate={{
                left: lineGeometry.left,
                width: lineGeometry.width,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.8,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </motion.nav>
    </>
  );
}
