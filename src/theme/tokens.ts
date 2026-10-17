
export interface Tokens {
  isDark: boolean;
  bg: string;
  fg: string;
  sub: string;
  dim: string;
  surf: string;
  surf2: string;
  /** Raised surface for grouped lists and cards. */
  card: string;
  line: string;
  nav: string;
  eyebrow: string;
  good: string;
  goodbg: string;
  gold: string;
  goldbg: string;
  brand: string;
  brandbg: string;
  inv: string;
  invfg: string;
  glow: number;
  danger: string;
  dangerbg: string;
  shadow: string;
}

export const lightTokens: Tokens = {
  isDark: false,
  bg: '#fffbf0',
  fg: '#111827',
  sub: '#57534e',
  dim: '#6b6660',
  surf: 'rgba(17,24,39,0.05)',
  surf2: 'rgba(17,24,39,0.09)',
  card: '#ffffff',
  line: '#e8e4dd',
  nav: 'rgba(255,255,255,0.97)',
  eyebrow: '#c2410c',
  good: '#047857',
  goodbg: 'rgba(16,185,129,0.15)',
  gold: '#b45309',
  goldbg: 'rgba(245,158,11,0.18)',
  brand: '#c2410c',
  brandbg: 'rgba(234,88,12,0.10)',
  inv: '#111827',
  invfg: '#fffbf0',
  glow: 0.16,
  danger: '#b91c1c',
  dangerbg: 'rgba(239,68,68,0.12)',
  shadow: 'rgba(17,24,39,0.22)',
};



/** Brand constants that never change with the theme. */
export const brand = {
  orange: '#ea580c',
  orangeDark: '#c2410c',
  cta: ['#d4450a', '#b5380a'] as const,
  green: '#10b981',
  gold: '#f59e0b',
  ink: '#111827',
  cream: '#fffbf0',
};
