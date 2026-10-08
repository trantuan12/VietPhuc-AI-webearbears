import React, { useEffect, useRef } from "react";

interface PetalDustCanvasProps {
  speedMultiplier?: number;
  interactive?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  opacity: number;
  color: string;
  depth: number;
}

interface DustMote {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const PetalDustCanvas: React.FC<PetalDustCanvasProps> = ({
  speedMultiplier = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize Petals
    const PETAL_COUNT = 38;
    const petalColors = [
      "rgba(251, 182, 193, ", // Soft Sakura / Peach pink
      "rgba(244, 143, 177, ", // Rose lotus
      "rgba(255, 209, 220, ", // Pale blossom
      "rgba(238, 108, 137, ", // Vibrant lotus
      "rgba(254, 237, 215, ", // Silk golden petal
    ];

    const petals: Petal[] = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: (Math.random() - 0.2) * 1.2,
      speedY: Math.random() * 1.4 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      oscillationSpeed: Math.random() * 0.03 + 0.01,
      oscillationDistance: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.55 + 0.35,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      depth: Math.random() * 0.8 + 0.5,
    }));

    // Initialize Golden Dust Motes
    const DUST_COUNT = 55;
    const dustMotes: DustMote[] = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.4) * 0.6,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render Golden Dust Motes
      dustMotes.forEach((mote) => {
        mote.x += mote.speedX * speedMultiplier;
        mote.y += mote.speedY * speedMultiplier;
        mote.pulsePhase += mote.pulseSpeed;

        if (mote.x < -10) mote.x = width + 10;
        if (mote.x > width + 10) mote.x = -10;
        if (mote.y > height + 10) mote.y = -10;

        const dynamicOpacity =
          mote.opacity * (0.6 + 0.4 * Math.sin(mote.pulsePhase));

        // Draw soft golden glowing dust
        const glow = ctx.createRadialGradient(
          mote.x,
          mote.y,
          0,
          mote.x,
          mote.y,
          mote.size * 2
        );
        glow.addColorStop(0, `rgba(255, 230, 160, ${dynamicOpacity})`);
        glow.addColorStop(1, "rgba(255, 200, 100, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Lotus Petals
      petals.forEach((petal) => {
        const osc = Math.sin(time + petal.y * 0.01) * petal.oscillationDistance;
        petal.x += (petal.speedX + osc) * speedMultiplier;
        petal.y += petal.speedY * speedMultiplier * petal.depth;
        petal.rotation += petal.rotationSpeed * speedMultiplier;

        if (petal.y > height + 20) {
          petal.y = -20;
          petal.x = Math.random() * width;
        }
        if (petal.x < -20) petal.x = width + 20;
        if (petal.x > width + 20) petal.x = -20;

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        // 3D fold simulation
        const fold = Math.sin(petal.rotation * 1.5) * 0.35 + 0.65;
        ctx.scale(fold, 1);

        // Petal shape (curved lotus petal)
        ctx.beginPath();
        ctx.moveTo(0, -petal.size);
        ctx.bezierCurveTo(
          petal.size * 0.8,
          -petal.size * 0.6,
          petal.size * 0.9,
          petal.size * 0.4,
          0,
          petal.size
        );
        ctx.bezierCurveTo(
          -petal.size * 0.9,
          petal.size * 0.4,
          -petal.size * 0.8,
          -petal.size * 0.6,
          0,
          -petal.size
        );

        ctx.fillStyle = `${petal.color}${petal.opacity})`;
        ctx.fill();

        // Delicate central spine line
        ctx.strokeStyle = `rgba(255, 255, 255, ${petal.opacity * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -petal.size * 0.8);
        ctx.lineTo(0, petal.size * 0.8);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
};
