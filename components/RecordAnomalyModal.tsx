import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HazardLevel, WorldEntity } from '../types';
import { HazardPicker } from './ui/HazardPicker';
import { GlitchText } from './ui/GlitchText';
import { createEntity } from '../services/supabase';

interface RecordAnomalyModalProps {
  onClose: () => void;
  onAcquireTarget: () => void;
  initialCoords: { x: number; y: number } | null;
  onSuccess?: () => void;
}

export const RecordAnomalyModal: React.FC<RecordAnomalyModalProps> = ({ 
  onClose, 
  onAcquireTarget,
  initialCoords,
  onSuccess
}) => {
  const [step, setStep] = useState<'FORM' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('FORM');
  
  // Form State
  const [codeName, setCodeName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [rules, setRules] = useState('');
  const [hazard, setHazard] = useState<HazardLevel>('F');

  const handleSubmit = async () => {
    if (!codeName || !appearance || !rules || !initialCoords) return;
    setStep('SYNCING');

    // Construct Entity Object
    const newEntity: WorldEntity = {
        id: `user-${Date.now().toString(36)}`,
        name: codeName,
        type: 'PHENOMENON', // Default for user submissions
        faction: 'OBSERVER',
        containmentClass: 'N/A',
        hazardLevel: hazard,
        status: '观测中',
        resonance: Math.floor(Math.random() * 100),
        coordinates: initialCoords,
        description: appearance,
        secretData: `[内在规则] ${rules}`
    };

    const success = await createEntity(newEntity);

    if (success) {
        setStep('SUCCESS');
        if (onSuccess) onSuccess();
    } else {
        setStep('ERROR');
    }
  };

  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xl bg-black/90 border border-white/20 shadow-glow relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Decorative Tech Header */}
        <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-8">
           <span className="text-[10px] font-mono text-void-purple uppercase tracking-[0.3em]">
             PROTOCOL: UPLOAD_OBSERVATION // V.2.0
           </span>
           <div className="flex gap-2">
             <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
             <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
           </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'FORM' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              className="p-10 overflow-y-auto custom-scrollbar"
            >
              <h2 className="text-3xl font-black text-white mb-8 tracking-widest text-glow-white border-b border-white/10 pb-4">
                上传观测记录
              </h2>

              <div className="space-y-8">
                {/* Code Name */}
                <div className="group">
                  <div className="mb-2">
                    <span className="text-sm font-bold text-white tracking-widest group-focus-within:text-void-purple transition-colors">异常代号</span>
                    <span className="ml-2 text-[10px] font-mono text-gray-500">CODE NAME</span>
                  </div>
                  <input 
                    type="text" 
                    value={codeName}
                    onChange={(e) => setCodeName(e.target.value)}
                    placeholder="请输入异常名称..."
                    className="w-full bg-transparent border-b-2 border-white/20 py-3 font-sans text-xl text-white focus:outline-none focus:border-void-purple transition-colors placeholder-white/20"
                  />
                </div>

                {/* Coordinates */}
                <div>
                   <div className="mb-2">
                    <span className="text-sm font-bold text-white tracking-widest">观测坐标</span>
                    <span className="ml-2 text-[10px] font-mono text-gray-500">COORDINATES</span>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-white/5 border border-white/10 p-4 font-mono text-base text-gray-300 flex items-center gap-6 shadow-inner">
                       <span className="text-void-purple font-bold">X: {initialCoords?.x.toFixed(2) || '---'}</span>
                       <span className="text-void-purple font-bold">Y: {initialCoords?.y.toFixed(2) || '---'}</span>
                     </div>
                     <button 
                       onClick={onAcquireTarget}
                       className="px-6 py-2 border border-void-purple text-sm font-bold text-void-purple hover:bg-void-purple hover:text-white transition-all tracking-wide shadow-glow"
                     >
                       {initialCoords ? '重新校准' : '获取坐标'}
                     </button>
                  </div>
                </div>

                {/* Appearance */}
                <div className="group">
                   <div className="mb-2">
                    <span className="text-sm font-bold text-white tracking-widest group-focus-within:text-void-purple transition-colors">表象描述</span>
                    <span className="ml-2 text-[10px] font-mono text-gray-500">APPEARANCE</span>
                  </div>
                  <textarea 
                    rows={3}
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 font-sans text-lg text-gray-200 focus:outline-none focus:border-void-purple transition-colors resize-none leading-relaxed"
                    placeholder="描述异常的外观特征..."
                  />
                </div>

                {/* Rules */}
                <div className="group">
                  <div className="mb-2">
                    <span className="text-sm font-bold text-white tracking-widest group-focus-within:text-void-purple transition-colors">内在规则</span>
                    <span className="ml-2 text-[10px] font-mono text-gray-500">INTERNAL LOGIC</span>
                  </div>
                  <textarea 
                    rows={3}
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 font-sans text-lg text-gray-200 focus:outline-none focus:border-void-purple transition-colors resize-none leading-relaxed"
                    placeholder="描述异常的运作机制或危害逻辑..."
                  />
                </div>

                {/* Hazard Picker */}
                <HazardPicker value={hazard} onChange={setHazard} />

                {/* Actions */}
                <div className="flex gap-6 pt-8">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 border border-white/10 text-gray-400 font-bold tracking-widest hover:text-white hover:bg-white/5 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!codeName || !initialCoords}
                    className={`
                      flex-[2] py-4 font-sans text-base font-bold tracking-[0.2em] transition-all
                      ${codeName && initialCoords 
                        ? 'bg-starlight text-black hover:bg-void-purple hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                    `}
                  >
                    同步至网络
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'SYNCING' && (
             <motion.div 
               key="syncing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10"
             >
               <div className="w-20 h-20 border-t-4 border-l-4 border-void-purple rounded-full animate-spin mb-8 shadow-glow" />
               <div className="text-lg font-bold text-white animate-pulse tracking-[0.3em]">
                 数据加密上传中...
               </div>
               <div className="text-xs font-mono text-void-purple mt-2">UPLOADING TO CLOUD DATABASE</div>
             </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-8 text-center z-10"
            >
              <div className="text-6xl text-green-400 mb-8 text-glow">❖</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-widest">传输完成</h3>
              <p className="text-gray-300 font-sans text-lg tracking-wide">
                <GlitchText text="数据库更新完毕。观测者网络已同步。" speed={40} />
              </p>
            </motion.div>
          )}

          {step === 'ERROR' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-8 text-center z-10"
            >
              <div className="text-6xl text-red-500 mb-8 text-glow-danger">!</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-widest">传输失败</h3>
              <p className="text-gray-400 mb-6">无法连接至中心数据库。</p>
              <button 
                 onClick={() => setStep('FORM')}
                 className="px-6 py-3 border border-white/20 text-white hover:bg-white/10"
              >
                 返回重试
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};