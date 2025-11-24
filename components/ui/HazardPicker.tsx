import React from 'react';
import { HazardLevel } from '../../types';

interface HazardPickerProps {
  value: HazardLevel;
  onChange: (level: HazardLevel) => void;
}

const LEVELS: HazardLevel[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

const LEVEL_COLORS: Record<HazardLevel, string> = {
  'F': 'bg-gray-600 shadow-gray-500/50',
  'E': 'bg-slate-500 shadow-slate-500/50',
  'D': 'bg-blue-600 shadow-blue-500/50',
  'C': 'bg-green-600 shadow-green-500/50',
  'B': 'bg-yellow-600 shadow-yellow-500/50',
  'A': 'bg-orange-600 shadow-orange-500/50',
  'S': 'bg-red-600 shadow-red-600/50',
};

export const HazardPicker: React.FC<HazardPickerProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-sm font-bold text-white tracking-widest">预估危害等级</span>
          <span className="ml-2 text-[10px] font-mono text-gray-500">EST. HAZARD</span>
        </div>
        <span className={`text-2xl font-serif font-bold ${value === 'S' ? 'text-red-500 animate-pulse text-glow-danger' : 'text-white'}`}>
          等级-{value}
        </span>
      </div>
      
      <div className="flex gap-1.5 h-12 w-full">
        {LEVELS.map((level) => {
          const isSelected = value === level;
          const isLower = LEVELS.indexOf(level) <= LEVELS.indexOf(value);
          
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className={`
                flex-1 relative group transition-all duration-300
                ${isSelected ? 'flex-[2]' : 'flex-1'}
              `}
            >
              <div 
                className={`
                  w-full h-full skew-x-[-15deg] border border-black/50 transition-all duration-300
                  flex items-center justify-center overflow-hidden
                  ${isLower ? LEVEL_COLORS[level] : 'bg-white/5 border-white/10 hover:bg-white/10'}
                  ${isSelected ? 'shadow-[0_0_20px_currentColor]' : ''}
                `}
              >
                 <span className={`
                   text-base font-bold transform skew-x-[15deg]
                   ${isLower ? 'text-white drop-shadow-md' : 'text-gray-600'}
                 `}>
                   {level}
                 </span>
                 
                 {/* Active Scanline */}
                 {isSelected && (
                   <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                 )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};