import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import FakeArcadeScreen from "../components/FakeArcadeScreen.tsx";

const LandingPage: React.FC = () => {
  const [startClicked, setStartClicked] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [zoomLevel] = useState(4.5);
  const [yOffset] = useState("-20%");
  const [origin] = useState("center 25%");

  const handleStart = () => {
    if (hasStarted) return;

    const coinSound = new Howl({
      src: ["/sounds/coin-drop.mp3"],
      volume: 0.6,
    });

    const bootSound = new Howl({
      src: ["/sounds/arcade-boot.mp3"],
      volume: 0.5,
    });
    bootSound.play();

    setTimeout(() => {
      coinSound.play();
      setHasStarted(true);
    }, 1000);

    setShowCoin(true);
    setTimeout(() => {
      setShowCoin(false);
      setStartClicked(true);
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="/images/background-test.png"
        alt="Landing Page Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full h-full border-4 border-cyan-400 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.8)] p-4 flex items-center justify-center">
          <motion.div
            initial={{ scale: 1, transformOrigin: "center center" }}
            animate={
              startClicked
                ? {
                    scale: zoomLevel,
                    x: 0,
                    y: yOffset,
                    transformOrigin: origin,
                  }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="relative w-[640px]"
          >
            <img
              src="/images/arcade-machine.png"
              alt="Arcade Machine"
              className="w-full rounded-xl z-0 bg-transparent"
            />
            <div className="absolute top-[26%] left-[20%] w-[60%] h-[16%] z-5">
              <FakeArcadeScreen />
            </div>

            <div className="absolute top-[11.5%] left-1/2 -translate-x-1/2 z-10 text-cyan-300 text-xl font-bold font-arcade pointer-events-none">
              GAMING HUB
            </div>

            {!startClicked && (
              <div
                className={`absolute top-[32%] left-1/2 -translate-x-1/2 text-center animate-flicker cursor-pointer ${
                  hasStarted ? "pointer-events-none opacity-50" : ""
                }`}
                onClick={handleStart}
              >
                <p className="text-yellow-300 text-s font-arcade">
                  PRESS START
                </p>

                <div
                  className={`absolute bottom-[-50%] left-[18%] text-center animate-flicker cursor-pointer ${
                    hasStarted ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={handleStart}
                >
                  <p className="text-yellow-300 text-xs font-arcade opacity-85">
                    Insert Coin
                  </p>
                </div>
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
    </div>
  );
};

export default LandingPage;
