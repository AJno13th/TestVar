const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

router.get('/', flashcardController.getAllFlashcards);
router.post('/', flashcardController.addFlashcard);
router.get('/deck/:deck_id', flashcardController.getFlashcardsByDeck);
router.post('/decks', flashcardController.addDeck);
router.get('/decks', flashcardController.getAllDecks);

module.exports = router;