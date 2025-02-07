const flashcardModel = require('../models/flashcardModel');
const db = require('/Users/ossai/TestVar/database/initDB.js');

module.exports = {
    // Retrieves all flashcards for the authenticated user
    getAllFlashcards: (req, res) => {
        const { id: user_id } = req.user;
        flashcardModel.getAllFlashcards(user_id, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },

    // Adds a new flashcard to a specific deck
    addFlashcard: (req, res) => {
        const { title, content, deck_id } = req.body;
        const { id: user_id } = req.user;

        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }

        flashcardModel.addFlashcard(title, content, deck_id, user_id, (err, id) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).json({ id });
            }
        });
    },

    // Retrieves all flashcards for a given deck
    getFlashcardsByDeck: (req, res) => {
        const { deck_id } = req.params;
        const { id: user_id } = req.user;

        flashcardModel.getFlashcardsByDeck(deck_id, user_id, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(rows);
            }
        });
    },

    // Updates a specific flashcard's title and content
    updateFlashcard: (req, res) => {
        const { id: user_id } = req.user;
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required.' });
        }

        flashcardModel.updateFlashcard(id, title, content, user_id, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Flashcard updated successfully.' });
        });
    },

    // Deletes a specific flashcard
    deleteFlashcard: (req, res) => {
        const { id } = req.params;
        const { id: user_id } = req.user;

        flashcardModel.deleteFlashcard(id, user_id, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Flashcard deleted successfully.' });
        });
    },

    // Adds a new deck for the authenticated user
    addDeck: (req, res) => {
        const { name } = req.body;
        const { id: user_id } = req.user;

        if (!name) {
            return res.status(400).json({ error: 'Deck name is required.' });
        }

        const query = `INSERT INTO decks (name, user_id) VALUES (?, ?)`;
        db.run(query, [name, user_id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name });
        });
    },

    // Retrieves all decks belonging to the authenticated user
    getAllDecks: (req, res) => {
        const { id: user_id } = req.user;

        const query = `SELECT * FROM decks WHERE user_id = ?`;
        db.all(query, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        });
    },

    // Toggles the visibility of a flashcard for the user
    hideFlashcard: (req, res) => {
        const { id: card_id } = req.params;
        const { id: user_id } = req.user;

        db.get('SELECT * FROM user_hidden_cards WHERE user_id = ? AND card_id = ?', [user_id, card_id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                db.run('DELETE FROM user_hidden_cards WHERE user_id = ? AND card_id = ?', [user_id, card_id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    // Fetch updated flashcards after unhiding
                    flashcardModel.getAllFlashcards(user_id, (err, rows) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Card unhidden.', flashcards: rows });
                    });
                });
            } else {
                db.run('INSERT INTO user_hidden_cards (user_id, card_id) VALUES (?, ?)', [user_id, card_id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    // Fetch updated flashcards after hiding
                    flashcardModel.getAllFlashcards(user_id, (err, rows) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Card hidden.', flashcards: rows });
                    });
                });
            }
        });
    },
};
