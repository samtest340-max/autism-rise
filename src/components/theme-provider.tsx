import { useEffect, useState, type ReactNode } from "react";
import { applyPalette, getStoredPalette, PALETTES, type PaletteId, setStoredPalette } from "@/lib/palettes";

type ThemeContextValue = {
  palette: PaletteId;
  setPalette: (id: PaletteId) => void;
};

import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteId>("sage");

  useEffect(() => {
    const stored = getStoredPalette();
    setPaletteState(stored);
    applyPalette(stored);
  }, []);

  const setPalette = (id: PaletteId) => {
    setPaletteState(id);
    setStoredPalette(id);
    applyPalette(id);
  };

  return <ThemeContext.Provider value={{ palette, setPalette }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export { PALETTES };
