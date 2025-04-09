import React from "react";

interface signsI {
  className?: string;
  signTitle?: string;
  id?: string;
}

export const Signs: React.FC<signsI> = ({ className, signTitle, id }) => {
  return (
    <div id={`${id}`}>
      <div
        className={`absolute font-arcade rounded-xl border-2 border-black-900 px-2 py-1 ${className} cursor-pointer transition-all`}
      >
        <h2>{signTitle}</h2>
      </div>
    </div>
  );
};
