import React, { useState } from 'react';
import { analyzeWorldState } from '../services/geminiService';
import { WorldEntity, TimelineEvent, GeminiAnalysisResult } from '../types';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

interface OracleViewProps {
  entities: WorldEntity[];
  events: TimelineEvent[];
}

export const OracleView: React.FC<OracleViewProps> = ({ entities, events }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);

  const handleConsult = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await analyzeWorldState(query, entities, events);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <GlassCard className="flex-shrink-0 !p-8 border-void-purple/30 bg-black/80">
        <div className="mb-4">
            <h2 className="text-xl font-bold text-white tracking-widest text-glow">神谕系统链路</h2>
            <div className="text-[10px] font-mono text-void-purple opacity-70 tracking-[0.2em]">ORACLE UPLINK // CONNECTED</div>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入您对虚空的提问..."
            className="flex-1 bg-white/5 border border-white/10 p-4 text-base text-white focus:outline-none focus:border-void-purple transition-colors font-sans placeholder-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
          />
          <button 
            onClick={handleConsult}
            disabled={loading}
            className={`
              px-8 py-4 border text-sm font-bold tracking-widest transition-all
              ${loading 
                ? 'border-white/10 text-white/30 cursor-wait' 
                : 'border-white/20 text-white bg-white/5 hover:bg-void-purple/20 hover:border-void-purple hover:shadow-glow'}
            `}
          >
            {loading ? '通讯中...' : '发送'}
          </button>
        </div>
      </GlassCard>

      {result && (
        <GlassCard className="flex-1 border-void-purple/40 shadow-glow overflow-y-auto !bg-black/90 !p-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="block text-sm font-bold text-void-purple tracking-widest">分析结果</span>
                <span className="block text-[10px] font-mono text-gray-500">ANALYSIS OUTPUT</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 font-bold">威胁指数</span>
                <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full ${result.threatLevel > 75 ? 'bg-danger shadow-[0_0_10px_#ef4444]' : 'bg-void-purple shadow-[0_0_10px_#8b5cf6]'}`}
                    style={{ width: `${result.threatLevel}%` }}
                  />
                </div>
                <span className="text-base font-mono text-white font-bold">{result.threatLevel}%</span>
              </div>
            </div>

            <p className="text-lg font-sans leading-loose text-gray-100 text-justify font-light tracking-wide">
              "{result.analysis}"
            </p>

            <div className="p-6 bg-void-purple/10 border border-void-purple/20 rounded-sm">
              <h3 className="text-sm font-bold text-void-purple mb-3 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-void-purple rounded-full animate-pulse"></span>
                行动指令
              </h3>
              <p className="font-sans text-base text-gray-200 leading-relaxed pl-4 border-l border-void-purple/30">
                &gt; {result.recommendation}
              </p>
            </div>
          </motion.div>
        </GlassCard>
      )}
    </div>
  );
};