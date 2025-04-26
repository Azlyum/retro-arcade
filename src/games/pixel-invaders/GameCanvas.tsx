import React, { useEffect, useRef, useState } from "react";
import { usePlayerControls } from "./gameLogic.tsx";
import { drawPlayer } from "./drawPlayer.tsx";
import {
  Enemy,
  createEnemies,
  drawEnemies,
  updateEnemies,
} from "./drawEnemies.tsx";
import { Bullet, drawBullet, updateBullets } from "./drawBullet.tsx";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const bulletsRef = useRef<Bullet[]>([]);
  const { playerXRef } = usePlayerControls(canvasWidth, bulletsRef);
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
      const playerY = canvas.height - 40;

      const hit = updateEnemies(
        enemiesRef.current,
        canvas.height,
        canvas.width,
        directionRef,
        playerY
      );
      bulletsRef.current = updateBullets(bulletsRef.current);

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);
      drawBullet(ctx, bulletsRef.current);

      if (hit) {
        console.log("💥 Game Over! Enemy reached the bottom!");
        // TODO: Trigger game over
      }

      requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [playerXRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[95vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
