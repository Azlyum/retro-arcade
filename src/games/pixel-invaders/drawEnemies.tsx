export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
}

export const createEnemies = (rows: number, cols: number): Enemy[] => {
  const spacingX = 80;
  const spacingY = 70;
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
  playerY: number
): boolean => {
  let hitBottom = false;
  let hitPlayer = false;

  enemies.forEach((enemy) => {
    enemy.x += 1 * directionRef.current;

    // Check if any enemy hits the bottom
    if (enemy.y + enemy.height >= canvasHeight) {
      hitBottom = true;
    }
    // Check if any enemy hits the player
    if (enemy.y + enemy.height >= playerY) {
      hitPlayer = true;
    }
  });

  const leftMost = Math.min(...enemies.map((e) => e.x));
  const rightMost = Math.max(...enemies.map((e) => e.x + e.width));

  // Change direction and move down if touching sides
  if (leftMost < 0 || rightMost > canvasWidth) {
    directionRef.current *= -1;
    enemies.forEach((enemy) => {
      enemy.y += 10;
    });
  }

  return hitBottom || hitPlayer;
};
