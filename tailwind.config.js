/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(56,189,248,0.14), transparent 28%)",
      },
    },
  },
  plugins: [],
};
