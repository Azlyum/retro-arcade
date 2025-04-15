export const gameColorVariants: Record<
  string,
  { glow: string; text: string; pulse: string }
> = {
  "PIXEL INVADERS": {
    glow: "shadow-neonCyan",
    text: "text-cyan-300 text-shadow-neonCyan",
    pulse: "animate-pulseNeonCyan",
  },
  "BUG SQUASH": {
    glow: "shadow-neonGreen",
    text: "text-green-300 text-shadow-neonGreen",
    pulse: "animate-pulseNeonGreen",
  },
  "404 RUNNER": {
    glow: "shadow-neonPink",
    text: "text-pink-300 text-shadow-neonPink",
    pulse: "animate-pulseNeonPink",
  },
  DEFAULT: {
    glow: "shadow-neonYellow",
    text: "text-yellow-300 text-shadow-neonYellow",
    pulse: "animate-pulseNeonYellow",
  },
};

export const machines = [
  {
    name: "PIXEL INVADERS",
    machineStyle: {
      top: "40.8vh",
      left: "9.8vw",
      width: "10vw",
      height: "10vw",
      transform: "rotate(4deg) skewX(12deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "26.8vh",
      left: "11vw",
      width: "12vw",
      transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-lg",
  },
  {
    name: "BUG SQUASH",
    machineStyle: {
      top: "42.3vh",
      left: "31vw",
      width: "8vw",
      height: "8.5vw",
      transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "29.5vh",
      left: "32.2vw",
      width: "9vw",
      transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-md",
  },
  {
    name: "404 RUNNER",
    machineStyle: {
      top: "43.3vh",
      left: "46.5vw",
      width: "6.5vw",
      height: "7.2vw",
      transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "32vh",
      left: "48vw",
      width: "7vw",
      transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-sm",
  },
];
