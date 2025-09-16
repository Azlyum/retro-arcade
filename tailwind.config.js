/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['"Press Start 2P"', "monospace"],
      },
      boxShadow: {
        neonCyan: "0 0 10px rgba(0,255,255,0.7), 0 0 20px rgba(0,255,255,0.5)",
        neonPink: "0 0 10px rgba(255,0,170,0.7), 0 0 20px rgba(255,0,170,0.5)",
        neonGreen: "0 0 10px rgba(0,255,100,0.7), 0 0 20px rgba(0,255,100,0.5)",
        neonPurple:
          "0 0 10px rgba(150,0,255,0.7), 0 0 20px rgba(150,0,255,0.5)",
        neonRed: "0 0 10px rgba(255,0,0,0.7), 0 0 20px rgba(255,0,0,0.5)",
        neonYellow: "0 0 8px rgba(255,255,0,0.6), 0 0 16px rgba(255,255,0,0.4)",
        neonBlue: "0 0 8px rgba(0,150,255,0.5), 0 0 16px rgba(0,150,255,0.3)",
        softIce:
          "0 0 6px rgba(180,255,255,0.3), 0 0 12px rgba(180,255,255,0.2)",
        neonTeal: "0 0 10px rgba(0,255,200,0.6), 0 0 20px rgba(0,255,200,0.4)",
        neonMint: "0 0 10px rgba(0,255,180,0.6), 0 0 20px rgba(0,255,180,0.4)",
        neonOrange: "0 0 8px rgba(255,165,0,0.6), 0 0 16px rgba(255,140,0,0.4)",
        neonPeach:
          "0 0 8px rgba(255,204,153,0.5), 0 0 16px rgba(255,178,102,0.4)",
        neonRose:
          "0 0 8px rgba(255,102,178,0.5), 0 0 16px rgba(255,153,204,0.4)",
        softWhite:
          "0 0 6px rgba(255,255,255,0.3), 0 0 10px rgba(255,255,255,0.2)",
        hardWhite:
          "0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)",
        grayGlow:
          "0 0 6px rgba(100,100,100,0.4), 0 0 12px rgba(120,120,120,0.3)",
        goldGlow: "0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)",
        silverGlow:
          "0 0 8px rgba(192,192,192,0.6), 0 0 16px rgba(211,211,211,0.4)",
        bronzeGlow:
          "0 0 8px rgba(205,127,50,0.6), 0 0 16px rgba(184,115,51,0.4)",
        rainbow: "0 0 8px #ff00ff, 0 0 16px #00ffff, 0 0 24px #ffff00",
        glitch: "0 0 4px #0ff, -1px 0 6px #f0f, 1px 0 6px #ff0",
        lowGlow: "0 0 6px rgba(0,255,255,0.2), 0 0 8px rgba(0,255,255,0.1)",
        screenGlow:
          "0 0 4px #00ffc3, 0 0 10px #00ffc3, inset 0 0 12px rgba(0,255,204,0.1), 0 0 20px rgba(0,255,204,0.3)",
      },

      backgroundImage: {
        screenRadial: "radial-gradient(circle at center, #0a0a0a 40%, #000)",
      },

      borderColor: {
        screenGlow: "#00ffc3",
      },

      textShadow: {
        neonCyan: "0 0 4px #0ff, 0 0 8px #0ff",
        neonPink: "0 0 4px #ff00aa, 0 0 8px #ff00aa",
        neonGreen: "0 0 4px #00ff66, 0 0 8px #00ff66",
        neonYellow: "0 0 4px #ffff00, 0 0 8px #ffff00",
        neonPurple: "0 0 4px #9600ff, 0 0 8px #9600ff",
        neonRed: "0 0 4px #ff0000, 0 0 8px #ff0000",
        neonWhite: "0 0 4px #fff, 0 0 8px #fff",
        neonRainbow: "0 0 3px #ff00ff, 0 0 6px #00ffff, 0 0 9px #ffff00",
      },

      animation: {
        screenflicker: "screenflicker 4s infinite",
        flicker: "flicker 10s infinite",
        blink: "blink 1s steps(2, start) infinite",
        enemy: "enemyMove 2s linear infinite",
        player: "playerPulse 1s ease-in-out infinite",
        star: "twinkle 1.5s ease-in-out infinite",
        pulseNeonCyan: "pulseNeonCyan 2s ease-in-out infinite",
        pulseNeonPink: "pulseNeonPink 2s ease-in-out infinite",
        pulseNeonGreen: "pulseNeonGreen 2s ease-in-out infinite",
        pulseNeonYellow: "pulseNeonYellow 2s ease-in-out infinite",
        pulseNeonPurple: "pulseNeonPurple 2s ease-in-out infinite",
        pulseNeonRed: "pulseNeonRed 2s ease-in-out infinite",
        pulseRainbow: "pulseRainbow 3s ease-in-out infinite",
        refreshSweep: "refreshSweep 2s linear infinite",
        sweepDown: "sweepDown 16s linear infinite",
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
        pulseNeonCyan: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(0,255,255,0.6)) drop-shadow(0 0 8px rgba(0,255,255,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(0,255,255,1)) drop-shadow(0 0 12px rgba(0,255,255,0.6))",
          },
        },
        pulseNeonPink: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(255,0,170,0.6)) drop-shadow(0 0 8px rgba(255,0,170,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(255,0,170,1)) drop-shadow(0 0 12px rgba(255,0,170,0.6))",
          },
        },
        pulseNeonGreen: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(0,255,100,0.6)) drop-shadow(0 0 8px rgba(0,255,100,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(0,255,100,1)) drop-shadow(0 0 12px rgba(0,255,100,0.6))",
          },
        },
        pulseNeonYellow: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(255,255,0,0.6)) drop-shadow(0 0 8px rgba(255,255,0,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(255,255,0,1)) drop-shadow(0 0 12px rgba(255,255,0,0.6))",
          },
        },
        pulseNeonPurple: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(150,0,255,0.6)) drop-shadow(0 0 8px rgba(150,0,255,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(150,0,255,1)) drop-shadow(0 0 12px rgba(150,0,255,0.6))",
          },
        },
        pulseNeonRed: {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 4px rgba(255,0,0,0.6)) drop-shadow(0 0 8px rgba(255,0,0,0.3))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 6px rgba(255,0,0,1)) drop-shadow(0 0 12px rgba(255,0,0,0.6))",
          },
        },
      },
      pulseRainbow: {
        "0%": {
          filter: "drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 8px #00ffff)",
        },
        "50%": {
          filter: "drop-shadow(0 0 6px #00ffff) drop-shadow(0 0 12px #ffff00)",
        },
        "100%": {
          filter: "drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 8px #00ffff)",
        },
      },
      refreshSweep: {
        "0%": {
          transform: "translateY(-100vh)",
          opacity: "1",
        },
        "100%": {
          transform: "translateY(100vh)",
          opacity: "1",
        },
      },
      sweepDown: {
        "0%": {
          transform: "translateY(-100vh) translateX(0px)",
          opacity: "0",
        },
        "5%": {
          opacity: "0.6",
        },
        "25%": {
          transform: "translateY(-75vh) translateX(2px)",
          opacity: "0.8",
        },
        "50%": {
          transform: "translateY(-50vh) translateX(-1px)",
          opacity: "1",
        },
        "75%": {
          transform: "translateY(-25vh) translateX(1px)",
          opacity: "0.8",
        },
        "95%": {
          opacity: "0.6",
        },
        "100%": {
          transform: "translateY(100vh) translateX(0px)",
          opacity: "0",
        },
      },
    },
  },

  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    },
  ],
};
