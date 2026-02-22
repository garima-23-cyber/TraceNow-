import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isTracker = payload[0]?.payload?.isTracker;
  return (
    <div className="bg-cyber-bg border border-white/10 backdrop-blur-xl rounded-lg p-3 font-mono text-[10px] shadow-2xl">
      <p className="text-slate-500 mb-2 border-b border-white/5 pb-1 uppercase tracking-tighter">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${isTracker ? 'bg-cyber-red animate-pulse' : 'bg-cyber-blue'}`} />
        <p className={`font-black uppercase italic ${isTracker ? 'text-cyber-red' : 'text-cyber-gold'}`}>
          {isTracker ? 'Threat_Node' : 'Clean_Node'} — {payload[0]?.value} Hits
        </p>
      </div>
    </div>
  );
};

const TrackerChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="cyber-card p-6 flex flex-col items-center justify-center bg-cyber-card backdrop-blur-md border border-white/5 h-[350px]">
        <div className="w-10 h-10 border-2 border-slate-800 border-t-cyber-blue rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] animate-pulse">
          Synchronizing Traffic Data...
        </p>
      </div>
    );
  }

  return (
    <div className="cyber-card p-6 flex flex-col bg-cyber-card backdrop-blur-md border border-white/5 relative overflow-hidden h-[350px] shadow-2xl">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 rounded-full bg-cyber-gold shadow-neon-gold" />
            <h3 className="text-white font-black text-sm uppercase tracking-tight italic">
              Traffic <span className="text-cyber-gold">Volume_Analysis</span>
            </h3>
          </div>
          <p className="text-[9px] text-slate-500 uppercase font-mono tracking-widest pl-3">
            Handshake Frequency Monitor
          </p>
        </div>
        <div className="text-right font-mono">
          <span className="text-[8px] text-slate-600 block uppercase tracking-widest">Buffer</span>
          <span className="text-[10px] font-black text-cyber-blue italic animate-pulse">STREAMING</span>
        </div>
      </div>

      {/* Chart Logic */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical"
            margin={{ left: 0, right: 48, top: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="gradTracker" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="gradClean" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              width={90} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}
              tickFormatter={v => v.length > 14 ? v.slice(0, 12) + '…' : v} 
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />

            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]} 
              barSize={16}
              animationDuration={1000} 
              animationEasing="ease-in-out"
            >
              <LabelList 
                dataKey="count" 
                position="right"
                style={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}
                formatter={val => `[${val}]`} 
              />
              {data.map((entry, i) => (
                <Cell 
                  key={`cell-${i}`}
                  fill={entry.isTracker ? 'url(#gradTracker)' : 'url(#gradClean)'}
                  className="transition-all duration-300"
                  style={{ filter: entry.isTracker ? 'drop-shadow(0 0 8px #ef444455)' : 'drop-shadow(0 0 4px #3b82f633)' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Legend */}
      <div className="mt-4 pt-4 flex justify-between items-center border-t border-white/5 opacity-80">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-red shadow-[0_0_6px_#ef4444]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tracker_Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_6px_#3b82f6]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Clean_Flow</span>
          </div>
        </div>
        <span className="text-[8px] font-mono text-slate-600 uppercase tabular-nums font-black">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default TrackerChart;