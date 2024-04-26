import type { Config } from "tailwindcss"

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e96a49',
          '50': '#fdf4ef',
          '100': '#fbe4d9',
          '200': '#f6c5b2',
          '300': '#f09f81',
          '400': '#e96a49',
          '500': '#e44a2b',
          '600': '#d63220',
          '700': '#b1241d',
          '800': '#8e1f1e',
          '900': '#721d1c',
          '950': '#3e0c0d',
        },
        secondary: {
          DEFAULT: '#4ca9bb',
          '50': '#f1fafa',
          '100': '#daf0f3',
          '200': '#bae2e7',
          '300': '#8acbd6',
          '400': '#4ca9bb',
          '500': '#3790a3',
          '600': '#30758a',
          '700': '#2d6071',
          '800': '#2c515e',
          '900': '#284551',
          '950': '#162c36',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config