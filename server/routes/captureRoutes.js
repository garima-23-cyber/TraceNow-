const express = require('express');
const { startCapture, stopCapture } = require('../controllers/captureController');
const router = express.Router();

// Removed 'auth' and 'isUser' middlewares to allow immediate access
// The frontend will now pass a sessionId in the request body
router.post('/start', startCapture);
router.post('/stop', stopCapture);

module.exports = router;