import React, { useEffect, useRef, useState } from "react";
import { usePlayerControls, checkBulletHits } from "./gameLogic.tsx";
import { drawPlayer } from "./drawPlayer.tsx";
import {
  Enemy,
  createEnemies,
  drawEnemies,
  updateEnemies,
} from "./drawEnemies.tsx";
import {
  Bullet,
  drawBullet,
  drawEnemyBullets,
  EnemyBullet,
  updateBullets,
  updateEnemyBullets,
} from "./drawBullet.tsx";
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
  const enemyBulletsRef = useRef<EnemyBullet[]>([]);
  const fireRateRef = useRef(400);
  const enemyFireRateRef = useRef(2000);
  const lastEnemyShotTimeRef = useRef(Date.now() + 1000);
  const isShieldActiveRef = useRef(false);
  const isDoubleShotActiveRef = useRef(false);
  const bigBulletActiveRef = useRef(false);
  const isPlayerSpeedBoostActiveRef = useRef(false);
  const isBulletSpreadActiveRef = useRef(false);
  const isFreezeEnemiesActiveRef = useRef(false);
  const isScoreBoostActiveRef = useRef(false);
  const isSlowMotionActiveRef = useRef(false);
  const isAutoFireActiveRef = useRef(false);

  const { playerXRef } = usePlayerControls(
    canvasWidth,
    canvasHeight,
    bulletsRef,
    fireRateRef,
    isDoubleShotActiveRef,
    bigBulletActiveRef,
    isPlayerSpeedBoostActiveRef,
    isBulletSpreadActiveRef,
    isAutoFireActiveRef
  );

  const createCenteredEnemies = (rows: number, cols: number): Enemy[] => {
    const spacingX = 60;
    const spacingY = 50;
    const enemyWidth = 40;
    const enemyHeight = 40;
    const totalWidth = cols * spacingX;
    const offsetX = (canvasWidth - totalWidth) / 2;

    const enemies: Enemy[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        enemies.push({
          x: offsetX + col * spacingX,
          y: row * spacingY + 30,
          width: enemyWidth,
          height: enemyHeight,
          health: 100,
        });
      }
    }

    return enemies;
  };

  const enemiesRef = useRef<Enemy[]>([]);
  const directionRef = useRef(1);
  const scoreRef = useRef(0);
  const waveRef = useRef(1);
  const gameOverTriggeredRef = useRef(false);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

  useEffect(() => {
    enemiesRef.current = createCenteredEnemies(3, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth]);

  const activatePowerUp = (power: string) => {
    const duration = 15000;
    switch (power) {
      case "shield":
        isShieldActiveRef.current = true;
        setTimeout(() => (isShieldActiveRef.current = false), duration);
        break;
      case "rapid fire":
        fireRateRef.current = 150;
        setTimeout(() => (fireRateRef.current = 400), duration);
        break;
      case "double shot":
        isDoubleShotActiveRef.current = true;
        setTimeout(() => (isDoubleShotActiveRef.current = false), duration);
        break;
      case "big bullets":
        bigBulletActiveRef.current = true;
        setTimeout(() => (bigBulletActiveRef.current = false), duration);
        break;
      case "speed boost":
        isPlayerSpeedBoostActiveRef.current = true;
        setTimeout(
          () => (isPlayerSpeedBoostActiveRef.current = false),
          duration
        );
        break;
      case "bullet spread":
        isBulletSpreadActiveRef.current = true;
        setTimeout(() => (isBulletSpreadActiveRef.current = false), duration);
        break;
      case "freeze enemies":
        isFreezeEnemiesActiveRef.current = true;
        setTimeout(() => (isFreezeEnemiesActiveRef.current = false), duration);
        break;
      case "score boost":
        isScoreBoostActiveRef.current = true;
        setTimeout(() => (isScoreBoostActiveRef.current = false), duration);
        break;
      case "slow motion":
        isSlowMotionActiveRef.current = true;
        setTimeout(() => (isSlowMotionActiveRef.current = false), duration);
        break;
      case "auto fire":
        isAutoFireActiveRef.current = true;
        setTimeout(() => (isAutoFireActiveRef.current = false), duration);
        break;
    }
  };

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
      setCanvasHeight(newHeight);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const playerY = canvas.height - 40;

      const now = Date.now();
      if (
        enemiesRef.current.length > 0 &&
        now - lastEnemyShotTimeRef.current > enemyFireRateRef.current &&
        enemyBulletsRef.current.length < 5
      ) {
        const columnMap = new Map<number, Enemy>();

        enemiesRef.current.forEach((enemy) => {
          const columnKey = Math.floor(enemy.x / 60);
          const currentBottom = columnMap.get(columnKey);

          if (!currentBottom || enemy.y > currentBottom.y) {
            columnMap.set(columnKey, enemy);
          }
        });

        const bottomEnemies = Array.from(columnMap.values());
        const shooter =
          bottomEnemies[Math.floor(Math.random() * bottomEnemies.length)];

        if (shooter) {
          enemyBulletsRef.current.push({
            enemyBulletX: shooter.x + shooter.width / 2,
            enemyBulletY: shooter.y + shooter.height,
            enemyBulletwidth: 6,
            enemyBulletheight: 12,
          });
        }

        lastEnemyShotTimeRef.current = now;
      }

      const enemiesHitBottom = updateEnemies(
        enemiesRef.current,
        canvas.height,
        canvas.width,
        directionRef,
        playerY,
        isFreezeEnemiesActiveRef,
        isSlowMotionActiveRef,
        waveRef
      );

      bulletsRef.current = updateBullets(
        bulletsRef.current,
        isSlowMotionActiveRef
      );

      const updatedBullets = updateEnemyBullets(
        enemyBulletsRef.current,
        isSlowMotionActiveRef
      );

      enemyBulletsRef.current = updatedBullets.slice(0, 5);

      checkBulletHits(
        bulletsRef.current,
        enemiesRef.current,
        scoreRef,
        floatingTextsRef,
        powerUpsRef,
        isScoreBoostActiveRef,
        waveRef
      );

      drawBullet(ctx, bulletsRef.current);
      drawEnemyBullets(ctx, enemyBulletsRef.current);

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(ctx, playerXRef.current, canvas.height);

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
          activatePowerUp(p.power);
          return false;
        }
        return true;
      });

      if (enemiesRef.current.length === 0) {
        enemyFireRateRef.current = Math.max(800, 2000 - waveRef.current * 100);
        enemiesRef.current = createEnemies(
          3,
          Math.floor(Math.random() * 10 + 1)
        );
        waveRef.current++;
      }

      if (enemiesHitBottom && !gameOverTriggeredRef.current) {
        if (isShieldActiveRef.current) {
          ctx.strokeStyle = "cyan";
          ctx.strokeRect(playerXRef.current, canvas.height - 60, 50, 30);
          isShieldActiveRef.current = false;
        } else {
          gameOverTriggeredRef.current = true;
          onGameOver(scoreRef.current);
        }
      }

      enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => {
        const playerTop = playerY;
        const playerBottom = playerY + 30;

        const isHit =
          b.enemyBulletX < playerXRef.current + 50 &&
          b.enemyBulletX + b.enemyBulletwidth > playerXRef.current &&
          b.enemyBulletY < playerBottom &&
          b.enemyBulletY + b.enemyBulletheight > playerTop;

        if (isHit && !gameOverTriggeredRef.current) {
          if (isShieldActiveRef.current) {
            isShieldActiveRef.current = false;
          } else {
            gameOverTriggeredRef.current = true;
            onGameOver(scoreRef.current);
          }
          return false;
        }

        return true;
      });

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
