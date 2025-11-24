import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WorldEntity, FactionType } from '../types';
import { GlassCard } from './ui/GlassCard';

interface ArchivePanelProps {
  entities: WorldEntity[];
  onSelectEntity: (entity: WorldEntity) => void;
}

const TABS: { id: FactionType; label: string; en: string; desc: string }[] = [
  { id: 'UNION', label: '人联', en: 'UNION', desc: '人联民事档案库' },
  { id: 'RSCP', label: '实安协', en: 'RSCP', desc: 'RSCP 绝密档案' },
  { id: 'OBSERVER', label: '观察者', en: 'OBSERVER', desc: '未收录异常' },
];

const TYPE_MAP: Record<string, string> = {
  'CHARACTER': '角色',
  'LOCATION': '地点',
  'ARTIFACT': '造物',
  'PHENOMENON': '现象'
};

const CLASS_MAP: Record<string, string> = {
  'SAFE': '安全',
  'EUCLID': '欧几里得',
  'KETER': '凯特尔',
  'THAUMIEL': '陶米尔',
  'N/A': '无评级'
};

export const ArchivePanel: React.FC<ArchivePanelProps> = ({ entities, onSelectEntity }) => {
  const [activeTab, setActiveTab] = useState<FactionType>('RSCP');

  const filteredEntities = entities.filter(e => e.faction === activeTab);

  return (
    <div className="h-full flex flex-col w-full max-w-[24rem] pointer-events-auto">
      {/* Tabs Header */}
      <div className="flex mb-6 bg-black/40 p-1 border border-white/10 rounded-sm backdrop-blur-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 transition-all relative overflow-hidden group
              flex flex-col items-center justify-center
              ${activeTab === tab.id 
                ? 'bg-white/10 text-white shadow-glow' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
            `}
          >
            <span className={`text-base font-bold tracking-widest ${activeTab === tab.id ? 'text-glow-white' : ''}`}>
              {tab.label}
            </span>
            <span className="text-[9px] font-mono opacity-40 tracking-[0.2em] group-hover:opacity-70 transition-opacity">
              {tab.en}
            </span>
            
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-void-purple box-shadow-glow"
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Context Description */}
      <div className="mb-4 px-2 flex justify-between items-end border-b border-white/10 pb-2">
        <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1 scale-90 origin-left">来源 / SOURCE</div>
            <div className="text-sm text-void-purple font-bold tracking-wider">
            {TABS.find(t => t.id === activeTab)?.desc}
            </div>
        </div>
        <div className="text-xs font-mono text-gray-600">
            COUNT: {filteredEntities.length}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-10">
        {filteredEntities.map(entity => (
          <GlassCard 
            key={entity.id} 
            hoverEffect 
            variant={entity.faction}
            className="cursor-pointer group !p-6 border-l-4"
          >
            <div onClick={() => onSelectEntity(entity)}>
               <div className="flex justify-between items-start mb-4">
                 {/* Top Left: Containment Class */}
                 <div className={`
                   px-2 py-1 border flex items-center gap-2 bg-black/40
                   ${entity.containmentClass === 'KETER' ? 'border-red-900/60' : 
                     entity.containmentClass === 'EUCLID' ? 'border-yellow-900/60' :
                     entity.containmentClass === 'SAFE' ? 'border-green-900/60' :
                     'border-gray-700'}
                 `}>
                   <span className={`
                     text-xs font-bold tracking-wider
                     ${entity.containmentClass === 'KETER' ? 'text-red-400' : 
                       entity.containmentClass === 'EUCLID' ? 'text-yellow-400' :
                       entity.containmentClass === 'SAFE' ? 'text-green-400' :
                       'text-gray-400'}
                   `}>
                     {CLASS_MAP[entity.containmentClass] || entity.containmentClass}
                   </span>
                 </div>

                 {/* Top Right: Hazard Badge */}
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-500 font-mono mb-0.5">HAZARD</span>
                    <div className={`
                        w-8 h-8 flex items-center justify-center text-lg font-serif font-bold border bg-black/50
                        ${['S','A'].includes(entity.hazardLevel) 
                        ? 'border-danger text-danger shadow-glow-danger' 
                        : 'border-gray-600 text-gray-300'}
                    `}>
                        {entity.hazardLevel}
                    </div>
                 </div>
               </div>

               <h4 className="text-xl font-bold text-white group-hover:text-void-purple transition-colors mb-2 tracking-wide text-glow-white">
                 {entity.name}
               </h4>
               
               <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-3">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 font-mono tracking-wider">类型 / TYPE</span>
                     <span className="text-xs text-gray-300 font-bold">{TYPE_MAP[entity.type]}</span>
                  </div>
                  
                  <div className={`
                    text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity font-mono flex items-center gap-1
                  `} style={{ color: entity.faction === 'UNION' ? '#60a5fa' : entity.faction === 'OBSERVER' ? '#a78bfa' : '#e2e8f0' }}>
                    <span>查看档案</span> 
                    <span className="text-lg leading-none">&raquo;</span>
                  </div>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};