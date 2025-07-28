export interface Bullet {
  bulletX: number;
  bulletY: number;
  width: number;
  height: number;
  damage: number;
  dx?: number;
}

export interface EnemyBullet {
  enemyBulletX: number;
  enemyBulletY: number;
  enemyBulletwidth: number;
  enemyBulletheight: number;
  enemyBulletdx?: number;
}

export const drawBullet = (
  ctx: CanvasRenderingContext2D,
  bullet: Bullet[],
  playerBulletImage: HTMLImageElement | null
) => {
  bullet.forEach((bullet) => {
    if (playerBulletImage && playerBulletImage.complete) {
      ctx.drawImage(
        playerBulletImage,
        bullet.bulletX,
        bullet.bulletY,
        bullet.width,
        bullet.height
      );
    } else {
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(bullet.bulletX, bullet.bulletY, bullet.width, bullet.height);
    }
  });
};

export const updateBullets = (
  bullets: Bullet[],
  isSlowMotionActiveRef: React.RefObject<boolean>
): Bullet[] => {
  const speed = isSlowMotionActiveRef.current ? 2 : 5;

  return bullets
    .map((bullet) => ({
      ...bullet,
      bulletY: bullet.bulletY - speed,
      bulletX: bullet.bulletX + (bullet.dx || 0),
    }))
    .filter((bullet) => bullet.bulletY > 0);
};

export const drawEnemyBullets = (
  ctx: CanvasRenderingContext2D,
  bullets: EnemyBullet[],
  enemyBulletImage: HTMLImageElement | null
) => {
  bullets.forEach((bullet) => {
    if (enemyBulletImage && enemyBulletImage.complete) {
      ctx.drawImage(
        enemyBulletImage,
        bullet.enemyBulletX,
        bullet.enemyBulletY,
        bullet.enemyBulletwidth,
        bullet.enemyBulletheight
      );
    } else {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(
        bullet.enemyBulletX,
        bullet.enemyBulletY,
        bullet.enemyBulletwidth,
        bullet.enemyBulletheight
      );
    }
  });
};

export const updateEnemyBullets = (
  bullets: EnemyBullet[],
  isSlowMotionActiveRef: React.RefObject<boolean>
): EnemyBullet[] => {
  const speed = isSlowMotionActiveRef.current ? 2 : 4;
  return bullets
    .map((b) => ({
      ...b,
      enemyBulletY: b.enemyBulletY + speed,
    }))
    .filter((b) => b.enemyBulletY < window.innerHeight);
};
