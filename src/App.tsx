import React from "react";
import "./App.css";
import LandingPage from "./scenes/LandingScene.tsx";
import RetroScene from "./scenes/RetroScene.tsx";
import { useArcadeStore } from "./state/useArcadeStore.tsx";
import { Canvas } from "./games/pixel-invaders/GameCanvas.tsx";

export default function App() {
  const { currentScene, setScene } = useArcadeStore();

  return (
    <>
      {/* {currentScene === "landing" && (
        <LandingPage onTransitionEnd={() => setScene("arcade")} />
      )}
      {currentScene === "arcade" && <RetroScene />} */}
      <Canvas />
    </>
  );
}
