/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // CRA source files
    "./public/index.html"
  ],
  darkMode: "class", // ✅ enable dark mode via .dark class
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // primary brand orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      transitionProperty: {
        colors: "background-color, border-color, color, fill, stroke",
        spacing: "margin, padding, gap",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // ✅ better form styles
    require("@tailwindcss/typography"), // ✅ better prose text
  ],
};
