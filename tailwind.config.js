/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['var(--font-sora)', 'Sora', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        orange: {
          main: '#FF8A00',
          light: '#FFDBA6',
          pale: '#FFF6EB',
          deep: '#E07700',
        },
        brown: {
          dark: '#2B1B0E',
          mid: '#5A4633',
        },
        ink: '#111111',
        muted: '#5A5A5A',
      },
      borderRadius: {
        pill: '50px',
        card: '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,27,14,0.04), 0 6px 18px rgba(43,27,14,0.06)',
        card: '0 8px 24px -8px rgba(43,27,14,0.10), 0 2px 6px rgba(43,27,14,0.04)',
        lift: '0 18px 44px -12px rgba(43,27,14,0.18)',
        glow: '0 0 0 6px rgba(255,138,0,0.12), 0 16px 36px -10px rgba(255,138,0,0.45)',
      },
      backgroundImage: {
        'orange-fade': 'linear-gradient(135deg,#FF8A00 0%,#FFB04D 100%)',
        'pale-fade': 'linear-gradient(180deg,#FFF6EB 0%,#FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}
