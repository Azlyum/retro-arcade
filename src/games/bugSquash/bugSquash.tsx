import React, { useEffect, useMemo, useRef, useState } from "react";

type GameState = "idle" | "playing" | "gameOver";

const NUM_HOLES = 9;
const ROUND_TIME_SECONDS = 30;
const BUG_VISIBLE_MS = 700;
const SPAWN_INTERVAL_MS = 850;

export default function BugSquash() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [activeHoleIndex, setActiveHoleIndex] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const spawnTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const holes = useMemo(() => Array.from({ length: NUM_HOLES }), []);

  function reset() {
    setScore(0);
    setTimeLeft(ROUND_TIME_SECONDS);
    setActiveHoleIndex(null);
    setStreak(0);
    setGameState("idle");
    clearTimers();
  }

  function clearTimers() {
    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    spawnTimerRef.current = null;
    hideTimerRef.current = null;
    countdownRef.current = null;
  }

  function start() {
    reset();
    setGameState("playing");

    // Countdown
    countdownRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.setTimeout(() => endGame(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawn bugs
    spawnTimerRef.current = window.setInterval(() => {
      spawnBug();
    }, SPAWN_INTERVAL_MS);

    // Spawn one immediately
    spawnBug();
  }

  function endGame() {
    clearTimers();
    setGameState("gameOver");
    setActiveHoleIndex(null);
  }

  function spawnBug() {
    // Choose a hole different from the current one for variety
    setActiveHoleIndex((current) => {
      const choices = Array.from({ length: NUM_HOLES }, (_, i) => i).filter(
        (i) => i !== current
      );
      const next = choices[Math.floor(Math.random() * choices.length)];
      // Auto-hide after a moment
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(
        () => setActiveHoleIndex((idx) => (idx === next ? null : idx)),
        BUG_VISIBLE_MS
      );
      return next;
    });
  }

  function handleHoleClick(index: number) {
    if (gameState !== "playing") return;
    if (activeHoleIndex !== index) {
      // Miss
      setStreak(0);
      return;
    }
    // Hit
    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    setActiveHoleIndex(null);
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-white">
      <h1 className="text-3xl font-bold tracking-wide">Bug Squash</h1>

      {/* HUD */}
      <div className="flex items-center gap-6">
        <div className="rounded bg-black/40 px-4 py-2">
          <span className="text-sm uppercase text-gray-300">Score</span>
          <div className="text-2xl font-semibold">{score}</div>
        </div>
        <div className="rounded bg-black/40 px-4 py-2">
          <span className="text-sm uppercase text-gray-300">Time</span>
          <div
            className={`text-2xl font-semibold ${
              timeLeft <= 5 ? "text-red-400" : ""
            }`}
          >
            {timeLeft}s
          </div>
        </div>
        <div className="rounded bg-black/40 px-4 py-2">
          <span className="text-sm uppercase text-gray-300">Streak</span>
          <div className="text-2xl font-semibold">{streak}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {gameState !== "playing" ? (
          <button
            onClick={start}
            className="rounded bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400 active:scale-[0.98]"
          >
            {gameState === "idle" ? "Start" : "Play Again"}
          </button>
        ) : (
          <button
            onClick={endGame}
            className="rounded bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300 active:scale-[0.98]"
          >
            Stop
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {holes.map((_, i) => {
          const isActive = i === activeHoleIndex;
          return (
            <button
              key={i}
              onClick={() => handleHoleClick(i)}
              className="relative h-28 w-28 select-none rounded-lg border-4 border-slate-700 bg-slate-900 shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.35)] hover:border-slate-500 active:scale-[0.99]"
            >
              {/* Hole lip */}
              <div className="absolute inset-x-2 top-2 h-3 rounded-full bg-slate-800/80" />
              {/* Bug */}
              {isActive ? (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  <span role="img" aria-label="bug">
                    🐛
                  </span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* State message */}
      {gameState === "gameOver" && (
        <div className="rounded bg-black/50 px-4 py-2 text-center">
          <div className="text-lg font-semibold">Time!</div>
          <div className="text-sm text-gray-300">Final Score: {score}</div>
        </div>
      )}
    </div>
  );
}
