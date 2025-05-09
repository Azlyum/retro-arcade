export interface Bullet {
  bulletX: number;
  bulletY: number;
  width: number;
  height: number;
  dx?: number;
}

export interface EnemyBullet {
  enemyBulletX: number;
  enemyBulletY: number;
  enemyBulletwidth: number;
  enemyBulletheight: number;
  enemyBulletdx?: number;
}

export const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet[]) => {
  ctx.fillStyle = "#008000";
  bullet.forEach((bullet) => {
    ctx.fillRect(bullet.bulletX, bullet.bulletY, bullet.width, bullet.height);
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
  bullets: EnemyBullet[]
) => {
  ctx.fillStyle = "#FF0000";
  bullets.forEach((bullet) => {
    ctx.fillRect(
      bullet.enemyBulletX,
      bullet.enemyBulletY,
      bullet.enemyBulletwidth,
      bullet.enemyBulletheight
    );
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
