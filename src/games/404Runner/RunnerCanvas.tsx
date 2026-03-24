import { RefObject, useEffect, useRef, useState } from "react";
import { platforms } from "./objects/platforms";

export const RunnerCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.95);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.85);
  const PLAYER_WIDTH = 100;
  const PLAYER_HEIGHT = 100;
  const [playerX] = useState((canvasWidth - PLAYER_WIDTH) / 2);
  const [playerY] = useState(canvasHeight - PLAYER_HEIGHT);
  const onGroundRef = useRef(true);
  const playerXRef = useRef(playerX);
  const playerYRef = useRef(playerY);
  const playerVyRef = useRef(0);
  const platformVyRef = useRef(2);
  const keysPressed = useRef<Set<string>>(new Set());
  const platformsArray = platforms();

  const playerImg = new Image();

  const drawPlayer = (
    ctx: CanvasRenderingContext2D,
    playerX: number,
    playerY: number,
  ) => {
    const PLAYER_Y = playerY;
    const width = 100;
    const height = 100;

    if (!playerImg.complete) {
      ctx.drawImage(playerImg, playerX, PLAYER_Y, width, height);
    } else {
      ctx.fillStyle = "#3123ff";
      ctx.fillRect(playerX, PLAYER_Y, width, height);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvasWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth * 0.95;
      const newHeight = window.innerHeight * 0.85;
      canvas.width = newWidth;
      canvas.height = newHeight;
      setCanvasWidth(newWidth);
      setCanvasHeight(newHeight);
    };

    let rafId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const movementSpeed = 3.5;
      const gravity = 0.5;
      const jumpImpulse = -18;
      const groundY = canvas.height - PLAYER_HEIGHT;

      let newX = playerXRef.current;

      if (
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("KeyA")
      ) {
        newX = Math.max(newX - movementSpeed, 0);
      }

      if (
        keysPressed.current.has("ArrowRight") ||
        keysPressed.current.has("KeyD")
      ) {
        newX = Math.min(newX + movementSpeed, canvas.width - 100);
      }

      if (
        (keysPressed.current.has("Space") || keysPressed.current.has("KeyW")) &&
        onGroundRef.current
      ) {
        playerVyRef.current = jumpImpulse;
        onGroundRef.current = false;
      }

      playerVyRef.current += gravity;
      playerYRef.current += playerVyRef.current;
      playerXRef.current = newX;

      if (playerYRef.current >= groundY) {
        playerYRef.current = groundY;
        playerVyRef.current = 0;
        onGroundRef.current = true;
      }

      platformsArray.forEach((platform) => {
        if (
          playerXRef.current + PLAYER_WIDTH > platform.x &&
          playerXRef.current < platform.x + platform.width &&
          playerYRef.current + PLAYER_HEIGHT > platform.y &&
          playerYRef.current + PLAYER_HEIGHT - playerVyRef.current <= platform.y
        ) {
          playerYRef.current = platform.y - PLAYER_HEIGHT;
          playerVyRef.current = 0;
          onGroundRef.current = true;
        }

        platform.x -= platformVyRef.current;
        if (platform.x + platform.width < 0) {
          platform.x = canvas.width;
          platform.y =
            Math.random() * (canvas.height - platform.height - PLAYER_HEIGHT);
        }

        ctx.fillStyle = "#00ff00";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });

      drawPlayer(ctx, playerXRef.current, playerYRef.current);

      rafId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[65vw] h-[95vh] border-4 border-cyan-400 bg-black"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
};

// tomorrow lock player position with the position of the platforms to create the illusion of movement and add more platform types
