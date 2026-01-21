import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { ArcadeMachineScreens } from "../components/arcade-machines/ArcadeMachineScreens";
import { machines } from "../games/GameStyleData";
import { Signs } from "../components/signs/Signs";
import { PixelInvadersStartScreen } from "../games/pixel-invaders/pixelInvadersGame";
import BugSquash from "../games/bugSquash/bugSquash";
import { Runner } from "../games/404Runner/runner";

const RetroScene = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cabinetTop, setCabinetTop] = useState<string>("480px");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const recalCabinetTop = () => {
      const container = containerRef.current;
      const img = bgImgRef.current;
      if (!container || !img) return;

      const containerRect = container.getBoundingClientRect();
      const containerW = containerRect.width;
      const containerH = containerRect.height;

      const naturalW = img.naturalWidth || 1920;
      const naturalH = img.naturalHeight || 1080;

      const scale = Math.max(containerW / naturalW, containerH / naturalH);

      const scaledH = naturalH * scale;
      const verticalCrop = Math.max(0, scaledH - containerH) / 2;

      const baselineYInImage = naturalH * 0.4445;

      const yOnScreen = baselineYInImage * scale - verticalCrop;
      setCabinetTop(
        `calc(${Math.round(yOnScreen)}px + var(--cabinet-offset-y, 0px))`
      );
    };

    recalCabinetTop();
    window.addEventListener("resize", recalCabinetTop);
    return () => window.removeEventListener("resize", recalCabinetTop);
  }, []);

  const handleGameClick = (gameName: string) => {
    if (gameName === "PIXEL INVADERS" || gameName === "BUG SQUASH" || gameName === "RUNNER") {
      setSelectedGame(gameName);
      setIsZoomed(true);

      const bootSound = new Howl({
        src: ["/sounds/arcade-boot.mp3"],
        volume: 0.5,
      });
      bootSound.play();
    }
  };

  const handleGameClose = () => {
    setIsZoomed(false);
    setTimeout(() => {
      setSelectedGame(null);
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      <img
        ref={bgImgRef}
        src="./images/retroArcade/retroFloor.png"
        alt="Retro Arcade Floor"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
        onLoad={() => {
          const event = new Event("resize");
          window.dispatchEvent(event);
        }}
      />

      <AnimatePresence>
        {!isZoomed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {machines.map((machine) => (
              <ArcadeMachineScreens
                key={machine.name}
                name={machine.name}
                style={{ ...machine.machineStyle, top: cabinetTop }}
                className={`absolute z-10 font-arcade overflow-hidden rounded-2xl ${machine.textSize}`}
                nameSigns={
                  <Signs
                    className={`text-cyan-100 text-shadow-neonCyan shadow-neonCyan absolute font-arcade font-bold pointer-events-none overflow-hidden ${machine.textSize}`}
                    style={machine.signStyle}
                    signTitle={machine.name}
                  />
                }
                onClick={() => handleGameClick(machine.name)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isZoomed && selectedGame && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.1, y: "100vh" }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.1, y: "100vh" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative w-[65vw] h-[95vh] border-4 border-cyan-400 bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.8)]">
                  <button
                    onClick={handleGameClose}
                    className="absolute top-4 right-4 z-30 text-cyan-300 hover:text-cyan-100 font-arcade text-lg bg-black/50 px-3 py-1 rounded border border-cyan-400 transition-all hover:bg-cyan-400/20"
                  >
                    X
                  </button>
                  {selectedGame === "PIXEL INVADERS" && (
                    <PixelInvadersStartScreen />
                  )}
                  {selectedGame === "BUG SQUASH" && <BugSquash />}
                  {selectedGame === "RUNNER" && <Runner />}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"></div>
    </div>
  );
};

export default RetroScene;
