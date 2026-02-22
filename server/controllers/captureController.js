const { spawn } = require('child_process');
const { updateLivePrivacyScore, getInitialSessionState } = require('../services/privacyScore');
const { analyzeBehavioralPatterns } = require('../services/behavioralDetection');
const { isKnownTracker, initializeTrackerCache } = require('../services/trackerService');
const { getGeoData } = require('../services/geolocationService');
const { saveData } = require('./dataController');

let tsharkProcess = null;
let ioInstance = null;

const tsharkPath = process.env.TSHARK_PATH || 'tshark';
const interfaceName = process.env.NETWORK_INTERFACE || '5'; 

initializeTrackerCache();

const setIoInstance = (io) => { ioInstance = io; };

const startCapture = (req, res) => {
    const { sessionId } = req.body; 
    
    if (!sessionId) {
        return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    if (tsharkProcess && !tsharkProcess.killed) {
        return res.status(409).json({ success: false, message: 'Capture already running.' });
    }

    let sessionStats = getInitialSessionState();

    try {
        const tsharkArgs = [
            '-i', interfaceName,
            '-T', 'json',
            '-l',
            '-n',
            '-f', 'udp port 53 or tcp port 443', 
            '-e', 'ip.dst',
            '-e', 'dns.resp.name',
            '-e', 'tls.handshake.extensions_server_name',
            '-e', 'http.host',
        ];

        console.log(`🚀 Starting Forensic Engine on Interface ${interfaceName}...`);
        tsharkProcess = spawn(tsharkPath, tsharkArgs);

        let tsharkBuffer = '';

        tsharkProcess.stdout.on('data', (data) => {
            tsharkBuffer += data.toString();

            let startIdx;
            while ((startIdx = tsharkBuffer.indexOf('  {')) !== -1) {
                let endIdx = tsharkBuffer.indexOf('  },', startIdx);
                if (endIdx === -1) endIdx = tsharkBuffer.indexOf('  }\n]', startIdx);
                if (endIdx === -1) break;

                const jsonStr = tsharkBuffer.substring(startIdx, endIdx + 3).trim().replace(/,$/, '');
                tsharkBuffer = tsharkBuffer.substring(endIdx + 3);

                try {
                    const packet = JSON.parse(jsonStr);
                    const layers = packet._source?.layers;
                    if (!layers) continue;

                    // 1. Data Extraction & Normalization
                    const destIp = layers['ip.dst']?.[0];
                    const destDomain = 
                        layers['tls.handshake.extensions_server_name']?.[0] || 
                        layers['dns.resp.name']?.[0] || 
                        layers['http.host']?.[0] || 
                        destIp || 'Unknown';

                    if (destDomain === 'Unknown') continue;

                    // 2. High-Performance Analysis
                    const trackerInfo = isKnownTracker(destDomain);
                    const geoInfo = getGeoData(destIp);
                    const behavior = analyzeBehavioralPatterns({ domain: destDomain });

                    const dataPayload = {
                        sessionId,
                        domain: destDomain,
                        ip: destIp,
                        location: {
                            country: geoInfo?.country || "Unknown",
                            city: geoInfo?.city || "Unknown",
                            // 🔥 CRITICAL FIX: MongoDB GeoJSON [Longitude, Latitude]
                            coordinates: [
                                parseFloat(geoInfo?.lon || 0), 
                                parseFloat(geoInfo?.lat || 0)
                            ] 
                        },
                        isTracker: trackerInfo,
                        isCrossSiteTracker: behavior.isCrossSiteTracker,
                        timestamp: new Date()
                    };

                    // 3. Update Real-time Privacy Score
                    sessionStats = updateLivePrivacyScore(sessionStats, dataPayload);

                    // 4. Emit to Frontend (Socket.io)
                    if (ioInstance) {
                        console.log(`📡 Emitting packet: ${destDomain}`);
                        ioInstance.to(sessionId).emit('new_packet', dataPayload);
                        ioInstance.to(sessionId).emit('score_update', sessionStats);
                    }

                    // 5. Database Persistence
                    saveData(dataPayload).catch(err => {
                        console.error(`❌ DB Error for ${destDomain}:`, err.message);
                    });

                } catch (err) {
                    // Ignore partial JSON chunks
                }
            }

            // Memory Safety: Prevent buffer from growing infinitely if parsing fails
            if (tsharkBuffer.length > 1000000) tsharkBuffer = ''; 
        });

        tsharkProcess.stderr.on('data', (err) => {
            console.error(`[TSHARK_DEBUG]: ${err.toString()}`);
        });

        return res.json({ success: true, message: `Interface ${interfaceName} Interception Active.` });
    } catch (error) {
        console.error("Critical Engine Failure:", error);
        return res.status(500).json({ success: false, message: 'Tshark failed to start.' });
    }
};

const stopCapture = (req, res) => {
    if (tsharkProcess) {
        console.log("🛑 Terminating Interception...");
        tsharkProcess.kill('SIGINT');
        tsharkProcess = null;
        return res.json({ success: true, message: 'Capture stopped.' });
    }
    return res.status(404).json({ message: 'No active session.' });
};

module.exports = { startCapture, stopCapture, setIoInstance };