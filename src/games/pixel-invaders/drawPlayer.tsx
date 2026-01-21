const playerImg = new Image();
playerImg.src = require("./assets/player.png");

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  playerX: number,
  canvasHeight: number,
  isShieldActive: boolean
) => {
  const PLAYER_Y = canvasHeight - 100;
  const width = 100;
  const height = 100;

  if (playerImg.complete) {
    ctx.drawImage(playerImg, playerX, PLAYER_Y, width, height);
  }

  if (isShieldActive) {
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.3 + 0.7;

    ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -time * 0.5;
    const shieldX = playerX - 15;
    const shieldY = PLAYER_Y - 15;
    const shieldWidth = width + 30;
    const shieldHeight = height + 30;
    const radius = 20;

    ctx.beginPath();
    ctx.moveTo(shieldX + radius, shieldY);
    ctx.lineTo(shieldX + shieldWidth - radius, shieldY);
    ctx.quadraticCurveTo(
      shieldX + shieldWidth,
      shieldY,
      shieldX + shieldWidth,
      shieldY + radius
    );
    ctx.lineTo(shieldX + shieldWidth, shieldY + shieldHeight - radius);
    ctx.quadraticCurveTo(
      shieldX + shieldWidth,
      shieldY + shieldHeight,
      shieldX + shieldWidth - radius,
      shieldY + shieldHeight
    );
    ctx.lineTo(shieldX + radius, shieldY + shieldHeight);
    ctx.quadraticCurveTo(
      shieldX,
      shieldY + shieldHeight,
      shieldX,
      shieldY + shieldHeight - radius
    );
    ctx.lineTo(shieldX, shieldY + radius);
    ctx.quadraticCurveTo(shieldX, shieldY, shieldX + radius, shieldY);
    ctx.closePath();
    ctx.stroke();

    ctx.setLineDash([]);

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
