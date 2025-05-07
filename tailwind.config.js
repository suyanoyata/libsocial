/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,jsx,ts,tsx}", "!./node_modules/**"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        violet: {
          50: "#f1f2fc",
          100: "#e6e6f9",
          200: "#d2d2f3",
          300: "#b8b7ea",
          400: "#a099e0",
          500: "#8f80d4",
          600: "#7f66c5",
          700: "#6750a4",
          800: "#59478c",
          900: "#4b3f70",
          950: "#2d2541",
        },
      },
    },
  },
  plugins: [],
};
