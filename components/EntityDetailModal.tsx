import React from 'react';
import { motion } from 'framer-motion';
import { WorldEntity } from '../types';
import { GlitchText } from './ui/GlitchText';

interface EntityDetailModalProps {
  entity: WorldEntity;
  onClose: () => void;
}

const FACTION_MAP: Record<string, string> = {
  'UNION': '人联 (Union)',
  'RSCP': '实安协 (RSCP)',
  'OBSERVER': '观察者 (Observer)',
};

const CLASS_MAP: Record<string, string> = {
  'SAFE': 'Safe (安全)',
  'EUCLID': 'Euclid (欧几里得)',
  'KETER': 'Keter (凯特尔)',
  'THAUMIEL': 'Thaumiel (陶米尔)',
  'N/A': 'Unclassified (未分级)'
};

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ entity, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-black/90 border border-white/20 shadow-glow-strong overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Top Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-void-purple to-transparent shadow-[0_0_15px_#8b5cf6]" />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
          
          {/* Header Section */}
          <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className={`
                  px-4 py-1.5 text-sm font-bold tracking-wider border bg-black/50
                  ${entity.containmentClass === 'KETER' ? 'border-red-500 text-red-400 shadow-glow-danger' : 
                    entity.containmentClass === 'EUCLID' ? 'border-yellow-500 text-yellow-400' : 
                    'border-green-500 text-green-400'}
                `}>
                  {CLASS_MAP[entity.containmentClass]}
                </span>
                <span className="text-base font-mono text-gray-500 tracking-widest">
                  NO. {entity.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-6xl font-sans font-black text-white tracking-wide text-glow-white mb-2">
                <GlitchText text={entity.name} speed={50} />
              </h2>
              <div className="text-sm font-mono text-void-purple opacity-70 tracking-[0.3em] uppercase">
                Secure Archive // Level 4 Clearance
              </div>
            </div>
            
            <button 
                onClick={onClose} 
                className="
                    w-12 h-12 flex items-center justify-center border border-white/10 text-gray-500 
                    hover:text-white hover:bg-white/10 hover:border-white/40 transition-all rounded-full
                "
            >
                <span className="text-2xl font-light">×</span>
            </button>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-3 gap-12 mb-12">
             <div className="col-span-1 border-l-2 border-white/10 pl-6">
                <div className="mb-2">
                    <span className="block text-base text-void-purple font-bold tracking-widest">危害等级</span>
                    <span className="block text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase">Hazard Level</span>
                </div>
                <div className={`text-5xl font-serif font-bold ${['S', 'A'].includes(entity.hazardLevel) ? 'text-danger text-glow-danger' : 'text-white'}`}>
                   {entity.hazardLevel}
                </div>
             </div>
             
             <div className="col-span-1 border-l-2 border-white/10 pl-6">
                <div className="mb-2">
                    <span className="block text-base text-void-purple font-bold tracking-widest">归属势力</span>
                    <span className="block text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase">Faction</span>
                </div>
                <div className="text-xl font-bold text-white tracking-wide">
                    {FACTION_MAP[entity.faction]?.split('(')[0]}
                </div>
             </div>
             
             <div className="col-span-1 border-l-2 border-white/10 pl-6">
                <div className="mb-2">
                    <span className="block text-base text-void-purple font-bold tracking-widest">共鸣频率</span>
                    <span className="block text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase">Resonance</span>
                </div>
                <div className="text-xl font-mono text-white tracking-wide">
                    {entity.resonance} <span className="text-sm text-gray-500">Hz</span>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-bold text-gray-400 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-void-purple shadow-[0_0_10px_#8b5cf6]"></span> 
                <span className="tracking-widest text-white">公开档案</span>
                <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mt-1">Public File</span>
              </h3>
              <p className="text-gray-100 text-lg leading-[2.2] font-light pl-6 border-l border-white/10 text-justify tracking-wide">
                {entity.description}
              </p>
            </div>

            {entity.secretData && (
              <div className="relative group pt-4">
                 <h3 className="text-lg font-bold text-danger mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-danger animate-pulse shadow-[0_0_10px_#ef4444]"></span>
                    <span className="tracking-widest text-danger text-glow-danger">绝密情报</span>
                    <span className="text-[10px] font-mono text-red-900 tracking-widest uppercase mt-1">Classified</span>
                 </h3>
                 <div className="bg-danger/5 p-8 border border-danger/20 shadow-glow-danger backdrop-blur-sm relative overflow-hidden">
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIiAvPgo8cGF0aCBkPSJNMCAyaDQiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIgLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
                    
                    <p className="text-red-200 font-sans text-lg leading-[2.2] relative z-10">
                        <GlitchText text={entity.secretData} speed={20} startDelay={600} />
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 p-5 px-12 flex justify-between items-center border-t border-white/10">
           <span className="text-xs font-mono text-gray-500 tracking-wider">USER: OBSERVER_CN_01</span>
           <span className="text-xs font-mono text-gray-500 tracking-wider">SOURCE: NULL-POINT</span>
        </div>
      </motion.div>
    </motion.div>
  );
};