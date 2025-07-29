import React, { useState } from "react";
import { Canvas } from "./gameCanvas";

export const PixelInvadersStartScreen = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameOver">(
    "start"
  );
  const [finalScore, setFinalScore] = useState<number>(0);
  const [gameIDKey, setGameIDKey] = useState<number>(
    Math.floor(Math.random() * 50000000000)
  );
  /*Logging this for future backend*/
  console.log("New game started with key:", gameIDKey);

  return (
    <>
      {/* Game Container - Full Size */}
      <div className="relative w-full h-[95vh] border-4 border-cyan-400 flex items-center justify-center bg-black text-white font-press-start">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="absolute z-10 text-center space-y-4 p-6 bg-black/80 rounded-xl border-4 border-cyan-400">
            <h1 className="text-2xl mb-4">👾 Pixel Invaders</h1>
            <p>Move with ⬅️ ➡️ or A/D</p>
            <p>Shoot with SPACE</p>
            <p className="text-sm text-cyan-300">
              Defeat bugs to reveal portfolio facts!
            </p>
            <button
              className="mt-6 px-4 py-2 bg-cyan-400 text-black rounded-lg"
              onClick={() => setGameState("playing")}
            >
              Start Debugger Mode
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameOver" && (
          <div className="absolute z-10 text-center space-y-4 p-6 bg-black/80 rounded-xl border-4 border-red-500 text-white">
            <h1 className="text-2xl">💀 Game Over</h1>
            <p>Score: {finalScore}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-black rounded-lg"
              onClick={() => {
                setGameState("start");
                setGameIDKey(Math.floor(Math.random() * 50000000000));
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Game Canvas */}
        {gameState === "playing" && (
          <Canvas
            onGameOver={(score: number) => {
              setGameState("gameOver");
              setFinalScore(score);
            }}
          />
        )}
      </div>
    </>
  );
};
