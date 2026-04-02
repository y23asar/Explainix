import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f1115",
        panel: "#171a21",
        accent: "#6366f1",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.2), 0 12px 30px rgba(6,8,20,0.45)",
      },
      animation: {
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
