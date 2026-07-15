import { AudioManager } from "../audioManager";
import {
  applyPowerUpEffect,
  type PowerUpState,
} from "./powerUpState";

export const activatePowerUp = (
  state: PowerUpState,
  power: string,
): void => {
  const duration = 15000;
  const expiration = Date.now() + duration;
  AudioManager.play("powerPickup");

  if (power === "shield") {
    if (state.isShieldActiveRef.current) {
      return;
    }

    state.isShieldActiveRef.current = true;
    state.activePowerUpsRef.current.push({ power, expiration: Infinity });
    return;
  }

  if (power === "damage boost") {
    state.permanentDamageBoostsRef.current += 1;
    state.playerDamageMultiplierRef.current += 0.5;

    const existingDamageBoost = state.activePowerUpsRef.current.find(
      (activePowerUp) => activePowerUp.power === "damage boost",
    );

    if (!existingDamageBoost) {
      state.activePowerUpsRef.current.push({ power, expiration: Infinity });
    }
    return;
  }

  const existingPowerUp = state.activePowerUpsRef.current.find(
    (activePowerUp) => activePowerUp.power === power,
  );

  if (existingPowerUp) {
    existingPowerUp.expiration = expiration;
    return;
  }

  applyPowerUpEffect(state, power);
  state.activePowerUpsRef.current.push({ power, expiration });
};
