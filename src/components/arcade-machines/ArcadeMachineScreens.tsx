import React from "react";

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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 bg-green-500 animate-pulse"></div>
        <div className="absolute top-4 left-[10%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[30%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[50%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[70%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-4 left-[90%] w-3 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute top-8 left-[15%] w-1 h-2 bg-yellow-400 animate-bounce"></div>
        <div className="absolute top-6 left-[55%] w-1 h-2 bg-yellow-400 animate-bounce"></div>
        <div className="absolute top-10 left-[85%] w-1 h-2 bg-yellow-400 animate-bounce"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1 left-1 text-cyan-300 text-xs font-arcade">
          SCORE: 1250
        </div>
      </div>
    </div>
  );
};

export const BugSquashScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative bottom-6 w-[260px] h-[120px] bg-black p-1 border-2 border-green-900 shadow-neonGreen overflow-hidden rounded-xl">
        <div className="grid grid-cols-3 gap-1 w-full h-full p-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="relative border border-green-800 bg-slate-900/80 rounded"
            >
              {i === 6 && (
                <div className="absolute inset-0 flex items-center justify-center text-lg">
                  🐛
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-1 left-1 text-green-300 text-[10px] font-arcade">
          SQUASH 'EM!
        </div>
      </div>
    </div>
  );
};

export const RunnerScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative bottom-6 w-[220px] h-[110px] bg-black p-1 border-2 border-red-900 shadow-neonRed overflow-hidden rounded-xl">
        <div className="text-red-300">COMING SOON</div>
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
  return (
    <div id={name} className="absolute" style={style}>
      <div className="relative w-full h-full">
        {nameSigns}
        {name === "PIXEL INVADERS" && (
          <div
            onClick={onClick}
            className="absolute top-[50%] left-[5%] w-[90%] h-[25%] z-0 cursor-pointer"
          >
            <PixelInvadersScreen />
          </div>
        )}

        {name === "BUG SQUASH" && (
          <div
            onClick={onClick}
            className="absolute top-[50%] left-[5%] w-[90%] h-[25%] z-0 cursor-pointer"
          >
            <BugSquashScreen />
          </div>
        )}

        {name === "RUNNER" && (
          <div
            onClick={onClick}
            className="absolute top-[50%] left-[5%] w-[90%] h-[25%] z-0 cursor-pointer"
          >
            <RunnerScreen />
          </div>
        )}
      </div>
    </div>
  );
};
