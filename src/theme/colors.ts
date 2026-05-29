export type DesignPaletteId = 'klangfeld' | 'duskSignal';

export type DesignPalette = {
  id: DesignPaletteId;
  name: string;
  description: string;
  background: string;
  surface: string;
  elevated: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  warning: string;
  danger: string;
  gradientStart: string;
  gradientEnd: string;
};

export const palettes: Record<DesignPaletteId, DesignPalette> = {
  klangfeld: {
    id: 'klangfeld',
    name: 'Klangfeld',
    description: 'Offizielle Klangfeld-Brand-Palette mit edlem Purple-zu-Cyan-Verlauf und Deep Navy Hintergrund.',
    background: '#07070F',
    surface: '#0E0F1A',
    elevated: '#161828',
    border: '#252840',
    text: '#F0F0FA',
    muted: '#8A8DA8',
    primary: '#A855F7',     // Deep Purple
    secondary: '#06B6D4',   // Electric Cyan
    accent: '#8B5CF6',      // Restrained Violet
    warning: '#FBBF24',
    danger: '#FB7185',
    gradientStart: '#8B5CF6', // Purple
    gradientEnd: '#06B6D4',   // Cyan
  },
  duskSignal: {
    id: 'duskSignal',
    name: 'Dusk Signal',
    description: 'Late sunset violet, hot magenta accents, and warm amber highlights.',
    background: '#100B18',
    surface: '#1B1428',
    elevated: '#261B36',
    border: '#3A2B50',
    text: '#FAF7FF',
    muted: '#B9AACD',
    primary: '#F472B6',
    secondary: '#22D3EE',
    accent: '#F59E0B',
    warning: '#FBBF24',
    danger: '#FB7185',
    gradientStart: '#D946EF',
    gradientEnd: '#22D3EE',
  },
};

export const colors = palettes.klangfeld;
