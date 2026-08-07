import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        border: "#27272a",
        muted: "#71717a",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        premium:
          "0 20px 60px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};

export default config;