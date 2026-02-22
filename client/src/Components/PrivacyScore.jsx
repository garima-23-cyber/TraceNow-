import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';

const PrivacyScore = ({ score = 100 }) => {
  const prevScoreRef = useRef(score);
  const controls     = useAnimation();
  const [lastChange, setLastChange] = useState(0);
  const [trend, setTrend]           = useState('up');

  const displayScore = Math.max(0, Math.min(100, Math.round(score)));
  const isDangerous  = displayScore < 60;
  const isWarning    = displayScore >= 60 && displayScore < 80;
  
  // Mapped to your Cyber Theme
  const statusColor  = isDangerous ? '#ef4444' : isWarning ? '#fbbf24' : '#22c55e';

  useEffect(() => {
    const prev = prevScoreRef.current;
    if (score !== prev) {
      const diff = score - prev;
      setLastChange(diff);
      setTrend(diff < 0 ? 'down' : 'up');
      if (diff < 0) controls.start({ x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.35 } });
      prevScoreRef.current = score;
    }
  }, [score, controls]);

  const RADIUS = 80;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const ARC    = CIRCUMFERENCE * 0.75;
  const offset = ARC * (1 - displayScore / 100);

  return (
    <div className="cyber-card p-8 flex flex-col items-center justify-center relative overflow-hidden bg-cyber-card backdrop-blur-xl border border-white/5 h-full min-h-[350px]">

      {/* Background Flash Alert */}
      <AnimatePresence mode="wait">
        <motion.div key={`flash-${displayScore}`}
          initial={{ opacity: 0 }} 
          animate={{ opacity: trend === 'down' ? 0.08 : 0.04 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: trend === 'down' ? '#ef4444' : '#3b82f6' }} 
        />
      </AnimatePresence>

      {/* Header Info */}
      <div className="absolute top-6 w-full px-8 flex justify-between items-center z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse shadow-lg" style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">Privacy_Score</span>
          </div>
          <span className="text-[8px] text-slate-700 font-mono mt-0.5 tracking-tighter">NODE: TRACE_01_CORE</span>
        </div>
        
        {lastChange !== 0 && (
          <div className="flex flex-col items-end font-mono text-[11px]"
            style={{ color: trend === 'down' ? '#ef4444' : '#22c55e' }}>
            <div className="flex items-center gap-1">
              {trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              <span className="font-black">{lastChange > 0 ? `+${lastChange}` : lastChange}</span>
            </div>
            <span className="text-[7px] opacity-60 uppercase font-black tracking-tighter">
              {trend === 'down' ? 'Declining' : 'Recovering'}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 z-10">
        Privacy <span className="text-white">Integrity</span> Index
      </h3>

      {/* Gauge Logic */}
      <motion.div animate={controls} className="relative flex items-center justify-center z-10">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <g transform="translate(110, 110) rotate(135)">
            {/* Background Track */}
            <circle r={RADIUS} fill="none" stroke="#0f172a" strokeWidth={14}
              strokeDasharray={`${ARC} ${CIRCUMFERENCE}`} strokeLinecap="round" />
            
            {/* Animated Score Progress */}
            <motion.circle r={RADIUS} fill="none" stroke={statusColor} strokeWidth={14}
              strokeLinecap="round" strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
              animate={{ strokeDashoffset: offset }} initial={{ strokeDashoffset: ARC }}
              transition={{ duration: 1.5, ease: "circOut" }}
              style={{ filter: `drop-shadow(0 0 12px ${statusColor}aa)` }} />
          </g>
          
          {/* Ticks */}
          {[0, 25, 50, 75, 100].map(val => {
            const angle = (135 + (val / 100) * 270) * (Math.PI / 180);
            return (
              <line key={val}
                x1={110 + (RADIUS - 20) * Math.cos(angle)} y1={110 + (RADIUS - 20) * Math.sin(angle)}
                x2={110 + (RADIUS - 10) * Math.cos(angle)} y2={110 + (RADIUS - 10) * Math.sin(angle)}
                stroke="#334155" strokeWidth={2} strokeLinecap="round" />
            );
          })}
        </svg>

        <div className="absolute flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div key={displayScore}
              initial={{ y: trend === 'down' ? 10 : -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="flex items-baseline">
              <span className="font-black text-white italic tracking-tighter" style={{ fontSize: 64, lineHeight: 1 }}>
                {displayScore}
              </span>
              <span className="text-2xl font-black ml-1" style={{ color: statusColor }}>%</span>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-1.5 mt-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            {isDangerous ? <ShieldAlert size={12} className="text-cyber-red" /> : <ShieldCheck size={12} className="text-cyber-green" />}
            <span className="text-[9px] text-slate-400 font-black tracking-[0.2em] uppercase">
              {isDangerous ? 'At Risk' : isWarning ? 'Caution' : 'Secure'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Telemetry Footer */}
      <div className="mt-8 w-full flex flex-col items-center gap-4 z-10">
        <div className="flex gap-8 mb-2">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Risk_Level</span>
            <span className="text-[11px] font-black uppercase italic"
              style={{ color: isDangerous ? '#ef4444' : isWarning ? '#fbbf24' : '#3b82f6' }}>
              {isDangerous ? 'Critical' : isWarning ? 'Moderate' : 'Minimal'}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Volatility</span>
            <span className="text-[11px] font-black text-white uppercase italic">
              {Math.abs(lastChange) > 15 ? 'High' : Math.abs(lastChange) > 5 ? 'Med' : 'Low'}
            </span>
          </div>
        </div>
        
        <div className="text-[10px] font-mono tracking-widest flex items-center gap-2"
          style={{ color: isDangerous ? '#ef4444' : '#22c55e' }}>
          <span className="animate-pulse">{isDangerous ? '>> [ALERT]:' : '>> [INFO]:'}</span>
          <span className="font-bold">{isDangerous ? 'PRIVACY_LEAK_DETECTED' : 'FLOW_CLEAN_STABLE'}</span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-900 h-[3px] rounded-full overflow-hidden border border-white/5">
          <motion.div 
            animate={{ width: `${displayScore}%`, backgroundColor: statusColor }}
            transition={{ duration: 1.2, ease: "circOut" }} 
            className="h-full relative"
          >
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(255,255,255,0.5)] opacity-50" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyScore;