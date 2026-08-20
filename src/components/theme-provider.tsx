import { useEffect, useState, type ReactNode } from "react";
import { applyPalette, getStoredPalette, PALETTES, type PaletteId, setStoredPalette } from "@/lib/palettes";

export type ReadingLevel = "simple" | "standard";

const READING_KEY = "bloom.readingLevel";

type ThemeContextValue = {
  palette: PaletteId;
  setPalette: (id: PaletteId) => void;
  readingLevel: ReadingLevel;
  setReadingLevel: (level: ReadingLevel) => void;
};

import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteId>("sage");
  const [readingLevel, setReadingLevelState] = useState<ReadingLevel>("simple");

  useEffect(() => {
    const stored = getStoredPalette();
    setPaletteState(stored);
    applyPalette(stored);
    if (typeof window !== "undefined") {
      const rl = window.localStorage.getItem(READING_KEY);
      if (rl === "simple" || rl === "standard") setReadingLevelState(rl);
    }
  }, []);

  const setPalette = (id: PaletteId) => {
    setPaletteState(id);
    setStoredPalette(id);
    applyPalette(id);
  };

  const setReadingLevel = (level: ReadingLevel) => {
    setReadingLevelState(level);
    if (typeof window !== "undefined") window.localStorage.setItem(READING_KEY, level);
  };

  return (
    <ThemeContext.Provider value={{ palette, setPalette, readingLevel, setReadingLevel }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Pick between simple and standard wording anywhere in the UI. */
export function useWords() {
  const { readingLevel } = useTheme();
  return (simple: string, standard: string) => (readingLevel === "simple" ? simple : standard);
}

export { PALETTES };
