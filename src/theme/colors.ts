export const lightColors = {
  background: '#ffffff',
  surface: '#f4f4f5',
  textPrimary: '#18181b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  border: '#e4e4e7',
  accent: '#2563eb',
  accentMuted: '#dbeafe',
  onAccent: '#ffffff',
  error: '#dc2626',
  score: '#1d4ed8',
  filterInactiveBg: '#e4e4e7',
  filterInactiveText: '#3f3f46',
  spinner: '#2563eb',
  refreshIndicator: '#2563eb',
  live: '#dc2626',
  onLive: '#ffffff',
  liveInactiveBg: '#fee2e2',
} as const;

export const darkColors = {
  background: '#0c0c0f',
  surface: '#18181f',
  textPrimary: '#f4f4f5',
  textSecondary: '#d4d4d8',
  textMuted: '#a1a1aa',
  border: '#2e2e38',
  accent: '#3b82f6',
  accentMuted: '#1e3a5f',
  onAccent: '#f8fafc',
  error: '#fca5a5',
  score: '#93c5fd',
  filterInactiveBg: '#27272f',
  filterInactiveText: '#e4e4e7',
  spinner: '#60a5fa',
  refreshIndicator: '#93c5fd',
  live: '#ef4444',
  onLive: '#ffffff',
  liveInactiveBg: '#450a0a',
} as const;

export type AppColorKey = keyof typeof lightColors;

export type AppColors = {
  [K in AppColorKey]: (typeof lightColors)[K] | (typeof darkColors)[K];
};
