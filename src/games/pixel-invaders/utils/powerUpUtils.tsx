export type PowerUpType =
  | "shield"
  | "rapid fire"
  | "double shot"
  | "big bullets"
  | "speed boost"
  | "bullet spread"
  | "freeze enemies"
  | "score boost"
  | "slow motion"
  | "auto fire"
  | "damage boost";

export type PowerUp = {
  x: number;
  y: number;
  height: number;
  width: number;
  opacity: number;
  powerUpExpirationTimer: number;
  power: string;
};

export const powerUpIconMap: Record<string, string> = {
  shield: "/images/powerUps/shield.png",
  "rapid fire": "/images/powerUps/rapidFire.png",
  "double shot": "/images/powerUps/doubleBullets.png",
  "big bullets": "/images/powerUps/bigBullets.png",
  "speed boost": "/images/powerUps/speedBoost.png",
  "bullet spread": "/images/powerUps/bulletSpread.png",
  "freeze enemies": "/images/powerUps/freezeEnemies.png",
  "score boost": "/images/powerUps/scoreBoost.png",
  "slow motion": "/images/powerUps/slowMotion.png",
  "auto fire": "/images/powerUps/autoFire.png",
  "damage boost": "/images/powerUps/damageBoost.png",
};
