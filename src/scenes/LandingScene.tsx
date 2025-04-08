import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { FakeArcadeLandingMachineScreen } from "../components/FakeArcadeMachineScreen.tsx";
import { useArcadeStore } from "../store/useArcadeStore.tsx";

type LandingPageProps = {
  onTransitionEnd: () => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onTransitionEnd }) => {
  const {
    hasStarted,
    setHasStarted,
    startClicked,
    setStartClicked,
    showCoin,
    setShowCoin,
  } = useArcadeStore();

  const [zoomLevel] = useState(5.2);
  const [yOffset] = useState("-20%");
  const [origin] = useState("center 25%");

  const handleStart = () => {
    if (hasStarted || startClicked) return;

    setHasStarted(true);

    const coinSound = new Howl({
      src: ["/sounds/coin-drop.mp3"],
      volume: 0.6,
    });

    const bootSound = new Howl({
      src: ["/sounds/arcade-boot.mp3"],
      volume: 0.5,
    });

    coinSound.play();

    setTimeout(() => {
      bootSound.play();
    }, 500);

    setShowCoin(true);

    setTimeout(() => {
      setStartClicked(true);
      setShowCoin(false);
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="/images/background-test.png"
        alt="Landing Page Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full h-full border-4 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.8)] p-4 flex items-center justify-center border-cyan-400">
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
            onAnimationComplete={() => {
              if (startClicked && typeof onTransitionEnd === "function") {
                onTransitionEnd();
              }
            }}
          >
            <img
              src="/images/arcade-machine.png"
              alt="Arcade Machine"
              className="w-full rounded-xl z-0 bg-transparent"
            />

            <div className="absolute top-[11.5%] left-1/2 -translate-x-1/2 z-10 text-purple-300 text-shadow-neonPurple text-3xl font-bold font-arcade pointer-events-none animate-pulseNeonPurple">
              GAMING HUB
            </div>
            <div className="absolute top-[26%] left-[20%] w-[60%] h-[16%] z-0">
              <FakeArcadeLandingMachineScreen />
            </div>

            {!startClicked && (
              <div
                className={`absolute top-[32%] left-1/2 -translate-x-1/2 text-center animate-pulseNeonYellow cursor-pointer ${
                  hasStarted ? "pointer-events-none opacity-50" : ""
                }`}
                onClick={handleStart}
              >
                <p className="text-yellow-300 font-arcade">PRESS START</p>

                <div
                  className={`absolute bottom-[-50%] left-[18%] text-center animate-pulseNeonYellow cursor-pointer ${
                    hasStarted ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={handleStart}
                >
                  <p className="text-yellow-300 text-xs font-arcade opacity-65">
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
                  animate={{ y: -50, opacity: 1 }}
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
