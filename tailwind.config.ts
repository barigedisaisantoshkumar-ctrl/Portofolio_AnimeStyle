import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "#0d0d0d",
        "bg-alt":  "#111111",
        surface:   "#181818",
        "surface-2": "#1e1e1e",
        crimson:   "#8b0000",
        "crimson-mid": "#a30000",
        "crimson-lt":  "#c0392b",
        ivory:     "#f0ece4",
        soft:      "#c8c0b4",
        muted:     "#7a7268",
        border:    "rgba(139,0,0,0.18)",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["Electroharmonix", "var(--font-cinzel)", "Georgia", "serif"],
        serif:   ["var(--font-cinzel)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "leaf-drift": {
          "0%,100%": { transform: "translateX(0) rotate(0deg)" },
          "50%":     { transform: "translateX(12px) rotate(8deg)" },
        },
        "brush-float": {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%":     { transform: "translateY(-8px) scale(1.015)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.6s ease both",
        "leaf-drift": "leaf-drift 7s ease-in-out infinite",
        "brush-float":"brush-float 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
