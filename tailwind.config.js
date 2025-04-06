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
      animation: {
        screenflicker: "flicker 4s infinite",
        flicker: "flicker 10s infinite",
        blink: "blink 1s steps(2, start) infinite",
        enemy: "enemyMove 2s linear infinite",
        player: "playerPulse 1s ease-in-out infinite",
        star: "twinkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        screenflicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
            filter: "drop-shadow(0 0 4px #0ff) drop-shadow(0 0 8px #0ff)",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            filter: "none",
          },
        },
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
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        enemyMove: {
          "0%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(20px)" },
          "100%": { transform: "translateX(0px)" },
        },
        playerPulse: {
          "0%, 100%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(1.2)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
