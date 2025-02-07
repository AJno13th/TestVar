const db = require('/Users/ossai/TestVar/database/initDB.js'); // Use a relative path for the database

module.exports = {
    // Fetches the daily deck limit from the settings table
    getLimit: (req, res) => {
        db.get('SELECT value FROM settings WHERE key = ?', ['daily_deck_limit'], (err, row) => {
            if (err) return res.status(500).json({ error: err.message }); // Handles database errors
            res.json({ limit: row ? row.value : 20 }); // Returns stored limit or default value (20)
        });
    },

    // Updates the daily deck limit in the settings table
    updateLimit: (req, res) => {
        const { limit } = req.body;

        // Validate that limit is provided and is a number
        if (!limit || isNaN(limit)) {
            return res.status(400).json({ error: 'A valid limit is required.' });
        }

        // Inserts or updates the daily_deck_limit in settings
        db.run(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            ['daily_deck_limit', limit],
            (err) => {
                if (err) return res.status(500).json({ error: err.message }); // Handles database errors
                res.json({ message: 'Daily deck limit updated successfully.', limit }); // Confirmation response
            }
        );
    },

    // Retrieves all users with their ID, username, email, and role
    getAllUsers: (req, res) => {
        db.all('SELECT id, username, email, role FROM users', (err, rows) => {
            if (err) return res.status(500).json({ error: err.message }); // Handles database errors
            res.status(200).json(rows); // Returns all users
        });
    },

    // Updates a user's role in the users table
    updateUserRole: (req, res) => {
        const { userId } = req.params; // Extracts user ID from request parameters
        const { role } = req.body; // Extracts role from request body

        // Validates that role is either 'admin' or 'user'
        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'A valid role (admin or user) is required.' });
        }

        // Updates the user's role in the database
        db.run(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId],
            (err) => {
                if (err) return res.status(500).json({ error: err.message }); // Handles database errors
                res.json({ message: 'User role updated successfully.', userId, role }); // Confirmation response
            }
        );
    },

    // Retrieves system statistics including total users, decks, and flashcards
    getSystemStats: (req, res) => {
        db.get('SELECT COUNT(*) as totalUsers FROM users', (err, userRow) => {
            if (err) return res.status(500).json({ error: err.message }); // Handles database errors

            db.get('SELECT COUNT(*) as totalDecks FROM decks', (err, deckRow) => {
                if (err) return res.status(500).json({ error: err.message }); // Handles database errors

                db.get('SELECT COUNT(*) as totalFlashcards FROM flashcards', (err, flashcardRow) => {
                    if (err) return res.status(500).json({ error: err.message }); // Handles database errors

                    // Returns the collected statistics
                    res.status(200).json({
                        totalUsers: userRow.totalUsers,
                        totalDecks: deckRow.totalDecks,
                        totalFlashcards: flashcardRow.totalFlashcards,
                    });
                });
            });
        });
    },
};