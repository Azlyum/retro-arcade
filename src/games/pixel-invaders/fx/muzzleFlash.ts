import { useRef } from "react";

export type MuzzleFlash = {
  x: number;
  y: number;
  r: number;
  life: number;
};

export const useMuzzleFlashes = () => {
  const muzzleFlashesRef = useRef<MuzzleFlash[]>([]);

  const spawnMuzzleFlash = (x: number, y: number) => {
    muzzleFlashesRef.current.push({
      x,
      y,
      r: 6,
      life: 6,
    });
  };

  const drawMuzzleFlashes = (ctx: CanvasRenderingContext2D) => {
    muzzleFlashesRef.current.forEach((f) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const alpha = Math.max(0, f.life / 6);
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      grd.addColorStop(0, `rgba(255,255,200,${alpha})`);
      grd.addColorStop(1, `rgba(255,255,0,0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      f.r += 1.5;
      f.life -= 1;
    });
    muzzleFlashesRef.current = muzzleFlashesRef.current.filter(
      (f) => f.life > 0,
    );
  };

  return { spawnMuzzleFlash, drawMuzzleFlashes };
};
