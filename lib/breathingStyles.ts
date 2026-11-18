export type BreathingStyleId = "flame" | "water" | "thunder" | "insect" | "flower";

export interface BreathingStyle {
  id: BreathingStyleId;
  name: string;
  shortName: string;
  kanji: string;

  accentLabel: string;
  swatchGradient: string;
  badgeBg: string;
  badgeText: string;
  colors: {
    primary: string;
    primaryMid: string;
    primaryLt: string;
    accent: string;
    bg: string;
    bgAlt: string;
    surface: string;
    surface2: string;
    border: string;
    glow: string;
    seigaiha: string;
  };
  blobColors: {
    dark: string;
    mid: string;
    deep: string;
  };
  particles: {
    mode: "flame" | "water" | "thunder" | "insect" | "flower";
    colors: string[];
  };
}

export const BREATHING_STYLES: BreathingStyle[] = [
  {
    id: "flame",
    name: "Flame Breathing Style",
    shortName: "Flame",
    kanji: "炎",
    accentLabel: "Crimson & Ember-Orange",
    swatchGradient: "linear-gradient(135deg, #c02626 0%, #ff5500 50%, #ffaa00 100%)",
    badgeBg: "rgba(255, 85, 0, 0.18)",
    badgeText: "#ff7700",
    colors: {
      primary: "#8b0000",
      primaryMid: "#c02626",
      primaryLt: "#ff4500",
      accent: "#ffaa00",
      bg: "#080303",
      bgAlt: "#120606",
      surface: "#180a0a",
      surface2: "#200e0e",
      border: "rgba(255, 69, 0, 0.25)",
      glow: "rgba(255, 69, 0, 0.5)",
      seigaiha: "rgba(255, 69, 0, 0.05)",
    },
    blobColors: {
      dark: "#6b0a0a",
      mid: "#8b0000",
      deep: "#3a0505",
    },
    particles: {
      mode: "flame",
      colors: [
        "rgba(255, 85, 0, 0.9)",    // Ember orange
        "rgba(255, 170, 0, 0.85)",  // Golden flame tip
        "rgba(192, 38, 38, 0.85)",  // Deep crimson
        "rgba(255, 69, 0, 0.75)",   // Red-orange spark
        "rgba(255, 204, 0, 0.95)",  // Hot core spark
      ],
    },
  },
  {
    id: "water",
    name: "Water Breathing Style",
    shortName: "Water",
    kanji: "水",
    accentLabel: "Deep Blue & Cyan",
    swatchGradient: "linear-gradient(135deg, #004e7c 0%, #0077b6 50%, #00b4d8 100%)",
    badgeBg: "rgba(0, 180, 216, 0.18)",
    badgeText: "#00b4d8",
    colors: {
      primary: "#004e7c",
      primaryMid: "#0077b6",
      primaryLt: "#00b4d8",
      accent: "#90e0ef",
      bg: "#030710",
      bgAlt: "#061020",
      surface: "#0a172c",
      surface2: "#10223d",
      border: "rgba(0, 180, 216, 0.25)",
      glow: "rgba(0, 180, 216, 0.5)",
      seigaiha: "rgba(0, 180, 216, 0.06)",
    },
    blobColors: {
      dark: "#03396c",
      mid: "#005b96",
      deep: "#011f4b",
    },
    particles: {
      mode: "water",
      colors: [
        "rgba(0, 180, 216, 0.85)",  // Bright cyan
        "rgba(0, 119, 182, 0.8)",   // Flowing ocean blue
        "rgba(144, 224, 239, 0.9)",  // Droplet light highlight
        "rgba(72, 202, 228, 0.75)", // Wave crest foam
        "rgba(2, 62, 125, 0.7)",    // Abyss indigo
      ],
    },
  },
  {
    id: "thunder",
    name: "Thunder Breathing Style",
    shortName: "Thunder",
    kanji: "雷",
    accentLabel: "Dark Indigo & Gold",
    swatchGradient: "linear-gradient(135deg, #b8860b 0%, #cca01d 50%, #ffd700 100%)",
    badgeBg: "rgba(255, 215, 0, 0.18)",
    badgeText: "#ffd700",
    colors: {
      primary: "#b8860b",
      primaryMid: "#cca01d",
      primaryLt: "#ffd700",
      accent: "#fff380",
      bg: "#06060c",
      bgAlt: "#0f101d",
      surface: "#16172a",
      surface2: "#1f213b",
      border: "rgba(255, 215, 0, 0.25)",
      glow: "rgba(255, 215, 0, 0.5)",
      seigaiha: "rgba(255, 215, 0, 0.05)",
    },
    blobColors: {
      dark: "#5c4308",
      mid: "#7d5b0c",
      deep: "#2e2103",
    },
    particles: {
      mode: "thunder",
      colors: [
        "rgba(255, 215, 0, 0.9)",   // Pure electric gold
        "rgba(255, 243, 128, 0.95)", // Lightning flash core
        "rgba(218, 165, 32, 0.8)",  // Radiant bronze
        "rgba(255, 179, 0, 0.75)",  // Static amber
        "rgba(184, 134, 11, 0.7)",  // Dark thunder trail
      ],
    },
  },
  {
    id: "insect",
    name: "Insect Breathing Style",
    shortName: "Insect",
    kanji: "蟲",
    accentLabel: "Violet & Plum",
    swatchGradient: "linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)",
    badgeBg: "rgba(186, 104, 200, 0.18)",
    badgeText: "#ba68c8",
    colors: {
      primary: "#6a1b9a",
      primaryMid: "#8e24aa",
      primaryLt: "#ba68c8",
      accent: "#e1bee7",
      bg: "#090410",
      bgAlt: "#130822",
      surface: "#1c0e30",
      surface2: "#261540",
      border: "rgba(186, 104, 200, 0.25)",
      glow: "rgba(186, 104, 200, 0.5)",
      seigaiha: "rgba(186, 104, 200, 0.05)",
    },
    blobColors: {
      dark: "#4a148c",
      mid: "#6a1b9a",
      deep: "#260b49",
    },
    particles: {
      mode: "insect",
      colors: [
        "rgba(186, 104, 200, 0.85)", // Wisteria violet
        "rgba(225, 190, 231, 0.9)",  // Glowing butterfly edge
        "rgba(142, 36, 170, 0.8)",   // Deep amethyst
        "rgba(206, 147, 216, 0.75)", // Soft lavender
        "rgba(255, 235, 180, 0.85)", // Warm golden pollen
      ],
    },
  },
  {
    id: "flower",
    name: "Flower Breathing Style",
    shortName: "Flower",
    kanji: "花",
    accentLabel: "Rose & Soft Pink",
    swatchGradient: "linear-gradient(135deg, #ad1457 0%, #c2185b 50%, #f06292 100%)",
    badgeBg: "rgba(240, 98, 146, 0.18)",
    badgeText: "#f06292",
    colors: {
      primary: "#ad1457",
      primaryMid: "#c2185b",
      primaryLt: "#f06292",
      accent: "#fbcfe8",
      bg: "#0e0308",
      bgAlt: "#180610",
      surface: "#240a18",
      surface2: "#301022",
      border: "rgba(240, 98, 146, 0.25)",
      glow: "rgba(240, 98, 146, 0.5)",
      seigaiha: "rgba(240, 98, 146, 0.05)",
    },
    blobColors: {
      dark: "#6a0d37",
      mid: "#880e4f",
      deep: "#38051e",
    },
    particles: {
      mode: "flower",
      colors: [
        "rgba(240, 98, 146, 0.85)", // Sakura pink
        "rgba(251, 207, 232, 0.9)",  // Light rose petal
        "rgba(194, 24, 91, 0.8)",   // Deep crimson bloom
        "rgba(255, 128, 171, 0.8)",  // Radiant peach petal
        "rgba(255, 240, 245, 0.85)", // Petal tip highlight
      ],
    },
  },
];

export const DEFAULT_BREATHING_STYLE_ID: BreathingStyleId = "flame";

export function getBreathingStyle(id: BreathingStyleId): BreathingStyle {
  return BREATHING_STYLES.find((s) => s.id === id) || BREATHING_STYLES[0];
}
