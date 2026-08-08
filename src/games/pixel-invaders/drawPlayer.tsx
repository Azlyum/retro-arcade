import playerImgSrc from "./assets/player.png";

const playerImg = new Image();
playerImg.src = playerImgSrc;

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  playerX: number,
  canvasHeight: number,
  isShieldActive: boolean,
) => {
  const PLAYER_Y = canvasHeight - 120;
  const width = 100;
  const height = 100;

  if (playerImg.complete) {
    ctx.drawImage(playerImg, playerX, PLAYER_Y, width, height);
  }

  if (isShieldActive) {
    const time = Date.now() * 0.005;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 0.5;
      const distance = 70 + Math.sin(time * 2 + i) * 10;
      const particleX = playerX + width / 2 + Math.cos(angle) * distance;
      const particleY = PLAYER_Y + height / 2 + Math.sin(angle) * distance;

      ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
