export type DesignPaletteId = 'afterhours' | 'duskSignal';

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
};

export const palettes: Record<DesignPaletteId, DesignPalette> = {
  afterhours: {
    id: 'afterhours',
    name: 'Afterhours Circuit',
    description: 'Deep club blacks, cyan signal lights, and restrained violet detail.',
    background: '#080B10',
    surface: '#111821',
    elevated: '#182433',
    border: '#2A394B',
    text: '#F4F8FB',
    muted: '#9AA8B8',
    primary: '#2DD4BF',
    secondary: '#8B5CF6',
    accent: '#38BDF8',
    warning: '#FBBF24',
    danger: '#FB7185',
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
  },
};

export const colors = palettes.afterhours;
