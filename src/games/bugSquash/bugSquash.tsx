import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
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
    setActiveBug(null);
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

  const spawnBug = useCallback(() => {
    if (activeHoleIndex !== null) return;

    const choices = Array.from({ length: NUM_HOLES }, (_, i) => i).filter(
      (i) => i !== activeHoleIndex
    );
    const next = choices[Math.floor(Math.random() * choices.length)];
    const bug = pickWeighted(bugPool);

    setActiveHoleIndex(next);
    setActiveBug(bug);

    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setActiveHoleIndex(null);
      setActiveBug(null);
    }, BUG_VISIBLE_MS);
  }, [activeHoleIndex]);

  function handleHoleClick(index: number) {
    if (gameState !== "playing") return;
    if (activeHoleIndex !== index || !activeBug) {
      // Miss - wrong hole or no bug
      setStreak(0);
      setHearts((h) => {
        const next = clamp(h - 1, 0, MAX_HEARTS);
        if (next === 0) {
          setTimeout(() => setGameState("gameOver"), 0);
        }
        return next;
      });
      return;
    }

    const {
      points = 0,
      hearts: heartDelta = 0,
      time: timeDelta = 0,
    } = activeBug.effect;

    setScore((s) => clamp(s + points, 0, Number.MAX_SAFE_INTEGER));
    setStreak((st) => (points > 0 ? st + 1 : st));

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

    const computed = SPAWN_INTERVAL_MS - round * 50;
    const speed = Math.max(MIN_SPAWN_MS, computed);

    spawnTimerRef.current = window.setInterval(() => {
      spawnBug();
    }, speed);

    return () => {
      if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    };
  }, [round, gameState, spawnBug]);

  // Reset timer only when round changes
  useEffect(() => {
    if (gameState === "playing") {
      setTimeLeft(ROUND_TIME_SECONDS);
    }
  }, [round, gameState]);

  // global cleanup
  useEffect(() => clearTimers, []);

  return (
    <div className="relative flex flex-col items-center gap-6 p-6 text-white">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Moving horizontal scanlines */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-black/40 to-transparent bg-[length:100%_2px] bg-repeat-y animate-[scanlines_0.1s_linear_infinite]"></div>
        </div>
        {/* Vertical scanlines */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-red-500/15 to-transparent bg-[length:1px_100%] bg-repeat-x"></div>
        </div>
        {/* Screen flicker effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/10 bg-[length:100%_1px] bg-repeat-y animate-pulse"></div>
      </div>

      <h1 className="text-3xl font-bold tracking-wide text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
        Bug Squash
      </h1>

      <div className="flex items-center gap-6">
        <div className="rounded bg-black/60 px-4 py-2 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <span className="text-sm uppercase text-green-300 font-mono">
            SCORE
          </span>
          <div className="text-2xl font-semibold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
            {score}
          </div>
        </div>
        <div className="rounded bg-black/60 px-4 py-2 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <span className="text-sm uppercase text-blue-300 font-mono">
            TIME
          </span>
          <div
            className={`text-2xl font-semibold ${
              timeLeft <= 5
                ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"
                : "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            }`}
          >
            {timeLeft}s
          </div>
        </div>
        <div className="rounded bg-black/60 px-4 py-2 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
          <span className="text-sm uppercase text-purple-300 font-mono">
            ROUND
          </span>
          <div className="text-2xl font-semibold text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]">
            {round}
          </div>
        </div>
        <div className="rounded bg-black/60 px-4 py-2 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <span className="text-sm uppercase text-yellow-300 font-mono">
            STREAK
          </span>
          <div className="text-2xl font-semibold text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]">
            {streak}
          </div>
        </div>
        <div className="rounded bg-black/60 px-4 py-2 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <span className="text-sm uppercase text-red-300 font-mono">
            HEARTS
          </span>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: MAX_HEARTS }, (_, i) => (
              <HeartIcon
                key={i}
                className={`w-6 h-6 ${
                  i < hearts
                    ? "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {gameState !== "playing" ? (
          <button
            onClick={start}
            className="rounded bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400 active:scale-[0.98] border border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] font-mono tracking-wider"
          >
            {gameState === "idle" ? "INITIALIZE" : "RESTART"}
          </button>
        ) : (
          <button
            onClick={endGame}
            className="rounded bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-400 active:scale-[0.98] border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] font-mono tracking-wider"
          >
            TERMINATE
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
              className="relative h-32 w-32 select-none rounded-lg border-2 border-slate-600 bg-slate-900 shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.35)] hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-[0.99] transition-all duration-200"
            >
              <div className="absolute inset-x-2 top-2 h-3 rounded-full bg-slate-800/80" />
              {isActive && activeBug ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {(() => {
                    const Icon = activeBug.icon;
                    return (
                      <Icon className={`w-12 h-12 ${activeBug.style ?? ""}`} />
                    );
                  })()}
                </div>
              ) : null}
              {/* Terminal cursor effect when active */}
              {isActive && (
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-400 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {gameState === "gameOver" && (
        <div className="rounded bg-black/70 px-6 py-4 text-center border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
          <div className="text-xl font-semibold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] font-mono">
            SYSTEM FAILURE
          </div>
          <div className="text-sm text-gray-300 font-mono mt-2">
            FINAL SCORE: <span className="text-green-400">{score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
