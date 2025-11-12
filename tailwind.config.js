/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : "class",
  content: [
    "./app/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./components/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./utils/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./*.{html,js,jsx,ts,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  important: "html",
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F4FD",
          100: "#D1E9FB",
          200: "#A3D3F7",
          300: "#75BDF3",
          400: "#47A7EF",
          500: "#1E90FF",
          600: "#1873CC",
          700: "#125699",
          800: "#0C3A66",
          900: "#061D33",
        },
        secondary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        accent: {
          primary: "#1E90FF",
          secondary: "#0EA5E9",
          tertiary: "#10B981",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          tertiary: "#6B7280",
          disabled: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
          star: "#FBBF24",
        },
        background: "#F9FAFB",
        card: "#FFFFFF",
        border: "#E5E7EB",
        textSecondary: "#6B7280",
        overlay: "rgba(0,0,0,0.4)",
        overlayStrong: "rgba(15,23,42,0.85)",
      },
    },
  },
};
