"use client";

/** Subtle traditional Japanese Seigaiha (ocean wave) pattern overlay matching the reference board background */
export function BreathingSeigaiha() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-70 transition-opacity duration-700"
      aria-hidden="true"
    >
      <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="seigaiha-pattern"
            width="60"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            {/* Concentric wave crest arches */}
            <path
              d="M0,30 A28,28 0 0,1 56,30 M4,30 A24,24 0 0,1 52,30 M8,30 A20,20 0 0,1 48,30 M12,30 A16,16 0 0,1 44,30 M16,30 A12,12 0 0,1 40,30"
              fill="none"
              stroke="var(--breath-seigaiha, rgba(255, 69, 0, 0.05))"
              strokeWidth="1"
            />
            <path
              d="M30,15 A28,28 0 0,1 86,15 M34,15 A24,24 0 0,1 82,15 M38,15 A20,20 0 0,1 78,15 M42,15 A16,16 0 0,1 74,15 M46,15 A12,12 0 0,1 70,15"
              fill="none"
              stroke="var(--breath-seigaiha, rgba(255, 69, 0, 0.05))"
              strokeWidth="1"
            />
            <path
              d="M-30,15 A28,28 0 0,1 26,15 M-26,15 A24,24 0 0,1 22,15 M-22,15 A20,20 0 0,1 18,15 M-18,15 A16,16 0 0,1 14,15 M-14,15 A12,12 0 0,1 10,15"
              fill="none"
              stroke="var(--breath-seigaiha, rgba(255, 69, 0, 0.05))"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha-pattern)" />
      </svg>
    </div>
  );
}

