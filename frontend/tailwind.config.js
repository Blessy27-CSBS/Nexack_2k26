import colors from 'tailwindcss/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // High-contrast Dark theme obsidian foundations
        darkBg: "#07080a",
        darkSurface: "#0d0e12",
        darkCard: "#13151b",
        darkBorder: "rgba(255, 255, 255, 0.12)",
        emeraldNeon: "#10b981",
        amberNeon: "#f59e0b",
        purpleNeon: "#a855f7",
        pinkNeon: "#ec4899",
        limeNeon: "#22c55e",
        // System color overrides to eliminate blue theme globally
        cyan: colors.emerald,
        blue: colors.violet,
        slate: colors.zinc,
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        heading: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Grotesk'", "sans-serif"]
      },
      boxShadow: {
        'neon-emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.4)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'neon-glow': '0 0 25px rgba(16, 185, 129, 0.35)',
        'neon-cyan': '0 0 20px rgba(16, 185, 129, 0.4)', // alias legacy
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        'radial-amber': 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)'
      },
      keyframes: {
        textShimmer: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' }
        }
      },
      animation: {
        'text-shimmer': 'textShimmer 4s ease infinite',
        'marquee': 'marquee 30s linear infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

