import React from "react";
import { HUD } from "../components/HUD.tsx";
import { FakeArcadeRetroMachineScreen } from "../components/FakeArcadeMachineScreen.tsx";
import { VerticalSigns } from "../components/Signs.tsx";

const RetroScene: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="./images/retroArcade/retroFloor.png"
        alt="Retro Arcade Floor"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      <VerticalSigns
        className={
          " text-lg absolute top-[11.5%] z-10 text-purple-300 text-shadow-neonPurple animate-pulseNeonPurple font-bold font-arcade pointer-events-none border-orange-900 shadow-neonOrange overflow-hidden rounded-xl"
        }
        style={{
          top: "40.8vh",
          left: "10vw",
          width: "10vw",
          height: "10vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        title={"PIXEL INVADERS"}
      />

      <VerticalSigns
        className={
          "text-md absolute top-[11.5%] z-10 text-purple-300 text-shadow-neonPurple animate-pulseNeonPurple font-bold font-arcade pointer-events-none border-orange-900 shadow-neonOrange overflow-hidden rounded-xl"
        }
        style={{
          top: "42.3vh",
          left: "31vw",
          width: "8vw",
          height: "8.5vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        title={"BUG SQUASH"}
      />

      <VerticalSigns
        className={
          "text-sm absolute top-[11.5%] z-10 text-purple-300 text-shadow-neonPurple animate-pulseNeonPurple font-bold font-arcade pointer-events-none border-orange-900 shadow-neonOrange overflow-hidden rounded-xl"
        }
        style={{
          top: "43.3vh",
          left: "46.5vw",
          width: "6.5vw",
          height: "7.2vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
        title={"404 RUNNER"}
      />

      <FakeArcadeRetroMachineScreen
        className="absolute rounded-3xl border-2 border-orange-900 shadow-neonOrange"
        style={{
          top: "40.8vh",
          left: "10vw",
          width: "10vw",
          height: "10vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
      />
      <FakeArcadeRetroMachineScreen
        className="absolute rounded-3xl border-2 border-orange-900 shadow-neonOrange"
        style={{
          top: "42.3vh",
          left: "31vw",
          width: "8vw",
          height: "8.5vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
      />
      <FakeArcadeRetroMachineScreen
        className="absolute rounded-3xl border-2 border-orange-900 shadow-neonOrange"
        style={{
          top: "43.3vh",
          left: "46.5vw",
          width: "6.5vw",
          height: "7.2vw",
          transform: "rotate(4deg) skewX(15deg) skewY(-3deg)",
          transformOrigin: "center",
        }}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <HUD className="px-6 py-2 rounded shadow-neonPink" />
      </div>
    </div>
  );
};

export default RetroScene;
