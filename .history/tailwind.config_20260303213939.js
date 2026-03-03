/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1612",
        paper: "#F5F0E8",
        cream: "#EDE6D6",
        amber: "#C9813A",
        rust: "#9B3D2B",
        sage: "#4A6741",
        muted: "#8C7B6B",
        border: "#D9CEBB",
        // legacy aliases kept for any remaining uses
        primary: "#C9813A",
        secondary: "#4A6741",
        background: "#F5F0E8",
        surface: "#EDE6D6",
        textPrimary: "#1C1612",
        textSecondary: "#8C7B6B",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      borderRadius: {
        card: "6px",
        btn: "3px",
        input: "3px",
        full: "9999px",
      },
      boxShadow: {
        low: "2px 3px 10px rgba(28,22,18,0.06)",
        medium: "4px 6px 20px rgba(28,22,18,0.10)",
        high: "6px 10px 32px rgba(28,22,18,0.16)",
        lifted: "6px 12px 28px rgba(28,22,18,0.18)",
      },
      fontSize: {
        hero: ["52px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        section: ["32px", { lineHeight: "1.2" }],
        subsection: ["22px", { lineHeight: "1.3" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
        xs: ["12px", { lineHeight: "1.4" }],
        "2xs": ["11px", { lineHeight: "1.3" }],
      },
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite linear",
        fadeInUp: "fadeInUp 0.4s ease forwards",
        slideDown: "slideDown 0.25s ease forwards",
      },
    },
  },
  plugins: [],
};
