const mongoose = require("mongoose");

const behavioralLogSchema = new mongoose.Schema({
    // The domain identified as a cross-site tracker (e.g., doubleclick.net)
    domain: {
        type: String,
        required: true,
        trim: true,
        index: true // Indexed for faster lookups during live capture
    },
    // Instead of a User ID, use a Session ID (generated when they click 'Start Capture')
    // This allows the data to exist only for the duration of their visit.
    sessionId: {
        type: String,
        required: true,
    },
    // The source IP or a temporary identifier for the user's current session
    clientIdentifier: {
        type: String,
        default: "Anonymous Guest"
    },
    // Array of hosts (sites the user visited) that contacted this tracker domain
    hosts: [{
        hostName: {
            type: String,
            required: true,
        },
        firstSeen: {
            type: Date,
            default: Date.now,
        },
    }],
    // Count of unique sites tracking the user through this domain
    hostCount: {
        type: Number,
        default: 0,
    },
    // Optional: Add Geolocation data of where the tracker is located
    trackerLocation: {
        country: String,
        coordinates: [Number], // [Lat, Long]
    }
}, { 
    timestamps: true // Automatically manages createdAt and updatedAt
});

// Create a compound index to quickly find if a tracker exists for a specific session
behavioralLogSchema.index({ domain: 1, sessionId: 1 });

module.exports = mongoose.model("BehavioralLog", behavioralLogSchema);