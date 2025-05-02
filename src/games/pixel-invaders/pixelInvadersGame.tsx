import React, { useState } from "react";
import { Canvas } from "./GameCanvas.tsx";

export const PixelInvadersStartScreen = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div
      className="relative w-[65vw] h-[95vh] border-4 border-cyan-400 flex items-center justify-center bg-black text-white font-press-start"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      {!gameStarted && (
        <div className="absolute z-10 text-center space-y-4 p-6 bg-black/80 rounded-xl border-4 border-cyan-400">
          <h1 className="text-2xl mb-4">👾 Pixel Invaders</h1>
          <p>Move with ⬅️ ➡️ or A/D</p>
          <p>Shoot with SPACE</p>
          <p className="text-sm text-cyan-300">
            Defeat bugs to reveal portfolio facts!
          </p>
          <button
            className="mt-6 px-4 py-2 bg-cyan-400 text-black rounded-lg"
            onClick={() => setGameStarted(true)}
          >
            Start Debugger Mode
          </button>
        </div>
      )}

      {gameStarted && <Canvas />}
    </div>
  );
};
