// Configuration for scoring logic
const SCORE_CONFIG = {
  initialScore: 100,
  thirdPartyPenalty: 5,
  trackerPenalty: 10,
  unencryptedPenalty: 20, // Added: Penalty for HTTP vs HTTPS
};

/**
 * Updates a temporary session object instead of a database user.
 * @param {Object} currentStats - The current state of the live capture
 * @param {Object} packetData - Data parsed from Wireshark/TShark
 */
const updateLivePrivacyScore = (currentStats, packetData) => {
  // If first time, initialize the stats object
  if (!currentStats || Object.keys(currentStats).length === 0) {
    currentStats = {
      privacyScore: SCORE_CONFIG.initialScore,
      trackersFound: 0,
      thirdPartyConnections: 0,
      isRedFlag: false
    };
  }

  // 1. Logic for Third Party Connections
  currentStats.thirdPartyConnections += 1;
  currentStats.privacyScore -= SCORE_CONFIG.thirdPartyPenalty;

  // 2. Logic for Trackers (Compare packetData.domain against a blacklist)
  if (packetData.isTracker) {
    currentStats.trackersFound += 1;
    currentStats.privacyScore -= SCORE_CONFIG.trackerPenalty;
  }

  // 3. Logic for "Red Flag" (e.g., if data is unencrypted/Port 80)
  if (packetData.protocol === 'HTTP' || packetData.port === 80) {
    currentStats.privacyScore -= SCORE_CONFIG.unencryptedPenalty;
    currentStats.isRedFlag = true; 
  }

  // Ensure score stays between 0 and 100
  currentStats.privacyScore = Math.max(0, Math.min(100, currentStats.privacyScore));

  return currentStats;
};

/**
 * Returns a fresh state for a new "Start Capture" click
 */
const getInitialSessionState = () => ({
  privacyScore: 100,
  trackersFound: 0,
  thirdPartyConnections: 0,
  isRedFlag: false,
  capturedPackets: []
});

module.exports = {
  updateLivePrivacyScore,
  getInitialSessionState,
};