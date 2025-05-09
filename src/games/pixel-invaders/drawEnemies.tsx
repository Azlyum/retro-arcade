export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
}

export const createEnemies = (rows: number, cols: number): Enemy[] => {
  const spacingX = 60;
  const spacingY = 50;
  const enemyWidth = 40;
  const enemyHeight = 40;

  const enemies: Enemy[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: col * spacingX + 50,
        y: row * spacingY + 30,
        width: enemyWidth,
        height: enemyHeight,
        health: 100,
      });
    }
  }

  return enemies;
};

export const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[]
) => {
  ctx.fillStyle = "#f00";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
};

export const updateEnemies = (
  enemies: Enemy[],
  canvasHeight: number,
  canvasWidth: number,
  directionRef: { current: number },
  playerY: number,
  isFreezeEnemiesActiveRef,
  isSlowMotionActiveRef: React.RefObject<boolean>,
  waveRef
): boolean => {
  let hitBottom = false;
  let hitPlayer = false;

  if (isFreezeEnemiesActiveRef.current) return false;

  enemies.forEach((enemy) => {
    const baseSpeed = isSlowMotionActiveRef.current ? 0.4 : 1;
    const waveSpeedMultiplier = 1 + waveRef.current * 0.05;
    const speed = baseSpeed * waveSpeedMultiplier;
    enemy.x += speed * directionRef.current;

    if (enemy.y + enemy.height >= canvasHeight) {
      hitBottom = true;
    }

    if (enemy.y + enemy.height >= playerY) {
      hitPlayer = true;
    }
  });

  const leftMost = Math.min(...enemies.map((e) => e.x));
  const rightMost = Math.max(...enemies.map((e) => e.x + e.width));

  if (leftMost < 0 || rightMost > canvasWidth) {
    directionRef.current *= -1;
    enemies.forEach((enemy) => {
      enemy.y += 10;
    });
  }

  return hitBottom || hitPlayer;
};
