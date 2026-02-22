// This object stays in the server's RAM during the capture session.
// It maps a "Domain" to a Set of "Hosts" that have called it.
let sessionTracker = new Map();

/**
 * Identifies if a domain is acting as a cross-site tracker.
 * No Database required; works in real-time memory.
 */
const analyzeBehavioralPatterns = (packetData) => {
    const { domain, host } = packetData;
    let isCrossSiteTracker = false;

    // We need both the destination (domain) and the source site (host)
    if (!domain || !host) {
        return { isCrossSiteTracker };
    }

    // Initialize the tracking set for this domain if it doesn't exist
    if (!sessionTracker.has(domain)) {
        sessionTracker.set(domain, new Set());
    }

    // Add the current host to the set of hosts that have contacted this domain
    const seenHosts = sessionTracker.get(domain);
    seenHosts.add(host);

    // If this domain has been contacted by more than one unique host, 
    // it is behaving like a cross-site tracker.
    if (seenHosts.size > 1) {
        isCrossSiteTracker = true;
    }

    return { 
        isCrossSiteTracker, 
        occurrenceCount: seenHosts.size,
        seenAt: Array.from(seenHosts) 
    };
};

/**
 * Clears the memory when the user stops the capture or starts a new one.
 */
const resetBehavioralSession = () => {
    sessionTracker.clear();
};

module.exports = {
    analyzeBehavioralPatterns,
    resetBehavioralSession
};