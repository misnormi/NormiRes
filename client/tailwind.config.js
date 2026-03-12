/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        normi: {
          green: '#5cb85c',
          'green-dark': '#4cae4c',
          sidebar: '#2d5a2d',
          'sidebar-light': '#3d6b3d',
        },
      },
    },
  },
  plugins: [],
};
