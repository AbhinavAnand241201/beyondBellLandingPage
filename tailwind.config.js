/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow-brand': '#F5A400',
        'yellow-light': '#FFF4DC',
        'yellow-dark': '#D68F00',
        'brand-black': '#111111',
        'brand-navy': '#1A2D4E',
        'brand-grey': '#F7F7F7',
        'brand-border': '#E5E5E5',
        'brand-muted': '#6B7280',
      },
    },
  },
  plugins: [],
}
