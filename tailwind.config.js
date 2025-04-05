/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['"Press Start 2P"', "monospace"],
      },
      boxShadow: {
        neon: "0 0 10px rgba(0,255,255,0.7), 0 0 20px rgba(0,255,255,0.5)",
      },
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
            filter: "drop-shadow(0 0 4px #0ff) drop-shadow(0 0 8px #0ff)",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            filter: "none",
          },
        },
      },
      animation: {
        flicker: "flicker 2s infinite",
      },
    },
  },
  plugins: [],
};
