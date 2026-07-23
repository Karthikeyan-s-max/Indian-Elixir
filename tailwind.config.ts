import type { Config } from "tailwindcss";

// Design tokens pulled directly from the final Indian Elixir Figma file
// (Stitch-generated, refined by hand). Do not eyeball-approximate these —
// they are the real hex values used across every screen in the design.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FEF9EF", // page background
          card: "#F8F3E9",     // card / input background
          line: "#F2EDE3",     // subtle dividers, icon chips
        },
        forest: {
          DEFAULT: "#082719", // primary dark - headings, nav active bg, dark sections
          50: "#EAF0EC",
          400: "#1F3D2E",     // secondary dark green (CTA sections, badges)
          600: "#082719",
          900: "#051610",
        },
        copper: {
          DEFAULT: "#83540B", // accent - CTAs, prices, links, active states
          100: "#F1DFC0",
          700: "#6B4409",
        },
        sage: {
          DEFAULT: "#C8EBD5", // light mint accent on dark backgrounds
        },
        peach: {
          DEFAULT: "#FFDDB7", // admin active nav highlight
          ink: "#2A1700",
        },
        ink: {
          DEFAULT: "#082719", // headings
          muted: "#424844",    // body copy
          border: "#C2C8C2",   // hairline borders (used at ~30% opacity)
        },
      },
      fontFamily: {
        display: ["var(--font-literata)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0px 12px 24px -10px rgba(31,61,46,0.08)",
        soft: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        popover: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "leaf-texture": "radial-gradient(circle at 20% 20%, rgba(139,154,91,0.08), transparent 40%)",
      },
    },
  },
  plugins: [],
};
export default config;
