const enemyTypes = ["grunt", "tank", "blitz"] as const;
type EnemyType = (typeof enemyTypes)[number];

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  maxHealth: number;
  health: number;
  type: EnemyType;
  spriteKey: "html" | "css" | "js";
}

const loadImage = (src: string): HTMLImageElement => {
  const img = new Image();
  img.src = require(`${src}`);
  return img;
};

const enemySprites = {
  html: {
    normal: loadImage("./assets/html_enemy.png"),
    damaged: loadImage("./assets/html_enemy_damaged.png"),
  },
  css: {
    normal: loadImage("./assets/css_bug.png"),
    damaged: loadImage("./assets/css_bug_damaged.png"),
  },
  js: {
    normal: loadImage("./assets/js_error.png"),
    damaged: loadImage("./assets/js_error_damaged.png"),
  },
};

export const createEnemies = (
  rows: number,
  cols: number,
  waveNumber: number
): Enemy[] => {
  const spacingX = 60;
  const spacingY = 50;
  const enemyWidth = 40;
  const enemyHeight = 40;
  const enemies: Enemy[] = [];
  const totalWidth = cols * spacingX;
  const offsetX = (window.innerWidth * 0.95 - totalWidth) / 2;
  const waveMultiplier = 1 + waveNumber * 0.1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

      let baseHealth = 100;
      switch (type) {
        case "tank":
          baseHealth = 175;
          break;
        case "blitz":
          baseHealth = 75;
          break;
      }
      const health = Math.floor(baseHealth * waveMultiplier);

      let spriteKey: "html" | "css" | "js" = "html";
      switch (type) {
        case "tank":
          spriteKey = "css";
          break;
        case "blitz":
          spriteKey = "js";
          break;
      } 

      enemies.push({
        x: offsetX + col * spacingX,
        y: row * spacingY + 30,
        width: enemyWidth,
        height: enemyHeight,
        health,
        maxHealth: health,
        type,
        spriteKey,
      });
    }
  }

  return enemies;
};

export const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[]
) => {
  const scale = 3;

  enemies.forEach((enemy) => {
    const spriteSet = enemySprites[enemy.spriteKey];
    const image =
      enemy.health <= enemy.maxHealth / 2
        ? spriteSet.damaged
        : spriteSet.normal;

    if (image.complete && image.naturalWidth > 0) {
      ctx.drawImage(
        image,
        enemy.x - (enemy.width * (scale - 1)) / 2,
        enemy.y - (enemy.height * (scale - 1)) / 2,
        enemy.width * scale,
        enemy.height * scale
      );
    }
  });
};

export const updateEnemies = (
  enemies: Enemy[],
  canvasHeight: number,
  canvasWidth: number,
  directionRef: { current: number },
  playerY: number,
  isFreezeEnemiesActiveRef: { current: any },
  isSlowMotionActiveRef: React.RefObject<boolean>,
  waveRef: { current: number }
): boolean => {
  let hitBottom = false;
  let hitPlayer = false;
  const typeSpeeds = {
    grunt: 1,
    tank: 0.6,
    blitz: 1.5,
  };

  if (isFreezeEnemiesActiveRef.current) return false;

  enemies.forEach((enemy) => {
    const baseSpeed = isSlowMotionActiveRef.current ? 0.4 : 1;
    const waveSpeedMultiplier = 1 + waveRef.current * 0.05;
    const speed = baseSpeed * waveSpeedMultiplier * typeSpeeds[enemy.type];
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
