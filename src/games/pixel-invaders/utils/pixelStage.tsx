import React, { useEffect, useState } from "react";

export function PixelStage({
  bg,
  children,
  overlay = 0.25,
  baseW = 2560,
  baseH = 1440,
  desktopBreakpoint = 900,
  allowDesktopUpscale = true,
}: {
  bg: string;
  children: React.ReactNode;
  overlay?: number;
  baseW?: number;
  baseH?: number;
  desktopBreakpoint?: number;
  allowDesktopUpscale?: boolean;
}) {
  const [size, setSize] = useState({ w: baseW, h: baseH });

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const ratio = Math.min(vw / baseW, vh / baseH);

        const isDesktop = vw >= desktopBreakpoint;
        let s: number;
        if (isDesktop) {
          s = allowDesktopUpscale ? ratio : Math.min(1, ratio);
        } else {
          s = Math.max(1, Math.floor(ratio));
        }

        setSize({
          w: Math.max(1, Math.round(baseW * s)),
          h: Math.max(1, Math.round(baseH * s)),
        });
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [baseW, baseH, desktopBreakpoint, allowDesktopUpscale]);

  return (
    <div className="relative w-screen h-screen bg-neutral-900 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: size.w,
          height: size.h,
          transform: "translate(-50%, -50%)",
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: `${size.w}px ${size.h}px`,
          imageRendering: "pixelated",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `rgba(0,0,0,${overlay})` }}
        />
        <div
          className="absolute inset-0"
          style={{ imageRendering: "pixelated" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
