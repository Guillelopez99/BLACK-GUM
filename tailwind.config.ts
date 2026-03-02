import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0b",
        bone: "#f5f0e8",
        gum: "#c7422e",
        moss: "#1b2a26",
        fog: "#d7d1c5",
        ember: "#f1a93a"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(199, 66, 46, 0.35)",
        soft: "0 20px 60px rgba(12, 12, 12, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
