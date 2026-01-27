
//C:\codingVibes\nuansasolution\.subpath\generator-surat-tanda-terima-v2\tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",   // soft blue
          soft: "#eff6ff"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        formal: ["Times New Roman", "Times", "serif"]
      },
      boxShadow: {
        soft: "0 10px 25px -5px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
