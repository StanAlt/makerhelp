/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ember: { DEFAULT: '#FF4D1A', light: '#FF7A4D', dark: '#CC3600' },
        forest: { DEFAULT: '#1B3D2A', mid: '#2A5C3F', light: '#3D7A57' },
        charcoal: '#0D1710',
        midnight: '#060D09',
        steel: '#3A4F44',
        sage: '#7BA893',
        ivory: { DEFAULT: '#F5F0E8', dim: '#E3DDD4' },
        amber: { DEFAULT: '#E8900A', light: '#F5B030' },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        ui: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        badge: '2px',
        btn: '4px',
        card: '8px',
        container: '12px',
      },
    },
  },
  plugins: [],
}
