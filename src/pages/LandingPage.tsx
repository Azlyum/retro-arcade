import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

const LandingPage: React.FC = () => {
  const [startClicked, setStartClicked] = useState(false);
  const [showCoin, setShowCoin] = useState(false);

  useEffect(() => {
    const bootSound = new Howl({
      src: ["/sounds/arcade-boot.mp3"],
      volume: 0.5,
    });
    bootSound.play();
  }, []);

  const handleStart = () => {
    const coinSound = new Howl({
      src: ["/sounds/coin-drop.mp3"],
      volume: 0.6,
    });
    coinSound.play();

    setShowCoin(true);
    setTimeout(() => {
      setShowCoin(false);
      setStartClicked(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={startClicked ? { scale: 3, y: "-10vh" } : { scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative w-[360px]"
      >
        <img
          src="/images/arcade-machine.png"
          alt="Arcade Machine"
          className="w-full"
        />

        <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-cyan-300 text-xl font-bold font-arcade">
          GAMING HUB
        </div>

        {!startClicked && (
          <div
            className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center animate-flicker cursor-pointer"
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
              className="absolute bottom-[12%] left-[48%] w-6"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LandingPage;
