// src/Components/Sidebar.jsx
import React from 'react';
import { Globe, BarChart3, ShieldAlert, ClipboardList, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, isCapturing }) => {
  const menuItems = [
    { id: 'overview', label: 'Nerve Center', icon: <Zap size={20} /> },
    { id: 'geo', label: 'Geo_Location', icon: <Globe size={20} /> },
    { id: 'tracker', label: 'Tracker_Graph', icon: <BarChart3 size={20} /> },
    { id: 'logs', label: 'Behavior_Logs', icon: <ClipboardList size={20} /> },
    { id: 'forensic', label: 'Forensic_Guide', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      /* Remains static and h-full on desktop to prevent overlap.
         Fixed at bottom on mobile for better accessibility.
      */
      className="fixed bottom-0 left-0 w-full h-16 lg:static lg:h-full lg:w-64 bg-[#020617]/40 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-white/5 z-40 flex lg:flex-col items-center py-6 px-2 shrink-0"
    >
      {/* REMOVED: Brand Section (TraceNow) 
          The space is now used directly for the navigation menu.
      */}

      <nav className="flex lg:flex-col w-full justify-around lg:justify-start gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col lg:flex-row items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
              ${activeTab === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {/* Active Highlight Background */}
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl"
              />
            )}
            
            <span className={`${activeTab === item.id ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}>
              {item.icon}
            </span>
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer Meta - Desktop Only */}
      <div className="hidden lg:block mt-auto w-full px-4 border-t border-white/5 pt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase">
             <span>Status</span>
             <span className={isCapturing ? 'text-blue-500 animate-pulse' : ''}>
               {isCapturing ? 'Interception_ON' : 'Idle'}
             </span>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase">
            <span>Version</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;