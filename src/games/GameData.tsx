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
      top: "41%",
      left: "10%",
      width: "10%",
      height: "10%",
      transform: "rotate(4deg) skewX(12deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "-200%",
      left: "80%",
      transform: "translateX(-50%) rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-[1.25rem]",
  },
  {
    name: "BUG SQUASH",
    machineStyle: {
      top: "42.5%",
      left: "31%",
      width: "8%",
      height: "8.5%",
      transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "-200%",
      left: "85%",
      transform: "translateX(-50%) rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-[1.1rem]",
  },
  {
    name: "404 RUNNER",
    machineStyle: {
      top: "43.3%",
      left: "46.5%",
      width: "6.5%",
      height: "7.2%",
      transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
      transformOrigin: "center",
    },
    signStyle: {
      top: "-200%",
      left: "80%",
      transform: "translateX(-50%) rotate(4deg) skewX(9deg) skewY(2deg)",
      transformOrigin: "center",
    },
    textSize: "text-[1rem]",
  },
];
