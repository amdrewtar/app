/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system fixed in fitness-app-architecture.md п.7.5 — do not
        // reintroduce the earlier amber/teal/monochrome variants, this is
        // the approved final palette.
        surface: "#F4F4F3",
        border: "#EAEAE8",
        ink: {
          DEFAULT: "#15171B",
          secondary: "#6B7076",
          tertiary: "#A0A4AA",
        },
        brand: {
          50: "#EFECFC",
          400: "#8F7FF5",
          500: "#6C5CE0",
          600: "#5A4BCB",
        },
        hero: "#121216",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "22px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,22,27,.04), 0 12px 30px rgba(20,22,27,.06)",
        glow: "0 10px 24px rgba(108,92,224,.35)",
      },
    },
  },
  plugins: [],
};

