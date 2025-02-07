const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const flashcardController = require('../controllers/flashcardController');

// Apply authMiddleware to routes that require authentication
router.get('/', authMiddleware, flashcardController.getAllFlashcards);
router.post('/', authMiddleware, flashcardController.addFlashcard);
router.get('/deck/:deck_id', authMiddleware, flashcardController.getFlashcardsByDeck);
router.put('/:id', authMiddleware, flashcardController.updateFlashcard);
router.post('/decks', authMiddleware, flashcardController.addDeck);
router.get('/decks', authMiddleware, flashcardController.getAllDecks);
router.delete('/:id', authMiddleware, flashcardController.deleteFlashcard);

// New route for hiding/unhiding flashcards
router.post('/:id/hide', authMiddleware, flashcardController.hideFlashcard);

module.exports = router;