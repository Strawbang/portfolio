/**
 * Tailwind config — Djamel Bougouffa Design System
 * Maps the portfolio tokens onto Tailwind's theme.
 *
 * Dark mode uses a `.theme-dark` class (matching the portfolio),
 * and colors reference CSS variables so both themes work from tokens.css.
 * Import tokens.css globally so the var(--*) values resolve.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.theme-dark'],
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Reference CSS variables so light/dark swap automatically.
        gray: {
          0: 'var(--gray-0)',
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
          999: 'var(--gray-999)',
        },
        accent: {
          light: 'var(--accent-light)',
          DEFAULT: 'var(--accent-regular)',
          regular: 'var(--accent-regular)',
          dark: 'var(--accent-dark)',
        },
        link: 'var(--link-color)',
        // Static reference values (violet scale) if you prefer fixed hex.
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa', // accent-light (light theme) / accent-dark (dark theme)
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9', // accent-regular
          800: '#5b21b6', // gradient-stop-1 (dark)
          900: '#4c1d95',
          950: '#2e1065', // accent-dark (light theme)
        },
      },
      fontFamily: {
        brand: ['Rubik', 'system-ui', 'sans-serif'],
        body: ['Public Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        sm: '0.875rem',
        base: '1rem',
        md: '1.125rem',
        lg: '1.25rem',
        xl: '1.625rem',
        '2xl': '2.125rem',
        '3xl': '2.625rem',
        '4xl': '3.5rem',
        '5xl': '4.5rem',
      },
      spacing: {
        // Portfolio gap scale
        2: '0.5rem',
        4: '1rem',
        8: '2rem',
        10: '2.5rem',
        15: '3.75rem',
        20: '5rem',
        30: '7.5rem',
        48: '12rem',
      },
      borderRadius: {
        card: '0.5rem',
        panel: '0.6rem',
        pill: '999rem',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      backgroundImage: {
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-stroke': 'var(--gradient-stroke)',
      },
      transitionTimingFunction: {
        theme: 'ease-in-out',
      },
      maxWidth: {
        wrapper: '83rem',
      },
    },
  },
  plugins: [],
};
