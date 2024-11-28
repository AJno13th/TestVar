const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

// Route to get all flashcards
router.get('/', flashcardController.getAllFlashcards);

// Route to add a new flashcard
router.post('/', flashcardController.addFlashcard);

// Route to update flashcard visibility
router.patch('/:id', flashcardController.updateFlashcard);

// Route to delete a flashcard
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;