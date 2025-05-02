import { useEffect, useRef, useState } from "react";
import { Bullet } from "./drawBullet";
import { Enemy } from "./drawEnemies";

export const usePlayerControls = (
  canvasWidth: number,
  bulletsRef: React.RefObject<Bullet[]>
) => {
  const [playerX, setPlayerX] = useState(100);
  const playerXRef = useRef(playerX);
  const lastShotTime = useRef(0);
  const fireRate = 250;

  const keysPressed = useRef<Set<string>>(new Set());

  const PLAYER_WIDTH = 50;

  const shootBullet = () => {
    bulletsRef.current.push({
      bulletX: playerXRef.current + 22,
      bulletY: 500,
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

      // Movement
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

      // Shooting
      if (keysPressed.current.has("Space")) {
        const now = Date.now();
        if (now - lastShotTime.current > fireRate) {
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

export const checkBulletHits = (
  bullets: Bullet[],
  enemies: Enemy[],
  scoreRef: React.RefObject<number>
) => {
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (
        bullet.bulletX < enemy.x + enemy.width &&
        bullet.bulletX + bullet.width > enemy.x &&
        bullet.bulletY < enemy.y + enemy.height &&
        bullet.bulletY + bullet.height > enemy.y
      ) {
        console.log("Hit detected!");
        const bulletIndex = bullets.indexOf(bullet);
        const enemyIndex = enemies.indexOf(enemy);

        if (bulletIndex > -1) bullets.splice(bulletIndex, 1);
        if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
        scoreRef.current += 10;
      }
    });
  });
};
