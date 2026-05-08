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
        navy: '#0A0A0A',
        'navy-soft': '#1F1F1F',
        amber: '#FACC15',
        'amber-deep': '#CA8A04',
        'amber-light': '#FEFCE8',
        'amber-warm': '#FEF9C3',
        muted: '#525252',
        border: '#E5E5E5',
        ink: '#000000',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.06)',
        lift: '0 20px 50px -12px rgba(0,0,0,0.18)',
        glow: '0 0 0 6px rgba(250,204,21,0.18), 0 18px 40px -12px rgba(250,204,21,0.45)',
        ring: '0 0 0 1px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'amber-fade': 'linear-gradient(135deg,#FACC15 0%,#FDE047 100%)',
        'navy-fade': 'linear-gradient(135deg,#0A0A0A 0%,#1F1F1F 100%)',
      },
    },
  },
  plugins: [],
}
