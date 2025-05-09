import { useEffect, useRef, useState } from "react";
import { Bullet } from "./drawBullet";
import { Enemy } from "./drawEnemies";
import { FloatingText, portfolioFacts } from "./utils/floatingTextArray.tsx";
import { PowerUp, PowerUpType } from "./utils/powerUpUtils.tsx";

export const allPowerUpTypes: PowerUpType[] = [
  "shield",
  "rapid fire",
  "double shot",
  "big bullets",
  "speed boost",
  "bullet spread",
  "freeze enemies",
  "score boost",
  "slow motion",
  "auto fire",
];

const PLAYER_WIDTH = 50;

export const usePlayerControls = (
  canvasWidth: number,
  canvasHeight: number,
  bulletsRef: React.RefObject<Bullet[]>,
  fireRateRef: React.RefObject<number>,
  isDoubleShotActiveRef,
  bigBulletActiveRef,
  playerSpeedBoostRef,
  isBulletSpreadActiveRef,
  isAutoFireActiveRef: React.RefObject<boolean>
) => {
  const [playerX, setPlayerX] = useState((canvasWidth - PLAYER_WIDTH) / 2);
  const playerXRef = useRef(playerX);
  const lastShotTime = useRef(0);

  const keysPressed = useRef<Set<string>>(new Set());

  const shootBullet = () => {
    const width = bigBulletActiveRef.current ? 22 : 12;
    const height = bigBulletActiveRef.current ? 22 : 12;

    bulletsRef.current.push({
      bulletX: playerXRef.current + 22,
      bulletY: canvasHeight - 80,
      width,
      height,
      dx: 0,
    });

    if (isDoubleShotActiveRef.current) {
      bulletsRef.current.push({
        bulletX: playerXRef.current + 10,
        bulletY: canvasHeight - 80,
        width,
        height,
        dx: 0,
      });
    }

    if (isBulletSpreadActiveRef.current) {
      bulletsRef.current.push({
        bulletX: playerXRef.current + 22,
        bulletY: canvasHeight - 80,
        width,
        height,
        dx: -2,
      });

      bulletsRef.current.push({
        bulletX: playerXRef.current + 22,
        bulletY: canvasHeight - 80,
        width,
        height,
        dx: 2,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    const gameLoop = () => {
      let newX = playerXRef.current;
      const movementSpeed = playerSpeedBoostRef.current ? 3.5 : 1.8;

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
        newX = Math.min(newX + movementSpeed, canvasWidth - PLAYER_WIDTH);
      }

      //! Shooting
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
      setPlayerX(newX);

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth]);

  return { playerX, playerXRef };
};

export let currentFactIndex = 0;

export const checkBulletHits = (
  bullets: Bullet[],
  enemies: Enemy[],
  scoreRef: React.RefObject<number>,
  floatingText: React.RefObject<FloatingText[]>,
  powerUp: React.RefObject<PowerUp[]>,
  isScoreBoostActiveRef: React.RefObject<boolean>,
  waveRef: React.RefObject<number>
) => {
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (
        bullet.bulletX < enemy.x + enemy.width &&
        bullet.bulletX + bullet.width > enemy.x &&
        bullet.bulletY < enemy.y + enemy.height &&
        bullet.bulletY + bullet.height > enemy.y
      ) {
        const bulletIndex = bullets.indexOf(bullet);
        const enemyIndex = enemies.indexOf(enemy);
        const portfolioText =
          portfolioFacts[currentFactIndex % portfolioFacts.length];
        currentFactIndex++;
        const droppingPowerUps =
          allPowerUpTypes[Math.floor(Math.random() * allPowerUpTypes.length)];
        const powerUpDropChance = 0.07;
        const maxActivePowerUps = 2;
        const powerUpsDrop = Math.random() < powerUpDropChance;
        const scoreGain = isScoreBoostActiveRef.current
          ? 20 + waveRef.current * 2
          : 10 + waveRef.current * 2;

        if (bulletIndex > -1) bullets.splice(bulletIndex, 1);
        if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
        scoreRef.current += scoreGain;
        floatingText.current.push({
          x: enemy.x,
          y: enemy.y,
          textPortfolio: portfolioText,
          opacity: 1,
          lifespan: 60,
          text: `${portfolioText}`,
        });
        if (powerUpsDrop && powerUp.current.length < maxActivePowerUps) {
          powerUp.current.push({
            power: droppingPowerUps,
            x: enemy.x,
            y: enemy.y,
            height: 6,
            width: 6,
            opacity: 1,
            powerUpExpirationTimer: Date.now() + 15000,
          });
        }
      }
    });
  });
};
