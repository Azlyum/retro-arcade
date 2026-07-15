import { useMemo, useRef, type RefObject } from "react";

export interface ActivePowerUp {
  power: string;
  expiration: number;
}

export interface PowerUpState {
  fireRateRef: RefObject<number>;
  isShieldActiveRef: RefObject<boolean>;
  isDoubleShotActiveRef: RefObject<boolean>;
  isBigBulletActiveRef: RefObject<boolean>;
  isPlayerSpeedBoostActiveRef: RefObject<boolean>;
  isBulletSpreadActiveRef: RefObject<boolean>;
  isFreezeEnemiesActiveRef: RefObject<boolean>;
  isScoreBoostActiveRef: RefObject<boolean>;
  isSlowMotionActiveRef: RefObject<boolean>;
  isAutoFireActiveRef: RefObject<boolean>;
  activeTimersRef: RefObject<Map<string, number>>;
  activePowerUpsRef: RefObject<ActivePowerUp[]>;
  playerDamageMultiplierRef: RefObject<number>;
  permanentDamageBoostsRef: RefObject<number>;
}

export const usePowerUpState = (
  playerDamageMultiplierRef: RefObject<number>,
  permanentDamageBoostsRef: RefObject<number>,
): PowerUpState => {
  const fireRateRef = useRef(400);
  const isShieldActiveRef = useRef(false);
  const isDoubleShotActiveRef = useRef(false);
  const isBigBulletActiveRef = useRef(false);
  const isPlayerSpeedBoostActiveRef = useRef(false);
  const isBulletSpreadActiveRef = useRef(false);
  const isFreezeEnemiesActiveRef = useRef(false);
  const isScoreBoostActiveRef = useRef(false);
  const isSlowMotionActiveRef = useRef(false);
  const isAutoFireActiveRef = useRef(false);
  const activeTimersRef = useRef<Map<string, number>>(new Map());
  const activePowerUpsRef = useRef<ActivePowerUp[]>([]);

  return useMemo(
    () => ({
      fireRateRef,
      isShieldActiveRef,
      isDoubleShotActiveRef,
      isBigBulletActiveRef,
      isPlayerSpeedBoostActiveRef,
      isBulletSpreadActiveRef,
      isFreezeEnemiesActiveRef,
      isScoreBoostActiveRef,
      isSlowMotionActiveRef,
      isAutoFireActiveRef,
      activeTimersRef,
      activePowerUpsRef,
      playerDamageMultiplierRef,
      permanentDamageBoostsRef,
    }),
    [playerDamageMultiplierRef, permanentDamageBoostsRef],
  );
};

export const applyPowerUpEffect = (
  state: PowerUpState,
  powerType: string,
): void => {
  switch (powerType) {
    case "rapid fire":
      state.fireRateRef.current = 150;
      break;
    case "double shot":
      state.isDoubleShotActiveRef.current = true;
      break;
    case "big bullets":
      state.isBigBulletActiveRef.current = true;
      break;
    case "speed boost":
      state.isPlayerSpeedBoostActiveRef.current = true;
      break;
    case "bullet spread":
      state.isBulletSpreadActiveRef.current = true;
      break;
    case "freeze enemies":
      state.isFreezeEnemiesActiveRef.current = true;
      break;
    case "score boost":
      state.isScoreBoostActiveRef.current = true;
      break;
    case "slow motion":
      state.isSlowMotionActiveRef.current = true;
      break;
    case "auto fire":
      state.isAutoFireActiveRef.current = true;
      break;
  }
};

export const deactivatePowerUpEffect = (
  state: PowerUpState,
  powerType: string,
): void => {
  switch (powerType) {
    case "shield":
      state.isShieldActiveRef.current = false;
      break;
    case "rapid fire":
      state.fireRateRef.current = 400;
      break;
    case "double shot":
      state.isDoubleShotActiveRef.current = false;
      break;
    case "big bullets":
      state.isBigBulletActiveRef.current = false;
      break;
    case "speed boost":
      state.isPlayerSpeedBoostActiveRef.current = false;
      break;
    case "bullet spread":
      state.isBulletSpreadActiveRef.current = false;
      break;
    case "freeze enemies":
      state.isFreezeEnemiesActiveRef.current = false;
      break;
    case "score boost":
      state.isScoreBoostActiveRef.current = false;
      break;
    case "slow motion":
      state.isSlowMotionActiveRef.current = false;
      break;
    case "auto fire":
      state.isAutoFireActiveRef.current = false;
      break;
  }
};

export const clearAllPowerUps = (state: PowerUpState): void => {
  state.activeTimersRef.current.forEach((timer) => {
    clearTimeout(timer);
  });
  state.activeTimersRef.current.clear();

  state.isShieldActiveRef.current = false;
  state.isDoubleShotActiveRef.current = false;
  state.isBigBulletActiveRef.current = false;
  state.isPlayerSpeedBoostActiveRef.current = false;
  state.isBulletSpreadActiveRef.current = false;
  state.isFreezeEnemiesActiveRef.current = false;
  state.isScoreBoostActiveRef.current = false;
  state.isSlowMotionActiveRef.current = false;
  state.isAutoFireActiveRef.current = false;
  state.fireRateRef.current = 400;

  state.activePowerUpsRef.current = [];
};
