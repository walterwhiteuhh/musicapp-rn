import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { colors, palettes, type DesignPalette, type DesignPaletteId } from './colors';

type ThemeContextValue = {
  palette: DesignPalette;
  setPaletteId(paletteId: DesignPaletteId): void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [paletteId, setPaletteId] = useState<DesignPaletteId>('afterhours');

  const value = useMemo<ThemeContextValue>(() => {
    return {
      palette: palettes[paletteId] ?? colors,
      setPaletteId,
    };
  }, [paletteId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePalette() {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      palette: colors,
      setPaletteId: () => undefined,
    };
  }

  return context;
}
