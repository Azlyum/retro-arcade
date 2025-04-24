export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  playerX: number,
  canvasHeight: number
) => {
  const PLAYER_Y = canvasHeight - 40;
  ctx.fillStyle = "#0ff";

  ctx.beginPath();
  ctx.moveTo(playerX, PLAYER_Y);
  ctx.lineTo(playerX + 25, PLAYER_Y - 40);
  ctx.lineTo(playerX + 50, PLAYER_Y);
  ctx.closePath();
  ctx.fill();
};
