import React, { useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

interface AnimatedBackdropProps {
  children?: React.ReactNode;
  variant?: 'particles' | 'gradient' | 'waves';
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
  color?: string;
  secondaryColor?: string;
  style?: React.CSSProperties;
}

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
`;

export default function AnimatedBackdrop({
  children,
  variant = 'particles',
  density = 'medium',
  speed = 'medium',
  color,
  secondaryColor,
  style = {},
}: AnimatedBackdropProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Determine colors based on theme and props
  const primaryColor = color || theme.palette.primary.main;
  const secondColor = secondaryColor || theme.palette.secondary.main;
  
  // Determine animation speed
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow':
        return '30s';
      case 'fast':
        return '10s';
      default:
        return '20s';
    }
  };
  
  // Determine particle density
  const getParticleCount = () => {
    switch (density) {
      case 'low':
        return 40;
      case 'high':
        return 150;
      default:
        return 80;
    }
  };

  useEffect(() => {
    if (variant !== 'particles' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateDimensions = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        setDimensions({ width: canvas.width, height: canvas.height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Initialize particles
    const particleCount = getParticleCount();
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }> = [];
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 4 + 1;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        color: Math.random() > 0.5 ? primaryColor : secondColor,
        speedX: (Math.random() - 0.5) * (speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1),
        speedY: (Math.random() - 0.5) * (speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1),
      });
    }
    
    // Animation loop
    let animationFrameId: number;
    const render = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup function
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [variant, density, speed, primaryColor, secondColor]);

  if (variant === 'particles') {
    return (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
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
      </Box>
    );
  }

  if (variant === 'gradient') {
    return (
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(-45deg, ${primaryColor}, ${secondColor}, ${theme.palette.background.default}, ${secondColor})`,
          backgroundSize: '400% 400%',
          animation: `${gradientAnimation} ${getAnimationDuration()} ease infinite`,
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
        {children}
      </Box>
    );
  }

  if (variant === 'waves') {
    return (
      <Box
        sx={{
          position: 'relative',
          background: theme.palette.background.default,
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
        {/* Waves background */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200%',
            height: '100%',
            backgroundImage: `linear-gradient(to bottom, transparent 0%, ${primaryColor}20 75%, ${primaryColor}40 100%)`,
            zIndex: -1,
            transform: 'translateX(0) translateZ(0)',
            animation: `${waveAnimation} ${getAnimationDuration()} infinite linear`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200%',
            height: '85%',
            backgroundImage: `linear-gradient(to bottom, transparent 0%, ${secondColor}20 75%, ${secondColor}40 100%)`,
            zIndex: -1,
            transform: 'translateX(0) translateZ(0)',
            animation: `${waveAnimation} ${Number(getAnimationDuration().replace('s', '')) * 1.5}s infinite linear`,
            animationDelay: '-5s',
          }}
        />
        {children}
      </Box>
    );
  }

  // Default fallback
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children}
    </Box>
  );
};
