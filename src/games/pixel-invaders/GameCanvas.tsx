import React, { useEffect, useRef, useState } from "react";
import { usePlayerControls } from "./gameLogic.tsx";
import { drawPlayer } from "./drawPlayer.tsx";
import {
  Enemy,
  createEnemies,
  drawEnemies,
  updateEnemies,
} from "./drawEnemies.tsx";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const { playerXRef } = usePlayerControls(canvasWidth);
  const enemiesRef = useRef<Enemy[]>(createEnemies(3, 6));
  const directionRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth * 0.95;
      const newHeight = window.innerHeight * 0.85;
      canvas.width = newWidth;
      canvas.height = newHeight;
      setCanvasWidth(newWidth);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hitBottom = updateEnemies(
        enemiesRef.current,
        canvas.height,
        canvas.width,
        directionRef
      );

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);

      if (hitBottom) {
        console.log(alert("💥 Game Over! Enemy reached the bottom!"));
        // TODO: trigger game over state / stop game
      }

      requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [playerXRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[65vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
