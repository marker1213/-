
import React, { useEffect, useRef } from 'react';
import { WorldEntity } from '../types';

interface HolographicMapProps {
  entities: WorldEntity[];
  onEntityClick: (entity: WorldEntity) => void;
  onMapClick?: (coords: { x: number; y: number }) => void;
  isTargeting?: boolean;
}

export const HolographicMap: React.FC<HolographicMapProps> = ({ 
  entities, 
  onEntityClick, 
  onMapClick,
  isTargeting = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      
      // Responsive Canvas
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      // Handle DPI scaling for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Map Grid (The "Ground")
      ctx.strokeStyle = isTargeting ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      // Parallax/Movement simulation
      const offsetX = Math.sin(time * 0.1) * 10;
      const offsetY = Math.cos(time * 0.1) * 10;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + (offsetX % gridSize), 0);
        ctx.lineTo(x + (offsetX % gridSize), height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + (offsetY % gridSize));
        ctx.lineTo(width, y + (offsetY % gridSize));
        ctx.stroke();
      }

      // 2. Draw Zones (Abstract Shapes)
      
      // Union Control Zone (Blue Glow - Bottom Left)
      const gradientUnion = ctx.createRadialGradient(width * 0.25, height * 0.75, 50, width * 0.25, height * 0.75, 400);
      gradientUnion.addColorStop(0, 'rgba(15, 23, 42, 0.4)'); // Deep Sea
      gradientUnion.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradientUnion;
      ctx.fillRect(0, 0, width, height);

      // Pollution Zone (Red Mist - Top Right)
      const gradientPollution = ctx.createRadialGradient(width * 0.8, height * 0.2, 20, width * 0.8, height * 0.2, 300);
      gradientPollution.addColorStop(0, 'rgba(127, 29, 29, 0.15)'); // Danger Red
      gradientPollution.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradientPollution;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Entities as Nodes
      entities.forEach(entity => {
        // Convert 0-100 coordinates to Canvas pixels
        const ex = (entity.coordinates.x / 100) * width;
        const ey = (entity.coordinates.y / 100) * height;

        // Color determination
        let color = '#ffffff';
        let glowColor = 'rgba(255,255,255,0.2)';
        
        if (entity.faction === 'UNION') {
          color = '#3b82f6'; // Blue
          glowColor = 'rgba(59, 130, 246, 0.3)';
        } else if (entity.faction === 'RSCP') {
          color = '#e2e8f0'; // White
          glowColor = 'rgba(226, 232, 240, 0.3)';
        } else if (entity.faction === 'OBSERVER') {
          color = '#a78bfa'; // Purple
          glowColor = 'rgba(139, 92, 246, 0.3)';
        }
        
        // Danger override for map visuals
        if (entity.coordinates.x > 70 && entity.coordinates.y < 40) {
          // In pollution zone, tinge red regardless of faction
          glowColor = 'rgba(239, 68, 68, 0.3)';
        }

        // Pulse effect
        const pulse = Math.sin(time * 2 + entity.id.charCodeAt(0)) * 3;
        
        // Draw Glow
        ctx.beginPath();
        ctx.arc(ex, ey, 8 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        // Draw Core
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label (only if resonace high)
        if (entity.resonance > 50) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText(entity.id.toUpperCase(), ex + 12, ey + 3);
        }
      });
      
      // 4. Target Cursor (if targeting)
      if (isTargeting) {
         // This is handled mostly by CSS cursor, but we could draw a crosshair under mouse
      }
      
      // 5. Overlay Vignette
      const gradientVignette = ctx.createRadialGradient(width/2, height/2, height/2, width/2, height/2, height);
      gradientVignette.addColorStop(0, 'transparent');
      gradientVignette.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradientVignette;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [entities, isTargeting]);

  // Click handler logic
  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates 0-100
    const normX = (x / width) * 100;
    const normY = (y / height) * 100;

    // Simple proximity check for entities
    const clickedEntity = entities.find(entity => {
      const ex = (entity.coordinates.x / 100) * width;
      const ey = (entity.coordinates.y / 100) * height;
      const dist = Math.sqrt(Math.pow(x - ex, 2) + Math.pow(y - ey, 2));
      return dist < 20; // 20px hit radius
    });

    if (clickedEntity && !isTargeting) {
      onEntityClick(clickedEntity);
    } else if (onMapClick) {
      onMapClick({ x: normX, y: normY });
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      onClick={handleClick}
      className={`
        absolute inset-0 w-full h-full z-0 block transition-cursor duration-300
        ${isTargeting ? 'cursor-[crosshair]' : 'cursor-crosshair'}
      `}
    />
  );
};
