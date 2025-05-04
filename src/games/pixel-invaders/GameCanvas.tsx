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
import { FloatingText } from "./utils/floatingTextArray.tsx";
import { PowerUp } from "./utils/powerUpUtils.tsx";

export const Canvas = ({
  onGameOver,
}: {
  onGameOver: (score: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.85);
  const bulletsRef = useRef<Bullet[]>([]);
  const fireRateRef = useRef(400);
  const { playerXRef } = usePlayerControls(
    canvasWidth,
    canvasHeight,
    bulletsRef,
    fireRateRef
  );
  const enemiesRef = useRef<Enemy[]>(createEnemies(3, 6));
  const directionRef = useRef(1);
  const scoreRef = useRef(0);
  const waveRef = useRef(1);
  const gameOverTriggeredRef = useRef(false);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

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
      setCanvasHeight(canvasHeight);
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
      checkBulletHits(
        bulletsRef.current,
        enemiesRef.current,
        scoreRef,
        floatingTextsRef,
        powerUpsRef
      );

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);
      drawBullet(ctx, bulletsRef.current);

      floatingTextsRef.current.forEach((text) => {
        ctx.font = '16px "Press Start 2P", cursive';
        ctx.fillText(text.text, text.x, text.y);
        text.y -= 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${text.opacity})`;
        text.lifespan += 100;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter(
        (t) => t.lifespan > 0
      );

      powerUpsRef.current.forEach((power) => {
        power.y += 1;
        ctx.font = '16px "Press Start 2P", cursive';
        ctx.fillStyle = `rgba(255, 255, 255, ${power.opacity})`;
        ctx.fillText(power.power, power.x, power.y);
      });
      powerUpsRef.current = powerUpsRef.current.filter(
        (p) => Date.now() < p.powerUpExpirationTimer
      );

      powerUpsRef.current = powerUpsRef.current.filter((p) => {
        const isColliding =
          p.x < playerXRef.current + 50 &&
          p.x + p.width > playerXRef.current &&
          p.y < playerY + 20 &&
          p.y + p.height > playerY;

        if (isColliding) {
          console.log("Collected power-up:", p.power);
          if (p.power) fireRateRef.current = 150;
          return false;
        }
        return true;
      });

      if (enemiesRef.current.length === 0) {
        enemiesRef.current = createEnemies(
          3,
          Math.floor(Math.random() * 10 + 1)
        );
        waveRef.current++;
      }

      if (enemiesHitBottom && !gameOverTriggeredRef.current) {
        gameOverTriggeredRef.current = true;
        onGameOver(scoreRef.current);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onGameOver, playerXRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[95vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
