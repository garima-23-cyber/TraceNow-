import React, { useMemo, useRef, useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

const NetworkGraph = ({ packets = [] }) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 550 });

  // Measure container for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth > 0 && offsetHeight > 0)
        setDimensions({ width: offsetWidth, height: offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Pull camera back for an aesthetic view
  useEffect(() => {
    const t = setTimeout(() =>
      fgRef.current?.cameraPosition({ z: 400 }, { x: 0, y: 0, z: 0 }, 1000)
    , 1500);
    return () => clearTimeout(t);
  }, [dimensions]);

  const graphData = useMemo(() => {
    // Using your tailwind-config defined hex codes directly or via THEME object
    const THEME = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e' };
    
    const nodes = [{ id: "ME", name: "Local Machine", val: 20, color: THEME.blue, fx: 0, fy: 0, fz: 0 }];
    const links = [];
    const seen = new Set(["ME"]);

    [...packets].slice(0, 40).forEach(pkt => {
      const nodeId = pkt.domain || pkt.ip;
      if (!nodeId) return;

      if (!seen.has(nodeId)) {
        nodes.push({
          id: nodeId, 
          name: nodeId,
          val: pkt.isTracker ? 14 : 9,
          color: pkt.isTracker ? THEME.red : THEME.green,
          isTracker: !!pkt.isTracker,
        });
        seen.add(nodeId);
      }

      links.push({ 
        source: "ME", 
        target: nodeId,
        color: pkt.isTracker ? THEME.red : THEME.green 
      });
    });

    return { nodes, links };
  }, [packets]);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 1)
      fgRef.current.d3ReheatSimulation();
  }, [graphData]);

  const secureCount = graphData.nodes.filter(n => !n.isTracker && n.id !== "ME").length;
  const threatCount = graphData.nodes.filter(n => n.isTracker).length;

  return (
    <div ref={containerRef} className="w-full h-full min-h-[550px] relative bg-cyber-bg rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
      
      {/* Aesthetic HUD Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <span className="text-white text-xs font-black tracking-[0.3em] uppercase italic">
            NEURAL <span className="text-cyber-gold">TRADE_WEB</span>
          </span>
        </div>
        
        <div className="bg-cyber-card/80 backdrop-blur-xl p-4 border border-white/10 rounded-xl min-w-[160px] shadow-2xl">
          <div className="space-y-1.5">
            <p className="text-cyber-blue text-[10px] font-bold flex justify-between uppercase">
              <span>Status:</span> 
              <span className="animate-pulse">{graphData.nodes.length > 1 ? "ACTIVE" : "SCANNING"}</span>
            </p>
            <p className="text-cyber-green text-[10px] font-bold flex justify-between uppercase">
              <span>Secure:</span> <span>{secureCount}</span>
            </p>
            <p className="text-cyber-red text-[10px] font-bold flex justify-between uppercase">
              <span>Threats:</span> <span>{threatCount}</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-[8px] text-slate-500 font-black uppercase">
            <span>Nodes: {graphData.nodes.length}</span>
            <span>Links: {graphData.links.length}</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {graphData.nodes.length === 1 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">
            Establishing Neural Uplink...
          </p>
        </div>
      )}

      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#020617"
        showNavInfo={false}
        
        // --- CUSTOM GLOWING OBJECTS ---
        nodeThreeObject={node => {
          const geometry = node.id === "ME" 
            ? new THREE.OctahedronGeometry(node.val / 1.5) 
            : new THREE.SphereGeometry(node.val / 2, 20, 20);
          
          const material = new THREE.MeshPhongMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.8,
            emissive: node.color,
            emissiveIntensity: 0.6,
            shininess: 100
          });
          
          return new THREE.Mesh(geometry, material);
        }}
        
        nodeLabel="name"
        linkWidth={1.2}
        linkColor={l => l.color}
        linkDirectionalParticles={3}
        linkDirectionalParticleSpeed={0.02}
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleColor={l => l.color}
        
        // Physics and Interactions
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTime={3000}
        controlType="orbit"
      />
    </div>
  );
};

export default NetworkGraph;