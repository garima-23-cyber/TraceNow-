import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Share2, ShieldAlert, Zap, Activity, Eye, AlertTriangle } from 'lucide-react';

const getIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes('fingerprint')) return <Fingerprint size={15} />;
  if (t.includes('cross'))       return <Share2 size={15} />;
  if (t.includes('profil'))      return <Eye size={15} />;
  if (t.includes('frequency'))   return <AlertTriangle size={15} />;
  return <Zap size={15} />;
};

// Mapped to your Cyber Theme
const RISK_STYLES = {
  CRITICAL: { bg: 'bg-cyber-red/10', text: 'text-cyber-red', border: 'border-cyber-red/30' },
  High:     { bg: 'bg-cyber-red/5',  text: 'text-cyber-red', border: 'border-cyber-red/20' },
  Medium:   { bg: 'bg-cyber-gold/10', text: 'text-cyber-gold', border: 'border-cyber-gold/30' },
  Low:      { bg: 'bg-cyber-blue/10', text: 'text-cyber-blue', border: 'border-cyber-blue/30' },
};

const BehavioralReport = ({ patterns = [] }) => {
  const safePatterns = Array.isArray(patterns) ? patterns : [];

  return (
    <div className="cyber-card p-6 flex flex-col bg-cyber-card backdrop-blur-md border border-white/5 h-full min-h-[400px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-cyber-red/30 bg-cyber-red/10">
            <ShieldAlert size={18} className="text-cyber-red" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight italic">
              Threat <span className="text-cyber-red">Heuristics</span>
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-mono tracking-[0.2em] mt-1">
              Live Pattern Ledger
            </p>
          </div>
        </div>
        
        <div className="px-3 py-1 rounded-full flex items-center gap-2 bg-cyber-red/10 border border-cyber-red/20">
          <span className="relative flex h-2 w-2">
            {safePatterns.length > 0 && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${safePatterns.length > 0 ? 'bg-cyber-red' : 'bg-slate-600'}`} />
          </span>
          <span className="font-mono text-[10px] font-bold text-cyber-red uppercase">
            {safePatterns.length} Events
          </span>
        </div>
      </div>

      {/* Responsive List Container */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false} mode="popLayout">
          {safePatterns.length > 0 ? safePatterns.map((item, index) => {
            const style = RISK_STYLES[item.risk] || RISK_STYLES.Medium;
            return (
              <motion.div 
                key={item.id || `p-${index}`} 
                layout
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden group transition-all hover:border-white/10`}
                style={{ borderLeft: `3px solid var(--tw-border-opacity)` }} 
              >
                {/* Visual Accent */}
                <div className={`absolute left-0 top-0 h-full w-[3px] ${style.bg.replace('/10', '')}`} 
                     style={{ backgroundColor: 'currentColor' }} />

                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={style.text}>{getIcon(item.type)}</span>
                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-tight">
                      {item.type || "Unknown Threat"}
                    </span>
                  </div>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase border ${style.bg} ${style.text} ${style.border}`}>
                    {item.risk || "MED"}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 font-mono leading-relaxed mb-3 relative z-10">
                  {item.desc || "Analyzing behavioral signature..."}
                </p>

                <div className="flex justify-between items-center text-[9px] font-mono relative z-10">
                  <span className="truncate max-w-[140px] font-bold text-cyber-gold">
                    {item.domain || "unknown"}
                  </span>
                  <span className="text-slate-500 tabular-nums">
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleTimeString()
                      : new Date().toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            );
          }) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center py-20 opacity-40"
            >
              <Activity size={32} className="text-slate-600 mb-4 animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500 text-center leading-relaxed">
                Awaiting Behavioral<br />Signatures...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Interface */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest italic">
          Stream: {safePatterns.length > 0 ? <span className="text-cyber-red animate-pulse">Synchronized</span> : 'IDLE'}
        </span>
        <div className="flex gap-1.5 items-end h-4">
          {[0.4, 0.7, 0.5].map((dur, i) => (
            <motion.div 
              key={i}
              animate={{ height: [4, 16, 8, 12, 4] }}
              transition={{ repeat: Infinity, duration: dur, delay: i * 0.1 }}
              className={`w-[3px] rounded-full ${safePatterns.length > 0 ? 'bg-cyber-red' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BehavioralReport;