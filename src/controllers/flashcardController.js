const flashcardModel = require('../models/flashcardModel');

module.exports = {
    getAllFlashcards: (req, res) => {
        const userId = req.userId; // Retrieved from middleware
        flashcardModel.getAllFlashcards(userId, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
    addFlashcard: (req, res) => {
        const { title, content, deck_id } = req.body;
        const userId = req.userId; // Retrieved from middleware
        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }
        console.log('Received payload:', req.body);
        flashcardModel.addFlashcard(title, content, deck_id, userId, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },
    getFlashcardsByDeck: (req, res) => {
        const { deck_id } = req.params;
        const userId = req.userId; // Retrieved from middleware
        flashcardModel.getFlashcardsByDeck(deck_id, userId, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
    addDeck: (req, res) => {
        const { name } = req.body;
        const userId = req.userId; // Retrieved from middleware
        if (!name) {
            return res.status(400).send('Deck name is required.');
        }
        flashcardModel.addDeck(name, userId, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },
    getAllDecks: (req, res) => {
        const userId = req.userId; // Retrieved from middleware
        flashcardModel.getAllDecks(userId, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
};