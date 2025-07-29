import React from "react";
import { gameColorVariants } from "../../games/GameStyleData";

interface ArcadeMachineScreensI {
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  onClick?: () => void;
  nameSigns?: React.ReactNode;
}

export const PixelInvadersScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative bottom-6 w-[350px] h-[130px] bg-black p-1 border-2 border-cyan-900 shadow-neonCyan overflow-hidden rounded-xl">
        {/* Player ship */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 bg-green-500 animate-pulse"></div>

        {/* Enemy ships */}
        <div className="absolute top-4 left-[10%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[30%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[50%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[70%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[90%] w-3 h-2 bg-red-400 animate-pulse"></div>

        {/* Bullets */}
        <div className="absolute top-8 left-[15%] w-1 h-2 bg-yellow-400 animate-bounce"></div>
        <div className="absolute top-6 left-[55%] w-1 h-2 bg-yellow-400 animate-bounce"></div>
        <div className="absolute top-10 left-[85%] w-1 h-2 bg-yellow-400 animate-bounce"></div>

        {/* Power-up indicator */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>

        {/* Score display */}
        <div className="absolute top-1 left-1 text-cyan-300 text-xs font-arcade">
          SCORE: 1250
        </div>
      </div>
    </div>
  );
};

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

        {/* Game screen preview for Pixel Invaders - positioned on the cabinet */}
        {name === "PIXEL INVADERS" && (
          <div
            onClick={onClick}
            className="absolute top-[50%] left-[5%] w-[90%] h-[25%] z-0 cursor-pointer"
          >
            <PixelInvadersScreen />
          </div>
        )}

        <span>{name}</span>
      </div>
    </div>
  );
};
