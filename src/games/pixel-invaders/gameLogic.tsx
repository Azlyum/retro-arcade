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

export const usePlayerControls = (
  canvasWidth: number,
  canvasHeight: number,
  bulletsRef: React.RefObject<Bullet[]>,
  fireRateRef: React.RefObject<number>
) => {
  const [playerX, setPlayerX] = useState(60);
  const playerXRef = useRef(playerX);
  const lastShotTime = useRef(0);

  const keysPressed = useRef<Set<string>>(new Set());

  const PLAYER_WIDTH = 50;

  const shootBullet = () => {
    bulletsRef.current.push({
      bulletX: playerXRef.current + 22,
      bulletY: canvasHeight - 80,
      width: 6,
      height: 12,
    });
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

      //! Movement
      if (
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("KeyA")
      ) {
        newX = Math.max(newX - 1.8, 0);
      }

      if (
        keysPressed.current.has("ArrowRight") ||
        keysPressed.current.has("KeyD")
      ) {
        newX = Math.min(newX + 1.8, canvasWidth - PLAYER_WIDTH);
      }

      //! Shooting
      if (keysPressed.current.has("Space")) {
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
  powerUp: React.RefObject<PowerUp[]>
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
        const POWER_UP_DROP_CHANCE = 0.03;
        const MAX_ACTIVE_POWERUPS = 2;
        const powerUpsDrop = Math.random() < POWER_UP_DROP_CHANCE;

        if (bulletIndex > -1) bullets.splice(bulletIndex, 1);
        if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
        scoreRef.current += 10;
        floatingText.current.push({
          x: enemy.x,
          y: enemy.y,
          textPortfolio: portfolioText,
          opacity: 1,
          lifespan: 60,
          text: `${portfolioText}`,
        });
        if (powerUpsDrop && powerUp.current.length < MAX_ACTIVE_POWERUPS) {
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
