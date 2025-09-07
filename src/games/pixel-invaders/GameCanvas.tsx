import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
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
import { AudioManager } from "./audioManager";
import { PowerUp, powerUpIconMap } from "./utils/powerUpUtils";
import { getCachedImage } from "./utils/imageCache";

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

  const activeTimersRef = useRef<Map<string, number>>(new Map());
  const enemyShootingSoundRef = useRef<Howl | null>(null);

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
  const explosionsRef = useRef<
    { x: number; y: number; r: number; life: number }[]
  >([]);
  const shakeRef = useRef<{ t: number; mag: number; base: number }>({
    t: 0,
    mag: 0,
    base: 0,
  });
  const muzzleFlashesRef = useRef<
    { x: number; y: number; r: number; life: number }[]
  >([]);

  useEffect(() => {
    enemiesRef.current = createEnemies(3, 6, waveRef.current);
  }, [canvasWidth]);

  useEffect(() => {
    const loadImages = () => {
      const playerBulletImg = new Image();
      playerBulletImg.onload = () => {
        playerBulletImageRef.current = playerBulletImg;
      };
      playerBulletImg.onerror = () => {};
      playerBulletImg.src = "/images/playerBullet.png";

      const enemyBulletImg = new Image();
      enemyBulletImg.onload = () => {
        enemyBulletImageRef.current = enemyBulletImg;
      };
      enemyBulletImg.onerror = () => {};
      enemyBulletImg.src = "/images/enemyBullet.png";
    };

    enemyShootingSoundRef.current = null;

    loadImages();

    const timers = activeTimersRef.current;
    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
      timers.clear();
    };
  }, []);

  const clearAllPowerUps = () => {
    activeTimersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    activeTimersRef.current.clear();

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

    activePowerUpsRef.current = [];
  };

  const activatePowerUp = (power: string) => {
    const duration = 15000;
    const expiration = Date.now() + duration;
    AudioManager.play("powerPickup");

    if (power === "shield") {
      if (isShieldActiveRef.current) {
        return;
      } else {
        isShieldActiveRef.current = true;
        activePowerUpsRef.current.push({ power, expiration: Infinity });
        return;
      }
    }

    if (power === "damage boost") {
      permanentDamageBoostsRef.current += 1;
      playerDamageMultiplierRef.current += 0.5;
      activePowerUpsRef.current.push({ power, expiration: Infinity });
      return;
    }

    const existingPowerUp = activePowerUpsRef.current.find(
      (p) => p.power === power
    );

    const applyPowerUpEffect = (powerType: string) => {
      switch (powerType) {
        case "rapid fire":
          fireRateRef.current = 150;
          break;
        case "double shot":
          isDoubleShotActiveRef.current = true;
          break;
        case "big bullets":
          isBigBulletActiveRef.current = true;
          break;
        case "speed boost":
          isPlayerSpeedBoostActiveRef.current = true;
          break;
        case "bullet spread":
          isBulletSpreadActiveRef.current = true;
          break;
        case "freeze enemies":
          isFreezeEnemiesActiveRef.current = true;
          break;
        case "score boost":
          isScoreBoostActiveRef.current = true;
          break;
        case "slow motion":
          isSlowMotionActiveRef.current = true;
          break;
        case "auto fire":
          isAutoFireActiveRef.current = true;
          break;
      }
    };

    if (existingPowerUp) {
      existingPowerUp.expiration = expiration;
      return;
    }

    applyPowerUpEffect(power);
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

    let rafId = 0;
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
        (keysPressed.current.has("Space") || isAutoFireActiveRef.current) &&
        !gameOverTriggeredRef.current;

      if (shouldShoot) {
        const now = Date.now();
        if (now - lastShotTime.current > fireRateRef.current) {
          shootBullet();
          lastShotTime.current = now;
          muzzleFlashesRef.current.push({
            x: playerXRef.current + 50,
            y: playerY + 10,
            r: 6,
            life: 6,
          });
        }
      }

      playerXRef.current = newX;

      const now = Date.now();
      if (
        enemiesRef.current.length > 0 &&
        now - lastEnemyShotTimeRef.current > enemyFireRateRef.current &&
        enemyBulletsRef.current.length < 5 &&
        !gameOverTriggeredRef.current
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
          AudioManager.play("shooting");
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

      drawBullet(ctx, bulletsRef.current, playerBulletImageRef.current);
      drawEnemyBullets(
        ctx,
        enemyBulletsRef.current,
        enemyBulletImageRef.current
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
        waveRef,
        (cx, cy, intensity) => {
          // explosion
          explosionsRef.current.push({ x: cx, y: cy, r: 10, life: 18 });
          // screen shake
          const mag = intensity * 0.45;
          shakeRef.current = { t: 12, mag, base: mag };
        }
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

        expiredPowerUps.forEach((powerUp) => {
          const timer = activeTimersRef.current.get(powerUp.power);
          if (timer) {
            clearTimeout(timer);
            activeTimersRef.current.delete(powerUp.power);
          }

          switch (powerUp.power) {
            case "rapid fire":
              fireRateRef.current = 400;
              break;
            case "double shot":
              isDoubleShotActiveRef.current = false;
              break;
            case "big bullets":
              isBigBulletActiveRef.current = false;
              break;
            case "speed boost":
              isPlayerSpeedBoostActiveRef.current = false;
              break;
            case "bullet spread":
              isBulletSpreadActiveRef.current = false;
              break;
            case "freeze enemies":
              isFreezeEnemiesActiveRef.current = false;
              break;
            case "score boost":
              isScoreBoostActiveRef.current = false;
              break;
            case "slow motion":
              isSlowMotionActiveRef.current = false;
              break;
            case "auto fire":
              isAutoFireActiveRef.current = false;
              break;
          }
        });

        activePowerUpsRef.current = activePowerUpsRef.current.filter(
          (p) => p.expiration === Infinity || p.expiration > now
        );

        activePowerUpsRef.current.forEach((powerUp, i) => {
          const iconPath = powerUpIconMap[powerUp.power];
          if (!iconPath) return;

          const img = getCachedImage(iconPath);

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

      // apply screen shake
      if (shakeRef.current.t > 0) {
        const s = shakeRef.current;
        // ease in/out using a sine curve over lifetime
        const lifeRatio = s.t / 14; // 14 frames total
        const ease = Math.sin(lifeRatio * Math.PI);
        const currentMag = s.base * ease;
        const dx = (Math.random() - 0.5) * currentMag;
        const dy = (Math.random() - 0.5) * currentMag;
        ctx.save();
        ctx.translate(dx, dy);
        drawEnemies(ctx, enemiesRef.current);
        ctx.restore();
        s.t -= 1;
        s.mag = Math.max(0, currentMag * 0.95);
      } else {
        drawEnemies(ctx, enemiesRef.current);
      }
      // explosions
      explosionsRef.current.forEach((e) => {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const alpha = Math.max(0, e.life / 18);
        const grd = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
        grd.addColorStop(0, `rgba(255,200,80,${alpha})`);
        grd.addColorStop(1, `rgba(255,0,0,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        e.r += 2.2;
        e.life -= 1;
      });
      explosionsRef.current = explosionsRef.current.filter((e) => e.life > 0);

      // muzzle flashes
      muzzleFlashesRef.current.forEach((f) => {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const alpha = Math.max(0, f.life / 6);
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        grd.addColorStop(0, `rgba(255,255,200,${alpha})`);
        grd.addColorStop(1, `rgba(255,255,0,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        f.r += 1.5;
        f.life -= 1;
      });
      muzzleFlashesRef.current = muzzleFlashesRef.current.filter(
        (f) => f.life > 0
      );
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

        const img = getCachedImage(iconPath);

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
          AudioManager.play("powerPickup");
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
            const playerDeath = new Howl({
              src: ["/sounds/pixel-invaders/player_death.mp3"],
              volume: 0.2,
            });
            playerDeath.play();
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

      rafId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafId) cancelAnimationFrame(rafId);
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
