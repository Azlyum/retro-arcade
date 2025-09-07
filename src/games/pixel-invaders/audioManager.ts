import { Howl } from "howler";
import { AudioPaths } from "./audioPaths";

type SoundKey = keyof typeof AudioPaths;

class AudioManagerImpl {
  private sounds: Partial<Record<SoundKey, Howl>> = {};
  private lastPlayedAt: Partial<Record<SoundKey, number>> = {};
  private recentStarts: Partial<Record<SoundKey, number[]>> = {};
  private _muted = false;
  private _volume = 0.2;
  private perSoundVolume: Partial<Record<SoundKey, number>> = {
    powerPickup: 1.8,
    shooting: 1,
    enemyDeath: 1.2,
  };

  private cooldownMs: Partial<Record<SoundKey, number>> = {
    shooting: 40,
    enemyDeath: 60,
    powerPickup: 100,
  };
  private maxStartsPer100ms: Partial<Record<SoundKey, number>> = {
    shooting: 3,
    enemyDeath: 2,
    powerPickup: 2,
  };

  private getOrCreate(key: SoundKey): Howl {
    if (!this.sounds[key]) {
      this.sounds[key] = new Howl({
        src: [AudioPaths[key]],
        volume: this._volume,
        mute: this._muted,
      });
    }
    return this.sounds[key]!;
  }

  play(key: SoundKey) {
    if (this._muted) return;
    const now = Date.now();
    const last = this.lastPlayedAt[key] ?? 0;
    const cooldown = this.cooldownMs[key] ?? 0;
    if (now - last < cooldown) return;

    const windowMs = 100;
    const timestamps = (this.recentStarts[key] ?? []).filter(
      (t) => now - t < windowMs
    );
    const maxStarts = this.maxStartsPer100ms[key] ?? 3;
    if (timestamps.length >= maxStarts) return;
    timestamps.push(now);
    this.recentStarts[key] = timestamps;

    this.lastPlayedAt[key] = now;
    const sound = this.getOrCreate(key);
    const scale = this.perSoundVolume[key] ?? 1;
    sound.volume(this._volume * scale);
    sound.mute(this._muted);
    sound.play();
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    Object.values(this.sounds).forEach((s) => s?.mute(muted));
  }

  setVolume(volume: number) {
    this._volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((s) => s?.volume(this._volume));
  }
}

export const AudioManager = new AudioManagerImpl();
