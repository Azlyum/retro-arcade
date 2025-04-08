import { create } from "zustand";

type Scene = "landing" | "arcade";

interface ArcadeStore {
  currentScene: Scene;
  setScene: (scene: Scene) => void;
  hasStarted: boolean;
  setHasStarted: (val: boolean) => void;
  insertCoin: () => void;
  coins: number;
  startClicked: boolean;
  setStartClicked: (val: boolean) => void;
  showCoin: boolean;
  setShowCoin: (val: boolean) => void;
}

export const useArcadeStore = create<ArcadeStore>((set) => ({
  currentScene: "landing",
  setScene: (scene) => set({ currentScene: scene }),
  hasStarted: false,
  setHasStarted: (val) => set({ hasStarted: val }),
  coins: 0,
  insertCoin: () => set((state) => ({ coins: state.coins + 1 })),
  startClicked: false,
  setStartClicked: (val) => set({ startClicked: val }),
  showCoin: false,
  setShowCoin: (val) => set({ showCoin: val }),
}));
