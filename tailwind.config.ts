import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '360px',
        'xs': '480px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#7C3AED",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7C3AED",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        }
      },
      fontSize: {
        'hero': ['clamp(1.85rem, 3.5vw + 0.5rem, 3.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'page-title': ['clamp(1.75rem, 3.2vw + 0.5rem, 3.5rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(1.35rem, 2.2vw + 0.5rem, 2.5rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        'card-title': ['clamp(1rem, 1vw + 0.5rem, 1.35rem)', { lineHeight: '1.3' }],
        'body-lg': ['clamp(0.95rem, 0.5vw + 0.6rem, 1.125rem)', { lineHeight: '1.6' }],
        'body': ['clamp(0.875rem, 0.3vw + 0.6rem, 1rem)', { lineHeight: '1.5' }],
        'caption': ['clamp(0.75rem, 0.2vw + 0.55rem, 0.875rem)', { lineHeight: '1.4' }],
        'micro': ['clamp(0.6875rem, 0.1vw + 0.45rem, 0.75rem)', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
};
export default config;
