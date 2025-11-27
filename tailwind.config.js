/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duft: {
          primary: "#8672ff",
          dark: "#1f2937",
        },
      },
      boxShadow: {
        "duft-soft": "0 4px 6px rgba(0,0,0,0.1)",
        "duft-strong": "0 6px 10px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
}
