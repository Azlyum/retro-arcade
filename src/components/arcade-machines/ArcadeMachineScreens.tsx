import React from "react";
import { gameColorVariants } from "../../games/GameStyleData.tsx";

interface ArcadeMachineScreensI {
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  onClick?: () => void;
  nameSigns?: React.ReactNode;
}

interface ArcadeMachineScreensI {
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  onClick?: () => void;
  nameSigns?: React.ReactNode;
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

export const ArcadeMachineScreens: React.FC<ArcadeMachineScreensI> = ({
  className,
  style,
  name = "ARCADE",
  onClick,
  nameSigns,
}) => {
  const { glow, text, pulse } =
    gameColorVariants[name] || gameColorVariants.DEFAULT;

  return (
    <div id={name} className="absolute" style={style}>
      <div className="relative w-full h-full">
        {nameSigns}
        <span
          onClick={onClick}
          className={`absolute top-1 left-1/2 -translate-x-1/2 
          font-arcade rounded-xl px-2 py-1 
          ${text} ${glow} ${pulse} ${className} cursor-pointer transition-all`}
        >
          {name}
        </span>
      </div>
    </div>
  );
};
