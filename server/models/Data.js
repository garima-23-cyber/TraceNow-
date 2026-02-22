const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    // The specific website or endpoint reached (e.g., api.facebook.com)
    domain: {
        type: String,
        required: true,
        index: true
    },
    ip: {
        type: String,
    },
    // Geolocation details for mapping
    location: {
        country: { type: String, default: 'Unknown' },
        city: { type: String, default: 'Unknown' },
        // [latitude, longitude] for plotting on React-Leaflet or Google Maps
        coordinates: { type: [Number], index: '2dsphere' } 
    },
    isTracker: {
        type: Boolean,
        default: false,
    },
    // e.g., 'Advertising', 'Analytics', 'Social Media'
    category: {
        type: String,
        default: 'Unclassified'
    },
    isCrossSiteTracker: {
        type: Boolean,
        default: false,
    },
    // IMPORTANT: Replaced 'user' ObjectId with 'sessionId' 
    // This allows unique tracking per session without a login account.
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    // The 'Red Flag' status based on your privacy score logic
    privacyRiskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    }
}, {
    // Automatically expires data after 24 hours to keep the DB small and fast
    // Perfect for a privacy-focused real-time tool!
    timestamps: true 
});

// Set a TTL (Time To Live) index so data auto-deletes after 1 day
// This reinforces the "Privacy" aspect of your tool
dataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;