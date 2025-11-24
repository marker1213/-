import React from 'react';
import { motion } from 'framer-motion';
import { FactionType } from '../../types';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
  variant?: FactionType;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hoverEffect = false,
  delay = 0,
  variant
}) => {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'UNION':
        return 'border-blue-500/40 bg-blue-950/40 hover:border-blue-400 hover:bg-blue-900/60 shadow-[0_0_20px_rgba(59,130,246,0.1)]';
      case 'RSCP':
        return 'border-white/30 bg-gray-900/60 hover:border-white/60 hover:bg-gray-800/80 shadow-[0_0_20px_rgba(255,255,255,0.1)]';
      case 'OBSERVER':
        return 'border-void-purple/50 bg-indigo-950/40 hover:border-void-purple hover:bg-indigo-900/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]';
      default:
        return 'border-white/15 bg-black/60 hover:bg-black/80';
    }
  };

  const variantClasses = variant ? getVariantStyles() : 'border-white/15 bg-black/60';
  const hoverClasses = hoverEffect && !variant ? 'hover:bg-white/10 hover:border-white/30 transition-all duration-300' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`
        glass-panel 
        relative overflow-hidden
        p-6 
        transition-all duration-300
        backdrop-blur-md
        ${variantClasses}
        ${hoverClasses}
        ${className}
      `}
    >
      {/* Decorative Corner Lines */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${variant === 'UNION' ? 'border-blue-400' : variant === 'OBSERVER' ? 'border-void-purple' : 'border-white/60'}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${variant === 'UNION' ? 'border-blue-400' : variant === 'OBSERVER' ? 'border-void-purple' : 'border-white/60'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${variant === 'UNION' ? 'border-blue-400' : variant === 'OBSERVER' ? 'border-void-purple' : 'border-white/60'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${variant === 'UNION' ? 'border-blue-400' : variant === 'OBSERVER' ? 'border-void-purple' : 'border-white/60'}`} />
      
      {children}
    </motion.div>
  );
};