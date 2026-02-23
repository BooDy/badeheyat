import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": "#ffc800",
        "brand-blue": "#1D3557",
        "brand-light-blue": "#457B9D",
        "brand-yellow": "#F1FAEE",
      },
      fontFamily: {
        "display": ["var(--font-kufam)", "sans-serif"],
        "loud": ["var(--font-aref-ruqaa)", "serif"],
        "body": ["var(--font-cairo)", "sans-serif"],
        sans: ["var(--font-cairo)", "sans-serif"],
      },
      boxShadow: {
        "hard-red": "8px 8px 0px 0px #ffc800",
        "hard-blue": "8px 8px 0px 0px #1D3557",
        "hard-black": "6px 6px 0px 0px #000000",
      }
    },
  },
  plugins: [],
};
export default config;
