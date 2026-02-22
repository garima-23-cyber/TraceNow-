// src/Components/Navbar.jsx
import React from 'react';
import { Cpu,  Wifi, WifiOff, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LOGO from '../asset/logo.png';

const Navbar = ({ isCapturing = false, packetCount = 0, connectionStatus = 'disconnected' }) => {
  const isConnected = connectionStatus === 'connected';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full h-16 flex-none flex items-center justify-between px-6 lg:px-12 
        border-b border-white/[0.03] bg-[#020617]/80 backdrop-blur-md z-50 relative"
    >
      {/* Brand Section */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative group">
          {/* Holographic Aura behind logo */}
          <div className={`absolute -inset-2 rounded-full blur-xl transition-all duration-1000 opacity-20 ${
            isConnected ? (isCapturing ? 'bg-blue-400 animate-pulse' : 'bg-slate-600') : 'bg-red-500'}`} 
          />
          
          <div className="relative bg-transparent">
            <motion.img 
              src={LOGO} 
              alt="TraceNow Logo"
              className="w-9 h-9 lg:w-10 lg:h-10 object-contain"
              animate={{ 
                scale: isCapturing ? [1, 1.08, 1] : 1,
                filter: isConnected ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'grayscale(1)'
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl lg:text-2xl font-black tracking-tighter italic leading-none flex items-center">
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">TRACE</span>
            <span className="text-yellow-400 ml-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">NOW</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`h-1 w-1 rounded-full ${isConnected ? 'bg-blue-400' : 'bg-red-500 animate-ping'}`} />
            <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.3em]">
              {isConnected ? `UPLINK_LIVE` : 'LINK_OFFLINE'}
            </p>
          </div>
        </div>
      </div>

      {/* Center HUD - Aesthetic Inset Design */}
      <div className="hidden md:flex items-center gap-8 bg-white/[0.02] px-8 py-2
        rounded-2xl border border-white/[0.05] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
        
        {/* Connection Phase */}
        <div className="flex items-center gap-3">
          {isConnected ? <Wifi size={14} className="text-blue-400" /> : <WifiOff size={14} className="text-red-500" />}
          <div className="flex flex-col">
            <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Protocol</span>
            <span className={`text-[10px] font-mono font-bold leading-none ${isConnected ? "text-blue-400" : "text-red-500"}`}>
              {connectionStatus.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        {/* Live Metrics */}
        <div className="flex items-center gap-3">
          <motion.div 
            animate={isCapturing ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            <Cpu size={14} className={isCapturing ? "text-yellow-400" : "text-slate-700"} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Interceptions</span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={packetCount}
                initial={{ opacity: 0, y: 2 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-mono font-black text-slate-300 tabular-nums leading-none"
              >
                {packetCount.toString().padStart(6, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Engine Status HUD (Right) */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="hidden sm:flex flex-col items-end">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
            isCapturing ? "text-green-500" : "text-slate-600"}`}>
            {isCapturing ? 'CORE_ACTIVE' : 'IDLE_MODE'}
          </span>
          <div className="w-10 h-[2px] bg-slate-800 mt-1 rounded-full overflow-hidden">
             <motion.div 
               animate={isCapturing ? { x: ["-100%", "100%"] } : { x: "-100%" }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="w-full h-full bg-green-500 shadow-[0_0_8px_#22c55e]"
             />
          </div>
        </div>
        
        <div className={`p-2 rounded-xl border transition-all duration-500 ${
          isCapturing ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_-5px_#3b82f6]' : 'bg-white/5 border-white/5'}`}>
          <Zap 
            size={18} 
            className={`${isCapturing ? "text-blue-400 animate-pulse" : "text-slate-600"}`} 
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;