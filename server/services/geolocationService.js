const geoip = require('geoip-lite');

// Your device's home location — used as the source for all outbound connections.
// Update these coords to match your actual server/device location.
const HOME_LOCATION = {
  lat: 20.5937,
  lon: 78.9629,
  country: 'India',
  city: 'Local'
};

/**
 * Returns geo data for a given IP address.
 * Always returns { lat, lon, country, city, isLocal }.
 */
exports.getGeoData = (ip) => {
  const isPrivate =
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||   // 172.20–172.29
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('fe80:') ||
    ip.startsWith('::ffff:127.') || // IPv4-mapped loopback
    ip === '0.0.0.0';

  if (isPrivate) {
    return {
      ...HOME_LOCATION,
      isLocal: true
    };
  }

  const geo = geoip.lookup(ip);

  if (!geo || !geo.ll || geo.ll[0] === 0 && geo.ll[1] === 0) {
    // FIX: Return null so callers can filter out unknown locations
    // instead of plotting bogus markers at (0,0) in the ocean
    return null;
  }

  return {
    city: geo.city || 'Unknown City',
    country: geo.country || 'Unknown',
    // FIX: Explicit lat/lon properties — frontend expects these exact names
    lat: geo.ll[0],   // ll[0] = latitude
    lon: geo.ll[1],   // ll[1] = longitude
    timezone: geo.timezone || null,
    isLocal: false
  };
};

/**
 * Builds a full packet object with both location (remote) and
 * sourceLocation (your device) attached — required by GeoMap.jsx.
 *
 * Usage in your packet capture/processing code:
 *   const packet = buildPacket({ id, ip, domain, isTracker, ... });
 *   if (packet) io.emit('packet', packet);
 */
exports.buildPacket = ({ id, ip, domain, isTracker, ...rest }) => {
  const location = exports.getGeoData(ip);

  // FIX: Skip packets where geo lookup failed (avoids null-island markers)
  if (!location) return null;

  return {
    id: id || `${Date.now()}-${Math.random()}`,
    ip,
    domain: domain || ip,
    isTracker: isTracker || false,

    // Remote server location — where data is going TO
    location,

    // FIX: sourceLocation is now always attached so GeoMap.jsx
    // can draw lines from your device → remote server
    sourceLocation: HOME_LOCATION,

    ...rest
  };
};
