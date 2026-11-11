import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  // hover: utilities only apply where a fine pointer can hover, so taps don't leave
  // them stuck on touch screens.
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/app/**/*.{ts,tsx,mdx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        page: 'var(--page)',
        ink: 'var(--ink)',
        sub: 'var(--sub)',
        soft: 'var(--soft)',
        surface: 'var(--surface)',
        inv: {
          DEFAULT: 'var(--inv)',
          ink: 'var(--inv-ink)',
          signal: 'var(--inv-signal)',
        },
        signal: {
          DEFAULT: 'var(--signal)',
          on: 'var(--on-signal)',
        },
        code: {
          DEFAULT: 'var(--code)',
          ink: 'var(--code-ink)',
        },
      },
    },
  },
} satisfies Config;

export default config;
