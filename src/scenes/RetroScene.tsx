import React from "react";
import { HUD } from "../components/player-utils/HUD.tsx";
import { ArcadeMachineScreens } from "../components/arcade-machines/ArcadeMachineScreens.tsx";
import { Signs } from "../components/signs/Signs.tsx";

const RetroScene: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="./images/retroArcade/retroFloor.png"
        alt="Retro Arcade Floor"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      <ArcadeMachineScreens
        className={
          "text-lg absolute top-[11.5%] z-10 font-arcade pointer-events-none overflow-hidden rounded-xl"
        }
        style={{
          top: "40.8vh",
          left: "10vw",
          width: "10vw",
          height: "10vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        name={"PIXEL INVADERS"}
        nameSigns={
          <Signs
            className={
              "text-cyan-100 text-shadow-neonCyan shadow-neonCyan text-lg absolute top-[11.5%] z-10 font-bold font-arcade pointer-events-none overflow-hidden"
            }
            style={{
              top: "26.8vh",
              left: "11vw",
              width: "12vw",
              transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
              transformOrigin: "center",
            }}
            signTitle={"PIXEL INVADERS"}
          />
        }
      />

      <ArcadeMachineScreens
        className={
          "text-md absolute top-[11.5%] z-10 font-bold font-arcade pointer-events-none overflow-hidden rounded-xl"
        }
        style={{
          top: "42.3vh",
          left: "31vw",
          width: "8vw",
          height: "8.5vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        name={"BUG SQUASH"}
        nameSigns={
          <Signs
            className={
              "text-cyan-100 text-shadow-neonCyan shadow-neonCyan text-lg absolute top-[11.5%] z-10 font-bold font-arcade pointer-events-none overflow-hidden"
            }
            style={{
              top: "29.5vh",
              left: "32.2vw",
              width: "9vw",
              transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
              transformOrigin: "center",
            }}
            signTitle={"BUG SQUASH"}
          />
        }
      />

      <ArcadeMachineScreens
        className={
          "text-sm absolute top-[11.5%] z-10 font-bold font-arcade pointer-events-none overflow-hidden rounded-xl"
        }
        style={{
          top: "43.3vh",
          left: "46.5vw",
          width: "6.5vw",
          height: "7.2vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        name={"404 RUNNER"}
        nameSigns={
          <Signs
            className={
              "text-cyan-100 text-shadow-neonCyan shadow-neonCyan text-sm absolute top-[11.5%] z-10 font-bold font-arcade pointer-events-none overflow-hidden"
            }
            style={{
              top: "32vh",
              left: "48vw",
              width: "7vw",
              transform: "rotate(4deg) skewX(9deg) skewY(2deg)",
              transformOrigin: "center",
            }}
            signTitle={"404 RUNNER"}
          />
        }
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <HUD className="px-6 py-2 rounded shadow-neonPink" />
      </div>
    </div>
  );
};

export default RetroScene;
