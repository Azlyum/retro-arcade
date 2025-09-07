export const AudioPaths = {
  mainMenu: "/sounds/pixel-invaders/main_menu.mp3",
  gamePlaying: "/sounds/pixel-invaders/game_playing.mp3",
  shooting: "/sounds/pixel-invaders/shooting.mp3",
  enemyDeath: "/sounds/pixel-invaders/enemy_death.mp3",
  playerDeath: "/sounds/pixel-invaders/player_death.mp3",
  powerPickup: "/sounds/pixel-invaders/powerPickUp.mp3",
} as const;

export type AudioKey = keyof typeof AudioPaths;
