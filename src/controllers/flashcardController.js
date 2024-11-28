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
        const { title, content } = req.body;
        flashcardModel.addFlashcard(title, content, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },

    updateFlashcard: (req, res) => {
        const { hidden } = req.body;
        const { id } = req.params;
        flashcardModel.updateFlashcard(id, hidden, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(200).send('Flashcard updated');
            }
        });
    },

    deleteFlashcard: (req, res) => {
        const { id } = req.params;
        flashcardModel.deleteFlashcard(id, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(200).send('Flashcard deleted');
            }
        });
    },
};