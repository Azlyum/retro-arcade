import {
  deactivatePowerUpEffect,
  type ActivePowerUp,
  type PowerUpState,
} from "./powerUpState";

export const updateActivePowerUps = (
  state: PowerUpState,
  now = Date.now(),
): ActivePowerUp[] => {
  const expiredPowerUps = state.activePowerUpsRef.current.filter(
    (powerUp) => powerUp.expiration !== Infinity && powerUp.expiration <= now,
  );

  expiredPowerUps.forEach((powerUp) => {
    const timer = state.activeTimersRef.current.get(powerUp.power);
    if (timer) {
      clearTimeout(timer);
      state.activeTimersRef.current.delete(powerUp.power);
    }

    deactivatePowerUpEffect(state, powerUp.power);
  });

  state.activePowerUpsRef.current = state.activePowerUpsRef.current.filter(
    (powerUp) => powerUp.expiration === Infinity || powerUp.expiration > now,
  );

  return state.activePowerUpsRef.current;
};
