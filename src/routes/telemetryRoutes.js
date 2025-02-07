const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const telemetryController = require('../controllers/telemetryController');

// Log telemetry data
router.post('/log', authMiddleware, telemetryController.logTelemetry);

// Get telemetry data for a specific deck
router.get('/deck/:deckId', authMiddleware, telemetryController.getTelemetryForDeck);

// Get all telemetry data for the user
router.get('/user', authMiddleware, telemetryController.getTelemetryForUser);

// Delete a specific telemetry entry
router.delete('/:telemetryId', authMiddleware, telemetryController.deleteTelemetry);

module.exports = router;