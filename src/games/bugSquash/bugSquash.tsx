import React, { useEffect, useMemo, useRef, useState } from "react";
import { bugPool, BugPoolProps } from "./utils/bugPool";

type GameState = "idle" | "playing" | "gameOver";
type Bugs = BugPoolProps | null;

const NUM_HOLES = 9;
const ROUND_TIME_SECONDS = 30;
const BUG_VISIBLE_MS = 700;
const SPAWN_INTERVAL_MS = 850;
const MIN_SPAWN_MS = 250;
const MAX_HEARTS = 3;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function pickWeighted<T extends { probability: number }>(arr: T[]): T {
  const total = arr.reduce((s, x) => s + x.probability, 0);
  let r = Math.random() * total;
  for (const item of arr) {
    r -= item.probability;
    if (r <= 0) return item;
  }
  return arr[arr.length - 1];
}

export default function BugSquash() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [activeHoleIndex, setActiveHoleIndex] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [activeBug, setActiveBug] = useState<Bugs>(null);

  const spawnTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const holes = useMemo(() => Array.from({ length: NUM_HOLES }), []);

  function clearTimers() {
    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    spawnTimerRef.current = null;
    hideTimerRef.current = null;
    countdownRef.current = null;
  }

  function reset() {
    clearTimers();
    setScore(0);
    setStreak(0);
    setActiveHoleIndex(null);
    setTimeLeft(ROUND_TIME_SECONDS);
    setRound(1);
    setGameState("idle");
    setHearts(MAX_HEARTS);
  }

  function start() {
    reset();
    setGameState("playing");

    spawnBug();
  }

  function endGame() {
    clearTimers();
    setActiveHoleIndex(null);
    setGameState("gameOver");
    setActiveBug(null);
  }

  function spawnBug() {
    if (activeHoleIndex !== null) return;

    setActiveHoleIndex((current) => {
      const choices = Array.from({ length: NUM_HOLES }, (_, i) => i).filter(
        (i) => i !== current
      );
      const next = choices[Math.floor(Math.random() * choices.length)];
      const bug = pickWeighted(bugPool);
      setActiveBug(bug);

      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setActiveHoleIndex((idx) => (idx === next ? null : idx));
        setActiveBug((b) => (activeHoleIndex === next ? null : b));
      }, BUG_VISIBLE_MS);

      return next;
    });
  }

  function handleHoleClick(index: number) {
    if (gameState !== "playing") return;
    if (activeHoleIndex !== index || !activeBug) {
      setStreak(0);
      return;
    }

    const {
      points = 0,
      hearts: heartDelta = 0,
      time: timeDelta = 0,
    } = activeBug.effect;

    setScore((s) => clamp(s + points, 0, Number.MAX_SAFE_INTEGER));
    setStreak((st) => (points > 0 ? st + 1 : 0));

    if (heartDelta !== 0) {
      setHearts((h) => {
        const next = clamp(h + heartDelta, 0, MAX_HEARTS);
        if (next === 0) setGameState("gameOver");
        return next;
      });
    }

    if (timeDelta !== 0) {
      setTimeLeft((t) => clamp(t + timeDelta, 0, ROUND_TIME_SECONDS));
    }
    setActiveHoleIndex(null);
    setActiveBug(null);
  }

  useEffect(() => {
    setRound(Math.floor(score / 10) + 1);
  }, [score]);

  useEffect(() => {
    if (gameState !== "playing") return;

    countdownRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimeout(() => setGameState("gameOver"), 0);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);

    const computed = SPAWN_INTERVAL_MS - round * 10;
    const speed = Math.max(MIN_SPAWN_MS, computed);

    spawnTimerRef.current = window.setInterval(() => {
      spawnBug();
    }, speed as unknown as number);

    setTimeLeft(ROUND_TIME_SECONDS);

    return () => {
      if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    };
  }, [round, gameState]);

  // global cleanup
  useEffect(() => clearTimers, []);

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-white">
      <h1 className="text-3xl font-bold tracking-wide">Bug Squash</h1>

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
          <span className="text-sm uppercase text-gray-300">Round</span>
          <div className="text-2xl font-semibold">{round}</div>
        </div>
        <div className="rounded bg-black/40 px-4 py-2">
          <span className="text-sm uppercase text-gray-300">Streak</span>
          <div className="text-2xl font-semibold">{streak}</div>
        </div>
        <div className="rounded bg-black/40 px-4 py-2">
          <span className="text-sm uppercase text-gray-300">Hearts</span>
          <div className="text-2xl font-semibold">{hearts}</div>
        </div>
      </div>

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

      <div className="grid grid-cols-3 gap-4">
        {holes.map((_, i) => {
          const isActive = i === activeHoleIndex;
          return (
            <button
              key={i}
              onClick={() => handleHoleClick(i)}
              className="relative h-28 w-28 select-none rounded-lg border-4 border-slate-700 bg-slate-900 shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.35)] hover:border-slate-500 active:scale-[0.99]"
            >
              <div className="absolute inset-x-2 top-2 h-3 rounded-full bg-slate-800/80" />
              {isActive && activeBug ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {(() => {
                    const Icon = activeBug.icon;
                    return (
                      <Icon className={`w-10 h-10 ${activeBug.style ?? ""}`} />
                    );
                  })()}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {gameState === "gameOver" && (
        <div className="rounded bg-black/50 px-4 py-2 text-center">
          <div className="text-lg font-semibold">Time!</div>
          <div className="text-sm text-gray-300">Final Score: {score}</div>
        </div>
      )}
    </div>
  );
}
