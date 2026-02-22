// src/utils/packetEnricher.js
import {
  KNOWN_TRACKER_DOMAINS, CROSS_SITE_DOMAINS, FINGERPRINTING_DOMAINS,
  TRACKER_IP_PREFIXES, SAFE_IPS, FREQUENCY_ANOMALY_THRESHOLD,
} from '../data/trackerDb';

export function enrichPacket(raw, seenCounts) {
  let ip = null, domain = null, location = null, timestamp = Date.now();

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed);
    if (isIp) ip = trimmed; else domain = trimmed;
  } else if (raw && typeof raw === 'object') {
    ip        = raw.ip || null;
    domain    = (raw.domain && raw.domain !== 'Unknown') ? raw.domain : null;
    location  = raw.location || null;
    timestamp = raw.timestamp || Date.now();
  } else {
    return null;
  }

  const identifier = domain || ip;
  if (!identifier) return null;

  if (ip && SAFE_IPS.has(ip)) {
    return { ip, domain, identifier, location, timestamp, isTracker: false,
      isCrossSiteTracker: false, isFingerprinting: false, risk: 'Low',
      trackerType: 'DNS Query', hitCount: 1 };
  }

  const prevCount = seenCounts.get(identifier) || 0;
  const hitCount  = prevCount + 1;
  seenCounts.set(identifier, hitCount);

  const domainLower          = (domain || '').toLowerCase();
  const isKnownTrackerDomain = KNOWN_TRACKER_DOMAINS.some(t => domainLower.includes(t));
  const isKnownTrackerIp     = TRACKER_IP_PREFIXES.some(p => (ip || '').startsWith(p));
  const isCrossSiteTracker   = CROSS_SITE_DOMAINS.some(t => domainLower.includes(t));
  const isFingerprinting     = FINGERPRINTING_DOMAINS.some(t => domainLower.includes(t));
  const isFrequencyAnomaly   = hitCount >= FREQUENCY_ANOMALY_THRESHOLD;

  const isTracker = isKnownTrackerDomain || isKnownTrackerIp
    || isCrossSiteTracker || isFingerprinting || isFrequencyAnomaly;

  let risk = 'Low';
  if (isFingerprinting || isCrossSiteTracker)        risk = 'CRITICAL';
  else if (isKnownTrackerDomain || isKnownTrackerIp) risk = 'High';
  else if (isFrequencyAnomaly)                        risk = 'Medium';

  let trackerType = null;
  if (isFingerprinting)                              trackerType = 'Fingerprinting';
  else if (isCrossSiteTracker)                       trackerType = 'Cross-Site Tracking';
  else if (isKnownTrackerDomain || isKnownTrackerIp) trackerType = 'Behavioral Profiling';
  else if (isFrequencyAnomaly)                       trackerType = 'Frequency Anomaly';

  return { ip, domain, identifier, location, timestamp,
    isTracker, isCrossSiteTracker, isFingerprinting, risk, trackerType, hitCount };
}

export function calculatePrivacyScore(packets) {
  if (!packets.length) return 100;
  const uniqueTrackers = new Set(packets.filter(p => p.isTracker).map(p => p.identifier));
  const critical = packets.filter(p => p.risk === 'CRITICAL').length;
  const high     = packets.filter(p => p.risk === 'High').length;
  const medium   = packets.filter(p => p.risk === 'Medium').length;
  const deduction = (uniqueTrackers.size * 6) + (critical * 3) + (high * 1.5) + (medium * 0.5);
  return Math.max(5, Math.round(100 - deduction));
}

export function buildThreatDesc(p) {
  if (p.isFingerprinting)
    return `Device fingerprinting attempt detected from ${p.domain || p.ip}`;
  if (p.isCrossSiteTracker)
    return `Cross-site tracking beacon intercepted from ${p.domain || p.ip}`;
  if (p.trackerType === 'Frequency Anomaly')
    return `High-frequency beacon: ${p.identifier} pinged ${p.hitCount}x this session`;
  return `Known tracker handshake from ${p.domain || p.ip}`;
}