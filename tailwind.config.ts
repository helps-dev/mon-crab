import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Cartoon palette pulled from the original site
        sky: {
          DEFAULT: "#0affff", // bright cyan sky
          deep: "#00c9d6",
        },
        sunny: "#ffd914", // title yellow
        candy: "#eb1c24", // button red
        ocean: "#0082fd", // roadmap blue
        seafoam: "#3ad29f",
        bamboo: "#2faa4a",
        sand: "#f4c64c",
        ink: "#0b0b0b", // outline black
        // Monad purple kept for the network utilities accents
        monad: {
          300: "#b39ef3",
          400: "#9a7def",
          500: "#836EF9",
          700: "#5a3fc0",
          900: "#200052",
        },
      },
      fontFamily: {
        display: ['"Some Time Later"', "system-ui", "sans-serif"],
        body: ["CCMaladroit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        comic: "0.5rem 0.5rem 0 #0b0b0b",
        "comic-sm": "0.3rem 0.3rem 0 #0b0b0b",
        "comic-lg": "0.75rem 0.75rem 0 #0b0b0b",
      },
      dropShadow: {
        pop: "0 12px 0 rgba(0,0,0,0.25)",
      },
      keyframes: {
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-1rem)" },
        },
        wobble: {
          "0%,100%": { transform: "rotate(-2.3deg)" },
          "50%": { transform: "rotate(2.3deg)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(2rem) scale(0.9)" },
          "70%": { transform: "translateY(-0.4rem) scale(1.03)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        sway: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "40%": { transform: "translateY(-18%) rotate(2deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        bob: "bob 5s ease-in-out infinite",
        wobble: "wobble 4s ease-in-out infinite",
        "pop-in": "pop-in 0.5s ease-out forwards",
        sway: "sway 6s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
        "spin-slow": "spin-slow 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
