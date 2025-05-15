const playerImg = new Image();
playerImg.src = require("./assets/player.png");

const shieldImg = new Image();
shieldImg.src = require("./assets/shieldedPlayer.png");

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  playerX: number,
  canvasHeight: number,
  isShieldActive: boolean
) => {
  const PLAYER_Y = canvasHeight - 50;
  const width = 50;
  const height = 50;

  if (playerImg.complete) {
    ctx.drawImage(playerImg, playerX, PLAYER_Y, width, height);
  }

  if (isShieldActive && shieldImg.complete) {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      shieldImg,
      playerX - 10,
      PLAYER_Y - 10,
      width + 20,
      height + 20
    );
    ctx.globalAlpha = 1;
  }
};
