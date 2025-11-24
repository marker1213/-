import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const LOADING_SEQUENCE = [
  "正在接入高维视角...",
  "解析人联防火墙协议...",
  "同步实安协绝密数据库...",
  "观测链路：已建立"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  // --- Typewriter Effect Logic ---
  useEffect(() => {
    if (isReady) return;

    let currentText = LOADING_SEQUENCE[textIndex];
    let charIndex = 0;
    let typeInterval: ReturnType<typeof setInterval>;

    const startTyping = () => {
      setDisplayedText("");
      charIndex = 0;
      typeInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setDisplayedText(currentText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before next line
          setTimeout(() => {
            if (textIndex < LOADING_SEQUENCE.length - 1) {
              setTextIndex(prev => prev + 1);
            } else {
              setIsReady(true);
            }
          }, 1000);
        }
      }, 50); // Typing speed
    };

    startTyping();

    return () => clearInterval(typeInterval);
  }, [textIndex, isReady]);

  // --- 3D Particle Earth Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Configuration
    const particleCount = 1200;
    const globeRadius = 180;
    const focalLength = 400;
    
    interface Particle {
      // Target spherical position
      theta: number;
      phi: number;
      // Current 3D position
      x: number; y: number; z: number;
      // Target 3D position (calculated from sphere)
      tx: number; ty: number; tz: number;
      // Visuals
      size: number;
      color: string;
      speed: number;
    }

    const particles: Particle[] = [];

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      // Calculate target position on sphere surface
      const tx = globeRadius * Math.sin(phi) * Math.cos(theta);
      const ty = globeRadius * Math.sin(phi) * Math.sin(theta);
      const tz = globeRadius * Math.cos(phi);

      // Start at random explosion positions
      const startDistance = 2000;
      
      particles.push({
        theta, phi,
        x: (Math.random() - 0.5) * startDistance,
        y: (Math.random() - 0.5) * startDistance,
        z: (Math.random() - 0.5) * startDistance,
        tx, ty, tz,
        size: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.8 ? '#8b5cf6' : '#ffffff', // Purple accents
        speed: 0.02 + Math.random() * 0.03
      });
    }

    const render = () => {
      time += 1;
      
      // Canvas setup
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 50; // Slightly offset up

      // Background - Deep Void with moving grid
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // Deep sea center
      gradient.addColorStop(1, '#000000'); // Black edges
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const gridOffset = (time * 0.5) % gridSize;
      ctx.beginPath();
      for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for(let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y + gridOffset); ctx.lineTo(canvas.width, y + gridOffset);
      }
      ctx.stroke();

      // Sort particles by Z for depth
      particles.sort((a, b) => b.z - a.z);

      // Rotation Matrices
      const rotSpeed = isReady ? 0.005 : 0.002; // Spin faster when ready
      const rotY = time * rotSpeed;
      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);

      // Shockwave logic (Pulse)
      const pulseFrequency = 0.05;
      const pulseAmplitude = 10;
      const pulseY = Math.sin(time * pulseFrequency) * globeRadius; // Y level of shockwave

      particles.forEach(p => {
        // 1. Move towards target (Reconstruction Phase)
        // Lerp factor
        const lerp = 0.05;
        p.x += (p.tx - p.x) * lerp;
        p.y += (p.ty - p.y) * lerp;
        p.z += (p.tz - p.z) * lerp;

        // 2. Apply Rotation
        let x = p.x * cosY - p.z * sinY;
        let z = p.z * cosY + p.x * sinY;
        let y = p.y;

        // 3. Apply Shockwave Effect (when formed)
        if (Math.abs(p.y - pulseY) < 20) {
            const scale = 1 + (20 - Math.abs(p.y - pulseY)) / 100;
            x *= scale;
            y *= scale;
            z *= scale;
        }

        // 4. Project to 2D
        const scale = focalLength / (focalLength + z);
        const x2d = x * scale + cx;
        const y2d = y * scale + cy;

        // 5. Draw
        if (z > -focalLength + 10) { // Clip behind camera
           const alpha = (z + globeRadius) / (globeRadius * 2); // Depth fog
           
           ctx.beginPath();
           ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
           
           // Glow when shockwave hits
           if (Math.abs(p.y - pulseY) < 20) {
             ctx.fillStyle = '#ffffff';
             ctx.shadowBlur = 10;
             ctx.shadowColor = '#8b5cf6';
           } else {
             ctx.fillStyle = p.color;
             ctx.globalAlpha = Math.max(0.1, alpha);
             ctx.shadowBlur = 0;
           }
           
           ctx.fill();
           ctx.globalAlpha = 1;
           ctx.shadowBlur = 0;

           // Draw connections for "Network" look
           // Only draw connections for a subset to save performance
           if (Math.random() > 0.98) {
               ctx.beginPath();
               ctx.moveTo(x2d, y2d);
               // Connect to a random point near center (abstract data line)
               ctx.lineTo(cx + (Math.random()-0.5)*20, cy + (Math.random()-0.5)*20);
               ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * scale})`;
               ctx.stroke();
           }
        }
      });

      if (!isExiting) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isReady, isExiting]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col items-center justify-end pb-20"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none z-0" />

      {/* UI Layer */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">
        
        {/* Status Text */}
        <div className="h-16 flex items-center justify-center">
            <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[0.1em] text-glow font-sans">
                    {displayedText}
                    <span className="animate-pulse text-void-purple">_</span>
                </h2>
                <div className="h-1 w-24 bg-void-purple/30 mt-4 mx-auto rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="h-full bg-void-purple shadow-glow"
                     />
                </div>
            </motion.div>
        </div>

        {/* Action Button */}
        <AnimatePresence>
            {isReady && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    className="
                        group relative px-16 py-6 
                        bg-black/20 backdrop-blur-md
                        border border-white/30 border-t-white/50
                        rounded-sm overflow-hidden
                        transition-all duration-500
                        shadow-[0_0_20px_rgba(0,0,0,0.5)]
                    "
                >
                    {/* Crystal Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                    <div className="absolute inset-0 bg-void-purple/5 group-hover:bg-void-purple/10 transition-colors" />

                    <div className="relative flex flex-col items-center gap-1">
                        <span className="text-xl font-black text-white tracking-[0.3em] group-hover:text-glow-white transition-all">
                            【 进入观测枢纽 】
                        </span>
                        <span className="text-[10px] font-mono text-void-purple tracking-[0.5em] uppercase opacity-70">
                            Access Granted
                        </span>
                    </div>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/60" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/60" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/60" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/60" />
                </motion.button>
            )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};