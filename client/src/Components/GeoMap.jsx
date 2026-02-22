import React, { useMemo, useEffect, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ANIM_STYLE = `
  @keyframes dashFlow {
    from { stroke-dashoffset: 40; }
    to   { stroke-dashoffset: 0;  }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.8; }
    100% { transform: scale(3.5); opacity: 0;   }
  }
  .geo-flow-line {
    stroke-dasharray: 6 4;
    animation: dashFlow 2s linear infinite;
  }
  .geo-pulse-ring {
    transform-origin: center;
    transform-box: fill-box;
    animation: pulseRing 1.5s ease-out infinite;
  }
`;

// Helper: extract [lon, lat] from ANY location shape the backend might send
// Handles: { coordinates: [lat, lon] }  ← your current backend format
//          { lat, lon }                  ← alternative flat format
//          { latitude, longitude }       ← another alternative
const extractCoords = (loc) => {
  if (!loc) return null;

  // Your backend format: { coordinates: [lat, lon] }
  if (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
    const [lat, lon] = loc.coordinates;
    if (lat == null || lon == null) return null;
    if (lat === 0 && lon === 0) return null;
    return [lon, lat]; // react-simple-maps wants [lon, lat]
  }

  // Flat format fallback: { lat, lon } or { latitude, longitude }
  const lat = loc.lat ?? loc.latitude;
  const lon = loc.lon ?? loc.longitude ?? loc.lng;
  if (lat == null || lon == null) return null;
  if (Number(lat) === 0 && Number(lon) === 0) return null;
  return [Number(lon), Number(lat)];
};

const GeoMap = ({ packets = [] }) => {
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    const tag = document.createElement('style');
    tag.textContent = ANIM_STYLE;
    document.head.appendChild(tag);
    styleInjected.current = true;
  }, []);

  const flows = useMemo(() => {
    const result = packets
      .map(p => {
        const destCoords = extractCoords(p.location);
        if (!destCoords) return null; // skip if no valid destination

        // Source: use sourceLocation if present, else default to India
        const srcCoords = extractCoords(p.sourceLocation) ?? [78.9629, 20.5937];

        return {
          id:         String(p.id ?? Math.random()),
          from:       srcCoords,
          to:         destCoords,
          domain:     p.domain || p.ip || 'Unknown',
          isTracker:  !!p.isTracker,
          originName: p.sourceLocation?.country || 'You',
          targetName: p.location?.country || 'Remote',
        };
      })
      .filter(Boolean) // remove nulls
      .slice(-12);

    console.log('[GeoMap] valid flows:', result.length, result[0]);
    return result;
  }, [packets]);

  const STREAM_COLOR  = '#3b82f6';
  const TRACKER_COLOR = '#ef4444';
  const SAFE_COLOR    = '#22c55e';

  return (
    <div
      className="cyber-card relative overflow-hidden bg-cyber-card backdrop-blur-xl border border-white/5"
      style={{ height: '450px' }}
    >
      {/* Header */}
      <div className="absolute top-4 left-5 z-10 font-mono pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyber-gold animate-ping" />
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">
            Active <span className="text-cyber-gold">Vector_Path</span>
          </h3>
        </div>
        <p className="mt-1 text-[9px] text-cyber-blue font-bold uppercase tracking-widest opacity-80">
          {flows.length > 0
            ? `>> Signal_Lock: ${flows.length} Paths_Traced`
            : '>> Monitoring_Handshakes...'}
        </p>
      </div>

      {/* Map */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ComposableMap
          width={960}
          height={450}
          projectionConfig={{ scale: 145, center: [20, 0] }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#070e23"
                  stroke="#1e293b"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {flows.map((flow, i) => {
            const lineColor = flow.isTracker ? TRACKER_COLOR : STREAM_COLOR;
            const dotColor  = flow.isTracker ? TRACKER_COLOR : SAFE_COLOR;

            return (
              <React.Fragment key={`${flow.id}-${i}`}>
                <Line
                  from={flow.from}
                  to={flow.to}
                  stroke={lineColor}
                  strokeWidth={1.5}
                  className="geo-flow-line"
                  style={{ opacity: 0.6 }}
                />

                {/* Source — your device */}
                <Marker coordinates={flow.from}>
                  <circle r={3} fill="#475569" />
                  <text
                    textAnchor="middle"
                    y={11}
                    style={{ fontSize: '5px', fill: '#94a3b8', fontFamily: 'monospace' }}
                  >
                    {flow.originName.toUpperCase()}
                  </text>
                </Marker>

                {/* Destination — remote server */}
                <Marker coordinates={flow.to}>
                  <circle
                    className="geo-pulse-ring"
                    cx={0} cy={0} r={4}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth={1}
                  />
                  <circle
                    cx={0} cy={0} r={3}
                    fill={dotColor}
                    style={{ filter: `drop-shadow(0 0 4px ${dotColor})` }}
                  />
                  <text
                    textAnchor="middle"
                    y={-9}
                    style={{ fontSize: '6px', fill: '#e2e8f0', fontFamily: 'monospace', fontWeight: 700 }}
                  >
                    {flow.domain.slice(0, 15).toUpperCase()}
                  </text>
                </Marker>
              </React.Fragment>
            );
          })}
        </ComposableMap>
      </div>

      {/* Footer legend */}
      <div className="absolute bottom-4 left-5 right-5 z-10 flex items-center justify-between bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <svg width="16" height="4" style={{ overflow: 'visible' }}>
              <line x1="0" y1="2" x2="16" y2="2" stroke={STREAM_COLOR} strokeWidth="2" strokeDasharray="4 2" />
            </svg>
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Outbound_Stream</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="4" style={{ overflow: 'visible' }}>
              <line x1="0" y1="2" x2="16" y2="2" stroke={TRACKER_COLOR} strokeWidth="2" strokeDasharray="4 2" />
            </svg>
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Tracker_Vector</span>
          </div>
        </div>
        <span className="hidden md:block text-[8px] font-mono text-cyber-blue opacity-50 animate-pulse uppercase tracking-tighter italic">
          Global_Grid_Sync: Online
        </span>
      </div>
    </div>
  );
};

export default GeoMap;