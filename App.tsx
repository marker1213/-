import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMELINE_DATA } from './constants';
import { LandingPage } from './components/LandingPage';
import { HolographicMap } from './components/HolographicMap';
import { ArchivePanel } from './components/ArchivePanel';
import { OracleView } from './components/OracleView';
import { EntityDetailModal } from './components/EntityDetailModal';
import { RecordAnomalyModal } from './components/RecordAnomalyModal';
import { WorldEntity } from './types';
import { fetchEntities } from './services/supabase';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [entities, setEntities] = useState<WorldEntity[]>([]);
  const [timeline] = useState(TIMELINE_DATA);
  const [selectedEntity, setSelectedEntity] = useState<WorldEntity | null>(null);
  const [showOracle, setShowOracle] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  
  // Anomaly Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [uploadCoords, setUploadCoords] = useState<{x: number, y: number} | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      const data = await fetchEntities();
      setEntities(data);
      setLoadingData(false);
    };
    loadData();
  }, []);

  const handleRefreshData = async () => {
    const data = await fetchEntities();
    setEntities(data);
  };

  const handleMapClick = (coords: {x: number, y: number}) => {
    if (isPickingLocation) {
      setUploadCoords(coords);
      setIsPickingLocation(false);
      setShowUploadModal(true);
    }
  };

  const startTargetAcquisition = () => {
    setShowUploadModal(false);
    setIsPickingLocation(true);
  };

  return (
    <div className="h-screen w-screen bg-black text-starlight font-sans selection:bg-void-purple selection:text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage key="landing" onEnter={() => setShowLanding(false)} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* LAYER 1: BACKGROUND MAP */}
            <HolographicMap 
              entities={entities} 
              onEntityClick={setSelectedEntity} 
              onMapClick={handleMapClick}
              isTargeting={isPickingLocation}
            />

            {/* Targeting Overlay Message */}
            <AnimatePresence>
              {isPickingLocation && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-void-purple/30 border border-void-purple backdrop-blur-md px-8 py-4 rounded-sm shadow-glow text-center z-20 pointer-events-none"
                >
                  <div className="text-xl font-bold text-white tracking-widest mb-1 text-glow">
                    目标锁定模式
                  </div>
                  <div className="text-xs text-void-purple font-mono uppercase tracking-[0.2em]">
                    Targeting System Engaged // Select Sector
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LAYER 2: UI OVERLAY */}
            <div className={`absolute inset-0 pointer-events-none flex flex-col p-8 transition-opacity duration-500 ${isPickingLocation ? 'opacity-30' : 'opacity-100'}`}>
              
              {/* Header */}
              <header className="flex justify-between items-start mb-6 pointer-events-auto">
                <div className="flex flex-col">
                  <h1 className="text-5xl font-sans font-black tracking-widest text-white text-glow-white mb-2">
                    观察者中心
                  </h1>
                  <h2 className="text-sm font-mono text-gray-400 tracking-[0.5em] uppercase pl-1">
                    The Observer Hub // Terminal 01
                  </h2>
                </div>
                
                <button 
                  onClick={() => setShowOracle(!showOracle)}
                  className={`
                    px-6 py-3 border backdrop-blur-md transition-all font-sans font-bold text-sm tracking-widest group
                    ${showOracle 
                      ? 'bg-void-purple/20 border-void-purple text-white shadow-glow' 
                      : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:border-white/50 hover:shadow-glow'}
                  `}
                >
                  <span className="flex flex-col items-center">
                    <span>{showOracle ? '[ 关闭神谕 ]' : '[ 开启神谕 ]'}</span>
                    <span className="text-[10px] opacity-50 font-mono tracking-wider group-hover:opacity-100 transition-opacity">
                      ORACLE SYSTEM
                    </span>
                  </span>
                </button>
              </header>

              {/* Main Body */}
              <div className="flex-1 flex gap-8 overflow-hidden relative">
                
                {/* Left: Floating Archives */}
                <div className="h-full flex flex-col justify-center">
                   <motion.div 
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.5 }}
                     className="h-[80vh] pointer-events-auto relative"
                   >
                      <ArchivePanel 
                        entities={entities} 
                        onSelectEntity={setSelectedEntity} 
                      />
                   </motion.div>
                </div>

                {/* Center: Empty for Map visibility, or Entity Detail Modal */}
                <div className="flex-1 relative pointer-events-none">
                   {/* Connection Status Indicator */}
                    <div className="absolute top-0 right-10 text-right pointer-events-auto">
                        <div className="flex items-center justify-end gap-3 mb-1">
                            <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${loadingData ? 'bg-yellow-400 text-yellow-400 animate-pulse' : 'bg-green-500 text-green-500'}`}></span>
                            <span className="text-sm font-bold tracking-widest text-white">
                              {loadingData ? '正在同步...' : '链路稳定'}
                            </span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 tracking-widest">
                            {loadingData ? 'SYNCING DATA...' : 'LATENCY: 0.04ms // SYNCED'}
                        </div>
                    </div>

                   {/* FAB: Record Anomaly */}
                   <div className="absolute bottom-4 right-0 pointer-events-auto">
                     <button 
                       onClick={() => setShowUploadModal(true)}
                       className="
                         group flex items-center gap-5 pl-8 pr-4 py-4 bg-black/80 backdrop-blur-xl border border-white/20 
                         hover:border-void-purple hover:bg-void-purple/10 transition-all duration-300 shadow-lg hover:shadow-glow
                       "
                     >
                        <div className="flex flex-col items-end">
                            <span className="text-base font-bold tracking-[0.2em] text-white group-hover:text-void-purple transition-colors">
                            记录异常
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 tracking-widest group-hover:text-void-purple/70">
                                RECORD ANOMALY
                            </span>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center border border-white/30 group-hover:border-void-purple bg-white/5 rounded-sm">
                           <span className="text-3xl text-void-purple font-light pb-1 group-hover:scale-110 transition-transform">+</span>
                        </div>
                     </button>
                   </div>
                </div>

                {/* Right: Oracle (Conditional) */}
                <AnimatePresence>
                  {showOracle && (
                    <motion.div 
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      className="w-[28rem] h-[85vh] pointer-events-auto z-20"
                    >
                      <OracleView entities={entities} events={timeline} />
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* LAYER 3: MODALS */}
            <AnimatePresence>
              {selectedEntity && !isPickingLocation && (
                <EntityDetailModal 
                  entity={selectedEntity} 
                  onClose={() => setSelectedEntity(null)} 
                />
              )}
              
              {showUploadModal && (
                <RecordAnomalyModal
                  onClose={() => setShowUploadModal(false)}
                  onAcquireTarget={startTargetAcquisition}
                  initialCoords={uploadCoords}
                  onSuccess={handleRefreshData}
                />
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;