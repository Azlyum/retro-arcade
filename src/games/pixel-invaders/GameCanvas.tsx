import React, { useEffect, useRef, useState } from "react";
import { usePlayerControls, checkBulletHits } from "./gameLogic";
import { drawPlayer } from "./drawPlayer";
import {
  Enemy,
  createEnemies,
  drawEnemies,
  updateEnemies,
} from "./drawEnemies";
import {
  Bullet,
  drawBullet,
  drawEnemyBullets,
  EnemyBullet,
  updateBullets,
  updateEnemyBullets,
} from "./drawBullet";
import { FloatingText } from "./utils/floatingTextArray";
import { PowerUp, powerUpIconMap } from "./utils/powerUpUtils";

export const Canvas = ({
  onGameOver,
}: {
  onGameOver: (score: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.85);
  const playerBulletImageRef = useRef<HTMLImageElement | null>(null);
  const enemyBulletImageRef = useRef<HTMLImageElement | null>(null);
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
  const permanentDamageBoostsRef = useRef(0);
  const activePowerUpsRef = useRef<{ power: string; expiration: number }[]>([]);

  // Add timer management for power-ups
  const activeTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const { playerXRef, keysPressed, lastShotTime, shootBullet } =
    usePlayerControls(
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

  useEffect(() => {
    const loadImages = () => {
      console.log("Loading bullet images...");

      // Load player bullet image
      const playerBulletImg = new Image();
      playerBulletImg.onload = () => {
        console.log("Player bullet image loaded successfully");
        playerBulletImageRef.current = playerBulletImg;
      };
      playerBulletImg.onerror = (error) => {
        console.error("Failed to load player bullet image:", error);
      };
      playerBulletImg.src = "/images/playerBullet.png";

      // Load enemy bullet image
      const enemyBulletImg = new Image();
      enemyBulletImg.onload = () => {
        console.log("Enemy bullet image loaded successfully");
        enemyBulletImageRef.current = enemyBulletImg;
      };
      enemyBulletImg.onerror = (error) => {
        console.error("Failed to load enemy bullet image:", error);
      };
      enemyBulletImg.src = "/images/enemyBullet.png";
    };

    loadImages();

    // Cleanup function to clear all active timers when component unmounts
    return () => {
      activeTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
      activeTimersRef.current.clear();
    };
  }, []);

  // Function to clear all power-ups and timers
  const clearAllPowerUps = () => {
    // Clear all active timers
    activeTimersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    activeTimersRef.current.clear();

    // Reset all power-up states
    isShieldActiveRef.current = false;
    isDoubleShotActiveRef.current = false;
    isBigBulletActiveRef.current = false;
    isPlayerSpeedBoostActiveRef.current = false;
    isBulletSpreadActiveRef.current = false;
    isFreezeEnemiesActiveRef.current = false;
    isScoreBoostActiveRef.current = false;
    isSlowMotionActiveRef.current = false;
    isAutoFireActiveRef.current = false;
    fireRateRef.current = 400;

    // Clear active power-ups list
    activePowerUpsRef.current = [];
  };

  const activatePowerUp = (power: string) => {
    const duration = 15000;
    const expiration = Date.now() + duration;

    if (power === "shield") {
      if (isShieldActiveRef.current) {
        return;
      } else {
        isShieldActiveRef.current = true;
        activePowerUpsRef.current.push({ power, expiration: Infinity });
        return;
      }
    }

    const existingPowerUp = activePowerUpsRef.current.find(
      (p) => p.power === power
    );

    // Helper function to clear existing timer for a power-up
    const clearExistingTimer = (powerType: string) => {
      const existingTimer = activeTimersRef.current.get(powerType);
      if (existingTimer) {
        clearTimeout(existingTimer);
        activeTimersRef.current.delete(powerType);
      }
    };

    if (existingPowerUp) {
      // Clear existing timer before setting new one
      clearExistingTimer(power);
      existingPowerUp.expiration = expiration;

      switch (power) {
        case "rapid fire":
          fireRateRef.current = 150;
          const rapidFireTimer = setTimeout(
            () => (fireRateRef.current = 400),
            duration
          );
          activeTimersRef.current.set(power, rapidFireTimer);
          break;
        case "double shot":
          isDoubleShotActiveRef.current = true;
          const doubleShotTimer = setTimeout(
            () => (isDoubleShotActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, doubleShotTimer);
          break;
        case "big bullets":
          isBigBulletActiveRef.current = true;
          const bigBulletTimer = setTimeout(
            () => (isBigBulletActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, bigBulletTimer);
          break;
        case "speed boost":
          isPlayerSpeedBoostActiveRef.current = true;
          const speedBoostTimer = setTimeout(
            () => (isPlayerSpeedBoostActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, speedBoostTimer);
          break;
        case "bullet spread":
          isBulletSpreadActiveRef.current = true;
          const bulletSpreadTimer = setTimeout(
            () => (isBulletSpreadActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, bulletSpreadTimer);
          break;
        case "freeze enemies":
          isFreezeEnemiesActiveRef.current = true;
          const freezeEnemiesTimer = setTimeout(
            () => (isFreezeEnemiesActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, freezeEnemiesTimer);
          break;
        case "score boost":
          isScoreBoostActiveRef.current = true;
          const scoreBoostTimer = setTimeout(
            () => (isScoreBoostActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, scoreBoostTimer);
          break;
        case "slow motion":
          isSlowMotionActiveRef.current = true;
          const slowMotionTimer = setTimeout(
            () => (isSlowMotionActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, slowMotionTimer);
          break;
        case "auto fire":
          isAutoFireActiveRef.current = true;
          const autoFireTimer = setTimeout(
            () => (isAutoFireActiveRef.current = false),
            duration
          );
          activeTimersRef.current.set(power, autoFireTimer);
          break;
        case "damage boost":
          return;
      }
      return;
    }

    switch (power) {
      case "rapid fire":
        fireRateRef.current = 150;
        const rapidFireTimer = setTimeout(
          () => (fireRateRef.current = 400),
          duration
        );
        activeTimersRef.current.set(power, rapidFireTimer);
        break;
      case "double shot":
        isDoubleShotActiveRef.current = true;
        const doubleShotTimer = setTimeout(
          () => (isDoubleShotActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, doubleShotTimer);
        break;
      case "big bullets":
        isBigBulletActiveRef.current = true;
        const bigBulletTimer = setTimeout(
          () => (isBigBulletActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, bigBulletTimer);
        break;
      case "speed boost":
        isPlayerSpeedBoostActiveRef.current = true;
        const speedBoostTimer = setTimeout(
          () => (isPlayerSpeedBoostActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, speedBoostTimer);
        break;
      case "bullet spread":
        isBulletSpreadActiveRef.current = true;
        const bulletSpreadTimer = setTimeout(
          () => (isBulletSpreadActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, bulletSpreadTimer);
        break;
      case "freeze enemies":
        isFreezeEnemiesActiveRef.current = true;
        const freezeEnemiesTimer = setTimeout(
          () => (isFreezeEnemiesActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, freezeEnemiesTimer);
        break;
      case "score boost":
        isScoreBoostActiveRef.current = true;
        const scoreBoostTimer = setTimeout(
          () => (isScoreBoostActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, scoreBoostTimer);
        break;
      case "slow motion":
        isSlowMotionActiveRef.current = true;
        const slowMotionTimer = setTimeout(
          () => (isSlowMotionActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, slowMotionTimer);
        break;
      case "auto fire":
        isAutoFireActiveRef.current = true;
        const autoFireTimer = setTimeout(
          () => (isAutoFireActiveRef.current = false),
          duration
        );
        activeTimersRef.current.set(power, autoFireTimer);
        break;
      case "damage boost":
        permanentDamageBoostsRef.current += 1;
        playerDamageMultiplierRef.current += 0.5;
        activePowerUpsRef.current.push({ power, expiration: Infinity });
        return;
    }

    activePowerUpsRef.current.push({ power, expiration });
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
      const playerY = canvas.height - 100;

      let newX = playerXRef.current;
      const movementSpeed = isPlayerSpeedBoostActiveRef.current ? 3.5 : 1.8;

      if (
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("KeyA")
      ) {
        newX = Math.max(newX - movementSpeed, 0);
      }

      if (
        keysPressed.current.has("ArrowRight") ||
        keysPressed.current.has("KeyD")
      ) {
        newX = Math.min(newX + movementSpeed, canvas.width - 100);
      }

      const shouldShoot =
        keysPressed.current.has("Space") || isAutoFireActiveRef.current;

      if (shouldShoot) {
        const now = Date.now();
        if (now - lastShotTime.current > fireRateRef.current) {
          shootBullet();
          lastShotTime.current = now;
        }
      }

      playerXRef.current = newX;

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
            enemyBulletwidth: 20,
            enemyBulletheight: 24,
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

      // Draw bullets BEFORE updating them (so they're visible before being filtered out)
      drawBullet(ctx, bulletsRef.current, playerBulletImageRef.current);
      drawEnemyBullets(
        ctx,
        enemyBulletsRef.current,
        enemyBulletImageRef.current
      );

      // Update bullets after drawing them
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
        const expiredPowerUps = activePowerUpsRef.current.filter(
          (p) => p.expiration !== Infinity && p.expiration <= now
        );

        // Clear timers for expired power-ups
        expiredPowerUps.forEach((powerUp) => {
          const timer = activeTimersRef.current.get(powerUp.power);
          if (timer) {
            clearTimeout(timer);
            activeTimersRef.current.delete(powerUp.power);
          }
        });

        activePowerUpsRef.current = activePowerUpsRef.current.filter(
          (p) => p.expiration === Infinity || p.expiration > now
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
          } else {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(
              startX + i * (iconSize + padding),
              startY,
              iconSize,
              iconSize
            );
            ctx.globalAlpha = 1;

            ctx.fillStyle = "white";
            ctx.font = "8px Arial";
            ctx.fillText(
              powerUp.power,
              startX + i * (iconSize + padding),
              startY + iconSize + 8
            );
          }
        });
      };

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
        text.lifespan -= 1;
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
          ctx.fillStyle = "#00ff00";
          ctx.fillRect(power.x, power.y, 32, 32);

          ctx.fillStyle = "white";
          ctx.font = "8px Arial";
          ctx.fillText(power.power, power.x, power.y + 20);
        }
      });

      powerUpsRef.current = powerUpsRef.current.filter((p) => {
        if (p.y > canvas.height) {
          return false;
        }

        const isColliding =
          p.x < playerXRef.current + 100 &&
          p.x + 32 > playerXRef.current &&
          p.y < playerY + 100 &&
          p.y + 32 > playerY;

        if (isColliding) {
          activatePowerUp(p.power);
          floatingTextsRef.current.push({
            x: p.x,
            y: p.y,
            text: `+${p.power}`,
            textPortfolio: "",
            opacity: 1,
            lifespan: 60,
          });
          return false;
        }
        return true;
      });

      if (enemiesRef.current.length === 0) {
        enemyFireRateRef.current = Math.max(
          800,
          2000 - Math.floor(waveRef.current / 3) * 25
        );
        enemiesRef.current = createEnemies(
          3,
          Math.floor(Math.random() * 10 + 1),
          waveRef.current
        );
        waveRef.current++;
        lastEnemyShotTimeRef.current = Date.now() + 1000;
      }

      if (enemiesHitBottom && !gameOverTriggeredRef.current) {
        if (isShieldActiveRef.current) {
          ctx.strokeStyle = "cyan";
          const playerHitboxWidth = 60;
          const playerHitboxHeight = 60;
          const playerHitboxX =
            playerXRef.current + (100 - playerHitboxWidth) / 2;
          const playerHitboxY = playerY + (100 - playerHitboxHeight) / 2;
          ctx.strokeRect(
            playerHitboxX,
            playerHitboxY,
            playerHitboxWidth,
            playerHitboxHeight
          );
          isShieldActiveRef.current = false;
          activePowerUpsRef.current = activePowerUpsRef.current.filter(
            (p) => p.power !== "shield"
          );
        } else {
          gameOverTriggeredRef.current = true;
          clearAllPowerUps();
          onGameOver(scoreRef.current);
        }
      }

      enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => {
        const playerHitboxWidth = 60;
        const playerHitboxHeight = 60;
        const playerHitboxX =
          playerXRef.current + (100 - playerHitboxWidth) / 2;
        const playerHitboxY = playerY + (100 - playerHitboxHeight) / 2;

        const isHit =
          b.enemyBulletX < playerHitboxX + playerHitboxWidth &&
          b.enemyBulletX + b.enemyBulletwidth > playerHitboxX &&
          b.enemyBulletY < playerHitboxY + playerHitboxHeight &&
          b.enemyBulletY + b.enemyBulletheight > playerHitboxY;

        if (isHit && !gameOverTriggeredRef.current) {
          if (isShieldActiveRef.current) {
            isShieldActiveRef.current = false;
            activePowerUpsRef.current = activePowerUpsRef.current.filter(
              (p) => p.power !== "shield"
            );
          } else {
            gameOverTriggeredRef.current = true;
            clearAllPowerUps();
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

      if (playerDamageMultiplierRef.current > 1) {
        ctx.fillStyle = "#ff4444";
        ctx.font = "bold 16px 'Press Start 2P', cursive";
        ctx.fillText(
          `DMG: x${playerDamageMultiplierRef.current.toFixed(1)}`,
          720,
          50
        );
      }

      if (activePowerUpsRef.current.length > 0) {
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 16px 'Press Start 2P', cursive";
        ctx.fillText(`Power-ups: ${activePowerUpsRef.current.length}`, 20, 50);

        let effectY = 80;
        activePowerUpsRef.current.forEach((powerUp) => {
          if (powerUp.expiration === Infinity) {
            ctx.fillStyle = "#00ffff";
            ctx.font = "12px 'Press Start 2P', cursive";
            if (powerUp.power === "damage boost") {
              ctx.fillText(
                `Damage Boost: x${permanentDamageBoostsRef.current}`,
                20,
                effectY
              );
            } else {
              ctx.fillText(`${powerUp.power}: ACTIVE`, 20, effectY);
            }
          } else {
            const timeLeft = Math.max(0, powerUp.expiration - Date.now());
            const timeLeftSeconds = Math.ceil(timeLeft / 1000);
            ctx.fillStyle = "#ffff00";
            ctx.font = "12px 'Press Start 2P', cursive";
            ctx.fillText(`${powerUp.power}: ${timeLeftSeconds}s`, 20, effectY);
          }
          effectY += 20;
        });
      }

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
