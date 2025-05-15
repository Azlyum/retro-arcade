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
  shield: require("../assets/powerUps/shield.png"),
  "rapid fire": require("../assets/powerUps/rapidFire.png"),
  "double shot": require("../assets/powerUps/doubleBullets.png"),
  "big bullets": require("../assets/powerUps/bigBullets.png"),
  "speed boost": require("../assets/powerUps/speedBoost.png"),
  "bullet spread": require("../assets/powerUps/bulletSpread.png"),
  "freeze enemies": require("../assets/powerUps/freezeEnemies.png"),
  "score boost": require("../assets/powerUps/scoreBoost.png"),
  "slow motion": require("../assets/powerUps/slowMotion.png"),
  "auto fire": require("../assets/powerUps/autoFire.png"),
  "damage boost": require("../assets/powerUps/damageBoost.png"),
};
