import React from 'react';
import { ShieldAlert, Terminal, Globe, Lock, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ForensicActionGuide = ({ suspiciousPkt }) => {
  if (!suspiciousPkt) return null;

  const steps = [
    {
      title: "Verify Reputation",
      desc: `Analyze ${suspiciousPkt.ip} via global threat intelligence.`,
      icon: <Globe size={16} />,
      link: `https://www.abuseipdb.com/check/${suspiciousPkt.ip}`,
      status: "REQUIRED"
    },
    {
      title: "Isolate Connection",
      desc: "Terminate session to prevent further metadata harvesting.",
      icon: <Lock size={16} />,
      status: "PENDING"
    },
    {
      title: "Block Target IP",
      desc: "Enforce firewall rules to drop future inbound traffic.",
      icon: <Terminal size={16} />,
      command: `sudo iptables -A INPUT -s ${suspiciousPkt.ip} -j DROP`,
      status: "CRITICAL"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="cyber-card p-6 border-l-4 border-l-cyber-red bg-cyber-card backdrop-blur-xl h-full shadow-neon-blue/10"
    >
      {/* 1. Forensic Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-red/20 border border-cyber-red/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="text-cyber-red animate-pulse" size={20} />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase italic tracking-tighter">Mitigation_Roadmap</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Target: {suspiciousPkt.ip || suspiciousPkt.domain}</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[8px] font-mono text-cyber-red uppercase font-black animate-pulse">Live_Threat_Detected</span>
        </div>
      </div>

      {/* 2. Roadmap Steps */}
      <div className="relative space-y-8">
        {/* The Connective Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-cyber-red via-white/10 to-transparent" />

        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="relative pl-10 group"
          >
            {/* Roadmap Node Dot */}
            <div className="absolute left-[11px] top-1 h-2.5 w-2.5 rounded-full bg-cyber-bg border-2 border-cyber-red z-10 shadow-[0_0_8px_rgba(239,68,68,0.5)] group-hover:scale-125 transition-transform" />
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-cyber-red/80">{step.icon}</span>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{step.title}</h4>
              </div>
              <span className={`text-[7px] px-1.5 py-0.5 rounded font-black tracking-widest border ${
                step.status === 'CRITICAL' ? 'bg-cyber-red/10 text-cyber-red border-cyber-red/30' : 'bg-white/5 text-slate-500 border-white/10'
              }`}>
                {step.status}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-mono leading-relaxed mb-3 max-w-[280px]">
              {step.desc}
            </p>
            
            {/* Contextual Action Elements */}
            <div className="flex flex-col gap-2">
                {step.link && (
                <a href={step.link} target="_blank" rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-[9px] text-cyber-blue font-bold uppercase hover:text-white transition-colors w-fit bg-cyber-blue/10 px-2 py-1 rounded border border-cyber-blue/20">
                    Execute Reputation_Check <ExternalLink size={10} />
                </a>
                )}
                
                {step.command && (
                <div className="relative group/cmd">
                    <div className="bg-black/60 p-2 rounded-md font-mono text-[9px] text-cyber-red border border-cyber-red/20 pr-8">
                        {step.command}
                    </div>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                        <Terminal size={10} />
                    </button>
                </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Terminal Footer Footer */}
      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-60">
        <span className="text-[8px] font-mono text-slate-600 uppercase">Protocol: ISO_27001_COMPLIANT</span>
        <ChevronRight size={12} className="text-cyber-red animate-bounce" />
      </div>
    </motion.div>
  );
};

export default ForensicActionGuide;