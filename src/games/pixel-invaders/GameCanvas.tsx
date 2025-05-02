import React, { useEffect, useRef, useState } from "react";
import { usePlayerControls, checkBulletHits } from "./gameLogic.tsx";
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
  const scoreRef = useRef(0);
  const waveRef = useRef(1);

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

      const enemiesHitBottom = updateEnemies(
        enemiesRef.current,
        canvas.height,
        canvas.width,
        directionRef,
        playerY
      );
      bulletsRef.current = updateBullets(bulletsRef.current);
      checkBulletHits(bulletsRef.current, enemiesRef.current, scoreRef);
      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);
      drawBullet(ctx, bulletsRef.current);

      if (enemiesRef.current.length === 0) {
        enemiesRef.current = createEnemies(
          3,
          Math.floor(Math.random() * 10 + 1)
        );
        waveRef.current++;
      }

      if (enemiesHitBottom) {
        console.log("Game Over! Enemy reached the bottom!");
        // TODO: Trigger game over
      }

      ctx.fillStyle = "white";
      ctx.font = "bold 24px 'Press Start 2P', cursive";
      ctx.fillText(`Wave: ${waveRef.current}`, 20, 30);
      ctx.fillText(`Score: ${scoreRef.current}`, 720, 30);

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
