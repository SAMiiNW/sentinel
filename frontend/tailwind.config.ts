import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep indigo field
        abyss: {
          DEFAULT: '#070b18',
          900: '#070b18',
          800: '#0b1124',
          700: '#121a35',
          600: '#1b2547',
        },
        mist: '#e6ecff',
        haze: '#9aa6cc',
        faint: '#6b76a0',
        dim: '#4a5478',
        // accents
        teal: {
          DEFAULT: '#5eead4',
          soft: '#9af3e3',
          deep: '#2bb7a3',
        },
        violet: {
          DEFAULT: '#a78bfa',
          soft: '#c4b5fd',
        },
        compliant: '#5eead4',
        flagged: '#fbbf72',
        blocked: '#fb7185',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(94,234,212,0.35)',
        'glow-violet': '0 0 50px -10px rgba(167,139,250,0.4)',
        glass: '0 8px 40px -12px rgba(2,6,23,0.7), inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        riseup: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulsechip: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        flashframe: {
          '0%': {
            borderColor: 'rgba(94,234,212,0.9)',
            boxShadow: '0 0 0 0 rgba(94,234,212,0.45)',
          },
          '100%': {
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 18px rgba(94,234,212,0)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        riseup: 'riseup 0.6s ease-out forwards',
        pulsechip: 'pulsechip 1.6s ease-in-out infinite',
        flashframe: 'flashframe 1.4s ease-out forwards',
        shimmer: 'shimmer 2.2s linear infinite',
        orbit: 'orbit 14s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
