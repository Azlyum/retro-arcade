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
  | "auto fire";

export type PowerUp = {
  x: number;
  y: number;
  height: number;
  width: number;
  opacity: number;
  powerUpExpirationTimer: number;
  power: string;
};
