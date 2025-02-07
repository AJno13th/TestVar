const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const deckController = require('../controllers/deckController');

// Get all decks
router.get('/', authMiddleware, deckController.getAllDecks);

// Create a new deck
router.post('/', authMiddleware, deckController.addDeck);

// New route for rating a deck
router.post('/:deckId/rate', authMiddleware, deckController.rateDeck);

module.exports = router;