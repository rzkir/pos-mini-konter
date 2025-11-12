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
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#181A20",
        },
        secondary: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#23262F",
          900: "#1a1d24",
        },
        accent: {
          primary: "#FF9228",
          secondary: "#FF6B35",
          tertiary: "#FF4500",
          success: "#4CAF50",
          warning: "#FF9800",
          error: "#F44336",
          info: "#2196F3",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          disabled: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        status: {
          success: "#4CAF50",
          warning: "#FF9800",
          error: "#F44336",
          info: "#2196F3",
          star: "#FFB800",
        },
        background: "#FFFFFF",
        card: "#FFFFFF",
        border: "#E5E7EB",
        textSecondary: "#A1A5B7",
        overlay: "rgba(0,0,0,0.35)",
        overlayStrong: "rgba(24,26,32,0.85)",
      },
    },
  },
};
