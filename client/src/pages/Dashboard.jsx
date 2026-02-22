// src/pages/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import Sidebar from '../Components/Sidebar';
import TopStats from '../Components/TopStats';
import PrivacyScore from '../Components/PrivacyScore';
import TrackerChart from '../Components/TrackerChart';
import NetworkGraph from '../Components/NetworkGraph';
import GeoMap from '../Components/GeoMap';
import BehavioralReport from '../Components/BehavioralReport';
import ForensicActionGuide from '../Components/ForensicActionGuide';
import { WifiOff } from 'lucide-react';

const Dashboard = ({ capture }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    isCapturing, packets, totalIntercepted, score,
    connectionStatus, toggleCapture, chartData,
    behavioralPatterns, uniqueTrackerCount,
  } = capture;

  const isDisconnected = connectionStatus !== 'connected';

  const latestThreat = useMemo(() => {
    return packets.find(p => p.isTracker === true || p.risk === 'CRITICAL' || p.risk === 'HIGH');
  }, [packets]);

  return (
    /* FIX: Ensure the outer flex container fills the parent provided by App.jsx */
    <div className="flex h-full w-full bg-cyber-bg text-white font-sans overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCapturing={isCapturing} 
      />

      {/* FIX 1: Removed lg:ml-64. 
          Since Sidebar is now part of the flex flow (static), 
          main will naturally take the remaining width. 
      */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-500 ${isDisconnected ? 'grayscale-[0.5] opacity-80' : ''}`}>
        
        {/* Top Header HUD */}
        <div className="p-4 lg:p-6 pb-2 shrink-0 border-b border-white/5 bg-black/20">
          <div className="max-w-[1400px] mx-auto w-full">
            <TopStats 
              isCapturing={isCapturing}
              toggleCapture={toggleCapture}
              packetCount={totalIntercepted}
              trackerCount={uniqueTrackerCount}
              score={score}
            />
          </div>
        </div>

        {/* Main Operational Theater */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {isDisconnected && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <div className="cyber-card p-8 border-red-500/50 flex flex-col items-center text-center max-w-sm shadow-2xl">
                <WifiOff className="text-red-500 mb-4 animate-pulse" size={48} />
                <h3 className="text-xl font-black uppercase tracking-tighter text-red-500">Uplink Lost</h3>
                <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed">
                  The forensic engine has lost connection to the backend. Attempting to re-establish handshake...
                </p>
              </div>
            </div>
          )}

          {/* FIX 2: max-w-[1400px] is standard for dashboards. 
              Using flex flex-col and justify-center to keep things centered vertically if possible.
          */}
          <div className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-[1400px] mx-auto w-full">
              
              {/* A. OVERVIEW (The Nerve Center) */}
              <div className={`${activeTab === 'overview' ? 'grid' : 'hidden'} grid-cols-1 lg:grid-cols-12 gap-6 items-start`}>
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <PrivacyScore score={score} />
                  <div className="h-[380px] bg-cyber-navy/20 rounded-[2rem] border border-white/5 p-4 shadow-inner">
                     <TrackerChart data={chartData} />
                  </div>
                </div>
                <div className="lg:col-span-8 bg-cyber-navy/40 rounded-[2rem] h-[600px] lg:h-[750px] border border-white/5 shadow-2xl overflow-hidden relative">
                  <NetworkGraph packets={packets} />
                </div>
              </div>

              {/* B. GEOSPATIAL */}
              {activeTab === 'geo' && (
                <div className="h-[78vh] w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-in zoom-in-95 duration-500">
                  <GeoMap packets={packets} />
                </div>
              )}

              {/* C. ANALYTICS */}
              {activeTab === 'tracker' && (
                <div className="bg-cyber-card backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl min-h-[70vh] animate-in slide-in-from-left-8 duration-500">
                  <div className="mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-cyber-gold">Distribution_Analytics</h3>
                    <p className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">Node profiling by packet frequency</p>
                  </div>
                  <div className="h-[55vh]">
                    <TrackerChart data={chartData} />
                  </div>
                </div>
              )}

              {/* D. LOGS */}
              {activeTab === 'logs' && (
                <div className="max-w-5xl mx-auto min-h-[80vh] animate-in slide-in-from-right-8 duration-500">
                   <BehavioralReport patterns={behavioralPatterns} />
                </div>
              )}

              {/* E. FORENSIC GUIDE */}
              {activeTab === 'forensic' && (
                <div className="max-w-4xl mx-auto pt-6 animate-in fade-in scale-95 duration-500">
                  {latestThreat ? (
                    <ForensicActionGuide suspiciousPkt={latestThreat} />
                  ) : (
                    <div className="cyber-card p-20 text-center border-dashed border-white/10 opacity-50 flex flex-col items-center justify-center">
                       <div className="h-1 w-20 bg-slate-800 mb-6 rounded-full" />
                       <p className="text-xs font-mono uppercase tracking-[0.5em]">Environmental Integrity Confirmed: No Mitigation Required</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;