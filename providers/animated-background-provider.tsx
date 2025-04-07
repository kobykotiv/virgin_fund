import React, { useEffect, useRef } from 'react';
import './animated-background-provider.css';

const AnimatedBackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = () => {
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;
            const tileSize = 40;
            const perspective = 0.5;

            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;

            for (let x = -tileSize; x < width + tileSize; x += tileSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x * perspective, height);
                ctx.stroke();
            }

            for (let y = -tileSize; y < height + tileSize; y += tileSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y * perspective);
                ctx.stroke();
            }
        };

        const animate = () => {
            drawGrid();
            requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                }}
            />
            {children}
        </div>
    );
};

export default AnimatedBackgroundProvider;