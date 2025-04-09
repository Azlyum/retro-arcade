import React from "react";

interface HUDInterface {
  className: string;
}

export const HUD: React.FC<HUDInterface> = ({ className }) => {
  return (
    <>
      <div className="border-orange-900 shadow-neonOrange overflow-hidden rounded-xl">
        <div className="flex justify-between gap-4 p-4">
          <div className={className}></div>
          <div className={className}></div>
          <div className={className}></div>
          <div className={className}></div>
          <div className={className}></div>
        </div>
      </div>
    </>
  );
};
