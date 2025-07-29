import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { ArcadeMachineScreens } from "../components/arcade-machines/ArcadeMachineScreens";
import { machines } from "../games/GameStyleData";
import { Signs } from "../components/signs/Signs";
import { PixelInvadersStartScreen } from "../games/pixel-invaders/pixelInvadersGame";

const RetroScene = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleGameClick = (gameName: string) => {
    if (gameName === "PIXEL INVADERS") {
      setSelectedGame(gameName);
      setIsZoomed(true);

      // Play arcade boot sound
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
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="./images/retroArcade/retroFloor.png"
        alt="Retro Arcade Floor"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
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
                style={machine.machineStyle}
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
        {isZoomed && selectedGame === "PIXEL INVADERS" && (
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
                  <PixelInvadersStartScreen />
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
