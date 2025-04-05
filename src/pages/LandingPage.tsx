import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

const LandingPage: React.FC = () => {
  const [startClicked, setStartClicked] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [zoomLevel, setZoomLevel] = useState(4.5);
  const [yOffset, setYOffset] = useState("-20%");
  const [origin, setOrigin] = useState("center 25%");

  useEffect(() => {
    const bootSound = new Howl({
      src: ["/sounds/arcade-boot.mp3"],
      volume: 0.5,
    });
    bootSound.play();
  }, []);

  const handleStart = () => {
    if (hasStarted) return;

    const coinSound = new Howl({
      src: ["/sounds/coin-drop.mp3"],
      volume: 0.6,
    });

    coinSound.play();
    setHasStarted(true);
    setShowCoin(true);

    setTimeout(() => {
      setShowCoin(false);
      setStartClicked(true);
    }, 1000);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center z-50">
      <div className="w-full h-full border-4 border-cyan-400 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.8)] p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1, transformOrigin: "center center" }}
          animate={
            startClicked
              ? { scale: zoomLevel, x: 0, y: yOffset, transformOrigin: origin }
              : { scale: 1, x: 0, y: 0 }
          }
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative w-[640px] mt-0"
        >
          <img
            src="/images/arcade-machine.png"
            alt="Arcade Machine"
            className="w-full rounded-xl z-0 bg-transparent"
          />

          <div className="absolute top-[11.5%] left-1/2 -translate-x-1/2 z-10 text-cyan-300 text-xl font-bold font-arcade pointer-events-none">
            GAMING HUB
          </div>

          {!startClicked && (
            <div
              className={`absolute top-[35%] left-1/2 -translate-x-1/2 text-center animate-flicker cursor-pointer ${
                hasStarted ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={handleStart}
            >
              <p className="text-yellow-300 text-sm font-arcade">PRESS START</p>
            </div>
          )}

          <AnimatePresence>
            {showCoin && (
              <motion.img
                src="/images/coin.png"
                alt="Coin Insert"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 50, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-[12%] left-[48%] w-6 rounded-full shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
