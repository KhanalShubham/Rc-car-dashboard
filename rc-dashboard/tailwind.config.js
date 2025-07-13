/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // A clean, technical font for text
        sans: ['Rajdhani', 'sans-serif'],
        // A digital-style font for numbers/gears
        mono: ['DSEG7-Classic', 'monospace'],
      },
      colors: {
        'dash-bg': '#1a1a1a',
        'dash-bg-light': '#2b2b2b',
        'dash-text': '#e0e0e0',
        'dash-text-muted': '#888888',
        'safe': '#00b0f0',      // Blue
        'optimal': '#50c878',   // Green
        'warning': '#f0e68c',   // Yellow
        'danger': '#dc2626',    // Red
      },
    },
  },
  plugins: [],
};