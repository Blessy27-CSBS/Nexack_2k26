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
        darkBg: "#07080d",
        darkSurface: "#0d0f1a",
        darkCard: "#131627",
        darkBorder: "rgba(255, 255, 255, 0.08)",
        cyanNeon: "#00f0ff",
        purpleNeon: "#9d4edd",
        pinkNeon: "#ff007f",
        accentBlue: "#3a86ff",
        accentGreen: "#00f5d4"
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        heading: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Grotesk'", "sans-serif"]
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'neon-purple': '0 0 15px rgba(157, 78, 221, 0.35)',
        'neon-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08) 0%, transparent 70%)',
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
      }
    },
  },
  plugins: [],
}
