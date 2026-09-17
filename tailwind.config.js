/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F6F2',
        surface: '#FFFFFF',
        ink: '#1e293b', // charcoal
        accent: '#14b8a6', // muted teal
      }
    },
  },
  plugins: [],
}
