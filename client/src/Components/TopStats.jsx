import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, ShieldAlert, Database, Zap } from 'lucide-react';

const TopStats = ({ isCapturing, toggleCapture, packetCount, trackerCount, score }) => {
  // Dynamic status based on Privacy Integrity
  const isHealthy = score > 80;
  const isWarning = score <= 80 && score > 50;
  
  const statusColor = isHealthy ? 'text-cyber-green' : isWarning ? 'text-cyber-gold' : 'text-cyber-red';
  const statusGlow = isHealthy ? 'shadow-cyber-green/20' : isWarning ? 'shadow-cyber-gold/20' : 'shadow-cyber-red/20';

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-cyber-card backdrop-blur-md border border-white/5 rounded-2xl p-4 lg:p-6 mb-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl"
    >
      {/* 1. Engine Control Group */}
      <div className="flex items-center gap-6 w-full lg:w-auto">
        <button 
          onClick={toggleCapture}
          className={`group relative flex items-center gap-3 px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300 overflow-hidden
            ${isCapturing 
              ? 'bg-cyber-red/10 text-cyber-red border border-cyber-red/30 hover:bg-cyber-red/20' 
              : 'bg-cyber-blue text-white hover:scale-105 active:scale-95 shadow-neon-blue'}`}
        >
          <div className={`h-2 w-2 rounded-full ${isCapturing ? 'bg-cyber-red animate-pulse' : 'bg-white'}`} />
          {isCapturing ? 'Terminate_Trace' : 'Initialize_Engine'}
          
          {/* Subtle scanning light effect */}
          {isCapturing && (
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2"
            />
          )}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <Activity size={14} className={isCapturing ? "text-cyber-green" : "text-slate-600"} />
             <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-widest">
                System_Status
             </span>
          </div>
          <span className={`text-sm font-black italic tracking-tighter ${isCapturing ? 'text-cyber-green' : 'text-slate-400'}`}>
            {isCapturing ? '● FEED_ACTIVE' : '○ ENGINE_IDLE'}
          </span>
        </div>
      </div>

      {/* 2. Real-time Metrics Group */}
      <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-12 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
        
        {/* Packet Volume */}
        <div className="flex flex-col items-center lg:items-end">
          <div className="flex items-center gap-2 mb-1">
            <Database size={12} className="text-cyber-blue" />
            <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Traffic_Volume</span>
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            {packetCount.toLocaleString()}<span className="text-[10px] text-slate-600 ml-1">PKTS</span>
          </div>
        </div>

        {/* Threat Count */}
        <div className="flex flex-col items-center lg:items-end">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={12} className={trackerCount > 0 ? "text-cyber-red" : "text-slate-600"} />
            <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Threat_Nodes</span>
          </div>
          <div className={`text-xl font-black tabular-nums ${trackerCount > 0 ? 'text-cyber-red' : 'text-white'}`}>
            {trackerCount}<span className="text-[10px] text-slate-600 ml-1">DETECTED</span>
          </div>
        </div>

        {/* Global Privacy Index */}
        <div className="flex flex-col items-center lg:items-end">
          <div className="flex items-center gap-2 mb-1">
            {isHealthy ? <ShieldCheck size={12} className="text-cyber-green" /> : <Zap size={12} className="text-cyber-gold" />}
            <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Integrity_Index</span>
          </div>
          <div className={`text-xl font-black tabular-nums ${statusColor}`}>
            {score}%
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TopStats;