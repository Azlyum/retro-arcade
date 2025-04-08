import React from "react";

interface VerticalSignsI {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: () => void;
}

export const VerticalSigns: React.FC<VerticalSignsI> = ({
  className,
  style,
  title = "ARCADE",
  onClick,
}) => {
  const { glow, text, pulse } = colorVariants[title] || colorVariants.DEFAULT;

  return (
    <h2
      onClick={onClick}
      className={`absolute font-arcade rounded-xl border-2 border-black-900 px-2 py-1
        ${text} ${glow} ${pulse} ${className} cursor-pointer transition-all`}
      style={{
        transform: style?.transform,
        transformOrigin: style?.transformOrigin,
        ...style,
      }}
    >
      {title}
    </h2>
  );
};

const colorVariants: Record<
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
