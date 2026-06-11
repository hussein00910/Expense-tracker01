/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
        accent: {
          green: "#00ff41",
          cyan: "#00d4ff",
          red: "#ff3333",
          yellow: "#ffcc00",
        },
        text: {
          primary: "#e0e0e0",
          secondary: "#888888",
          muted: "#555555",
        },
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
