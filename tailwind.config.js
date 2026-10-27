/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F1E7',
        card: '#FFFFFF',
        border: '#E3DCCB',
        ink: '#1D1B16',
        muted: '#6B6559',
        trusted: {
          DEFAULT: '#2F6B3F',
          bg: '#F0F6F2',
          border: '#C1DEC8',
        },
        quarantined: {
          DEFAULT: '#B7791F',
          bg: '#FEF8EE',
          border: '#F5DCB0',
        },
        rejected: {
          DEFAULT: '#A63D2F',
          bg: '#FDF2F0',
          border: '#F3C4BE',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        panel: '16px',
        pill: '999px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(29, 27, 22, 0.04)',
        card: '0 1px 3px rgba(29, 27, 22, 0.05)',
      },
    },
  },
  plugins: [],
};
