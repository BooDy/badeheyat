export interface Theme {
  background: string;
  text: string;
  accent: string;
  cardBg: string;
}

export const defaultTheme: Theme = {
  background: '#f8fafc',
  text: '#1e293b',
  accent: '#3b82f6',
  cardBg: '#ffffff',
};

export function createTheme(colors: Partial<Theme>): Theme {
  return {
    background: colors.background || defaultTheme.background,
    text: colors.text || defaultTheme.text,
    accent: colors.accent || defaultTheme.accent,
    cardBg: colors.cardBg || defaultTheme.cardBg,
  };
}
