const flashcardModel = require('../models/flashcardModel');

module.exports = {
    getAllFlashcards: (req, res) => {
        flashcardModel.getAllFlashcards((err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
    addFlashcard: (req, res) => {
        const { title, content, deck_id, user_id } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }
        console.log('Received payload:', req.body);
        flashcardModel.addFlashcard(title, content, deck_id, user_id, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },
    getFlashcardsByDeck: (req, res) => {
        const { deck_id } = req.params;
        flashcardModel.getFlashcardsByDeck(deck_id, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
    addDeck: (req, res) => {
        const { name, user_id } = req.body;
        flashcardModel.addDeck(name, user_id, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },
    getAllDecks: (req, res) => {
        const { user_id } = req.query;
        flashcardModel.getAllDecks(user_id, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },
};