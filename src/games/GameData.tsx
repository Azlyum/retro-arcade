import React from "react";

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
