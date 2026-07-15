import { updateActivePowerUps } from "../powerUp/updateActivePowerUps";
import { getCachedImage } from "../utils/imageCache";
import { powerUpIconMap } from "../utils/powerUpUtils";
import type { PowerUpState } from "../powerUp/powerUpState";

export const drawPowerUpHUD = (
  hudCtx: CanvasRenderingContext2D,
  powerUpState: PowerUpState,
) => {
  const iconSize = 40;
  const padding = 10;
  const startX = 20;
  const startY = 60;
  const hudNow = Date.now();
  const activePowerUps = updateActivePowerUps(powerUpState, hudNow);

  activePowerUps.forEach((powerUp, i) => {
    const iconPath = powerUpIconMap[powerUp.power];
    if (!iconPath) return;

    const img = getCachedImage(iconPath);
    const alpha = Math.max(0.3, (powerUp.expiration - hudNow) / 15000);

    if (img.complete && img.naturalWidth > 0) {
      hudCtx.globalAlpha = alpha;
      hudCtx.drawImage(
        img,
        startX + i * (iconSize + padding),
        startY,
        iconSize,
        iconSize,
      );
      hudCtx.globalAlpha = 1;
    } else {
      hudCtx.globalAlpha = alpha;
      hudCtx.fillStyle = "#00ff00";
      hudCtx.fillRect(
        startX + i * (iconSize + padding),
        startY,
        iconSize,
        iconSize,
      );
      hudCtx.globalAlpha = 1;

      hudCtx.fillStyle = "white";
      hudCtx.font = "8px Arial";
      hudCtx.fillText(
        powerUp.power,
        startX + i * (iconSize + padding),
        startY + iconSize + 8,
      );
    }
  });
};
