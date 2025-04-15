import React, { useState } from "react";

export const ManagersDoor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDoor = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      onClick={toggleDoor}
      className={`door transition-transform duration-[2000ms] ease-in-out origin-right 
        ${isOpen ? "rotate-y-90" : "rotate-y-0"}
        w-24 h-40 bg-yellow-800 border-4 border-black rounded-md cursor-pointer`}
    >
      <span className="text-white font-arcade block text-center pt-14">
        {isOpen ? "" : ""}
      </span>
    </div>
  );
};
