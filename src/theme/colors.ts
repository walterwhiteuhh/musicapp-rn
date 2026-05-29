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
    description: 'Offizielle Klangfeld-Brand-Palette mit dem neuen Signatur-Verlauf #00D4FF (Cyan) -> #7B2CFF (Violett) -> #FF3FD8 (Magenta).',
    background: '#04040A',
    surface: '#0B0B14',
    elevated: '#121221',
    border: '#1E1F35',
    text: '#F0F5FA',
    muted: '#7E83A9',
    primary: '#7B2CFF',     // Neon Violet
    secondary: '#00D4FF',   // Neon Cyan
    accent: '#FF3FD8',      // Neon Magenta
    warning: '#FBBF24',
    danger: '#FB7185',
    gradientStart: '#00D4FF', // Cyan
    gradientEnd: '#FF3FD8',   // Magenta
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
