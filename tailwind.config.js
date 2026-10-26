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
        cream: '#FAFADC',
        green: '#024E46',
        charcoal: '#1A1A1A',
        white: '#FEFEFF',
        text: '#2F4A45',
        pink: '#F681A2',
        violet: '#9F82FE',
        g600: '#119C75',
        g400: '#69D1AD',
        success: {
          DEFAULT: '#0E7C5A',
          bg: '#E4F5EE',
        },
        danger: {
          DEFAULT: '#B3261E',
          bg: '#FBE9E7',
        },
        warn: {
          DEFAULT: '#8A5A00',
          bg: '#FFF1D6',
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', '"Times New Roman"', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        chip: '12px',
        card: '20px',
        panel: '24px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(2,78,70,0.06)',
        md: '0 8px 24px rgba(2,78,70,0.08)',
        lg: '0 20px 48px rgba(2,78,70,0.12)',
      },
    },
  },
  plugins: [],
};
