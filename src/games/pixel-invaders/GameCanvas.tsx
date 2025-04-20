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
  const { playerXRef } = usePlayerControls(canvasWidth);
  const enemiesRef = useRef<Enemy[]>(createEnemies(3, 6));
  const directionRef = useRef(1);
  const bulletsRef = useRef<Bullet[]>([]);
  const lastShotTime = useRef(0);
  const fireRate = 300;

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

    const shootBullet = () => {
      bulletsRef.current.push({
        bulletX: playerXRef.current + 22, // Center the bullet
        bulletY: canvas.height - 60,
        width: 6,
        height: 12,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const now = Date.now();
        if (now - lastShotTime.current > fireRate) {
          shootBullet();
          lastShotTime.current = now;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hitBottom = updateEnemies(
        enemiesRef.current,
        canvas.height,
        canvas.width,
        directionRef
      );
      bulletsRef.current = updateBullets(bulletsRef.current);

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);
      drawBullet(ctx, bulletsRef.current);

      if (hitBottom) {
        console.log("💥 Game Over! Enemy reached the bottom!");
        // TODO: Trigger game over
      }

      requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerXRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[65vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
