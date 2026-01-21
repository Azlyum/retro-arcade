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
  const [adminMode, setAdminMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Digit9" || e.code === "Digit8" || e.code === "Digit7") {
        const digit = e.code.replace("Digit", "");
        setKeySequence((prev) => {
          const newSequence = [...prev, digit];
          if (newSequence.length > 6) {
            newSequence.shift();
          }
          return newSequence;
        });
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (keySequence.length >= 6) {
      const sequence = keySequence.join("");
      if (sequence === "987789") {
        setAdminMode((prev) => !prev);
        setKeySequence([]);
      }
    }
  }, [keySequence]);

  return (
    <>
      <div
        className={`relative w-full h-[95vh] border-4 border-cyan-400 flex items-center justify-center bg-black text-white font-press-start transition-opacity duration-500 ${
          gameState === "playing" ? "opacity-100" : "opacity-95"
        }`}
        key={transitionKey}
      >
        <button
          className="absolute bottom-4 right-4 z-50 px-3 py-1 text-xs bg-cyan-400 text-black rounded shadow-lg shadow-black/50"
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
          <>
            <Canvas
              onGameOver={(score: number) => {
                setGameState("gameOver");
                setFinalScore(score);
              }}
              onSpawnPowerUp={
                adminMode
                  ? (powerUp: string) => {
                      if ((window as any).spawnPowerUp) {
                        (window as any).spawnPowerUp(powerUp);
                      }
                    }
                  : undefined
              }
            />

            {adminMode && (
              <div className="absolute top-4 left-4 z-50 bg-black/90 border-2 border-yellow-400 rounded-lg p-4 text-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-yellow-400">
                    Admin Panel
                  </h3>
                  <button
                    className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                    onClick={() => setAdminMode(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded"
                    onClick={() => (window as any).spawnPowerUp?.("shield")}
                  >
                    Shield
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 rounded"
                    onClick={() => (window as any).spawnPowerUp?.("rapid fire")}
                  >
                    Rapid Fire
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("double shot")
                    }
                  >
                    Double Shot
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("big bullets")
                    }
                  >
                    Big Bullets
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-cyan-500 hover:bg-cyan-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("speed boost")
                    }
                  >
                    Speed Boost
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-pink-500 hover:bg-pink-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("bullet spread")
                    }
                  >
                    Bullet Spread
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("freeze enemies")
                    }
                  >
                    Freeze Enemies
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 rounded text-black"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("score boost")
                    }
                  >
                    Score Boost
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 rounded"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("slow motion")
                    }
                  >
                    Slow Motion
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 rounded"
                    onClick={() => (window as any).spawnPowerUp?.("auto fire")}
                  >
                    Auto Fire
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-lime-500 hover:bg-lime-600 rounded text-black"
                    onClick={() =>
                      (window as any).spawnPowerUp?.("damage boost")
                    }
                  >
                    Damage Boost
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
