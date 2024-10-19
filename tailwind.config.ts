import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-aqua": "#1c7f81",
        "custom-yellow": "#fadd91",
        "custom-coral": "#ff8077",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Add this line if you installed the typography plugin
  ],
};
export default config;
