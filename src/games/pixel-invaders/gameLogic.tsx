import { RefObject, useEffect, useRef, useState } from "react";
import { Bullet } from "./drawBullet";
import { AudioManager } from "./audioManager";
import { Enemy } from "./drawEnemies";
import { FloatingText, portfolioFacts } from "./utils/floatingTextArray";
import { PowerUp, PowerUpType } from "./utils/powerUpUtils";

export const allPowerUpTypes: PowerUpType[] = [
  "shield",
  "rapid fire",
  "rapid fire",
  "double shot",
  "double shot",
  "big bullets",
  "big bullets",
  "speed boost",
  "bullet spread",
  "bullet spread",
  "freeze enemies",
  "score boost",
  "score boost",
  "slow motion",
  "slow motion",
  "auto fire",
  "auto fire",
  "damage boost",
];

const PLAYER_WIDTH = 100;

export const usePlayerControls = (
  canvasWidth: number,
  canvasHeight: number,
  bulletsRef: React.RefObject<Bullet[]>,
  fireRateRef: React.RefObject<number>,
  isDoubleShotActiveRef: RefObject<boolean>,
  bigBulletActiveRef: RefObject<boolean>,
  playerSpeedBoostRef: RefObject<boolean>,
  isBulletSpreadActiveRef: RefObject<boolean>,
  isAutoFireActiveRef: React.RefObject<boolean>,
  playerDamageMultiplierRef: React.RefObject<number>
) => {
  const [playerX] = useState((canvasWidth - PLAYER_WIDTH) / 2);
  const playerXRef = useRef(playerX);
  const lastShotTime = useRef(0);

  const keysPressed = useRef<Set<string>>(new Set());

  const shootBullet = () => {
    AudioManager.play("shooting");

    const width = bigBulletActiveRef.current ? 60 : 30;
    const height = bigBulletActiveRef.current ? 60 : 30;
    const damageMultiplier = playerDamageMultiplierRef.current;
    const bigBulletDamage = bigBulletActiveRef.current ? 200 : 100;
    const doubleShotDamage = 200;

    const addBullet = (x: number, dx: number, damage: number) => {
      const newBullet = {
        bulletX: x,
        bulletY: canvasHeight - 80,
        width,
        height,
        dx,
        damage: damage * damageMultiplier,
      };
      bulletsRef.current.push(newBullet);
    };

    if (isDoubleShotActiveRef.current) {
      addBullet(playerXRef.current + 22, 0, bigBulletDamage);
      addBullet(playerXRef.current + 10, 0, doubleShotDamage);
    } else {
      addBullet(playerXRef.current + 22, 0, bigBulletDamage);
    }

    if (isBulletSpreadActiveRef.current) {
      if (isDoubleShotActiveRef.current) {
        addBullet(playerXRef.current + 22, -2, bigBulletDamage);
        addBullet(playerXRef.current + 10, -2, doubleShotDamage);
        addBullet(playerXRef.current + 22, 2, bigBulletDamage);
        addBullet(playerXRef.current + 10, 2, doubleShotDamage);
      } else {
        addBullet(playerXRef.current + 22, -2, bigBulletDamage);
        addBullet(playerXRef.current + 22, 2, bigBulletDamage);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvasWidth]);

  return { playerX, playerXRef, keysPressed, lastShotTime, shootBullet };
};

export let currentFactIndex = 0;

export const checkBulletHits = (
  bullets: Bullet[],
  enemies: Enemy[],
  scoreRef: React.RefObject<number>,
  floatingText: React.RefObject<FloatingText[]>,
  powerUp: React.RefObject<PowerUp[]>,
  isScoreBoostActiveRef: React.RefObject<boolean>,
  waveRef: React.RefObject<number>,
  onEnemyDeath?: (x: number, y: number, intensity: number) => void
) => {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      const scale = 3;
      const scaledWidth = enemy.width * scale;
      const scaledHeight = enemy.height * scale;
      const scaledX = enemy.x - (enemy.width * (scale - 1)) / 2;
      const scaledY = enemy.y - (enemy.height * (scale - 1)) / 2;

      const isHit =
        bullet.bulletX < scaledX + scaledWidth &&
        bullet.bulletX + bullet.width > scaledX &&
        bullet.bulletY < scaledY + scaledHeight &&
        bullet.bulletY + bullet.height > scaledY;

      if (isHit) {
        enemy.health -= bullet.damage;
        bullets.splice(i, 1);
        if (enemy.health <= 0) {
          AudioManager.play("enemyDeath");
          enemies.splice(j, 1);
          scoreRef.current += isScoreBoostActiveRef.current
            ? 20 + waveRef.current * 2
            : 10 + waveRef.current * 2;

          const text =
            portfolioFacts[currentFactIndex++ % portfolioFacts.length];

          floatingText.current.push({
            x: scaledX + scaledWidth / 2,
            y: scaledY + scaledHeight / 2,
            textPortfolio: text,
            opacity: 1,
            lifespan: 60,
            text,
          });

          if (onEnemyDeath) {
            const centerX = scaledX + scaledWidth / 2;
            const centerY = scaledY + scaledHeight / 2;
            const base = Math.max(3, enemy.maxHealth / 25);
            const waveDampen =
              1 / (1 + Math.max(0, waveRef.current - 1) * 0.08);
            const intensity = Math.min(8, base * waveDampen);
            onEnemyDeath(centerX, centerY, intensity);
          }

          const droppingPowerUps =
            allPowerUpTypes[Math.floor(Math.random() * allPowerUpTypes.length)];
          const powerUpDropChance = 0.15;
          const maxActivePowerUps = 3;

          if (
            Math.random() < powerUpDropChance &&
            powerUp.current.length < maxActivePowerUps
          ) {
            powerUp.current.push({
              power: droppingPowerUps,
              x: scaledX + scaledWidth / 2 - 16,
              y: scaledY + scaledHeight / 2 - 16,
              height: 32,
              width: 32,
              opacity: 1,
              powerUpExpirationTimer: Date.now() + 15000,
            });
          }
        }
        break;
      }
    }
  }
};
