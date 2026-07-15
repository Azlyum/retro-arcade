import { useCallback, useEffect, useRef, useState } from "react";
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
import enemyBulletImgSrc from "./assets/enemyBullet.png";
import playerBulletImgSrc from "./assets/playerBullet.png";
import { clearAllPowerUps, usePowerUpState } from "./powerUp/powerUpState";
import { activatePowerUp } from "./powerUp/applyPowerUp";
import { useMuzzleFlashes } from "./fx/muzzleFlash";
import { drawPowerUpHUD } from "./fx/powerUpHUD";

export const Canvas = ({
  onGameOver,
  onSpawnPowerUp,
}: {
  onGameOver: (score: number) => void;
  onSpawnPowerUp?: (powerUp: string) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.85);
  const playerBulletImageRef = useRef<HTMLImageElement | null>(null);
  const enemyBulletImageRef = useRef<HTMLImageElement | null>(null);
  const bulletsRef = useRef<Bullet[]>([]);
  const enemyBulletsRef = useRef<EnemyBullet[]>([]);
  const enemyFireRateRef = useRef(2000);
  const lastEnemyShotTimeRef = useRef(Date.now() + 1000);
  const playerDamageMultiplierRef = useRef(1);
  const permanentDamageBoostsRef = useRef(0);
  const powerUpState = usePowerUpState(
    playerDamageMultiplierRef,
    permanentDamageBoostsRef,
  );
  const { spawnMuzzleFlash, drawMuzzleFlashes } = useMuzzleFlashes();
  const {
    fireRateRef,
    isShieldActiveRef,
    isDoubleShotActiveRef,
    isBigBulletActiveRef,
    isPlayerSpeedBoostActiveRef,
    isBulletSpreadActiveRef,
    isFreezeEnemiesActiveRef,
    isScoreBoostActiveRef,
    isSlowMotionActiveRef,
    isAutoFireActiveRef,
    activeTimersRef,
    activePowerUpsRef,
  } = powerUpState;

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
      playerDamageMultiplierRef,
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
      playerBulletImg.src = playerBulletImgSrc;

      const enemyBulletImg = new Image();
      enemyBulletImg.onload = () => {
        enemyBulletImageRef.current = enemyBulletImg;
      };
      enemyBulletImg.onerror = () => {};
      enemyBulletImg.src = enemyBulletImgSrc;
    };
    loadImages();

    const timers = activeTimersRef.current;
    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
      timers.clear();
    };
  }, [activeTimersRef]);

  const spawnPowerUp = useCallback(
    (power: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const playerY = canvas.height - 100;
      const newPowerUp: PowerUp = {
        power,
        x: playerXRef.current + 50 - 16,
        y: playerY - 50,
        height: 32,
        width: 32,
        opacity: 1,
        powerUpExpirationTimer: Date.now() + 15000,
      };

      powerUpsRef.current.push(newPowerUp);
    },
    [playerXRef],
  );

  useEffect(() => {
    if (onSpawnPowerUp) {
      (window as { spawnPowerUp?: (power: string) => void }).spawnPowerUp =
        spawnPowerUp;
    }
  }, [onSpawnPowerUp, spawnPowerUp]);

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
      const movementSpeed = isPlayerSpeedBoostActiveRef.current ? 6.5 : 3.5;

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
          spawnMuzzleFlash(playerXRef.current + 50, playerY + 10);
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
            enemyBulletwidth: 30,
            enemyBulletheight: 36,
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
        waveRef,
      );

      drawBullet(ctx, bulletsRef.current, playerBulletImageRef.current);
      drawEnemyBullets(
        ctx,
        enemyBulletsRef.current,
        enemyBulletImageRef.current,
      );

      bulletsRef.current = updateBullets(
        bulletsRef.current,
        isSlowMotionActiveRef,
      );

      const updatedBullets = updateEnemyBullets(
        enemyBulletsRef.current,
        isSlowMotionActiveRef,
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
          explosionsRef.current.push({ x: cx, y: cy, r: 10, life: 18 });
          const mag = intensity * 0.45;
          shakeRef.current = { t: 12, mag, base: mag };
        },
      );

      if (shakeRef.current.t > 0) {
        const s = shakeRef.current;
        const lifeRatio = s.t / 14;
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

      drawMuzzleFlashes(ctx);

      drawPlayer(
        ctx,
        playerXRef.current,
        canvas.height,
        isShieldActiveRef.current,
      );
      drawPowerUpHUD(ctx, powerUpState);

      floatingTextsRef.current.forEach((text) => {
        ctx.font = '16px "Press Start 2P", cursive';
        ctx.fillText(text.text, text.x, text.y);
        text.y -= 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${text.opacity})`;
        text.lifespan -= 1;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter(
        (t) => t.lifespan > 0,
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
          activatePowerUp(powerUpState, p.power);
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
          2000 - Math.floor(waveRef.current / 3) * 25,
        );
        enemiesRef.current = createEnemies(
          3,
          Math.floor(Math.random() * 10 + 1),
          waveRef.current,
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
            playerHitboxHeight,
          );
          isShieldActiveRef.current = false;
          activePowerUpsRef.current = activePowerUpsRef.current.filter(
            (powerUp) => powerUp.power !== "shield",
          );
        } else {
          gameOverTriggeredRef.current = true;
          clearAllPowerUps(powerUpState);
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
              (powerUp) => powerUp.power !== "shield",
            );
          } else {
            const playerDeath = new Howl({
              src: ["/sounds/pixel-invaders/player_death.mp3"],
              volume: 0.2,
            });
            playerDeath.play();
            gameOverTriggeredRef.current = true;
            clearAllPowerUps(powerUpState);
            onGameOver(scoreRef.current);
          }
          return false;
        }

        return true;
      });

      ctx.fillStyle = "white";
      ctx.font = "bold 24px 'Press Start 2P', cursive";
      ctx.fillText(`Wave: ${waveRef.current}`, 20, 30);
      ctx.textAlign = "center";
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, 30);
      ctx.textAlign = "left";

      if (playerDamageMultiplierRef.current > 1) {
        ctx.fillStyle = "#ff4444";
        ctx.font = "bold 16px 'Press Start 2P', cursive";
        ctx.fillText(
          `DMG: x${playerDamageMultiplierRef.current.toFixed(1)}`,
          720,
          50,
        );
      }

      if (activePowerUpsRef.current.length > 0) {
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 16px 'Press Start 2P', cursive";
        ctx.fillText(`Power-ups: ${activePowerUpsRef.current.length}`, 20, 50);

        let effectY = 110;
        activePowerUpsRef.current.forEach((powerUp) => {
          if (powerUp.expiration === Infinity) {
            ctx.fillStyle = "#00ffff";
            ctx.font = "12px 'Press Start 2P', cursive";
            if (powerUp.power === "damage boost") {
              ctx.fillText(
                `Damage Boost: x${permanentDamageBoostsRef.current}`,
                20,
                effectY,
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
  }, [
    activePowerUpsRef,
    drawMuzzleFlashes,
    fireRateRef,
    isAutoFireActiveRef,
    isFreezeEnemiesActiveRef,
    isPlayerSpeedBoostActiveRef,
    isScoreBoostActiveRef,
    isShieldActiveRef,
    isSlowMotionActiveRef,
    keysPressed,
    lastShotTime,
    onGameOver,
    playerXRef,
    powerUpState,
    shootBullet,
    spawnMuzzleFlash,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[95vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};
