const fs = require('fs');
const path = require('path');

// This set stays in the server's RAM for O(1) lightning-fast lookups
let trackerCache = new Set();

/**
 * Loads trackers from a local JSON file into memory.
 * Call this in your server.js or when the service starts.
 */
const initializeTrackerCache = () => {
  try {
    // We move the tracker list to a local JSON file
    const filePath = path.join(__dirname, '../data/trackers.json');
    
    // Check if file exists, if not, create a basic one to prevent crashes
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ trackers.json not found. Creating a default list...');
      const defaultTrackers = ["doubleclick.net", "google-analytics.com", "facebook.com"];
      fs.writeFileSync(filePath, JSON.stringify(defaultTrackers, null, 2));
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const trackers = JSON.parse(rawData);
    
    // Map to lowercase and store in a Set for fast searching
    trackerCache = new Set(trackers.map(domain => domain.toLowerCase()));
    
    console.log(`✅ Loaded ${trackerCache.size} trackers into memory cache.`);
  } catch (error) {
    console.error('❌ Failed to initialize tracker cache:', error.message);
  }
};

/**
 * Instant lookup to check if a domain is a known tracker.
 * No database query involved during live Wireshark capture!
 */
const isKnownTracker = (domain) => {
  if (!domain || domain === 'Unknown') return false;
  
  // Clean the domain (remove trailing dots or whitespace)
  const cleanDomain = domain.toLowerCase().trim();
  
  // Direct Set lookup is significantly faster than a DB query
  return trackerCache.has(cleanDomain);
};

// Auto-initialize when the file is required by other parts of the app
initializeTrackerCache();

module.exports = {
  isKnownTracker,
  initializeTrackerCache // Exported in case you want to refresh it live
};