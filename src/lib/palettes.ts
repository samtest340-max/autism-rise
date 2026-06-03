/**
 * Color palette customization. Stored in localStorage.
 * Each preset defines OKLCH values for the key semantic tokens.
 */
export type PaletteId = "sage" | "lavender" | "ocean" | "sunshine" | "rose";

export type Palette = {
  id: PaletteId;
  label: string;
  description: string;
  /* Swatches shown in the picker (hex-ish previews). */
  swatches: string[];
  /* Values applied to CSS vars. */
  tokens: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    ring: string;
    sidebar: string;
    sidebarPrimary: string;
    sidebarAccent: string;
  };
};

export const PALETTES: Record<PaletteId, Palette> = {
  sage: {
    id: "sage",
    label: "Calm Sage",
    description: "Soft sage + warm peach. Gentle, low-stimulation.",
    swatches: ["#F5F0E8", "#A8C5B5", "#F1C7AE", "#6B8E9E"],
    tokens: {
      background: "oklch(0.985 0.008 95)",
      foreground: "oklch(0.28 0.03 250)",
      primary: "oklch(0.78 0.07 160)",
      primaryForeground: "oklch(0.22 0.04 160)",
      secondary: "oklch(0.93 0.04 60)",
      secondaryForeground: "oklch(0.32 0.07 50)",
      accent: "oklch(0.9 0.06 220)",
      accentForeground: "oklch(0.25 0.05 230)",
      ring: "oklch(0.78 0.07 160)",
      sidebar: "oklch(0.97 0.012 95)",
      sidebarPrimary: "oklch(0.78 0.07 160)",
      sidebarAccent: "oklch(0.93 0.025 95)",
    },
  },
  lavender: {
    id: "lavender",
    label: "Soft Lavender",
    description: "Lavender + cream. Quiet and dreamy.",
    swatches: ["#F8F4FB", "#CBB8E8", "#E8C5D0", "#9B72CF"],
    tokens: {
      background: "oklch(0.98 0.01 300)",
      foreground: "oklch(0.27 0.04 290)",
      primary: "oklch(0.74 0.1 300)",
      primaryForeground: "oklch(0.98 0.01 300)",
      secondary: "oklch(0.93 0.04 350)",
      secondaryForeground: "oklch(0.3 0.06 340)",
      accent: "oklch(0.92 0.05 280)",
      accentForeground: "oklch(0.28 0.06 290)",
      ring: "oklch(0.74 0.1 300)",
      sidebar: "oklch(0.97 0.014 300)",
      sidebarPrimary: "oklch(0.74 0.1 300)",
      sidebarAccent: "oklch(0.93 0.025 300)",
    },
  },
  ocean: {
    id: "ocean",
    label: "Cool Ocean",
    description: "Blues and teals. Focused and steady.",
    swatches: ["#EAF4F8", "#A8DADC", "#5CBDB9", "#2E6B8A"],
    tokens: {
      background: "oklch(0.98 0.012 220)",
      foreground: "oklch(0.26 0.04 240)",
      primary: "oklch(0.72 0.09 220)",
      primaryForeground: "oklch(0.99 0.005 220)",
      secondary: "oklch(0.92 0.04 200)",
      secondaryForeground: "oklch(0.28 0.06 230)",
      accent: "oklch(0.88 0.07 190)",
      accentForeground: "oklch(0.25 0.06 220)",
      ring: "oklch(0.72 0.09 220)",
      sidebar: "oklch(0.97 0.015 220)",
      sidebarPrimary: "oklch(0.72 0.09 220)",
      sidebarAccent: "oklch(0.93 0.025 220)",
    },
  },
  sunshine: {
    id: "sunshine",
    label: "Warm Sunshine",
    description: "Soft yellow + coral. Playful and cheerful.",
    swatches: ["#FFF9E6", "#FFD37E", "#FFB5A7", "#F08A5D"],
    tokens: {
      background: "oklch(0.985 0.02 90)",
      foreground: "oklch(0.28 0.04 60)",
      primary: "oklch(0.82 0.13 70)",
      primaryForeground: "oklch(0.22 0.05 60)",
      secondary: "oklch(0.92 0.06 30)",
      secondaryForeground: "oklch(0.3 0.08 40)",
      accent: "oklch(0.9 0.07 50)",
      accentForeground: "oklch(0.28 0.07 50)",
      ring: "oklch(0.82 0.13 70)",
      sidebar: "oklch(0.97 0.022 80)",
      sidebarPrimary: "oklch(0.82 0.13 70)",
      sidebarAccent: "oklch(0.93 0.03 70)",
    },
  },
  rose: {
    id: "rose",
    label: "Quiet Rose",
    description: "Blush and dusty pink. Warm and reassuring.",
    swatches: ["#FCF1F3", "#F8D7DC", "#E8A5B2", "#C45C7C"],
    tokens: {
      background: "oklch(0.985 0.012 10)",
      foreground: "oklch(0.27 0.04 10)",
      primary: "oklch(0.78 0.1 10)",
      primaryForeground: "oklch(0.99 0.005 10)",
      secondary: "oklch(0.93 0.04 30)",
      secondaryForeground: "oklch(0.3 0.07 20)",
      accent: "oklch(0.92 0.05 350)",
      accentForeground: "oklch(0.28 0.06 350)",
      ring: "oklch(0.78 0.1 10)",
      sidebar: "oklch(0.97 0.015 10)",
      sidebarPrimary: "oklch(0.78 0.1 10)",
      sidebarAccent: "oklch(0.93 0.025 10)",
    },
  },
};

const STORAGE_KEY = "bloom.palette";

export function getStoredPalette(): PaletteId {
  if (typeof window === "undefined") return "sage";
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v && v in PALETTES) return v as PaletteId;
  return "sage";
}

export function setStoredPalette(id: PaletteId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, id);
}

export function applyPalette(id: PaletteId) {
  if (typeof document === "undefined") return;
  const tokens = PALETTES[id]?.tokens;
  if (!tokens) return;
  const root = document.documentElement;
  root.style.setProperty("--background", tokens.background);
  root.style.setProperty("--foreground", tokens.foreground);
  root.style.setProperty("--primary", tokens.primary);
  root.style.setProperty("--primary-foreground", tokens.primaryForeground);
  root.style.setProperty("--secondary", tokens.secondary);
  root.style.setProperty("--secondary-foreground", tokens.secondaryForeground);
  root.style.setProperty("--accent", tokens.accent);
  root.style.setProperty("--accent-foreground", tokens.accentForeground);
  root.style.setProperty("--ring", tokens.ring);
  root.style.setProperty("--sidebar", tokens.sidebar);
  root.style.setProperty("--sidebar-primary", tokens.sidebarPrimary);
  root.style.setProperty("--sidebar-accent", tokens.sidebarAccent);
}
