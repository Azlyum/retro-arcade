import React from "react";
import "./App.css";
import { useState } from "react";
import LandingPage from "./scenes/LandingScene.tsx";
import RetroScene from "./scenes/RetroScene.tsx";

export default function App() {
  const [scene, setScene] = useState<"landing" | "arcade">("landing");

  return (
    <>
      {scene === "landing" && (
        <LandingPage onTransitionEnd={() => setScene("arcade")} />
      )}
      {scene === "arcade" && <RetroScene />}
    </>
  );
}
