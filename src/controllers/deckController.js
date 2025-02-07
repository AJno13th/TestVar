const db = require('/Users/ossai/TestVar/database/initDB.js'); // Updated to use a relative path

module.exports = {
    // Retrieves all decks belonging to the authenticated user
    getAllDecks: (req, res) => {
        const { id: user_id } = req.user;

        const query = `SELECT * FROM decks WHERE user_id = ?`;
        db.all(query, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message }); // Handles database errors
            }
            res.status(200).json(rows); // Returns all decks for the user
        });
    },

    // Adds a new deck for the authenticated user
    addDeck: (req, res) => {
        const { name } = req.body;
        const { id: user_id } = req.user;

        if (!name) {
            return res.status(400).json({ error: 'Deck name is required.' }); // Validates deck name
        }

        const query = `INSERT INTO decks (name, user_id) VALUES (?, ?)`;

        db.run(query, [name, user_id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message }); // Handles database errors
            }
            res.status(201).json({ id: this.lastID }); // Returns the newly created deck ID
        });
    },

    // Allows a user to rate a deck
    rateDeck: (req, res) => {
        const { deckId } = req.params;
        const { rating } = req.body;
        const { id: user_id } = req.user;
    
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Invalid rating value. Must be between 1 and 5.' });
        }
    
        db.run(
            'INSERT OR REPLACE INTO ratings VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [deckId, user_id, rating],
            (err) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                console.log(`Deck ${deckId} rated successfully by user ${user_id}`);
                res.json({ message: 'Deck rated successfully.', deckId, rating });
            }
        );
    }
};
