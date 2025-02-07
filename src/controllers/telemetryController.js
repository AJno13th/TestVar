const db = require('/Users/ossai/TestVar/database/initDB.js'); // ✅ Fixed relative path

module.exports = {
    // Logs telemetry data for user interactions with a deck
    logTelemetry: (req, res) => {
        const { deckId, score, timeTaken } = req.body;
        const user_id = req.user ? req.user.id : null;

        console.log('Received Telemetry Log Request:', { user_id, deckId, score, timeTaken });

        if (!deckId || !score || !timeTaken || !user_id) {
            console.error('Telemetry logging failed: Missing required fields.');
            return res.status(400).json({ error: 'deckId, score, timeTaken, and user_id are required.' });
        }

        // Validate that deckId exists before inserting telemetry data
        db.get('SELECT id FROM decks WHERE id = ?', [deckId], (err, row) => {
            if (!row) {
                console.error('Deck ID does not exist. Telemetry logging aborted.');
                return res.status(400).json({ error: 'Invalid deck ID.' });
            }

            db.run(
                'INSERT INTO telemetry (user_id, deck_id, score, time_taken) VALUES (?, ?, ?, ?)',
                [user_id, deckId, score, timeTaken],
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting telemetry data:', insertErr);
                        return res.status(500).json({ error: insertErr.message });
                    }
                    res.json({ message: 'Telemetry logged successfully.' });
                }
            );
        });
    },

    // Retrieves telemetry data for a specific deck
    getTelemetryForDeck: (req, res) => {
        const { deckId } = req.params;
        const user_id = req.user ? req.user.id : null;

        if (!user_id) return res.status(401).json({ error: "Unauthorized access." });

        db.all(
            'SELECT * FROM telemetry WHERE user_id = ? AND deck_id = ?',
            [user_id, deckId],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json(rows);
            }
        );
    },

    // Retrieves all telemetry data for a specific user
    getTelemetryForUser: (req, res) => {
        const user_id = req.user ? req.user.id : null;

        if (!user_id) return res.status(401).json({ error: "Unauthorized access." });

        db.all(
            'SELECT * FROM telemetry WHERE user_id = ? ORDER BY timestamp DESC',
            [user_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json(rows);
            }
        );
    },

    // Deletes a specific telemetry entry by its row ID
    deleteTelemetry: (req, res) => {
        const { telemetryId } = req.params;
        const user_id = req.user ? req.user.id : null;

        if (!user_id) return res.status(401).json({ error: "Unauthorized access." });

        db.run(
            'DELETE FROM telemetry WHERE rowid = ? AND user_id = ?',
            [telemetryId, user_id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Telemetry deleted successfully.' });
            }
        );
    },
};
