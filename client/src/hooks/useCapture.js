// src/hooks/useCapture.js
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { socket, connectSocket } from '../api/socket';
import { startCaptureApi, stopCaptureApi } from '../api/axios';
import { enrichPacket, calculatePrivacyScore, buildThreatDesc } from '../utils/packetEnricher';

const SESSION_ID  = 'trace_node_01';
const MAX_PACKETS = 60;

export function useCapture() {
  const [isCapturing, setIsCapturing]           = useState(false);
  const [packets, setPackets]                   = useState([]);
  const [totalIntercepted, setTotalIntercepted] = useState(0);
  const [score, setScore]                       = useState(100);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const seenCounts      = useRef(new Map());
  const listenersActive = useRef(false);

  useEffect(() => {
    connectSocket(SESSION_ID);
    if (listenersActive.current) return;
    listenersActive.current = true;

    socket.on('connect',       () => setConnectionStatus('connected'));
    socket.on('disconnect',    () => setConnectionStatus('disconnected'));
    socket.on('connect_error', () => setConnectionStatus('error'));

    const handlePacket = (raw) => {
      const enriched = enrichPacket(raw, seenCounts.current);
      if (!enriched) return;
      // Forensic Filter: Check for invalid or "Null Island" coordinates
      const lat = enriched.location?.lat;
      const lon = enriched.location?.lon;
      
      if (lat === 0 && lon === 0) {
        enriched.location.country = "Obfuscated / VPN";
        // Optional: Re-route to a "neutral" visual spot if needed
      }
      setTotalIntercepted(prev => prev + 1);
      setPackets(prev => {
        const next = [enriched, ...prev].slice(0, MAX_PACKETS);
        setScore(calculatePrivacyScore(next));
        return next;
      });
    };

    const handleScoreUpdate = (data) => {
      if (data?.privacyScore > 0) setScore(data.privacyScore);
    };

    socket.on('new_packet',   handlePacket);
    socket.on('score_update', handleScoreUpdate);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('new_packet',   handlePacket);
      socket.off('score_update', handleScoreUpdate);
      listenersActive.current = false;
    };
  }, []);

  const toggleCapture = useCallback(async () => {
    try {
      if (!isCapturing) {
        setPackets([]);
        setTotalIntercepted(0);
        setScore(100);
        seenCounts.current = new Map();
        const res = await startCaptureApi(SESSION_ID);
        if (res.status === 200 || res.status === 201) setIsCapturing(true);
      } else {
        await stopCaptureApi(SESSION_ID);
        setIsCapturing(false);
      }
    } catch (err) {
      if (err.response?.status === 409) setIsCapturing(true);
    }
  }, [isCapturing]);

  // All traffic by frequency — chart is never empty
  const chartData = useMemo(() => {
    const counts = {};
    packets.forEach(p => {
      const key = p.domain || p.ip || 'Unknown';
      if (!counts[key]) counts[key] = { name: key, count: 0, isTracker: p.isTracker };
      counts[key].count += 1;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 7);
  }, [packets]);

  // Unique threats only — deduplicated by identifier
  const behavioralPatterns = useMemo(() => {
    const seen = new Set();
    return packets
      .filter(p => p.isTracker && p.trackerType)
      .filter(p => { if (seen.has(p.identifier)) return false; seen.add(p.identifier); return true; })
      .map((p, idx) => ({
        id: `${p.identifier}-${idx}`,
        type: p.trackerType,
        risk: p.risk,
        domain: p.domain || p.ip,
        desc: buildThreatDesc(p),
        timestamp: p.timestamp,
      }))
      .slice(0, 10);
  }, [packets]);

  const uniqueTrackerCount = useMemo(
    () => new Set(packets.filter(p => p.isTracker).map(p => p.identifier)).size,
    [packets]
  );

  return {
    isCapturing, packets, totalIntercepted, score, connectionStatus,
    toggleCapture, chartData, behavioralPatterns, uniqueTrackerCount,
    sessionId: SESSION_ID,
  };
}