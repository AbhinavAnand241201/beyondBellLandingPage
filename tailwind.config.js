/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      colors: {
        navy: '#1A2D4A',
        'navy-soft': '#243a5e',
        amber: '#D4A017',
        'amber-deep': '#B8870D',
        'amber-light': '#FFF9EC',
        'amber-warm': '#FDF6E3',
        muted: '#6B7280',
        border: '#E5E7EB',
        ink: '#0F1A2E',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,45,74,0.04), 0 6px 18px rgba(26,45,74,0.06)',
        lift: '0 20px 50px -12px rgba(26,45,74,0.18)',
        glow: '0 0 0 6px rgba(212,160,23,0.10), 0 18px 40px -12px rgba(212,160,23,0.35)',
        ring: '0 0 0 1px rgba(26,45,74,0.06)',
      },
      backgroundImage: {
        'amber-fade': 'linear-gradient(135deg,#D4A017 0%,#E5B53A 100%)',
        'navy-fade': 'linear-gradient(135deg,#1A2D4A 0%,#243a5e 100%)',
      },
    },
  },
  plugins: [],
}
