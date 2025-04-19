import React from "react";
import { HUD } from "../components/player-utils/HUD.tsx";
import { ArcadeMachineScreens } from "../components/arcade-machines/ArcadeMachineScreens.tsx";
import { machines } from "../games/GameData.tsx";
import { Signs } from "../components/signs/Signs.tsx";

const RetroScene = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden ">
      <img
        src="./images/retroArcade/retroFloor.png"
        alt="Retro Arcade Floor"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      {machines.map((machine) => (
        <ArcadeMachineScreens
          key={machine.name}
          name={machine.name}
          style={machine.machineStyle}
          className={`absolute z-10 font-arcade pointer-events-none overflow-hidden rounded-2xl ${machine.textSize}`}
          nameSigns={
            <Signs
              className={`text-cyan-100 text-shadow-neonCyan shadow-neonCyan absolute font-arcade font-bold pointer-events-none overflow-hidden ${machine.textSize}`}
              style={machine.signStyle}
              signTitle={machine.name}
            />
          }
        />
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <HUD className="px-6 py-2 rounded shadow-neonPink" />
      </div>
    </div>
  );
};

export default RetroScene;
