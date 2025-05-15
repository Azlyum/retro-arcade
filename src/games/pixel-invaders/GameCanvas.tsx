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
import { PowerUp, powerUpIconMap } from "./utils/powerUpUtils.tsx";

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
  const isBigBulletActiveRef = useRef(false);
  const isPlayerSpeedBoostActiveRef = useRef(false);
  const isBulletSpreadActiveRef = useRef(false);
  const isFreezeEnemiesActiveRef = useRef(false);
  const isScoreBoostActiveRef = useRef(false);
  const isSlowMotionActiveRef = useRef(false);
  const isAutoFireActiveRef = useRef(false);
  const playerDamageMultiplierRef = useRef(1);
  const activePowerUpsRef = useRef<{ power: string; expiration: number }[]>([]);

  const { playerXRef } = usePlayerControls(
    canvasWidth,
    canvasHeight,
    bulletsRef,
    fireRateRef,
    isDoubleShotActiveRef,
    isBigBulletActiveRef,
    isPlayerSpeedBoostActiveRef,
    isBulletSpreadActiveRef,
    isAutoFireActiveRef,
    playerDamageMultiplierRef
  );

  const enemiesRef = useRef<Enemy[]>([]);
  const directionRef = useRef(1);
  const scoreRef = useRef(0);
  const waveRef = useRef(1);
  const gameOverTriggeredRef = useRef(false);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

  useEffect(() => {
    enemiesRef.current = createEnemies(3, 6, waveRef.current);
  }, [canvasWidth]);

  const activatePowerUp = (power: string) => {
    const duration = 15000;
    const expiration = Date.now() + duration;

    // Apply effect
    switch (power) {
      case "shield":
        isShieldActiveRef.current = true;
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
        isBigBulletActiveRef.current = true;
        setTimeout(() => (isBigBulletActiveRef.current = false), duration);
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
      case "damage boost":
        playerDamageMultiplierRef.current += 0.5;
        break;
    }

    // Add to HUD list (overwrite if same power is already active)
    activePowerUpsRef.current = [
      ...activePowerUpsRef.current.filter((p) => p.power !== power),
      { power, expiration },
    ];
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
            enemyBulletwidth: 10,
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

      const drawPowerUpHUD = (ctx: CanvasRenderingContext2D) => {
        const iconSize = 40;
        const padding = 10;
        const startX = 20;
        const startY = 60;

        const now = Date.now();
        activePowerUpsRef.current = activePowerUpsRef.current.filter(
          (p) => p.expiration > now
        );

        activePowerUpsRef.current.forEach((powerUp, i) => {
          const iconPath = powerUpIconMap[powerUp.power];
          if (!iconPath) return;

          const img = new Image();
          img.src = iconPath;

          const alpha = Math.max(0.3, (powerUp.expiration - now) / 15000);

          if (img.complete && img.naturalWidth > 0) {
            ctx.globalAlpha = alpha;
            ctx.drawImage(
              img,
              startX + i * (iconSize + padding),
              startY,
              iconSize,
              iconSize
            );
            ctx.globalAlpha = 1;
          }
        });
      };

      drawBullet(ctx, bulletsRef.current);
      drawEnemyBullets(ctx, enemyBulletsRef.current);

      drawEnemies(ctx, enemiesRef.current);
      drawPlayer(
        ctx,
        playerXRef.current,
        canvas.height,
        isShieldActiveRef.current
      );
      drawPowerUpHUD(ctx);

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
        const iconPath = powerUpIconMap[power.power];
        if (!iconPath) return;

        const img = new Image();
        img.src = iconPath;

        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, power.x, power.y, 32, 32);
        } else {
          img.onload = () => {
            ctx.drawImage(img, power.x, power.y, 32, 32);
          };
        }
      });

      powerUpsRef.current = powerUpsRef.current.filter((p) => {
        const isColliding =
          p.x < playerXRef.current + 50 &&
          p.x + 32 > playerXRef.current &&
          p.y < playerY + 30 &&
          p.y + 32 > playerY;

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
          Math.floor(Math.random() * 10 + 1),
          waveRef.current
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
