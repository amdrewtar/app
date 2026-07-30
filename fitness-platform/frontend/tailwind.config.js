/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Placeholder brand palette — to be refined during the UI-polish stage.
        brand: {
          50: "#eefcf3",
          500: "#16a34a",
          600: "#15803d",
          900: "#052e16",
        },
      },
    },
  },
  plugins: [],
};
