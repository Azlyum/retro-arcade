import { useEffect, useRef, useState } from "react";

export const usePlayerControls = (canvasWidth: number) => {
  const [playerX, setPlayerX] = useState(100);
  const playerXRef = useRef(playerX);
  const PLAYER_WIDTH = 50;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPlayerX((prev) => {
        let newX = prev;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          newX = Math.max(prev - 10, 0); // left boundary
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          newX = Math.min(prev + 10, canvasWidth - PLAYER_WIDTH); // right boundary
        }
        playerXRef.current = newX;
        return newX;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvasWidth]);

  return { playerX, playerXRef };
};
