export interface Bullet {
  bulletX: number;
  bulletY: number;
  width: number;
  height: number;
}

export const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet[]) => {
  ctx.fillStyle = "#008000";
  bullet.forEach((bullet) => {
    ctx.fillRect(bullet.bulletX, bullet.bulletY, bullet.width, bullet.height);
  });
};

export const updateBullets = (bullets: Bullet[]): Bullet[] => {
  return bullets
    .map((bullet) => ({
      ...bullet,
      bulletY: bullet.bulletY - 5, // Move upward
    }))
    .filter((bullet) => bullet.bulletY > 0); // Remove off-screen
};
