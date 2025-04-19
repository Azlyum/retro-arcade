import React from "react";

interface signsI {
  className?: string;
  signTitle?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Signs: React.FC<signsI> = ({
  className,
  signTitle,
  id,
  style,
}) => {
  return (
    <div
      id={id}
      className={`absolute font-arcade rounded-xl border-2 border-black-900 px-2 py-1 ${className} cursor-pointer transition-all`}
      style={style}
    >
      <h2>{signTitle}</h2>
    </div>
  );
};
