/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#22C55E",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        textPrimary: "#111827",
        textSecondary: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        7: "1.75rem",
        9: "2.25rem",
        11: "2.75rem",
        13: "3.25rem",
        15: "3.75rem",
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        low: "0 1px 3px rgba(0,0,0,0.1)",
        medium: "0 4px 12px rgba(0,0,0,0.1)",
        high: "0 8px 24px rgba(0,0,0,0.15)",
      },
      fontSize: {
        hero: ["48px", { lineHeight: "1.1" }],
        section: ["30px", { lineHeight: "1.2" }],
        subsection: ["24px", { lineHeight: "1.2" }],
        body: ["16px", { lineHeight: "1.5" }],
        small: ["14px", { lineHeight: "1.4" }],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
