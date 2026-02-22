const express = require('express');
const router = express.Router();
const { getHistory, getTopTrackers, getBehavioralReport, clearSessionData } = require('../controllers/dataController');

// Notice: No auth middleware here! 
router.get('/history', getHistory);
router.get('/top-trackers', getTopTrackers);
router.get('/behavioral-report', getBehavioralReport);
router.delete('/session/:sessionId', clearSessionData);

module.exports = router;