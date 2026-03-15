import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────
      colors: {
        ember: {
          DEFAULT: '#FF4D1A',
          light:   '#FF7A4D',
          dark:    '#CC3600',
        },
        amber: {
          DEFAULT: '#E8900A',
          light:   '#F5B030',
        },
        forest: {
          DEFAULT: '#1B3D2A',
          mid:     '#2A5C3F',
          light:   '#3D7A57',
        },
        charcoal: '#0D1710',
        midnight: '#060D09',
        steel:    '#3A4F44',
        sage:     '#7BA893',
        ivory: {
          DEFAULT: '#F5F0E8',
          dim:     '#E3DDD4',
        },
      },

      // ── Typography ──────────────────────────────────────
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        ui:      ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'Fira Code', 'monospace'],
        // Tailwind shorthand aliases
        sans:    ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        serif:   ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['60px', { lineHeight: '1.0',  letterSpacing: '-0.02em', fontWeight: '500' }],
        'h1':      ['36px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2':      ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':      ['18px', { lineHeight: '1.35', fontWeight: '600' }],
        'body':    ['15px', { lineHeight: '1.75', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.65', fontWeight: '300' }],
        'label':   ['11px', { lineHeight: '1.4',  letterSpacing: '0.12em', fontWeight: '500' }],
      },

      // ── Spacing ─────────────────────────────────────────
      // Extends Tailwind's default scale — uses same numeric keys
      spacing: {
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },

      // ── Border Radius ────────────────────────────────────
      borderRadius: {
        'brand-sm': '2px',   // tags, badges
        'brand-md': '4px',   // buttons, inputs
        'brand-lg': '8px',   // cards, modals
        'brand-xl': '12px',  // large containers
      },

      // ── Backgrounds ──────────────────────────────────────
      backgroundColor: {
        'page':    '#0D1710',
        'surface': '#1B3D2A',
        'card':    '#0D1710',
        'deep':    '#060D09',
      },

      // ── Animation ────────────────────────────────────────
      transitionTimingFunction: {
        'brand-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'brand-spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'fast':  '150ms',
        'base':  '200ms',
        'slow':  '400ms',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.4s ease infinite',
        'fade-in':   'fade-in 150ms ease-out',
        'slide-up':  'slide-up 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
