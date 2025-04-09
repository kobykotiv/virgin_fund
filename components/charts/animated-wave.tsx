import { useEffect, useRef } from 'react';

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * 0.02 + time) * 20 + canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.stroke();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={150}
      className="w-full h-full"
    />
  );
}
