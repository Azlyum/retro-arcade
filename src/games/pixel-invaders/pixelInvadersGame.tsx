import React, { useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";
import { Canvas } from "./GameCanvas";
import { AudioPaths } from "./audioPaths";
import { AudioManager } from "./audioManager";

export const PixelInvadersStartScreen = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameOver">(
    "start"
  );
  const [finalScore, setFinalScore] = useState<number>(0);

  /*Logging this for future backend*/
  const [, setGameIDKey] = useState<number>(
    Math.floor(Math.random() * 50000000000)
  );

  const musicRef = useRef<Howl | null>(null);
  const [muted, setMuted] = useState(false);
  const transitionKey = useMemo(
    () => `${gameState}-${finalScore}`,
    [gameState, finalScore]
  );

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.stop();
      musicRef.current.unload();
      musicRef.current = null;
    }

    let src: string | null = null;
    if (gameState === "start" || gameState === "gameOver") {
      src = AudioPaths.mainMenu;
    } else if (gameState === "playing") {
      src = AudioPaths.gamePlaying;
    }

    if (src) {
      const sound = new Howl({
        src: [src],
        volume: 0.25,
        loop: true,
        mute: muted,
      });
      musicRef.current = sound;
      sound.play();
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.stop();
        musicRef.current.unload();
        musicRef.current = null;
      }
    };
  }, [gameState, muted]);

  useEffect(() => {
    AudioManager.setMuted(muted);
  }, [muted]);

  return (
    <>
      <div
        className={`relative w-full h-[95vh] border-4 border-cyan-400 flex items-center justify-center bg-black text-white font-press-start transition-opacity duration-500 ${
          gameState === "playing" ? "opacity-100" : "opacity-95"
        }`}
        key={transitionKey}
      >
        <button
          className="absolute top-4 right-32 md:right-40 z-50 px-3 py-1 text-xs bg-cyan-400 text-black rounded shadow-lg shadow-black/50"
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
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
