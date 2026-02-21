export interface Theme {
  background: string;
  text: string;
  accent: string;
  cardBg: string;
}

export const themes: Record<string, Theme> = {
  default: {
    background: '#f8fafc',
    text: '#1e293b',
    accent: '#3b82f6',
    cardBg: '#ffffff',
  },
  dark: {
    background: '#0f172a',
    text: '#f8fafc',
    accent: '#38bdf8',
    cardBg: '#1e293b',
  },
  warm: {
    background: '#fffbeb',
    text: '#451a03',
    accent: '#f59e0b',
    cardBg: '#fef3c7',
  },
  vibrant: {
    background: '#4c1d95',
    text: '#ffffff',
    accent: '#f472b6',
    cardBg: '#5b21b6',
  }
};

export function getTheme(themeKey: string): Theme {
  return themes[themeKey] || themes.default;
}
