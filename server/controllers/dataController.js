const Data = require('../models/Data');
const BehavioralLog = require('../models/BehavioralLog');
const mongoose = require('mongoose');

/**
 * Saves a new packet data point.
 * Now uses sessionId instead of user ID.
 */
const saveData = async (data) => {
  const { domain, ip, location, isTracker, category, isCrossSiteTracker, sessionId } = data;
  try {
    const newData = new Data({
      domain,
      ip,
      location, // Includes country and coordinates
      isTracker,
      category,
      isCrossSiteTracker,
      sessionId, // Use session instead of user
    });
    return await newData.save();
  } catch (err) {
    console.error('Error saving data:', err.message);
    return null;
  }
};

/**
 * Fetches recent history for the current session map/list.
 */
const getHistory = async (req, res) => {
  const { sessionId } = req.query; // Session passed via query string
  const limit = parseInt(req.query.limit) || 50;

  if (!sessionId) return res.status(400).json({ message: 'Session ID required' });

  try {
    const history = await Data.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session data' });
  }
};

/**
 * Aggregates the top 10 trackers found in the current session.
 */
const getTopTrackers = async (req, res) => {
  const { sessionId } = req.query;
  try {
    const topTrackers = await Data.aggregate([
      { $match: { isTracker: true, sessionId: sessionId } },
      { $group: { 
          _id: '$domain', 
          count: { $sum: 1 },
          country: { $first: '$location.country' } // Shows which country owns the tracker
      } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(topTrackers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top trackers' });
  }
};

/**
 * Reports domains seen across multiple hosts for the current session.
 */
const getBehavioralReport = async (req, res) => {
  const { sessionId } = req.query;
  try {
    const report = await BehavioralLog.find({ 
      sessionId: sessionId, 
      hostCount: { $gt: 1 } 
    })
    .sort({ updatedAt: -1 })
    .limit(20);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching behavioral report' });
  }
};

/**
 * Deletes all data for a specific session (useful for a 'Clear Data' button).
 */
const clearSessionData = async (req, res) => {
  const { sessionId } = req.params;
  try {
    await Data.deleteMany({ sessionId });
    await BehavioralLog.deleteMany({ sessionId });
    res.json({ message: 'Session data cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing session' });
  }
};

module.exports = {
  saveData,
  getHistory,
  getTopTrackers,
  getBehavioralReport,
  clearSessionData, // Replaces update/delete single entry for better UX
};