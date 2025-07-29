import React from "react";
import "./App.css";
import LandingPage from "./scenes/LandingScene";
import RetroScene from "./scenes/RetroScene";
import { useArcadeStore } from "./state/useArcadeStore";
import { PixelInvadersStartScreen } from "./games/pixel-invaders/pixelInvadersGame";

export default function App() {
  const { currentScene, setScene } = useArcadeStore();

  return (
    <>
      {currentScene === "landing" && (
        <LandingPage onTransitionEnd={() => setScene("arcade")} />
      )}
      {currentScene === "arcade" && <RetroScene />}
      {/* <PixelInvadersStartScreen /> */}
    </>
  );
}
