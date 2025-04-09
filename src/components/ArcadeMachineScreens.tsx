import React from "react";
import { gameColorVariants } from "../games/GameData.tsx";

interface ArcadeLandingMachineScreenI {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

interface ArcadeMachineScreensI {
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  onClick?: () => void;
}

export const ArcadeLandingMachineScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[300px] h-[210px] bg-black p-1 border-2 border-orange-900 shadow-neonOrange overflow-hidden rounded-xl">
        <div className="absolute top-2 left-3 w-2 h-2 bg-green-300 rounded-full animate-blink-neonOrange"></div>

        <div className="absolute bottom-2 left-1/2 w-6 h-2 bg-green-500 animate-player"></div>

        <div className="absolute top-4 left-[40%] w-5 h-2 bg-red-400 animate-enemy"></div>

        <div className="absolute top-1 left-[10%] w-1 h-1 bg-white animate-star delay-100"></div>
        <div className="absolute top-3 left-[70%] w-1 h-1 bg-white animate-star delay-300"></div>
        <div className="absolute top-6 left-[50%] w-1 h-1 bg-white animate-star delay-500"></div>
      </div>
    </div>
  );
};

export const RetroArcadeRetroMachineScreen: React.FC<
  ArcadeLandingMachineScreenI
> = ({ className, style, id }) => {
  return (
    <div
      id={`${id}`}
      className={`absolute rounded-xl border-2 border-orange-900 shadow-neonOrange bg-black 
      w-[20vw] h-[30vw] 
      sm:w-[18vw] sm:h-[28vw] 
      md:w-[16vw] md:h-[24vw] 
      lg:w-[14vw] lg:h-[20vw] 
      xl:w-[12vw] xl:h-[18vw]
      ${className}`}
      style={{
        transform: style?.transform,
        transformOrigin: style?.transformOrigin,
        ...style,
      }}
    ></div>
  );
};

export const ArcadeMachineScreens: React.FC<ArcadeMachineScreensI> = ({
  className,
  style,
  name = "ARCADE",
  onClick,
  id,
}) => {
  const { glow, text, pulse } =
    gameColorVariants[name] || gameColorVariants.DEFAULT;

  return (
    <div id={name}>
      <span
        onClick={onClick}
        className={`absolute font-arcade rounded-xl border-2 border-black-900 px-2 py-1
        ${text} ${glow} ${pulse} ${className} cursor-pointer transition-all`}
        style={{
          transform: style?.transform,
          transformOrigin: style?.transformOrigin,
          ...style,
        }}
      >
        {name}
      </span>
    </div>
  );
};
