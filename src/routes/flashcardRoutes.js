const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const authenticateToken = require('../utils/authenticateToken'); // Adjust the path based on location

// Routes for managing flashcards
router.get('/', authenticateToken, flashcardController.getAllFlashcards); // Fetch all flashcards for the logged-in user
router.post('/', authenticateToken, flashcardController.addFlashcard); // Add a new flashcard for the logged-in user

// Routes for managing flashcards by deck
router.get('/deck/:deck_id', authenticateToken, flashcardController.getFlashcardsByDeck); // Fetch flashcards by deck for the logged-in user

// Routes for managing decks
router.post('/decks', authenticateToken, flashcardController.addDeck); // Add a new deck for the logged-in user
router.get('/decks', authenticateToken, flashcardController.getAllDecks); // Fetch all decks for the logged-in user

module.exports = router;